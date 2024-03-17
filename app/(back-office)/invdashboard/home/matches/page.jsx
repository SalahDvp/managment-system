'use client'
import React, { useState } from 'react';

const ManageMatchesPage = () => {
  const initialMatches = [
    { id: 1, hour: '10:00', sport: 'Football', level: 'Intermediate', duration: '1.5 hours', players: '11', matchLevel: 'Friendly', courtName: 'Field 1' },
    { id: 2, hour: '12:00', sport: 'Volleyball', level: 'Advanced', duration: '2 hours', players: '6', matchLevel: 'Competitive', courtName: 'Court C' },
    { id: 3, hour: '14:00', sport: 'Badminton', level: 'Beginner', duration: '1 hour', players: '2', matchLevel: 'Casual', courtName: 'Court D' },
    { id: 4, hour: '16:00', sport: 'Soccer', level: 'Intermediate', duration: '2 hours', players: '10', matchLevel: 'Friendly', courtName: 'Field 2' },
    { id: 5, hour: '18:00', sport: 'Table Tennis', level: 'Advanced', duration: '1 hour', players: '2', matchLevel: 'Competitive', courtName: 'Table 1' },
    { id: 6, hour: '20:00', sport: 'Baseball', level: 'Beginner', duration: '2 hours', players: '9', matchLevel: 'Friendly', courtName: 'Field 3' },
    { id: 7, hour: '22:00', sport: 'Hockey', level: 'Intermediate', duration: '1.5 hours', players: '6', matchLevel: 'Casual', courtName: 'Rink 1' },
  ];

  const [matches, setMatches] = useState(initialMatches);
  const [searchHour, setSearchHour] = useState('');
  const [showModal, setShowModal] = useState(false);

  // State variables for form inputs
  const [matchDetails, setMatchDetails] = useState({
    hour: '',
    sport: '',
    level: '',
    duration: '',
    players: '',
    matchLevel: '',
    courtName: '',
  });

  const handleSearchChange = (event) => {
    setSearchHour(event.target.value);
    filterMatches(event.target.value);
  };

  const filterMatches = (searchString) => {
    const filteredMatches = initialMatches.filter(match =>
      match.hour.includes(searchString)
    );
    setMatches(filteredMatches);
  };

  const addNewMatch = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMatchDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const newMatch = { ...matchDetails, id: matches.length + 1 };
    setMatches([...matches, newMatch]);
    setShowModal(false);
    // Reset form fields after submission
    setMatchDetails({
      hour: '',
      sport: '',
      level: '',
      duration: '',
      players: '',
      matchLevel: '',
      courtName: '',
    });
  };

  return (
    <>
      <div className="flex flex-col items-start w-full h-screen overflow-y-scroll p-5 bg-white">
        <h1 className="text-3xl font-bold mb-5">Manage Matches</h1>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by match hour"
            value={searchHour}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button onClick={addNewMatch} className="mb-3 px-4 py-2 bg-blue-500 text-white rounded-md">Add New Match</button>
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
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Players
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches.map(match => (
                <tr key={match.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{match.hour}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.sport}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.players}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.matchLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.courtName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 h-full flex bg-indigo-600 bg-opacity-50 justify-end items-center overflow-scroll mb-10" style={{ height: '100%' }}>
          <button onClick={handleClose} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-3/6 h-full bg-white border rounded-lg flex flex-col justify-start items-start">
            <div className='flex'>
              <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Match Details</h2>
              <div className='ml-72'/>
              <div className="mt-4">
                <strong className='ml-2 mt-4 mb-6'>Match ID</strong>
                <input className="rounded-lg ml-5" type="text" placeholder="Enter Match ID" />
              </div>
            </div>
            {/* Form inputs */}
            <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
              <div className="ml-4 grid grid-cols-3 gap-4">
                <div>
                  <strong>Hour</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Hour" name="hour" value={matchDetails.hour} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Sport</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Sport" name="sport" value={matchDetails.sport} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Level</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Level" name="level" value={matchDetails.level} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Duration</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Duration" name="duration" value={matchDetails.duration} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Players</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Players" name="players" value={matchDetails.players} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Match Level</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Match Level" name="matchLevel" value={matchDetails.matchLevel} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Court Name</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Court Name" name="courtName" value={matchDetails.courtName} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <button onClick={handleSubmit} className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10">Add New</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageMatchesPage;
