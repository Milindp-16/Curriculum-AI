"use server"; 

import redis from '@/lib/redis';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const config = {
  thinkingConfig: {
    thinkingLevel: 'HIGH', 
  },
  responseMimeType: "application/json", 
};

//converts normal JS array into binary buffer array
function float32Buffer(arr){
  return Buffer.from(new Float32Array(arr).buffer);
}

async function initializeVectorIndex() {
  try {
    // Creates an index named 'idx:courses' looking at keys starting with 'course_cache:'
    await redis.call(
      'FT.CREATE', 'idx:courses', 'ON', 'JSON', 'PREFIX', '1', 'course_cache:',
      'SCHEMA', 
      '$.embedding', 'AS', 'embedding', 'VECTOR', 'FLAT', '6', 
      'TYPE', 'FLOAT32', 'DIM', '768', 'DISTANCE_METRIC', 'COSINE'
    );
  } catch (error) {
    if (!error.message.includes('Index already exists')) {
      console.error("Redis Index Error:", error);
    }
  }
}

export async function generateCourseLayout(finalPrompt,userInputPrompt) {

  const user = await currentUser();
  if(!user) throw new Error("Unauthorized: You must be logged in to generate a course.");


  /*
  ==============================================================================
  Rate Limiting
  ==============================================================================
  */

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const limitKey = `rate_limit:generate:${userEmail}`;
  const maxRequests = 5;
  const currentReqCnt = await redis.incr(limitKey);

  if(currentReqCnt == 1){
    await redis.expire(limitKey,60);
  }
  if(currentReqCnt > maxRequests)throw new Error("Rate limit exceeded. Please wait a minute before generating more courses.");


  /*
  ==============================================================================
  Semantic Caching
  ==============================================================================
  */

  await initializeVectorIndex();

  const embedResponse = await ai.models.embedContent({
    model: 'embedding-001',
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
    if(searchResult[0] > 0){
      const distance = parseFloat(searchResult[2][1]);
      const cachedPayload = JSON.parse(searchResult[2][3]);

      if(distance<0.15){
        return cachedPayload;
      }
    }
  } catch (error) {
    console.log("Vector search failed or index empty, proceeding to AI:", error.message);
  }


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
    // Moved chat creation inside the try block for better error catching
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: config,
      history: historyTemplate, 
    });

    const response = await chat.sendMessage({
      message: finalPrompt,
    });

    if (!response.text)throw new Error("The AI returned an empty response.");

    const cleanJsonText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const finalData = JSON.parse(cleanJsonText);

    const uniqueId = uuidv4();
    const cacheKey = `course_cache:${uniqueId}`;
    const redisDocument = {
      embedding: vectorArray, // The math representation
      payload: finalData      // The actual course JSON
    };

    await redis.call('JSON.SET', cacheKey, '$', JSON.stringify(redisDocument));
    await redis.expire(cacheKey, 604800);


    return finalData;
    
  } catch (error) {
    // LOG THE ACTUAL ERROR TO YOUR SERVER TERMINAL
    console.error("=== REAL BACKEND ERROR ===", error);
    
    // Pass the real error message to the frontend so you know what went wrong
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

    // Failsafe: Clean up any markdown formatting just in case the AI ignores the schema
    const cleanJsonText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJsonText);

  } catch (error) {
    console.error("=== AI CHAPTER GENERATION ERROR ===", error);
    throw new Error(error.message || "Failed to generate chapter content");
  }
}