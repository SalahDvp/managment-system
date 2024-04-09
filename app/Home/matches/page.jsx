'use client'
import { db } from '@/app/firebase';
import AutosuggestComponent from '@/components/UI/Autocomplete';
import { useAuth } from '@/context/AuthContext';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, increment, query, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import Switch from "react-switch";

import { fetchCourtsAndReservations } from '@/context/AuthContext';
export function generateRandom13DigitNumber() {
  const randomNumber = Math.floor(Math.random() * 1e13); // Generate a random 13-digit number
  return randomNumber.toString();
}

export const timestampToHourString=(time)=>{
  const firebaseTimestamp = time// Example Firestore timestamp
  const timestampInMillis = firebaseTimestamp.seconds * 1000 + firebaseTimestamp.nanoseconds / 1000000;
  const date = new Date(timestampInMillis);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
export const generateAvailableStartTimes = (selectedCourtName, selectedDate, matchDuration,courts) => {
  const selectedCourt = courts.find((court) => Object.values(court)[1] === selectedCourtName);

  if (!selectedCourt) {
    console.error('Court not found!');
    return [];
  }
 
  const reservations = Object.values(selectedCourt)[2];

  // Convert selectedDate to a Date object
  const dateToCheck = new Date(selectedDate);

  dateToCheck.setHours(0, 0, 0, 0); // Set time to 00:00:00

  // Filter reservations for the selected court and date
  const reservationsForDate = reservations.filter((reservation) => {

    const reservationDate = new Date(reservation.startTime.toDate());
    reservationDate.setHours(0, 0, 0, 0);
// Set time to 00:00:00
    return reservationDate.getTime() === dateToCheck.getTime();
  });

  // Convert reservations to an array of reserved time slots
const reservedSlots = reservationsForDate.map((reservation) => {
  const reservationStart = new Date(reservation.startTime.toDate());
  const reservationEnd = new Date(reservation.startTime.toDate());
  
  // Add buffer equal to the match duration to the start time
  reservationStart.setMinutes(reservationStart.getMinutes() - matchDuration);

  reservationEnd.setMinutes(reservationEnd.getMinutes() + reservation.duration);
  return { start: reservationStart, end: reservationEnd };
});

  // Generate available start times in 15-minute intervals
  const startTime = new Date();
  startTime.setHours(9, 0, 0); // Start at 09:00 AM
  const endTime = new Date();
  endTime.setHours(21, 0, 0); // End at 09:00 PM

  const availableStartTimes = [];
  let currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    let isAvailable = true;

    // Check if the current time slot overlaps with any reserved slot
    for (const slot of reservedSlots) {
      if (currentTime >= slot.start && currentTime <= slot.end) {
  
        isAvailable = false;
        break;
      }
    }

    // If the current time slot is available, add it to the available start times array
    if (isAvailable) {
      availableStartTimes.push(new Date(currentTime));
    }

    // Move to the next 15-minute interval
    currentTime.setMinutes(currentTime.getMinutes() + 15);
  }

  // Filter available start times based on match duration
  const filteredStartTimes = availableStartTimes.filter((time) => {
    const endTime = new Date(time);
    endTime.setMinutes(endTime.getMinutes() + matchDuration);
    return endTime <= endTime; // Change this line to include equal sign: endTime <= endTime;
  });

  return filteredStartTimes;
};
export const MatchDetails=({reservationDetails,setI,i,courts,setShowModal,setReservation,trainers,trainees,setCourts})=>{

const data=useAuth()
const discounts=data.discounts.filter((discount)=>discount.discountType==='courts')
const memberships=data.memberships
const reservation=reservationDetails?reservationDetails:{coachname:'coach',name:'name',description:'',date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],reaccuring:false,players:[],reaccurance:0} 
const [aa,setAA]=useState()

const [availableStartTimes,setAvailableStartTimes]=useState()

const handleInputChange = (e) => {
  setReservation(prevReservation => ({
    ...prevReservation,
    [e.target.name]: e.target.value,
  }));
  setAA(prevReservation => ({
    ...prevReservation,
    [e.target.name]: e.target.value,
  }));
};
useEffect(()=>{
  if(reservation.date && reservation.duration && reservation.courtName){




    const availableStartTimes = generateAvailableStartTimes(reservation.courtName,reservation.date, reservation.duration,courts);
    setAvailableStartTimes(availableStartTimes)
    //console.log(availableStartTimes);
  }

},[reservation.date,reservation.duration,reservation.courtName])

const addReservation = async (reservation, participants) => {
  try {
    const discount = reservation.discount ? JSON.parse(reservation.discount) : null;
    const id = generateRandom13DigitNumber();
    const startTime = new Date(reservation.startTime);
    const endTime = new Date(startTime.getTime() + reservation.duration * 60000);

    const courtRef = doc(db, 'Courts', reservation.courtName, 'Reservations', `Court1${id}`);
    const paymentReceivedRef = collection(db, 'Club/GeneralInformation/PaymentReceived');
    const paymentReceivedDoc = doc(paymentReceivedRef, `Court1${id}`);

    const batchUpdate = {
      ...reservation,
      name: reservation.name,
      description: reservation.description,
      date: Timestamp.fromDate(new Date(reservation.date)),
      endTime: Timestamp.fromDate(endTime),
      duration: parseInt(reservation.duration, 10),
      startTime: Timestamp.fromDate(new Date(reservation.startTime)),
      players: participants ? participants : [],
      status: 'not paid',
      price: priceMap[reservation.duration] - (priceMap[reservation.duration] * parseInt(discount?.rate || 0, 10) / 100),
      discount:discount!= null? discount.name:false
    };

    // Prepare batched writes
    await setDoc(courtRef, batchUpdate);

    // Handle discounts
    if (reservation.discount) {
      console.log("Discount times");
      const discountId = discount.id;
      await updateDoc(doc(db, "Discounts", discountId), {
        consumers: increment(1),
      });
    } else {
      console.log("Discount object is missing or incomplete.");
    }

    // Handle coach payout
    if (reservation.coachPayout) {
      const trainerId = trainers.find((train) => train.nameandsurname === reservation.coachname)?.id;
      if (trainerId) {
        const trainerRef = doc(db, 'Trainers', trainerId, 'Payouts', `Court1${id}`);
        await setDoc(doc(db, 'Club', 'GeneralInformation', 'Payouts', `Court1${id}`), {
          amount: parseInt(reservation.coachPayout, 10),
          date: Timestamp.fromDate(new Date(reservation.date)),
          payment: 'unknown',
          payoutType: 'match',
          status: "not paid",
          traineruid: trainerId,
        });
        await setDoc(trainerRef, {
          Ref: doc(db, 'Club', 'GeneralInformation', 'Payouts', `Court1${id}`),
          amount: parseInt(reservation.coachPayout, 10),
          date: Timestamp.fromDate(new Date(reservation.date)),
          payment: 'unknown',
          description: 'match',
          status: "not paid",
          traineruid: trainerId,
          type: 'match',
        });
      }
    }

    await setDoc(paymentReceivedDoc, {
      name: reservation.name,
      description: reservation.description,
      date: Timestamp.fromDate(new Date(reservation.date)),
      matchRef: courtRef,
      payment: reservation.payment,
      price: batchUpdate.price,
      status: 'not paid',
    });

    // Update total revenue in club info
    await updateDoc(doc(db, 'Club/GeneralInformation'), {
      totalRevenue: increment(batchUpdate.price),
    });
  } catch (error) {
    console.error("Error adding reservation:", error);
    // Handle error or show user notification
  }
};
const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    if(aa!=reservation){
      if (!reservation.reaccuring) {
        
        // Execute once for non-reaccuring reservation
         await addReservation(reservation);
     setReservation({date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],name:'',description:'',coachname:'',reaccuring:false,players:[],reaccurance:0})
       alert('Reservation submitted successfully!');
     setShowModal(false);
   
      }else {

       
             //   // Execute for each time of reaccuration
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const startDate = new Date(reservation.date);
        const selectedDayOfWeek = daysOfWeek[startDate.getDay()];
        const startTime = new Date(reservation.startTime);
        const reservationPromises = [];

        // Loop through each reaccuration and add reservation
        for (let i = 0; i < parseInt(reservation.reaccurance, 10); i++) {
          const currentDate = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
          const starDate = new Date(startTime.getTime() + i * 7 * 24 * 60 * 60 * 1000);
          const endTime = new Date(starDate.getTime() + reservation.duration * 60000);
          if (currentDate.getDay() === daysOfWeek.indexOf(selectedDayOfWeek)) {
            // Add reservation for the selected day of the week and push the promise to the array
      console.log( parseInt(reservation.reaccurance, 10));  
      reservationPromises.push( await addReservation({
        ...reservation,
        date: currentDate,
        startTime: starDate,
        endTime: endTime,
      }))    
           }
        }
      
      //   // Wait for all reservations to be added
 await Promise.all(reservationPromises);
       setReservation({date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],name:'',description:'',coachname:'',reaccuring:false,players:[],reaccurance:0,})
          alert('Reservation submitted successfully!');
       setShowModal(false);
      }
   

}
  } catch (error) {
    console.error('Error submitting reservation:', error);
   alert('Failed to submit reservation. Please try again.',error);
  }
};

const handleClose = () => {
  setReservation({date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],name:'',coachname:'',reaccuring:false,players:[],reaccurance:0})
  setShowModal(false);

};
const priceMap = {
  60: 200, // Price for 60 minutes
  90: 300, // Price for 90 minutes
  120: 500, // Price for 120 minutes
  // Add more duration-price mappings as needed
};
const [showRefundModal, setShowRefundModal] = useState(false);

const handleConfirmRefund = async () => {
  try {
    await addDoc(collection(db,'Club','GeneralInformation','PaymentRefund'),{
      matchRef:reservationDetails.id,
      payment:reservation.payment,
      price:priceMap[reservation.duration],
      date:new Date(),

    })
    await updateDoc(doc(db,'Club','GeneralInformation'),{
      totalRefund:increment(priceMap[reservation.duration])
    })
    const gameRef = doc(db,'Courts',reservationDetails.courtName,'Reservations',reservationDetails.id);
    await deleteDoc(gameRef);
    setCourts((prevCourts) => {
      const updatedCourts = prevCourts.map((court) => {
        // Check if the court's name matches the reservation's courtName
        if (court.name === reservation.courtName) {
          // Filter out the reservation from the court's reservations array
          const updatedReservations = court.reservations.filter(
            (res) => res.id !== reservation.id
          );
          // Update the reservations array for the current court
          return { ...court, reservations: updatedReservations };
        }
        // Return the court unchanged if it's not the one we're looking for
        return court;
      });
    
      return updatedCourts;
    });
    console.log('Game canceled successfully!');
    setShowRefundModal(false);
    setI(!i)
          setShowModal(false);
    // You can also update your local state or perform any other actions after successful deletion
  } catch (error) {
    console.error('Error canceling game:', error);
    // Handle errors such as permission denied or network issues
  }

  // setShowRefundModal(false);
};
useEffect(() => {
  const priceBeforeDiscount =priceMap[reservation.duration]
  const discountRate = reservation.discount?parseInt(JSON.parse(reservation.discount).rate , 10) : 0; // Assuming a 20% discount

  // Calculate the discount amount
  const discountAmount = (priceBeforeDiscount * discountRate) / 100;

  // Apply the discount to get the final price
  let finalPrice = priceBeforeDiscount - discountAmount;

  // Check if the user is a member

    // Find the membership with the same ID as membership.id
    const traineeName = reservation.name;
    const matchingTrainee = trainees.find((trainee) => trainee.nameandsurname === traineeName);
    console.log("wqeewewqqwename",matchingTrainee);
    if (matchingTrainee && matchingTrainee.membership) {
    const membershipId = matchingTrainee?.membership?.membershipId;
    const membership = memberships.find((m) => m.id === membershipId);

    if (membership) {
      // Check if the user's classes array is empty
        const firstClassDiscountRate = parseInt(membership.courtBookingDiscount,10);
        const firstClassDiscountAmount = (finalPrice * firstClassDiscountRate) / 100;
        finalPrice -= firstClassDiscountAmount;
      
    }
  }

  setReservation((prevReservation) => ({
    ...prevReservation,
    price: finalPrice,
  }));

  setAA((prevAA) => ({
    ...prevAA,
    price: finalPrice,
  }));
}, [reservation.duration,reservation.discount,reservation.name]);

const cancelMatch = async () => {
  try {
    const gameRef = doc(db,'Courts',reservationDetails.courtName,'Reservations',reservationDetails.id);
    await deleteDoc(gameRef);
    setCourts((prevCourts) => {
      const updatedCourts = prevCourts.map((court) => {
        // Check if the court's name matches the reservation's courtName
        if (court.name === reservation.courtName) {
          // Filter out the reservation from the court's reservations array
          const updatedReservations = court.reservations.filter(
            (res) => res.id !== reservation.id
          );
          // Update the reservations array for the current court
          return { ...court, reservations: updatedReservations };
        }
        // Return the court unchanged if it's not the one we're looking for
        return court;
      });
    
      return updatedCourts;
    });
    setShowRefundModal(false);
    setI(!i)
          setShowModal(false);
    // You can also update your local state or perform any other actions after successful deletion
  } catch (error) {
    console.error('Error canceling game:', error);
    // Handle errors such as permission denied or network issues
  }
};
const [participants, setParticipants] = useState(reservationDetails.players?reservationDetails.players:[]);
const [newParticipant,setParticipant]=useState({name:'',payment:''})
const addParticipant = (participant) => {
  if (participants.length < 4) {
    setParticipants([...participants, participant]);
    setParticipant({name:'',payment:''})
  }
};
const handleParticipantChange = (e,) => {
  const { name, value } = e.target;
  setParticipant((prevParticipant) =>
({...prevParticipant,[name]:value})
    )
};
  return    (
    <div className="fixed inset-0 h-full flex bg-gray-600 bg-opacity-50 justify-end items-center overflow-scroll mb-10 z-50" style={{ height: '100%' }}>
      <button onClick={handleClose} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="w-4/12 h-full bg-white border rounded-t flex flex-col justify-start items-start">

    <div className='flex'>
        <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Match Details</h2>
     

    </div>
    {/* Form inputs */}
    <div  className="p-6 mt-4 border h-full rounded-lg ml-4 mr-4 mb-8 overflow-y-auto" style={{ width: 'calc(100% - 24px)' }}>
          <div className="ml-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
              <strong>Date</strong>


    <DatePicker
   selected={reservation.date.seconds?new Date(reservation.date.toDate()):reservation.date}
   required 
      onChange={(date) => {
        setReservation({ ...reservation, date: date })
      // Close calendar after date selection
      }}

  className='rounded-lg flex flex-col w-full'
  calendarClassName='flex flex-start'
    /> 
  
            </div>
        
            <div className="flex flex-col">
            <strong>Court</strong>
            <select
    name="courtName"
    value={reservation.courtName}
    onChange={handleInputChange}
    className="rounded-lg"
    required 
  >
    <option value="">Select Court</option>
    {courts.map((court, index) => (
      <option key={index} value={court.name}>
        {court.name}
      </option>
    ))}
  </select>
  </div>
  
  <div className="flex flex-col">
            <strong>Duration</strong>
            <select
               required 
    name="duration"
    value={reservation.duration}
    onChange={(e)=>{handleInputChange(e);  setReservation(prevReservation => ({
      ...prevReservation,
      Price: priceMap[e.target.value],
    }));}}
    className="rounded-lg"
  >
    <option value="">Select Duration</option>
    <option value={60}>
        60 Minutes
      </option>
      <option  value={90}>
        90 Minutes
      </option>
      <option   value={120}>
        120 Minutes
      </option>
  </select>
  </div>
<div className="flex flex-col">
            <strong>Select Coach</strong>
<AutosuggestComponent trainers={trainers} setReservation={setReservation} reservation={reservation} name={reservation.coachname} field={'coachname'}/>
  </div>
  {reservation.coachname !== "coach" && reservation.coachname !== "" && ( <div className="flex flex-col ">
            
 <div className="flex flex-row justify-between">

            <strong>Coach payout (per match)</strong>
            <Switch onChange={()=>{ setReservation(prevReservation => ({
  ...prevReservation,
  coachPaid: !prevReservation.coachPaid,
  
}));
setAA(prevReservation => ({
  ...prevReservation,
  coachPaid: !reservation.coachPaid,
}));}} checked={reservation.coachPaid} />
     </div>
   {reservation.coachPaid &&   (<input
        className="rounded-lg"
        type="number"
        name="coachPayout"
        
        value={reservation.coachPayout}
        onChange={handleInputChange}
        
      />)}
  </div>)}
<div className="flex flex-col">
            <strong>Select Consumer</strong>
<AutosuggestComponent trainers={trainees} setReservation={setReservation} reservation={reservation} name={reservation.name} field={'name'}/>
  </div>

  <div className="flex flex-col">
            <strong>Select start time</strong>
  <select
    id="startTime"
    name="startTime"
    value={reservation.startTime}
    onChange={handleInputChange}
    className='rounded-lg'
    required 
  >
    <option value="">{reservation.startTime.seconds?`${new Date(reservation.startTime.toDate()).getHours().toString().padStart(2, '0')}:${new Date(reservation.startTime.toDate()).getMinutes().toString().padStart(2, '0')}`:' Select Start Time'}</option>
    {availableStartTimes?.map((time) => (
      <option key={time.getTime()} value={time.toISOString()}>{`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`}</option>
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
    required 
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
            <strong>Discount</strong>
            <select
    name="discount"

    onChange={handleInputChange}
    className="rounded-lg"
   
  >
      <option value="">
        No discount
      </option>
{discounts.map((discount)=>(
  <option value={JSON.stringify(discount)}>
        {discount.name}
      </option>
))}
    
  </select>
  </div> 
  <div className="flex flex-col">
            <strong>Price</strong>
            <input
        className="rounded-lg"
        type="text"
        name="Price"
        value={reservation.price}
        readOnly

      />

  </div>
  <div className="flex flex-col">
              <strong>Description</strong>
              <input
          className="rounded-lg"
          type="text"
          name="description"
          value={reservation.description}
          onChange={handleInputChange}
          required 
        />
  
    </div>
    <div className="flex flex-col ">
            
              <div className="flex flex-row justify-between">

              <strong>Reaccuring</strong>
              <Switch onChange={()=>{ setReservation(prevReservation => ({
    ...prevReservation,
    reaccuring: !prevReservation.reaccuring,
    
  }));
  setAA(prevReservation => ({
    ...prevReservation,
    reaccuring: !reservation.reaccuring,
  }));}} checked={reservation.reaccuring} />
       </div>
     {reservation.reaccuring &&   (<input
          className="rounded-lg"
          type="number"
          name="reaccurance"
          placeholder='Number of weeks'
          value={reservation.reaccurance}
          onChange={handleInputChange}
          
        />)}
    </div>


{reservation.date.seconds &&(  <button onClick={()=>  setShowRefundModal(true)} className="mb-3 px-4 py-2 bg-red-500 text-white rounded-md">Cancel a Match</button>)}
<Modal
  isOpen={showRefundModal}
  onRequestClose={() => setShowRefundModal(false)}
  contentLabel="Refund Payment Modal"
  ariaHideApp={false}
  style={{
    content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90vw', // Set maximum width relative to viewport width
      maxHeight: '90vh', // Set maximum height relative to viewport height
      overflow: 'auto', // Enable scrolling if content exceeds modal size
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      zIndex: 99999,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 99999,
    },
  }}
>
        <h2 className="text-xl font-bold mb-4">Refund Payment</h2>
        <p className="mb-4">Do you want to refund the payment?</p>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleConfirmRefund}
          >
            Yes
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
            onClick={cancelMatch}
          >
            No
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-blue-600"
            onClick={()=>setShowRefundModal(false)}
          >
            Cancel Refund
          </button>
        </div>
      </Modal>
          </div>
          <div className="flex flex-col my-5">
          <strong>Add Participants </strong>
          

<div class="relative overflow-x-auto my-5">
<table className="w-full divide-y divide-gray-200 mb-5">
          <thead className="bg-gray-50">
            <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"   >
                    Player Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"   >
                    Payment method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"   >
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
        {participants.map((participant, index) => (
            <tr  key={index}>
               

               <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>
             {participant.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>
                {participant.payment}
                </td>
        
            </tr>
              ))}
        </tbody>
        {participants.length < 4 &&(
        <tr >
               

               <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>
               <AutosuggestComponent
                trainers={trainees}
                setReservation={setParticipant}
                reservation={newParticipant}
                name={newParticipant.name}
                field={'name'}
              />
                </td>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>
                <select
    name="payment"
    value={newParticipant.payment}
    onChange={handleParticipantChange}
    className="px-3 py-2 border rounded-md w-full sm:w-auto w-full"
    style={{width:'150px'}}
    required 
  >

    <option value="full">
        Full
      </option>
      <option  value="split">
        Split
      </option>
  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#737373' }}>
                <button
                 type="button"
                className="mb-3 button-blue rounded-md mr-4 "
                onClick={() => addParticipant(newParticipant)}

              >
                Add Participant
              </button>
              </td>
            </tr>
            )}
            </table>
</div>
        
            </div>
            <button type="submit" onClick={handleSubmit} className="mb-3 px-4 py-2 bg-blue-500 text-white rounded-md">Submit Reservation</button>
        </div>

      </div>
    </div>
  )
}
const ManageMatchesPage = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);


  const [matches, setMatches] = useState();
  const [searchHour, setSearchHour] = useState('');
  const [showModal, setShowModal] = useState(false);
const [originalList,setOriginalList]=useState()
const [reservation,setReservation]=useState({players:[],reaccurance:0,date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],name:'name',description:'',coachname:'coach',reaccuring:false,coachPaid:false})
const {courts,setCourts,trainees,trainers}=useAuth()
const [i,setI]=useState(false)
useEffect(() => {
  const fetchCourtsAndReservations = async () => {
    try {
      const matches = [];

      courts.map(async (courtDoc) => {
        const reservationsData = courtDoc.reservations.filter((reservation) => {
          let reservationDate;
          if (reservation.date instanceof Date) {
            // Date object, no conversion needed
            reservationDate = reservation.date;
          } else if (reservation.date instanceof Timestamp) {
            // Firebase Timestamp, convert to Date object
            reservationDate = reservation.date.toDate();
          } else {
            // Handle other types of date representations as needed
            reservationDate = new Date(reservation.date);
          }

          // Compare reservationDate with startDate and endDate
          return reservationDate >= startDate && reservationDate <= endDate;
        });

        matches.push(reservationsData);
      });

      const flattenedMatches = matches.flat();
      setOriginalList(flattenedMatches);
      setMatches(flattenedMatches);
    } catch (error) {
      console.error('Error fetching courts and reservations:', error);
    }
  };

  fetchCourtsAndReservations();
}, [startDate, endDate]);
console.log(matches);
const handleSearchChange = (event) => {
  setSearchHour(event.target.value);
  filterMatches(event.target.value);
};
const filterMatches = (searchString) => {
  const searchMatches = originalList;

  // Check if the search string is empty
  if (searchString.trim() === '') {
    // If empty, set matches to the original list
    setMatches(searchMatches);
  } else {
    // If not empty, filter matches based on the search string
    const filteredMatches = searchMatches.filter(match =>
      timestampToHourString(match.startTime).includes(searchString)
    );
    setMatches(filteredMatches);
  }
};

const addNewMatch = () => {
  setShowModal(true);
};
useEffect(() => {

  if (reservation.date.seconds) {
    setShowModal(true); 
    return
  }
}, [reservation]); // Dependency array ensures this effect runs when reservation changes

// Click handler for setting reservation
const handleSetReservation = (match) => {
  setReservation(match);
};


  return (
    <>
    <div className="container mx-auto  h-full mt-10 ">
    <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold ">Matches</h1>
        <div className='flex flex-row self-end px-4'>
  <div>
   <strong className='mr-2 mt-4 mb-6'>from : </strong>
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
   <strong className='ml-2 mt-4 mb-6'>to :</strong>
<DatePicker
selected={endDate}
onChange={(date) => setEndDate(date)}
selectsEnd
startDate={startDate}
endDate={endDate}
minDate={startDate}

className="rounded-lg ml-5" 
dateFormat="dd/MM/yyyy"
/>
</div>
</div>
</div>
        <div className='bg-white pt-4 border rounded-lg '>

        
        <div className="flex justify-between mb-5 w-full px-4 ">
        <div >
          <input
            type="text"
            placeholder="Search by match hour"
            value={searchHour}
            onChange={handleSearchChange}
            className="px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button onClick={addNewMatch} className=" px-4 button-white rounded-md">Add New Match</button>
        </div>
        <div className="overflow-x-auto w-full border">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hour
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sport
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Players
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches?.map(match => (
                 !match.type && (
                <tr key={match.id}>
<td className="px-6 py-4 whitespace-nowrap" title={new Date(match.startTime.toDate()).toString()}>{timestampToHourString(match.startTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Tennis</td>
               
                  <td className="px-6 py-4 whitespace-nowrap">{match.duration} minutes</td>
                  <td className="px-6 py-4 whitespace-nowrap">players</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.courtName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.Price}</td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={()=>handleSetReservation(match)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                  </td>
                </tr>
             ) ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      {showModal && (<MatchDetails reservationDetails={reservation} setI={setI} i={i} trainees={trainees} setShowModal={setShowModal} courts={courts} setReservation={setReservation} trainers={trainers} setCourts={setCourts}/>
      )}
    </>
  );
};

export default ManageMatchesPage;
