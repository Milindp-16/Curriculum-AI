"use client"
import Header from '@/app/_components/Header';
import ChapterList from '@/app/create-course/[courseId]/_components/ChapterList';
import CourseBasicInfo from '@/app/create-course/[courseId]/_components/CourseBasicInfo';
import CourseDetails from '@/app/create-course/[courseId]/_components/CourseDetails';
import { getCourseById } from '@/configs/action';
import React, { use, useEffect, useState } from 'react'

function Course({ params }) {

    const unwrappedParams = use(params);
    const courseId = unwrappedParams?.courseId;

    const [courseInfo, setCourseInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const GetCourse = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                const res = await getCourseById(courseId);
                // console.log(res);
                setCourseInfo(res);
            } catch (error) {
                console.log('Unable to fetch the course: ', error);
            } finally {
                setLoading(false);
            }
        }

        GetCourse();
    }, [courseId]);


    return (
        <div className='min-h-screen bg-background'>
            {courseInfo ? (
                <>
                    <Header />
                    <div className='px-6 py-8 md:px-20 lg:px-44'>
                        <CourseBasicInfo courseInfo={courseInfo} setCourseInfo={setCourseInfo} edit={false} />
                        <CourseDetails courseInfo={courseInfo} />
                        <ChapterList courseInfo={courseInfo} setCourseInfo={setCourseInfo} edit={false} />
                    </div>
                </>
            ) : (
                /* custom loader */
                <div className='flex items-center justify-center h-screen'>
                    <div className='flex flex-col items-center gap-3'>
                        <div className='w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin' />
                        <p className='text-slate-400 font-medium'>Loading your course...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Course