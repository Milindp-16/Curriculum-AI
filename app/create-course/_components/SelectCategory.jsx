import { UserInputContext } from '@/app/_context/UserInputContext';
import CategoryList from '@/app/_shared/CategoryList'
import Image from 'next/image'
import React, { useContext } from 'react'

const SelectCategory = () => {
    const {userCourseInput, setUserCourseInput} = useContext(UserInputContext);

    const handleCategoryChange = (category) => {
        setUserCourseInput(prev=>({
            ...prev,
            category:category
        }))
    }

  return (
    <div className='px-4 md:px-20'>
        <h2 className='text-slate-300 font-medium mb-5'>Select the Course Category</h2>
        <div className='grid grid-cols-3 gap-6'>
            {CategoryList.map((item,idx)=>(
                <div 
                  key={idx} 
                  className={`flex flex-col p-6 items-center rounded-xl cursor-pointer transition-all duration-300 hover-lift group
                    ${userCourseInput?.category === item.name 
                      ? 'glass-card border-violet-500/50 glow-violet' 
                      : 'glass-card-light hover:border-violet-500/30'
                    }`} 
                  onClick={()=>handleCategoryChange(item.name)}
                >
                    <div className='w-16 h-16 rounded-xl overflow-hidden mb-3 group-hover:scale-110 transition-transform duration-300'>
                      <Image src={item.icon} alt={item.name} width={64} height={64} className='w-full h-full object-cover'/>
                    </div>
                    <h2 className={`text-sm font-medium text-center transition-colors duration-300 ${userCourseInput?.category === item.name ? 'text-violet-300' : 'text-slate-400 group-hover:text-white'}`}>{item.name}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SelectCategory