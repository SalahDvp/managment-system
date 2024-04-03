'use client'
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { collection, getDocs, query, where, getFirestore, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase';

    // Function to calculate the difference in days based on the given day string
    const dayDiff = (day) => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDay = daysOfWeek.indexOf(day);
      const today = new Date().getDay();
      return targetDay >= today ? targetDay - today : 7 - (today - targetDay);
  };
 export  const fetchFirestoreData = async () => {

    const classesQuery = query(collection(db, 'Classes'));
    const classesSnapshot = await getDocs(classesQuery);
    const classesData = classesSnapshot.docs.map(doc => ({
        classId: doc.id,
        className: doc.data().className,
    }));
    
    const eventsPromises = classesData.map(async classData => {
        const attendanceQuery = query(collection(db, `Classes/${classData.classId}/attendance`));
        const attendanceSnapshot = await getDocs(attendanceQuery);

        const attendanceData = attendanceSnapshot.docs.map(doc => ({
            attendanceId: doc.id,
            ...doc.data()
            // Include other data you need from the attendance document
        }));

        return attendanceData.map(attendance => ({
            title: classData.className,
            start: attendance.date.toDate().toISOString(), // Assuming start is a Firestore timestamp
            end:new Date(new Date(attendance.date.toDate()).getTime() + 2 * 60 * 60 * 1000).toISOString() , // Assuming end is a Firestore timestamp
            type: 'class',
            classId: classData.classId,
            attendanceId: attendance.attendanceId,
        }));
    });
    
    const allClasses = (await Promise.all(eventsPromises)).flat();

    // Fetch tournament data and construct events
    const tournamentsQuery = query(collection(db, 'Competitions'));
    const tournamentsSnapshot = await getDocs(tournamentsQuery);
    const tournamentsEvents = tournamentsSnapshot.docs.map(doc => ({
        title: doc.data().type,
        start: doc.data().date.toDate().toISOString(), // Assuming start is a Firestore timestamp
        end: doc.data().end.toDate().toISOString(), // Assuming end is a Firestore timestamp
        type: 'tournament',
        id:doc.id
    }));

    // Fetch court reservations data and construct events

    const courtsWithReservations = [];
 // Fetch court reservations data
  const courtsQuery = query(collection(db, 'Courts'));
  const courtsSnapshot = await getDocs(courtsQuery);
  const courtsData = courtsSnapshot.docs.map(doc => doc.data());

  // Assuming each court has a subcollection "Reservations"
  
  for (const courtDoc of courtsData) {
    const reservationsQuery = query(collection(db, `Courts/${courtDoc.name}/Reservations`));
    const reservationsSnapshot = await getDocs(reservationsQuery);
    const reservationsData = reservationsSnapshot.docs
    .filter(doc => doc.data().type === undefined) // Filter out documents without the 'type' field
    .map(doc => ({
      title: doc.data().courtName,
      start: doc.data().startTime.toDate().toISOString(),
      end: doc.data().endTime.toDate().toISOString(),
      type: 'match',
      matchid: doc.id,
      courtName: doc.data().courtName
    }));

    // Merge reservationsData into courtsWithReservations
    courtsWithReservations.push(...reservationsData);
}
    // Merge all events  s,
    const allEvents = [...tournamentsEvents,...courtsWithReservations,...allClasses]

    return { classes: allClasses,tournaments: tournamentsEvents,  allEvents: allEvents,courts: courtsWithReservations };
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


  const handleEventClick = (info) => {
    if (window.confirm(`Do you want to cancel the event "${info.event.title}"?`)) {
      try {
          // Delete the event from Firestore based on its ID
          //await deleteEventFromFirestore(info.event.id);
          // Optionally, update the FullCalendar events state to remove the deleted event
          setEvents(events.filter(ev => ev.id !== info.event.id));
          // Optionally handle success cases
          console.log('Event canceled successfully');
      } catch (error) {
          console.error('Error canceling event:', error);
          // Handle error cases
      }
  }
  };

  const [notes, setNotes] = useState('');

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
        
        <div className='bg-white pt-4 border rounded-lg flex-row flex'>
      <div style={{ width: '70%', margin: '50px',marginTop:'0px'}}>
        <FullCalendar
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
      slotDuration="00:30:00" // Set slot duration to 15 minutes (adjust as needed)
        />
      </div>
      <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>


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
      </div>
      </div>
    </div>
  );
};

export default DemoApp;
