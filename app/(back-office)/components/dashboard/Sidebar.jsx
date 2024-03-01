"use client";
import { useState } from 'react';
import { Bike, CalendarDays, ChevronLeft, CircleDollarSign, Clock7, FilePlus, Home, Kanban, LandPlot, MessageCircleMore, MousePointerSquare, Trophy, Users2 } from 'lucide-react';
import React from 'react';


export default function Sidebar() {
  // State to keep track of the active link
  const [activeLink, setActiveLink] = useState('');
  
  return (
    <div className="w-56 min-h-screen bg-slate-800 text-slate-50 fixed ">
      <div className='flex flex-col'>
          <div className='flex bg-slate-950 space-x-2 items-center py-4 px-2'>
              <Trophy/>
              <span className='font-bold'>TEAM UP</span>
          </div>
          <nav className='flex flex-col gap-3 px-3 py-6 ' >
              <a
                className={`flex items-center space-x-2 p-2 rounded-md hover:bg-slate-900 ${activeLink === 'home' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/firstpage'}
                onClick={() => setActiveLink('home')}
              >
                  <Home className='w-6 h-6'/>
                  <span>Home</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'calendar' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/calendar'}
                onClick={() => setActiveLink('calendar')}
              >
                  <CalendarDays className='w-6 h-6'/>
                  <span>Calendar</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'team' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/coaches'}
                onClick={() => setActiveLink('team')}
              >
                  <Users2 className='w-6 h-6'/>
                  <span>Coaches</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'team' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/players'}
                onClick={() => setActiveLink('team')}
              >
                  <Bike className='w-6 h-6'/>
                  <span>Players</span>
              </a>
              <a
                className={`flex items-center space-x-2 p-2 rounded-md hover:bg-slate-900 ${activeLink === 'home' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/classes'}
                onClick={() => setActiveLink('classes')}
              >
                  <LandPlot className='w-6 h-6'/>
                  <span>Classes</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'chat' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/chat'}
                onClick={() => setActiveLink('chat')}
              >
                  <MessageCircleMore className='w-6 h-6'/>
                  <span>Chat</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'post' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/post'}
                onClick={() => setActiveLink('post')}
              >
                  <MousePointerSquare className='w-6 h-6'/>
                  <span>Post</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'management' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/management'}
                onClick={() => setActiveLink('management')}
              >
                  <Kanban className='w-6 h-6'/>
                  <span>Management</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'payments' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/payment'}
                onClick={() => setActiveLink('payments')}
              >
                  <CircleDollarSign className='w-6 h-6'/>
                  <span>Payments</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'registration' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/registration'}
                onClick={() => setActiveLink('registration')}
              >
                  <FilePlus className='w-6 h-6'/>
                  <span>Registration</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-slate-900 ${activeLink === 'scheduling' ? 'bg-blue-600 text-white' : ''}`}
                href={'/scheduling'}
                onClick={() => setActiveLink('scheduling')}
              >
                  <Clock7 className='w-6 h-6'/>
                  <span>Scheduling</span>
              </a>
          </nav>
      </div>
      <div className='flex flex-col h-screen hover:bg-slate-900'>
          <button className='flex bg-slate-950 space-x-2 items-center py-4 px-2 justify-center '>
              <ChevronLeft/>
          </button>
      </div>
    </div>
  );
}
