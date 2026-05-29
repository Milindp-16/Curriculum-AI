"use client"
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext } from 'react'
import { HiHome, HiOutlineSquare3Stack3D, HiOutlineShieldCheck, HiMiniPower   } from "react-icons/hi2";
import { useClerk } from '@clerk/nextjs';
import Logo from '@/app/_components/Logo';

const SideBar = () => {

    const {userCourseList, setUserCourseList} = useContext(UserCourseListContext);
    const { signOut } = useClerk();
    const router = useRouter();

    const Menu=[
        {
            id:1,
            name:"Home",
            icon: <HiHome/>,
            path:'/dashboard'
        },
        {
            id:2,
            name:"Explore",
            icon: <HiOutlineSquare3Stack3D />,
            path:'/dashboard/explore'
        },
        {
            id:3,
            name:"Upgrade",
            icon: <HiOutlineShieldCheck />,
            path:'/dashboard/upgrade'
        },
        {
            id:4,
            name:"Logout",
            icon: <HiMiniPower />,
            path:'/logout'
        }
    ]
    const path = usePathname();

    const handleMenuClick = async (item) => {
        if(item.name === 'Logout') {
            await signOut();
            router.push('/');
            return;
        }
    }

  return (
    <div className='fixed h-full md:w-64 p-5 bg-[#0d0d14] border-r border-border/50 flex flex-col'>
        <div className='mb-6'>
            <Logo size='default' linkTo='/dashboard' />
        </div>
        <div className='h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-4' />
        
        <ul className='flex-1 space-y-1'>
            {Menu.map((item,idx)=>(
                item.name === 'Logout' ? (
                    <li key={idx}>
                        <button 
                            onClick={() => handleMenuClick(item)}
                            className={`w-full flex items-center gap-3 text-slate-400 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 hover:text-red-400 hover:bg-red-500/10 group`}
                        >
                            <div className='text-xl transition-colors duration-200 group-hover:text-red-400'>{item.icon}</div>
                            <h2 className='text-sm font-medium'>{item.name}</h2>
                        </button>
                    </li>
                ) : (
                    <li key={idx}>
                        <Link href={item.path}>
                            <div className={`menu-item flex items-center gap-3 text-slate-400 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 hover:text-white hover:bg-white/5 ${item.path === path && 'active text-white bg-violet-500/10'}`}>
                                <div className={`text-xl transition-colors duration-200 ${item.path === path ? 'text-violet-400' : ''}`}>{item.icon}</div>
                                <h2 className='text-sm font-medium'>{item.name}</h2>
                            </div>
                        </Link>
                    </li>
                )
            ))}
        </ul>

        <div className='mt-auto pt-4 border-t border-border/30'>
            <div className='progress-glow'>
                <Progress value={(userCourseList?.length/5)*100}/>
            </div>
            <h2 className='text-sm my-2 text-slate-300'>{userCourseList?.length} <span className='text-slate-500'>out of 5 courses created</span></h2>
            <p className='text-slate-500 text-xs leading-relaxed'>Upgrade your plan for unlimited course generation</p>
        </div>

    </div>
  )
}

export default SideBar