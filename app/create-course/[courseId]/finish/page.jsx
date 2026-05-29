"use client"
import { getChaptersByCourseId, getCourseById } from '@/configs/action';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import CourseBasicInfo from '../_components/CourseBasicInfo';
import { HiOutlineCheckCircle } from "react-icons/hi2";

function finishPage({params}) {

    const {user} = useUser();
    const unwrappedParams = use(params);
    const courseId = unwrappedParams.courseId;
    const [courseInfo, setCourseInfo] = useState(null);
    const [chapterData, setChapterData] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    
    
    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId) return; 
            setLoading(true);
            try {
                // Promise.all fetches both database queries simultaneously!
                const [courseResult, chaptersResult] = await Promise.all([
                    getCourseById(courseId),
                    getChaptersByCourseId(courseId)
                ]);

                console.log("Fetched Course Info:", courseResult);
                console.log("Fetched Chapters:", chaptersResult);

                setCourseInfo(courseResult);
                setChapterData(chaptersResult); 
                
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchCourseData();
    }, [courseId]);

  return (
    <div className='px-6 md:px-20 lg:px-44 my-7 min-h-screen'>
        {courseInfo ? (
            <>
                <div className='text-center mb-6 animate-fade-in-up'>
                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4'>
                        <HiOutlineCheckCircle className='text-3xl text-emerald-400' />
                    </div>
                    <h2 className='font-bold text-2xl gradient-text'>
                        Congrats! Your course is ready 🎉
                    </h2>
                    <p className='text-slate-400 mt-2 text-sm'>Your AI-generated course has been published and is ready to share</p>
                </div>
                <CourseBasicInfo courseInfo={courseInfo} setCourseInfo={setCourseInfo}/>
                <div className="flex justify-center mt-10">
                    <button 
                        onClick={() => router.push('/course/'+courseInfo?.courseId+'/start')}
                        className='bg-[#1DB954] text-black font-bold border-0 hover:bg-[#1ed760] shadow-lg shadow-[#1DB954]/20 py-4 px-10 rounded-full text-lg transition-all hover:scale-105'
                    >
                        ▶ Start Learning
                    </button>
                </div>
            </>
        ) : (
            <div className='flex items-center justify-center h-64'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin' />
                    <p className='text-slate-400 font-medium'>Loading your course...</p>
                </div>
            </div>
        )}
    </div>
  )
}

export default finishPage