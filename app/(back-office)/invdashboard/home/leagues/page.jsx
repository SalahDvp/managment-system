'use client'
import React, { useState } from 'react';

const ManageLeaguesPage = () => {
  const initialLeagues = [
    { id: 1, name: 'Football League', sport: 'Football', country: 'England', startDate: '2024-05-01', endDate: '2024-10-01', organizer: 'Football Association' },
    { id: 2, name: 'Basketball League', sport: 'Basketball', country: 'USA', startDate: '2024-06-01', endDate: '2024-09-01', organizer: 'Basketball Association' },
    { id: 3, name: 'Tennis League', sport: 'Tennis', country: 'France', startDate: '2024-07-01', endDate: '2024-12-01', organizer: 'Tennis Federation' },
  ];

  const [leagues, setLeagues] = useState(initialLeagues);
  const [searchName, setSearchName] = useState('');
  const [showModal, setShowModal] = useState(false);

  // State variables for form inputs
  const [leagueDetails, setLeagueDetails] = useState({
    name: '',
    sport: '',
    country: '',
    startDate: '',
    endDate: '',
    organizer: '',
  });

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
    filterLeagues(event.target.value);
  };

  const filterLeagues = (searchString) => {
    const filteredLeagues = initialLeagues.filter(league =>
      league.name.toLowerCase().includes(searchString.toLowerCase())
    );
    setLeagues(filteredLeagues);
  };

  const addNewLeague = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLeagueDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const newLeague = { ...leagueDetails, id: leagues.length + 1 };
    setLeagues([...leagues, newLeague]);
    setShowModal(false);
    // Reset form fields after submission
    setLeagueDetails({
      name: '',
      sport: '',
      country: '',
      startDate: '',
      endDate: '',
      organizer: '',
    });
  };

  return (
    <>
      <div className="flex flex-col items-start w-full h-screen overflow-y-scroll p-5 bg-white">
        <h1 className="text-3xl font-bold mb-5">Manage Leagues</h1>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by league name"
            value={searchName}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button onClick={addNewLeague} className="mb-3 px-4 py-2 bg-blue-500 text-white rounded-md">Add New League</button>
        <div className="overflow-x-auto w-full border">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sport
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leagues.map(league => (
                <tr key={league.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{league.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{league.sport}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{league.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{league.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{league.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{league.organizer}</td>
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
              <h2 className="text-xl font-bold ml-4 mt-4 mb-6">League Details</h2>
            </div>
            {/* Form inputs */}
            <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
              <div className="ml-4 grid grid-cols-3 gap-4">
                <div>
                  <strong>Name</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Name" name="name" value={leagueDetails.name} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Sport</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Sport" name="sport" value={leagueDetails.sport} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Country</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Country" name="country" value={leagueDetails.country} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Start Date</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Start Date" name="startDate" value={leagueDetails.startDate} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>End Date</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter End Date" name="endDate" value={leagueDetails.endDate} onChange={handleInputChange} />
                </div>
                <div>
                  <strong>Organizer</strong>
                  <input className="rounded-lg" type="text" placeholder="Enter Organizer" name="organizer" value={leagueDetails.organizer} onChange={handleInputChange} />
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

export default ManageLeaguesPage;
