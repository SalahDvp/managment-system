import { BellDot, ChevronDown, ChevronDownIcon, ChevronDownSquare, HistoryIcon, LayoutGrid, PlusIcon, Settings, User2, Users2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Searchinput from './Searchinput'

export default function Header() {
  return (
    <div className='bg-gray-100 h-12 flex items-center justify-between px-8 border-b border-slate-300'
    >
       <div className='flex gap-3'>
        {/* Recent activities*/}
        <button>  <HistoryIcon/></button>
      
        <Searchinput/>
       {/* Search */}
      
       </div>
       <div className='flex items-center gap-3'>
       <div className='pr-2 border-r border-gray-300'>
  
  </div>

<button
   className='p-1 rounded-lg hover:bg-slate-200'
  >
    <Users2 className='text-slate-900 w-4 h-4' />
  </button>
  <button
   className='p-1 rounded-lg hover:bg-slate-200'
  >
    <BellDot className='text-slate-900 w-4 h-4' />
  </button>
  <button
   className='p-1 rounded-lg hover:bg-slate-200'
  >
    <Settings className='text-slate-900 w-4 h-4' />
  </button>

<div className='flex gap-3'
>
    <button className='flex items-center'>
        <span> AcaSync</span>
            <ChevronDownIcon className='w-4 h-4'/>
        
    </button>
    <button><Image alt='user image' width={96} height={96} className={"w-8 h-8 rounded-full border border-gray-900 "}/></button>
    <button><LayoutGrid className='w-6 h-6 text-slate-900'/></button>
</div>
  


       </div>
      
       
    </div>
  )
}
