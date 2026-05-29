"use client"; 
import React, { useState } from 'react';
import { HiMiniPencilSquare, HiXMark } from "react-icons/hi2";
import { updateCourseInDb } from '@/configs/action'; 

function EditCourseBasicInfo({ courseInfo, setCourseInfo }) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Safely initialize state
    const [name, setName] = useState(courseInfo?.courseOutput?.["Course Name"] || "");
    const [description, setDescription] = useState(courseInfo?.courseOutput?.Description || "");

    const onUpdateHandler = async () => {
        // 1. Optimistic UI Update
        const updatedCourseInfo = { ...courseInfo };
        updatedCourseInfo.courseOutput["Course Name"] = name;
        updatedCourseInfo.courseOutput.Description = description;
        
        setCourseInfo(updatedCourseInfo);
        setIsOpen(false); 
        
        // 2. Background Database Update
        const payload = {
            courseId: courseInfo.courseId, 
            courseOutput: updatedCourseInfo.courseOutput
        };

        try {
            await updateCourseInDb(payload);
            console.log("Course updated successfully in database!");
        } catch (error) {
            console.error("Failed to update course:", error);
        }
    }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer text-[#B3B3B3] hover:text-[#1DB954] transition-all ml-2"
      >
          <HiMiniPencilSquare size={20} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)} />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-[#181818] rounded-xl p-6 shadow-2xl animate-fade-in-up z-10">
                
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 rounded-sm text-slate-400 hover:text-white transition-colors"
                >
                    <HiXMark size={20} />
                </button>

                <div className="flex flex-col space-y-1.5 text-left mb-6">
                    <h2 className="text-lg font-semibold text-white">
                        Edit Course Title & Description
                    </h2>
                    <p className="text-sm text-slate-400">
                        Update your course details below. Click save when you are done.
                    </p>
                </div>
                
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-slate-300">
                            Course Title
                        </label>
                        <input 
                            className="flex h-10 w-full rounded-lg bg-[#1e1e2a] border border-border/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                            defaultValue={name} 
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-slate-300">
                            Course Description
                        </label>
                        <textarea 
                            className="flex min-h-[120px] w-full rounded-lg bg-[#1e1e2a] border border-border/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                            defaultValue={description} 
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all border border-border/50 text-slate-300 hover:text-white hover:bg-white/5 h-10 px-4 py-2 mt-2 sm:mt-0"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onUpdateHandler}
                        className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all gradient-primary hover:opacity-90 h-10 px-4 py-2 text-white shadow-lg shadow-violet-500/20"
                    >
                        Save changes
                    </button>
                </div>
                
            </div>
        </div>
      )}
    </>
  )
}

export default EditCourseBasicInfo;