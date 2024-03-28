'use client'
import { Eye, Pencil } from 'lucide-react';

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
    
      // Proceed to generate matches
   
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
      numRounds: 0,
      numTeams: 0,
      registrationDeadline: '',
      gender: '',
      visibility: 'public',
    });
  
}

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
const handleDrop = (round, index, team) => {
  const newScheme = { ...scheme };
  newScheme[round][index] = { ...newScheme[round][index], [team.side]: team.name };
  setScheme(newScheme);
};


// scheme part 
const Team = ({ team, side }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TEAM',
    item: { team, side },
    collect: (monitor) => ({
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
  const [matches, setMatches] = useState([]);

  const generateMatches = () => {
    const matchesArray = [];
    // Generating matches for each round
    for (let i = 0; i < teams.length / 2; i++) {
      matchesArray.push({
        home: teams[i],
        away: teams[teams.length - 1 - i],
      });
    }
    setMatches(matchesArray);
  };

  return (
    <div>
      <button onClick={generateMatches} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-4">
        Generate Matches
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <div key={index} className="flex items-center">
            <div className="border border-gray-300 rounded-md p-2 mb-2 mr-4">
              {match.home && <Team team={match.home} side="home" />}
            </div>
            <div>vs</div>
            <div className="border border-gray-300 rounded-md p-2 ml-4">
              {match.away && <Team team={match.away} side="away" />}
            </div>
          </div>
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
    { name: 'Dortmund' },
    { name: 'Man City' },
    { name: 'Paris' },
    { name: 'Real Madrid' },
    { name: 'Dortmund' },
    { name: 'Man City' },
    { name: 'Paris' },
    { name: 'Real Madrid' },
    { name: 'Dortmund' },
    { name: 'Man City' },
    { name: 'Paris' },
    { name: 'Real Madrid' },
  ]);

  
  const [teamss, setTeamss] = useState([]);
  const [playerss, setPlayerss] = useState([]);
  
  const [newTeam, setNewTeam] = useState({
    name: '',
    playerss: [],
  });
  
  const handleTeamInputChange = (event) => {
    setNewTeam({ ...newTeam, [event.target.name]: event.target.value });
  };
  
  const handleAddTeam = () => {
    if (teamss.length === teams) {
      alert(`You have reached the maximum number of teams (${teams}).`);
    } else {
      setTeamss([...teamss, newTeam]);
      setNewTeam({
        name: '',
        playerss: [],
      });
    }
  };
  
  const handleAddPlayer = (teamIndex) => {
    const playerName = prompt('Enter player name:');
    if (playerName) {
      const updatedTeams = [...teamss];
      updatedTeams[teamIndex].playerss.push(playerName);
      setTeamss(updatedTeams);
    }
  };
  
  const handleDeleteTeam = (teamIndex) => {
    const updatedTeams = [...teamss];
    updatedTeams.splice(teamIndex, 1);
    setTeamss(updatedTeams);
  };
  
  const handleAddPlayerToTeam = (teamIndex) => {
    const updatedTeams = [...teamss];
    const playerName = newTeam.playerName.trim();
    if (playerName) {
      updatedTeams[teamIndex].playerss.push(playerName);
      setTeamss(updatedTeams);
      setNewTeam({
        ...newTeam,
        playerName: '',
      });
    } else {
      // You may want to add some validation or display an error message
      alert('Please enter a valid player name.');
    }
  };
  
  

  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleEdit = (tournament) => {
    setSelectedTournament(tournament);
    setShowEditModal(true);
  };

  const handleViewDetails = (tournament) => {
    setSelectedTournament(tournament);
    setShowViewModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const [matches, setMatches] = useState([]);
  // Other functions remain the same
  
  const generateMatches = () => {
    const matchesArray = [];
    // Generating matches for each round
    for (let i = 0; i < teams.length / 2; i++) {
      matchesArray.push({
        home: teams[i],
        away: teams[teams.length - 1 - i],
        scoreHome: 0, // Initialize scores for each match
        scoreAway: 0,
      });
    }
    setMatches(matchesArray);
  };

  const handleScoreChange = (index, side, value) => {
    const updatedMatches = [...matches];
    updatedMatches[index][`score${side}`] = parseInt(value);
    setMatches(updatedMatches);
  };
  
  const submitScores = () => {
    // Determine winners and generate matches for the next round
    const winners = [];
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].scoreHome > matches[i].scoreAway) {
        winners.push(matches[i].home);
      } else {
        winners.push(matches[i].away);
      }
    }
    // Generate matches for the next round with the winners
    const nextRoundMatches = [];
    for (let i = 0; i < winners.length / 2; i++) {
      nextRoundMatches.push({
        home: winners[i],
        away: winners[winners.length - 1 - i],
        scoreHome: 0,
        scoreAway: 0,
      });
    }
    setMatches(nextRoundMatches);
  };
  

  const players = [
    { name: 'Player 1', level: 'Intermediate', gender: 'Male', enrollment: 'Enrolled', time: '10:00 AM' },
    { name: 'Player 2', level: 'Beginner', gender: 'Female', enrollment: 'Not Enrolled', time: '-' },
    // Add more players as needed
  ];
  
  // Create a component to render each player's information
  const PlayerListItem = ({ player }) => (
    <div className="flex items-center justify-between border-b border-gray-300 py-2">
      <div>
        <div className="font-semibold">{player.name}</div>
        <div>Level: {player.level}</div>
        <div>Gender: {player.gender}</div>
      </div>
      <div>
        <div>{player.enrollment}</div>
        <div>Time: {player.time}</div>
      </div>
    </div>
  );

  // edit tournamets 
  const [activeSection, setActiveSection] = useState('general');

  // Function to handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  const handleDeletePlayer = (teamIndex, playerIndex) => {
    const updatedTeams = [...teamss];
    updatedTeams[teamIndex].playerss.splice(playerIndex, 1); // Remove the player from the array
    setTeamss(updatedTeams); // Update the state with the modified teams array
  };
// Render content based on active section
let content = null;
if (activeSection === 'general') {
  content = (
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
      <div>
      <label htmlFor="registrationDeadline" className="font-semibold">Registration Deadline</label>
<input
id="registrationDeadline"
className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
type="date"
placeholder="Enter Registration Deadline"
name="registrationDeadline"
value={tournamentDetails.registrationDeadline}
onChange={handleInputChange}
/>
</div>
<div>

<label htmlFor="gender" className="font-semibold">Gender</label>

<select
id="gender"
className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
type="text"
placeholder="Enter Gender"
name="gender"
value={tournamentDetails.gender}
onChange={handleInputChange}
>
<option value="Male">Male</option>
<option value="Female">Female</option>
</select>

</div>
<div>
<label htmlFor="visibility" className="font-semibold">Visibility</label>
<select
id="visibility"
className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
name="visibility"
value={tournamentDetails.visibility}
onChange={handleInputChange}
>
<option value="public">Public</option>
<option value="private">Private</option>
</select>
</div>
<div>
      
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
              </div>
      </div>
    </div>
    
  </div>
  );
} else if (activeSection === 'additional') {
  content = (
    <div className="border rounded-lg p-4 w-full mb-8">
    <h2 className="text-lg font-semibold mb-2">Round and Teams Setup Phase</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Display list of teams */}
      <div>
        <h3 className="font-semibold">List of Teams:</h3>
        {teamss.map((team, index) => (
          <div key={index} className="mb-4 border rounded-lg mb-8 p-4">
            
            <div className="flex  p-4 items-center justify-between ">
            <button onClick={() => handleDeleteTeam(index)} className="flex absolute top-40  m-3 text-gray-500 hover:text-gray-700 focus:outline-none" style={{ marginLeft: '43%' , top:'22.5%' }}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>            <div>
                <label htmlFor={`teamName-${index}`} className="block mb-1">Team {index + 1}:</label>
                <input
                  type="text"
                  id={`teamName-${index}`}
                  name="name"
                  value={team.name}
                  readOnly
                  className="border rounded-lg px-3 py-2 mb-2 w-full"
                />
                <h2 className="font-semibold">Players:</h2>
                <ul className="list-disc pl-6 p-2">
                  {team.playerss.map((player, playerIndex) => (
                    <li key={playerIndex}>{player}
                    <button onClick={() => handleDeletePlayer(index, playerIndex)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none t-4" >
                          <svg className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                    </li>
                    
                  ))}
                </ul>
              </div>
              <div className="flex items-center">
              
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor={`playerName-${index}`} className="block mb-1">Add Player:</label>
              <div className="flex items-center">
                <input
                  type="text"
                  id={`playerName-${index}`}
                  name="playerName"
                  value={newTeam.playerName || ''}
                  onChange={handleTeamInputChange}
                  className="border rounded-lg px-3 py-2 mb-2 mr-2 w-full"
                />
                <button onClick={() => handleAddPlayerToTeam(index)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Render the scheme */}
      <div>
        <DndProvider backend={HTML5Backend}>
          <Scheme teams={teamss} />
        </DndProvider>
      </div>
    </div>
    <div className="mt-4 bg-white">
      <input
        id="teamname"
        type="text"
        name="name"
        value={newTeam.name}
        onChange={handleTeamInputChange}
        placeholder="Enter team name"
        className="border rounded-lg px-3 py-2 mr-2 w-2/3 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button onClick={() => handleAddTeam()} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add Team</button>
  
     
    </div>
    {/* Generate Matches */}
    <div className="mt-4 bg-white">
      
     
  
    </div>
  </div>
  );
} else if (activeSection === 'players') {
  content = (
    <div className="border rounded-lg p-4 w-full mb-8">
      <h2 className="text-lg font-semibold mb-2">List of Players</h2>
      <div>
        {players.map((player, index) => (
          <PlayerListItem key={index} player={player} />
        ))}
      </div>
    </div> 
    
  );
} else if (activeSection === 'chat') {
  content = (
    <div className="border rounded-lg p-4 w-full mb-8">
      {/* Your form inputs for Chat */}<h1>chat</h1>
    </div>
  );
}


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
        <button onClick={addNewTournament} className="mb-3 px-4 py-2 bg-blue-500 text-white rounded-md ml-auto " >Add New Tournament</button>
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

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
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


                        <button className="p-3 ml-6" onClick={handleEdit} ><Eye/></button>
                       </tr>
                        ))}
                     </tbody>
                </table>
              </div>
            </div>
{showModal && (
 <div className="fixed inset-0 h-full flex bg-indigo-600 bg-white justify-end items-center overflow-scroll mb-10" style={{ height: '100%' }}>
<button onClick={handleClose} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg>
</button>
<div className="w-full h-full  h-auto bg-white rounded-lg p-6 flex flex-col justify-start items-start ">
  <div className='flex'>
    <h2 className="text-xl font-bold mb-6">Tournament Details</h2>
  </div>
  {/* Form inputs */}
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
    <div>
      <label htmlFor="registrationDeadline" className="font-semibold">Registration Deadline</label>
      <input
        id="registrationDeadline"
        className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
        type="date"
        placeholder="Enter Registration Deadline"
        name="registrationDeadline"
        value={tournamentDetails.registrationDeadline}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label htmlFor="gender" className="font-semibold">Gender</label>
      <select
        id="gender"
        className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
        type="text"
        placeholder="Enter Gender"
        name="gender"
        value={tournamentDetails.gender}
        onChange={handleInputChange}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
    <div>
      <label htmlFor="visibility" className="font-semibold">Visibility</label>
      <select
        id="visibility"
        className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
        name="visibility"
        value={tournamentDetails.visibility}
        onChange={handleInputChange}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </div>

    
      <div>
      
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
                 <button onClick={nextPhase} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Next</button>

          </div>
        </div>
        <div className="mt-4">
              </div>
      </div>
   
  </div>
  {phase === 1 && (
    <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-auto">Add New</button>  
  
          )}
</div>

  {phase === 3 && (
  <div className="border rounded-lg p-4 w-full mb-8">
  <h2 className="text-lg font-semibold mb-2">Round and Teams Setup Phase</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Display list of teams */}
    <div>
      <h3 className="font-semibold">List of Teams:</h3>
      {teamss.map((team, index) => (
        <div key={index} className="mb-4 border rounded-lg mb-8 p-4">
          
          <div className="flex  p-4 items-center justify-between ">
          <button onClick={() => handleDeleteTeam(index)} className="flex absolute top-40  m-3 text-gray-500 hover:text-gray-700 focus:outline-none" style={{ marginLeft: '43.5%' , top:'15.5%' }}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>            <div>
              <label htmlFor={`teamName-${index}`} className="block mb-1">Team {index + 1}:</label>
              <input
                type="text"
                id={`teamName-${index}`}
                name="name"
                value={team.name}
                readOnly
                className="border rounded-lg px-3 py-2 mb-2 w-full"
              />
              <h2 className="font-semibold">Players:</h2>
              <ul className="list-disc pl-6 p-2">
                {team.playerss.map((player, playerIndex) => (
                  <li key={playerIndex}>{player}
                  <button onClick={() => handleDeletePlayer(index, playerIndex)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none t-4" >
                        <svg className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                  </li>
                  
                ))}
              </ul>
            </div>
            <div className="flex items-center">
            
            </div>
          </div>
          <div className="mt-2">
            <label htmlFor={`playerName-${index}`} className="block mb-1">Add Player:</label>
            <div className="flex items-center">
              <input
                type="text"
                id={`playerName-${index}`}
                name="playerName"
                value={newTeam.playerName || ''}
                onChange={handleTeamInputChange}
                className="border rounded-lg px-3 py-2 mb-2 mr-2 w-full"
              />
              <button onClick={() => handleAddPlayerToTeam(index)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add</button>
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Render the scheme */}
    <div>
      <DndProvider backend={HTML5Backend}>
        <Scheme teams={teamss} />
      </DndProvider>
    </div>
  </div>
  <div className="mt-4">
    <input
      id="teamname"
      type="text"
      name="name"
      value={newTeam.name}
      onChange={handleTeamInputChange}
      placeholder="Enter team name"
      className="border rounded-lg px-3 py-2 mr-2 w-2/3 focus:outline-none focus:ring focus:border-blue-300"
    />
    <button onClick={() => handleAddTeam()} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add Team</button>

   
  </div>
  {/* Generate Matches */}
  <div className="mt-4">
    
    <button onClick={previousPhase} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">Previous</button>
   

  </div>
</div>
  )}





  {/* Add other phases similarly */}
  <div className='bg-white'>
  </div>
</div>

    </div>
  )}





{showEditModal && (
  <div className="fixed inset-0 h-full flex bg-indigo-600 bg-white justify-end items-center overflow-scroll mb-10" style={{ height: '100%' }}>
    <button onClick={handleCloseEditModal} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div className="w-full h-full  h-auto bg-white  p-6 flex flex-col justify-start items-start shadow-lg">
    <h2 className="text-xl font-bold">Tournament Details</h2>
      <div className='flex justify-between items-center w-full mb-6'>
        
        <div className="flex justify-center mb-6">
        <button onClick={() => handleSectionChange('general')} className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeSection === 'general' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}>General Information</button>
          <button onClick={() => handleSectionChange('additional')} className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeSection === 'additional' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}>Additional Information</button>
          <button onClick={() => handleSectionChange('players')} className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeSection === 'players' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}>Players</button>
          <button onClick={() => handleSectionChange('chat')} className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeSection === 'chat' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}>Chat</button>
      </div>

      </div>
      {content}
      {/* Form inputs */}
      
   
      {/* Add other phases similarly */}
      <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-auto">Add New</button>
    </div>
  </div>
)}

 

      {/* View Details Modal */}
     
</>
);
};

export default ManageTournamentsPage;
