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
    const [tournaments,setTournaments]=useState([])
    const [courts,setCourts]=useState([])
    const [memberships,setMemberships]=useState([])
    const [discounts,setDiscounts]=useState([])
    const [trainers,setTrainers]=useState([])
    const [trainees,setTrainees]=useState([])
  useEffect(() => {
    const getClasses = async () => {
        const querySnapshot = await getDocs(classesCollection);
        const data= querySnapshot.docs.map((doc)=>({id:doc.id,...doc.data()}))
        setClasses(data)
    }
    const getTournaments= async () => {
      const querySnapshot = await getDocs(collection(db, "Competitions"));
      const data= querySnapshot.docs.map((doc)=>({id:doc.id,...doc.data()}))
      setTournaments(data)
  }


    getClasses()
    getTournaments()
    },[])

    useEffect(()=>{
      const getMemberships=async()=>{
          const ref=await getDocs(collection(db,'Memberships'))
          const data=ref.docs.map((doc)=>({id:doc.id,...doc.data()}))
          setMemberships(data)
      }
      getMemberships()
    },[])

    useEffect(()=>{
      const getMemberships=async()=>{
          const ref=await getDocs(collection(db,'Discounts'))
          const data=ref.docs.map((doc)=>({id:doc.id,...doc.data()}))
          setDiscounts(data)
      }
      getMemberships()
    },[])

useEffect(()=>{
  const geetTrainers=async ()=>{
    const trainersRef= await getDocs(collection(db,'Trainees'))
    const trainersData= trainersRef.docs.map((doc)=>({id:doc.id,...doc.data()}))
    setTrainees(trainersData)
  }
  geetTrainers()
  },[])
  useEffect(()=>{
    const geetTrainers=async ()=>{
      const trainersRef= await getDocs(collection(db,'Trainers'))
      const trainersData= trainersRef.docs.map((doc)=>({id:doc.id,...doc.data()}))
      setTrainers(trainersData)
    }
    geetTrainers()
    },[])


useEffect(() => {
  const fetchCourtsAndReservations = async () => {
    try {
      const courtsQuerySnapshot = await getDocs(collection(db, 'Courts'));
      const matches = [];
  
      const courtsData = await Promise.all(
        courtsQuerySnapshot.docs.map(async (courtDoc) => {
          const courtData = courtDoc.data();
          const reservationsQuerySnapshot = await getDocs(collection(courtDoc.ref, 'Reservations'));
  
          const reservationsData = reservationsQuerySnapshot.docs.map((resDoc) => ({
            id: resDoc.id,
            ...resDoc.data()
          }));
  
          matches.push(reservationsData);
          return {
            id:courtDoc.id,
            name: courtData.name,
            reservations: reservationsData,
          };
        })
      );
      setCourts(courtsData);
    } catch (error) {
      console.error('Error fetching courts and reservations:', error);
    }
  };

  fetchCourtsAndReservations();
}, []);
  return (
    <AppContext.Provider value={{ exampleState, setExampleState,classes,setClasses,tournaments,setTournaments,courts,setCourts,discounts,setDiscounts,memberships,setMemberships,trainers,trainees}}>
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
