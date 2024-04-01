// pages/index.js
'use client'
import { BadgeDollarSign, Banknote, Download, RefreshCcw, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/app/firebase';
import { addDoc, collection,doc, getDocs, increment,  setDoc, updateDoc, } from 'firebase/firestore';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ReferenceLine, Label,Text } from 'recharts';
const Card = ({ title, data, subtitle, icon }) => {
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

const MatchDetails=({setShowModal})=>{

  const [bookingType, setBookingType] = useState('match');
  const [reservation,setReservation]=useState( {date: new Date(),
  [`${bookingType}Ref`]:'',
  payment:'Card',
  price: 0,
  type:''})

  
 
  
  const handleInputChange = (e) => {
    setReservation(prevReservation => ({
      ...prevReservation,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleSubmit = async () => {
    try {
     
   
      const id=generateRandomUid(20);
   
    

      const paymentReceivedRef = collection(db, 'Club/GeneralInformation/PaymentReceived');
      const aa=await addDoc(paymentReceivedRef, {
   
        date:reservation.date,
        [`${bookingType}Ref`]:id,
        payment:reservation.payment,
        price:parseInt( reservation.price,10),

        typedis:reservation.type
      });
      console.log(aa);
    await updateDoc(doc(db, 'Club/GeneralInformation'), {
      totalRevenue: increment(reservation.price),
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
            <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Receipt Billing</h2>
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
        <option  value="card">
          Card
        </option>
    </select>
    </div>
    <div className="flex flex-col">
              <strong>Price</strong>
              <input
          className="rounded-lg"
          type="text"
          name="price"
          value={reservation.price}
          onChange={handleInputChange}
        />
  
    </div>
    <div className="flex flex-col">
        <label className="font-semibold mb-2">Booking Type</label>
        <div  className="flex justify-center">
          <label className="inline-block mr-4">
            <input
              type="radio"
              name="bookingType"
              value="match"
              checked={bookingType === 'match'}
              onChange={() => handleBookingTypeChange('match')}
              className="mr-2"
            />
            Court
          </label>
          <label className="inline-block">
            <input
              type="radio"
              name="bookingType"
              value="class"
              checked={bookingType === 'class'}
              onChange={() => handleBookingTypeChange('class')}
              className="mr-2"
            />
            Class
          </label>
          <label className="inline-block">
            <input
              type="radio"
              name="bookingType"
              value="other"
              checked={bookingType === 'other'}
              onChange={() => handleBookingTypeChange('other')}
              className="ml-2"
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



    <div className='flex flex-col w-full self-center justify-center'>
    <h2 className="text-3xl font-bold mb-10 ml-2">Receipts Types</h2>
    <ResponsiveContainer width="40%" height={400} className='flex flex-col w-full self-center justify-center'>
    <BarChart data={data} >
 
 <XAxis dataKey="name" tick={{  fill: '#0e2433' }}/>
 <YAxis hide="true" />
 <Tooltip />

 <Bar dataKey="value" fill="#0e2433"  radius={[10, 10, 0, 0]} >
   
 <LabelList dataKey="value" name='price' position="top" fill="#0e2433"/>
 </Bar>

</BarChart>
      

    </ResponsiveContainer>
    </div>
);
const ManageSalaryPage = () => {

   
  const [transactions, setTransactions] = useState([]);

  const [status, setStatus] = useState({
    overallBalance: 0,
    performanceChange: 0,
    highestPaymentDay: null,
    secondHighestPaymentDay: null,
    classRefCount: 0,
    matchRefCount: 0,
    highestPayment:0,
    secondHighestPayment:0,
    data:[{name:'',value:0}],
    totalRefund:0
  });
useEffect(()=>{
  const getTransactions = async () => {
    let totalRevenue = 0;
    let highestPayment = 0;
    let secondHighestPayment = 0;
    let highestPaymentDay = null;
    let secondHighestPaymentDay = null;
    let classRefCount = 0;
    let matchRefCount = 0;
    let classRefPayment=0;
    let matchRefPayment=0;
    let totalRefund=0;

    const transactionsRef = await getDocs(collection(db, 'Club', 'GeneralInformation', 'PaymentReceived'));
    const transactionsData = transactionsRef.docs.map((doc) => ({
      id: doc.id,
      type: 'payment',
      ...doc.data(),
    }));
console.log(transactionsData);
    const refundRef = await getDocs(collection(db, 'Club', 'GeneralInformation', 'PaymentRefund'));
    const refundData = refundRef.docs.map((doc) => ({
      id: doc.id,
      type: 'refund',
      ...doc.data(),
      
    }));

    // Combine transactions and refund data into one array
    const combinedData = [...transactionsData, ...refundData];

    // Sort the combined data array from newest to oldest based on the date field (assuming there's a 'date' field in the data)
    combinedData.sort((a, b) => new Date(b.date.toDate()) - new Date(a.date.toDate()));

    combinedData.forEach((transaction) => {
      if (transaction.type === 'payment') {
        totalRevenue += transaction.price;
        if (transaction.price > highestPayment) {
          secondHighestPayment = highestPayment;
          secondHighestPaymentDay = highestPaymentDay;
          highestPayment = transaction.price;
          highestPaymentDay = transaction.date.toDate();
        } else if (transaction.price > secondHighestPayment) {
          secondHighestPayment = transaction.price;
          secondHighestPaymentDay = transaction.date.toDate();
        }
        if (transaction.classRef) {
          classRefCount++;
          classRefPayment += transaction.price;
        }
        if (transaction.matchRef) {
          matchRefCount++;
          matchRefPayment += transaction.price;
        }
        
      } else if (transaction.type === 'refund') {
        totalRevenue -= transaction.price;
        totalRefund+=transaction.price
      }
    });

    // Calculate performance change compared to the previous month
    const performanceChange = ((totalRevenue - combinedData[combinedData.length-1].price) /combinedData[combinedData.length-1].price) * 100;
setTransactions(combinedData)
    setStatus({
      overallBalance: totalRevenue,
      performanceChange,
      highestPaymentDay,
      secondHighestPaymentDay,
      classRefCount,
      matchRefCount,
      highestPayment,
      secondHighestPayment,
      data:[{name:'Class',value:classRefPayment},{name:'Matches',value:matchRefPayment}],
      totalRefund:totalRefund
    });
  };

  getTransactions();
}, []);


  const handleEyeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
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
    <h2 className="text-3xl font-bold mb-10 ml-2">Receipts</h2>
  </div>
  <div>
    <button className="text-blue-500 text-2xl" onClick={addNewMatch}>Add Receipt</button>
  </div>
</div>

    <div className="flex    rounded-lg mt-5 shadow-3xl flex-col  shadow-3xl overflow-x-auto w-full ">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-5 self-center">
        <Card title={'Overall Balance'} data={`$ ${status.overallBalance.toFixed(2)}`} subtitle={`${status.performanceChange.toFixed(2)}% from last month`} icon={<Wallet size={32} color="#0E2433" className="text-gray-600" /> }/>
        <Card title={'Highest Paying Day'} data={status.highestPaymentDay &&(`${status?.highestPaymentDay?.toLocaleDateString()}`)} subtitle={`with amout of $ ${status.highestPayment.toFixed(2)}`} icon={    <BadgeDollarSign  size={32}  color="#0E2433" className="text-gray-600" />}/>
        <Card title={'Refund'} data={`$ ${status.totalRefund.toFixed(2)}`} subtitle={`Total Refunds`} icon={   <RefreshCcw  size={32}  color="#0E2433" className="text-gray-600" /> }/>
        <Card title={'Expenses'} data={`$ ${status.totalRefund.toFixed(2)}`} subtitle={`TotalExpenses`} icon={   <Banknote size={32}  color="#0E2433" className="text-gray-600" /> }/>

      {/*  */}

      </div>
    
      <div className="flex overflow-x-auto border bg-white flex-col p-4 rounded-lg">
      <StraightAnglePieChart data={status.data}/>
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider"  style={{ color: '#0E2433' }}>
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
              Receipt Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
                Amout
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
                Download Invoice
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>{dateFormat(transaction.date.toDate())}</td>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>
      {transaction.type === 'refund' ? '-₺' : '+₺'}
      {Math.abs(transaction.price)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
           <button onClick={() => handleEyeClick(transaction)}>
                 <Download color='#737373'/>
                  </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (<MatchDetails setShowModal={setShowModal} />     )}
    </div>
    </div>
  );
};

export default ManageSalaryPage;