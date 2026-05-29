import Link from 'next/link'
import React from 'react'

const Logo = ({ size = 'default', linkTo = '/' }) => {
  const sizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-4xl',
  }

  return (
    <Link href={linkTo} className="flex items-center gap-2 group no-underline">
      <div className={`logo-icon ${size === 'small' ? 'w-7 h-7' : size === 'large' ? 'w-11 h-11' : 'w-9 h-9'} rounded-full bg-[#1DB954] flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
        <span className="text-black font-black" style={{ fontSize: size === 'small' ? '12px' : size === 'large' ? '20px' : '16px', lineHeight: 1 }}>C</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${sizeClasses[size]} font-bold text-white transition-all duration-300 tracking-tight`}>
          Curriculum
        </span>
        <span className={`${size === 'small' ? 'text-[9px]' : size === 'large' ? 'text-xs' : 'text-[10px]'} font-semibold tracking-[0.35em] uppercase text-[#1DB954] transition-colors duration-300`}>
          AI
        </span>
      </div>
    </Link>
  )
}

export default Logo
