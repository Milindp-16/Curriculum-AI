"use client"
import { exploreCourses, searchGlobalCourses } from '@/configs/action';
import React, { useEffect, useState } from 'react'
import CourseCard from '../_components/CourseCard';
import { Button } from '@/components/ui/button';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

const ExploreContent = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  {/* fetched courses on the basis of page and returns 9 courses (pagination) */ }
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await exploreCourses(pageIndex);
      setCourses(res);
    } catch (error) {
      // FIX 1: console.error instead of console()
      console.error("Unable to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  {/* is the user entered with searchQuery or clicked explore */ }
  useEffect(() => {
    if (initialQuery) {
      handleSemanticSearch(initialQuery);
    } else {
      fetchCourses();
    }
  }, [initialQuery, pageIndex]);


  const handleSemanticSearch = async (queryToSearch = searchInput) => {
    if (!queryToSearch.trim()) {
      setHasSearched(false);
      fetchCourses();
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const result = await searchGlobalCourses(queryToSearch);
      setCourses(result);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

      <div className='mb-6'>
        <h2 className='font-bold text-2xl text-white'>Explore Courses</h2>
        <p className='text-slate-400 text-sm mt-1'>
          {hasSearched ? `Search results for "${initialQuery}"` : "Discover AI-generated courses built by other creators"}
        </p>
      </div>

      {/* display course cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {courses.map((course, index) => (
          <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <CourseCard course={course} displayUser={true} />
          </div>
        ))}
      </div>

      {/* the buttons donot show up if we are searching and our search results are being showed up */}
      {!hasSearched && (
        <div className='flex justify-between items-center mt-8 pt-6 border-t border-border/30'>
          {pageIndex > 0 ? (
            <Button
              onClick={() => setPageIndex(pageIndex - 1)}
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-white/5 gap-2"
            >
              <HiOutlineChevronLeft /> Previous
            </Button>
          ) : <div />}

          <span className='text-sm text-slate-500'>Page {pageIndex + 1}</span>

          <Button
            onClick={() => setPageIndex(pageIndex + 1)}
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-white/5 gap-2"
          >
            Next <HiOutlineChevronRight />
          </Button>
        </div>
      )}
    </div>
  )
}

const Explore = () => {
  return (
    //page reads url parameters therefor Next.js needs this wrapper so that it doesnot crash during server side rendering
    //if the url is not redady just show fallback
    <Suspense fallback={<div>Loading explore...</div>}>
      <ExploreContent />
    </Suspense>
  )
}

export default Explore