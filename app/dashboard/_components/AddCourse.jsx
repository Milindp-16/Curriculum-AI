"use client"
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useContext } from 'react'
import { HiOutlineSparkles } from "react-icons/hi2";

const AddCourse = () => {
    const {user} = useUser();
    const {userCourseList, setUserCourseList} = useContext(UserCourseListContext);
  return (
    <div className='glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
            <h2 className='text-2xl text-white font-light'>Hello, <span className='font-bold gradient-text'>{user?.fullName}</span></h2>
            <p className='text-sm text-slate-400 mt-1'>Create new courses with AI, share with friends and earn from it.</p>
        </div>
        <Link href={userCourseList?.length >= 5 ? '/dashboard/upgrade' : '/create-course'}>
          <Button className='gradient-primary text-white border-0 hover:opacity-90 transition-all duration-300 shadow-lg shadow-violet-500/20 px-6 gap-2'>
            <HiOutlineSparkles className="text-lg" />
            Create AI Course
          </Button>
        </Link>
    </div>
  )
}

export default AddCourse