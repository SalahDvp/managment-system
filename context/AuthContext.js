"use client"
import React, { createContext, useState,useContext,useEffect} from 'react';
import { db } from '@/app/firebase';
import { getDocs,collection} from 'firebase/firestore';
// Create the context
export const AppContext = createContext();

// Create the provider component
export const  AppProvider = ({ children }) => {
  // State or any other logic you want to manage with context
  const [exampleState, setExampleState] = useState('loool');
  const classesCollection = collection(db, "Classes");
    const [classes,setClasses]=useState([])
  useEffect(() => {
    const getClasses = async () => {
        const querySnapshot = await getDocs(classesCollection);
        const data= querySnapshot.docs.map((doc)=>({id:doc.id,...doc.data()}))
        setClasses(data)
    }
    getClasses()
    },[])
  return (
    <AppContext.Provider value={{ exampleState, setExampleState,classes,setClasses}}>
      {children}
    </AppContext.Provider>
  );
};
export const  useAuth =()=>{


 
    const value=useContext(AppContext)
    try{
    if(!value){
        throw new Error("Error not wrapped inside layout  ",)
    }   }catch(e){
        console.log(e);
    }
    return value
}
