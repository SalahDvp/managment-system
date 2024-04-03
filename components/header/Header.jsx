import { BellDot, ChevronDown, ChevronDownIcon, ChevronDownSquare, HistoryIcon, LayoutGrid, PlusIcon, Settings, User2, Users2 } from 'lucide-react'
import Image from 'next/image'


export default function Header() {
  return (
<div className='bg-gray-100 h-12 flex items-center px-8 border-b border-slate-300 bg-white justify-end'>
  {/* First button */}
  <button><Image alt='user image' src={require('@/public/logo-expanded.png')} width={96} height={96} className="w-8 h-8" /></button>

  {/* Second button */}
  <button className='flex items-center ml-4'>
    <span>Optimum Tennis</span>
    <ChevronDownIcon className='w-4 h-4 ml-1' />
  </button>
</div>
  )
}