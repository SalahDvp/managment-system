'use client'

import { v4 as uuidv4 } from 'uuid';
import React, { useState,useEffect, useRef } from 'react';
import { db } from '../firebase';
import { Timestamp, addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getFunctions, httpsCallable } from "firebase/functions";


export const formatCreatedAt = (timestamp) => {
  const date = new Date(timestamp.toDate()); // Convert Firestore timestamp to JavaScript Date object
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const day = days[date.getDay()];
  const hours = date.getHours().toString().padStart(2, '0'); // Ensure two-digit format
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two-digit format
  return `${day} ${hours}:${minutes}`;
};
const ChatScreen = ({classId,classData}) => {
 



const [participants,setParticipants]=useState(classData.participants)
const [messages, setMessages] = useState([]);
const[conversationId,setConversationId]=useState()
const [message, setMessage] = useState('');
const functions = getFunctions();
const sendNotificationToParticipants = httpsCallable(functions, 'sendNotificationToParticipants');
const [isLoading, setIsLoading] = useState(false);
console.log(classId);
//ref for collecting messages
//id for the docuemnt
const fetchMessagesAndCreateConversation = async (setIsLoading) => {
  try {
    setIsLoading(true); 
    const conversationRef = collection(db,'Competitions',classId,'Messages');
    // Query conversation where Members array contains the traineeId 
    
    const messagesQuery = query(conversationRef, orderBy('CreatedAt', 'asc'));

    // Listen for real-time updates to the 'Messages' subcollection
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {

      const messages = querySnapshot.docs.map(messageDoc => ({ id: messageDoc.id, ...messageDoc.data() }));

     
      setMessages(messages);
      setIsLoading(false);
    });

    // Check if the conversation exists, if not, create it

    setIsLoading(false);
    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  } catch (error) {
    setIsLoading(false);
    console.error('Error fetching messages:', error);
  }
};


useEffect(() => {
  
  const unsubscribe = fetchMessagesAndCreateConversation(setIsLoading);

  // Clean up the listener when the component unmounts
  return () => {
    if (unsubscribe && typeof unsubscribe === 'function') {
      unsubscribe(); // Ensure unsubscribe is a function before calling it
    }
  };
}, []);

const sendMessage = async () => {
  const msg = message.trim();
  
  if (msg.length === 0) return false; // Return false if message is empty

  const newMessage = {
    CreatedAt: Timestamp.fromDate(new Date()),
    SentBy: 'TeamSupport',
    text: msg,
   
    SentByName: 'TeamSupport'
  };

  const data = {
    participants: participants,
    title:newMessage.SentByName,
    body:newMessage.text,
    data:{notificationType:"newMessage",url:"/Chat/[Chat]" ,documentId: `Competitions/${classId}`,   id:`Competitions/${classId}`,
    ref:`Competitions/${classId}/Messages`,
    date: new Date()},
    name:'TeamSupport',
 

  };
  try {
   
    setMessage('');

    // Attempt to create the conversation document and add the message in one operation
    const messagesRef = collection(db, `Competitions/${classId}/Messages`);
    const conversationRef=doc(db,"Competitions",classId);

    const messageRef = await addDoc(messagesRef, newMessage);
    await setDoc(conversationRef, { LastMessage: { By: 'TeamSupport', SentAt: newMessage.CreatedAt }, }, { merge: true });
    sendNotificationToParticipants(data)
    .then((result) => {
      console.log('Notifications sent successfully:', result.data);
    })
    .catch((error) => {
      console.error('Error sending notifications:', error);
    });
    console.log('Message document created with ID:', messageRef.id);
    return true; // Return true if message added successfully
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    return false; // Return false in case of error
  }
};
const scrollRef = useRef(null);

// Scroll to bottom on initial render and when messages change
useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }
}, [messages]);
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevents adding new line
    sendMessage();
  }
}
  return (



<div className="bg-white w-full">
  <div className=" p-4 bg-gray-100">

    <div className="p-4 w-full flex" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto',flexDirection:'column'}} ref={scrollRef}>
      {messages.map((message, index) => (
        <div key={index} className="mb-4 flex" style={{ padding: '10px', borderRadius: '10px', maxWidth: '100%',alignSelf:message.SentBy ==='TeamSupport' ?  'flex-end':'flex-start'}}>
          <div style={{ display: 'flex', flexDirection: 'column', }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{message.SentByName}</div>
            <div style={{ backgroundColor:  message.SentBy ==='TeamSupport' ? '#dcf8c6' : '#fff', padding: '10px', borderRadius: '10px', marginTop: '5px' }}>
              {message.text}
            </div>
            <div style={{ color: '#777', fontSize: '12px', marginTop: '5px', alignSelf: 'flex-end' }}>
              {message.CreatedAt && message.CreatedAt.nanoseconds ? formatCreatedAt(message.CreatedAt) : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 flex">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-full p-2 border border-gray-300 rounded"
        rows="3"
      />
      <button onClick={sendMessage} className="ml-2 px-4 py-2 button-white">Send</button>
    </div>
  </div>
</div>


  );
};
const generateRandomUid = (length) => {
    const uid = uuidv4().replace(/-/g, ''); // Remove hyphens
    return uid.slice(0, length); // Get the first 'length' characters
  };
const NewItem=({setI,i,setShowModal,courts})=>{
    const [isSubmitting,setIsSubmitting]=useState(false)
    const [tournamentDetails, setTournamentDetails] = useState({
      name: '',
      sport: '',
      location: '',
      startDate: '',
      endDate: '',
      organizer: '',
      numRounds: 0,
      numTeams: 0,
      prizes:['']
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTournamentDetails(prevDetails => ({
          ...prevDetails,
          [name]: value
        }));
      };
    const handleAddTime = () => {
    
        setTournamentDetails({
          ...tournamentDetails,
          prizes: [
            ...tournamentDetails.prizes,
            ''
          ]
        });
   
    };
    const handleRemoveTime = (index) => {
      if (tournamentDetails.prizes.length >1) {
      const updatedTimes = tournamentDetails.prizes.filter((time, idx) => idx !== index);
    
      setTournamentDetails({
        ...tournamentDetails,
        prizes: updatedTimes,
      });
    } else {
      alert('You must leave one prize.');
    }
    };

    
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (Object.values(tournamentDetails).some(value => value === undefined)) {
        alert('Please fill in all required fields.');
        return;
      }
    console.log( {
        date:Timestamp.fromDate(new Date(tournamentDetails.startDate)),
        details:{description:tournamentDetails.description,
                    gender:tournamentDetails.gender,
                    lastRegistrationDate:Timestamp.fromDate(new Date(tournamentDetails.registrationDeadline)),
                level:tournamentDetails.level,
                price:tournamentDetails.price,
            prizes:tournamentDetails.prizes,
        type:tournamentDetails.type,},
        end:Timestamp.fromDate(new Date(tournamentDetails.endDate)),
        image:"https://img.freepik.com/free-vector/abstract-basketball-watercolor-style-background_1017-39243.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1706054400&semt=sph",
        name:tournamentDetails.name,
        participants:[],
        participantsuid:[],
        requirement:tournamentDetails.restrictions,
        sport:tournamentDetails.sport,
        totalParticipants:tournamentDetails.maximumNumber,
        type:tournamentDetails.type
    
    });
      try {

     await addDoc(collection(db, 'Competitions'), {
      date:Timestamp.fromDate(new Date(tournamentDetails.startDate)),
      details:{description:tournamentDetails.description,
                  gender:tournamentDetails.gender,
                  lastRegistrationDate:Timestamp.fromDate(new Date(tournamentDetails.registrationDeadline)),
              level:tournamentDetails.level,
              price:tournamentDetails.price,
          prizes:tournamentDetails.prizes,
      type:tournamentDetails.type,},
      end:Timestamp.fromDate(new Date(tournamentDetails.endDate)),
      image:"https://img.freepik.com/free-vector/abstract-basketball-watercolor-style-background_1017-39243.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1706054400&semt=sph",
      name:tournamentDetails.name,
      participants:[],
      participantsuid:[],
      requirement:tournamentDetails.restrictions,
      sport:tournamentDetails.sport,
      totalParticipants:tournamentDetails.maximumNumber,
      type:tournamentDetails.type
  
  });
  
  
    

        alert('Tournament Created Successfully');
        setI(!i);

      } catch (error) {
        console.error('Error adding document:', error);
        alert('An error occurred. Please try again.');
      }
    };
    return(
        <div className={`flex bg-white p-1 mb-1 rounded-lg items-center border-b h-full  border-gray-400`}>
        <div className="fixed inset-0 flex bg-gray-600 bg-opacity-50 justify-end items-center h-full " style={{ height: 'calc(100% )' }}>
      <button onClick={()=>setShowModal(false)} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      </button>
      
        {/* Form inputs */}
        
      
        <div className="w-3/6  h-full bg-white border rounded-t  border rounded-lg p-4 pt-5  overflow-auto">
        <h2 className="text-xl font-bold ml-4 mt-4 mb-6">New Tournament</h2>
       <div className='ml-72'/>
        <div className=" grid grid-cols-2 gap-2">
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
            <label htmlFor="price" className="font-semibold">price</label>
            <input
              id="price"
              className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              placeholder="Entry Price"
              name="price"
              value={tournamentDetails.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="type" className="font-semibold">Tournament Type</label>
            <input
              id="type"
              className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              placeholder="type"
              name="type"
              value={tournamentDetails.type}
              onChange={handleInputChange}
            />
          </div>
          <div>
          <label htmlFor="level" className="font-semibold">Level</label>
                <select
                id='level'
                name='level'
      className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
        value={tournamentDetails.level}
        onChange={handleInputChange}
      >
       
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
              </div>
              <div>
            <label htmlFor="location" className="font-semibold">Court</label>
            <select
                      className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
                        name="location"
                        placeholder="Enter Court"             value={tournamentDetails.location}
             
                        id="location"
                        onChange={handleInputChange}
                      >
                        <option value=''>choose a court</option>
                        {courts.map((court,index) => (
                          <option key={index} value={court} >
                            {court}
                          </option>
                        ))}
                      </select>
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
                <strong>Max. Players</strong> <br />
                <input   id='maximumNumber'  className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300" type="number" name='maximumNumber' onChange={handleInputChange}  value={tournamentDetails.maximumNumber} />
              </div>
          </div>
          <h3 className="text-lg font-bold ml-4 mb-2 mt-4">Description</h3>
          <div className="p-6 mt-4 border rounded-lg  mb-8 w-full" >
      
                <input
                id='description'
                className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
                type="text"
                name="description"
                multiple
                placeholder='description'
                value={tournamentDetails.description}
                onChange={handleInputChange} // Convert string back to array on change
              />
                
                
              </div>
              <h3 className="text-lg font-bold ml-4 mb-2">Prizes</h3>
              <div className="p-6 mt-4 border rounded-lg  mb-8 w-full relative" >
         
              <button className="absolute top-2 right-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddTime}>Add Prize</button>
          <div className="grid grid-cols-3 gap-4">
      {    tournamentDetails.prizes.map((prize, index) => (
          <div key={index} className='flex flex-col justify-start '>
            <strong>{index + 1} Place Prize</strong> <br />
       
        <input
       className="rounded-lg w-24" 
       type="text"
          name='startTime'
          value={prize}
          onChange={(e) => {
              const updatedPrizes = [...tournamentDetails.prizes]; // Copy the prizes array
              updatedPrizes[index] = e.target.value; // Update the value at the specified index
              setTournamentDetails((prevDetails) => ({
                ...prevDetails,
                prizes: updatedPrizes, // Update prizes with the modified array
              }));
            }}
            
      
        />
      
      
      
          <button onClick={() => handleRemoveTime(index)} className='self-start'>Remove</button>
          </div>
        ))}
                
              </div>
              </div>
              <h3 className="text-lg font-bold ml-4 mb-2 mt-4">Restrictions</h3>
          <div className="p-6 mt-4 border rounded-lg  mb-8 w-full" >
      
                <input
                id='restrictions'
                className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
                type="text"
                name="restrictions"
                multiple
                placeholder='restrictions'
                value={tournamentDetails.restrictions}
                onChange={handleInputChange} // Convert string back to array on change
              />
                
                
              </div>
                  
      <button
                className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Submit
              </button>
      </div>
      
      </div>
      </div>
    )

}
function getStatusColorClass(status) {
    switch (status) {
      case "paid":
        return "bg-green-200 text-green-800";
      case "not paid":
        return "bg-red-200 text-red-800";
    
      default:
        return "bg-gray-200 text-gray-800";
    }
  }

const TournamentPlayersTable = ({ playersData,handleAddPlayer,setTournamentDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const [showAddRow, setShowAddRow] = useState(false);
    const [newPlayerDetails, setNewPlayerDetails] = useState({
      name: '',
      level: '',
      gender: '',
      payment: '',
      status: '',
      enrollmentTime: '',
      uid:generateRandomUid(20)
    });

  
    const handleAddRow = () => {
      setShowAddRow(true);
    };
  
    const handleCancelAddRow = () => {
      setShowAddRow(false);
      setNewPlayerDetails({
        name: '',
        level: '',
        gender: '',
        payment: '',
        status: '',
        enrollmentTime: '',
        uid:generateRandomUid(20)
      });
    };
  
    const handleSavePlayer = () => {
      handleAddPlayer(newPlayerDetails);
      setShowAddRow(false);
      setNewPlayerDetails({
        name: '',
        level: '',
        gender: '',
        payment: '',
        status: '',
        enrollmentTime: '',
        uid:generateRandomUid(20)
      });
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewPlayerDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };
  
    return (
        <div className="border rounded-lg p-4 w-full mb-8 relative">
        <h2 className="text-lg font-semibold mb-2">List of Players</h2>
 
        <table className="w-full min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr >
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>

          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Time</th>
         
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
                      
                 
          {playersData.map((player,index) => (
            <tr key={player.id} >
         <td className="px-6 py-4 whitespace-nowrap">{player.name}</td>
         <td className="px-6 py-4 whitespace-nowrap">{player.level}</td>
         <td className="px-6 py-4 whitespace-nowrap">{player.gender}</td>
         <td className="px-3 py-4 whitespace-nowrap">
  <select
    name="payment"
    value={player.payment}
    onChange={(e) => {
        const { name, value } = e.target;
        setTournamentDetails((prev) => ({
          ...prev,
          participants: prev.participants.map((participant, idx) =>
            idx === index ? { ...participant, [name]: value } : participant
          ),
        }));
      }}
    
    className={`rounded-lg w-full px-3 py-2 border-none focus:outline-none ${getStatusColorClass(player.payment)}`}
  >
    <option value="">Select Status</option>
    <option value="paid">Paid</option>
    <option value="not paid">Not Paid</option>
    <option value="unknown">Unknown</option>

  </select>
</td>

  
  {player.date   && (<td className="px-6 py-4 whitespace-nowrap">{player.date.toDate ? player.date.toDate().toLocaleDateString(): player.date.toLocaleDateString()}</td>)    }
       
            </tr>
          ))}
       
        </tbody>
         {/* Add Player row */}
         {showAddRow && (
     <tr >
    <td className="px-3 py-4 whitespace-nowrap">
    <input
  type="text"
  name="name"
  value={newPlayerDetails.name}
  onChange={handleChange}
  placeholder="Enter Name"
  className="rounded-lg w-full py-2 border-none "
/>
            </td>
                <td className="px-3 py-4 whitespace-nowrap"><input
                type="text"
                name="level"
                value={newPlayerDetails.level}
                onChange={handleChange}
                placeholder="Enter level"
                className="rounded-lg w-full px-3 py-2 border-none "
              /></td>
      <td className="px-3 py-4 whitespace-nowrap">
  <select
    name="gender"
    value={newPlayerDetails.gender}
    onChange={handleChange}
    className="rounded-lg w-full px-3 py-2 border-none focus:outline-none"
  >
    <option value="">Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>
</td>
<td className="px-3 py-4 whitespace-nowrap">
  <select
    name="payment"
    value={newPlayerDetails.payment}
    onChange={handleChange}
    
    className={`rounded-lg w-full px-3 py-2 border-none focus:outline-none ${getStatusColorClass(newPlayerDetails.payment)}`}
  >
    <option value="">Select Status</option>
    <option value="paid">Paid</option>
    <option value="not paid">Not Paid</option>
    <option value="unknown">Unknown</option>

  </select>
</td>

        <div className="px-3 py-4 whitespace-nowrap">
        <DatePicker
        id="date"
        selected={newPlayerDetails.date}
        onChange={(date) => setNewPlayerDetails((prev) => ({ ...prev, date: date }))} // Update the 'date' field in newPlayerDetails

        dateFormat="yyyy-MM-dd" // Specify the date format
        className="rounded-lg w-full px-3 py-2 border-none"
        placeholderText="Enrollment Date"
      />
        </div>

          </tr>
        )}
      </table>
                    
            
                      {!showAddRow ? (
                        <button
                          onClick={handleAddRow}
                          className="button-white  mt-5"
                        >
                          Add Player
                        </button>
                      ):(
                        <>
                         <button
                onClick={handleSavePlayer}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancelAddRow}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button></>
                      )}
      </div> 
    );
  };

const EditItem=({setI,i,setShowModal,courts,selectedTournament})=>{
    const [isSubmitting,setIsSubmitting]=useState(false)
  // edit tournamets 
  const [activeSection, setActiveSection] = useState('general');

  // Function to handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
    const [tournamentDetails, setTournamentDetails] = useState( {
        startDate:new Date(selectedTournament.date.toDate()).toISOString().split('T')[0],
         description:selectedTournament.details.description,
                    gender:selectedTournament.details.gender,
                        registrationDeadline:new Date(selectedTournament.details.lastRegistrationDate.toDate()).toISOString().split('T')[0],
                    level:selectedTournament.details.level,
                    price:selectedTournament.details.price,
                prizes:selectedTournament.details.prizes,
            type:selectedTournament.type,
            endDate:new Date(selectedTournament.end.toDate()).toISOString().split('T')[0],
            image:"https://img.freepik.com/free-vector/abstract-basketball-watercolor-style-background_1017-39243.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1706054400&semt=sph",
            name:selectedTournament.name,
            participants:selectedTournament.participants,
            participantsuid:selectedTournament.participantsuid,
            restrictions:selectedTournament.requirements,
            sport:selectedTournament.sport,
            maximumNumber:selectedTournament.totalParticipants,
            ...selectedTournament
    
        
        });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTournamentDetails(prevDetails => ({
          ...prevDetails,
          [name]: value
        }));
      };
    const handleAddTime = () => {
    
        setTournamentDetails({
          ...tournamentDetails,
          prizes: [
            ...tournamentDetails.prizes,
            ''
          ]
        });
   
    };
    const handleRemoveTime = (index) => {
      if (tournamentDetails.prizes.length >1) {
      const updatedTimes = tournamentDetails.prizes.filter((time, idx) => idx !== index);
    
      setTournamentDetails({
        ...tournamentDetails,
        prizes: updatedTimes,
      });
    } else {
      alert('You must leave one prize.');
    }
    };

    
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (Object.values(tournamentDetails).some(value => value === undefined)) {
        alert('Please fill in all required fields.');
        return;
      }
    console.log( {
        date:Timestamp.fromDate(new Date(tournamentDetails.startDate)),
        details:{description:tournamentDetails.description,
                    gender:tournamentDetails.gender,
                    lastRegistrationDate:Timestamp.fromDate(new Date(tournamentDetails.registrationDeadline)),
                level:tournamentDetails.level,
                price:tournamentDetails.price,
            prizes:tournamentDetails.prizes,
        type:tournamentDetails.type,},
        end:Timestamp.fromDate(new Date(tournamentDetails.endDate)),
        image:"https://img.freepik.com/free-vector/abstract-basketball-watercolor-style-background_1017-39243.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1706054400&semt=sph",
        name:tournamentDetails.name,
        participants:[],
        participantsuid:[],
        requirement:tournamentDetails.restrictions,
        sport:tournamentDetails.sport,
        totalParticipants:tournamentDetails.maximumNumber,
        type:tournamentDetails.type
    
    });
      try {

     await addDoc(collection(db, 'Competitions'), {
      date:Timestamp.fromDate(new Date(tournamentDetails.startDate)),
      details:{description:tournamentDetails.description,
                  gender:tournamentDetails.gender,
                  lastRegistrationDate:Timestamp.fromDate(new Date(tournamentDetails.registrationDeadline)),
              level:tournamentDetails.level,
              price:tournamentDetails.price,
          prizes:tournamentDetails.prizes,
      type:tournamentDetails.type,},
      end:Timestamp.fromDate(new Date(tournamentDetails.endDate)),
      image:"https://img.freepik.com/free-vector/abstract-basketball-watercolor-style-background_1017-39243.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1706054400&semt=sph",
      name:tournamentDetails.name,
      participants:[],
      participantsuid:[],
      requirement:tournamentDetails.restrictions,
      sport:tournamentDetails.sport,
      totalParticipants:tournamentDetails.maximumNumber,
      type:tournamentDetails.type
  
  });
  
  
    

        alert('Tournament Created Successfully');
        setI(!i);

      } catch (error) {
        console.error('Error adding document:', error);
        alert('An error occurred. Please try again.');
      }
    };

  
    const handleAddPlayer = (player) => {

        setTournamentDetails((prev) => ({
            ...prev,
            participants: [...prev.participants, player],
            participantsuid: [...prev.participantsuid, player.uid],
          }));
      
    };
    const onConfirm=async ()=>{
        await updateDoc(doc(db,'Competitions',tournamentDetails.id),{
            participants:tournamentDetails.participants,
            participantsuid:tournamentDetails.participantsuid,
        })
        alert("List Updated!")
        setI(!i)
    }
    return(

        <div className={`flex bg-white p-1 mb-1 rounded-lg items-center border-b h-full  border-gray-400`}>
        <div className="fixed inset-0 flex bg-gray-600 bg-opacity-50 justify-end items-center h-full " style={{ height: 'calc(100% )' }}>
      <button onClick={()=>setShowModal(false)} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      </button>
      
        {/* Form inputs */}
        
      
        <div className="w-3/6  h-full bg-white border rounded-t  border rounded-lg p-4 pt-5  overflow-auto">
        <h2 className="text-xl font-semibold text-gray-600 ml-4 mt-4 mb-6">Edit Tournament</h2>
       <div className='ml-72'/>
       <div className='flex justify-between items-center w-full mb-6'>
        
        <div className="flex justify-center mb-6">
        <button onClick={() => handleSectionChange('general')} className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeSection === 'general' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}>General Information</button>
          <button onClick={() => handleSectionChange('additional')} className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeSection === 'additional' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}>Matches & Rounds</button>
          <button onClick={() => handleSectionChange('players')} className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeSection === 'players' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}>Players</button>
          <button onClick={() => handleSectionChange('chat')} className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeSection === 'chat' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}>Chat</button>
      </div>

      </div>
{activeSection === 'general' &&(
            <>
            <div className=" grid grid-cols-2 gap-2">
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
              <label htmlFor="price" className="font-semibold">price</label>
              <input
                id="price"
                className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
                type="text"
                placeholder="Entry Price"
                name="price"
                value={tournamentDetails.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="type" className="font-semibold">Tournament Type</label>
              <input
                id="type"
                className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
                type="text"
                placeholder="type"
                name="type"
                value={tournamentDetails.type}
                onChange={handleInputChange}
              />
            </div>
            <div>
            <label htmlFor="level" className="font-semibold">Level</label>
                  <select
                  id='level'
                  name='level'
        className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
          value={tournamentDetails.level}
          onChange={handleInputChange}
        >
         
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
                </div>
                <div>
              <label htmlFor="location" className="font-semibold">Court</label>
              <select
                        className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
                          name="location"
                          placeholder="Enter Court"             value={tournamentDetails.location}
               
                          id="location"
                          onChange={handleInputChange}
                        >
                          <option value=''>choose a court</option>
                          {courts.map((court,index) => (
                            <option key={index} value={court} >
                              {court}
                            </option>
                          ))}
                        </select>
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
                  <strong>Max. Players</strong> <br />
                  <input   id='maximumNumber'  className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300" type="number" name='maximumNumber' onChange={handleInputChange}  value={tournamentDetails.maximumNumber} />
                </div>
            </div>
            <h3 className="text-lg font-bold ml-4 mb-2 mt-4">Description</h3>
            <div className="p-6 mt-4 border rounded-lg  mb-8 w-full" >
        
                  <input
                  id='description'
                  className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
                  type="text"
                  name="description"
                  multiple
                  placeholder='description'
                  value={tournamentDetails.description}
                  onChange={handleInputChange} // Convert string back to array on change
                />
                  
                  
                </div>
                <h3 className="text-lg font-bold ml-4 mb-2">Prizes</h3>
                <div className="p-6 mt-4 border rounded-lg  mb-8 w-full relative" >
           
                <button className="absolute top-2 right-2  button-white " onClick={handleAddTime}>Add Prize</button>
            <div className="grid grid-cols-3 gap-4">
        {    tournamentDetails.prizes.map((prize, index) => (
            <div key={index} className='flex flex-col justify-start '>
              <strong>{index + 1} Place Prize</strong> <br />
         
          <input
         className="rounded-lg w-24" 
         type="text"
            name='startTime'
            value={prize}
            onChange={(e) => {
                const updatedPrizes = [...tournamentDetails.prizes]; // Copy the prizes array
                updatedPrizes[index] = e.target.value; // Update the value at the specified index
                setTournamentDetails((prevDetails) => ({
                  ...prevDetails,
                  prizes: updatedPrizes, // Update prizes with the modified array
                }));
              }}
              
        
          />
        
        
        
            <button onClick={() => handleRemoveTime(index)} className='self-start'>Remove</button>
            </div>
          ))}
                  
                </div>
                </div>
                <h3 className="text-lg font-bold ml-4 mb-2 mt-4">Restrictions</h3>
            <div className="p-6 mt-4 border rounded-lg  mb-8 w-full" >
        
                  <input
                  id='restrictions'
                  className="rounded-lg w-full py-2 px-3 border focus:outline-none focus:ring focus:border-blue-300"
                  type="text"
                  name="restrictions"
                  multiple
                  placeholder='restrictions'
                  value={tournamentDetails.restrictions}
                  onChange={handleInputChange} // Convert string back to array on change
                />
                  
                  
                </div>
                <button
  className="ml-4 button-white mb-10"
  onClick={handleSubmit}
  disabled={isSubmitting}
>
  Submit
</button>
            </>
)}
       
   
{activeSection === 'additional' &&(

    <div className="border rounded-lg p-4 w-full mb-8">
      <h2 className="text-lg font-semibold mb-2">List of Players</h2>

      <div>
        {/* {tournamentDetails.participants.map((player, index) => (
          <PlayerListItem key={index} player={player} />
        ))} */}
      </div>
    </div> 
    
  )}
  {activeSection === 'players' &&(



<>
    <TournamentPlayersTable playersData={tournamentDetails.participants} handleAddPlayer={handleAddPlayer} setTournamentDetails={setTournamentDetails}/>
    <button
    onClick={()=>onConfirm()}
        disabled={tournamentDetails.participants===selectedTournament.participants}
                          className="button-blue mt-5"
                        >
                          Confirm
                        </button>
    </>
)}
{activeSection === 'chat' && (

   <ChatScreen classData={tournamentDetails} classId={tournamentDetails.id}/>
  )
}
       
                  

      </div>
      
      </div>
      </div>
    )

}
const ManageTournamentsPage = () => {
    const courts=['Court1','Court2','Court3','Court4','Court5','Court6','Court7','Court8','Court9','Court10','Court11','Court12','Court13']

  const [searchName, setSearchName] = useState('');
  const [showModal, setShowModal] = useState(false);
const [Original,setOriginal]=useState([])


  const [tournaments,setTournaments]=useState([])
  const [i,setI]=useState(false)
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);



  useEffect(()=>{
    const getTournaments=async ()=>{
        const tournaments=await getDocs(collection(db,'Competitions') )
        const tournamentsData=tournaments.docs.map((doc)=>({
            id:doc.id,
            ...doc.data()
        }))
        setTournaments(tournamentsData)
        setOriginal(tournamentsData)
    }
    getTournaments()
  },[i])
  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
    filterTournaments(event.target.value);
  };

  const filterTournaments = (searchString) => {
    const searchMatches=Original
    if (searchString.trim() === '') {
        // If empty, set matches to the original list
        setTournaments(searchMatches);
      } else {
    const filteredTournaments =tournaments.filter(tournament =>
      tournament.name.toLowerCase().includes(searchString.toLowerCase())
    );
    setTournaments(filteredTournaments);
      }
  };

  const addNewTournament = () => {
    setShowModal(true);
  };

  const handleEdit = (tournament) => {
    setSelectedTournament(tournament);
    setShowEditModal(true);
  };
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
                         #
                        </th>
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
                          Price
                        </th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tournaments.map(tournament => (
                        <tr key={tournament.id}>
                                 <td className="px-6 py-4 whitespace-nowrap">{tournament.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{tournament.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{tournament.sport}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{tournament.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{tournament.date &&(tournament.date.toDate().toLocaleDateString())}</td>

                       <td className="px-6 py-4 whitespace-nowrap">{tournament.date &&(tournament.end.toDate().toLocaleDateString())}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{ tournament.details.price}</td>


                        <button className="p-3 ml-6" onClick={()=>handleEdit(tournament)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
                       </tr>
                        ))}
                     </tbody>
                </table>
              </div>
            </div>
{showModal && (
 <NewItem setI={setI} i={i} setShowModal={setShowModal} courts={courts}/>
  )}


{showEditModal &&(<EditItem setI={setI} i={i} setShowModal={setShowEditModal} courts={courts} selectedTournament={selectedTournament}/>)}
   
</>
);
};

export default ManageTournamentsPage;

{/* 
  {phase === 3 && (
  <div className="border rounded-lg p-4 w-full mb-8">
  <h2 className="text-lg font-semibold mb-2">Round and Teams Setup Phase</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

   

  <div className="mt-4">
    
    <button onClick={previousPhase} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">Previous</button>
   

  </div>
</div>
  )} */}

//   {phase === 1 && (
//     <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-auto">Add New</button>  
  
//           )}