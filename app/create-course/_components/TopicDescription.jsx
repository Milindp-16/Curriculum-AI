import { UserInputContext } from '@/app/_context/UserInputContext';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useContext } from 'react'

const TopicDescription = () => {

    const {userCourseInput, setUserCourseInput} = useContext(UserInputContext);
    const handleInputChange = (fieldName,value)=>{
        setUserCourseInput(prev=>({
            ...prev,
            [fieldName]:value
        }))
    }
  return (
    <div className='px-4 md:px-20 lg:px-44 mt-10'>
        <div className='flex flex-col gap-2'>
            <label className='text-sm text-white font-bold tracking-wide'>
              Write the topic for which you want to generate a course (example: Python, Yoga, etc.)
            </label>
            <Input 
              className='h-12 bg-[#181818] border-white/10 text-white placeholder:text-[#B3B3B3] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all rounded-lg' 
              placeholder='Enter course topic' 
              defaultValue={userCourseInput?.topic} 
              onChange={(e)=>handleInputChange('topic',e.target.value)}
            />
        </div>
        <div className='flex flex-col gap-2 mt-8'>
            <label className='text-sm text-white font-bold tracking-wide'>
              Tell us more about your course, what you want to include in the course (Optional)
            </label>
            <Textarea 
              className='bg-[#181818] border-white/10 text-white placeholder:text-[#B3B3B3] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all min-h-[140px] rounded-lg p-4' 
              placeholder='Detailed course description...' 
              defaultValue={userCourseInput?.description} 
              onChange={(e)=>handleInputChange('description',e.target.value)}
            />
        </div>
    </div>
  )
}

export default TopicDescription