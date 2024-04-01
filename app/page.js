
'use client'
import React from "react";
import LottiePlayer from "@lottiefiles/react-lottie-player";
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { auth } from "./firebase";
import { redirect } from 'next/navigation'
import { useEffect,useState} from "react";
import Router, { useRouter } from "next/navigation"
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";




   
const DashboardPage = () => {
  const animationURL = "https://assets3.lottiefiles.com/packages/lf20_JExdDIS87T.json";
  const pathname = usePathname()
  const router=useRouter()
//   useEffect(() => {

//       onAuthStateChanged(auth, async (user) => {
//           if (user) {

//               router.replace('/Home/firstpage')
//               console.log(user);
//           } else {
    
//               router.push("/Auth")
//           }
//       });
// }, []);
const aa=()=>{
  onAuthStateChanged(auth, async (user) => {
console.log(user);
});
} 

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor:'#0E2433', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button className="px-3 py-1 bg-red-500 text-white rounded mr-2" onClick={() => aa()}>Absent</button>

    <Player
      autoplay
      loop
      src={require("@/public/animations/loadingAnimation.json")}
      style={{ width: '300px', height: '300px' }}
    />
    <img
      src="/logo-expanded.png"
      alt="Your Image"
      style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', height:'100px' }}
    />
  </div>
  )
};

export default DashboardPage;