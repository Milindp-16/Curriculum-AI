import React from 'react'
import { HiOutlineClock, HiCheck } from "react-icons/hi2";

function ChapterListCard({ chapter, index, isCompleted }) {
  return (
    <div className={`flex items-center gap-3 p-4 border-b border-border/20 ${isCompleted ? 'bg-[#1DB954]/5' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-300 ${isCompleted ? 'bg-[#1DB954] text-black shadow-[0_0_10px_rgba(29,185,84,0.4)]' : 'bg-[#282828] text-white'}`}>
        {index + 1}
      </div>
      <div className='min-w-0 flex-1'>
        {/* shows the chapter name */}
        <h2 className='font-medium text-sm text-slate-200 truncate'>{chapter?.["Chapter Name"]}</h2>
        {/* shows the chapter duration */}
        <h2 className='flex items-center gap-1.5 text-xs text-slate-500 mt-0.5'><HiOutlineClock className="text-[#1DB954]/60" /> {chapter?.Duration}</h2>
      </div>

      {/* shows the tick mark if the chapter is completed */}
      {isCompleted && (
        <div className="text-[#1DB954] flex-shrink-0">
          <HiCheck className="h-5 w-5 drop-shadow-[0_0_5px_rgba(29,185,84,0.5)]" />
        </div>
      )}
    </div>
  )
}

export default ChapterListCard