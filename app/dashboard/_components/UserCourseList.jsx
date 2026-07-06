"use client"
import { getUserCourses } from '@/configs/action';
import { useUser } from '@clerk/nextjs';
import React, { useContext, useEffect, useState } from 'react'
import CourseCard from './CourseCard';
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';

function UserCourseList() {

  const { user } = useUser();
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userCourseList, setUserCourseList } = useContext(UserCourseListContext);

  //fetches all the user courses 
  useEffect(() => {
    const fetchUserCourses = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      setLoading(true);
      try {
        const courses = await getUserCourses(email);
        console.log('Fetched User courses: ', courses);
        setUserCourses(courses);
        setUserCourseList(courses);
      } catch (error) {
        console.log("Failed to fetch courses: ", error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchUserCourses();
    }

  }, [user])


  return (
    <div className='mt-8'>
      <h2 className='font-bold text-2xl text-white'>My Courses</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4'>
        {userCourses?.length > 0 ? userCourses.map((course, index) => (
          <CourseCard course={course} setUserCourses={setUserCourses} key={index} />
        ))
          :
          //effect till userCourses is not fetched
          [1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className='w-full mt-4 rounded-xl h-[300px] animate-shimmer'>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default UserCourseList