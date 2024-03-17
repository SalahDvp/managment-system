'use client'
import React, { useState } from 'react';

const ManageLeaguesPage = () => {
  const initialLeagues = [
    { id: 1, name: 'Premier League', sport: 'Football', level: 'Professional', country: 'England' },
    { id: 2, name: 'NBA', sport: 'Basketball', level: 'Professional', country: 'United States' },
    { id: 3, name: 'IPL', sport: 'Cricket', level: 'Professional', country: 'India' },
    // Add more leagues as needed
  ];

  const [leagues, setLeagues] = useState(initialLeagues);
  const [searchName, setSearchName] = useState('');
  const [showModal, setShowModal] = useState(false);

  // State variables for form inputs
  const [leagueDetails, setLeagueDetails] = useState({
    name: '',
    sport: '',
    level: '',
    country: '',
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
      level: '',
      country: '',
    });
  };

  return (
    <div className="flex flex-col items-start w-full h-screen overflow-y-scroll p-5 bg-gray-100">
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
      <div className="overflow-x-auto w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sport
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leagues.map(league => (
              <tr key={league.id}>
                <td className="px-6 py-4 whitespace-nowrap">{league.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{league.sport}</td>
                <td className="px-6 py-4 whitespace-nowrap">{league.level}</td>
                <td className="px-6 py-4 whitespace-nowrap">{league.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-10">
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add New League</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name">Name:</label>
                <input className="border rounded-md px-2 py-1" type="text" name="name" value={leagueDetails.name} onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="sport">Sport:</label>
                <input className="border rounded-md px-2 py-1" type="text" name="sport" value={leagueDetails.sport} onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="level">Level:</label>
                <input className="border rounded-md px-2 py-1" type="text" name="level" value={leagueDetails.level} onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="country">Country:</label>
                <input className="border rounded-md px-2 py-1" type="text" name="country" value={leagueDetails.country} onChange={handleInputChange} />
              </div>
              <div className="col-span-2">
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Add League</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLeaguesPage;
