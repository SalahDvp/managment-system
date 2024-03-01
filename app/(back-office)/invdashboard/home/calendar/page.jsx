'use client';
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // import interaction plugin

export default class DemoApp extends React.Component {
  state = {
    events: [ // Sample data representing sports events
      {
        id: 1,
        title: 'Football',
        start: '2024-02-11T10:00:00',
        end: '2024-02-11T12:00:00',
        pitchNumber: 1,
        coachName: 'John Doe',
        sportKind: 'Football',
        academicGroup: 'Group A',
        backgroundColor: 'blue' // Unique color for Football
      },
      {
        id: 2,
        title: 'Basketball',
        start: '2024-02-12T13:00:00',
        end: '2024-02-12T15:00:00',
        pitchNumber: 2,
        coachName: 'Jane Smith',
        sportKind: 'Basketball',
        academicGroup: 'Group B',
        backgroundColor: 'orange' // Unique color for Basketball
      },
      // Add more events as needed
    ]
  };

  render() {
    return (
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true} // Enable editing of events
        eventResizable={true} // Enable resizing of events
        events={this.state.events} // Pass the events data
        eventClick={this.handleEventClick} // Callback when an event is clicked
        eventDrop={this.handleEventDrop} // Callback when an event is dropped
        eventResize={this.handleEventResize} // Callback when an event is resized
      />
    )
  }

  // Event click handler
  handleEventClick = (info) => {
    alert(`Event: ${info.event.title}\nTime: ${info.event.start.toLocaleString()} - ${info.event.end.toLocaleString()}\nPitch Number: ${info.event.extendedProps.pitchNumber}\nCoach Name: ${info.event.extendedProps.coachName}\nSport Kind: ${info.event.extendedProps.sportKind}\nAcademic Group: ${info.event.extendedProps.academicGroup}`);
  }

  // Event drop handler
  handleEventDrop = (info) => {
    const { events } = this.state;
    const eventIndex = events.findIndex(event => event.id === info.event.id);
    if (eventIndex !== -1) {
      const currentDateTime = new Date();
      const droppedEventStart = new Date(info.event.start);
      if (droppedEventStart <= currentDateTime) {
        // If the dropped event's start date is before or equal to the current date, revert its position
        info.revert();
        return;
      }
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        start: info.event.start,
        end: info.event.end
      };
      this.setState({ events: updatedEvents });
    }
  }

  // Event resize handler
  handleEventResize = (info) => {
    const { events } = this.state;
    const eventIndex = events.findIndex(event => event.id === info.event.id);
    if (eventIndex !== -1) {
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        start: info.event.start,
        end: info.event.end
      };
      this.setState({ events: updatedEvents });
    }
  }
}
