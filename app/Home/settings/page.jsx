"use client"
import { db } from "@/app/firebase"
import { arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

const Settings=()=>{
    const [clubInformation,setClubInformation]=useState({courts:[]})
    useEffect(()=>{
        const getClubInfo=async()=>{
            const clubInfoRef=doc(db,'Club','GeneralInformation')
            const clubinfoData=await getDoc(clubInfoRef)
          setClubInformation(clubinfoData.data())
    
        }
getClubInfo()
    },[])
    const handleAddCourt = () => {
        const newCourt = prompt('Enter the new court name:');
        if (newCourt) {
            setClubInformation((prev) => ({
                ...prev,
                courts: [...prev.courts, newCourt],
              }));
              updateDoc(doc(db,'Club','GeneralInformation'),{
                courts:arrayUnion(newCourt)
              })
        }
      };
    
      const handleRemoveCourt = () => {
        const updatedCourts = courts.filter((_, idx) => idx !== clubInformation.courts.length-1);
        setClubInformation((prev) => ({
            ...prev,
            court:updatedCourts,
          }));
      };
    console.log(clubInformation);
return(
    <>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet" />


<div class="mx-4 max-w-screen-xl sm:mx-8 xl:mx-auto">
  <h1 class="border-b py-6 text-4xl font-semibold">Settings</h1>
  <div class="grid grid-cols-8 pt-3 pb-10 sm:grid-cols-10">
    <div class="relative my-4 w-56 sm:hidden">
      <input class="peer hidden" type="checkbox" name="select-1" id="select-1" />
      <label for="select-1" class="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-700 peer-checked:ring">Teams </label>
      <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>

    </div>

    <div class="col-span-2 hidden sm:block">
      <ul>
        <li class="mt-5 cursor-pointer border-l-2 border-l-blue-700 px-2 py-2 font-semibold text-blue-700 transition hover:border-l-blue-700 hover:text-blue-700">Settings</li>
        {/* <li class="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">Accounts</li> */}
  
      </ul>
    </div>

    <div class="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
      <div class="pt-4">
        <h1 class="py-2 text-2xl font-semibold">Settings</h1>
         <p class="font- text-slate-600">Court info,Description,Location,Images,Courts....</p> 
      </div>
      <hr class="mt-4 mb-8" />
      <p class="py-2 text-xl font-semibold">Court Info</p>

      <div class="grid grid-cols-3 gap-3 flex items-center">
          <label for="club-name">
            <span class="text-sm text-gray-500">Club Name</span>
            <div class="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
              <input type="text" name='name' id="club-name" class="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" value={clubInformation?.name} />
            </div>
          </label>
          <label for="club-website">
            <span class="text-sm text-gray-500">Website</span>
            <div class="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
              <input type="website" id="club-website" class="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"  />
            </div>
          </label>
          <label for="club-phone">
            <span class="text-sm text-gray-500">Phone</span>
            <div class="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
              <input type="number" id="club-phone" class="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"  />
            </div>
          </label>

        </div>


      <hr class="mt-4 mb-8" />
      <p class="py-2 text-xl font-semibold">Location</p>
      <div class="space-y-1">
        <div class="rounded-md border ">
 
          <div class="flex flex-col space-y-3 px-4 py-6 sm:px-10">
            <label class="block" for="address">
              <p class="text-sm">Address</p>
              <input class="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1 bg-white" type="text" value={clubInformation?.address} />
            </label>
           
          </div>
        </div>
      </div>

      <hr class="mt-4 mb-8" />
      <p class="py-2 text-xl font-semibold">Description</p>
      <div class="space-y-1">
        <div class="rounded-md border ">
 
        <div class="flex flex-col space-y-3 px-4 py-6 sm:px-10">
  <label class="block" for="description">
    <p class="text-sm">Description</p>
    <textarea class="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1 bg-white" id="description" rows="4" value={clubInformation?.description}></textarea>
  </label>
</div>
        </div>
      </div>
      
      <hr class="mt-4 mb-8" />
      <div >
      <p class="text-sm">Courts</p>
  <svg xmlns="http://www.w3.org/2000/svg" class="absolute top-0 right-0 m-5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <div className="mt-3 flex  space-x-1" id="courtsContainer">
  {clubInformation?.courts?.map((court, index) => (
        <div
          key={index}
          className="flex h-12 w-16 cursor-pointer items-center justify-center rounded-md bg-sky-200 font-bold text-blue-900 hover:bg-blue-300"
        >
          {court}
        
        </div>
      ))}
  </div>
  <div class="mt-2 flex justify-between text-sm text-gray-400">
  <div
        className="flex h-12 w-16 cursor-pointer items-center justify-center rounded-md bg-red-200 font-bold text-red-900 hover:bg-red-300 align-center flex text-center"

      >
        remove court
      </div>
          <div
        className="flex h-12 w-16 cursor-pointer items-center justify-center rounded-md bg-sky-200 font-bold text-blue-900 hover:bg-blue-300 text-center"
onClick={handleAddCourt}
      >
        add court
      </div>
  </div>
  </div>
  <hr class="mt-4 mb-8" />
    </div>

  </div>
</div>

    </>
  
)
}
export default Settings