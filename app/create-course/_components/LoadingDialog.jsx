import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'

{/* customized ui component to give special effect on loading */ }

const LoadingDialog = ({ loading }) => {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="glass-card border-border/50 bg-[#16161e]/95 backdrop-blur-xl max-w-sm">
        <AlertDialogHeader>
          {/* 1. Add a screen-reader-only title to satisfy Radix UI accessibility */}
          <AlertDialogTitle className="sr-only">
            Loading your course
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* 2. Move your layout div OUTSIDE of any Description or Header tags */}
        <div className='flex flex-col items-center py-10'>
          <div className='relative'>
            <Image
              src={'/dialog-animated.gif'}
              alt='loader'
              height={100}
              width={100}
              className='rounded-xl'
            />
            <div className='absolute inset-0 rounded-xl animate-pulse-glow' />
          </div>
          <h2 className="mt-6 text-center text-base font-medium text-white">
            AI is crafting your course...
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            This may take a moment
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LoadingDialog