'use client'
import styles from "./rightbar.module.css";

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { User2 } from "lucide-react";
import { fetchFirestoreData } from "@/app/Home/calendar/page";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import AutosuggestComponent from "../Autocomplete";
import { generateAvailableStartTimes,timestampToHourString } from "@/app/Home/matches/page";
const priceMap = {
    60: 200, // Price for 60 minutes
    90: 300, // Price for 90 minutes
    120: 500, // Price for 120 minutes
    // Add more duration-price mappings as needed
  };
const Rightbar = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventType, setSelectedEventType] = useState('all'); // Default value for select element
    const [noteList, setNoteList] = useState([
        {
          id: 1,
          content: "Contact HubbTennis Academy for partnership opportunities.",
          category: "Partnership",
          date: "2024-04-03"
        },
        {
          id: 2,
          content: "Research top tennis academies in Europe for coaching techniques.",
          category: "Research",
          date: "2024-04-03"
        },
        {
          id: 3,
          content: "Attend a workshop on sports psychology for tennis players.",
          category: "Training",
          date: "2024-04-03"
        },
        {
          id: 4,
          content: "Update website with new training programs for juniors.",
          category: "Website",
          date: "2024-04-03"
        },
        {
          id: 5,
          content: "Schedule a meeting with players to discuss tournament strategy.",
          category: "Strategy",
          date: "2024-04-03"
        }
      ])
    useEffect(() => {
        const fetchData = async () => {
            try {
              const { classes, allEvents} = await fetchFirestoreData();
  ;
                setEvents(allEvents);
            } catch (error) {
                console.error('Error fetching Firestore data:', error);
            }
        };
  
        fetchData();
    }, []);
    const [reservation, setReservation] = useState({
        date: new Date(),
        startTime: '',
        duration: '',
        courtName: '',
        payment: 'cash',
        Price: '',
        description: '',
        name: '',
      });
      const [modalIsOpen, setModalIsOpen] = useState(false);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReservation((prevReservation) => ({
          ...prevReservation,
          [name]: value,
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Create a new reservation event object based on reservation state
        const newReservation = {
          title: reservation.name, // Event title can be the user's name or reservation ID
          start: new Date(reservation.startTime), // Start time
          end: new Date(reservation.startTime + reservation.duration * 60000), // End time (start time + duration in minutes)
          court: reservation.courtName,
          description: reservation.description,
          payment: reservation.payment,
          Price: reservation.Price,
        };
        // Handle saving the new reservation to your database or state
        console.log('New Reservation:', newReservation);
        // Reset the form
        setReservation({
          date: new Date(),
          startTime: '',
          duration: '',
          courtName: '',
          payment: 'cash',
          Price: '',
          description: '',
          name: '',
        });
        // Close the modal after submission
        setModalIsOpen(false);
      };
      const courts=['court1']
      const [availableStartTimes,setAvailableStartTimes]=useState()


useEffect(()=>{
  if(reservation.date && reservation.duration && reservation.courtName){




    const availableStartTimes = generateAvailableStartTimes(reservation.courtName,reservation.date, reservation.duration,courts);
    setAvailableStartTimes(availableStartTimes)
    //console.log(availableStartTimes);
  }

},[reservation.date,reservation.duration,reservation.courtName])
  return (
    <div className={styles.container}>
              <div className={styles.item}>
        <div className={styles.text}>
        <span className={styles.notification}>Today's Events</span>
        <FullCalendar
  plugins={[timeGridPlugin, interactionPlugin, listPlugin]}
  initialView="timeGridDay" // Show one day view
  headerToolbar={{
    start: '',
    center: 'title',
    end: ''
  }}
  events={events}
  slotMinTime="09:00:00"
  slotMaxTime="22:00:00"
  slotDuration="00:30:00"
  headerToolbarCenterTitleStyle={{ fontSize: '16px' }}
  selectable={true} // Allow selecting time slots
        select={(info) => {
          // When a time slot is selected, set the start time in the reservation and open the modal
          setReservation((prevReservation) => ({
            ...prevReservation,
            startTime: info.start,
          }));
          setModalIsOpen(true);
        }}
      />
  {modalIsOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reservation Details</h2>
            <form onSubmit={handleSubmit}>
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
  {reservation.name &&(<div className="flex flex-col">
            <strong>Select sConsumer</strong>
<AutosuggestComponent trainers={trainers} setReservation={setReservation} reservation={reservation} name={reservation.name} />
  </div>)}
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
  </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.bgContainer}>
          {/* <Image className={styles.bg} src="/astronaut.png" alt="" fill /> */}
        </div>
        <div className={styles.text}>
          <span className={styles.notification}>Notes</span>
          <div>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {noteList.map((note, index) => (
              <li key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{note.content}</li>
            ))}
          </ul>
        </div>
        </div>
      </div>

    </div>
  );
};

export default Rightbar;