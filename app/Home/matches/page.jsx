'use client'
import { db } from '@/app/firebase';
import AutosuggestComponent from '@/components/UI/Autocomplete';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, increment, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
function generateRandom13DigitNumber() {
  const randomNumber = Math.floor(Math.random() * 1e13); // Generate a random 13-digit number
  return randomNumber.toString();
}

const timestampToHourString=(time)=>{
  const firebaseTimestamp = time// Example Firestore timestamp
  const timestampInMillis = firebaseTimestamp.seconds * 1000 + firebaseTimestamp.nanoseconds / 1000000;
  const date = new Date(timestampInMillis);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
const generateAvailableStartTimes = (selectedCourtName, selectedDate, matchDuration,courts) => {
  const selectedCourt = courts.find((court) => Object.values(court)[0] === selectedCourtName);

  if (!selectedCourt) {
    console.error('Court not found!');
    return [];
  }
 
  const reservations = Object.values(selectedCourt)[1];
  console.log(reservations);
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
const MatchDetails=({reservationDetails,setI,i,courts,setShowModal,setReservation,trainers})=>{


const reservation=reservationDetails?reservationDetails:{name:'name',description:'',date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[]} 
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
const handleSubmit = async () => {
  try {
    if(aa!=reservation){

 
    const id=generateRandom13DigitNumber()
    const startTime = new Date(reservation.startTime);

    // Calculate the end time by adding the duration in minutes to the start time
    const endTime = new Date(startTime.getTime() + reservation.duration * 60000); // Convert minutes to milliseconds
  
    // Return the end time as an ISO string
    const courtRef = doc(db, 'Courts', reservation.courtName, 'Reservations', `Court1${id}`);
    await setDoc(courtRef, 
      {...reservation,
        name:reservation.name,
      description:reservation.description,
      date:Timestamp.fromDate(new Date(reservation.date)),
      endTime:Timestamp.fromDate(endTime),duration:parseInt(reservation.duration, 10),
      startTime:Timestamp.fromDate(new Date(reservation.startTime))});
    const paymentReceivedRef = collection(db, 'Club/GeneralInformation/PaymentReceived');
    await addDoc(paymentReceivedRef, {
      name:reservation.name,
      description:reservation.description,
      date: new Date(),
      matchRef: `Court1${id}`,
      payment:reservation.payment,
      price: reservation.Price,
    });
  await updateDoc(doc(db, 'Club/GeneralInformation'), {
    totalRevenue: increment(reservation.Price),
  });
    setReservation({date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],name:'',description:''})
    alert('Reservation submitted successfully!');
  setShowModal(false);
  setI(!i)
}
  } catch (error) {
    console.error('Error submitting reservation:', error);
    alert('Failed to submit reservation. Please try again.');
  }
};
const handleClose = () => {
  setReservation({date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],name:''})
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
      price:reservation.Price,
      date:new Date(),

    })
    await updateDoc(doc(db,'Club','GeneralInformation'),{
      totalRefund:increment(reservation.Price)
    })
    const gameRef = doc(db,'Courts',reservationDetails.courtName,'Reservations',reservationDetails.id);
    await deleteDoc(gameRef);
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


const cancelMatch = async () => {
  try {
    const gameRef = doc(db,'Courts',reservationDetails.courtName,'Reservations',reservationDetails.id);
    await deleteDoc(gameRef);
    console.log('Game canceled successfully!');
    setShowRefundModal(false);
    setI(!i)
          setShowModal(false);
    // You can also update your local state or perform any other actions after successful deletion
  } catch (error) {
    console.error('Error canceling game:', error);
    // Handle errors such as permission denied or network issues
  }
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
          <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Match Details</h2>
          <div className='ml-72'/>
          <div className="mt-4">
        
          </div>
        </div>
        {/* Form inputs */}
        <form onSubmit={handleSubmit} className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
          <div className="ml-4 grid grid-cols-1 gap-4">
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
            <strong>Select sConsumer</strong>
<AutosuggestComponent trainers={trainers} setReservation={setReservation} reservation={reservation} name={reservation.name} />
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
            <strong>Price</strong>
            <input
        className="rounded-lg"
        type="text"
        name="Price"
        value={priceMap[reservation.duration]}
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
  <button  className="mb-3 px-4 py-2 bg-blue-500 text-white rounded-md">Submit Reservation</button>
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
        </form>

      </div>
    </div>
  )
}
const ManageMatchesPage = () => {


  const [matches, setMatches] = useState();
  const [searchHour, setSearchHour] = useState('');
  const [showModal, setShowModal] = useState(false);
const [originalList,setOriginalList]=useState()
const [reservation,setReservation]=useState({date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],name:'name',description:''}) 
const [courts, setCourts] = useState([]);
const [i,setI]=useState(false)
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
            name: courtData.name,
            reservations: reservationsData,
          };
        })
      );
  
      // Flatten the array of arrays into a single array
      const flattenedMatches = matches.flat();
      setOriginalList(flattenedMatches)
      setMatches(flattenedMatches);
      setCourts(courtsData);
    } catch (error) {
      console.error('Error fetching courts and reservations:', error);
    }
  };

  fetchCourtsAndReservations();
}, [i]);
const [trainers,setTrainers]=useState([])
useEffect(()=>{
  const geetTrainers=async ()=>{
    const trainersRef= await getDocs(collection(db,'Trainees'))
    const trainersData= trainersRef.docs.map((doc)=>({id:doc.id,...doc.data()}))
    setTrainers(trainersData)
  }
  geetTrainers()
  },[])
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
    return// Set showModal to true when reservation is set
  }
}, [reservation]); // Dependency array ensures this effect runs when reservation changes

// Click handler for setting reservation
const handleSetReservation = (match) => {
  setReservation(match);
};


  return (
    <>
    <div className="container mx-auto  h-full mt-10 ">
        <h1 className="text-3xl font-bold mb-5">Matches</h1>
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
      {showModal && (<MatchDetails reservationDetails={reservation} setI={setI} i={i} setShowModal={setShowModal} courts={courts} setReservation={setReservation} trainers={trainers}/>
      )}
    </>
  );
};

export default ManageMatchesPage;
