"use client"
import { UserButton } from '@clerk/nextjs'
import React, { useState } from 'react'
import Logo from '@/app/_components/Logo'
import { useRouter } from 'next/navigation'




const Header = () => {

  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
   if(e.key === 'Enter' && searchInput.trim()){
    router.push(`/dashboard/explore?q=${encodeURIComponent(searchInput)}`)
   }
  }

  return (
    <div className='flex justify-between items-center px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40'>
        <div className='md:hidden'>
          <Logo size='small' linkTo='/dashboard' />
        </div>
        <div className='hidden md:flex items-center gap-3 flex-1'>
          <div className='relative flex-1 max-w-md'>
            <input 
              type="text" 
              placeholder="Search AI courses..." 
              className='w-full bg-white/5 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200'
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
        <UserButton afterSignOutUrl="/" />
    </div>
  )
}

export default Header