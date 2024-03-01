'use client'
import Link from "next/link";
import React, {useEffect} from "react";

export default function Home() {
  
  return (
   
    <div className='flex items-center justify-center min-h-screen flex-col '>
     <h2 className="text-3xl mb-4">inventory managment</h2>
     <Link href={"/invdashboard/home/dashboard"}>View dashboard</Link>

    </div>
  );
}
