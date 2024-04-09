'use client'
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { collection, getDocs, query, where, getFirestore, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { X } from 'lucide-react';

    // Function to calculate the difference in days based on the given day string

    const dayDiff = (day) => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDay = daysOfWeek.indexOf(day);
      const today = new Date().getDay();
      return targetDay >= today ? targetDay - today : 7 - (today - targetDay);
  };
  const fetchFirestoreData = async () => {

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


async function addNoteToFirestore(note) {
  try {
    const docRef = await addDoc(collection(db, 'Notes'), {
      note,
      timestamp: Timestamp.fromDate(new Date())
    });
    console.log('Note added with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding note: ', error);
  }
}


const DemoApp = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [noteList, setNoteList] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
        try {
            const notesQuery = query(collection(db, 'admin', 'E6YY9KA0rTTbp9DeIGZk', 'notes'));
            const notesSnapshot = await getDocs(notesQuery);
            const fetchedNotes = notesSnapshot.docs.map(doc => doc.data());
            setNoteList(fetchedNotes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    fetchNotes();
}, []);

  const addNote = async (newNote) => {
      const docRef = doc(db, "admin", 'E6YY9KA0rTTbp9DeIGZk');
      await updateDoc(docRef, {
          notes: arrayUnion(newNote)
      });

      setNoteList([...noteList, newNote]);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      const newNote = {
          id: noteList.length + 1,
          content: notes,
          category: "Your category here",
          date: new Date().toISOString().split('T')[0]
      };

      addNote(newNote);
      setNotes('');
  };


  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to hold the selected event details
   // Default value for select element

  // Existing useEffect and other function definitions remain the same

  const handleNoteChange = (event) => {
    setNotes(event.target.value);
};

const handleSaveNotes = () => {
    if (notes.trim() !== '') {
        const newNote = {
            id: noteList.length + 1,
            content: notes,
            category: "Your category here",
            date: new Date().toISOString().split('T')[0]
        };
        addNote(newNote);
        setNotes('');
    }
};
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event); // Save the clicked event to state
    setShowModal(true); // Show the modal
  };

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

  const handleCancelEvent = (event) => {
    if (window.confirm(`Do you want to cancel the event "${event.title}"?`)) {
      try {
        // Perform cancellation logic here
        // For example, you can delete the event from Firestore or mark it as canceled
        console.log('Event canceled successfully');
        // Optionally, update the FullCalendar events state to remove the canceled event
        setEvents(events.filter(ev => ev.id !== event.id));
      } catch (error) {
        console.error('Error canceling event:', error);
        // Handle error cases
      }
    }
  };

/*
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
*/
  
 
  
  const filteredEvents = selectedEventType === 'all' ? events : events.filter(event => event.type === selectedEventType);

 
  return (
    <div className="container mx-auto  h-full mt-10 ">
        <div className='flex items-center justify-between'>
            <h1 className="text-3xl font-bold mb-5">Schedule</h1>
            <div>
                <h2 style={{ marginBottom: '10px' }}>Event Type</h2>
                <select
                    value={selectedEventType}
                    onChange={handleEventTypeChange}
                    style={{
                        padding: '8px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginBottom: '20px',
                        width: "200px"
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
            <div style={{ width: '70%', margin: '50px', marginTop: '0px' }}>
                <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay,listWeek'
                    }}
                    views={{
                        listWeek: { buttonText: 'List Week' },
                    }}
                    events={filteredEvents.map(event => ({
                        ...event,
                        backgroundColor: getColor(event.type),
                    }))}
                    editable={true}
                    eventClick={handleEventClick}
                    eventDrop={async (info) => {
                        try {
                            await updateFirestoreEvent(info.event, info.oldEvent);
                        } catch (error) {
                            console.error('Error updating Firestore event:', error);
                        }
                    }}
                    eventStartEditable={true}
                    eventResize={async (info) => {
                        try {
                            await updateFirestoreEvent(info.event, info.oldEvent);
                        } catch (error) {
                            console.error('Error updating Firestore event:', error);
                        }
                    }}
                    slotMinTime="09:00:00"
                    slotMaxTime="22:00:00"
                    slotDuration="00:30:00"
                />
            </div>
            <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
                <h1 className='my-5 text-xl font-bold mb-5'>Notes</h1>
                <div>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                {noteList.map((note, index) => (
                    <li key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                        {note.content}
                    </li>
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
        {showModal && selectedEvent && (
  <div id="popup-modal" tabIndex="-1" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-30 backdrop-blur-sm">
    <div className="relative p-4 w-full max-w-md max-h-full">
      <div className="relative bg-white rounded-lg shadow">
        <button onClick={() => setShowModal(false)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
          <X size={24} /> {/* Assuming you have Lucid Icons correctly set up */}
          <span className="sr-only">Close modal</span>
        </button>
        <div className="p-4 md:p-5 text-center">
          <h2 className="mb-5 text-lg font-normal text-gray-500">{selectedEvent.title}</h2>
          <p className="text-gray-700 mb-2">Start: {selectedEvent.start.toISOString()}</p>
          <p className="text-gray-700 mb-4">End: {selectedEvent.end.toISOString()}</p>
          {/* You can include more details based on what you store in your event objects */}
          <div className="flex justify-end space-x-4">
            <button className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
              Copy
            </button>
            <button onClick={() => handleCancelEvent(selectedEvent)} className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
);
};



export default DemoApp;
