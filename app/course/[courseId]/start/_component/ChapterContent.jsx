import React, { useState } from 'react'
import YouTube from 'react-youtube'
import { markChapterCompleted } from '@/configs/action'
import { HiCheckCircle, HiOutlineCheckCircle } from 'react-icons/hi2'

const opts = {
    height: '390',
    width: '640',
    playerVars: {
        autoplay: 1, // Note: Browsers often block autoplay unless the video is muted
    },
};

function ChapterContent({ chapter, content, isCompleted, onMarkCompleted }) {
  const [isPending, setIsPending] = useState(false);

  // Quick fallback just in case the data hasn't loaded yet
  if (!content) return null;

  const handleMarkCompleted = async () => {
      setIsPending(true);
      try {
          await markChapterCompleted(content?.courseId, content?.chapterId, !isCompleted);
          if (onMarkCompleted) onMarkCompleted(content?.chapterId, !isCompleted);
      } catch (error) {
          console.error("Failed to mark completed:", error);
      } finally {
          setIsPending(false);
      }
  }

  return (
    <div className='p-6 md:p-10 max-w-4xl mx-auto'>
        <h2 className='font-bold text-2xl text-white'>{chapter?.["Chapter Name"]}</h2>
        <p className='text-slate-400 mt-2 text-sm leading-relaxed'>{chapter?.about}</p>

        {/* 1. YouTube Video */}
        <div className='flex justify-center my-8'>
            {content?.videoId && (
                <div className='rounded-xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-border/30'>
                    <YouTube videoId={content?.videoId} opts={opts}/>
                </div>
            )}
        </div>

        {/* 2. Detailed Description */}
        <div className='mt-8'>
            <h3 className='font-semibold text-lg text-white mb-4 flex items-center gap-2'>
                <span className='w-1 h-6 gradient-primary rounded-full inline-block' />
                Detailed Explanation
            </h3>
            {/* 'whitespace-pre-wrap' is critical here! It tells Tailwind to respect the \n\n line breaks in your database string so it renders as actual paragraphs. */}
            <p className='text-slate-300 whitespace-pre-wrap leading-relaxed text-sm'>
                {content?.content?.description}
            </p>
        </div>

        {/* 3. Code Example (Conditionally rendered only if it contains actual code) */}
        {content?.content?.codeExample && content?.content?.codeExample.replace(/<[^>]*>?/gm, '').trim() !== "" && (
            <div className='mt-8'>
                <h3 className='font-semibold text-lg text-white mb-4 flex items-center gap-2'>
                    <span className='w-1 h-6 bg-[#06b6d4] rounded-full inline-block' />
                    Code Example
                </h3>
                {/* HackerRank Style Code Block */}
                <div 
                    className='code-block'
                    dangerouslySetInnerHTML={{ __html: content?.content?.codeExample }}
                />
            </div>
        )}
        
        {/* 4. Mark as Completed Button */}
        <div className='mt-12 flex justify-center pb-10'>
            <button 
                onClick={handleMarkCompleted}
                disabled={isPending}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg ${
                    isCompleted 
                        ? 'bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/50 hover:bg-[#1DB954]/30' 
                        : 'bg-[#1DB954] text-black hover:bg-[#1ed760] shadow-[#1DB954]/20'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isPending ? (
                    <div className='w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin' />
                ) : isCompleted ? (
                    <HiCheckCircle className='text-2xl' />
                ) : (
                    <HiOutlineCheckCircle className='text-2xl' />
                )}
                {isCompleted ? 'Completed' : 'Mark as Completed'}
            </button>
        </div>
        
    </div>
  )
}

export default ChapterContent