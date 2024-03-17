// pages/index.js
'use client'
// pages/index.js
// pages/index.js
// pages/index.js
import React, { useState } from 'react';
import Head from 'next/head';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [filter, setFilter] = useState('pastWeek'); // Default filter

  // Dummy data, replace with actual data from your backend
  const dashboardData = {
    matches: {
      pastWeek: { matchesPlayed: 15, revenues: 3000, transactedOnline: 2000, users: 100, newUsers: 10 },
      pastTwoWeeks: { matchesPlayed: 20, revenues: 3500, transactedOnline: 2500, users: 120, newUsers: 15 },
      pastMonth: { matchesPlayed: 30, revenues: 4000, transactedOnline: 3000, users: 150, newUsers: 20 },
      pastThreeMonths: { matchesPlayed: 45, revenues: 4500, transactedOnline: 3500, users: 180, newUsers: 25 },
      pastSixMonths: { matchesPlayed: 70, revenues: 5000, transactedOnline: 4000, users: 200, newUsers: 30 },
      pastYear: { matchesPlayed: 120, revenues: 6000, transactedOnline: 5000, users: 250, newUsers: 40 },
      fromStart: { matchesPlayed: 300, revenues: 10000, transactedOnline: 8000, users: 500, newUsers: 100 }
    },
    
    leagues: {
      pastWeek: { leaguesPlayed: 5, revenues: 1500, transactedOnline: 1000, users: 50, newUsers: 5 },
      // Add data for other time frames
    },
    classes: {
      pastWeek: { classesAttended: 20, revenues: 2000, transactedOnline: 1500, users: 75, newUsers: 7 },
      // Add data for other time frames
    },
    tournaments: {
      pastWeek: { tournamentsParticipated: 10, revenues: 2500, transactedOnline: 1800, users: 80, newUsers: 8 },
      // Add data for other time frames
    },
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const renderDashboardData = () => {
    const { matches, leagues, classes, tournaments } = dashboardData;
    const { matchesPlayed, revenues, transactedOnline, users, newUsers } = matches[filter];
    const { leaguesPlayed, classesAttended, tournamentsParticipated } = filter === 'pastWeek' ? leagues[filter] : {};

    return (
      <div className="bg-white justify-center p-4 w-full">
        <div className="p-4 rounded shadow-md w-full flex justify-around">
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="Tennis Ball" className="text-3xl mb-2">🎾</span>
            <p className="text-lg font-bold">Matches Played</p>
            <p>{matchesPlayed}</p>
          </div>
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="Money Bag" className="text-3xl mb-2">💰</span>
            <p className="text-lg font-bold">Revenues</p>
            <p>${revenues}</p>
          </div>
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="Computer" className="text-3xl mb-2">💻</span>
            <p className="text-lg font-bold">Transacted Online</p>
            <p>${transactedOnline}</p>
          </div>
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="Users" className="text-3xl mb-2">🤾🏻‍♂️</span>
            <p className="text-lg font-bold">Users</p>
            <p>{users}</p>
          </div>
          <div className="flex flex-col items-center w-1/5 rounded-lg border p-4 mr-4 shadow-md">
            <span role="img" aria-label="New Users" className="text-3xl mb-2">🙋🏻‍♀️</span>
            <p className="text-lg font-bold">New Users</p>
            <p>{newUsers}</p>
          </div>
        </div>
      </div>
    );
  };

  const coachesStatus = [
    { name: 'Lunea Todd', status: 'Absent' },
    { name: 'Ida F. Mullen', status: 'Absent' },
    { name: 'Teresa R McRae', status: 'Absent' },
    { name: 'Joel O Dolan', status: 'Absent' },
    { name: 'Anjolie Mayer', status: 'Absent' },
    { name: 'Nyssa Sloan', status: 'Absent' },
    { name: 'Jillian Sykes', status: 'Absent' },
    { name: 'Aida Bugg', status: 'Absent' },
    { name: 'Kyle Willis', status: 'Absent' },
    { name: 'Abra Stevens', status: 'Absent' },
  ];

  const renderMatchData = () => {
    // Dummy data for demonstration
    const matchData = {
      labels: [
        'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7',
      ],
      bookedOnline: [10, 15, 8, 12, 20, 18, 25], // Number of people who booked online
      bookedOffline: [5, 8, 6, 9, 10, 12, 8], // Number of people who booked offline
    };

    return (
      <div className="flex-grow border rounded-lg p-2" style={{ height: '350px', width: '50%' }}>
        <strong className="font-bold mb-2">Matches Info</strong>
        <Bar
          data={{
            labels: matchData.labels,
            datasets: [
              {
                label: 'Booked Online',
                data: matchData.bookedOnline,
                backgroundColor: '#3182CE', // Color for online bookings
              },
              {
                label: 'Booked Offline',
                data: matchData.bookedOffline,
                backgroundColor: '#E53E3E', // Color for offline bookings
              },
            ],
          }}
          options={{
            scales: {
              x: {
                stacked: true,
                type: 'category', // Specify the type for x-axis scale
              },
              y: {
                stacked: true,
              },
            },
          }}
        />
      </div>
    );
  };

  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const handleInputChange = (e) => {
    setNewAnnouncement(e.target.value);
  };

  const handleSubmit = () => {
    if (newAnnouncement.trim() !== '') {
      setAnnouncements([...announcements, newAnnouncement]);
      setNewAnnouncement('');
    }
  };
  const events = [
    {
      title: "Conference",
      startDate: "2024-04-01",
      endDate: "2024-04-03",
      description: "Annual conference for industry professionals.",
    },
    {
      title: "Product Launch",
      startDate: "2024-05-15",
      endDate: "2024-05-15",
      description: "Launch event for our new product line.",
    },
    {
      title: "Training Workshop",
      startDate: "2024-06-10",
      endDate: "2024-06-12",
      description: "Three-day workshop on advanced techniques.",
    },
  ];

  return (
    <div className="container mx-auto bg-white h-full">
      <div className="h-full flex flex-col relative">
        <div className="absolute top-0 right-0 mt-4 mr-2 flex items-center z-10">
          <label htmlFor="filter" className="mr-2">Filter:</label>
          <select id="filter" value={filter} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded">
            {/* Options */}
            <option value="pastWeek">Past Week</option>
            <option value="pastTwoWeeks">Past Two Weeks</option>
            <option value="pastMonth">Past Month</option>
            <option value="pastThreeMonths">Past 3 Months</option>
            <option value="pastSixMonths">Past 6 Months</option>
            <option value="pastYear">Past Year</option>
            <option value="fromStart">From Start</option>
          </select>
        </div>
        <h2 className="text-3xl font-bold mb-10 ml-2">Dashboard</h2>
        <div className="mb-4 ml-4 " style={{ width: '98%' }}>
          <div className="flex-grow border rounded-lg  p-2">
            <strong className="font-bold mb-2">Info</strong>
            {/* Render dashboard data here */}
            {renderDashboardData()}
          </div>
          <div className="flex mb-4 ml-4 mt-3">
            {/* Render the new section */}
            {renderMatchData()}
            <div className="ml-4 overflow-x-auto border rounded-lg w-1/2 p-2">
              <strong className="block mb-2 text-l font-semibold">Today's Not Clock:</strong>
              <div style={{ height: '300px', overflowY: 'auto' }}>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-200 text-blue-600 w-40">Name</th>
                  <th className="px-4 py-2 bg-gray-200 text-blue-600 w-40">Status</th>
                </tr>
              </thead>
              <tbody>
                {coachesStatus.map(coach => (
                  <tr key={coach.name}>
                    <td className="border px-4 py-2">{coach.name}</td>
                    <td className="border px-4 py-2">{coach.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            </div>

          </div>
      </div>
      <div className=" h-500 overflow-auto border rounded-lg p-4 mt-4 ml-4" style={{width:'98%'}}>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-white px-4 py-2">Title</th>
            <th className="border border-white px-4 py-2">Start Date</th>
            <th className="border border-white px-4 py-2">End Date</th>
            <th className="border border-white px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="border border-white px-4 py-2">{event.title}</td>
              <td className="border border-white px-4 py-2">{event.startDate}</td>
              <td className="border border-white px-4 py-2">{event.endDate}</td>
              <td className="border border-white px-4 py-2">{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    
    </div>
  );
};

export default Dashboard;
