'use client'
import { useState } from 'react';
import { useEffect } from 'react';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter()
  const [user,setUser]=useState({})
  const auth = getAuth();
  useEffect(() => {

    onAuthStateChanged(auth,  (user) => {
        if (user) {
setUser(user)
        } else {
  
    
        }
    });
}, []);
  const handleSignIn = async () => {

   await signInWithEmailAndPassword(auth, email, password).then((a)=>    setUser(a.user))
  }

  return (
    <div className="min-h-screen flex items-center justify-center  w-full" style={{backgroundColor:'#0E2433'}}>
      <div className="bg-gray-800 p-10 rounded-lg flex-col shadow-xl w-96 flex items-center justify-center">
      <img
      src="/logo-expanded.png"
      alt="Your Image"
      style={{ height:'100px',marginBottom:"15px" }}
    />
      
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>
        <div className='text-white'>
          {user && JSON.stringify(user)}
        </div>
      </div>
    </div>
  );
};

export default SignIn;