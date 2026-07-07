"use server";

import redis from '@/lib/redis';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';


//intialize SDK(software development kit) client that communicates with the google gemini in JSON schema
//instead making raw manual http fetch req, we use SDK which provides a set of read to use JS functions to make interaction with ai simpler
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const config = {
  thinkingConfig: {
    thinkingLevel: 'HIGH',
  },
  responseMimeType: "application/json",
};

//converts normal JS array -> first downcast to 32bit float values and then wrap it aroud binary buffer
function float32Buffer(arr) {
  return Buffer.from(new Float32Array(arr).buffer);
}

// Uses a version flag in Redis to detect when the index schema changes
const CACHE_INDEX_VERSION = 'v2_3072';
async function initializeVectorIndex() {
  try {
    //if the version doesnot matches the current version delete the old incompatible version 
    // and create a new entry in the index -> deltes the entire search index first and then the outdated json in redis cloud
    const currentVersion = await redis.get('idx:courses:version');
    if (currentVersion === CACHE_INDEX_VERSION) return; // Index is up-to-date

    // Drop old index if it exists
    //since we have not passed the optional 'DD flag'(delete document) so the json object in the redis are still there
    try { await redis.call('FT.DROPINDEX', 'idx:courses'); } catch (_) { /* ignore if not found */ }

    // Delete old 768-dim cached course documents since they're incompatible because their $embedding is outdated
    const oldKeys = await redis.keys('course_cache:*'); //every object whose key starts with course_cache and then wildcard matching is selected
    if (oldKeys.length > 0) await redis.del(...oldKeys);

    //Initializes and creates an index named 'idx:courses' looking at keys starting with 'course_cache:' in the redis db 
    // -> runs a background thread that constantly montiors and looks for prefix course_cache and if it finds it, 
    // then it creates a entry of it in search index and stires vector embedding
    await redis.call(
      'FT.CREATE', 'idx:courses', 'ON', 'JSON', 'PREFIX', '1', 'course_cache:',
      'SCHEMA',
      '$.embedding', 'AS', 'embedding', 'VECTOR', 'FLAT', '6',
      'TYPE', 'FLOAT32', 'DIM', '3072', 'DISTANCE_METRIC', 'COSINE'
    );
    await redis.set('idx:courses:version', CACHE_INDEX_VERSION);
  } catch (error) {
    if (!error.message.includes('Index already exists')) {
      console.error("Redis Index Error:", error);
    }
  }
}

export async function generateCourseLayout(finalPrompt, userInputPrompt) {

  //find the current user
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized: You must be logged in to generate a course.");

  /*
  ==============================================================================
  Achieved Rate Limiting
  ==============================================================================
  */

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const limitKey = `rate_limit:generate:${userEmail}`;
  const maxRequests = 5;
  const currentReqCnt = await redis.incr(limitKey);

  if (currentReqCnt == 1) {
    await redis.expire(limitKey, 60);
  }
  if (currentReqCnt > maxRequests) throw new Error("Rate limit exceeded. Please wait a minute before generating more courses.");

  /*
  ==============================================================================
  Semantic Caching
  ==============================================================================
  */

  await initializeVectorIndex();

  {/* creating vector embeddings of the user's request */ }
  const embedResponse = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: userInputPrompt,
  })
  //relatively large and unstructured and string parsing is slow
  const vectorArray = embedResponse.embeddings[0].values;

  const vectorBuffer = float32Buffer(vectorArray);

  //perform KNN
  try {
    // Search for the 1 closest vector. Return its score (distance) and the JSON payload.
    const searchResult = await redis.call(
      'FT.SEARCH', 'idx:courses',
      '*=>[KNN 1 @embedding $vec AS distance]',
      'PARAMS', '2', 'vec', vectorBuffer,
      'RETURN', '2', 'distance', '$.payload',
      'DIALECT', '2'
    );
    if (searchResult[0] > 0) {
      const distance = parseFloat(searchResult[2][1]);
      const cachedPayload = JSON.parse(searchResult[2][3]);

      if (distance < 0.15) {
        //cache hit
        return cachedPayload;
      }
    }
  } catch (error) {
    console.log("Vector search failed or index empty, proceeding to AI:", error.message);
  }

  //cache miss - fetch the course layout from the api (expensive operation)

  {/* fake history conversation that you are feeding to gemeni-ai -> it acts as a strict blueprint */ }
  const historyTemplate = [
    {
      role: "user",
      parts: [{ text: "generate a course tutorial on following detail with field as Course Name, Description, Along with Chapter Name,about ,Duration:" }],
    },
    {
      role: "model",
      parts: [
        {
          text: JSON.stringify({
            courseName: "Course Title Example",
            description: "Detailed description of the course content.",
            duration: "Total Duration Example",
            chapters: [
              {
                chapterName: "Chapter 1: Getting Started",
                about: "What this chapter covers and learning objectives."
              },
              {
                chapterName: "Chapter 2: Core Concepts",
                about: "Deep dive into the primary topic mechanisms."
              }
            ]
          })
        }
      ],
    },
  ];

  try {
    {/* setting up a new chat-session object with gemini -> just the rules */ }
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: config, //defined above
      history: historyTemplate,
    });

    {/* sending the request */ }
    const response = await chat.sendMessage({
      message: finalPrompt,
    });

    if (!response.text) throw new Error("The AI returned an empty response.");

    {/* regex to trim the starting and ending backticks */ }
    const cleanJsonText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const finalData = JSON.parse(cleanJsonText);

    const uniqueId = uuidv4();
    const cacheKey = `course_cache:${uniqueId}`;
    const redisDocument = {
      embedding: vectorArray, // we have passed the standard JS array because the json.stirngify can't properly format binary buffers into json string
      payload: finalData      // The actual course JSON -> we have kept it in payload because we want to return the final course structure if knn succeeds
    };

    await redis.call('JSON.SET', cacheKey, '$', JSON.stringify(redisDocument));
    await redis.expire(cacheKey, 604800);


    return finalData;

  } catch (error) {
    console.error("=== REAL BACKEND ERROR ===", error);
    throw new Error(error.message || "Failed to generate course schema");
  }
}


export async function generateChapterContentAI(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: config, // Re-use the JSON and Thinking config
    });

    if (!response.text) {
      throw new Error("The AI returned an empty response.");
    }

    //Clean up any markdown formatting just in case the AI ignores the schema
    const cleanJsonText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJsonText);

  } catch (error) {
    console.error("=== AI CHAPTER GENERATION ERROR ===", error);
    throw new Error(error.message || "Failed to generate chapter content");
  }
}