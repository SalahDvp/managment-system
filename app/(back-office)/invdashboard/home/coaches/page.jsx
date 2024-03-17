// pages/index.js
'use client';
import { db } from '/app/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc, doc,
  
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowUpToLine, CoinsIcon, Eye, HandCoins, Pencil, PersonStandingIcon, Search, User2, UserCheck2, Users2, X } from "lucide-react";
import React ,{useState, useEffect} from "react";
import CoashScreen from '../CoashScreen/page';
import PhoneInput from 'react-phone-number-input';


const IndexPage = () => {
  const [coaches, setCoaches] = useState([]);
  const [filteredSport, setFilteredSport] = useState(null);
  

  // State to hold new coach data
  

  useEffect(() => {
    const fetchCoaches = async () => {
      const coachesCollectionRef = collection(db, 'Trainers');
      try {
        const querySnapshot = await getDocs(coachesCollectionRef);
        const coachesData = querySnapshot.docs.map(doc => doc.data());
        setCoaches(coachesData);
      } catch (error) {
        console.error('Error fetching coaches:', error);
      }
    };

    fetchCoaches();
  }, []);


  useEffect(() =>{
console.log('zakamo',coaches);
  },[])
  
  
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
          <img src={coach.image} alt={coach.id} className="w-12 h-12 rounded-full" />
        </div>
        <div className="w-3/4">{coach.nameandsurname}</div>
        <div className="w-1/4 pl-6 font-semibold">{getSportEmoji(coach.sport)}</div>
        <div className="w-3/4">{coach.contact}</div>
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
      <div className='mt-20'>Coash name: {coach.nameandsurname}</div>
      <div>Sport: {coach.sport}</div>
      <div>ID: {coach.uid}</div>
      <div>Joining Date: {coach.startDate && new Date(coach.startDate.seconds * 1000).toLocaleDateString()}</div>

      <div>Status: {getStatusText(coach.status)}</div>
      <div className="mb-10"></div>
      <div className="w-72 h-72 flex justify-center ">
          <img src={coach.image} alt={coach.nameandsurname} className="w-48 h-48 rounded " />
        </div>
       
      <div className="fixed top-0 right-0 bg-white-200 p-4 text-black w-7/12 h-full overflow-auto">
          <div className="max-w-full">
            <h2 className="text-2xl font-bold mb-4">Coach Details</h2>
            <div className="text-lg">
    <div className="flex flex-wrap mb-6">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Name:</strong>
            <input type="text" value={`${coach.nameandsurname} ${coach.nameandsurname} ${coach.nameandsurname}`} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Sport:</strong>
            <input type="text" value={coach.sport} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/3">
            <strong className="block mb-1">Email:</strong>
            <input type="email" value={coach.contact} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        
    </div>
    <div className="flex flex-wrap mb-6">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Blood Type:</strong>
            <input type="text" value={coach.BloodType} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Years of experience:</strong>
            <input type="text" value={coach.experience} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <strong className="block mb-1">Date of Birth:</strong>
            <input type="text" value={coach.birthDay && new Date(coach.startDate.seconds * 1000).toLocaleDateString()} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
        </div>
        <div className="w-full md:w-1/3">
            <strong className="block mb-1">Salary:</strong>
            <input type="text" value={coach.salary} readOnly className="block w-60 border-b border-gray-300 focus:outline-none  rounded" />
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
        <p className="text-sm text-gray-500 mt-1">You can upload documents related to the coach here.</p>
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
        <div className='mt-20'>Coach name: {coach.contact}</div>
        <div>Sport: {coach.sport}</div>
        <div>ID: {coach.uid}</div>
        <div>Joining Date: {coach.startDate && new Date(coach.startDate.seconds * 1000).toLocaleDateString()}</div>

        <div>Status: {getStatusText(coach.status)}</div>
        <div className="mb-10"></div>
        <div className="w-72 h-72 flex justify-center">
          <img src={coach.image} alt={coach.nameandsurname} className="w-48 h-48 rounded " />
        </div>

        <div className="fixed top-0 right-0 bg-white-200 p-4 text-black w-7/12 h-full overflow-auto">
          <div className="max-w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Coach Details</h2>
            <div className="text-lg">
              <div className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Name:</strong>
                  <input type="text" value={coach.nameandsurname} onChange={(e) => setCoachName(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Sport:</strong>
                  <input type="text" value={coach.sport} onChange={(e) => setCoachSport(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3">
                  <strong className="block mb-1">Email:</strong>
                  <input type="email" value={coach.contact} onChange={(e) => setCoachEmail(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
              </div>
              <div className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Blood Type:</strong>
                  <input type="text" value={coach.BloodType} onChange={(e) => setBloodType(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <strong className="block mb-1">Date of Birth:</strong>
                  <input type="text" value={coach.birthDay && new Date(coach.startDate.seconds * 1000).toLocaleDateString()} onChange={(e) => setDateOfBirth(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3">
                  <strong className="block mb-1">Experience:</strong>
                  <input type="text" value={coach.experience} onChange={(e) => setSalary(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/3 mt-2">
                  <strong className="block mb-1">Salary:</strong>
                  <input type="text" value={coach.salary} onChange={(e) => setSalary(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
                <div className="w-full md:w-1/2 mb-4 md:mb-0 mt-2">
                  <strong className="block mb-1">Phone Number:</strong>
                  <input type="tel" value={coach.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                </div>
              </div>
              <div className="flex flex-wrap mb-6">
                
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
  const sports = [
    "Football",
    "Basketball",
    "Tennis",
    "Baseball",
    "Volleyball",
    "Golf",
    "Rugby",
    "Cricket",
    "Hockey",
    "Table Tennis"
    // Add more sports as needed
  ];

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
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewCoachData({ ...newCoachData, [name]: value });
};

// Toggle this state to show/hide the coach details
const [coachName, setCoachName] = useState('');
const [coachSport, setCoachSport] = useState('');
const [coachEmail, setCoachEmail] = useState('');
const [coachPhoneNumber, setCoachPhoneNumber] = useState('');
const [coachBloodType, setCoachBloodType] = useState('');
const [coachDateOfBirth, setCoachDateOfBirth] = useState('');
const [coachSalary, setCoachSalary] = useState(0);
const [coachJoiningDate, setCoachJoiningDate] = useState(new Date().toISOString());
const [coachDescription, setCoachDescription] = useState('');
const [coachImage, setCoachImage] = useState('');
const [CoachExperience ,setCoachexperience] = useState('')

const handleAddCoach = async () => {
  // Construct the new coach object with input data
  try {
    if (profilePicture) {
      // Upload profile picture to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${profilePicture.name}`);
      await uploadBytes(storageRef, profilePicture);
      console.log("Profile picture uploaded successfully.");
      const downloadURL = await getDownloadURL(storageRef);

    }
    // Construct the new coach object with input data
    const newCoach = {
      
      nameandsurname: coachName,
      sport: coachSport,
      contact: coachEmail,
      phoneNumber: coachPhoneNumber,
      BloodType: coachBloodType,
      birthDay: coachDateOfBirth,
      salary: coachSalary,
      startDate: coachJoiningDate,
      description: coachDescription,
      image: profilePicture ? profilePicture.name : '',
      coachJoiningDate:coachJoiningDate,
      status: 'present',
      experience: CoachExperience+' Years'
      
      // Add other attributes as needed
    };

    // Add new coach data to Firestore
    const docRef = await addDoc(collection(db, 'Trainers'), newCoach)
    const uid = docRef.id;

    // Update the new coach object with the Firestore-generated UID
    await updateDoc(doc(db, 'Trainers', docRef.id), { uid: docRef.id });
    
    
    console.log('Coach added with auto-generated UID: ', uid);
    console.log('New coach data:', updatedCoach);
    console.log('Coach added with ID: ', docRef.id);
    
  }
  catch (error) {
      console.error('Error adding coach: ', error);
    }
};



  const filteredCoaches = filteredSport ? coaches.filter(coach => coach.sport.toLowerCase() === filteredSport.toLowerCase()) : coaches;

  const [searchTerm, setSearchTerm] = useState("");

// Function to clear the search term
const clearSearch = () => {
  setSearchTerm("");
};

// Filtering the coaches based on the search term
const filteredCoaches2 = coaches.filter(coach =>
  coach.nameandsurname.toLowerCase().includes(searchTerm.toLowerCase())
);

const [makeCoash, setmakeCoash] = useState(false);
    const toggleDetailsmake = () => {
      setmakeCoash(!makeCoash);
    };

const [selectedSport, setSelectedSport] = useState("");
const handleSportChange = (e) => {
  setSelectedSport(e.target.value);
};

const handleSalaryChange = (e) => {
  // Convert the input value to a number
  const salary = parseFloat(e.target.value);
  setCoachSalary(salary);
};

const [profilePicture, setProfilePicture] = useState(null);


const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setProfilePicture(file);
  }
};
  return (
    <div className="container mx-auto px-3 bg-white  ">
       <div className="h-6"></div>
     <div className=" bg-white w-full flex justify-center items-center text-2xl border rounded-lg border-opacity-50 h-50 shadow-3xl" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
  let's check on coaches
  <div className="h-20"></div>
</div>

<div className="flex mb-4 p-3 bg-white rounded-lg mt-5 shadow-3xl border border-opacity-50 shadow-3xl" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
  <h2 className="text-xl font-semibold mb-8">Status</h2>
  
  <div className="flex w-full items-center justify-between mt-10 rounded-lg p-3 ">
  {/* Medium-sized divs */}
  <div className="flex flex-col items-center mr-4 w-full h-full border border-slate-900 rounded-lg p-2 ">
    <Users2/> 
    <div className="font-semibold">Total Coaches</div>
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
      <h2 className="text-xl font-semibold mb-8">Coaches</h2>
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
              <div className='mt-20'>Coach name: {coachName}</div>
              <div>Sport: {coachSport}</div>
              {/* Add other coach details here */}
              <div className="mb-10"></div>
              <div className="w-72 h-72 flex justify-center">
                <img className="w-48 h-48 rounded " />
              </div>

              <div className="fixed top-0 right-0 bg-white-200 p-4 text-black w-7/12 h-full overflow-auto">
                <div className="max-w-full">
                  <h2 className="text-2xl font-bold mb-4">Add new Coach</h2>
                  <div className="text-lg">
                    <div className="flex flex-wrap mb-6">
                      <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        <strong className="block mb-1">Name:</strong>
                        <input type="text" onChange={(e) => setCoachName(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                      </div>
                      <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        <strong className="block mb-1">Sport:</strong>
                        <select onChange={(e) => setCoachSport(e.target.value)} value={selectedSport} className="block w-60 border-b border-gray-300 focus:outline-none rounded">
                          <option value="">Select</option>
                          {sports.map((sport, index) => (
                            <option key={index} value={sport}>{sport}</option>
                          ))}
                        </select>
                      </div>
                    <div className="w-full md:w-1/3">
                        <strong className="block mb-1">Email:</strong>
                        <input type="email" onChange={(e) => setCoachEmail(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                      </div>
                    </div>
                    {/* Add other input fields for coach attributes */}
                    {/* Similar input fields for other coach attributes */}
                    <div className="flex flex-wrap mb-6">
                      
                      
                      
                    </div>
                    <div className="flex flex-wrap mb-6">
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        <strong className="block mb-1">Salary:</strong>
                        <input 
                          type="number" // Use type="number" to ensure the input accepts only numbers
                          value={coachSalary} 
                          onChange={handleSalaryChange} 
                          className="block w-60 border-b border-gray-300 focus:outline-none rounded" 
                        />
                    </div>
                      <div className="w-full md:w-1/3 mb-4 md:mb-0">
                            <strong className="block mb-1">Blood Type:</strong>
                              <select onChange={(e) => setCoachBloodType(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded">
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                              </select>
                      </div>
                      <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        <strong className="block mb-1">Phone Number:</strong>
                        <input type="text" onChange={(e) =>  setCoachPhoneNumber(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                      </div>


                      <div className="w-full md:w-1/3 mb-4 md:mb-0 mt-4">
                          <strong className="block mb-1">Experience :</strong>
                            <select onChange={(e) => setCoachexperience(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded">
                              {[...Array(20).keys()].map(year => (
                                <option key={year + 1} value={year + 1}>{year + 1} year{year !== 0 ? 's' : ''}</option>
                              ))}
                            </select>
                      </div>

                      <div className="w-full md:w-1/3 mb-4 md:mb-0 mt-4">
                        <strong className="block mb-1">Day of birth:</strong>
                        <input type="text" onChange={(e) => setCoachDateOfBirth(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                      </div>
                      <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        <strong className="block mb-1">Description:</strong>
                        <textarea onChange={(e) => setCoachDescription(e.target.value)} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
                      </div>
                      {/* Add other input fields as needed */}
                    </div>
                  </div>
                </div>
              </div>
              {/* Button to submit coach data */}
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
    <strong className="block mb-1">Profile Picture:</strong>
    <input type="file" onChange={handleFileChange} className="block w-60 border-b border-gray-300 focus:outline-none rounded" />
    {/* Display preview of selected image if needed */}
</div>
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={handleAddCoach}
              >
                Add Coach
              </button>
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
        <div className="w-3/4 font-semibold">Coach Name</div>
        <div className="w-1/4 pr-4 font-semibold">Sport</div>
        <div className="w-3/4 font-semibold">Email</div>
        <div className="w-2/4 pr-4 font-semibold">Status</div>
        <div className="w-2/5 font-semibold">Phone Number</div>
        <div className="w-1/5 font-semibold">Action</div>
      </div>
       {/* Coach list */}
       {/* Iterate over coaches and render each */}
       {filteredCoaches2.map(coach => (
  <CoachItem key={coach.uid} coach={coach} /> // Pass coach data to CoachItem
))}
      
      
    </div>
    </div>
  );
};

export default IndexPage;
