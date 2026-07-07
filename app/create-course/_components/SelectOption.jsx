import React, { useContext } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { UserInputContext } from '@/app/_context/UserInputContext';


const SelectOption = () => {

    const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

    {/* dynamic handler function that sets the fielname ti the value that we pass while  preserving the rest */ }
    const handleInputChange = (fieldName, value) => {
        setUserCourseInput(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    return (
        <div className='px-4 md:px-20 lg:px-44 mt-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* to select the difficulty level */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm text-white font-bold tracking-wide'>Difficulty Level</label>
                    {/* component used from shadcn-ui */}
                    <Select onValueChange={(value) => handleInputChange('level', value)} defaultValue={userCourseInput?.level}>
                        <SelectTrigger className='w-full h-12 bg-[#181818] border-white/10 text-white focus:ring-[#1DB954]/50 rounded-lg'>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent className='bg-[#181818] border-white/10 text-white'>
                            <SelectGroup>
                                <SelectItem value="Beginner" className="focus:bg-white/10 focus:text-white cursor-pointer p-3">Beginner</SelectItem>
                                <SelectItem value="Intermediate" className="focus:bg-white/10 focus:text-white cursor-pointer p-3">Intermediate</SelectItem>
                                <SelectItem value="Advance" className="focus:bg-white/10 focus:text-white cursor-pointer p-3">Advance</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* to select the duration */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm text-white font-bold tracking-wide'>Course Duration</label>
                    <Select onValueChange={(value) => handleInputChange('duration', value)} defaultValue={userCourseInput?.duration}>
                        <SelectTrigger className='w-full h-12 bg-[#181818] border-white/10 text-white focus:ring-[#1DB954]/50 rounded-lg'>
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className='bg-[#181818] border-white/10 text-white'>
                            <SelectGroup>
                                <SelectItem value="1 Hour" className="focus:bg-white/10 focus:text-white cursor-pointer py-3">1 Hour</SelectItem>
                                <SelectItem value="2 Hours" className="focus:bg-white/10 focus:text-white cursor-pointer py-3">2 Hours</SelectItem>
                                <SelectItem value="More than 2 Hours" className="focus:bg-white/10 focus:text-white cursor-pointer py-3">More than 3 Hours</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>


                {/* to select whether we want to add reference video */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm text-white font-bold tracking-wide'>Add Reference Video</label>
                    <Select onValueChange={(value) => handleInputChange('displayVideo', value)} defaultValue={userCourseInput?.displayVideo}>
                        <SelectTrigger className='w-full h-12 bg-[#181818] border-white/10 text-white focus:ring-[#1DB954]/50 rounded-lg'>
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent className='bg-[#181818] border-white/10 text-white'>
                            <SelectGroup>
                                <SelectItem value="Yes" className="focus:bg-white/10 focus:text-white cursor-pointer py-3">Yes</SelectItem>
                                <SelectItem value="No" className="focus:bg-white/10 focus:text-white cursor-pointer py-3">No</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* to select the number of chapters in the course */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm text-white font-bold tracking-wide'>Number of Chapters</label>
                    <Input
                        type='number'
                        onChange={(e) => handleInputChange('noOfChapters', e.target.value)}
                        defaultValue={userCourseInput?.noOfChapters}
                        className='w-full h-12 bg-[#181818] border-white/10 text-white placeholder:text-[#B3B3B3] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] rounded-lg'
                    />
                </div>

            </div>
        </div>
    )
}

export default SelectOption