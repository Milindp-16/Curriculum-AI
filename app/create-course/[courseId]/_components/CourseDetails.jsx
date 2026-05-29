import React from 'react'
import { HiChartBar, HiOutlineClock, HiOutlineBookOpen, HiVideoCamera  } from "react-icons/hi";

const CourseDetails = ({courseInfo}) => {
  return (
    <div className='glass-card p-6 mt-3'>
        {/* 1. Responsive Grid: 2 columns on small screens, 4 on medium+ screens, with a gap */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
            
            {/* 2. Added 'items-center' so the icon aligns perfectly with the text */}
            <div className='flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-200'>
                <div className='w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center'>
                    <HiChartBar className='text-xl text-violet-400'/>
                </div>
                <div>
                    <h2 className='text-xs text-slate-500'>Skill Level</h2>
                    <h2 className='font-medium text-sm text-white'>{courseInfo?.level}</h2>
                </div>
            </div>

            <div className='flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-200'>
                <div className='w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center'>
                    <HiOutlineClock className='text-xl text-cyan-400'/>
                </div>
                <div>
                    <h2 className='text-xs text-slate-500'>Duration</h2>
                    {/* Fixed bracket notation if your DB has a space, or leave as Duration if it doesn't */}
                    <h2 className='font-medium text-sm text-white'>{courseInfo?.courseOutput?.Duration}</h2>
                </div>
            </div>

            {/* Replaced copy-paste with No. of Chapters */}
            <div className='flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-200'>
                <div className='w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center'>
                    <HiOutlineBookOpen className='text-xl text-emerald-400'/>
                </div>
                <div>
                    <h2 className='text-xs text-slate-500'>Chapters</h2>
                    <h2 className='font-medium text-sm text-white'>{courseInfo?.courseOutput?.Chapters?.length}</h2>
                </div>
            </div>

            {/* Replaced copy-paste with Category */}
            <div className='flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-200'>
                <div className='w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center'>
                    <HiVideoCamera  className='text-xl text-amber-400'/>
                </div>
                <div>
                    <h2 className='text-xs text-slate-500'>Video Included</h2>
                    <h2 className='font-medium text-sm text-white'>{courseInfo?.includeVideo}</h2>
                </div>
            </div>

        </div>
    </div>
  )
}

export default CourseDetails