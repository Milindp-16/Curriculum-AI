"use client";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateCourseInDb } from '@/configs/action';
import React, { useEffect, useState, useRef } from 'react';
import { HiMiniPencilSquare, HiXMark } from "react-icons/hi2";

function EditChapters({ courseInfo, index, setCourseInfo }) {
    const Chapters = courseInfo?.courseOutput?.Chapters;

    const dialogRef = useRef(null);
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");

    useEffect(() => {
        if (Chapters && Chapters[index]) {
            setName(Chapters[index]?.["Chapter Name"] || "");
            setAbout(Chapters[index]?.about || "");
        }
    }, [Chapters, index]);

    // 2. Use the browser's native functions to open and close
    const openModal = () => {
        dialogRef.current?.showModal();
    }

    const closeModal = () => {
        dialogRef.current?.close();
        // Reset the inputs just in case they typed something and hit cancel
        setName(Chapters[index]?.["Chapter Name"] || "");
        setAbout(Chapters[index]?.about || "");
    }

    const onChapterUpdateHandler = async () => {
        const updatedCourseInfo = { ...courseInfo };
        const updatedChapters = [...updatedCourseInfo.courseOutput.Chapters];

        // update the chapter name and description
        updatedChapters[index] = {
            ...updatedChapters[index],
            "Chapter Name": name,
            about: about
        };

        updatedCourseInfo.courseOutput.Chapters = updatedChapters;
        setCourseInfo(updatedCourseInfo);
        closeModal();

        const payload = {
            courseId: courseInfo.courseId,
            courseOutput: updatedCourseInfo.courseOutput
        };

        try {
            await updateCourseInDb(payload);
            console.log(`Chapter ${index + 1} updated successfully in database!`);
        } catch (error) {
            console.error("Failed to update chapter:", error);
        }
    }

    return (
        <>
            {/* Edit Button */}
            <button
                type="button"
                onClick={openModal}
                className="cursor-pointer text-slate-500 hover:text-violet-400 transition-all ml-2"
            >
                <HiMiniPencilSquare size={18} />
            </button>

            {/* Dialog Container */}
            <dialog
                ref={dialogRef}
                className="backdrop:bg-black/80 backdrop:backdrop-blur-sm p-0 rounded-xl shadow-2xl border-0 w-[90%] max-w-lg bg-[#181818] m-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <div className="p-6 w-full relative">

                    {/* cross button to close the dialog */}
                    <button
                        type="button"
                        onClick={closeModal}
                        className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <HiXMark size={20} />
                    </button>

                    {/* Dialog Heading and Description */}
                    <div className="flex flex-col space-y-1.5 text-left mb-6">
                        <h2 className="text-lg font-semibold text-white">
                            Edit Chapter
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Update your chapter details below. Click save when you are done.
                        </p>
                    </div>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-slate-300">
                                Chapter Name
                            </label>
                            <Input
                                className="h-10 w-full rounded-lg bg-[#1e1e2a] border-[rgba(148,163,184,0.12)] text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-slate-300">
                                Chapter Description
                            </label>
                            <Textarea
                                className="min-h-[120px] w-full rounded-lg bg-[#1e1e2a] border-[rgba(148,163,184,0.12)] text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all border border-[rgba(148,163,184,0.12)] text-slate-300 hover:text-white hover:bg-white/5 h-10 px-4 py-2 mt-2 sm:mt-0"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onChapterUpdateHandler}
                            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all gradient-primary hover:opacity-90 h-10 px-4 py-2 text-white shadow-lg shadow-violet-500/20"
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default EditChapters;