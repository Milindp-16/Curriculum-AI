import React from 'react'
import { HiOutlineClock } from "react-icons/hi2";

function ChapterListCard({chapter,index,isCompleted}) {
  return (
    <div className={`flex items-center gap-3 p-4 border-b border-border/20 ${isCompleted ? 'bg-[#1DB954]/5' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-300 ${isCompleted ? 'bg-[#1DB954] text-black shadow-[0_0_10px_rgba(29,185,84,0.4)]' : 'bg-[#282828] text-white'}`}>
            {index+1}
        </div>
        <div className='min-w-0 flex-1'>
            <h2 className='font-medium text-sm text-slate-200 truncate'>{chapter?.["Chapter Name"]}</h2>
            <h2 className='flex items-center gap-1.5 text-xs text-slate-500 mt-0.5'><HiOutlineClock className="text-[#1DB954]/60" /> {chapter?.Duration}</h2>
        </div>
        {isCompleted && (
            <div className="text-[#1DB954] flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 drop-shadow-[0_0_5px_rgba(29,185,84,0.5)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        )}
    </div>
  )
}

export default ChapterListCard