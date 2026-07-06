"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { HiPuzzle } from "react-icons/hi";
import EditCourseBasicInfo from './EditCourseBasicInfo';
import { updateCourseImageInDb } from '@/configs/action';
import Link from 'next/link';

const CourseBasicInfo = ({ courseInfo, setCourseInfo, edit = true }) => {

    {/* here i am storing the banner image in the cloudinary database and then saving the url given by cloudinary
        into the database */}
    const [selectedFile, setSelectedFile] = useState();
    const [isUploading, setIsUploading] = useState(false);

    const onFileSelected = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        {/* instead of making the user stare at a loader while it sends over the network, this native browser 
            utility creates a temporary, localized memory string URL (blob:http://...) pointing directly to the 
            file sitting on the user's local hard drive. */}
        setSelectedFile(URL.createObjectURL(file));
        setIsUploading(true);
        console.log(selectedFile);

        const formData = new FormData();
        formData.append('file', file); //the raw binary image
        {/* This tells Cloudinary: "This incoming anonymous upload is allowed, and it should apply the 
        presets defined for the course_images folder." */}
        formData.append('upload_preset', 'course_images');

        try {
            // 3. Upload directly to Cloudinary via REST API
            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const cloudData = await cloudinaryResponse.json();
            const imageUrl = cloudData.secure_url;

            {/* update the image url in the database */ }
            await updateCourseImageInDb(courseInfo?.courseId, imageUrl);

            setCourseInfo({
                ...courseInfo,
                courseBanner: imageUrl
            });

        } catch (error) {
            console.error("Failed to upload image or save to DB:", error);
        } finally {
            setIsUploading(false);
        }
    }

    useEffect(() => {
        {/* the selectedFile is updated from the local url to cloudinary secure url */ }
        if (courseInfo) {
            setSelectedFile(courseInfo?.courseBanner);
        }
    }, [courseInfo])

    return (
        <div className='glass-card p-8 mt-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col justify-center'>
                    {/* render the course name/title and after it render a component which is responsible for changing the 
                course name and description */}
                    <h2 className='font-bold text-2xl text-white flex items-start gap-2 flex-wrap'>
                        {/* display the title of the course first if not then the topic */}
                        {courseInfo?.courseOutput?.Topic || courseInfo?.courseOutput?.["Course Name"]} {edit && <EditCourseBasicInfo courseInfo={courseInfo} setCourseInfo={setCourseInfo} />}
                    </h2>

                    {/* render the description */}
                    <p className='text-slate-400 text-sm mt-3 leading-relaxed'>
                        {courseInfo?.courseOutput?.Description || "No description provided for this course."}
                    </p>

                    {/* render the category of the course */}
                    <h2 className='font-medium mt-4 flex gap-2 items-center text-violet-400 text-sm'>
                        <HiPuzzle /> {courseInfo?.category}
                    </h2>

                    {/* start button to start learning only shows when edit = false and navigates to path -> /course/[courseId]/start */}
                    {!edit && <Link href={'/course/' + courseInfo?.courseId + '/start'}>
                        <Button className='w-full mt-5 gradient-primary text-white border-0 hover:opacity-90 shadow-lg shadow-violet-500/20 text-base py-5'>
                            ▶ Start Learning
                        </Button>
                    </Link>}
                </div>

                {/* uploading of banner image */}
                <div className='relative group'>
                    <label htmlFor='upload-image' className={edit ? 'cursor-pointer' : ''}>
                        <div className='relative overflow-hidden rounded-xl'>
                            {/* displaying the banner image */}
                            <Image alt='logo' src={selectedFile ? selectedFile : '/img-ph.webp'} height={200} width={200} className='w-full rounded-xl h-[250px] object-cover object-center transition-transform duration-300 group-hover:scale-105' />
                            <div className='absolute inset-0 bg-gradient-to-t from-[#16161e]/60 to-transparent rounded-xl' />
                            {edit && (
                                /* custom css properties */
                                <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl'>
                                    <span className='text-white text-sm font-medium bg-violet-500/80 px-4 py-2 rounded-lg'>
                                        {isUploading ? 'Uploading...' : '📷 Change Banner'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </label>
                    {/* the htmlFor and the id are the same so the component is triggered whenever we upload a new banner image*/}
                    {edit && <input type='file' id='upload-image' className='opacity-0 hidden' onChange={onFileSelected} />}
                </div>
            </div>
        </div>
    )
}
export default CourseBasicInfo