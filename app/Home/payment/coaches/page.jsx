// pages/index.js
'use client'
import { BadgeDollarSign, Banknote, Clock11, Clock9, Download, ReceiptText, RefreshCcw, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/app/firebase';
import { Timestamp, addDoc, collection,doc, getDoc, getDocs, increment,  orderBy,  query,  setDoc, updateDoc, where, } from 'firebase/firestore';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ReferenceLine, Label,Text } from 'recharts';
import { getStatusColorClass } from '@/app/Home/tournaments/page';

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
function formatTimeFromFirestoreTimestamp(timestamp) {
 const date=new Date(timestamp.toDate())

  // Get hours and minutes from the timestamp
  const hours =  date.getHours().toString().padStart(2, '0'); // Pad with leading zero if needed
  const minutes =  date.getMinutes().toString().padStart(2, '0'); // Pad with leading zero if needed

  // Return the formatted time string
  return `${hours}:${minutes}`;
}
function formatDateToDDMMYYYY(date) {
  // Ensure date is a valid Date object
  if (!(date instanceof Date)) {
    console.error('Invalid date provided.');
    return '';
  }

  // Options for formatting the date
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };

  // Use toLocaleDateString with the options to format the date
  return date.toLocaleDateString('en-GB', options);
}
function calculateDurationInMinutes(startTime, endTime) {
  return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
}
function calculateTotalAmount(selectedEmployee,classesAttendance) {
  // Get the salary type of the selected employee (hourly or monthly)
  const { hourly } = selectedEmployee;

  // Initialize total amount
  let totalAmount = 0;

  // Calculate amount for each class
  classesAttendance.forEach((cls) => {
    const { date, end } = cls;
    const durationInMinutes = calculateDurationInMinutes(new Date(date.toDate()),new Date(end.toDate()));

      const amount = durationInMinutes * (hourly / 60); // Hourly rate divided by 60 to get rate per minute
      totalAmount += amount;
  });

  return totalAmount.toFixed(2);
}
function calculateMonthlyTotalAmount(selectedEmployee,classesAttendance) {
  // Get the monthly rate and classes from the selected employee
  const { salary } = selectedEmployee;

  // Initialize total amount
  let totalAmount = 0;

  // Create a Set to store unique weeks
  const uniqueWeeks = new Set();

  // Iterate through each class to track unique weeks
  classesAttendance.forEach((cls) => {
    const { date, end } = cls;
    const startWeek = new Date(date.toDate()).setHours(0, 0, 0, 0);
    const endWeek = new Date(end.toDate()).setHours(0, 0, 0, 0);
    const weekDiff = Math.floor((endWeek - startWeek) / (7 * 24 * 60 * 60 * 1000)); // Calculate full weeks

    for (let i = 0; i <= weekDiff; i++) {
      const week = new Date(startWeek + (i * 7 * 24 * 60 * 60 * 1000)).toISOString(); // Get the start of each week
      uniqueWeeks.add(week);
    }
  });

  // Calculate the total amount based on the unique weeks and monthly rate
  totalAmount = uniqueWeeks.size * (salary / 4); // Assuming a month has approximately 4 weeks

  return totalAmount;
}

const CoachDetails=({selectedCoach,setShowDetails})=>{
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [selectedEmployee,setSelectedEmployee]=useState({selectedCoach,commissions:[],classesAttendance:[],attendances:[],others:[],salary:[]})
  const [showAddRowCommission, setShowAddRowCommission] = useState(false);
  const [showAddRowSalary, setShowAddRowSalary] = useState(false);
  const [showAddRowOther, setShowAddRowOther] = useState(false);
  const [orginal,setOrginal]=useState({selectedCoach,commissions:[],classesAttendance:[],attendances:[],others:[],salary:[]})
  const [salary,setSalary]=useState(0)
  const [newCommissionDetails, setNewCommissionDetails] = useState({
    date:new Date(),
    description: '',
    amount: 0,
    rate: 0,
    status: 'paid',

    id:generateRandomUid(20)
  });
  
  const [newSalaryDetails, setNewSalaryDetails] = useState({
    from:new Date(),
    description: '',
    amount: 0,
    status: 'paid',
    to:new Date(),
    id:generateRandomUid(20),
    date:new Date()
  });
  const [newOtherDetails, setNewOtherDetails] = useState({
    date:new Date(),
    description: '',
    amount: 0,
    status: '',

    id:generateRandomUid(20)
  });
  const handleAddRowCommission = () => {
    setShowAddRowCommission(true);
  };

  const handleCancelAddRow = () => {
    setShowAddRowCommission(false);
    setNewCommissionDetails({
      date:new Date(),
      description: '',
      amount: 0,
      rate: '',
      status: '',
      id:generateRandomUid(20)
    });
  };

  const handleSaveCommission = () => {
    setSelectedEmployee((prev) => ({
      ...prev,
        commissions: [...prev.commissions, newCommissionDetails],
      
    }));
    setShowAddRowCommission(false);
    setNewCommissionDetails({
      date:new Date(),
      description: '',
      amount: 0,
      rate: '',
      status: '',
      id:generateRandomUid(20)
    });
  };
  const handleAddRowOther = () => {
    setShowAddRowOther(true);
  };

  const handleCancelAddOtherRow = () => {
    setShowAddRowOther(false);
    setNewCommissionDetails({
      date:new Date(),
      description: '',
      amount: 0,
      status: '',
      id:generateRandomUid(20)
    });
  };

  const handleSaveOther = () => {
    setSelectedEmployee((prev) => ({
      ...prev,
       others: [...prev.others, newOtherDetails],
      
    }));
    setShowAddRowOther(false);
    setNewOtherDetails({
      date:new Date(),
      description: '',
      amount: 0,
      status: '',
      id:generateRandomUid(20)
    });
  };
  const handleAddRowSalary = () => {
    setShowAddRowSalary(true);
  };

  const handleCancelAddSalaryRow = () => {
    setShowAddRowSalary(false);
    setNewSalaryDetails({
      from:new Date(),
      description: '',
      amount: 0,
      status: 'paid',
      to:new Date(),
      id:generateRandomUid(20),
      date:new Date()
    });
  };

  const handleSaveSalary = () => {
    setSelectedEmployee((prev) => ({
      ...prev,
       salary: [...prev.salary, newSalaryDetails],
      
    }));
    setShowAddRowSalary(false);
    setNewSalaryDetails({
      from:new Date(),
      description: '',
      amount: 0,
      status: 'paid',
      to:new Date(),
      id:generateRandomUid(20),
      date:new Date()
    });
  };
    useEffect(()=>{
const getSalarys=async ()=>{

  const data= await getDocs(collection(db,'Trainers',selectedCoach.id,'Salary'))
  const commissionData = data.docs.map((doc) => {

    const id = doc.id;

  
    return { id, ...doc.data() };
  });
  setSelectedEmployee((prev) => ({ ...prev, salary: commissionData }));
  setOrginal((prev)=>({...prev,salary:commissionData}))
}
getSalarys()
  },[])
  useEffect(()=>{
const getOthers=async ()=>{
  const commisionRefs = query(collection(db,'Trainers',selectedCoach.id,'Payouts'),where("date",">",startDate), where("date", "<", endDate),orderBy("date","desc"));
    
    let totalAmount=0
  const data= await getDocs(commisionRefs)
  const commissionData = data.docs.map((doc) => {

    const id = doc.id;
    const status=doc.data().payoutType

  
    return {status, id, ...doc.data() };
  });
  setSelectedEmployee((prev) => ({ ...prev, others: commissionData }));
  setOrginal((prev)=>({...prev,others:commissionData}))
}
getOthers()
  },[startDate,endDate])
  useEffect(()=>{
const getCommissions=async ()=>{
  const commisionRefs = query(collection(db,'Trainers',selectedCoach.id,'Commissions'),where("date",">",startDate), where("date", "<", endDate),orderBy("date","desc"));
    
    
  const data= await getDocs(commisionRefs)
  const commissionData = data.docs.map((doc) => {
    const data = doc.data(); // Get the document's data
    data.id = doc.id; // Override the id field in the data with the document ID
    return data; // Return the modified data object
  });
  setSelectedEmployee((prev) => ({ ...prev, commissions: commissionData }));
  setOrginal((prev)=>({...prev,commissions:commissionData}))
}
getCommissions()
  },[startDate,endDate])
  console.log(selectedEmployee.others);
  useEffect(() => {
    const getClassesAttendance = async () => {


      const classesCollectionRef = collection(db, 'Classes');
      const trainerRef = doc(db, 'Trainers', selectedCoach.id);
      
      const q = query(classesCollectionRef, where('TrainerRef', '==', trainerRef));
  
      const allAttendances = [];

      try {
        const querySnapshot = await getDocs(q);
  
        for (const doc of querySnapshot.docs) {
          const attendanceCollectionRef = collection(db, 'Classes', doc.id, 'attendance');
          const attendanceQuerySnapshot = query(attendanceCollectionRef,where("end",">",startDate), where("end", "<", endDate),orderBy("end","desc"));
          const data= await getDocs(attendanceQuerySnapshot)
    
     
          data.forEach((attendanceDoc) => {
            allAttendances.push({
              className: doc.data().className,
              id: attendanceDoc.id,
              ...attendanceDoc.data()
            });
          });
        }

        setSelectedEmployee((prev) => ({ ...prev, classesAttendance: allAttendances }));
        setOrginal((prev) => ({ ...prev, classesAttendance: allAttendances }));
      } catch (error) {
        console.error('Error getting documents:', error);
      }
    };
    setSelectedEmployee((prev) => ({ ...prev, classesAttendance: [] })); // Empty classesAttendance
  setOrginal((prev) => ({ ...prev, classesAttendance: [] })); // Empty classesAttendance
    getClassesAttendance();
  }, [startDate, endDate]);
  useEffect(()=>{
    const startDateTimestamp = Timestamp.fromDate(startDate);
const endDateTimestamp = Timestamp.fromDate(endDate);
    const getAttendance=async ()=>{
      const commisionRefs = collection(db, 'Trainers', selectedCoach.id, 'attendance');
const querySnapshot = await getDocs(commisionRefs);

const attendanceData = [];
querySnapshot.forEach(async (doc) => {
  const attendanceDoc = await getDoc(doc.data().Ref);

  if (attendanceDoc.exists()) {
const attendanceDateTimestamp = Timestamp.fromDate(attendanceDoc.data().endTime.toDate());

    // Check if the attendance date is between the start and end dates
  if (attendanceDateTimestamp >= startDateTimestamp && attendanceDateTimestamp <= endDateTimestamp) {
      attendanceData.push({id:attendanceDoc.id,...attendanceDoc.data()});
    }
 
  } else {
    console.log('Document does not exist.');
  }
});

setSelectedEmployee((prev) => ({ ...prev, attendances: attendanceData }));
setOrginal((prev)=>({...prev,attendances:attendanceData}))
    }
    setSelectedEmployee((prev) => ({ ...prev, attendances:[]}));
setOrginal((prev)=>({...prev,attendances:[]}))
    getAttendance()
      },[startDate,endDate])
     
      useEffect(()=>{
  const aa=selectedEmployee.selectedCoach.salaryType ==='hourly'?calculateTotalAmount(selectedEmployee.selectedCoach,selectedEmployee.classesAttendance):calculateMonthlyTotalAmount(selectedEmployee.selectedCoach,selectedEmployee.classesAttendance)

  setSalary(aa)
      },[selectedEmployee])
      const handleRemove = (doc,list,propertyName) => {

        const updatedListData = list.filter(player => player.id !== doc.id);
     
        // Update selectedEmployee with the filtered list
         const updatedSelectedEmployee =  {...selectedEmployee,[propertyName]: 
     updatedListData
    };
       setSelectedEmployee(updatedSelectedEmployee);
      };
  
      function updateCommissions(updatedCommissionss, originalCommissions) {
        const updatedIds = new Set(updatedCommissionss.map(item => item.id));
        const originalIds = new Set(originalCommissions.map(item => item.id));
      
        let newItemAdded = false;
        let itemDeleted = false;
let u=updatedCommissionss;
        // Check for new items
        updatedCommissionss.forEach(async updatedItem => {
            if (!originalIds.has(updatedItem.id)) {
                const commissionRef=await addDoc(collection(db,'Trainers',selectedCoach.id,'Commissions'),updatedItem)
                await setDoc(doc(db,'Club','GeneralInformation','Payouts',commissionRef.id),{
                  amount:(updatedItem.amount*updatedItem.rate)/100,
                  date:updatedItem.date,
                  payment:updatedItem.status,
                  payoutType:'commission',
                  traineruid:selectedCoach.id,
                  type:updatedItem.description
                })
                await updateDoc(doc(db,'Club','GeneralInformation'),{
                  totalExpenses:increment((updatedItem.amount*updatedItem.rate)/100)
                })
                setSelectedEmployee((prev) => ({
                  ...prev,
                  commissions: prev.commissions.map((commission, idx) =>
                    commission.id === updatedItem.id ? { ...commission, id: commissionRef.id } : commission
                  ),
                }));
                  u=updatedCommissionss.map((commission, idx) =>
                    commission.id === updatedItem.id ? { ...commission, id: commissionRef.id } : commission
                  ),

                newItemAdded = true;
            }
        });
      

        originalCommissions.forEach(async originalItem => {
            if (!updatedIds.has(originalItem.id)) {
        await updateDoc(doc(db,'Trainers',selectedCoach.id,'Commissions',originalItem.id),{removed:true})
                await updateDoc(doc(db,'Club','GeneralInformation','Payouts',originalItem.id),{
                 removed:true
                })
                await updateDoc(doc(db,'Club','GeneralInformation'),{
                  totalExpenses:increment(-(originalItem.amount*originalItem.rate)/100)
                })
                itemDeleted = true;
            }
            if (newItemAdded && itemDeleted) {
                return; // Exit loop if both operations are complete
            }
        });
        setOrginal((prev)=>({
          ...prev,
          commissions:u
        }))
      }
      function updateOthers(updatedCommissionss, originalCommissions) {
        const updatedIds = new Set(updatedCommissionss.map(item => item.id));
        const originalIds = new Set(originalCommissions.map(item => item.id));
      
        let newItemAdded = false;
        let itemDeleted = false;
let u=updatedCommissionss;
        // Check for new items
        updatedCommissionss.forEach(async updatedItem => {
            if (!originalIds.has(updatedItem.id)) {
                const commissionRef=await addDoc(collection(db,'Club','GeneralInformation','Payouts'),{
                  amount:parseInt(updatedItem.amount,10),
                  date:updatedItem.date,
                  payment:updatedItem.status,
                  traineruid:selectedCoach.id,
                  payoutType:'other',
                  type:updatedItem.description
                })
                await setDoc(doc(db,'Trainers',selectedCoach.id,'Payouts',commissionRef.id),{
                  Ref:commissionRef,
                  amount:parseInt(updatedItem.amount,10),
                  date:updatedItem.date,
                  payment:updatedItem.status,
      
                 description:updatedItem.description,
                 type:updatedItem.description,
                 status:'paid'
                })
                await updateDoc(doc(db,'Club','GeneralInformation'),{
                  totalExpenses:increment(parseInt(updatedItem.amout,10))
                })
                setSelectedEmployee((prev) => ({
                  ...prev,
                  commissions: prev.commissions.map((commission, idx) =>
                    commission.id === updatedItem.id ? { ...commission, id: commissionRef.id } : commission
                  ),
                }));
                  u=updatedCommissionss.map((commission, idx) =>
                    commission.id === updatedItem.id ? { ...commission, id: commissionRef.id } : commission
                  ),

                newItemAdded = true;
            }
        });
      

        originalCommissions.forEach(async originalItem => {
            if (!updatedIds.has(originalItem.id)) {
        await updateDoc(doc(db,'Trainers',selectedCoach.id,'Payouts',originalItem.id),{removed:true})
                await updateDoc(doc(db,'Club','GeneralInformation','Payouts',originalItem.id),{
                 removed:true
                })
                await updateDoc(doc(db,'Club','GeneralInformation'),{
                  totalExpenses:increment(-parseInt(originalItem.amount,10))
                })
                itemDeleted = true;
            }
            if (newItemAdded && itemDeleted) {
                return; // Exit loop if both operations are complete
            }
        });
        setOrginal((prev)=>({
          ...prev,
         others:u
        }))
      }
      function updateSalary(updatedCommissionss, originalCommissions) {
        const updatedIds = new Set(updatedCommissionss.map(item => item.id));
        const originalIds = new Set(originalCommissions.map(item => item.id));
      
        let newItemAdded = false;
        let itemDeleted = false;
let u=updatedCommissionss;
        // Check for new items
        updatedCommissionss.forEach(async updatedItem => {
            if (!originalIds.has(updatedItem.id)) {
                const commissionRef=await addDoc(collection(db,'Club','GeneralInformation','Payouts'),{
                  amount:parseInt(updatedItem.amount,10),
                  date:new Date(),
                  from:updatedItem.from,
                  to:updatedItem.to,
                  payment:updatedItem.status,
                  traineruid:selectedCoach.id,
                  payoutType:'salary',
                  type:updatedItem.description
                })
                await setDoc(doc(db,'Trainers',selectedCoach.id,'Salary',commissionRef.id),{
                  Ref:commissionRef,
                  amount:parseInt(updatedItem.amount,10),
                  date:new Date(),
                  from:updatedItem.from,
                  to:updatedItem.to,
                  payment:updatedItem.status,
                  
                 description:updatedItem.description,
                 type:updatedItem.description,
                 status:'paid'
                })
                await updateDoc(doc(db,'Club','GeneralInformation'),{
                  totalExpenses:increment(parseInt(updatedItem.amount,10))  
                })
                setSelectedEmployee((prev) => ({
                  ...prev,
                  commissions: prev.commissions.map((commission, idx) =>
                    commission.id === updatedItem.id ? { ...commission, id: commissionRef.id } : commission
                  ),
                }));
                  u=updatedCommissionss.map((commission, idx) =>
                    commission.id === updatedItem.id ? { ...commission, id: commissionRef.id } : commission
                  ),

                newItemAdded = true;
            }
        });
      

        originalCommissions.forEach(async originalItem => {
            if (!updatedIds.has(originalItem.id)) {
        await updateDoc(doc(db,'Trainers',selectedCoach.id,'Salary',originalItem.id),{removed:true})
                await updateDoc(doc(db,'Club','GeneralInformation','Payouts',originalItem.id),{
                 removed:true
                })
            
                await updateDoc(doc(db,'Club','GeneralInformation'),{
                  totalExpenses:increment(-parseInt(updatedItem.amount,10))
                })
                itemDeleted = true;
            }
            if (newItemAdded && itemDeleted) {
                return; // Exit loop if both operations are complete
            }
        });
        setOrginal((prev)=>({
          ...prev,
         salary:u
        }))
      }
  return(
    <div className="fixed inset-0 flex bg-gray-600 bg-opacity-50 justify-end items-center   " style={{ height: '100%' }}>
     
     <button onClick={()=>setShowDetails(false)} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

          <div className="w-7/12 h-auto bg-white border rounded-t flex flex-col justify-start items-start overflow-y-auto" style={{ height: '100%' }}>

          <div className='flex bg-white h-auto'>
              <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Coach Payouts</h2>
              <div className='ml-72 h-full' />
              <div className="mt-4" >
                <strong className='ml-2 mt-4 mb-6'>Coach ID</strong>
                <input className="rounded-lg ml-5" type="text" readOnly value={selectedCoach.id} />
              </div>
            </div>
         
            <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
            <div className="ml-4 grid grid-cols-3 gap-4">
                <div>
                  <strong>Name</strong> <br />
                  <input className="rounded-lg"  value={selectedEmployee.selectedCoach.nameandsurname} readOnly />
                </div>
                <div>
                  <strong>Position</strong> <br />
                  <input className="rounded-lg " type="text" readOnly value={selectedEmployee.selectedCoach.position} />
                </div>
                 <div className='flex flex-col' >
                 <strong>Salary Type</strong> 
                        <select
                    name='salaryType'
                    value={selectedEmployee.selectedCoach.salaryType}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setSelectedEmployee((prev) => ({ ...prev, selectedCoach: { ...prev.selectedCoach, [name]: value } }));
                    }}
                          className="rounded-lg "
                        >
                                      <option value="">Select salary type</option>
                          <option value="monthly">Monthly</option>
                          <option value="hourly">Hourly</option>
                  
                        </select>
                      </div>
                {selectedEmployee.selectedCoach.salaryType === 'monthly' && (<div>
                  <strong>Salary per Month</strong> <br />
                  <input className="rounded-lg" type="number" name='salary'
value={selectedEmployee.selectedCoach.salary}
onChange={(e) => {
  const { name, value } = e.target;
  setSelectedEmployee((prev) => ({ ...prev, selectedCoach: { ...prev.selectedCoach, [name]: value } }));
}}/>
                </div>)}     
                {selectedEmployee.selectedCoach.salaryType === 'hourly' &&   (<div>
                  <strong>Hourly rate</strong> <br />
                  <input className="rounded-lg" type="number" name='hourly'
value={selectedEmployee.selectedCoach.hourly}
onChange={(e) => {
  const { name, value } = e.target;
  setSelectedEmployee((prev) => ({ ...prev, selectedCoach: { ...prev.selectedCoach, [name]: value } }));
}}/>
                </div>)}
              
              </div>
            </div>
            <div className='flex flex-row self-end px-4'>
            <div>
             <strong className='mr-2 mt-4 mb-6'>Start Date : </strong>
                  <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        maxDate={endDate}
        className="rounded-lg" 
        dateFormat="dd/MM/yyyy"
      />
            </div>
            <div>
             <strong className='ml-2 mt-4 mb-6'>End Date :</strong>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        maxDate={today}
        className="rounded-lg ml-5" 
        dateFormat="dd/MM/yyyy"
      />
      </div>
    </div>
    <div colSpan="2" className="px-6 py-6 text-right pr-10 font-bold text-3xl text-black-500 uppercase tracking-wider" style={{  width: '100%', display: 'block' }}>
          Total Payout: ${salary+(selectedEmployee.others.reduce((acc, employee) => acc +  parseInt(employee.amount,10), 0)) + (selectedEmployee.commissions.reduce((acc, employee) => acc +  parseInt((employee.amount*employee.rate)/100,10), 0))}

        </div>
    <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
              <h3 className="text-lg font-bold mb-4">Commission</h3>
              <div className="table-container " style={{  overflowY: 'auto', maxHeight: '200px', width:'100%'}}>
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       commission rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       commission in Tl
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       payout type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {selectedEmployee.commissions.map((commission,index) => (

            <tr key={commission.id} >
               
               <td className="px-6 py-4 max-w-20 overflow-wrap break-word overflow-hidden ">{commission.description}</td>

         <td className="px-6 py-4 whitespace-nowrap text-center">{commission.amount}</td>
            
         <td className="px-6 py-4 whitespace-nowrap text-center">{commission.rate}%</td>
                     
         <td className="px-6 py-4 whitespace-nowrap text-center">{(commission.rate*commission.amount)/100}</td>
         <td className="px-6 py-4 whitespace-nowrap text-center ">  
         <select
    name="status"
    value={commission.status}
    onChange={(e) => {
      const { name, value } = e.target;
      setSelectedEmployee((prev) => ({
        ...prev,
        commissions: prev.commissions.map((commission, idx) =>
          idx === index ? { ...commission, [name]: value } : commission
        ),
      }));
    }}
    
    className={`rounded-lg w-full px-3 py-2 border-none focus:outline-none ${getStatusColorClass(commission.status)}`}
  >
    <option value="">payout type</option>
    <option value="bank">Bank</option>
    <option value="cash">Cash</option>
 

  </select></td>
{commission.date   && (         <td className="px-6 py-4 whitespace-nowrap text-center">{commission.date.toDate ? commission.date.toDate().toLocaleDateString(): commission.date.toLocaleDateString()}</td>)    }

<td className="px-6 py-4 whitespace-nowrap align-center justify-center">
<div className="flex  justify-center">
          
         {!commission.removed ?(<button className="px-3 py-1 border text-white  rounded rounded mr-2" style={{backgroundColor:"#335fff"}} onClick={()=>handleRemove(commission,selectedEmployee.commissions,`commissions`)}>Remove</button>):
         (<button className="px-3 py-1 border text-white  rounded rounded mr-2" style={{backgroundColor:"#335fff"}} disabled={true}>Removed</button>)   }
     
            </div>

</td>



  
       
            </tr>
          ))}
                  </tbody>
                {/* Add Player row */}
         {showAddRowCommission && (
     <tr >
                <td className="px-3 py-4 whitespace-nowrap"><input
                type="text"
                name="description"
                value={newCommissionDetails.description}
                onChange={(e)=>setNewCommissionDetails((prev)=>({...prev,description:e.target.value}))}
                placeholder="Enter description"
                className="rounded-lg w-full px-3 py-2 border-none "
              /></td>
                         <td className="px-3 py-4 whitespace-nowrap"><input
                type="number"
                name="amount"
                value={newCommissionDetails.amount}
                onChange={(e)=>setNewCommissionDetails((prev)=>({...prev,amount:e.target.value}))}
                placeholder="Enter total amount"
                className="rounded-lg w-full px-3 py-2 border-none "
              /></td>
                <td className="px-3 py-4 whitespace-nowrap"><input
                type="number"
                name="rate"
                value={newCommissionDetails.rate}
                onChange={(e)=>setNewCommissionDetails((prev)=>({...prev,rate:e.target.value}))}
                placeholder="Enter rate"
                className="rounded-lg w-full px-3 py-2 border-none "
              /></td>
                    <td className="px-3 py-4 whitespace-nowrap"><input
                type="number"
            readOnly
                value={(newCommissionDetails.rate*newCommissionDetails.amount/100)}
                className="rounded-lg w-full px-3 py-2 border-none "
              /></td>
<td className="px-3 py-4 whitespace-nowrap">
  <select
    name="status"
    value={newCommissionDetails.status}
    onChange={(e)=>setNewCommissionDetails((prev)=>({...prev,status:e.target.value}))}
    
    className={`rounded-lg w-full px-3 py-2 border-none focus:outline-none ${getStatusColorClass(newCommissionDetails.status)}`}
  >
    <option value="">payout type</option>
    <option value="cash">Cash</option>
    <option value="bank">Bank</option>
   

  </select>
</td>

<td className="px-3 py-4 whitespace-nowrap">
        <DatePicker
        id="date"
        selected={newCommissionDetails.date}
        onChange={(date) => setNewCommissionDetails((prev) => ({ ...prev, date: date }))} // Update the 'date' field in newPlayerDetails

        dateFormat="dd-MM-yyyy" // Specify the date format
        className="rounded-lg w-full px-3 py-2 border-none"
        placeholderText="Commission Date"
      />
        </td>

          </tr>
        )}
      </table>
     
 
     
 
              </div>
              <div colSpan="2" className="px-6 py-3 text-right pr-10  font-medium text-gray-500 uppercase tracking-wider" style={{ borderTopWidth: '2px', width: '100%', display: 'block' }}>
          Total Commissions: ${  (selectedEmployee.commissions.reduce((acc, employee) => acc +  parseInt((employee.amount*employee.rate)/100,10), 0)).toLocaleString()}
        </div>
      
            
                      {!showAddRowCommission ? (
                        <>
                          <button
                          onClick={handleAddRowCommission}
                          className="button-white  mt-5 mr-5"
                        >
                          Add Commission
                        </button>
                        {selectedEmployee.commissions !=orginal.commissions && ( 
                        <>
                        <button
                           onClick={()=> updateCommissions(selectedEmployee.commissions,orginal.commissions)}
                           
                           className="button-blue  mt-5"
                         >
                          submit Changes
                         </button>
                                     <button
                                     onClick={()=> setSelectedEmployee(orginal)}
                               
                                     className="bg-gray-500 text-black-500  font-bold mt-5 ml-5 border rounded-lg px-5 py-2"
                                   >
                                    Cancel Changes
                                   </button>
                                   </>)}
                        </>
                      
                      ):(
                        <>
                         <button
                onClick={handleSaveCommission}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancelAddRow}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button></>
                  
                  )}
            </div>
            
            <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
              <h3 className="text-lg font-bold mb-4">Classes</h3>
              <div className="table-container " style={{ overflowY: 'auto', maxHeight: '200px', width:'100%'}}>
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        class
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       start
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       end
                      </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       duration
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                  {selectedEmployee.classesAttendance.map((attendance,index) => (

            <tr key={attendance.id} >
                        <td className="px-6 py-4 whitespace-nowrap ">{attendance.className}</td>
          
         <td className="px-6 py-4 whitespace-nowrap ">{formatDateToDDMMYYYY(new Date(attendance.date.toDate()))}</td>

         <td className="px-6 py-4 whitespace-nowrap ">{formatTimeFromFirestoreTimestamp(attendance.date)}</td>
    
         <td className="px-6 py-4 whitespace-nowrap ">{formatTimeFromFirestoreTimestamp(attendance.end)}</td>
         <td className="px-6 py-4 whitespace-nowrap ">{calculateDurationInMinutes(new Date(attendance.date.toDate()),new Date(attendance.end.toDate()))} Minutes</td>
            </tr>
          ))}     
                  </tbody>
  
      </table>
     
              </div>
    
        <div colSpan="2" className="px-6 py-3 text-right pr-10 font-medium text-gray-500 uppercase tracking-wider" style={{ borderTopWidth: '2px', width: '100%', display: 'block' }}>
          Salary: ${salary}
        </div>
           
            </div>
            <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 bg-white" style={{ width: 'calc(100% - 24px)' }}>
              <h3 className="text-lg font-bold mb-4">Attendance</h3>
              <div className="table-container " style={{overflowY: 'auto', maxHeight: '200px', width:'100%'}}>
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Time Out
                      </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       duration
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                  {selectedEmployee.attendances.map((attendance,index) => (

            <tr key={attendance.id} >
          
          
         <td className="px-6 py-4 whitespace-nowrap ">{formatDateToDDMMYYYY(new Date(attendance.startTime.toDate()))}</td>

         <td className="px-6 py-4 whitespace-nowrap">
  <input
    value={attendance.timeIn.hours}
    readOnly
    className="px-2 py-1 border rounded-md bg-gray-100 text-gray-800 w-auto mr-1"
    style={{ width: `${attendance.timeIn.hours.length * 30}px` }} // Adjust the multiplier as needed
  />
  <input
    value={attendance.timeIn.minutes}
    readOnly
    className="px-2 py-1 border rounded-md bg-gray-100 text-gray-800 w-auto"
    style={{ width: `${attendance.timeIn.hours.length * 30}px` }} // Adjust the multiplier as needed
  />
</td>
    
         <td className="px-6 py-4 whitespace-nowrap ">
         <div className="flex">
    <input
        value={attendance.timeOut.hours}
      readOnly
      className="px-2 py-1 border rounded-md bg-gray-100 text-gray-800 w-auto  mr-1"
      style={{ width: `${attendance.timeIn.hours.length * 30}px` }} 
    />
      <input
        value={attendance.timeOut.minutes}
      readOnly
      className="px-2 py-1 border rounded-md bg-gray-100 text-gray-800 w-auto"
      style={{ width: `${attendance.timeIn.hours.length * 30}px` }} 
    />
</div>
         </td>
         <td className="px-6 py-4 whitespace-nowrap ">{(Math.floor(new Date(attendance.endTime.toDate()).getTime()-new Date(attendance.startTime.toDate()).getTime())/(1000*60)).toFixed(2)} Minutes</td>
            </tr>
          ))}     
                  </tbody>
 
      </table>
                    
              </div>
            </div>
            <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
              <h3 className="text-lg font-bold mb-4">Other Payouts</h3>
              <div className="table-container " style={{ overflowY: 'auto', maxHeight: '200px', width:'100%'}}>
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        description
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       payout type
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       date
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {selectedEmployee.others.map((other,index) => (

            <tr key={other.id} >
               
               <td className="px-6 py-4 max-w-20 overflow-wrap break-word overflow-hidden ">{other.description}</td>

         <td className="px-6 py-4 whitespace-nowrap text-center">{other.amount}</td>
            

         <td className="px-6 py-4 whitespace-nowrap text-center ">  
         <select
    name="status"
    value={other.status}
    onChange={(e) => {
      const { name, value } = e.target;
      setSelectedEmployee((prev) => ({
        ...prev,
        others: prev.others.map((other, idx) =>
          idx === index ? { ...other, [name]: value } : other
        ),
      }));
    }}
    
    className={`rounded-lg w-full px-3 py-2 border-none focus:outline-none ${getStatusColorClass(other.status)}`}
  >
    <option value="">payout type</option>
    <option value="bank">Bank</option>
    <option value="cash">Cash</option>

  </select></td>
{other.date   && (         <td className="px-6 py-4 whitespace-nowrap text-center">{other.date.toDate ? other.date.toDate().toLocaleDateString(): other.date.toLocaleDateString()}</td>)    }

<td className="px-6 py-4 whitespace-nowrap align-center justify-center">
<div className="flex  justify-center">
                  
         {!other.removed ?(    <button className="px-3 py-1 border text-white  rounded rounded mr-2" style={{backgroundColor:"#335fff"}} onClick={()=>handleRemove(other,selectedEmployee.others,`others`)}>Remove</button>):
         (<button className="px-3 py-1 border text-white  rounded rounded mr-2" style={{backgroundColor:"#335fff"}} disabled={true}>Removed</button>)   }
     
            </div>

</td>
  
       
            </tr>
          ))}
                  </tbody>
                {/* Add Player row */}
         {showAddRowOther && (
     <tr >
                <td className="px-3 py-4 whitespace-nowrap"><input
                type="text"
                name="description"
                value={newOtherDetails.description}
                onChange={(e)=>setNewOtherDetails((prev)=>({...prev,description:e.target.value}))}
                placeholder="Enter description"
                className="rounded-lg w-full px-3 py-2 border-none "
              /></td>
                         <td className="px-3 py-4 whitespace-nowrap"><input
                type="number"
                name="amount"
                value={newOtherDetails.amount}
                onChange={(e)=>setNewOtherDetails((prev)=>({...prev,amount:e.target.value}))}
                placeholder="Enter total amount"
                className="rounded-lg w-full px-3 py-2 border-none "
              /></td>
<td className="px-3 py-4 whitespace-nowrap">
  <select
    name="status"
    value={newOtherDetails.status}
    onChange={(e)=>setNewOtherDetails((prev)=>({...prev,status:e.target.value}))}
    
    className={`rounded-lg w-full px-3 py-2 border-none focus:outline-none ${getStatusColorClass(newOtherDetails.status)}`}
  >
    <option value="">payout type</option>
    <option value="banck">Bank</option>
    <option value="cash">Cash</option>

  </select>
</td>

<td className="px-3 py-4 whitespace-nowrap">
        <DatePicker
        id="date"
        selected={newOtherDetails.date}
        onChange={(date) => setNewOtherDetails((prev) => ({ ...prev, date: date }))} // Update the 'date' field in newPlayerDetails

        dateFormat="dd-MM-yyyy" // Specify the date format
        className="rounded-lg w-full px-3 py-2 border-none"
        placeholderText="Date"
      />
        </td>

          </tr>
        )}

       
  
      </table>
                    
     
              </div>
              <div colSpan="2" className="px-6 py-3 text-right  font-medium text-gray-500 uppercase tracking-wider" style={{ borderTopWidth: '2px', width: '100%', display: 'block' }}>
          Total Amount: ${  (selectedEmployee.others.reduce((acc, employee) => acc +  parseInt(employee.amount,10), 0)).toLocaleString()}
        </div>
                      {!showAddRowOther? (
                        <>
                          <button
                          onClick={handleAddRowOther}
                          className="button-white  mt-5 mr-5"
                        >
                          Add Other
                        </button>
                         {selectedEmployee.others !=orginal.others && (
                         <>
                         <button
                           onClick={()=> updateOthers(selectedEmployee.others,orginal.others)}
                     
                           className="button-blue  mt-5"
                         >
                          submit Changes
                         </button>
                         <button
                           onClick={()=> setSelectedEmployee(orginal)}
                     
                           className="bg-gray-500 text-black-500  font-bold mt-5 ml-5 border rounded-lg px-5 py-2"
                         >
                          Cancel Changes
                         </button>
                         </> )}  
                        </>
                      
                      ):(
                        <>
                         <button
                onClick={handleSaveOther}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancelAddOtherRow}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button></>
                      )}
            </div>
            <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
              <h3 className="text-lg font-bold mb-4">Salaries</h3>
              <div className="table-container " style={{ overflowY: 'auto', maxHeight: '200px', width:'100%'}}>
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                       <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       date
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       payout type
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                       action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {selectedEmployee.salary.map((salary,index) => (

            <tr key={salary.id} >
               
               <td className="px-6 py-4 overflow-wrap ">
<div className='flex flex-row '>
<DatePicker
    selected={salary.from.toDate ? salary.from.toDate().toLocaleDateString() : salary.from.toLocaleDateString()}
    onChange={(date) => setNewSalaryDetails((prev) => ({ ...prev, from: date }))}
    selectsStart
    startDate={startDate}
    endDate={endDate}
    maxDate={endDate}

    className="rounded-lg w-40 " // Add other classes if needed
  />


      <DatePicker
        selected={salary.to.toDate ? salary.to.toDate().toLocaleDateString(): salary.to.toLocaleDateString()}
        onChange={(date) => setNewSalaryDetails((prev)=>({
          ...prev,to:date
        }))}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
 
        className="rounded-lg ml-5 w-40" 
      />
</div>
 
 
  </td>


         <td className="px-6 py-4 whitespace-nowrap text-center">{salary.amount}</td>
            


         <td className="px-6 py-4 whitespace-nowrap text-center ">  
         <select
    name="status"
    value={salary.status}
    onChange={(e) => {
      const { name, value } = e.target;
      setSelectedEmployee((prev) => ({
        ...prev,
       salary: prev.salary.map((other, idx) =>
          idx === index ? { ...other, [name]: value } : other
        ),
      }));
    }}
    
    className={`rounded-lg w-full px-3 py-2 border-none focus:outline-none ${getStatusColorClass(salary.status)}`}
  >
    <option value="">payout type</option>
    <option value="bank">Bank</option>
    <option value="cash">Cash</option>

  </select></td>
<td className="px-6 py-4 max-w-20 overflow-wrap break-word overflow-hidden ">{salary.description}</td>
<td className="px-6 py-4 whitespace-nowrap align-center justify-center">
<div className="flex  justify-center">
{!salary.removed ?(               <button className="px-3 py-1 border text-white  rounded rounded mr-2" style={{backgroundColor:"#335fff"}} onClick={()=>handleRemove(salary,selectedEmployee.salary,`salary`)}>Remove</button>
):
         (<button className="px-3 py-1 border text-white  rounded rounded mr-2" style={{backgroundColor:"#335fff"}} disabled={true}>Removed</button>)   }
     
            </div>

</td>
  
       
            </tr>
          ))}
                  </tbody>
                {/* Add Player row */}
         {showAddRowSalary && (
       
     <tr >
          <td className="px-3 py-4 whitespace-nowrap">
          <div className='flex flex-row self-end px-4'>
          <div>
           <strong className='mr-2 mt-4 mb-6'>from: </strong>
                <DatePicker
      selected={newSalaryDetails.from.toDate ? salary.from.toDate().toLocaleDateString(): newSalaryDetails.from.toLocaleDateString()}
      onChange={(date) => setNewSalaryDetails((prev)=>({
        ...prev,from:date
      }))}
      selectsStart
      startDate={startDate}
      endDate={endDate}
      maxDate={endDate}
      className="rounded-lg" 
    />
          </div>
          <div>
           <strong className='ml-2 mt-4 mb-6'>to :</strong>
    <DatePicker
      selected={newSalaryDetails.to.toDate ? newSalaryDetails.to.toDate().toLocaleDateString(): newSalaryDetails.to.toLocaleDateString()}
      onChange={(date) => setNewSalaryDetails((prev)=>({
        ...prev,to:date
      }))}
      selectsEnd
      startDate={startDate}
      endDate={endDate}

      className="rounded-lg ml-5" 
    />
    </div>
  </div>
  </td>
  <td className="px-3 py-4 whitespace-nowrap"><input
                type="number"
                name="amount"
                value={newSalaryDetails.amount}
                onChange={(e)=>setNewSalaryDetails((prev)=>({...prev,amount:e.target.value}))}
                placeholder="Enter total amount"
                className="rounded-lg w-full px-3 py-2 border-none "
              />
          </td>             

<td className="px-3 py-4 whitespace-nowrap">
  <select
    name="status"
    value={newSalaryDetails.status}
    onChange={(e)=>setNewSalaryDetails((prev)=>({...prev,status:e.target.value}))}
    
    className={`rounded-lg w-full px-3 py-2 border-none focus:outline-none ${getStatusColorClass(newSalaryDetails.status)}`}
  >
    <option value="">payout type</option>
    <option value="banck">Bank</option>
    <option value="cash">Cash</option>

  </select>

</td>

                <td className="px-3 py-4 whitespace-nowrap"><input
                type="text"
                name="description"
                value={newSalaryDetails.description}
                onChange={(e)=>setNewSalaryDetails((prev)=>({...prev,description:e.target.value}))}
                placeholder="Enter description"
                className="rounded-lg w-full px-3 py-2 border-none "
              /></td>
          </tr>
        )}

       
  
      </table>
                    
     
              </div>
              <div colSpan="2" className="px-6 py-3 text-right  font-medium text-gray-500 uppercase tracking-wider" style={{ borderTopWidth: '2px', width: '100%', display: 'block' }}>
          Total Salaries: ${  (selectedEmployee.salary.reduce((acc, employee) => acc +  parseInt(employee.amount,10), 0)).toLocaleString()}
        </div>
                      {!showAddRowSalary? (
                        <>
                          <button
                          onClick={handleAddRowSalary}
                          className="button-white  mt-5 mr-5"
                        >
                          Add Salary
                        </button>
                         {selectedEmployee.salary !=orginal.salary && (
                         <>
                         <button
                           onClick={()=>  updateSalary(selectedEmployee.salary,orginal.salary)}
                     
                           className="button-blue  mt-5"
                         >
                          submit Changes
                         </button>
                         <button
                           onClick={()=> setSelectedEmployee(orginal)}
                     
                           className="bg-gray-500 text-black-500  font-bold mt-5 ml-5 border rounded-lg px-5 py-2"
                         >
                          Cancel Changes
                         </button>
                         </> )}  
                        </>
                      
                      ):(
                        <>
                         <button
                onClick={handleSaveSalary}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancelAddSalaryRow}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button></>
                      )}
            </div>

            </div>
    </div>
  )
}
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
        date:reservation.date,
        status:"paid",
        payment:reservation.payment,
        amount:parseInt( reservation.amount,10),
        description:reservation.payOutType === 'other'?reservation.type:reservation.payOutType,
        type:reservation.type,
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
              onChange={(e) => {handleBookingTypeChange('extraClass');handleInputChange(e)}}
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
              onChange={(e) => {handleBookingTypeChange('other');handleInputChange(e)}}
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
const ManageSalaryPage = () => {

  const [showModal, setShowModal] = useState(false);
  const[showDetails,setShowDetails]=useState(false)
  const [selectedCoach,setSelectedCoach]=useState()
  const [trainers, setTrainers] = useState([]);
const [expenses,setExpenses]=useState({expenses:[],totalExpenses:0,})
const [status,setStatus]=useState({averageAttendance:0,totalClassesHours:0,AverageClassesHours:0})
useEffect(() => {
  const fetchTrainersData = async () => {
      const trainersRef = collection(db, 'Trainers');
      const trainersSnapshot = await getDocs(trainersRef);
      const trainersData = [];
      let averageAttendances = 0;
      let totalClassesHours = 0;

      // Batch fetch classes and attendance data for all trainers
      const promises = trainersSnapshot.docs.map(async (doc) => {
          const trainer = doc.data();
          const classesRef = collection(db, 'Classes');
          const classesQuery = query(classesRef, where('TrainerRef', '==', doc.ref));

          const [classesSnapshot, attendanceSnapshot] = await Promise.all([
              getDocs(classesQuery),
              getDocs(collection(db, 'Trainers', doc.id, 'attendance'))
          ]);

          const classesData = [];
          let classHours = 0;

          for (const classDoc of classesSnapshot.docs) {
              const classInfo = classDoc.data();
              const classAttendanceRef = collection(db, 'Classes', classDoc.id, 'attendance');
              const classAttendanceSnapshot = await getDocs(classAttendanceRef);
              const classAttendanceCount = classAttendanceSnapshot.size;
              classHours += classAttendanceCount;
              classInfo.totalClassHours = calculateTotalClassHours(classInfo.classTime);
              totalClassesHours+= calculateTotalClassHours(classInfo.classTime);
              classesData.push(classInfo);
          }

          trainer.id = doc.id;
          trainer.classes = classesData;
          trainer.classHours = classHours;

          const attendanceData = attendanceSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          trainer.attendance = attendanceData;

          // Calculate average attendance
          const totalAttendance = attendanceData.length * 2;
          averageAttendances += totalAttendance;
          trainersData.push(trainer);
      });

      await Promise.all(promises);

      averageAttendances = averageAttendances / trainersSnapshot.size;
      const totalExpenses = (await getDoc(doc(db, 'Club', 'GeneralInformation'))).data().totalExpenses;
      const expensesSnapshot = await getDocs(collection(db, 'Club', 'GeneralInformation', 'PaymentExpenses'));
      const expensesData = expensesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
      }));

  
      setStatus({ averageAttendance: averageAttendances, totalClassesHours: totalClassesHours });
      setExpenses({ expenses: expensesData, totalExpenses: totalExpenses });
      setTrainers(trainersData);
      return trainersData;
  };

  fetchTrainersData();
}, []);
const handleEyeClick = (employee) => {
  setSelectedCoach(employee)
    setShowDetails(true);
  };
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

    <div className="flex   p-3 mt-5 shadow-3xl flex-col  ">
    <div className="flex flex-row justify-center rid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5  w-full  mb-5  ">
     <Card title={'Total PayOuts'} data={`$ ${expenses.totalExpenses.toFixed(2)}`} subtitle={`with total of ${expenses.expenses.length} PayOut`} icon={<Wallet size={32} color="#0E2433" className="text-gray-600" /> }/>
       <Card title={'Average Coaches attendance'} data={`${status.averageAttendance.toFixed(2)} hours`} subtitle={`with total of  ${status.averageAttendance*trainers.length} Hours`} icon={    <Clock9  size={32}  color="#0E2433" className="text-gray-600" />}/>
      <Card title={'total classs Hours '} data={`${status.totalClassesHours.toFixed(2) } Hours`}  icon={   <Clock11  size={32}  color="#0E2433" className="text-gray-600" /> }/>  
        {/* <Card title={'Re'} data={`$ ${status.totalRefund.toFixed(2)}`} subtitle={`TotalExpenses`} icon={   <Banknote size={32}  color="#0E2433" className="text-gray-600" /> }/> */}
      </div>
      <div className="flex border-opacity-50 rounded-lg bg-white border flex-col py-5 px-5">
      <AttendanceChart trainersData={trainers} />
      <div className="flex  border-opacity-50 rounded-lg bg-white border">
        
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
                total payouts
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
                Download Bill
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-small text-gray-500 uppercase tracking-wider" style={{ color: '#0E2433' }}>
                Action
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
      {showDetails && selectedCoach && (<CoachDetails selectedCoach={selectedCoach} setShowDetails={setShowDetails}/>    )}
    </div>
    </div>
    </div>
  );
};

export default ManageSalaryPage;