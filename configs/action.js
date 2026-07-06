"use server";
import { and, desc, eq, inArray, or, ilike } from 'drizzle-orm';
import { db } from './db';
import { Chapters, CourseList } from './schema';
import redis from '../lib/redis';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';

//initialized sdk client that communicates with google gemini in JSON schema
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

//parses raw JS numbers into 32 bit float and wrap them in binary buffer -> searching is fast
function float32Buffer(arr) {
    return Buffer.from(new Float32Array(arr).buffer);
}

// Helper: Create the permanent Global Search Index
// Uses a version flag in Redis to detect when the index schema changes (e.g. DIM migration)
const GLOBAL_INDEX_VERSION = 'v2_3072';
async function initializeGlobalSearchIndex() {
    try {
        //if the version doesnot matches the current version delete the old incompatible version 
        // and create a new entry in the index -> deltes the entire search index first and then the outdated json in redis cloud
        const currentVersion = await redis.get('idx:global_search:version');
        if (currentVersion === GLOBAL_INDEX_VERSION) return; // Index is up-to-date

        // Drop old index if it exists
        //it doesnot include the optional DD(delete document) field which prevents it from deleting json documents in redis cloud
        //and prevent from any errors due to async calls
        try { await redis.call('FT.DROPINDEX', 'idx:global_search'); } catch (_) { /* ignore if not found */ }

        // Delete old 768-dim searchable_course documents since they're incompatible
        const oldKeys = await redis.keys('searchable_course:*');
        if (oldKeys.length > 0) await redis.del(...oldKeys);

        // Creates an index named 'idx:courses' looking at keys starting with 'course_cache:' -> runs a background thread
        //that constantly montiors and looks for prefix course_cache and if it finds it, it creates a entry of it in search index
        await redis.call(
            'FT.CREATE', 'idx:global_search', 'ON', 'JSON', 'PREFIX', '1', 'searchable_course:',
            'SCHEMA',
            '$.embedding', 'AS', 'embedding', 'VECTOR', 'FLAT', '6',
            'TYPE', 'FLOAT32', 'DIM', '3072', 'DISTANCE_METRIC', 'COSINE'
        );
        await redis.set('idx:global_search:version', GLOBAL_INDEX_VERSION);
    } catch (error) {
        if (!error.message.includes('Index already exists')) {
            console.error("Redis Index Error:", error);
        }
    }
}

//cache invalidation
export async function saveCourseToDb(courseData) {
    try {
        // By default the result stores the row count but with .returning() it returns the complete row
        // (the complete object which is created)
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

        //cache invalidation - since new dashboard has to be rendered we delete the one stored in the redis cache
        const cacheKey = `user_courses_dashboard:${courseData.createdBy}`;
        await redis.del(cacheKey);

        //the new created course have to be available in the search index for performing semantic searching
        await initializeGlobalSearchIndex();

        // We create a string on the basis of which we perform semantic search.
        // Includes the category, title, level and the courseOutput as parameters.
        const semanticText = `Category: ${courseData.category}. Title: ${courseData.name}. Level: ${courseData.level}. CourseOutput: ${courseData.courseOutput}`;

        // The text is converted to vector embeddings using the AI model.
        // These vector embeddings contain the actual meaning of the above string represented as float-32 vectors.
        const embedResponse = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: semanticText,
        });

        const vectorArray = embedResponse.embeddings[0].values;

        // In the initialization of the search index we configured it to search for JSON objects with 'searchable_course'
        // as prefix. So if we don't start the key of the JSON object with it then the search index will be empty.
        const searchDocKey = `searchable_course:${courseData.courseId}`;
        //in the payload we have sent the courseId, so after fetching the result we need to query to database to get full courses
        const searchDocument = {
            courseId: courseData.courseId,
            embedding: Array.from(vectorArray), // Store raw float array for Redis JSON vector index
        }
        await redis.call('JSON.SET', searchDocKey, '$', JSON.stringify(searchDocument));
        return result;
    } catch (error) {
        console.error("Database insertion failed:", error);
        throw new Error(error.message || "Failed to save course to database");
    }
}

export async function getCourseById(courseId) {
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
                courseOutput: courseData.courseOutput,
                name: courseData.courseOutput?.["Course Name"]
            }).where(eq(CourseList.courseId, courseData.courseId)).returning();

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

        //returns the created new object
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
        //cache hit
        if (cachedDashboard) {
            return JSON.parse(cachedDashboard);
        }
        //cache miss
        const result = await db
            .select()
            .from(CourseList)
            .where(eq(CourseList.createdBy, userEmail))
            .orderBy(desc(CourseList.id));

        //cache the result incase of cache miss
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
        //delete chapters from Chapters where courseId matches
        await db.delete(Chapters)
            .where(eq(Chapters.courseId, courseId));

        //delete course from CourseList
        const result = await db.delete(CourseList)
            .where(eq(CourseList.courseId, courseId))
            .returning();

        //cache invalidation since the dashboard has changed
        if (userEmail) {
            const cacheKey = `user_courses_dashboard:${userEmail}`;
            await redis.del(cacheKey);
        }

        // Also remove the vector search document for this course
        try { await redis.call('JSON.DEL', `searchable_course:${courseId}`); } catch (_) { /* ignore */ }

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
            .orderBy(desc(CourseList.id))
            .limit(9)
            .offset(pageIndex * 9);

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
            model: 'gemini-embedding-001',
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


        if (searchResult && typeof searchResult[0] !== 'undefined') {
            const totalFound = searchResult[0];
            if (totalFound > 0) {
                const matchingCourseIds = [];
                for (let i = 2; i < searchResult.length; i += 2) {
                    const fields = searchResult[i];
                    const distance = parseFloat(fields[1]);
                    const courseId = JSON.parse(fields[3]);

                    if (distance < 0.4) {
                        matchingCourseIds.push(courseId);
                    }
                }

                if (matchingCourseIds.length > 0) {
                    const finalCourses = await db.select()
                        .from(CourseList)
                        .where(inArray(CourseList.courseId, matchingCourseIds));
                    return finalCourses;
                }
            }
        }

        // Fallback: SQL text search when vector search finds no matches
        console.log("Vector search returned no matches. Falling back to SQL text search for:", userQuery);
        const textResults = await db.select()
            .from(CourseList)
            .where(
                or(
                    ilike(CourseList.name, `%${userQuery}%`),
                    ilike(CourseList.category, `%${userQuery}%`)
                )
            )
            .orderBy(desc(CourseList.id))
            .limit(9);
        return textResults;

    } catch (error) {
        console.error("Semantic Search Error:", error);
        try {
            const fallbackResults = await db.select()
                .from(CourseList)
                .where(
                    or(
                        ilike(CourseList.name, `%${userQuery}%`),
                        ilike(CourseList.category, `%${userQuery}%`)
                    )
                )
                .orderBy(desc(CourseList.id))
                .limit(9);
            return fallbackResults;
        } catch (dbError) {
            console.error("SQL Fallback also failed:", dbError);
            throw new Error("Failed to search courses.");
        }
    }
}


export async function getQuizData(courseId) {
    try {
        // Only select the fields needed for the quiz — no full content, no videoId
        const chapters = await db
            .select({
                chapterId: Chapters.chapterId,
                content: Chapters.content,
                completed: Chapters.completed,
            })
            .from(Chapters)
            .where(eq(Chapters.courseId, courseId));

        const totalChapters = chapters.length;
        const completedChapters = chapters.filter(c => c.completed).length;
        const isFullyCompleted = totalChapters > 0 && completedChapters === totalChapters;

        // Extract only MCQs from each chapter's content, tagging each with the chapter title
        const allMcqs = [];
        for (const chapter of chapters) {
            const mcqs = chapter.content?.mcqs;
            if (Array.isArray(mcqs)) {
                for (const mcq of mcqs) {
                    allMcqs.push({
                        chapterTitle: chapter.content?.title || `Chapter ${chapter.chapterId}`,
                        question: mcq.question,
                        options: mcq.options,
                        correctAnswer: mcq.correctAnswer,
                    });
                }
            }
        }

        return {
            isFullyCompleted,
            totalChapters,
            completedChapters,
            mcqs: allMcqs,
        };
    } catch (error) {
        console.error("Database Error: Failed to fetch quiz data", error);
        throw new Error("Failed to load quiz data");
    }
}