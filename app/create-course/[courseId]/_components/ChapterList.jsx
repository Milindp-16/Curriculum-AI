import React from 'react'
import { HiClock, HiOutlineCheckCircle } from "react-icons/hi2";
import EditChapters from './EditChapters';

const ChapterList = ({courseInfo, setCourseInfo, edit=true}) => {
  return (
    <div className='mt-5'>
        <h2 className='font-semibold text-lg text-white'>Chapters</h2>
        <div className='mt-3 space-y-2'>
            {courseInfo?.courseOutput?.Chapters.map((chapter, idx) => (
                <div key={idx} className='glass-card-light p-5 flex items-center justify-between group hover:bg-white/[0.04] transition-all duration-200'>
                  
                  <div className='flex gap-4 items-center'>
                    <h2 className='w-10 h-10 gradient-primary text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg shadow-violet-500/20'>
                        {idx+1}
                    </h2>
                    <div>
                      
                      <div className='flex items-center gap-2'>
                          <h2 className='font-medium text-base text-white'>{chapter?.["Chapter Name"]}</h2>
                          {edit && <EditChapters index={idx} courseInfo={courseInfo} setCourseInfo={setCourseInfo} />}
                      </div>
                      
                      <p className='text-sm text-slate-400 mt-0.5 line-clamp-1'>{chapter?.about}</p>
                      <p className='flex items-center gap-1.5 mt-1 text-xs text-slate-500'>
                          <HiClock className='text-violet-400'/> {chapter?.Duration}
                      </p>
                    
                    </div>
                  </div>
                  
                  <HiOutlineCheckCircle className='text-2xl text-slate-600 group-hover:text-violet-400/50 transition-colors duration-200'/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ChapterList;