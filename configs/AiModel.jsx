"use server"; 

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const config = {
  thinkingConfig: {
    thinkingLevel: 'HIGH', 
  },
  responseMimeType: "application/json", 
};

export async function generateCourseLayout(finalPrompt) {
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

    // Failsafe: Ensure we actually got text back from the model
    if (!response.text) {
        throw new Error("The AI returned an empty response.");
    }

    const cleanJsonText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
    
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