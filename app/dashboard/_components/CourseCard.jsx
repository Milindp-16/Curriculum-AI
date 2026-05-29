import Image from 'next/image'
import React from 'react'
import { HiOutlineBookOpen, HiEllipsisVertical } from "react-icons/hi2";
import DropdownOption from './DropdownOption';
import { deleteCourse } from '@/configs/action';
import Link from 'next/link';

// Removed userCourses from props since it is not needed
function CourseCard({ course, setUserCourses, displayUser=false }) {

    const handleOnDelete = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this course? This action cannot be undone.");
        
        if (!isConfirmed) return;
        
        try {
            const courseId = course?.courseId;
            await deleteCourse(courseId);
            console.log(`Course ${courseId} successfully deleted.`);

            setUserCourses((prevCourses) => 
                prevCourses.filter((c) => c?.courseId !== courseId)
            );
            
        } catch (error) {
            console.error("Failed to delete course:", error);
            alert("Something went wrong while trying to delete the course.");
        }
    }

  return (
    <div className='glass-card overflow-hidden hover-lift cursor-pointer mt-4 group'>
        <Link href={'/course/'+course?.courseId}>
            <div className='relative overflow-hidden'>
                <Image src={course?.courseBanner || '/img-ph.webp'} width={300} height={200} className='w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-105' alt='banner image' priority={true}/>
                <div className='absolute inset-0 bg-gradient-to-t from-[#16161e] via-transparent to-transparent opacity-60' />
                <div className='absolute top-3 right-3'>
                    <span className='text-xs font-medium px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 backdrop-blur-sm border border-violet-500/20'>
                        {course?.level}
                    </span>
                </div>
            </div>
        </Link>

        <div className='p-4'>
            <h2 className='font-semibold text-base text-white flex justify-between items-start gap-2'>
                <span className='line-clamp-2 leading-snug'>{course?.courseOutput?.["Course Name"]}</span>
                
                {/* Cleaned up the prop passing here */}
                {!displayUser && <DropdownOption handleOnDelete={handleOnDelete}>
                    <HiEllipsisVertical className="text-slate-400 hover:text-white transition-colors" />
                </DropdownOption>}
            </h2>
            <p className='text-xs text-violet-400/80 mt-2 font-medium'>{course?.category}</p>
            <div className='flex items-center justify-between mt-3 pt-3 border-t border-border/30'>
                <h2 className='flex gap-1.5 items-center text-slate-400 text-xs'>
                    <HiOutlineBookOpen className="text-cyan-400" /> {course?.courseOutput?.Chapters?.length} Chapters
                </h2>
            </div>
            {displayUser && <div className='flex gap-2 items-center mt-3 pt-3 border-t border-border/30'>
                <Image src={course?.userProfileImage || '/img-ph.webp'} width={28} height={28} alt='profile pic' className='rounded-full ring-2 ring-violet-500/30'/>
                <h2 className='text-xs text-slate-400'>{course?.userName}</h2>
            </div>}
        </div>
    </div>
  )
}

export default CourseCard