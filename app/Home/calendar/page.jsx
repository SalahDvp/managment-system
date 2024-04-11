'use client'
import { Button, Eventcalendar, formatDate, Popup, setOptions, Toast,
  Datepicker,
  
  Input,
  
  Segmented,
  SegmentedGroup,
  
  Snackbar,
  Switch,
  Textarea, 
  CalendarNav,
  CalendarPrev,
  CalendarToday,
  CalendarNext} from '@mobiscroll/react';
import { useCallback, useMemo, useRef, useState,useEffect } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { collection, getDocs, query, where, getFirestore, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { fetchFirestoreData } from './fetchData';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useAuth } from '@/context/AuthContext';
import { MatchDetails } from '../matches/page';
    // Function to calculate the difference in days based on the given day string
    const dayDiff = (day) => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDay = daysOfWeek.indexOf(day);
      const today = new Date().getDay();
      return targetDay >= today ? targetDay - today : 7 - (today - targetDay);
  };

async function updateFirestoreEvent(updatedEvent,oldEvent) {
  // Assuming you have the Firestore document ID stored in the event's extended properties
  const event = updatedEvent.extendedProps;
  const eventType = updatedEvent.extendedProps.type;

  // Update Firestore document based on the event ID and updated event data
  switch (eventType) {
      case 'class':
          await updateClassEvent(event, updatedEvent,oldEvent);
          break;
      case 'tournament':
          await updateTournamentEvent(event,  updatedEvent,oldEvent);
          break;
      case 'match':
          await updateMatchEvent(event, updatedEvent,oldEvent);
          break;
      default:
          console.error('Unknown event type:', eventType);
          // Handle unknown event type error
          break;
  }
}

async function updateClassEvent(event, updatedEvent,oldEvent) {
  // Update Firestore document for court event
  await updateDoc(doc(db, 'Classes', event.classId,'attendance',event.attendanceId), {
      // Update Firestore fields based on the updatedEvent object properties
      date: Timestamp.fromDate(updatedEvent.start), // Update start time
      end: Timestamp.fromDate(updatedEvent.end),
    oldDate:Timestamp.fromDate(oldEvent.start),
    oldEnd:Timestamp.fromDate(oldEvent.end),
      updated:true // Update end time
      // Update other fields as needed for courts
  });
}

async function updateTournamentEvent(eventId, updatedEvent,oldEvent) {
  // Update Firestore document for tournament event
  await updateDoc(doc(db, 'Tournaments', eventId), {
      // Update Firestore fields based on the updatedEvent object properties
      date: Timestamp.fromDate(updatedEvent.start), // Update start time
      end: Timestamp.fromDate(updatedEvent.end),
    oldDate:Timestamp.fromDate(oldEvent.start),
    oldEnd:Timestamp.fromDate(oldEvent.end),
      updated:true // Update end time
  });
}

async function updateMatchEvent(event, updatedEvent,oldEvent) {

  await updateDoc(doc(db, 'Courts',event.courtName,'Reservations',event.matchid),{
      // Update Firestore fields based on the updatedEvent object properties
      date:Timestamp.fromDate(updatedEvent.start),
      startTime: Timestamp.fromDate(updatedEvent.start), // Update start time
      endTime: Timestamp.fromDate(updatedEvent.end),
      updated:true, 
      oldDate:Timestamp.fromDate(oldEvent.start),
      oldEnd:Timestamp.fromDate(oldEvent.end),
      oldStart:Timestamp.fromDate(oldEvent.start),

  });
}


const DemoApp = () => {
  setOptions({
    theme: 'windows',
    themeVariant: 'light'
  });
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
  const courtss = useMemo(
    () => [
    {
      id: 1,
      name: 'Court1',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 2,
      name: 'Court2',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 3,
      name: 'Court3',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 4,
      name: 'Court4',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 5,
      name: 'Court5',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 6,
      name: 'Court6',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 7,
      name: 'Court7',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 8,
      name: 'Court8',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 9,
      name: 'Court9',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 10,
      name: 'Court10',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 11,
      name: 'Court11',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 12,
      name: 'Court12',
      cssClass: 'md-col-tick-border',
    },
    {
      id: 13,
      name: 'Court13',
      cssClass: 'md-col-tick-border',
    },
  ],
  [],
  );
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

  // Function to handle changes in selected event type
  const handleEventTypeChange = (event) => {
      setSelectedEventType(event.target.value); // Update selected event type
  };



  const getColor = (type) => {
    switch (type) {
      case 'class':
        return '#FF68A8';
      case 'tournament':
        return '#64CFF7';
      case 'leagues':
        return '#F7E752';
      case 'booking':
        return '#CA7CD8';
      default:
        return '#3968CB';
    }
  };




  const [notes, setNotes] = useState('');
  const [render,setRender]=useState(false)
  const handleNoteChange = (event) => {
    setNotes(event.target.value);
  };

  const handleSaveNotes = () => {
    if (notes.trim() !== '') {
      // Append note to the list
      setNoteList([...noteList, notes]);
      // Clear the notes field
      setNotes('');
    }
  };
  const filteredEvents = selectedEventType === 'all' ? events : events.filter(event => event.type === selectedEventType);
  const courtsData = [
    { id: 1, title: 'Court 1' },
    { id: 2, title: 'Court 2' },
    // Add more courts as needed
];
const [reservation,setReservation]=useState({players:[],reaccurance:0,date:new Date(),courtName:'',duration:60,startTime:"07:00",duration:60,payment:'cash',team1:[],team2:[],name:'name',description:'',coachname:'coach',reaccuring:false})

const [modalIsOpen, setModalIsOpen] = useState(false);
const {courts,trainers,trainees}=useAuth() 
  const [isOpen, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [closeOnOverlay, setCloseOnOverlay] = useState(false);
  const [info, setInfo] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonType, setButtonType] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState();


  

  const [mySelectedDate, setSelectedDate] = useState(new Date());

  const timerRef = useRef(null);

  const myView = useMemo(
    () => ({
      schedule: {
        type: 'day',
        
        startTime: '07:00',
        endTime: '22:00',
        allDay: false,
      },
    }),
    [],
  );
  const openTooltip = useCallback((args, closeOption) => {
    const event = args.event;
    const resource = courtss.find((dr) => dr.id === event.resource);
    const time = formatDate('hh:mm A', new Date(event.start)) + ' - ' + formatDate('hh:mm A', new Date(event.end));
    console.log(event);
  
    setCurrentEvent(event);

    if (event.confirmed) {
      setStatus('Confirmed');
      setButtonText('Cancel appointment');
      setButtonType('warning');
    } else {
      setStatus('Canceled');
      setButtonText('Confirm appointment');
      setButtonType('success');
    }

    setBgColor("red");
    setInfo(event.title);
    setTime(time);
    setReason(event.type);
    setLocation(resource.name);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setAnchor(args.domEvent.currentTarget || args.domEvent.target);
    setCloseOnOverlay(closeOption);
    setOpen(true);
  }, []);

  const handleEventHoverIn = useCallback(
    (args) => {
      openTooltip(args, false);
      console.log(args.event);
    },
    [openTooltip],
  );

  const handleEventHoverOut = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  }, []);



  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  }, []);

  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);
  const showToast = useCallback((message) => {
    setToastText(message);
    setToastOpen(true);
  }, []);
  const setStatusButton = useCallback(() => {
    setOpen(false);
    const index = events.findIndex((item) => item.id === currentEvent.id);
    const newApp = [...events];
    newApp[index].confirmed = !events[index].confirmed;
    setEvents(newApp);
    showToast('Appointment ' + (currentEvent.confirmed ? 'confirmed' : 'canceled'));
  }, [events, currentEvent, showToast]);

  const viewFile = useCallback(() => {
    setOpen(false);
    showToast('View file');
  }, [showToast]);

  const deleteApp = useCallback(() => {
    setEvents(events.filter((item) => item.id !== currentEvent.id));
    setOpen(false);
    showToast('Appointment deleted');
  }, [events, currentEvent, showToast]);



  const onSelectedDateChange = useCallback((event) => {
    setSelectedDate(event.date);
  }, []);


  const onEventCreated = useCallback(
    (args) => {



const startDate = new Date(args.event.start);
const endDate = new Date(args.event.end);
const durationInMilliseconds = endDate.getTime() - startDate.getTime();
const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
const startTimeString = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
const court = courtss.find(obj => obj.id === args.event.resource);
console.log(court);
setReservation((prev)=>({...prev,date:startDate,startTime:startTimeString,duration:durationInMinutes,courtName:court.name}))
     setModalIsOpen(true)

    },
    [],
  );



  const onEventUpdated = useCallback(() => {
    // here you can update the event in your storage as well, after drag & drop or resize
    // ...
  }, []);





  

  

  

  
  
 
  //MARK: new event data prop
 
  const saveEvent = (id, startTime, endTime, resource) => {
    const newEvent = {
      id: id,
      title: "Court Booking",
      description: "match",
      start: startTime,
      end: endTime,
      allDay: false,
      status: "not paid",
      color:"#90EE90",
      resource: resource,
    };
  
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setSelectedDate(startTime);
    setOpen(false);
  };
  
  
    const onClose = useCallback(() => {
  
 
        setEvents([...events]);
  
      setOpen(false);
    }, [events]);
    const renderCustomResource = useCallback(
      (resource) => (
        <div className="flex flex-row justify-center align-center items-center " >
                    <div className="mr-2"  >
          <svg width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
<path fill="#000000" d="M120.8 55L87.58 199h18.52l29.1-126h18.2l-20.6 126h18.3l10.1-62H247v62h18v-62h85.8l10.1 62h18.3L358.6 73h18.2l29.1 126h18.5L391.2 55H120.8zm50.9 18h168.6l7.6 46H164.1l7.6-46zM73 217v30h366v-30H73zm-.64 48L20.69 489H491.3l-51.7-224h-18.5l47.6 206h-45L390 265h-18.3l14.2 87H265v-87h-18v87H126.1l14.2-87H122L88.35 471H43.31l47.56-206H72.36zm50.74 105h265.8l16.5 101H106.6l16.5-101z"/>
          </svg>
            
            </div>
          <div className="resource-name">{resource.name}</div>

        </div>
      ),
      [],
    );
    const customWithNavButtons = useCallback(
      () => (
        <> 
          <CalendarNav className="cal-header-nav" />
          <div className="cal-header-picker">
          <div className="resource-name">{mySelectedDate.toLocaleString()}</div>

          </div>
          <CalendarPrev className="cal-header-prev" />
          <CalendarToday className="cal-header-today" />
          <CalendarNext className="cal-header-next" />
        </>
      ),
    
    );
  return (
    <div className="container mx-auto  h-full mt-10 ">
      <div className='flex items-center justify-between'>
      <h1 className="text-3xl font-bold mb-5">Schedule</h1>
        <div>
        <h2 style={{ marginBottom: '10px' }}>Event Type</h2>
        <select
         value={selectedEventType} onChange={handleEventTypeChange}
          style={{
            padding: '8px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '20px',
            width:"200px"
          }}
        >
         
          <option value="all">All</option>
          <option value="class">Class</option>
          <option value="tournament">Tournament</option>
          <option value="leagues">Leagues</option>
          <option value="match">Booking</option>
          
        </select>
        </div>
      </div>
        
        {/* <div className='bg-white pt-4 border rounded-lg flex-row flex'> */}
        <div style={{ width: '100%'}}>
      <Eventcalendar
        view={myView}
        resources={courtss}
        data={events}
        clickToCreate={true}
        dragToCreate={true}
        dragToMove={false}
        dragToResize={false}
        showEventTooltip={false}
        onEventHoverIn={handleEventHoverIn}
        onEventHoverOut={handleEventHoverOut} 
        selectedDate={mySelectedDate}
        onSelectedDateChange={onSelectedDateChange}
        onEventCreated={onEventCreated}
        onEventUpdated={onEventUpdated}
        dragTimeStep={30}
    renderResource={renderCustomResource}
    cssClass="md-switching-view-cont"
          new
      />
    
    
    <Popup
        display="anchored"
        isOpen={isOpen}
        anchor={anchor}
        touchUi={false}
        showOverlay={false}
        contentPadding={false}
        closeOnOverlayClick={closeOnOverlay}
        width={350}
        cssClass="md-tooltip"
      >
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="md-tooltip-header" style={{ backgroundColor: bgColor }}>
            <span className="md-tooltip-name-age">{info}</span>
            <span className="md-tooltip-time">{time}</span>
          </div>
          <div className="md-tooltip-info">
            <div className="md-tooltip-title">
              Status: <span className="md-tooltip-status md-tooltip-text">{status}</span>
              <Button color={buttonType} variant="outline" className="md-tooltip-status-button" onClick={setStatusButton}>
                {buttonText}
              </Button>
            </div>
            <div className="md-tooltip-title">
              Event: <span className="md-tooltip-reason md-tooltip-text">{reason}</span>
            </div>
            <div className="md-tooltip-title">
              Court: <span className="md-tooltip-location md-tooltip-text">{location}</span>
            </div>
            {/* <Button color="secondary" className="md-tooltip-view-button" onClick={viewFile}>
              View patient file
            </Button>
            <Button color="danger" variant="outline" className="md-tooltip-delete-button" onClick={deleteApp}>
              Delete appointment
            </Button> */}
          </div>
        </div>
      </Popup>
      <Toast message={toastText} isOpen={isToastOpen} onClose={handleToastClose} />



  {modalIsOpen && (
        <MatchDetails removeEvent={onClose}  saveEvent={saveEvent} setI={setRender}i={render} courts={courts} setShowModal={setModalIsOpen} setReservation={setReservation} reservationDetails={reservation} trainees={trainees} trainers={trainers}/>
      )}
      </div>

      {/* </div> */}
    </div>
  );
};

export default DemoApp;
{/* <FullCalendar
plugins={[timeGridPlugin, interactionPlugin, listPlugin]} // Include listPlugin for list view
initialView="timeGridWeek"
headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek,timeGridDay,listWeek' // Include list views in the header
}}
views={{
  listWeek: { buttonText: 'List Week' }, // Customize list week button text

}}
events={filteredEvents.map(event => ({
...event,
backgroundColor: getColor(event.type),
}))}
editable={true}
eventResizable={true}
eventClick={handleEventClick} 
eventDrop={async (info) => {
try {

await updateFirestoreEvent(info.event,info.oldEvent);
// Optionally handle success cases
} catch (error) {
console.error('Error updating Firestore event:', error);
// Handle error cases
}
}}
eventStartEditable={true}
eventResize={async (info) => {
try {

await updateFirestoreEvent(info.event,info.oldEvent);
// Optionally handle success cases
} catch (error) {
console.error('Error updating Firestore event:', error);
// Handle error cases
}
}}
slotMinTime="09:00:00" // Set minimum time to 9 AM
slotMaxTime="22:00:00" // Set maximum time to 9 PM
slotDuration="00:30:00" 
selectable={true} // Allow selecting time slots
        select={(info) => {
          // When a time slot is selected, set the start time in the reservation and open the modal
          setReservation((prevReservation) => ({
            ...prevReservation,
            startTime: new Date(info.start),
            date:new Date(info.start)
          }));
          setModalIsOpen(true);
        }}// Set slot duration to 15 minutes (adjust as needed)
/>  */}

{/* <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>


<h1 className='my-5 text-xl font-bold mb-5'>Notes</h1>
<div>
<ul style={{ listStyleType: 'none', padding: '0' }}>
  {noteList.map((note, index) => (
    <li key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{note.content}</li>
  ))}
</ul>
</div>
<textarea
  value={notes}
  onChange={handleNoteChange}
  style={{ width: '100%', minHeight: '100px', padding: '8px', fontSize: '16px', marginBottom: '10px' }}
  placeholder="Write your notes here..."
></textarea>
<button onClick={handleSaveNotes} className='button-white'>Save Notes</button>
</div> */}