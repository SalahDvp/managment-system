'use client';
import React,{useState, useEffect } from 'react';

import { db } from '/app/firebase'; 
import {
  collection,
  doc,
  onSnapshot,
  GeoPoint,
  getDocs,
  updateDoc,
  query,
  orderBy,
  startAt,
  endAt,
  where,
  arrayUnion,
} from 'firebase/firestore';


const Item = ({ item, onNavigate }) => {
  useEffect(() => {
    console.log('looloeel2');
  }, [])

  const handleNavigate = () => {
    onNavigate(item);
  };

  let playerImages = [];
  if (item.players) {
    playerImages = item.players.slice(0, 5).map((player, index) => (
      <img
        key={index}
        src={player.imageUrl}
        alt={`Player ${index + 1}`}
        className="w-8 h-8 rounded-full mr-2"
      />
    ));

    if (item.players.length > 5) {
      playerImages.push(
        <div key="plus" className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full mr-2">
          +{item.players.length - 5}
        </div>
      );
    }
  }

  return (
    <div
    className="bg-gray-100 p-1 rounded-md cursor-pointer hover:shadow-lg relative"
    style={{
      width: '300px',
      height: '300px',
      margin: '10px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}
    onClick={handleNavigate}
  >
    <div className="flex items-center justify-between">
      
      <div>
        <p className="text-lg font-semibold">{item.name}</p>
        <p className="text-sm ">{item.schedule}</p>
        {item.players && (
          <p className="text-sm ">Total Attendees: {item.players.length}</p>
        )}
      </div>
      
    </div>
    <div className="border-t border-gray-300 my-4"></div>
    <div className="flex flex-wrap mb-4">{playerImages}</div>
    <div>
        {item.icon && <span className="text-2xl absolute bottom-2">{item.icon}</span>}
      </div>
    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg absolute bottom-4 right-4" onClick={handleNavigate}>
      View Details
    </button>
  </div>
  
  

  );
};

const NewItem = ({ onClick }) => (
  
  <div
    className="bg-gray-200 p-3 rounded-md cursor-pointer hover:shadow-lg flex items-center justify-center"
    style={{
      width: '300px',
      height: '300px',
      margin: '10px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      textAlign: 'center',
    }}
    onClick={onClick}
  >
    <span className="text-5xl">+</span>
  </div>
);


const Dashboard = () => {
  useEffect(() => {
    console.log('looloeel');
  }, [])
  console.log('dashboard is working ');
  const fetchClasses = async () => {
    const classesCollectionRef = collection(db, 'Classes');
    
    try {
      // Get all documents from the "Classes" collection
      const querySnapshot = await getDocs(classesCollectionRef);
      const classesData = querySnapshot.docs.map((doc) => doc.data());
      setItems(classesData);
      console.log(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };
  useEffect(() => {
    console.log('cefcwfee')
    
  }, [])
  
  useEffect(() => {
    console.log('looloeel')

  },)

  
  return (
    <div className="container mx-auto">
    <h1 className="text-3xl font-bold my-4 text-center">Class List</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
     
      
       <a href="/your-url-here" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
      <NewItem />
      </a>
    </div>
  </div>
  );
};

export default Dashboard;

