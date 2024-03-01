import React from 'react'
import Header from './components/dashboard/header';
import Sidebar from './components/dashboard/Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex">
    <Sidebar/>
      <main className="w-full bg-slate-100 min-h-screen ml-56"><Header/>{children}</main>
    </div>
  );
}

