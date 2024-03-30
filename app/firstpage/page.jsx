
'use client'

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'jspdf-autotable';
import { addDoc, collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { addDays } from '@fullcalendar/core/internal';
const formatDate = (date) => {
  const options = { day: 'numeric', month: 'short' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
function calculateNetRevenue(payments, refunds) {
  // Merge payments and refunds into a single array with type information
  const mergedData = [...payments.map(payment => ({ type: 'payment', ...payment })),
  ...refunds.map(refund => ({ type: 'refund', ...refund }))];
  
  // Sort merged data by date, from oldest to newest
  mergedData.sort((a, b) => new Date(a.date.toDate()) - new Date(b.date.toDate()));

    let netRevenue = 0;
  const netRevenueData = [];
  
  // Calculate net revenue for each day
  mergedData.forEach(item => {
  if (item.type === 'payment') {
   
  netRevenue += item.price;

  } else if (item.type === 'refund') {
  netRevenue -= item.price;
  }
  
  // Add net revenue for the current day to the data array
  netRevenueData.push({ date: new Date(item.date.toDate()), netRevenue });
  });

  return netRevenueData;
  }
const RevenueLineChart = ({ payments, refunds }) => {


const netRevenueData = calculateNetRevenue(payments, refunds);

  return (


    <ResponsiveContainer width="100%" height={400}>
    <LineChart width={600} height={400} data={netRevenueData}>
      
        <XAxis dataKey="date" type="category" tickFormatter={formatDate} tick={{color:"#0e2433" }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="netRevenue" stroke="#0e2433" />
      </LineChart>
      </ResponsiveContainer>
    

  );
};
const Dashboard = () => {
const [payments,setPayments]=useState({payments:[],refunds:[]})
const [status,setStatus]=useState({totalMatches:0,revenue:0,users:0,coaches:0,totalReservation:0})
const [attendance,setAttendance]=useState([])
const [showAddRow, setShowAddRow] = useState(false);
const [newPlayerDetails, setNewPlayerDetails] = useState({
timeIn:{hours:'',minutes:''},
timeOut:{hours:'',minutes:''},
uid:'dadawww',
name:'',
});
const [selectedAttendance,setSelectedAttendance]=useState({date:new Date(),listData:[]})
const [trainers, setTrainers] = useState([]);
const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date
const hours = Array.from({ length: 24 }, (_, i) => ('0' + i).slice(-2)); // Array of 24 hours
const minutes = Array.from({ length: 60 }, (_, i) => ('0' + i).slice(-2)); // Array of 60 minutes
useEffect(()=>{

  const getData = async () => {
    try {
      const paymentsSnapshot = await getDocs(collection(db, 'Club', 'GeneralInformation', 'PaymentReceived'));
      const refundsSnapshot = await getDocs(collection(db, 'Club', 'GeneralInformation', 'PaymentRefund'));
 const totalUsers=await getDocs(collection(db,'Trainees'))
 const totalCoaches=await getDocs(collection(db,'Trainers'))
    let matchReservations = 0;
let   totalDuration = 0
    const courtsSnapshot = await getDocs(collection(db, 'Courts'));

    for (const courtDoc of courtsSnapshot.docs) {
      const matchId = courtDoc.data().name; // Assuming 'name' is the field containing matchId
      const reservationsQuery = query(collectionGroup(db, 'Reservations'));
      const reservationsSnapshot = await getDocs(reservationsQuery);
      const reservationsCount = reservationsSnapshot.size;
      reservationsSnapshot.forEach((reservationDoc) => {
        const reservationData = reservationDoc.data();
        // Assuming each reservation has a 'duration' field representing the duration in minutes
        totalDuration += reservationData.duration || 0; // Add the duration to totalDuration
      });
      matchReservations+=reservationsCount 
    }


      const paymentsData = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const refundsData = refundsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const netRevenue= calculateNetRevenue(paymentsData, refundsData);
      setStatus({totalMatches:matchReservations,revenue:netRevenue[netRevenue.length - 1].netRevenue,users:totalUsers.size,coaches:totalCoaches.size,totalReservation:totalDuration})
      setPayments({ payments: paymentsData, refunds: refundsData });
    } catch (error) {
      console.error('Error fetching payments and refunds:', error);
      // Handle error as needed
    }
  };
  getData()
},[])

useEffect(() => {

  const fetchTrainers = async () => {
    try {
      const attendanceData = [];
      const trainersCollectionRef = collection(db, 'Attendance');
      const querySnapshot = await getDocs(trainersCollectionRef,orderBy("date","desc"));
      const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      for (const doc of docs) {
        const listSnapshot = await getDocs(collection(db, 'Attendance', doc.id, 'List'));
        const listData = listSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        attendanceData.push({ ...doc, listData });
     
      }

      // Now attendanceData contains listData for each attendance entry
     setAttendance(attendanceData)
setSelectedAttendance(attendanceData[0])
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  fetchTrainers();
}, []);
console.log(attendance);
useEffect(() => {

  const fetchTrainers = async () => {
      try {
          const trainersCollectionRef = collection(db, 'Trainers');
          const querySnapshot = await getDocs(trainersCollectionRef);
          const trainersData = [];
          querySnapshot.forEach((doc) => {
              const trainerData ={uid:doc.id, ...doc.data()};
              trainersData.push(trainerData);
          });
          setTrainers(trainersData);
      } catch (error) {
          console.error('Error fetching trainers:', error);
      }
  };

  fetchTrainers();
}, []);
useEffect(()=>{

  const filterAttendanceByDate = (attendanceData, selectedDate) => {
    const filteredAttendance = attendanceData.filter((attendance) => {
      const attendanceDate =attendance.date.seconds? new Date(attendance.date.toDate()) :attendance.date;
// Assuming attendance.date is the date in attendanceData
      return attendanceDate.toDateString() === selectedDate.toDateString();
    });

    if(filteredAttendance.length>0){
      setSelectedAttendance(filteredAttendance[0])
    
    }else{
      setSelectedAttendance({date:selectedDate,listData:[]})
    }

  };
  filterAttendanceByDate(attendance,selectedDate)
},[selectedDate])

  const convertMinutesToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours},${remainingMinutes}`;
  };

  const handleTimeInHourChange = (event, index) => {
    const updatedTrainers = JSON.parse(JSON.stringify(selectedAttendance.listData)); // Deep copy
    updatedTrainers[index].timeIn.hours = event.target.value;
    setSelectedAttendance((prev) => ({
      ...prev,
      listData: updatedTrainers,
    }));
  };
  
  const handleTimeInMinuteChange = (event, index) => {
    const updatedTrainers = JSON.parse(JSON.stringify(selectedAttendance.listData)); // Deep copy
    updatedTrainers[index].timeIn.minutes = event.target.value;
    setSelectedAttendance((prev) => ({
      ...prev,
      listData: updatedTrainers,
    }));
  };
  
  const handleTimeOutHourChange = (event, index) => {
    const updatedTrainers = JSON.parse(JSON.stringify(selectedAttendance.listData)); // Deep copy
    updatedTrainers[index].timeOut.hours = event.target.value;
    setSelectedAttendance((prev) => ({
      ...prev,
      listData: updatedTrainers,
    }));
  };
  
  const handleTimeOutMinuteChange = (event, index) => {
    const updatedTrainers = JSON.parse(JSON.stringify(selectedAttendance.listData)); // Deep copy
    updatedTrainers[index].timeOut.minutes = event.target.value;
    setSelectedAttendance((prev) => ({
      ...prev,
      listData: updatedTrainers,
    }));
  };
  
  const handleAbsent = (index) => {
    const updatedTrainers = JSON.parse(JSON.stringify(selectedAttendance.listData)); // Deep copy
    updatedTrainers[index].timeIn = { hours: '00', minutes: '00' };
    updatedTrainers[index].timeOut = { hours: '00', minutes: '00' };
    setSelectedAttendance((prev) => ({
      ...prev,
      listData: updatedTrainers,
    }));
  };
  const handleRemove = (playe) => {
    // Filter out the player from selectedAttendance.listData
    const updatedListData = selectedAttendance.listData.filter(player => player.uid !== playe.uid);
    // Update selectedAttendance with the filtered list
    const updatedSelectedAttendance = { ...selectedAttendance, listData: updatedListData };
    setSelectedAttendance(updatedSelectedAttendance);
  

  };



const createDateWithTime = (date, hours, minutes) => {
  // Convert hours and minutes to numbers
  const hoursNum = parseInt(hours, 10);
  const minutesNum = parseInt(minutes, 10);

  // Create a new date with the given date, hours, and minutes
  const newDate = new Date(date);
  newDate.setHours(hoursNum);
  newDate.setMinutes(minutesNum);

  return newDate;
};
const handleSubmitToDatabase = async () => {

      
      try {
        const index = attendance.findIndex(item => new Date(item.date.seconds?item.date.toDate():item.date).toDateString() === selectedDate.toDateString());

        if (index !== -1) {
          const aa = attendance[index].listData;
          // Attendance with the same date exists, update it
          const updatedAttendance = [...attendance];
          updatedAttendance[index].listData = selectedAttendance.listData;

          // Update or remove listData documents in Firestore
   
        
          

          // Iterate through selectedAttendance.listData
          selectedAttendance.listData.forEach(async (selectedPlayer) => {
            const existingPlayer = aa.find((player) => player.id === selectedPlayer.id);
               
    
            if (existingPlayer) {
              // Compare content
              if (JSON.stringify(existingPlayer) !== JSON.stringify(selectedPlayer)) {
         
                await setDoc(doc(db, 'Attendance', selectedAttendance.id, 'List',existingPlayer.id),{uid:selectedPlayer.uid,
                  name:selectedPlayer.name,
                  timeIn:selectedPlayer.timeIn,
                  timeOut:selectedPlayer.timeOut,
                  startTime:createDateWithTime(selectedDate,selectedPlayer.timeIn.hours,selectedPlayer.timeIn.minutes),
                  endTime:createDateWithTime(selectedDate,selectedPlayer.timeOut.hours,selectedPlayer.timeOut.minutes)});
               console.log(`Player ${existingPlayer.name} updated in listData`);
              }
            
            } else {
           
          const ref=await addDoc(collection(db, 'Attendance', selectedAttendance.id, 'List'), { uid:selectedPlayer.uid,
              name:selectedPlayer.name,
              timeIn:selectedPlayer.timeIn,
              timeOut:selectedPlayer.timeOut,
              startTime:createDateWithTime(selectedDate,selectedPlayer.timeIn.hours,selectedPlayer.timeIn.minutes),
              endTime:createDateWithTime(selectedDate,selectedPlayer.timeOut.hours,selectedPlayer.timeOut.minutes)});
              console.log(ref,selectedPlayer.uid);
             const b=await addDoc(collection(db, 'Trainers', selectedPlayer.uid, 'attendance'),{Ref:ref});
             console.log(b.path);
            }
          });
          
          // Check for removed items in aa
          for (const player of aa) {
            const isRemoved = !selectedAttendance.listData.some((selectedPlayer) => selectedPlayer.uid === player.uid);
        
            if (isRemoved) {
        
              await deleteDoc(doc(db, 'Trainers', player.uid, 'attendance', player.id));
              await deleteDoc(doc(db, 'Attendance', selectedAttendance.id, 'List',player.id));
            }
          }
       setAttendance(updatedAttendance)
        } else {
       
          // Attendance with the selected date does not exist, add it
          const newAttendance = [...attendance, selectedAttendance];
          const atRef=await addDoc(collection(db,'Attendance'),{date:selectedAttendance.date})
          for (const player of selectedAttendance.listData) {

            const playerDocRef = await addDoc(collection(db, 'Attendance', atRef.id, 'List'), {
              uid:player.uid,
              name:player.name,
              timeIn:player.timeIn,
              timeOut:player.timeOut,
              startTime:createDateWithTime(selectedAttendance.date,player.timeIn.hours,player.timeIn.minutes),
              endTime:createDateWithTime(selectedAttendance.date,player.timeOut.hours,player.timeOut.minutes)
            });
            
            // Update the player document with the reference to Listdata
            await addDoc(collection(db, 'Trainers', player.uid,"attendance"), {
              Ref:playerDocRef,
            });
          }
          setAttendance(newAttendance);
        }
      } catch (error) {
        console.error('Error handling attendance:', error);
      }
    };
    const handleDownloadExcel = () => {
      const wb = XLSX.utils.book_new();
    
      // Loop through each attendance entry
      attendance.forEach((entry, index) => {
        const formattedDate = new Date(entry.date.seconds?entry.date.toDate():entry.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
        // Prepare data for Excel
        const data = entry.listData.map(trainer => ({
          Name: trainer.name,
          'Time In': `${trainer.timeIn.hours}:${trainer.timeIn.minutes}`,
          'Time Out': `${trainer.timeOut.hours}:${trainer.timeOut.minutes}`
        }));
    
        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(data);
    
        // Add the title row above the data
        XLSX.utils.sheet_add_aoa(ws, [[`Attendance of ${formattedDate}`]], { origin: 'A1' });
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, `Attendance_${index + 1}`);
      });
    
      // Generate a file name for the Excel file
      const fileName = 'Attendance_Data.xlsx';
    
      // Export the workbook to a file
      XLSX.writeFile(wb, fileName);
    };
const handleAddRow = () => {
    setShowAddRow(true);
  };
 const handleCancelAddRow = () => {
    setShowAddRow(false);
    setNewPlayerDetails({
      timeIn:{hour:'',minute:''},
      timeOut:{hour:'',minute:''},

    });
  };
  const handleAddPlayer = (player) => {

    setSelectedAttendance((prev) => ({
      ...prev,
      listData: [...prev.listData, player],
    }));
  };
  const handleSavePlayer = () => {
    handleAddPlayer(newPlayerDetails);
    setShowAddRow(false);
    setNewPlayerDetails({
      timeIn:{hour:'',minute:''},
      timeOut:{hour:'',minute:''},
      uid:'',
      name:'',
    });
  };


  return (
    <div className="container mx-auto  h-full mt-10">
           <h2 className="text-3xl font-bold mb-10 ml-2">Dashboard</h2>
      <div className="h-full flex flex-col relative bg-white border rounded-lg">
      
   
        <div className="mb-4 ml-4 mt-3 flex flex-col justify-center">
          <div className="flex-grow   p-2">
  
            <div className="justify-center p-4 w-full">
        <div className="p-4 rounded  w-full flex justify-around">
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="Tennis Ball" className="text-3xl mb-2">🎾</span>
            <p className="text-lg font-bold">Played Matches</p>
            <p>{status.totalMatches}</p>
          </div>
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="Money Bag" className="text-3xl mb-2">💰</span>
            <p className="text-lg font-bold">Revenues</p>
            <p>${status.revenue}</p>
          </div>
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="Computer" className="text-3xl mb-2">⏱️</span>
            <p className="text-lg font-bold">Hours of court occupation</p>
            <p>{convertMinutesToHours(status.totalReservation)}</p>
          </div>
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="Users" className="text-3xl mb-2">🤾🏻‍♂️</span>
            <p className="text-lg font-bold">Total Clients</p>
            <p>{status.users}</p>
          </div>
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="New Users" className="text-3xl mb-2">🙋🏻‍♀️</span>
            <p className="text-lg font-bold">Total Coaches</p>
            <p>{status.coaches}</p>
          </div>
        </div>
      </div>
          </div>
 

          <div className='flex-grow'>

          
<h3 className="text-xl font-bold mb-2">Revenue :</h3>
<div className=" p-2"  >

<div   >


  <RevenueLineChart payments={payments.payments} refunds={payments.refunds}/>
  </div>
  </div>
</div> 

<h3 className="text-xl font-bold mb-2 self-start mt-2">Attendance :</h3>
<div className="ml-4  border rounded-lg w-3/4 p-4 relative mb-4 ml-4 mt-3 self-center">
             

      <div className="flex ">
      <DatePicker
        id="date"
        selected={selectedAttendance.date.seconds? new Date(selectedAttendance.date.toDate()):selectedAttendance.date}
        onChange={(date) =>   {setSelectedDate(date);setSelectedAttendance((prev) => ({
          ...prev,
   date:date
        }))}} // Update the 'date' field in newPlayerDetails

        dateFormat="yyyy-MM-dd" // Specify the date format
        className="rounded-lg w-full px-3 py-2 border"

      />
      </div>
      <div style={{ height: '300px', overflowY: 'auto' }}>
  <table className="table-auto w-full min-w-full divide-y divide-gray-200 mt-5">
        <thead className="bg-gray-50 ">
            <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto">
          {selectedAttendance.listData?.map((trainer, index) => (
    <tr key={index}>
        <td className="px-6 py-4 whitespace-nowrap">{trainer.name}</td>
        <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex">
    <select
        value={trainer.timeIn.hours}
        onChange={(e) => handleTimeInHourChange(e, index)}
        className="flex-1 px-3 py-2 border rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="">HH</option>
        {hours.map((hour) => (
            <option key={hour} value={hour}>{hour}</option>
        ))}
    </select>
    <select
        value={trainer.timeIn.minutes}
        onChange={(e) => handleTimeInMinuteChange(e, index)}
        className="flex-1 px-3 py-2 border rounded-md ml-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="">MM</option>
        {minutes.map((minute) => (
            <option key={minute} value={minute}>{minute}</option>
        ))}
    </select>
</div>

        </td>
        <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex">
    <select
        value={trainer.timeOut.hours}
        onChange={(e) => handleTimeOutHourChange(e, index)}
        className="flex-1 px-3 py-2 border rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
    >
        <option value="">HH</option>
        {hours.map((hour) => (
            <option key={hour} value={hour}>{hour}</option>
        ))}
    </select>
    <select
        value={trainer.timeOut.minutes}
        onChange={(e) => handleTimeOutMinuteChange(e, index)}
        className="flex-1 px-3 py-2 border rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="">MM</option>
        {minutes.map((minute) => (
            <option key={minute} value={minute}>{minute}</option>
        ))}
    </select>
</div>

        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            {/* Render actions */}
            <button className="px-3 py-1 bg-red-500 text-white rounded mr-2" onClick={() => handleAbsent(index)}>Absent</button>
            <button className="px-3 py-1 border text-white  rounded rounded mr-2" style={{backgroundColor:"#335fff"}}onClick={() => handleRemove(trainer)}>Remove</button>
        </td>
    </tr>
))}

</tbody>

        {/* Add Player row */}
        {showAddRow && (
     <tr >
 <td className="px-3 py-4 whitespace-nowrap">
 <select
  value={newPlayerDetails.name}
  onChange={(e) => {
    const selectedUser = trainers.find((user) => user.nameandsurname === e.target.value);
    if (selectedUser) {
      setNewPlayerDetails({
        name: selectedUser.nameandsurname,
        uid: selectedUser.uid,
      });
    }
  }}
  className="rounded-lg w-full py-2 border-none"
>
        <option value="">Select a user</option>
        { trainers.filter((trainer) => !(selectedAttendance?.listData?.map((user) => user.name))?.includes(trainer.nameandsurname))?.map((user) => (
          <option key={user.id} value={user.nameandsurname}>
            {user.nameandsurname}
          </option>
        ))}
      </select>
    </td>
            <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex">
        <select
  onChange={(e) => {
    const { value } = e.target;
    setNewPlayerDetails((prevDetails) => ({
      ...prevDetails,
      timeIn: {
        ...prevDetails.timeIn,
        hours: value,
      },
    }));
  }}
  className="flex-1 px-3 py-2 border rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
>

        <option value="">HH</option>
        {hours.map((hour) => (
            <option key={hour} value={hour}>{hour}</option>
        ))}
    </select>
    <select
    
    onChange={(e) => {
      const { value } = e.target;
      setNewPlayerDetails((prevDetails) => ({
        ...prevDetails,
        timeIn: {
          ...prevDetails.timeIn,
          minutes: value,
        },
      }));
    }}
        className="flex-1 px-3 py-2 border rounded-md ml-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="">MM</option>
        {minutes.map((minute) => (
            <option key={minute} value={minute}>{minute}</option>
        ))}
    </select>
</div>

        </td>
        <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex">
    <select

onChange={(e) => {
  const { value } = e.target;
  setNewPlayerDetails((prevDetails) => ({
    ...prevDetails,
    timeOut: {
      ...prevDetails.timeIn,
      hours: value,
    },
  }));
}}
        className="flex-1 px-3 py-2 border rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
    >
        <option value="">HH</option>
        {hours.map((hour) => (
            <option key={hour} value={hour}>{hour}</option>
        ))}
    </select>
    <select

onChange={(e) => {
  const { value } = e.target;
  setNewPlayerDetails((prevDetails) => ({
    ...prevDetails,
    timeOut: {
      ...prevDetails.timeIn,
      minutes: value,
    },
  }));
}}
        className="flex-1 px-3 py-2 border rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="">MM</option>
        {minutes.map((minute) => (
            <option key={minute} value={minute}>{minute}</option>
        ))}
    </select>
</div>

        </td>


          </tr>
        )}
      </table>
                    
            
              
      </div>
      {!showAddRow &&(<div className="mt-4">
      <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2" onClick={()=>handleSubmitToDatabase()}>Submit</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded px-4 py-2  text-white rounded mr-2" onClick={handleDownloadExcel}>Download</button>
      </div>)}
      {!showAddRow ? (
                        <button
                          onClick={handleAddRow}
                          className="absolute top-0 right-2 button-white mt-3"
                        >
                          Add Player
                        </button>
                      ):(
                        <>
                         <button
                onClick={handleSavePlayer}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancelAddRow}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              </>
                      )}
    </div>

      </div>
    </div>
    </div>
   
  );
};

export default Dashboard
