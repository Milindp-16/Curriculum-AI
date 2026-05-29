"use server"; 
import { and, desc, eq } from 'drizzle-orm';
import { db } from './db';
import { Chapters, CourseList } from './schema';

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

export async function getUserCourses(userEmail) {
    try {
        const result = await db
            .select()
            .from(CourseList)
            .where(eq(CourseList.createdBy, userEmail)) 
            .orderBy(desc(CourseList.id)); 
            
        return result; 
        
    } catch (error) {
        console.error("Database Error: Failed to fetch user courses", error);
        throw new Error("Failed to load dashboard");
    }
}

export const deleteCourse = async (courseId) => {
    try {
        await db.delete(Chapters)
            .where(eq(Chapters.courseId, courseId));

        const result = await db.delete(CourseList)
            .where(eq(CourseList.courseId, courseId))
            .returning();
            
        // 3. Clear the cache for the dashboard so it fetches fresh data next time
        // revalidatePath("/dashboard"); 
            
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