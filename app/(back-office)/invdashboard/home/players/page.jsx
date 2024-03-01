// pages/index.js
'use client';
import { ArrowUpToLine, CoinsIcon, Eye, HandCoins, Pencil, PersonStandingIcon, Search, User2, UserCheck2, Users2, X } from "lucide-react";
import React ,{useState} from "react";

const coaches = [
  {
    id: 1,
    name: "John Doe",
    sport: "Football",
    profilePicture: "/john_doe.jpg",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    status: "present"
  },
  {
    id: 2,
    name: "Jane Smith",
    sport: "Basketball",
    profilePicture: "/jane_smith.jpg",
    email: "jane@example.com",
    phoneNumber: "+1987654321",
    status: "present"
  },
  {
    id: 3,
    name: "Alice Johnson",
    sport: "Tennis",
    profilePicture: "/alice_johnson.jpg",
    email: "alice@example.com",
    phoneNumber: "+1122334455",
    status: "on vacation"
  },
  {
    id: 4,
    name: "Bob Brown",
    sport: "Swimming",
    profilePicture: "/bob_brown.jpg",
    email: "bob@example.com",
    phoneNumber: "+1555666777",
    status: "present"
  },
  {
    id: 5,
    name: "Emma Wilson",
    sport: "Soccer",
    profilePicture: "/emma_wilson.jpg",
    email: "emma@example.com",
    phoneNumber: "+1443322111",
    status: "absent"
  },
  {
    id: 6,
    name: "Michael Lee",
    sport: "Soccer",
    profilePicture: "/michael_lee.jpg",
    email: "michael@example.com",
    phoneNumber: "+1789456123",
    status: "absent"
  },
  {
    id: 7,
    name: "Sarah Garcia",
    sport: "Volleyball",
    profilePicture: "/sarah_garcia.jpg",
    email: "sarah@example.com",
    phoneNumber: "+1654321890",
    status: "present"
  },
  {
    id: 8,
    name: "David Martinez",
    sport: "Soccer",
    profilePicture: "/david_martinez.jpg",
    email: "david@example.com",
    phoneNumber: "+1888777666",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },
  {
    id: 9,
    name: "Laura Rodriguez",
    sport: "Badminton",
    profilePicture: "/laura_rodriguez.jpg",
    email: "laura@example.com",
    phoneNumber: "+1999444555",
    status: "present"
  },

  {
    id: 10,
    name: "Chris Thomas",
    sport: "Rugby",
    profilePicture: "/chris_thomas.jpg",
    email: "chris@example.com",
    phoneNumber: "+1666999888",
    status: "present"
  }
];



const IndexPage = () => {
  const [filteredSport, setFilteredSport] = useState(null);

  const CoachItem = ({ coach }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showDetailsedit, setShowDetailsedit] = useState(false);
    
    
    const toggleDetails = () => {
      setShowDetails(!showDetails);
    };
    const toggleDetailsedit = () => {
      setShowDetailsedit(!showDetailsedit);
    };
    
  
    return (
      <div className={`flex bg-white p-1 mb-1 rounded-lg items-center border-b border-gray-400`}>
        <div className="w-1/4 pr-4">
          <img src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt={coach.name} className="w-12 h-12 rounded-full" />
        </div>
        <div className="w-3/4">{coach.name}</div>
        <div className="w-1/4 pl-6 font-semibold">{getSportEmoji(coach.sport)}</div>
        <div className="w-3/4">{coach.email}</div>
        <div className="w-1/4 pr-4 font-semibold">
          <div className={`rounded px-1 py-1 ${getStatusColorClass(coach.status)} flex justify-center items-center`} style={{ whiteSpace: 'nowrap' }}>
            {getStatusText(coach.status)}
          </div>
        </div>
        <div className="w-80"></div>
        <div className="w-20"></div>
        <div className="w-2/5">{coach.phoneNumber}</div>

        <button className="mr-4" onClick={toggleDetailsedit}><Pencil/></button>
        <button className=" p-3" onClick={toggleDetails}><Eye/></button>
        {showDetails && (
  <div className="pl-96 w-screen h-screen fixed inset-0 flex bg-indigo-600 bg-opacity-50 justify-center items-center rounded">
  <div className="w-full max-w-screen h-full max-h-screen bg-white border border-gray-400 rounded-lg">
  <div className="w-80 h-full max-h-screen bg-blue-900 border border-gray-400 rounded-lg text-white flex flex-col items-center  ">
      <div className='mt-20'>Player name: {coach.name}</div>
      <div>Sport: {coach.sport}</div>
      <div>ID: {coach.id}</div>
      <div>Joining Date: {coach.phoneNumber}</div>
      <div>Status: {getStatusText(coach.status)}</div>
      <div className="mb-10"></div>
      <div className="w-72 h-72 flex justify-center ">
          <img src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt={coach.name} className="w-48 h-48 rounded " />
        </div>
       
      <div className="fixed top-0 right-0 bg-white-200 p-4 text-black w-7/12 h-full overflow-auto">
          <div className="max-w-full">
            <h2 className="text-2xl font-bold mb-4">Player Details</h2>
            <div className="text-lg">
    <div className="flex flex-wrap mb-6">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Name:</strong>
            <input type="text" value={`${coach.name} ${coach.middleName} ${coach.lastName}`} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Sport:</strong>
            <input type="text" value={coach.sport} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/3">
            <strong className="block mb-1">Email:</strong>
            <input type="email" value={coach.email} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
    </div>
    <div className="flex flex-wrap mb-6">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Blood Type:</strong>
            <input type="text" value={coach.bloodType} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Date of Birth:</strong>
            <input type="text" value={coach.dateOfBirth} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        
    </div>
    <div className="flex flex-wrap mb-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <strong className="block mb-1">Phone Number:</strong>
            <input type="tel" value={coach.phoneNumber} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/2">
            <strong className="block mb-1">Classes:</strong>
            <ul className="ml-4">
                <li>Monday, 9:00 AM - 11:00 AM</li>
                <li>Wednesday, 3:00 PM - 5:00 PM</li>
                {/* Add more classes here as needed */}
            </ul>
        </div>
    </div>
    <div className="mb-6">
        <strong className="block mb-2">Upload Documents:</strong>
        <input type="file" multiple className="block mt-1" />
        <p className="text-sm text-gray-500 mt-1">You can upload documents related to the player here.</p>
    </div>
</div>

              </div>
            </div>
          </div>
      
     
      <div className='absolute top-1/2 left-1/ transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex justify-center items-center"'>
      <button  onClick={toggleDetails}><X/></button>

      </div>
      
    </div>
  </div>
)}



{showDetailsedit && (
  <div className="pl-96 w-screen h-screen fixed inset-0 flex bg-indigo-600 bg-opacity-50 justify-center items-center rounded">
    <div className="w-full max-w-screen h-full max-h-screen bg-white border border-gray-400 rounded-lg">
      <div className="w-80 h-full max-h-screen bg-blue-900 border border-gray-400 rounded-lg text-white flex flex-col items-center">
        <div className='mt-20'>Player name: {coach.name}</div>
        <div>Sport: {coach.sport}</div>
        <div>ID: {coach.id}</div>
        <div>Joining Date: {coach.phoneNumber}</div>
        <div>Status: {getStatusText(coach.status)}</div>
        <div className="mb-10"></div>
        <div className="w-72 h-72 flex justify-center">
          <img src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt={coach.name} className="w-48 h-48 rounded " />
        </div>

        <div className="fixed top-0 right-0 bg-white-200 p-4 text-black w-7/12 h-full overflow-auto">
          <div className="max-w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Player Details</h2>
            <div className="text-lg">
              <div className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Name:</strong>
                  <input type="text" value={coach.name} onChange={(e) => setCoachName(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Sport:</strong>
                  <input type="text" value={coach.sport} onChange={(e) => setCoachSport(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3">
                  <strong className="block mb-1">Email:</strong>
                  <input type="email" value={coach.email} onChange={(e) => setCoachEmail(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
              </div>
              <div className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Blood Type:</strong>
                  <input type="text" value={coach.bloodType} onChange={(e) => setBloodType(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Date of Birth:</strong>
                  <input type="text" value={coach.dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                
              </div>
              <div className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <strong className="block mb-1">Phone Number:</strong>
                  <input type="tel" value={coach.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/2">
                  <strong className="block mb-1">Classes:</strong>
                  <ul className="ml-4">
                    <li>Monday, 9:00 AM - 11:00 AM</li>
                    <li>Wednesday, 3:00 PM - 5:00 PM</li>
                    {/* Add more classes here as needed */}
                  </ul>
                </div>
              </div>
              <div className="mb-6">
                <strong className="block mb-2">Upload Documents:</strong>
                <input type="file" multiple className="block mt-1" />
                <p className="text-sm text-gray-500 mt-1">You can upload documents related to the coach here.</p>
              </div>
            </div>
          </div>
        </div>

        

      </div>
      <div className='absolute top-1/2 left-1/ transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex justify-center items-center"'>
          <button onClick={toggleDetailsedit}><X /></button>
        </div>
    </div>
  </div>
)}





      </div>
    );
  };
  
  function getStatusColorClass(status) {
    switch (status) {
      case "present":
        return "bg-green-200 text-green-800";
      case "absent":
        return "bg-red-200 text-red-800";
      case "on vacation":
        return "bg-gray-200 text-gray-800";
      default:
        return "";
    }
  }
  

  function getStatusText(status) {
    switch (status) {
      case "present":
        return <span style={{ color: 'green' }}>Present</span>;
      case "absent":
        return <span style={{ color: 'red' }}>Absent</span>;
      case "on vacation":
        return <span style={{ color: 'gray', }}>On Vacation</span>;
      default:
        return "";
    }
  }

  function getStatusText(status) {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "on vacation":
        return "On Vacation";
      default:
        return "";
    }
  }

  function getSportEmoji(sport) {
    switch (sport.toLowerCase()) {
      case "football":
    return "⚽️";
  case "basketball":
    return "🏀";
  case "tennis":
    return "🎾";
  case "baseball":
    return "⚾️";
  case "volleyball":
    return "🏐";
  case "golf":
    return "⛳️";
  case "rugby":
    return "🏉";
  case "cricket":
    return "🏏";
  case "hockey":
    return "🏒";
  case "table tennis":
    return "🏓";
  // Add more sports as needed
  default:
    return "";
  }
}

  const filteredCoaches = filteredSport ? coaches.filter(coach => coach.sport.toLowerCase() === filteredSport.toLowerCase()) : coaches;

  const [searchTerm, setSearchTerm] = useState("");

// Function to clear the search term
const clearSearch = () => {
  setSearchTerm("");
};

// Filtering the coaches based on the search term
const filteredCoaches2 = coaches.filter(coach =>
  coach.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const [makeCoash, setmakeCoash] = useState(false);
    const toggleDetailsmake = () => {
      setmakeCoash(!makeCoash);
    };
  return (
    <div className="container mx-auto px-3 bg-white  ">
       <div className="h-6"></div>
     <div className=" bg-white w-full flex justify-center items-center text-2xl border rounded-lg border-opacity-50 h-50 shadow-3xl" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
  let's check on Players
  <div className="h-20"></div>
</div>

<div className="flex mb-4 p-3 bg-white rounded-lg mt-5 shadow-3xl border border-opacity-50 shadow-3xl" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
  <h2 className="text-xl font-semibold mb-8">Status</h2>
  
  <div className="flex w-full items-center justify-between mt-10 rounded-lg p-3 ">
  {/* Medium-sized divs */}
  <div className="flex flex-col items-center mr-4 w-full h-full border border-slate-900 rounded-lg p-2 ">
    <Users2/> 
    <div className="font-semibold">Total Players</div>
    <div>{coaches.length}</div>
  </div>
  <div className="flex flex-col items-center mr-4 w-full h-full border border-slate-900 rounded-lg p-2 ">
    <HandCoins className="justify-start"/> 
    <div className="font-semibold justify-start">Revenue</div>
    <div>{coaches.length}</div> {/* Assuming revenue is defined somewhere */}
  </div>
  <div className="flex flex-col items-center mr-4 w-full h-full border border-slate-900 rounded-lg p-2">
    <UserCheck2/> 
    <div className="font-semibold">Attendance</div>
    <div>{coaches.length}</div> {/* Assuming attendance is defined somewhere */}
  </div>
  <div className="flex flex-col items-center w-full h-full border border-slate-900 rounded-lg p-2 ">
    <CoinsIcon/> 
    <div className="font-semibold ">Expense</div>
    <div>{coaches.length}</div> {/* Assuming expense is defined somewhere */}
  </div>
</div>

</div>




      {/* Filtering section */}
      <div className="p-3 bg-white rounded-lg border border-opacity-50 shadow-3xl" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
      <h2 className="text-xl font-semibold mb-8">Players</h2>
      <div className="flex items-center justify-between mb-4 bg-white rounded-lg mt-5 ">
        <div className="flex items-center">
          <label className="mr-2 font-semibold">Filter by Sport:</label>
          <select
            className="border border-gray-300 rounded p-2"
            onChange={e => setFilteredSport(e.target.value)}
            defaultValue=""
          >
            <option value="">All</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Tennis">Tennis</option>
            {/* Add options for other sports */}
          </select>
        </div>
        <div className="flex w-2/4 items-center mb-4 bg-white rounded-lg">
        <Search/>
          <input
            type="text"
            placeholder="Type Coach Name"
            className="border border-gray-300 rounded-l p-2 flex-1 h-8"
            onChange={e => setSearchTerm(e.target.value)}
            style={{ fontSize: "0.8rem" }} // Adjust font size if needed
         />
        </div>
        <button
          className="flex items-center bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
          onClick={toggleDetailsmake}
        >
          <span className="mr-2">+</span>
          <span>Add New</span>
        </button>
      </div>


      {makeCoash && (
  <div className="pl-96 w-screen h-screen fixed inset-0 flex bg-indigo-600 bg-opacity-50 justify-center items-center rounded">
    <div className="w-full max-w-screen h-full max-h-screen bg-white border border-gray-400 rounded-lg">
      <div className="w-80 h-full max-h-screen bg-blue-900 border border-gray-400 rounded-lg text-white flex flex-col items-center">
        <div className='mt-20'>Player name: </div>
        <div>Sport: </div>
        <div>ID: </div>
        <div>Joining Date: </div>
        <div>Status: </div>
        <div className="mb-10"></div>
        <div className="w-72 h-72 flex justify-center">
          <img className="w-48 h-48 rounded " />
        </div>

        <div className="fixed top-0 right-0 bg-white-200 p-4 text-black w-7/12 h-full overflow-auto">
          <div className="max-w-full">
            <h2 className="text-2xl font-bold mb-4">Add new Player</h2>
            <div className="text-lg">
              <div className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Name:</strong>
                  <input type="text"  onChange={(e) => setCoachName(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Sport:</strong>
                  <input type="text"  onChange={(e) => setCoachSport(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3">
                  <strong className="block mb-1">Email:</strong>
                  <input type="email"  onChange={(e) => setCoachEmail(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
              </div>
              <div className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Blood Type:</strong>
                  <input type="text"  onChange={(e) => setCoachBloodType(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Date of Birth:</strong>
                  <input type="text"  onChange={(e) => setCoachDateOfBirth(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3">
                  <strong className="block mb-1">Salary:</strong>
                  <input type="text"  onChange={(e) => setCoachSalary(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
              </div>
              <div className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <strong className="block mb-1">Phone Number:</strong>
                  <input type="tel" onChange={(e) => setCoachPhoneNumber(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/2">
                  <strong className="block mb-1">Classes:</strong>
                  <ul className="ml-4">
                    <li>Monday, 9:00 AM - 11:00 AM</li>
                    <li>Wednesday, 3:00 PM - 5:00 PM</li>
                    {/* Add more classes here as needed */}
                  </ul>
                </div>
              </div>
              <div className="mb-6">
                <strong className="block mb-2">Upload Documents:</strong>
                <input type="file" multiple className="block mt-1" />
                <p className="text-sm text-gray-500 mt-1">You can upload documents related to the coach here.</p>
              </div>
            </div>
          </div>
        </div>

        
      </div>
      <div className='absolute top-1/2 left-1/ transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex justify-center items-center"'>
          <button onClick={toggleDetailsmake}><X /></button>
        </div>

    </div>
  </div>
)}
      {/* Coach list */}
      <div className="flex mb-2 bg-gray-300 h-10 items-center rounded-lg">
        <div className="w-1/4 pr-4 font-semibold"></div>
        <div className="w-3/4 font-semibold">Player Name</div>
        <div className="w-1/4 pr-4 font-semibold">Sport</div>
        <div className="w-3/4 font-semibold">Email</div>
        <div className="w-2/4 pr-4 font-semibold">Status</div>
        <div className="w-2/5 font-semibold">Phone Number</div>
        <div className="w-1/5 font-semibold">Action</div>
      </div>
       {/* Coach list */}
       {/* Iterate over coaches and render each */}
{filteredCoaches.map((coach, index) => (
  <CoachItem key={coach.id} coach={coach} style={index === 0 ? { backgroundColor: '#f0f8ff' } : {}} />
))}
    </div>
    </div>
  );
};

export default IndexPage;
