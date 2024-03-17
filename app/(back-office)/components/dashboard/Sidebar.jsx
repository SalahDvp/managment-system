"use client";
import { useState } from 'react';
import { Bike, CalendarDays, ChevronLeft, CircleDollarSign, Clock7, FilePlus, Home, Kanban, LandPlot, Medal, MessageCircleMore, MousePointerSquare, Settings, Trophy, Users2 } from 'lucide-react';
import React from 'react';


export default function Sidebar() {
  // State to keep track of the active link
  const [activeLink, setActiveLink] = useState('');
  
  return (
    <div className="w-56 min-h-screen bg-slate-50 text-gray-400 fixed ">
      <div className='flex flex-col'>
          <div className='flex bg-slate-50 space-x-2 items-center py-4 px-2'>
              <Trophy/>
              <span className='font-bold'>TEAM UP</span>
          </div>
          <nav className='flex flex-col gap-3 px-3 py-6 ' >
              <a
                className={`flex items-center space-x-2 p-2 rounded-md hover:bg-green-300 rounded-md rounded-md ${activeLink === 'home' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/firstpage'}
                onClick={() => setActiveLink('home')}
              >
                  <Home className='w-6 h-6'/>
                  <span>Home</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300 rounded-md rounded-md ${activeLink === 'calendar' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/calendar'}
                onClick={() => setActiveLink('calendar')}
              >
                  <CalendarDays className='w-6 h-6'/>
                  <span>Calendar</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300 rounded-md ${activeLink === 'team' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/coaches'}
                onClick={() => setActiveLink('team')}
              >
                  <Users2 className='w-6 h-6'/>
                  <span>Coaches</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300 rounded-md ${activeLink === 'team' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/players'}
                onClick={() => setActiveLink('team')}
              >
                  <Bike className='w-6 h-6'/>
                  <span>Players</span>
              </a>
              <a
                className={`flex items-center space-x-2 p-2 rounded-md hover:bg-green-300 rounded-md ${activeLink === 'home' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/classes'}
                onClick={() => setActiveLink('classes')}
              >
                  <LandPlot className='w-6 h-6'/>
                  <span>Classes</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300 rounded-md ${activeLink === 'matches' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/matches'}
                onClick={() => setActiveLink('matches')}
              >
                  <Medal className='w-6 h-6'/>
                  <span>Matches</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300 rounded-md ${activeLink === 'chat' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/chat'}
                onClick={() => setActiveLink('chat')}
              >
                  <MessageCircleMore className='w-6 h-6'/>
                  <span>Chat</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300 rounded-md ${activeLink === 'post' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/post'}
                onClick={() => setActiveLink('post')}
              >
                  <MousePointerSquare className='w-6 h-6'/>
                  <span>Post</span>
              </a>
             
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300  rounded-md ${activeLink === 'payments' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/payment'}
                onClick={() => setActiveLink('payments')}
              >
                  <CircleDollarSign className='w-6 h-6'/>
                  <span>Billings</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300 rounded-md ${activeLink === 'registration' ? 'bg-blue-600 text-white' : ''}`}
                href={'/invdashboard/home/registration'}
                onClick={() => setActiveLink('registration')}
              >
                  <FilePlus className='w-6 h-6'/>
                  <span>Registration</span>
              </a>
              <a
                className={`p-2 flex items-center space-x-2 hover:bg-green-300 rounded-md rounded-md ${activeLink === 'scheduling' ? 'bg-blue-600 text-white' : ''}`}
                href={'/scheduling'}
                onClick={() => setActiveLink('scheduling')}
              >
                  <Settings className='w-6 h-6'/>
                  <span>Settings</span>
              </a>
          </nav>
      </div>
      <div className='flex flex-col h-screen hover:bg-green-300 rounded-md rounded-md'>
          <button className='flex bg-slate-950 space-x-2 items-center py-4 px-2 justify-center '>
              <ChevronLeft/>
          </button>
      </div>
    </div>
  );
}
