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
import { MatchDetails } from "@/app/Home/matches/page";
import { useAuth } from "@/context/AuthContext";
const priceMap = {
    60: 200, // Price for 60 minutes
    90: 300, // Price for 90 minutes
    120: 500, // Price for 120 minutes
    // Add more duration-price mappings as needed
  };
const Rightbar = () => {
    const [events, setEvents] = useState([]);

    const [render,setRender]=useState(false)
    const {courts,trainers,trainees}=useAuth()


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
    const [reservation,setReservation]=useState({players:[],reaccurance:0,date:new Date(),courtName:'',duration:60,startTime:new Date().toISOString(),payment:'cash',team1:[],team2:[],name:'name',description:'',coachname:'coach',reaccuring:false}) 

      const [modalIsOpen, setModalIsOpen] = useState(false);
    
     
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
            startTime: new Date(info.start),
            date:new Date(info.start)
          }));
          setModalIsOpen(true);
        }}
      />
  {modalIsOpen && (
        <MatchDetails  setI={setRender}i={render} courts={courts} setShowModal={setModalIsOpen} setReservation={setReservation} reservationDetails={reservation} trainees={trainees} trainers={trainers}/>
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