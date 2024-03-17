'use client'
import React, { useState, useEffect } from 'react';
import { db } from '/app/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc, doc,
  
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Clock, Clock12, Clock4 } from 'lucide-react';

const Item = ({ item, onNavigate }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleNavigate = () => {
    onNavigate(item);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  const handleClose = () => {
    setShowForm(false);
  };

  return (
    <div
      className="bg-gray-100 p-1 rounded-md cursor-pointer hover:shadow-lg relative"
      style={{
        width: '300px',
        height: '300px',
        
        margin: '10px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        color: '#000' // Setting text color to black
      }}
      onClick={handleNavigate}
    >
      <div className="flex items-start">
        
      <div>
          {item.image && <img src={item.image} alt="Class" className="w-16 h-16 rounded-full" />}
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold">{item.className}</p>
          <p className="text-sm">Time: {item.classTime[0].startTime} - {item.classTime[0].endTime}, {item.classTime[0].day}</p>

          <div className="items-start w-full h-px bg-gray-400 my-2 mt-8 ml-0"></div>
          <div className="flex flex-wrap mb-2">
            {item.participants && item.participants.map((participant, index) => (
              <img key={index} src={participant.image} alt={`Participant ${index + 1}`} className="w-8 h-8 rounded-full mr-1" />
            ))}
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-20 ml-10" onClick={toggleDetails}>
            View Details
          </button>
        </div>
      </div>
      {showDetails && (
  <div className="fixed inset-0 flex bg-indigo-600 bg-opacity-50 justify-end items-center h-full overflow-auto" style={{ height: 'calc(100% )' }}>
  <button onClick={toggleDetails} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <div className="w-3/6 h-full bg-white border rounded-t flex flex-col justify-start items-start">
    <div className='flex'>

    <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Class Details</h2>
    <div className='ml-72'/>
    <div className="mt-4" >
      <strong className='ml-2 mt-4 mb-6'>Class ID</strong> 
      <input className="rounded-lg ml-5" type="text" readOnly value={item.ref} />
    </div>
    </div>
    <h1 className="text-lg font-bold ml-4 mb-2">General Information</h1>


    <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>

      <div className="ml-4 grid grid-cols-3 gap-4">
        
        <div>

        
          <strong>Name</strong> 
          <input className="rounded-lg" type="text" readOnly value={item.className} />
        </div>
        <div>
          <strong>Sport</strong> 
          <input className="rounded-lg" type="text" readOnly value={`${item.classTime[0].startTime} - ${item.classTime[1].endTime}, ${item.classTime[0].day}`} />
        </div>
        <div>
          <strong>Features</strong> 
          <input className="rounded-lg" type="text" readOnly value={item.features.join(', ')} />
        </div>
        <div>
          <strong>Start date</strong> 
          <input className="rounded-lg" type="text" readOnly value={item.className} />
        </div>
        <div>
          <strong>End date</strong> 
          <input className="rounded-lg" type="text" readOnly value={`${item.classTime[0].startTime} - ${item.classTime[1].endTime}, ${item.classTime[0].day}`} />
        </div>
        <div>
          <strong>Registration deadline</strong> 
          <input className="rounded-lg" type="text" readOnly value={item.features.join(', ')} />
        </div>
      </div>

    </div>
    
    <h3 className="text-lg font-bold ml-4 mb-2">Time</h3>
    <div className="p-6 mt-4  border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
    <div className='ml-4 grid grid-cols-3 gap-1'>
         <div >
          <strong>Date 1</strong> <br />
          <input className="rounded-lg" type="text" readOnly value={` ${item.classTime[0].day}, ${item.classTime[0].startTime} - ${item.classTime[0].endTime}`} />
          </div>
          <div>
          <strong>Date 2</strong> <br />
          <input className="rounded-lg" type="text" readOnly value={` ${item.classTime[1].day}, ${item.classTime[1].startTime} - ${item.classTime[1].endTime}`} />
          </div>
          <div>
          <strong>Date 3</strong> <br />
          <input className="rounded-lg" type="text" readOnly value={`${item.classTime[0].day}, ${item.classTime[0].startTime} - ${item.classTime[0].endTime}`} />
          </div>
          
        </div>
        </div>
    <h3 className="text-lg font-bold ml-4 mb-2">Restrictions</h3>
    <div className="p-6 mt-4  border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
     
      <div className="grid grid-cols-3 gap-4">
        <div>
          <strong>Min. Players</strong> <br />
          <input className="rounded-lg" type="text" readOnly value={item.minmumNumber} />
        </div>
        <div>
          <strong>Max. Players</strong> <br />
          <input className="rounded-lg" type="text" readOnly value={item.maximumNumber} />
        </div>

        <div>
          <strong>Level</strong> <br />
          <input className="rounded-lg" type="text" readOnly value={item.level} />
        </div>
        <div>
          <strong>Average Age</strong> <br />
          <input className="rounded-lg mt-2" type="text" readOnly value={item.age} />
        </div>
        <div>
          <strong>Price</strong> 
          <input className="rounded-lg mt-2" type="text" readOnly value={`$${item.price}`} />
        </div>
      </div>
    </div>
    <strong className="text-lg font-bold ml-4">Description</strong>
<div className='bg-white w-full'>
    <input className="p-2 mt-4 border shadow-lg rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }} type="text" readOnly value={item.description} />
    <button  className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10">Edit</button>
    <button  className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10">Submit</button>
  </div>
  </div>
  
  
</div>
      )}




    </div>
  );
};

const NewItem = ({ onSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [className, setClassName] = useState('');
  const [sport , setSport]= useState('')
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endday, setEndDay] = useState('');
  const [firstDay,setFirstday]= useState('')
  const [secondDay,setSecond]= useState('')
  const [thirdDay,setThirdDay]= useState('')
  const [forthDay,setForth]= useState('')
  const [features, setFeatures] = useState('');
  const [price, setPrice] = useState(0);
  const [minmumNumber, setMinmumNumber] = useState(0);
  const [maximumNumber, setMaximumNumber] = useState(0);
  const [level, setLevel] = useState(0);
  const [averageAge, setAverageAge] = useState('');
  const [description, setDescription] = useState('');

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add data to Firebase
      const docRef = await addDoc(collection(db, 'Classes'), {
        className:className,
        classStartDate: [{ startTime }],
        classStartDate:[{endTime }],
        features: features.split(',').map(feature => feature.trim()),
        price:price,
        minmumNumber:minmumNumber,
        maximumNumber:maximumNumber,
        level:level,
        age:averageAge,
        description:description
      });
      console.log('Document written with ID: ', docRef.id);
      // Clear form data after submission
      
      // Call onSubmit function passed from parent component
      onSubmit();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  const handleClose = () => {
    setShowForm(false);
  };
  return (
    <>
      {!showForm ? (
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
        onClick={toggleForm}
      >
        <span className="text-5xl">+</span>
      </div>
    ) : (
      <div className="fixed inset-0 h-full flex bg-indigo-600 bg-opacity-50 justify-end items-center overflow-scroll mb-10" style={{ height: '100%' }}>
        <button onClick={handleClose} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      
        <div className="w-3/6 h-full bg-white border rounded-lg flex flex-col justify-start items-start">
          <div className='flex'>
            <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Class Details</h2>
            <div className='ml-72'/>
            <div className="mt-4">
              <strong className='ml-2 mt-4 mb-6'>Class ID</strong> 
              <input className="rounded-lg ml-5" type="text" placeholder="Enter Class ID" />
            </div>
          </div>
          <h1 className="text-lg font-bold ml-4 mb-2">General Information</h1>
      
          <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
            <div className="ml-4 grid grid-cols-3 gap-4">
              <div>
                <strong>Name</strong> 
                <input className="rounded-lg" type="text" placeholder="Enter Name" value={className} onChange={(e) => setClassName(e.target.value)} />

              </div>
              <div>
                <strong>Sport</strong> 
                <input className="rounded-lg" type="text" placeholder="Enter Sport" value={sport} onChange={(e) => setSport(e.target.value)} />
              </div>
              <div>
                <strong>Features</strong> 
                <input className="rounded-lg" type="text" placeholder="Enter Features" value={features} onChange={(e) => setFeatures(e.target.value)} />
              </div>
              <div>
                <strong>Start date</strong> 
                <input className="rounded-lg" type="text" placeholder="Enter Start Date" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <strong>End date</strong> 
                <input className="rounded-lg" type="text" placeholder="Enter End Date" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
              <div>
                <strong>Registration deadline</strong> 
                <input className="rounded-lg" type="text" placeholder="Enter Registration Deadline" value={endday} onChange={(e) => setEndDay(e.target.value)} />
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-bold ml-4 mb-2">Time</h3>
          <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
            <div className='ml-4 grid grid-cols-3 gap-1'>
              <div>
                <strong>Date 1</strong> <br />
                <input className="rounded-lg" type="text" placeholder="Enter Date 1" value={firstDay} onChange={(e) => setFirstday(e.target.value)} />
              </div>
              <div>
                <strong>Date 2</strong> <br />
                <input className="rounded-lg" type="text" placeholder="Enter Date 2" value={secondDay} onChange={(e) => setSecond(e.target.value)}/>
              </div>
              <div>
                <strong>Date 3</strong> <br />
                <input className="rounded-lg" type="text" placeholder="Enter Date 3" value={thirdDay} onChange={(e) => setThirdDay(e.target.value)} />
              </div>
            </div>
          </div>
      
          <h3 className="text-lg font-bold ml-4 mb-2">Restrictions</h3>
          <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <strong>Min. Players</strong> <br />
                <input className="rounded-lg" type="text" placeholder="Enter Min. Players" value={minmumNumber} onChange={(e) => setMinmumNumber(e.target.value)} />
              </div>
              <div>
                <strong>Max. Players</strong> <br />
                <input className="rounded-lg" type="text" placeholder="Enter Max. Players" value={maximumNumber} onChange={(e) => setMaximumNumber(e.target.value)}/>
              </div>
              <div>
                <strong>Level</strong> <br />
                <input className="rounded-lg" type="text" placeholder="Enter Level" value={level} onChange={(e) => setLevel(e.target.value)} />
              </div>
              <div>
                <strong>Average Age</strong> <br />
                <input className="rounded-lg mt-2" type="text" placeholder="Enter Average Age" value={averageAge} onChange={(e) => setAverageAge(e.target.value)} />
              </div>
              <div>
                <strong>Price</strong> 
                <input className="rounded-lg mt-2" type="text" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
          </div>
       
          <strong className='ml-4 '>Description</strong>
          <div className='h-full w-full bg-white mb-10'  style={{ width: 'calc(100%  )', height: 'calc(100%)',backgroundColor: 'white'}}>
          <input className="p-2 mt-4 bg-white border shadow-lg rounded-lg ml-4 mr-4 mb-6 w-full"  style={{ width: 'calc(100% - 24px)',backgroundColor: 'white'}} type="text" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />
         
          
         
          <button onClick={handleSubmit} className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10">Add New</button>
          </div>
       </div>
       
       
      </div>
      
    )}
  </>
);
};


const Dashboard = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const classesCollectionRef = collection(db, 'Classes');
      try {
        const querySnapshot = await getDocs(classesCollectionRef);
        const classesData = querySnapshot.docs.map(doc => doc.data());
        setItems(classesData);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const navigateToDetails = (item) => {
    // You can define your navigation logic here
    console.log("Navigate to details:", item);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4 text-center">Class List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <Item key={index} item={item} onNavigate={navigateToDetails} />
        ))}
        {/* This anchor tag will open a new tab, you may want to replace it with your custom logic */}
       
          <NewItem />
        
      </div>
    </div>
  );
};

export default Dashboard;
