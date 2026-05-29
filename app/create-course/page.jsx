"use client"
import { Button } from '@/components/ui/button';
import React, { useContext, useEffect, useState } from 'react'
import { HiMiniSquares2X2, HiLightBulb, HiClipboardDocumentCheck   } from "react-icons/hi2";
import SelectCategory from './_components/SelectCategory';
import TopicDescription from './_components/TopicDescription';
import SelectOption from './_components/SelectOption';
import { UserInputContext } from '../_context/UserInputContext';
import { generateCourseLayout } from '@/configs/AiModel';
import LoadingDialog from './_components/LoadingDialog';
// import { CourseList } from '@/configs/schema';
import uuid4 from 'uuid4';
import { useUser } from '@clerk/nextjs';
import { saveCourseToDb } from '@/configs/action';
import { useRouter } from 'next/navigation';

const CreateCourse = () => {
    const StepperOptions = [
        {
            id:1,
            name:"Category",
            icon:<HiMiniSquares2X2 />
        },
        {
            id:2,
            name:"Topic & Description",
            icon:<HiLightBulb  />
        },
        {
            id:3,
            name:"Options",
            icon:<HiClipboardDocumentCheck  />
        }
    ]

    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const {userCourseInput, setUserCourseInput} = useContext(UserInputContext);
    const {user} = useUser();

    const checkStatus = () => {
        if(userCourseInput.length == 0)return true;
        if(activeIndex == 0 && (userCourseInput?.category?.length===0 || userCourseInput?.category == undefined))return true;
        if(activeIndex == 1 && (userCourseInput?.topic?.length===0 || userCourseInput?.topic == undefined))return true;
        else if(activeIndex == 2){
            if(userCourseInput?.level == undefined)return true;
            if(userCourseInput?.duration == undefined)return true;
            if(userCourseInput?.displayVideo == undefined)return true;
            if(userCourseInput?.noOfChapters == undefined)return true;
        }
        return false;
    }

    useEffect(()=>{
        console.log(userCourseInput);
    },[userCourseInput])

    const GenerateCourseLayout = async ()=>{
        setLoading(true);
        const BASIC_PROMPT = `Generate a course tutorial. You MUST return ONLY a valid JSON object. Do not change the key names. You must strictly use this exact JSON structure:
            {
            "Course Name": "string",
            "Description": "string",
            "Category": "string",
            "Duration": "string",
            "Chapters": [
                {
                "Chapter Name": "string",
                "about": "string",
                "Duration": "string"
                }
            ]
            }
    
        Here are the details to use: `;
    
        const USER_INPUT_PROMPT = `Category: ${userCourseInput?.category}, Topic: ${userCourseInput?.topic}, Level: ${userCourseInput?.level}, Duration: ${userCourseInput?.duration}, NoOfChapters: ${userCourseInput?.noOfChapters}`;
    
        const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT;
        console.log(FINAL_PROMPT);

        try {
            const result = await generateCourseLayout(FINAL_PROMPT);
            console.log(result);        
            SaveCourseLayoutInDb(result);
        } catch (error) {
            console.error("Failed to fetch course layout from AI:", error);
        }finally{
            setLoading(false);
        }
    }

    const SaveCourseLayoutInDb = async (courseLayout) => {
        setLoading(true)
        const id = uuid4();
        try {
            const payload = {
                courseId: id,
                name: userCourseInput?.topic,
                level: userCourseInput?.level,
                category: userCourseInput?.category,
                courseOutput: courseLayout,
                
                // ADD FALLBACKS HERE (|| 'string')
                createdBy: user?.primaryEmailAddress?.emailAddress || "unknown_user@example.com",
                userName: user?.fullName || "Anonymous",
                userProfileImage: user?.imageUrl || "https://example.com/default-avatar.png"
            };

            // 2. Send the packaged data to your secure Server Action
            await saveCourseToDb(payload);
            
            console.log('finish - Data saved successfully!');
            
        } catch (error) {
            console.error('Error saving to DB:', error);
        } finally {
            setLoading(false);
        }

        router.replace('/create-course/' + id);
    }

    const router = useRouter();

  return (
    <div className='min-h-screen'>
        <div className='flex flex-col justify-center items-center mt-10'>
            <h2 className='text-3xl sm:text-4xl font-bold'>
              <span className='gradient-text'>Create Course</span>
            </h2>
            
            {/* Stepper */}
            <div className='flex items-center justify-between w-full max-w-2xl mx-auto mt-10 mb-14 relative'>
                {StepperOptions.map((item,idx)=>(
                    <React.Fragment key={idx}>
                        <div className='flex flex-col items-center relative z-10'>
                            <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full text-lg transition-all duration-300 border-4 border-[#121212] ${activeIndex>=idx ? 'bg-[#1DB954] text-black shadow-[0_0_15px_rgba(29,185,84,0.4)]' : 'bg-[#282828] text-[#B3B3B3]'}`}>
                              {item.icon}
                            </div>
                            <h2 className={`absolute top-16 md:top-18 text-[10px] md:text-xs font-bold uppercase tracking-wider text-center w-32 ${activeIndex>=idx ? 'text-white' : 'text-[#B3B3B3]'}`}>{item.name}</h2>
                        </div>
                        {idx !== StepperOptions.length - 1 && (
                          <div className={`flex-1 h-[2px] mx-2 transition-all duration-500 ${activeIndex > idx ? 'bg-[#1DB954]' : 'bg-[#282828]'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <div className='px-6 md:px-20 lg:px-44 mt-10'>
            {activeIndex==0 ? <SelectCategory/> : activeIndex==1 ? <TopicDescription/> : <SelectOption />}
            
            <div className='flex justify-between mt-10 mb-10'>
                <Button 
                  disabled={activeIndex==0} 
                  variant='outline' 
                  onClick={()=>setActiveIndex(activeIndex-1)}
                  className='border-border/50 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30'
                >
                  Previous
                </Button>
                {activeIndex<2 && (
                  <Button 
                    disabled={checkStatus()} 
                    onClick={()=>setActiveIndex(activeIndex+1)}
                    className='bg-[#1DB954] text-black font-bold border-0 hover:bg-[#1ed760] shadow-lg shadow-[#1DB954]/20 disabled:opacity-30 disabled:shadow-none'
                  >
                    Next
                  </Button>
                )}
                {activeIndex == 2 && (
                  <Button 
                    disabled={checkStatus()} 
                    onClick={()=>GenerateCourseLayout()}
                    className='bg-[#1DB954] text-black font-bold border-0 hover:bg-[#1ed760] shadow-lg shadow-[#1DB954]/20 disabled:opacity-30 disabled:shadow-none gap-2'
                  >
                    ✨ Generate Course Layout
                  </Button>
                )}
            </div>
        </div>

        <LoadingDialog loading={loading}/>

    </div>
  )
}

export default CreateCourse