'use client'
import React, { useState,useEffect } from 'react';
import { useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const ManageTournamentsPage = () => {
  const initialTournaments = [
    { id: 1, name: 'Football Tournament', sport: 'Football', location: 'Stadium A', startDate: '2024-04-01', endDate: '2024-04-03', organizer: 'Sports Club A' },
    { id: 2, name: 'Basketball Championship', sport: 'Basketball', location: 'Arena B', startDate: '2024-04-10', endDate: '2024-04-12', organizer: 'Sports Club B' },
    { id: 3, name: 'Tennis Open', sport: 'Tennis', location: 'Court C', startDate: '2024-04-20', endDate: '2024-04-22', organizer: 'Sports Club C' },
  ];

  const [tournaments, setTournaments] = useState(initialTournaments);
  const [searchName, setSearchName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tournamentDetails, setTournamentDetails] = useState({
    name: '',
    sport: '',
    location: '',
    startDate: '',
    endDate: '',
    organizer: '',
    numRounds: 0,
    numTeams: 0,
  });
  const [phase, setPhase] = useState(1);

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
    filterTournaments(event.target.value);
  };

  const filterTournaments = (searchString) => {
    const filteredTournaments = initialTournaments.filter(tournament =>
      tournament.name.toLowerCase().includes(searchString.toLowerCase())
    );
    setTournaments(filteredTournaments);
  };

  const addNewTournament = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTournamentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const newTournament = { ...tournamentDetails, id: tournaments.length + 1 };
    setTournaments([...tournaments, newTournament]);
    setShowModal(false);
    // Reset form fields after submission
    setTournamentDetails({
      name: '',
      sport: '',
      location: '',
      startDate: '',
      endDate: '',
      organizer: '',
    });
  };

  const nextPhase = () => {
    setPhase(phase + 1);
  };

  const previousPhase = () => {
    setPhase(phase - 1);
  };

const [teams, setTeams] = useState(2); // Initial number of teams
const [rounds, setRounds] = useState(1); // Initial number of rounds

const handleTeamsChange = (event) => {
  const newTeams = parseInt(event.target.value);
  if (newTeams % 2 === 0 && newTeams > 0) {
    setTeams(newTeams);
    setRounds(Math.ceil(Math.log2(newTeams))); // Calculate the number of rounds based on the number of teams
  } else {
    alert("Please enter a positive even number of teams.");
  }
};



// scheme part 
const Team = ({ team }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TEAM',
    item: { team },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: '1px solid black',
        padding: '5px',
        margin: '5px',
        borderRadius: '5px',
        backgroundColor: '#e2e8f0',
      }}
    >
      {team.name}
    </div>
  );
};

const Scheme = ({ teams }) => {
  const [scheme, setScheme] = useState({
    "Quarter-finals": [
      { home: null, away: null },
      { home: null, away: null },
      { home: null, away: null },
      { home: null, away: null }
    ],
    "Semi-finals": [
      { home: null, away: null },
      { home: null, away: null }
    ],
    "Final": [
      { home: null, away: null }
    ]
  });

  const handleDrop = (round, index, team) => {
    const newScheme = { ...scheme };
    newScheme[round][index] = team;
    setScheme(newScheme);
  };

  const renderRound = (roundName, round) => {
    return (
      <div key={roundName}>
        <h2>{roundName}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {round.map((match, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                onDrop={() => handleDrop(roundName, index, null)}
                onDragOver={(e) => e.preventDefault()}
                style={{ 
                  border: '1px solid black', 
                  width: '100px', 
                  height: '50px', 
                  textAlign: 'center', 
                  lineHeight: '50px',
                  margin: '5px',
                  borderRadius: '5px',
                  backgroundColor: '#edf2f7',
                }}
              >
                {match.home ? match.home.name : 'Drop here'}
              </div>
              <div>vs</div>
              <div
                onDrop={() => handleDrop(roundName, index, null)}
                onDragOver={(e) => e.preventDefault()}
                style={{ 
                  border: '1px solid black', 
                  width: '100px', 
                  height: '50px', 
                  textAlign: 'center', 
                  lineHeight: '50px',
                  margin: '5px',
                  borderRadius: '5px',
                  backgroundColor: '#edf2f7',
                }}
              >
                {match.away ? match.away.name : 'Drop here'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {Object.entries(scheme).map(([roundName, round]) => renderRound(roundName, round))}
      <h2>Teams</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {teams.map((team, index) => (
          <Team key={index} team={team} />
        ))}
      </div>
    </div>
  );
};


  const [teams2] = useState([
    { name: 'Arsenal' },
    { name: 'Atlético de Madrid' },
    { name: 'Barcelona' },
    { name: 'Bayern' },
    { name: 'Dortmund' },
    { name: 'Man City' },
    { name: 'Paris' },
    { name: 'Real Madrid' },
  ]);


  return (
    <>
      <div className="flex flex-col items-start w-full h-screen overflow-y-scroll p-5 bg-white">
        <h1 className="text-3xl font-bold mb-5">Manage Tournaments</h1>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by tournament name"
            value={searchName}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button onClick={addNewTournament} className="mb-3 px-4 py-2 bg-blue-500 text-white rounded-md">Add New Tournament</button>
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
                  Location
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
              {tournaments.map(tournament => (
                <tr key={tournament.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{tournament.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tournament.sport}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tournament.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tournament.startDate}</td>
<td className="px-6 py-4 whitespace-nowrap">{tournament.endDate}</td>
<td className="px-6 py-4 whitespace-nowrap">{tournament.organizer}</td>
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
<div className="w-full h-full  h-auto bg-white border rounded-lg p-6 flex flex-col justify-start items-start shadow-lg">
  <div className='flex'>
    <h2 className="text-xl font-bold mb-6">Tournament Details</h2>
  </div>
  {/* Form inputs */}
  {phase === 1 && (
    <div className="border rounded-lg p-4 w-full mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="font-semibold">Name</label>
          <input
            id="name"
            className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder="Enter Name"
            name="name"
            value={tournamentDetails.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="sport" className="font-semibold">Sport</label>
          <input
            id="sport"
            className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder="Enter Sport"
            name="sport"
            value={tournamentDetails.sport}
            onChange={handleInputChange}
          />
        </div>
       
        <div>
          <label htmlFor="startDate" className="font-semibold">Start Date</label>
          <input
            id="startDate"
            className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
            type="date"
            placeholder="Enter Start Date"
            name="startDate"
            value={tournamentDetails.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="font-semibold">End Date</label>
          <input
            id="endDate"
            className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
            type="date"
            placeholder="Enter End Date"
            name="endDate"
            value={tournamentDetails.endDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="location" className="font-semibold">Location</label>
          <input
            id="location"
            className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder="Enter Location"
            name="location"
            value={tournamentDetails.location}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="organizer" className="font-semibold">Organizer</label>
          <input
            id="organizer"
            className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder="Enter Organizer"
            name="organizer"
            value={tournamentDetails.organizer}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button onClick={nextPhase} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4">Next</button>
    </div>
  )}
  {phase === 2 && (
    <div className="border rounded-lg p-4 w-full mb-8">
      <h2 className="text-lg font-semibold mb-2">Round and Teams Setup Phase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="numRounds" className="font-semibold">Number of Rounds:</label>
          <input
          
            value={rounds}
            readOnly
            className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
        <label htmlFor="numTeams" className="font-semibold">Number of Teams:</label>
      <input
        id="numTeams"
        type="number"
        name="numTeams"
        value={teams}
        onChange={handleTeamsChange}
        min="2" // Set minimum value to 2 to ensure it remains a positive even number
        max="64"
        step="2" // Set step to 2 to ensure only even numbers are allowed
        className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
      />
        </div>
      </div>
      <div className="mt-4">
        <button onClick={previousPhase} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4">Previous</button>
        <button onClick={nextPhase} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Next</button>
      </div>
    </div>
  )}
  {phase === 3 && (
    <div className="border rounded-lg p-4 w-full mb-8">
    <h2 className="text-lg font-semibold mb-2">Round and Teams Setup Phase</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DndProvider backend={HTML5Backend}>
      <Scheme teams={ teams2} />
    </DndProvider>
    </div>
    <div className="mt-4">
        <button onClick={previousPhase} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4">Previous</button>
        <button onClick={nextPhase} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Next</button>
      </div>
    </div>
  )}


  {/* Add other phases similarly */}
  <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-auto">Add New</button>
</div>

    </div>
  )}
</>
);
};

export default ManageTournamentsPage;
