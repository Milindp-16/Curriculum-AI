"use client";
import { getCourseById, publishCourse, saveChapterContentToDb } from '@/configs/action';
import React, { useEffect, useState, use } from 'react'
import CourseBasicInfo from './_components/CourseBasicInfo';
import CourseDetails from './_components/CourseDetails';
import ChapterList from './_components/ChapterList';
import { Button } from '@/components/ui/button';
import { generateChapterContentAI } from '@/configs/AiModel';
import LoadingDialog from '../_components/LoadingDialog';
import service from '@/configs/service';
import { useRouter } from 'next/navigation';


const CourseLayout = ({ params }) => {

    const router = useRouter();

    //extracted the courseId from the params
    const unwrappedParams = use(params);
    const courseId = unwrappedParams.courseId;

    const [courseInfo, setCourseInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);


    {/* whenever the courseId changes this gets triggered and if the courseId is valid 
        then it fetched the course from the db 
    */}
    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                //fetcheds data from the backend and return the courseInfo
                const result = await getCourseById(courseId);
                console.log("Fetched Data:", result);
                setCourseInfo(result);
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [courseId]);


    const GenerateChapterContent = async () => {
        const chapters = courseInfo?.courseOutput?.Chapters;
        if (!chapters || chapters.length === 0) return;
        setIsGenerating(true);

        try {
            let allSuccess = true;
            for (let index = 0; index < chapters.length; index++) {

                const chapter = chapters[index];
                const courseTopic = courseInfo?.name || courseInfo?.courseOutput?.Topic;
                const chapterName = chapter?.["Chapter Name"];

                const PROMPT = `
                    You are an expert educator creating content for a course.
                    Generate a detailed explanation for the following topic and chapter.
                    Also generate 3 multiple-choice quiz questions (MCQs) to test the learner's understanding of this chapter.

                    Course Topic: ${courseInfo?.name || courseInfo?.courseOutput?.Topic}
                    Chapter Name: ${chapter?.["Chapter Name"]}

                    Return the response STRICTLY as a raw JSON object matching this exact schema. Do not include markdown tags like \`\`\`json, and do not include any conversational text before or after the JSON.

                    {
                    "title": "String - The title of the chapter",
                    "description": "String - A highly detailed, multi-paragraph explanation of the concepts",
                    "codeExample": "String - A relevant HTML code example. Strictly Leave as an empty string if no code is needed.",
                    "mcqs": [
                        {
                        "question": "String - A clear, well-formed question about the chapter content",
                        "options": ["String - Option A", "String - Option B", "String - Option C", "String - Option D"],
                        "correctAnswer": "String - Must exactly match one of the four options above"
                        }
                    ]
                    }
                    `;

                console.log(`Generating content for chapter: ${chapter?.["Chapter Name"]}...`);

                let chapterSuccess = false;

                // Try generating chapter content with one retry (2 attempts total)
                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        //Get Youtube Video
                        let videoId = '';
                        try {
                            //we are passing the chapter name and the course topic as the query
                            const resp = await service.getVideos(`${courseTopic} ${chapterName}`);
                            videoId = resp[0]?.id?.videoId || '';
                        } catch (ytError) {
                            console.error(`Failed to fetch YouTube video for ${chapterName}`, ytError);
                        }

                        // 1. Call the AI Model -> only give the title,detailed description and code example if present
                        const aiResult = await generateChapterContentAI(PROMPT);


                        const payload = {
                            courseId: courseId,
                            chapterId: index,
                            content: aiResult,
                            videoId: videoId
                        };

                        await saveChapterContentToDb(payload);
                        console.log(`Successfully saved Chapter ${index} to database!`);
                        chapterSuccess = true;
                        break; // Break retry loop on success
                    } catch (err) {
                        console.error(`Attempt ${attempt} failed for chapter ${index}:`, err);
                    }
                }

                if (!chapterSuccess) {
                    allSuccess = false;
                    break; // Stop further processing if all retries fail
                }
            }

            if (allSuccess) {
                //the course has been made completely we have to just present it
                await publishCourse(courseInfo?.courseId);
                //doesnot stores history so we cannot go back by clicking the back button
                router.replace('/create-course/' + courseInfo?.courseId + '/finish');
            } else {
                alert("AI Model is on high demand. Please try again later.");
            }

        } catch (error) {
            console.error("Failed to generate course content:", error);
            alert("AI Model is on high demand. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className='mt-10 px-6 md:px-20 lg:px-44'>

            {/* title-Course Layout */}
            <h2 className='font-bold text-center text-2xl'>
                <span className='gradient-text'>Course Layout</span>
            </h2>
            <LoadingDialog loading={isGenerating} />

            {/* if we have successfully fetched the course then display it */}
            {courseInfo ? (
                <>
                    <CourseBasicInfo courseInfo={courseInfo} setCourseInfo={setCourseInfo} />
                    <CourseDetails courseInfo={courseInfo} />
                    <ChapterList courseInfo={courseInfo} setCourseInfo={setCourseInfo} />
                </>
            ) : (
                /* custom loader */
                <div className='flex items-center justify-center h-64'>
                    <div className='flex flex-col items-center gap-3'>
                        <div className='w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin' />
                        <p className='text-slate-400 font-medium'>Loading your course...</p>
                    </div>
                </div>
            )}

            <Button
                className='my-10 gradient-primary text-white border-0 hover:opacity-90 shadow-lg shadow-violet-500/20 gap-2'
                onClick={GenerateChapterContent}
            >
                ✨ Generate Course Content
            </Button>
        </div>
    )
}

export default CourseLayout