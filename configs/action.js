"use server"; 
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from './db';
import { Chapters, CourseList } from './schema';
import redis from '../lib/redis';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function float32Buffer(arr) {
    return Buffer.from(new Float32Array(arr).buffer);
}

// Helper: Create the permanent Global Search Index
async function initializeGlobalSearchIndex() {
    try {
        await redis.call(
            'FT.CREATE', 'idx:global_search', 'ON', 'JSON', 'PREFIX', '1', 'searchable_course:',
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

//cache invalidation
export async function saveCourseToDb(courseData) {
    console.log("DATA RECEIVED FROM FRONTEND:", courseData);
    try {
        const result = await db.insert(CourseList).values({
            courseId: courseData.courseId,
            name: courseData.name,
            level: courseData.level,
            category: courseData.category,
            courseOutput: courseData.courseOutput,
            createdBy: courseData.createdBy,
            userName: courseData.userName,
            userProfileImage: courseData.userProfileImage
        }).returning(); 
        
        const cacheKey = `user_courses_dashboard:${courseData.createdBy}`;
        await redis.del(cacheKey);


        await initializeGlobalSearchIndex();
        const semanticText = `Category: ${courseData.category}. Title: ${courseData.name}. Level: ${courseData.level}`;
        const embedResponse = await ai.models.embedContent({
            model: 'embedding-001',
            contents: semanticText,
        });

        const vectorArray = embedResponse.embeddings[0].values;
        const vectorBuffer = float32Buffer(vectorArray);

        const searchDocKey = `searchable_course:${courseData.courseId}`;
        const searchDocument = {
            courseId: courseData.courseId,
            embedding: vectorBuffer,
        }
        await redis.call('JSON.SET', searchDocKey, '$', JSON.stringify(searchDocument));
        return result;
    } catch (error) {
        console.error("Database insertion failed:", error);
        throw new Error(error.message || "Failed to save course to database");
    }
}

export async function getCourseById(courseId){
    try {
        const result = await db
            .select()
            .from(CourseList)
            .where(eq(CourseList.courseId, courseId));

        return result[0]; 
        
    } catch (error) {
        console.error("Database fetch failed:", error);
        throw new Error("Failed to fetch course data");
    }
}

export async function updateCourseInDb(courseData) {
    try {
        const result = await db.update(CourseList)
            .set({
                // 1. Updates your existing JSON column with the new title & description
                courseOutput: courseData.courseOutput, 
                
                // 2. Updates your existing 'name' column to keep it in sync
                name: courseData.courseOutput?.["Course Name"] 
            })
            // 3. Finds the exact row to update using the ID
            .where(eq(CourseList.courseId, courseData.courseId)) 
            .returning(); 
        
        return result;
    } catch (error) {
        console.error("Database update failed:", error);
        throw new Error("Failed to update course in database");
    }
}

export const updateCourseImageInDb = async (courseId, imageUrl) => {
    try {
        const result = await db.update(CourseList)
            .set({ courseBanner: imageUrl })
            .where(eq(CourseList.courseId, courseId))
            .returning();
            
        return result;
    } catch (error) {
        console.error("Database Error: Failed to update course banner", error);
        throw new Error("Failed to save image to database");
    }
}

export const saveChapterContentToDb = async (chapterPayload) => {
    try {
        const formattedPayload = {
            ...chapterPayload,
            chapterId: String(chapterPayload.chapterId),
            videoId: chapterPayload.videoId || '',      
        };

        const result = await db.insert(Chapters)
            .values(formattedPayload)
            .returning();
            
        return result;
    } catch (error) {
        console.error("Database Error: Failed to insert chapter", error);
        throw new Error("Failed to save chapter content");
    }
}

export async function getChaptersByCourseId(courseId) {
    try {
        const result = await db
            .select()
            .from(Chapters)
            .where(eq(Chapters.courseId, courseId));

        return result; // Returns an array of all chapters for this course
        
    } catch (error) {
        console.error("Database fetch failed for chapters:", error);
        throw new Error("Failed to fetch chapter data");
    }
}

export const publishCourse = async (courseId) => {
    try {
        const result = await db.update(CourseList)
            .set({ publish: true }) // Update the publish field
            .where(eq(CourseList.courseId, courseId))
            .returning();
            
        // Tell Next.js to refresh the cache for this course
        // revalidatePath(`/create-course/${courseId}/finish`); 
            
        return result;
    } catch (error) {
        console.error("Database Error: Failed to publish course", error);
        throw new Error("Failed to publish course");
    }
}


//read through caching
export async function getUserCourses(userEmail) {
    const cacheKey = `user_courses_dashboard:${userEmail}`;
    try {
        const cachedDashboard = await redis.get(cacheKey);
        if (cachedDashboard) {
            return JSON.parse(cachedDashboard);
        }
        const result = await db
            .select()
            .from(CourseList)
            .where(eq(CourseList.createdBy, userEmail)) 
            .orderBy(desc(CourseList.id)); 
            
        
        await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
        return result; 
        
    } catch (error) {
        console.error("Database Error: Failed to fetch user courses", error);
        throw new Error("Failed to load dashboard");
    }
}

export const deleteCourse = async (courseId) => {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    try {
        await db.delete(Chapters)
            .where(eq(Chapters.courseId, courseId));

        const result = await db.delete(CourseList)
            .where(eq(CourseList.courseId, courseId))
            .returning();
            
        
        if (userEmail) {
            const cacheKey = `user_courses_dashboard:${userEmail}`;
            await redis.del(cacheKey);
        }
        return result;
    } catch (error) {
        console.error("Database Error: Failed to delete course", error);
        throw new Error("Failed to delete course");
    }
}

export async function getChapterData(courseId, chapterId) {
    try {
        const result = await db
            .select()
            .from(Chapters)
            .where(
                and(
                    eq(Chapters.courseId, courseId),
                    eq(Chapters.chapterId, String(chapterId)) 
                )
            );
        return result[0]; 
    } catch (error) {
        console.error("Database Error: Failed to fetch chapter", error);
        throw new Error("Failed to fetch chapter data");
    }
}

export const markChapterCompleted = async (courseId, chapterId, isCompleted) => {
    try {
        const result = await db.update(Chapters)
            .set({ completed: isCompleted })
            .where(
                and(
                    eq(Chapters.courseId, courseId),
                    eq(Chapters.chapterId, String(chapterId))
                )
            )
            .returning();
            
        return result[0];
    } catch (error) {
        console.error("Database Error: Failed to mark chapter as completed", error);
        throw new Error("Failed to update chapter progress");
    }
}

export const exploreCourses = async (pageIndex) => {
    try {
        const result = await db.select()
            .from(CourseList)
            // It's highly recommended to order by newest first!
            .orderBy(desc(CourseList.id)) 
            .limit(9)
            .offset(pageIndex*9);

        return result; 
        
    } catch (error) {
        console.error("Database Error: Failed to fetch all courses", error);
        throw new Error("Failed to fetch explore courses");
    }
}


export async function searchGlobalCourses(userQuery) {
    try {
        await initializeGlobalSearchIndex();

        const embedResponse = await ai.models.embedContent({
            model: 'embedding-001',
            contents: userQuery,
        });
        
        const vectorArray = embedResponse.embeddings?.[0]?.values || embedResponse.embedding?.values;
        
        if (!vectorArray) {
             console.error("Gemini Response:", embedResponse);
             throw new Error("Gemini API did not return a valid vector array.");
        }
        
        const vectorBuffer = float32Buffer(vectorArray);

        // 2. Perform KNN Vector Search in Redis
        const searchResult = await redis.call(
            'FT.SEARCH', 'idx:global_search', 
            '*=>[KNN 6 @embedding $vec AS distance]', 
            'PARAMS', '2', 'vec', vectorBuffer, 
            'RETURN', '2', 'distance', '$.courseId', 
            'DIALECT', '2'
        );

        
        if (!searchResult || typeof searchResult[0] === 'undefined') {
            console.log("Redis returned an empty or invalid search result.");
            return []; 
        }

        const totalFound = searchResult[0];
        if (totalFound === 0) return []; 

        
        const matchingCourseIds = [];
        for (let i = 2; i < searchResult.length; i += 2) {
            const fields = searchResult[i];
            const distance = parseFloat(fields[1]);
            const courseId = JSON.parse(fields[3]);
            
            if (distance < 0.4) {
                matchingCourseIds.push(courseId);
            }
        }

        if (matchingCourseIds.length === 0) return [];

        const finalCourses = await db.select()
            .from(CourseList)
            .where(inArray(CourseList.courseId, matchingCourseIds));

        return finalCourses;

    } catch (error) {
        console.error("Semantic Search Error:", error);
        throw new Error("Failed to search courses.");
    }
}