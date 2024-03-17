'use client'
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const DemoApp = () => {
  const [eventType, setEventType] = useState('');
  const [events, setEvents] = useState([]);

  const classEvents = [
    {
      id: 1,
      title: 'Yoga Class',
      start: '2024-03-18T09:00:00',
      end: '2024-03-18T10:00:00',
      type: 'class',
    },
    {
      id: 2,
      title: 'Dance Class',
      start: '2024-03-19T11:00:00',
      end: '2024-03-19T12:00:00',
      type: 'class',
    },
    {
      id: 3,
      title: 'Pilates Class',
      start: '2024-03-20T10:00:00',
      end: '2024-03-20T11:00:00',
      type: 'class',
    }
  ];

  const tournamentEvents = [
    {
      id: 4,
      title: 'Football Tournament',
      start: '2024-03-19T14:00:00',
      end: '2024-03-19T16:00:00',
      type: 'tournament',
    },
    {
      id: 5,
      title: 'Basketball Tournament',
      start: '2024-03-21T13:00:00',
      end: '2024-03-21T15:00:00',
      type: 'tournament',
    },
    {
      id: 6,
      title: 'Tennis Tournament',
      start: '2024-03-23T12:00:00',
      end: '2024-03-23T14:00:00',
      type: 'tournament',
    }
  ];

  const leaguesEvents = [
    {
      id: 7,
      title: 'Soccer Leagues',
      start: '2024-03-17T16:00:00',
      end: '2024-03-17T18:00:00',
      type: 'leagues',
    },
    {
      id: 8,
      title: 'Golf Leagues',
      start: '2024-03-20T14:00:00',
      end: '2024-03-20T16:00:00',
      type: 'leagues',
    },
    {
      id: 9,
      title: 'Cricket Leagues',
      start: '2024-03-22T15:00:00',
      end: '2024-03-22T17:00:00',
      type: 'leagues',
    }
  ];

  const bookingEvents = [
    {
      id: 10,
      title: 'Conference Booking',
      start: '2024-03-18T14:00:00',
      end: '2024-03-18T16:00:00',
      type: 'booking',
    },
    {
      id: 11,
      title: 'Meeting Room Booking',
      start: '2024-03-21T09:00:00',
      end: '2024-03-21T11:00:00',
      type: 'booking',
    },
    {
      id: 12,
      title: 'Training Room Booking',
      start: '2024-03-24T10:00:00',
      end: '2024-03-24T12:00:00',
      type: 'booking',
    }
  ];

  const allEvents = [
    ...classEvents,
    ...tournamentEvents,
    ...leaguesEvents,
    ...bookingEvents
  ];

  const getColor = (type) => {
    switch (type) {
      case 'class':
        return 'blue';
      case 'tournament':
        return 'green';
      case 'leagues':
        return 'orange';
      case 'booking':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
    // Filter events based on event type
    switch (event.target.value) {
      case 'class':
        setEvents(classEvents);
        break;
      case 'tournament':
        setEvents(tournamentEvents);
        break;
      case 'leagues':
        setEvents(leaguesEvents);
        break;
      case 'booking':
        setEvents(bookingEvents);
        break;
      default:
        setEvents(allEvents);
    }
  };

  const handleEventClick = (info) => {
    // Show a pop-up with options for activating notifications or canceling the event
    const event = info.event;
    if (window.confirm(`Do you want to activate notifications for the event "${event.title}"?`)) {
      // Implement code for activating notifications
    } else {
      // Implement code for canceling the event
      event.setProp('backgroundColor', 'gray'); // Change event color to gray
    }
  };

  const [notes, setNotes] = useState('');
  const [noteList, setNoteList] = useState([]);
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
  return (
    <div className='flex bg-white'>
      <div style={{ width: '80%', height: '80%', marginRight: '50px' }}>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
          }}
          events={events.map(event => ({
            ...event,
            backgroundColor: getColor(event.type)
          }))}
          editable={true}
          eventResizable={true}
          eventClick={handleEventClick} // Add event click handler
        />
      </div>
      <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '10px' }}>Event Type</h2>
        <select
          value={eventType}
          onChange={handleEventTypeChange}
          style={{
            padding: '8px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '20px'
          }}
        >
          <option value="">Select Event Type</option>
          <option value="all">All</option>
          <option value="class">Class</option>
          <option value="tournament">Tournament</option>
          <option value="leagues">Leagues</option>
          <option value="booking">Booking</option>
          
        </select>
        <div style={{ marginBottom: '20px' }}>
          <h2>Notes</h2>
          <textarea
            value={notes}
            onChange={handleNoteChange}
            style={{ width: '100%', minHeight: '100px', padding: '8px', fontSize: '16px', marginBottom: '10px' }}
            placeholder="Write your notes here..."
          ></textarea>
         <button onClick={handleSaveNotes} style={{ backgroundColor: 'blue', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Notes</button>

        </div>
        <div>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {noteList.map((note, index) => (
              <li key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemoApp;
