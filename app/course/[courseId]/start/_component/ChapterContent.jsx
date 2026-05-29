import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { markChapterCompleted } from '@/configs/action'
import { HiCheckCircle, HiOutlineCheckCircle, HiOutlinePlayCircle } from 'react-icons/hi2'

const opts = {
    height: '390',
    width: '640',
    playerVars: {
        autoplay: 1, // Note: Browsers often block autoplay unless the video is muted
    },
};

function ChapterContent({ chapter, content, isCompleted, onMarkCompleted }) {
  const [isPending, setIsPending] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Reset video error state when the selected video changes
  useEffect(() => {
      setVideoError(false);
  }, [content?.videoId]);

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

  // Clean markdown backticks from code example
  let cleanCode = content?.content?.codeExample || "";
  if (typeof cleanCode === 'string') {
      cleanCode = cleanCode.replace(/```(html|css|js|javascript|jsx)?/gi, '').replace(/```/g, '').trim();
  }

  return (
    <div className='p-6 md:p-10 max-w-4xl mx-auto'>
        <h2 className='font-bold text-2xl text-white'>{chapter?.["Chapter Name"]}</h2>
        <p className='text-slate-400 mt-2 text-sm leading-relaxed'>{chapter?.about}</p>

        {/* 1. YouTube Video */}
        <div className='flex justify-center my-8'>
            {content?.videoId && (
                <div className='flex flex-col items-center w-full'>
                    {!videoError ? (
                        <div className='rounded-xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-border/30 max-w-full'>
                            <YouTube 
                                videoId={content?.videoId} 
                                opts={opts}
                                onError={() => setVideoError(true)}
                            />
                        </div>
                    ) : (
                        <div className='bg-[#181818] p-8 rounded-xl border border-border/30 text-center max-w-xl w-full'>
                            <HiOutlinePlayCircle className='text-5xl text-[#1DB954] mx-auto mb-4' />
                            <h3 className='text-lg font-bold text-white mb-2'>Video Unavailable for Embedding</h3>
                            <p className='text-slate-400 text-sm mb-6'>The owner of this video has disabled playback on other websites. You can still watch it directly on YouTube.</p>
                            <a 
                                href={`https://www.youtube.com/watch?v=${content?.videoId}`}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-2 bg-[#1DB954] text-black font-bold px-6 py-3 rounded-full hover:bg-[#1ed760] transition-colors'
                            >
                                Watch on YouTube
                            </a>
                        </div>
                    )}
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
        {cleanCode && cleanCode.replace(/<[^>]*>?/gm, '').trim() !== "" && (
            <div className='mt-8'>
                <h3 className='font-semibold text-lg text-white mb-4 flex items-center gap-2'>
                    <span className='w-1 h-6 bg-[#06b6d4] rounded-full inline-block' />
                    Code Example
                </h3>
                {/* HackerRank Style Code Block */}
                <pre className='p-6 bg-[#0d0d14] border border-border/50 text-[#1DB954] font-mono text-sm rounded-xl overflow-x-auto shadow-inner'>
                    <code>{cleanCode}</code>
                </pre>
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