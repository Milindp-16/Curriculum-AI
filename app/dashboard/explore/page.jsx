"use client"
import { exploreCourses } from '@/configs/action';
import React, { useEffect, useState } from 'react'
import CourseCard from '../_components/CourseCard';
import { Button } from '@/components/ui/button';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

const Explore = () => {

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(()=>{
    const fetchCourses = async () => {
      setLoading(true);
      try{
        const res = await exploreCourses(pageIndex);
        console.log(res);
        setCourses(res);
      }catch(error){
        console("Unable to fetch courses",error);
      }finally{
        setLoading(false);
      }
    };
    fetchCourses();
  },[pageIndex])

  return (
    <div>
      <div className='mb-6'>
        <h2 className='font-bold text-2xl text-white'>Explore Courses</h2>
        <p className='text-slate-400 text-sm mt-1'>Discover AI-generated courses built by other creators</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {courses.map((course,index)=>(
          <div key={index} className="animate-fade-in-up" style={{animationDelay: `${index * 0.05}s`}}>
            <CourseCard course={course} displayUser={true}/>
          </div>
        ))}
      </div>

      <div className='flex justify-between items-center mt-8 pt-6 border-t border-border/30'>
        {pageIndex>0 ? (
          <Button 
            onClick={()=>setPageIndex(pageIndex-1)} 
            variant="ghost" 
            className="text-slate-400 hover:text-white hover:bg-white/5 gap-2"
          >
            <HiOutlineChevronLeft /> Previous
          </Button>
        ) : <div />}
        <span className='text-sm text-slate-500'>Page {pageIndex + 1}</span>
        <Button 
          onClick={()=>setPageIndex(pageIndex+1)}
          variant="ghost"
          className="text-slate-400 hover:text-white hover:bg-white/5 gap-2"
        >
          Next <HiOutlineChevronRight />
        </Button>
      </div>
    </div>
  )
}

export default Explore