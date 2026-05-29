import { Button } from "@/components/ui/button"
import { HiMiniTrash } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React from 'react'

function DropdownOption({children,handleOnDelete}) {    
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">{children}</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="glass-card border-border/50 bg-[#1e1e2a]">
        <DropdownMenuItem onClick={handleOnDelete} className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10 cursor-pointer">
            <div className='flex items-center gap-2'><HiMiniTrash /> Delete Course</div>
        </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownOption