"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import Logo from './Logo'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50' style={{borderRadius: 0}}>
      <div className='max-w-7xl mx-auto flex justify-between items-center px-6 py-3'>
        <Logo size='default' linkTo='/' />
        <div className='flex items-center gap-3'>
          <Link href='/sign-in'>
            <Button variant='ghost' className='text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200'>
              Sign In
            </Button>
          </Link>
          <Link href='/dashboard'>
            <Button className='gradient-primary text-white border-0 hover:opacity-90 transition-all duration-200 px-6 shadow-lg shadow-violet-500/20'>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header