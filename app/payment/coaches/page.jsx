// pages/index.js
'use client'
import { BadgeDollarSign, Banknote, Clock11, Clock9, Download, ReceiptText, RefreshCcw, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/app/firebase';
import { addDoc, collection,doc, getDoc, getDocs, increment,  query,  setDoc, updateDoc, where, } from 'firebase/firestore';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ReferenceLine, Label,Text } from 'recharts';


const AttendanceChart = ({ trainersData }) => {
 

  return ( 
    <div>
     <h2 className="text-3xl font-bold mb-10 ml-2">Total Class hours by Trainers</h2>
 
    <ResponsiveContainer width="100%" height={400} >
      <BarChart data={trainersData} >
 
        <XAxis dataKey="nameandsurname" tick={{  fill: '#0e2433' }}/>
        <YAxis hide="true" />
        <Tooltip />
 
        <Bar dataKey="classHours" fill="#0e2433"  radius={[10, 10, 0, 0]} >
          
        <LabelList dataKey="classHours" position="top" fill="#0e2433"/>
        </Bar>
      
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};
export const Card = ({ title, data, subtitle, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-72">
      
      <div className="flex items-center flex-col justify-between mb-4">
      {icon && <div className="bg-gray-200 p-4  rounded-xl self-start mb-2">{icon}</div>}
 
      </div>
      <div className="text-gray-700">
      <h2 className="text-xl font-bold self-start"  style={{ color: '#0E2433' }}>{title}</h2>
        <p className="text-2xl font-bold mb-2">{data}</p>
        <p className="text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

const generateRandomUid = (length) => {
  const uid = uuidv4().replace(/-/g, ''); // Remove hyphens
  return uid.slice(0, length); // Get the first 'length' characters
};

const MatchDetails=({setShowModal,trainers})=>{

  const [bookingType, setBookingType] = useState('match');
  const [reservation,setReservation]=useState( {date: new Date(),
trainer:{},
  payment:'Card',
  amount: 0,
  payOutType:'',
  type:''})

  
 
  
  const handleInputChange = (e) => {
    setReservation(prevReservation => ({
      ...prevReservation,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleSubmit = async () => {


    try {
     

      const payoutRef = collection(db, 'Club/GeneralInformation/Payouts');
      const aa=await addDoc(payoutRef, {
   
        date:reservation.date,
        traineruid:reservation.trainer,
        payment:reservation.payment,
        amount:parseInt( reservation.amount,10),
        payoutType:reservation.payOutType,
        type:reservation.type
      });
      await setDoc( doc(db, 'Trainers',reservation.trainer,'Payouts',aa.id), {
        Ref:aa
      });
    await updateDoc(doc(db, 'Club/GeneralInformation'), {
      totalExpenses: increment(reservation.amount),
    });
     
      alert('submitted successfully!');
    setShowModal(false);
  
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Failed to submit reservation. Please try again.');
    }
  };
  const handleClose = () => {
   
    setShowModal(false);
  
  };


 const handleBookingTypeChange = (type) => {
    setBookingType(type);

  }; 


    return    (
      <div className="fixed inset-0 h-full flex bg-gray-600 bg-opacity-50 justify-end items-center overflow-scroll mb-10" style={{ height: '100%' }}>
        <button onClick={handleClose} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
  
        <div className="w-2/6 h-full bg-white border rounded-lg flex flex-col justify-start items-start">
          <div className='flex'>
            <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Add PayOut</h2>
            <div className='ml-72'/>
            <div className="mt-4">
          
            </div>
          </div>
          {/* Form inputs */}
          <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
            <div className="ml-4 grid grid-cols-1 gap-4">
            <div className="flex flex-col">
                <strong>Date</strong>
  
  
      <DatePicker
     selected={reservation.date.seconds?new Date(reservation.date.toDate()):reservation.date}
  
        onChange={(date) => {
          setReservation({ ...reservation, date: date })
        // Close calendar after date selection
        }}
  
    className='rounded-lg flex flex-col w-full'
    calendarClassName='flex flex-start'
      /> 
    
              </div>
              <div className="flex flex-col">
                <strong>Select a Coach</strong>      
              <select

  onChange={(e) => setReservation(prevReservation => ({
    ...prevReservation,
    trainer: e.target.value,
  }))
  }
  
  className='rounded-lg flex flex-col w-full'
>
        <option value="">Select a Coach</option>
        { trainers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.nameandsurname}
          </option>
        ))}
      </select>  
      </div>
  <div className="flex flex-col">
              <strong>Payment</strong>
              <select
      name="payment"
      value={reservation.payment}
      onChange={handleInputChange}
      className="rounded-lg"
    >
  
      <option value="cash">
          Cash
        </option>
        <option  value="bank">
          Bank Transfer
        </option>
    </select>
    </div>
    <div className="flex flex-col">
              <strong>Amount</strong>
              <input
          className="rounded-lg"
          type="text"
          name="amount"
          value={reservation.amount}
          onChange={handleInputChange}
        />
  
    </div>
    <div className="flex flex-col">
        <label className="font-semibold mb-2">Payout Type</label>
        <div  className="flex justify-center">
          <label className="inline-block mr-4">
            <input
              type="radio"
              name="payOutType"
              value="extraHours"
              checked={bookingType === 'extraHours'}
              onChange={(e) =>{ handleBookingTypeChange('extraHours');handleInputChange(e)}}
              className="mr-2"
            />
            Extra Hour
          </label>
          <label className="inline-block">
            <input
              type="radio"
              name="payOutType"
              value="extraClass"
              checked={bookingType === 'extraClass'}
              onChange={() => handleBookingTypeChange('extraClass')}
              className="mr-2"
            />
           Extra  Class
          </label>
          <label className="inline-block ml-2">
            <input
              type="radio"
              name="payOutType"
              value="other"
              checked={bookingType === 'other'}
              onChange={() => handleBookingTypeChange('other')}
              className="mr-2"
            />
            Other
          </label>
        </div>
        
      </div>
      {bookingType === 'other' && (
        <>
            <div className="flex flex-col">
              <strong>Other:</strong>
              <input
          className="rounded-lg"
          type="text"
          name="type"
          value={reservation.type}
          onChange={handleInputChange}
        />
  
    </div>
        </>
      )}
                <button type="submit" onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">
        Submit
      </button>
            </div>
    
          </div>

        </div>

      </div>
    )
  }
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StraightAnglePieChart = ({data}) => (
  <div className="bg-white shadow-md rounded-xl p-6 w-72">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#0E2433' }}>Income Types</h2>
        <PieChart width={200} height={120} >
        <Pie
          data={data}
          cx={100}
          cy={80}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
    </div>
);
  // Function to get the target day based on the current day and class day
  const getTargetDay = (classDay, currentDay) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const classDayIndex = daysOfWeek.indexOf(classDay);
    let targetDayIndex = classDayIndex - currentDay;
  
    if (targetDayIndex < 0) {
      targetDayIndex += 7; // Add 7 days if the target day is before the current day in the week
    }
  
    const targetDay = new Date();
    targetDay.setDate(targetDay.getDate() + targetDayIndex); // Set the target day based on the index difference
    return targetDay;
  };
const calculateTotalClassHours = (classTimeArray) => {
    let totalHours = 0;
  
    for (const classTime of classTimeArray) {
      const day=classTime.day // Split the string into day and time range
      const startTimeStr=classTime.startTime
      const endTimeStr=classTime.endTime// Split the time range into start and end time strings
      const [startHour, startMinute] = startTimeStr.split(':').map(Number); // Convert start time to hours and minutes
      const [endHour, endMinute] = endTimeStr.split(':').map(Number); // Convert end time to hours and minutes
  
      // Get the current date and set the day of the week based on the class day
      const currentDate = new Date();
      const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const targetDay = getTargetDay(day, currentDay); // Get the target day based on the current day and class day
  
      // Set the start and end time for the target day
      const startTime = new Date(targetDay);
      startTime.setHours(startHour, startMinute, 0, 0); // Set the hours and minutes for the start time
      const endTime = new Date(targetDay);
      endTime.setHours(endHour, endMinute, 0, 0); // Set the hours and minutes for the end time
  
      const classHours = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
      totalHours += classHours;
    }
  
    return totalHours;
  };
  

const ManageSalaryPage = () => {

   
  const [trainers, setTrainers] = useState([]);
const [expenses,setExpenses]=useState({expenses:[],totalExpenses:0,})
const [status,setStatus]=useState({averageAttendance:0,totalClassesHours:0,AverageClassesHours:0})
useEffect(()=>{
    const fetchTrainersData = async () => {
        const trainersRef = collection(db, 'Trainers');
        const trainersSnapshot = await getDocs(trainersRef);
        const trainersData = [];
        let averageAttendances=0
        let totalClassesHours=0

        for (const doc of trainersSnapshot.docs) {

          const trainer = doc.data();
          const classesRef = collection(db, 'Classes');
          const classesQuery = query(classesRef, where('TrainerRef', '==', doc.ref));
            let classHourss=0
          const classesSnapshot = await getDocs(classesQuery);
          const classesData = [];
      
          for (const classDoc of classesSnapshot.docs) {
            const classInfo = classDoc.data();
            const classAttendanceRef = collection(db, 'Classes', classDoc.id, 'attendance');
            const classAttendanceSnapshot = (await getDocs(classAttendanceRef)).size;
            classHourss+=classAttendanceSnapshot
            const classHours = calculateTotalClassHours(classInfo.classTime);
            classInfo.totalClassHours = classHours;
            totalClassesHours+=classHours
            classesData.push(classInfo);
          }
      trainer.id=doc.id
          trainer.classes = classesData;
          trainer.classHours=classHourss
      
          // Fetch attendance data for each trainer
          const attendanceRef = collection(db, 'Trainers', doc.id, 'attendance');
          const attendanceSnapshot = await getDocs(attendanceRef);
          const attendanceData = attendanceSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          trainer.attendance = attendanceData;
      
          // Calculate average attendance
          let totalAttendance = 0;
          for (const attendance of attendanceData) {
            totalAttendance += 2;
            averageAttendances+=2
          }
          
          const averageAttendance = totalAttendance / attendanceData.length;
          trainer.averageAttendance = averageAttendance;
      
          trainersData.push(trainer);
        }
     
        averageAttendances=averageAttendances/trainersSnapshot.size
        const totalExpensess=(await getDoc(doc(db,'Club','GeneralInformation'))).data().totalExpenses
        const expenses=await getDocs(collection(db,'Club','GeneralInformation','PaymentExpenses'))
        const expensesData=expenses.docs.map((doc)=>({
            id:doc.id,
            ...doc.data()
        }))
        console.log(totalExpensess);
        setStatus({averageAttendance:averageAttendances,totalClassesHours:totalClassesHours})
        setExpenses({expenses:expensesData,totalExpenses:totalExpensess})
      setTrainers(trainersData)
        return trainersData;
      };

  fetchTrainersData()
}, []);



  const handleEyeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };
  const isAnyTimestampToday = (timestampsArray) => {
    // Get today's date as a JavaScript Date object
    const today = new Date();
  
    // Iterate through the array of timestamps
    for (const firestoreTimestamp of timestampsArray) {
      // Convert Firestore timestamp to JavaScript Date object
      const dateObject = firestoreTimestamp.startTime.toDate();
  
      // Check if the converted date is equal to today's date
      if (dateObject.toDateString() === today.toDateString()) {
        return true; // Return true if any timestamp is equal to today's date
      }
    }
  
    return false; // Return false if no timestamp is equal to today's date
  };

  const dateFormat=(Datte)=>{
    const currentDate= new Date(Datte)
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
const formattedDate = currentDate.toLocaleDateString('en-US', options);
return formattedDate

  }
  const [showModal, setShowModal] = useState(false);
  const addNewMatch = () => {
    setShowModal(true);
  };
  return (
    <div className="container mx-auto h-full mt-10">
<div className="flex items-center justify-between">
  <div>
    <h2 className="text-3xl font-bold mb-10 ml-2">PayOuts</h2>
  </div>
  <div>
    <button className="text-blue-500 text-2xl" onClick={addNewMatch}>Add PayOut</button>
  </div>
</div>

    <div className="flex   p-3 mt-5 shadow-3xl flex-col  overflow-x-auto ">
    <div className="flex flex-row justify-center rid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5  w-full  mb-5  ">
     <Card title={'Total PayOuts'} data={`$ ${expenses.totalExpenses.toFixed(2)}`} subtitle={`with total of ${expenses.expenses.length} PayOut`} icon={<Wallet size={32} color="#0E2433" className="text-gray-600" /> }/>
       <Card title={'Average Coaches attendance'} data={`${status.averageAttendance.toFixed(2)} hours`} subtitle={`with total of  ${status.averageAttendance*trainers.length} Hours`} icon={    <Clock9  size={32}  color="#0E2433" className="text-gray-600" />}/>
      <Card title={'total classs Hours '} data={`${status.totalClassesHours.toFixed(2) } Hours`}  icon={   <Clock11  size={32}  color="#0E2433" className="text-gray-600" /> }/>  
        {/* <Card title={'Expenses'} data={`$ ${status.totalRefund.toFixed(2)}`} subtitle={`TotalExpenses`} icon={   <Banknote size={32}  color="#0E2433" className="text-gray-600" /> }/> */}

      {/* <StraightAnglePieChart data={status.data}/> */}

      </div>
      <div className="flex overflow-x-auto border-opacity-50 rounded-lg bg-white border flex-col py-5 px-5">
      <AttendanceChart trainersData={trainers} />
      <div className="flex overflow-x-auto border-opacity-50 rounded-lg bg-white border">
        
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider"  style={{ color: '#0E2433' }}>
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
             Coach
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
                attendance
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
                total payment
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
                Download Bill
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trainers.map(transaction => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>{transaction.nameandsurname}</td>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>
   {/* {isAnyTimestampToday(transaction.attendance)} */}
   <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>{transaction.totalPayment}</td>
    </td>
    <td className="px-6 py-4 whitespace-nowrap align-center justify-center flex">
           <button onClick={() => handleEyeClick(transaction)}>
           <ReceiptText  color='#737373'/>              
              </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (<MatchDetails setShowModal={setShowModal} trainers={trainers}/>     )}
    </div>
    </div>
    </div>
  );
};

export default ManageSalaryPage;