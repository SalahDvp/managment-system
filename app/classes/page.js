'use client'
import React, { useState, useEffect, useReducer, useRef } from 'react';
import { db } from '/app/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc, doc, getDoc, query, where, deleteDoc, setDoc, Timestamp, orderBy, onSnapshot, writeBatch, increment,
  
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Clock, Clock12, Clock4, LogIn } from 'lucide-react';
import Image from 'next/image';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Modal from 'react-modal';
import { getFunctions, httpsCallable } from "firebase/functions";
import { X } from 'lucide-react';

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

//ref for collecting messages
//id for the docuemnt
const fetchMessagesAndCreateConversation = async (setIsLoading) => {
  try {
    setIsLoading(true);
    const conversationRef = collection(db,'Classes',classId,'Messages');
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
    data:{notificationType:"newMessage",url:"/Chat/[Chat]" ,documentId: `Classes/${classId}`,   id:`Classes/${classId}`,
    ref:`Classes/${classId}/Messages`,
    date: new Date()},
    name:'TeamSupport',
 

  };
  try {
   
    setMessage('');

    // Attempt to create the conversation document and add the message in one operation
    const messagesRef = collection(db, `Classes/${classId}/Messages`);
    const conversationRef=doc(db,"Classes",classId);

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
  <div className="flex-grow p-4 bg-gray-100">

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
      <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
    </div>
  </div>
</div>


  );
};
export const formatTimestampToDate = (timestamp) => {
  const timestamps = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object

const options = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);

const formattedDate = dateTimeFormat.format(timestamps);
  return formattedDate; // Adjust date format as needed
};
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
const ParticipantsHorizontalScroll = ({ participants,trainees,setClassDetails,classDetails }) => {
  
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [fees, setFees] = useState(trainees.map(()=>{return "0"}));
  const [months, setMonths] = useState(trainees.map(()=>{return "1"}));
  const [prices, setPrices] = useState(trainees.map(() =>classDetails.classTime[0].price))
  const nonParticipants = trainees.filter((player) => !participants.some((participant) => participant.uid === player.uid));

  const togglePlayerSelection = (player) => {
    const isSelected = selectedPlayers.some((p) => p.uid === player.uid);
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.uid !== player.uid));
    } else {

      setSelectedPlayers([...selectedPlayers, {image:player.image,level:"Beginner",name:player.nameandsurname,uid:player.uid}]);
    }
  };
  // Function to handle adding a player to the participants list
  const handleAddPlayer = () => {
    setClassDetails((prevClassDetails) => {
      const updatedParticipants = selectedPlayers.map(player => {
        const playerIndex = trainees.findIndex(trainee => trainee.uid === player.uid);
      
        // Check if the player exists in the trainees array
        if (playerIndex !== -1) {
          return {
            ...player,
            Category: fees[playerIndex],
            lessonsLeft: (parseInt(fees[playerIndex], 10) + 1) * 4 * parseInt(months[playerIndex], 10),
            Price: parseInt(prices[playerIndex], 10)
          };
        } else {
          // Handle case where player is not found in trainees array
          console.error('Player not found in trainees array:', player);
          return null; // Or handle the error as needed
        }
      }).filter(Boolean); // Remove any null values from the updatedParticipants array

      return {
        ...prevClassDetails,
        participants: [...prevClassDetails.participants, ...updatedParticipants],
      };
    });
    setShowModal(false)
    setSelectedPlayers([])
  };
  const handleTimesPerWeekChange = (index, value ) => {
    setFees((prevSelectedPlayers) => {
      const updatedPlayers = [...prevSelectedPlayers];
      updatedPlayers[index] = value;
      return updatedPlayers;
    });
    setPrices((prevSelectedPlayers) => {
      const updatedPlayers = [...prevSelectedPlayers];
      updatedPlayers[index] =classDetails.classTime[value].price * parseInt(months[index], 10);
      return updatedPlayers;
    });

  };
  const handleMonthChange = (index, value ) => {
    setMonths((prevSelectedPlayers) => {
      const updatedPlayers = [...prevSelectedPlayers];
      updatedPlayers[index] = value;
      return updatedPlayers;
    });
    setPrices((prevSelectedPlayers) => {
      const updatedPlayers = [...prevSelectedPlayers];
      updatedPlayers[index] =classDetails.classTime[fees[index]].price * value;
      return updatedPlayers;
    });
  };
  const handlePriceChange = (index,e) => {
    setPrices((prevSelectedPlayers) => {
      const updatedPlayers = [...prevSelectedPlayers];
      updatedPlayers[index] =e.target.value;
      return updatedPlayers;
    });
  };


  return (    <div className="flex justify-center overflow-x-scroll space-x-4 py-4 w-full relative">

<button
  className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-2 rounded"
  onClick={() => setShowModal(true)}
>
  Add Player
</button>
{showModal && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white p-4 rounded-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-semibold  mb-4">Select Players</h2>
      {/* List of players */}
      <table>
        <tbody>
          {nonParticipants.map((player, index) => (
            <tr key={index} onClick={() => togglePlayerSelection(player)} className="hover:bg-blue-100 cursor-pointer">
              <td>
                <div className="flex items-center">
                  <div className="mr-3">
                    {selectedPlayers.some((p) => p.uid === player.uid) && (
                      <span className="text-blue-500">&#10003;</span> // Checkmark if player is selected
                    )}
                  </div>
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={player.image}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div className="ml-3">
                  <strong  className='ml-2 mt-4 mb-6 text-gray-600 font-semibold'>{player.nameandsurname}</strong>
                    <p>{player.level}</p>
                    {/* Times per week */}
                    <div className='flex flex-row'>
                      <div className="flex flex-col">
                        <strong className='text-gray-600 font-semibold ml-2 mt-4 mb-6'>How many times a week?</strong>
                        <select
                          value={player.timesPerWeek}
                          onChange={(e) => handleTimesPerWeekChange(index, e.target.value)}
                          className="rounded-lg mt-1 px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
                        >
                          {classDetails.classTime.map((cls, index) => (
                            <option value={index}>{index + 1} time/week</option>
                          ))}
                        </select>
                      </div>
                      {/* Duration */}
                      <div className="flex flex-col">
                        <strong  className='text-gray-600 font-semibold ml-2 mt-4 mb-6'>Duration</strong>
                        <select
                          value={player.timesPerWeek}
                          onChange={(e) => handleMonthChange(index, e.target.value)}
                          className="rounded-lg mt-1 px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
                        >
                          <option value="1">1 Month</option>
                          <option value="2">2 Months</option>
                          <option value="3">3 Months</option>
                          {/* Add more options as needed */}
                        </select>
                      </div>
                      {/* Total Price */}
                      <div className="flex flex-col">
                        <strong  className='text-gray-600 font-semibold ml-2 mt-4 mb-6'>Total Price</strong>
                        <input
                          className="rounded-lg ml-5"
                          type="text"
                          value={prices[index]}
                          onChange={(e)=>handlePriceChange(index,e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Button to add the selected player */}
      <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={handleAddPlayer}>
        Add Players
      </button>
      {/* Close button */}
      <button className="ml-2 text-gray-600" onClick={() =>{ setPrices(trainees.map(()=>classDetails.classTime[0].price)); setFees(trainees.map(()=>{return "0"}));
  setMonths(trainees.map(()=>{return "1"})); setShowModal(false)}}>
        Close
      </button>
    </div>
  </div>
)}
      {participants.map((participant,index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={participant.image}
              alt={participant.name}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <p>{participant.name}</p>
          <p>{participant.level}</p>
        </div>
      ))}

    </div>
  );
};


const ClassHistory = ({ classes}) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const handleDropdownToggle = (classId) => {
    setSelectedClass(selectedClass === classId ? null : classId);
  };

  const formatTimestampToDate = (timestamp) => {
    const timestamps = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
  
  const options = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
  const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
  
  const formattedDate = dateTimeFormat.format(timestamps);
    return formattedDate; // Adjust date format as needed
  };

  return (
    <div className="bg-white w-full">
      <h1 className="text-xl font-semibold  mb-4">Classes History</h1>
      {classes.map((cls,index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold ">{formatTimestampToDate(cls.start)}</h2>
            <div>
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white ml-5"
              onClick={() => handleDropdownToggle(cls.id)}
            >
              {selectedClass === cls.id ? 'Hide Participants' : 'Show Participants'}
            </button>

          </div>
 
          </div>
          {selectedClass === cls.id && (
            <div className="flex justify-center overflow-x-scroll space-x-4 py-4 w-full">
<table className="w-full border-collapse border border-gray-300">
  <thead>
    <tr className="bg-blue-500 text-white">
      <th className="px-4 py-2">Player</th>
      <th className="px-4 py-2">Overall</th>

      <th className="px-4 py-2">Forehand</th>
      <th className="px-4 py-2">Backhand</th>
      <th className="px-4 py-2">Serve</th>
      <th className="px-4 py-2">Notes</th>
    </tr>
  </thead>
  <tbody>
    {cls.Participants.map((participant,index) => (
      <tr key={index} className="bg-white hover:bg-gray-100">
        <td className="px-4 py-2 border border-gray-300">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <img
                src={participant.image}
                alt={participant.name}
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p>{participant.name}</p>
              <p>{participant.level}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 border border-gray-300">{participant?.classRate?.overAll}</td>

        <td className="px-4 py-2 border border-gray-300">{participant?.classRate?.forehand}</td>
        <td className="px-4 py-2 border border-gray-300">{participant?.classRate?.backhand}</td>
        <td className="px-4 py-2 border border-gray-300">{participant?.classRate?.serve}</td>
        <td className="px-4 py-2 border border-gray-300">{participant?.note}</td>
      </tr>
    ))}
  </tbody>
</table>
            </div>
          )}

        </div>
      ))}


    </div>
  );
};
const UpcomingClasses =({ classes,setI,i,canceled,classId }) => {

  const [selectedClass, setSelectedClass] = useState(null);
  const [newDateTime, setNewDateTime] = useState(new Date()); // State for the new class date and time

  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [showModal1, setShowModal1] = useState(false); 
  const handleDropdownToggle = (classId) => {
    setSelectedClass(selectedClass === classId ? null : classId);
  };

  const handleConfirmChange = async (id,newData) => {
    // Logic to handle confirmation and update class time in the database
   // Placeholder for handling the new date and time
   const classRef = doc(db, "Classes",classId,'attendance',id);

    try {
      await updateDoc(classRef, {date:newData});
      console.log("Document successfully updated!");
      setI(!i)
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    setShowModal(false);
  };
  const handleCancelClass =  async (cls) => {
    // Logic to handle confirmation and update class time in the database
   // Placeholder for handling the new date and time
   const classRef = collection(db, "Classes",'iWpp8XoveacegYotUXvF','CanceledClasses');
   const matchingCanceledClass = canceled.find((canceledClass) =>
   isSameDay(canceledClass.start.toDate(), cls.date.toDate())
 );
 if (matchingCanceledClass) {
  const canceledClassDocRef = doc(db, `Classes/${classId}/CanceledClasses/${matchingCanceledClass.id}`);
  await deleteDoc(canceledClassDocRef).finally(  setI(!i));

} else {
  // Add a new canceled class document
  await addDoc(classRef, {
    start: cls.date,
  }).finally(  setI(!i));
  setI(!i)
}

  
    setShowModal1(false);
  };

  const findCanceledClassByDate = (canceledClasses, dateToFind) => {
    
    const aa=canceledClasses.find((canceledClass) =>
      isSameDay(canceledClass.start.toDate(), dateToFind.toDate())
    );

    return aa
  };
  return (
    <div className="bg-white w-full">
      <h1 className="text-xl font-semibold  mb-4">Upcoming Classes</h1>
      {classes.map((cls,index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold ">{formatTimestampToDate(cls.date)}</h2>
            <div>
      
            <button
            className={`px-3 py-1 mt-4 rounded ${findCanceledClassByDate(canceled,cls.date)
        
                ? 'bg-blue-500 '
                : 'bg-red-500'
            } text-white mr-4`}
            onClick={() => setShowModal1(!showModal1)}
          >
    {findCanceledClassByDate(canceled,cls.date) ? 'resume Class' : 'Cancel Class'}
          </button>
            <button
            className="px-3 py-1 mt-4 rounded bg-green-500 text-white"
            onClick={() => setShowModal(!showModal)}
          >
            Change Time
          </button>

          <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}
  contentLabel="Confirm Change Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      zIndex: 99999, // Set a high z-index value for the overlay
    },
    content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
     
      zIndex: 100000, // Set a higher z-index value for the modal content
    },
  }}
  ariaHideApp={false} // Disable accessibility features
>
  <h2 className="text-xl font-semibold  mb-4">Confirm Class Time Change</h2>
  <p className="mb-4">Select the new time for the class:</p>
  <DateTimePicker
    onChange={(date) => {
      setNewDateTime(date);
      setShowModal(true); // Show modal after selecting the date and time
    }}
    clearIcon={false}
    value={newDateTime}
    minDate={new Date()} // Set minimum date to today
  />
  <div className="flex justify-between mt-4">
    <button
      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      onClick={() => handleConfirmChange(cls.id, newDateTime)}
    >
      Confirm Change
    </button>
    <button
      className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
      onClick={() => setShowModal(false)}
    >
      Cancel
    </button>
  </div>
</Modal>
<Modal
  isOpen={showModal1}
  onRequestClose={() => setShowModal1(false)}
  contentLabel="Confirm Change Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      zIndex: 99999, // Set a high z-index value for the overlay
    },
    content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
     
      zIndex: 100000, // Set a higher z-index value for the modal content
    },
  }}
  ariaHideApp={false} // Disable accessibility features
>

    <h2 className="text-xl font-semibold  mb-4"> {cls.canceled ?'Are you sure you want to resume the class':'Are you sure you want to cancel class'}</h2>
   

    <div className="flex justify-between mt-4">
      <button
        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        onClick={()=>handleCancelClass(cls)}
      >
        Confirm
      </button>
      <button
        className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
        onClick={() => setShowModal1(false)}
      >
        Cancel
      </button>
    </div>

</Modal>
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white ml-5"
              onClick={() => handleDropdownToggle(cls.id)}
            >
              {selectedClass === cls.id ? 'Hide Participants' : 'Show Participants'}
            </button>

          </div>
 
          </div>
          {selectedClass === cls.id && (
            <div className="flex justify-center overflow-x-scroll space-x-4 py-4 w-full">
        {cls.Participants.map((participant,index) => (
                <div key={index} className="flex items-center my-2">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={participant.image}
                      alt={participant.name}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p>{participant.name}</p>
                    <p>{participant.level}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ))}


    </div>
  );
};


const Item =  ({ item, onNavigate,i,setI,trainers,trainees}) => {
  const [classDetails, setClassDetails]=useState(item);
  const [showDetails, setShowDetails] = useState(false);
  const courts=['Court1','Court2','Court3','Court4','Court5','Court6','Court7','Court8','Court9','Court10','Court11','Court12','Court13']
  const [activeTab, setActiveTab] = useState('details'); // Default active tab is details

  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previous=item


  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };



  const handleTextClick = () => {
    setShowCalendar(true); // Show calendar when text is clicked
  };

  const handleCalendarClose = () => {
    setShowCalendar(false); // Close calendar when date is selected
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleTimeChange = (value, change, index) => {
    const formattedTime = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  
    if ( formattedTime.length===2) {
      // Add colon after the second number if the input is within HH:mm format
      value = formattedTime + ':';
    }
  

      // Update either startTime or endTime in the date object based on the change parameter
      setClassDetails({
        ...classDetails,
        classTime: classDetails.classTime.map((item, idx) =>
          idx === index ? { ...item, [change]: value } : item
        ),
      });

    
  };
  const handlePriceChange = (value, change, index) => {
  

      // Update either startTime or endTime in the date object based on the change parameter
      setClassDetails({
        ...classDetails,
        classTime: classDetails.classTime.map((item, idx) =>
          idx === index ? { ...item, [change]: value } : item
        ),
      });

    
  };

  const handleAddTime = () => {
    if (classDetails.classTime.length < 7) {
      setClassDetails({
        ...classDetails,
        classTime: [
          ...classDetails.classTime,
          { day:'', startTime:'', endTime:'' }
        ]
      });
    } else {
      alert('You can only add up to seven times.');
    }
  };
  const handleRemoveTime = (index) => {
    if (classDetails.classTime.length >1) {
    const updatedTimes = classDetails.classTime.filter((time, idx) => idx !== index);
  
    setClassDetails({
      ...classDetails,
      classTime: updatedTimes,
    });
  } else {
    alert('You must leave one class Time.');
  }
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    const updatedClassDetails = { ...classDetails };
  
    // Remove properties from updatedClassDetails
    delete updatedClassDetails.attendance;
    delete updatedClassDetails.trainer;
    delete updatedClassDetails.history;
    delete updatedClassDetails.canceled;
  
    // Extract UIDs from participants and add them to participantsUid
    const participantsUid = classDetails.participants.map(participant => participant.uid);
    updatedClassDetails.participantsuid = participantsUid;
    if (previous !== classDetails) {
      try {
        let total=0
        await updateDoc(doc(db, 'Classes', classDetails.id), updatedClassDetails);
  
        // Check for new participants
        const newParticipants = classDetails.participants.filter(participant =>
          !previous.participants.some(prevParticipant => prevParticipant.uid === participant.uid)
        );
  
        if (newParticipants.length > 0) {
          const currentDate = new Date();
  
  
          // Create documents in PaymentReceived subcollection for new participants
          newParticipants.forEach(participant => {
            const paymentReceivedRef = collection(db, 'Club/GeneralInformation/PaymentReceived'); // Generate a new document ID
            addDoc(paymentReceivedRef, {
              uid: participant.uid,
              date: currentDate,
              classRef: classDetails.id,
              payment: 'on-site',
              price: participant.Price
            });
            total+=participant.Price
          });
    
    await updateDoc(doc(db,'Club','GeneralInformation'),{
      totalRevenue:increment(total)
    })

        }
  
        // If the update is successful, setIsSubmitting(false);
        alert('Changes Submitted.');
        setIsSubmitting(false);
        setI(!i);
      } catch (error) {
        console.error('Error updating document:', error);
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
      alert('No changes to submit.');
    }
  };
  


  return (
    <div
      className="bg-gray-100 p-1 rounded-md cursor-pointer hover:shadow-lg relative font-semibold text-gray-600"
      style={{
        width: '300px',
        height: '300px',
        
        margin: '10px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        color: '#000' // Setting text color to black
      }}

    >
           <div className="flex items-start" >
        <div>
          {previous.image && <img src={previous.image} alt="Class" className="w-16 h-16 rounded-full" />}
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold">{previous.className}</p>
          <p className="text-sm">Time: {previous.classTime[0].startTime} - {previous.classTime[0].endTime}, {previous.classTime[0].day}</p>

          <div className="items-start w-full h-px bg-gray-400 my-2 mt-8 ml-0"></div>
          <div className="flex flex-wrap mb-2">
            {previous.participants && previous.participants.map((participant, index) => (
              <img key={index} src={participant.image} alt={`Participant ${index + 1}`} className="w-8 h-8 rounded-full mr-1" />
            ))}
          </div>
       
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-20 ml-10" onClick={toggleDetails}  
          >
            View Details
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="fixed inset-0 flex justify-end items-center h-full overflow-auto bg-gray-600 bg-opacity-50" style={{ height: 'calc(100% )', zIndex: '9999' }}>

  <button onClick={toggleDetails} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <div className="w-3/6 h-full bg-white border rounded-t flex flex-col justify-start items-start">

    <div className='flex'>
    
    <h2 className="text-xl font-semibold text-gray-600 ml-4 mt-4 mb-6">Class Details</h2>
    <div className='ml-72'/>
    <div className="mt-4" >
      <strong  className='ml-2 mt-4 mb-6 font-semibold text-gray-600'>Class ID</strong> 
      <input className="rounded-lg ml-5" type="text" readOnly value={classDetails.id} />
    </div>
    </div>
    <div className="flex flex-col justify-start items-start w-full">
    <div className="flex justify-center space-x-4 w-full"> 
  <button
   className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeTab === 'details' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}
    onClick={() => setActiveTab('details')}
  >
    Details
  </button>
  <button
   className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeTab === 'attendance' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}
    onClick={() => setActiveTab('attendance')}
  >
    Up Coming Classes
  </button>
  <button
   className={`px-4 py-2 font-semibold  rounded-lg focus:outline-none ${activeTab === 'classHistory' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}
    onClick={() => setActiveTab('classHistory')}
  >
    Class History
  </button>
  <button
   className={`px-4 py-2 font-semibold rounded-lg focus:outline-none ${activeTab === 'Chat' ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}
    onClick={() => setActiveTab('Chat')}
  >
    Chat
  </button>
</div>

</div>
          {activeTab === 'details' && ( <div className="bg-white w-full">
            <h1 className="text-lg font-semibold  ml-4 mb-2">General Information</h1>


    <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>

      <div className="ml-4 grid grid-cols-3 gap-4">
        
        <div>

        
          <strong  className='text-gray-600 font-semibold'>Name</strong> 
          <input
          className="rounded-lg "
          type="text"
          name="className"
          value={classDetails.className}
          onChange={handleInputChange}
        />
        </div>
        <div className="flex flex-col">
          <strong className='text-gray-600 font-semibold'>Type</strong> 
          
          <select
          className="rounded-lg"
          name="Type"
          value={classDetails.Type}
          onChange={handleInputChange}

        >
          <option value="Group">Group</option>
          <option value="Semi-Group">Semi-Group</option>
          <option value="Private">Private</option>
        </select>
   
        </div>
          <div className="flex flex-col rounded-lg">
        <strong className='text-gray-600 font-semibold'>Duration(weeks)</strong>
        <div className='flex flex-row'>

        <input
          className="rounded-lg ml-2"
          type="number"
          name="Duration"
          value={classDetails.Duration}
          min={1}
          onChange={handleInputChange}
        />
    
        </div>
    
      </div>
   
        <div>
          

<div className="flex flex-col">
        <strong className='text-gray-600 font-semibold'>Trainer</strong>
        <select
          className="rounded-lg"
          name="TrainerRef"
          value={classDetails.trainerId}
          onChange={handleInputChange}
        >
          <option value={classDetails.trainer.nameandsurname}>{classDetails.trainer.nameandsurname}</option>
          {trainers.map((trainer,index) => (
            <option key={index} value={trainer.Ref} >
              {trainer.nameandsurname}
            </option>
          ))}
        </select>
      </div>
</div>
      
          <div className="flex flex-col">
          <strong className='text-gray-600 font-semibold'>Features</strong> 
          
          <input
          className="rounded-lg"
          type="text"
          name="Features"
          value={classDetails.features.join(', ')}
          onChange={(e) => setClassDetails({ ...classDetails, features: e.target.value.split(', ') })} // Convert string back to array on change
        />
          
          
        </div>
        <div className="flex flex-col">
          <strong className='text-gray-600 font-semibold'>Registration deadline</strong> 
          <input
          className="rounded-lg"
          type="text"
          name="RegistrationDeadLine"
          value={classDetails.RegistrationDeadLine.nanoseconds?formatTimestampToDate(classDetails.RegistrationDeadLine):classDetails.RegistrationDeadLine}
         onClick={handleTextClick} // Convert string back to array on change
        />
          
      {showCalendar && (
        <DateTimePicker
          value={classDetails.RegistrationDeadLine.nanoseconds?classDetails.RegistrationDeadLine.toDate():classDetails.RegistrationDeadLine}
          onChange={(date) => {
            setClassDetails({ ...classDetails, RegistrationDeadLine: date })
            handleCalendarClose(); // Close calendar after date selection
          }}
          calendarIcon={null} // Remove default calendar icon
     
        />
      )}
        </div>
        
          {classDetails.classTime.map((cls,index)=>(
               
               <div key={index}>
       
               
               <strong className='text-gray-600 font-semibold'>{index+1} time a week Price(Monthly)</strong> 
               <input
               className="rounded-lg"
               type="text"
               name="classTime"
            value={cls.price}
               onChange={(e) => handlePriceChange(e.target.value,'price',index)}
             />
             </div>
               ))}
      </div>

    </div>
    <h3 className="text-lg font-semibold  ml-4 mb-2">Description</h3>
    <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 w-full"style={{ width: 'calc(100% - 24px)' }}>
          
          <input
          className="rounded-lg w-full"
          type="text"
          name="description"
          multiple
          value={classDetails.description}
          onChange={handleInputChange} // Convert string back to array on change
        />
          
          
        </div>
    <h3 className="text-lg font-semibold  ml-4 mb-2">Time</h3>
    <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 relative" style={{ width: 'calc(100% - 24px)' }}>
        <button className="absolute top-2 right-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddTime}>Add Time</button>
    <div className="grid grid-cols-1 gap-4">
{    classDetails.classTime.map((date, index) => (
    <div key={index} className=''>
      <strong className='text-gray-600 font-semibold'>Date {index + 1}</strong> <br />
      <div className='flex flex-row'>
  <div className='mr-4'>
  <strong className='text-gray-600 font-semibold'>Day</strong> <br />
  <select
    className="rounded-lg"
    value={date.day}
   onChange={(e) => handleTimeChange(e.target.value,'day',index)}
  >
    <option value="Monday">Monday</option>
    <option value="Tuesday">Tuesday</option>
    <option value="Wednesday">Wednesday</option>
    <option value="Thursday">Thursday</option>
    <option value="Friday">Friday</option>
    <option value="Saturday">Saturday</option>
    <option value="Sunday">Sunday</option>
  </select>
</div>
<div className='mr-2'>
  <strong className='text-gray-600 font-semibold'>Start Time</strong> <br />
  <input
 className="rounded-lg w-24" 
 type="text"
    name='startTime'
    value={date.startTime}
    onChange={(e) => handleTimeChange(e.target.value,'startTime',index)}

  />
</div>
<div className='mr-2'>
  <strong className='text-gray-600 font-semibold'>End Time</strong> <br />
  <input
 className="rounded-lg w-24" 
 type="text"
    name='endTime'
    value={date.endTime}
    onChange={(e) => handleTimeChange(e.target.value,'endTime',index)}

  />
</div>
<div className="flex flex-col">
                      <strong className='text-gray-600 font-semibold'>Court</strong>
                      <select
                        className="rounded-lg"
                        name="Court"
                        value={date.Court}
                        onChange={(e) => handlePriceChange(e.target.value,'Court',index)}
                      >
                        <option value=''>choose a court</option>
                        {courts.map((court,index) => (
                          <option key={index} value={court} >
                            {court}
                          </option>
                        ))}
                      </select>
                    </div>
    </div> 
    <button onClick={() => handleRemoveTime(index)}>Remove</button>
    </div>
  ))}
          
        </div>
        </div>
    <h3 className="text-lg font-semibold  ml-4 mb-2">Restrictions</h3>
    <div className="p-6 mt-4  border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
     
      <div className="grid grid-cols-3 gap-4">
        <div>
          <strong className='text-gray-600 font-semibold'>Min. Players</strong> <br />
          <input className="rounded-lg" type="number" name='minmumNumber' onChange={handleInputChange} min={1} value={classDetails.minmumNumber}   />
        </div>
        <div>
          <strong className='text-gray-600 font-semibold'>Max. Players</strong> <br />
          <input className="rounded-lg" type="number" name='maximumNumber' onChange={handleInputChange} min={classDetails.minmumNumber} value={classDetails.maximumNumber} />
        </div>

        <div>
          <strong className='text-gray-600 font-semibold'>Level</strong> <br />
          <select
  className="rounded-lg"
  value={classDetails.level}
  onChange={(e) => setClassDetails({ ...classDetails, level: e.target.value })}
>
 
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select>
        </div>
        <div>
          <strong className='text-gray-600 font-semibold'>Average Age</strong> <br />
          <input className="rounded-lg mt-2" type="text" name='age' onChange={handleInputChange}  value={classDetails.age} />
        </div>
   
      </div>
    </div>
    <h3 className="text-lg font-semibold  ml-4 mb-2">Participants</h3>
    <div className="p-6 mt-4  border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
     

      <div>
 
      <ParticipantsHorizontalScroll classDetails={classDetails} participants={classDetails.participants} trainees={trainees} setClassDetails={setClassDetails}/>
    </div>

    </div>
  
<div className='bg-white w-full'>


<button
      className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold  py-2 px-4 rounded mb-10"
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      Submit
    </button>
  </div>
  </div>)}
  {activeTab==='attendance'&&(
 <UpcomingClasses classes={item.attendance} setI={setI} i={i} canceled={item.canceled} classId={classDetails.id}/>
  )}
    {activeTab==='classHistory'&&(
 <ClassHistory classes={classDetails.history} />
  )} 
    {activeTab==='Chat'&&(
<ChatScreen classData={item} classId={item.id}/>
  )}
  </div>
  
  
</div>
      )}




    </div>
  );
};

const NewItem = ({trainers,trainees,setI,i}) => {
  const [classes, setClasses] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState([new Date()]);
  const [selectedDurations, setSelectedDurations] = useState([60]); 
  const [classDetails, setClassDetails]=useState({classTime:[{day:'Monday',startTime:'13:00',endTime:'14:00'}],participants:[],participantsuid:[]});
  const [showDetails, setShowDetails] = useState(false);
  const courts=['Court1','Court2','Court3','Court4','Court5','Court6','Court7','Court8','Court9','Court10','Court11','Court12','Court13']
  const [showForm,setShowForm]=useState(false)
const [isSubmitting,setIsSubmitting]=useState(false)
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility
  


  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };



  const handleTextClick = () => {
    setShowCalendar(true); // Show calendar when text is clicked
  };

  const handleCalendarClose = () => {
    setShowCalendar(false); // Close calendar when date is selected
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setClassDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleTimeChange = (value, change, index) => {
    const formattedTime = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  
    if ( formattedTime.length===2) {
      // Add colon after the second number if the input is within HH:mm format
      value = formattedTime + ':';
    }
  

      // Update either startTime or endTime in the date object based on the change parameter
      setClassDetails({
        ...classDetails,
        classTime: classDetails.classTime.map((item, idx) =>
          idx === index ? { ...item, [change]: value } : item
        ),
      });

    
  };
  const handlePriceChange = (value, change, index) => {

      setClassDetails({
        ...classDetails,
        classTime: classDetails.classTime.map((item, idx) =>
          idx === index ? { ...item, [change]: value } : item
        ),
      });

    
  };

  const handleAddTime = () => {
    if (classDetails.classTime.length < 7) {
      setClassDetails({
        ...classDetails,
        classTime: [
          ...classDetails.classTime,
          { day:'', startTime:'', endTime:'' }
        ]
      });
    } else {
      alert('You can only add up to seven times.');
    }
  };
  const handleRemoveTime = (index) => {
    if (classDetails.classTime.length >1) {
    const updatedTimes = classDetails.classTime.filter((time, idx) => idx !== index);
  
    setClassDetails({
      ...classDetails,
      classTime: updatedTimes,
    });
  } else {
    alert('You must leave one class Time.');
  }
  };
  // Function to create attendance data for a class
async function createAttendanceForClass(docRef) {
  try {
 const dayMap = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    };

    // Loop through each class time
    classDetails.classTime.forEach(async (classTime) => {
      // Get the start date of the current week based on the day of the week
      let startDate = new Date(); // Use the current date as the base
      const currentDay = startDate.getDay(); // Get the current day of the week
      const targetDay = dayMap[classTime.day]; // Get the numeric value for the target day
      const daysUntilTargetDay = (targetDay - currentDay + 7) % 7; // Calculate days until target day
      startDate.setDate(startDate.getDate() + daysUntilTargetDay); // Set the start date
      startDate.setHours(classTime.startTime.split(':')[0]); // Set end time hours
      startDate.setMinutes(classTime.startTime.split(':')[1]); 
      // Calculate the end date of the current week
      let endDate = new Date(startDate);
      endDate.setHours(classTime.endTime.split(':')[0]); // Set end time hours
      endDate.setMinutes(classTime.endTime.split(':')[1]); // Set end time minutes

      // Loop through each week based on the class duration
      for (let i = 0; i < parseInt(classDetails.Duration, 10); i++) {
        // Construct document data for Firestore
        const docData = {
          Participants: classDetails.participantsuid,
          date: startDate,
          end: endDate,
   
        };
        const durationMs = endDate.getTime() - startDate.getTime();
        // Write to Firestore
         await addDoc(collection(db,'Classes',docRef,'attendance'),docData)
  
        await addDoc(collection(db,'Courts',classTime.Court,'Reservations'),{
          startTime: startDate,
          end: endDate,
        date:startDate,
      duration: Math.floor(durationMs / (1000 * 60)),
        type:'class'
    })

        startDate.setDate(startDate.getDate() + 7);
        endDate.setDate(endDate.getDate() + 7);
      }
    });

    // Log success
    console.log('Attendance data created successfully.');
  } catch (error) {
    // Log any errors
    console.error('Error creating attendance data:', error);
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(classDetails).some(value => value === undefined)) {
      alert('Please fill in all required fields.');
      return;
    }
  
    try {
      const updatedClassDetails = { ...classDetails };
  
      // Remove unnecessary properties from updatedClassDetails
      delete updatedClassDetails.attendance;
      delete updatedClassDetails.trainer;
      delete updatedClassDetails.history;
      delete updatedClassDetails.canceled;
  
      const participantsUid = classDetails.participants.map(participant => participant.uid);
      updatedClassDetails.participantsuid = participantsUid;
  

      const docRef = await addDoc(collection(db, 'Classes'), updatedClassDetails);
      await createAttendanceForClass(docRef.id)

      if (updatedClassDetails.participants.length > 0) {
        const currentDate = new Date();
        let total = 0;
  
        // Create documents in PaymentReceived subcollection for new participants
        updatedClassDetails.participants.forEach(participant => {
          const paymentReceivedRef = collection(db, 'Club/GeneralInformation/PaymentReceived');
          addDoc(paymentReceivedRef, {
            uid: participant.uid,
            date: currentDate,
            classRef: docRef.id,
            payment: 'on-site',
            price: participant.Price,
          });
          total += parseInt(participant.Price, 10); // Increment total price
        });
  
        // Update totalRevenue in Firestore
        await updateDoc(doc(db, 'Club/GeneralInformation'), {
          totalRevenue: increment(total),
        });
      }
  
      // Close modal, show success message, and update state
      handleClose();
      alert('Class Created Successfully');
      setI(!i);
    } catch (error) {
      console.error('Error adding document:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  const handleClose = () => {
    setShowForm(false);
  };
  // Default duration is 60 minutes

// Default duration is 60 minutes

  const handleDateTimeChange = (date, index) => {
    const newDateTime = [...selectedDateTime];
    newDateTime[index] = date;
    setSelectedDateTime(newDateTime);
  };

  const handleDurationChange = (e, index) => {
    const duration = parseInt(e.target.value, 10);
    const newDurations = [...selectedDurations];
    newDurations[index] = duration;
    setSelectedDurations(newDurations);
  };



  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
       setClassDetails({...classDetails,image:e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null})
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {!showForm ? (
      <div
        className="bg-gray-200 p-3 rounded-md cursor-pointer hover:shadow-lg flex items-center justify-center"
        style={{
          width: '300px',
          height: '300px',
          margin: '10px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          textAlign: 'center',
        }}
        onClick={toggleForm}
      >
        <span className="text-5xl">+</span>
      </div>
    ) :    (
      <div className="fixed inset-0 flex justify-end items-center h-full overflow-auto bg-gray-600 bg-opacity-50" style={{ height: 'calc(100% )', zIndex: '9999' }}>

    
      <div className="w-3/6 h-full bg-white border rounded-t flex flex-col justify-start items-start">
    
      <button onClick={toggleForm} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

      
      
      
      
        <div className='flex'>
     
        <h2 className="text-xl font-semibold  ml-4 mt-4 mb-6">Class Details</h2>
        <div className='ml-72'/>
 
        </div>
   
      <div className="bg-white w-full">
                <h1 className="text-lg font-semibold  ml-4 mb-2">General Information</h1>
    
    
        <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
    
          <div className="ml-4 grid grid-cols-3 gap-4">
            
            <div>
    
            
              <strong className='text-gray-600 font-semibold'>Name</strong> 
              <input
              className="rounded-lg"
              type="text"
              name="className"
    
              onChange={handleInputChange}
            />
            </div>
            <div className="flex flex-col">
              <strong className='text-gray-600 font-semibold'>Type</strong> 
              
              <select
              className="rounded-lg"
              name="Type"
 
              onChange={handleInputChange}
    
            >
              <option value="Group">Group</option>
              <option value="Semi-Group">Semi-Group</option>
              <option value="Private">Private</option>
            </select>
       
            </div>
              <div className="flex flex-col rounded-lg">
            <strong className='text-gray-600 font-semibold'>Duration(weeks)</strong>
            <div className='flex flex-row'>
    
            <input
              className="rounded-lg ml-2"
              type="number"
              name="Duration"
         
              min={1}
              onChange={handleInputChange}
            />
        
            </div>
          </div>
            <div>
              
    
    <div className="flex flex-col">
            <strong className='text-gray-600 font-semibold'>Trainer</strong>
            <select
              className="rounded-lg"
              name="TrainerRef"
              onChange={(e) => {
                const selectedTrainerId = e.target.value;
                const selectedTrainer = trainers.find((trainer) => trainer.nameandsurname === selectedTrainerId);
                setClassDetails((prevDetails) => ({
                  ...prevDetails,
                  TrainerRef: selectedTrainer.Ref, // Assuming selectedTrainer is the object reference
                }));
              }}
              >
              <option value="">select Trainer</option>
              {trainers.map((trainer,index) => (
            <option key={trainer.id} value={trainer.nameandsurname}>
          
                  {trainer.nameandsurname}
                </option>
              ))}
            </select>
          </div>
    </div>
          
              <div className="flex flex-col">
              <strong className='text-gray-600 font-semibold'>Features</strong> 
              
              <input
              className="rounded-lg"
              type="text"
              name="Features"
           
              onChange={(e) => setClassDetails({ ...classDetails, features: e.target.value.split(', ') })} // Convert string back to array on change
            />
              
              
            </div>
            <div className="flex flex-col">
              <strong className='text-gray-600 font-semibold'>Registration deadline</strong> 
              <input
              className="rounded-lg"
              type="text"
              name="RegistrationDeadLine"
              value={classDetails.RegistrationDeadLine?classDetails.RegistrationDeadLine.toDateString():new Date().toDateString()}
             onClick={handleTextClick} // Convert string back to array on change
            />
              
          {showCalendar && (
            <DateTimePicker
              value={new Date()}
              onChange={(date) => {
                setClassDetails({ ...classDetails, RegistrationDeadLine: date })
                handleCalendarClose(); // Close calendar after date selection
              }}
              calendarIcon={null} // Remove default calendar icon
         
            />
          )}
            </div>
          
              
              <div className="flex flex-col">
      <strong className='text-gray-600 font-semibold'>Upload Class Image</strong>
      <label htmlFor="imageInput" className="rounded-lg border border-black-900 px-3 py-2  cursor-pointer ">
        {classDetails.image ? 'Change Image' : 'Upload Image'}
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleImageChange(e);
          
          }}
          style={{ display: 'none' }}
        />
      </label>
    </div>
    {classDetails.classTime.map((cls,index)=>(
               
               <div key={index}>
       
               
               <strong className='text-gray-600 font-semibold'>attending {index+1} times a week Price (Monthly)</strong> 
               <input
               className="rounded-lg"
               type="text"
               name="classTime"
            value={cls.price}
               onChange={(e) => handlePriceChange(e.target.value,'price',index)}
             />
             </div>
               ))}
          </div>
    
        </div>
        <h3 className="text-lg font-semibold  ml-4 mb-2">Description</h3>
        <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 w-full"style={{ width: 'calc(100% - 24px)' }}>
              
              <input
              className="rounded-lg w-full"
              type="text"
              name="description"
              multiple

              onChange={handleInputChange} // Convert string back to array on change
            />
              
              
            </div>
        <h3 className="text-lg font-semibold  ml-4 mb-2">Time</h3>
        <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 relative" style={{ width: 'calc(100% - 24px)' }}>
            <button className="absolute top-2 right-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddTime}>Add Time</button>
        <div className="grid grid-cols-1 gap-4">
    {    classDetails.classTime.map((date, index) => (
        <div key={index} className=''>
          <strong className='text-gray-600 font-semibold'>Date {index + 1}</strong> <br />
          <div className='flex flex-row'>
      <div className='mr-4'>
      <strong className='text-gray-600 font-semibold'>Day</strong> <br />
      <select
        className="rounded-lg"
        value={date.day}
       onChange={(e) => handleTimeChange(e.target.value,'day',index)}
      >
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
        <option value="Saturday">Saturday</option>
        <option value="Sunday">Sunday</option>
      </select>
    </div>
    <div className='mr-2'>
      <strong className='text-gray-600 font-semibold'>Start Time</strong> <br />
      <input
     className="rounded-lg w-24" 
     type="text"
        name='startTime'
        value={date.startTime}
        onChange={(e) => handleTimeChange(e.target.value,'startTime',index)}
    
      />
    </div>
    <div className='mr-2'>
      <strong className='text-gray-600 font-semibold'>End Time</strong> <br />
      <input
     className="rounded-lg w-24" 
     type="text"
        name='endTime'
        value={date.endTime}
        onChange={(e) => handleTimeChange(e.target.value,'endTime',index)}
    
      />
    </div>
    <div className="flex flex-col">
                      <strong className='text-gray-600 font-semibold'>Court</strong>
                      <select
                        className="rounded-lg"
                        name="Court"
        
                        onChange={(e) => handlePriceChange(e.target.value,'Court',index)}
                      >
                        <option value=''>choose a court</option>
                        {courts.map((court,index) => (
                          <option key={index} value={court} >
                            {court}
                          </option>
                        ))}
                      </select>
                    </div>
        </div> 
        <button onClick={() => handleRemoveTime(index)}>Remove</button>
        </div>
      ))}
              
            </div>
            </div>
        <h3 className="text-lg font-semibold  ml-4 mb-2">Restrictions</h3>
        <div className="p-6 mt-4  border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
         
          <div className="grid grid-cols-3 gap-4">
            <div>
              <strong className='text-gray-600 font-semibold'>Min. Players</strong> <br />
              <input className="rounded-lg" type="number" name='minmumNumber' onChange={handleInputChange} min={1}    />
            </div>
            <div>
              <strong className='text-gray-600 font-semibold'>Max. Players</strong> <br />
              <input className="rounded-lg" type="number" name='maximumNumber' onChange={handleInputChange} min={classDetails.minmumNumber}  />
            </div>
    
            <div>
              <strong className='text-gray-600 font-semibold'>Level</strong> <br />
              <select
      className="rounded-lg"

      onChange={(e) => setClassDetails({ ...classDetails, level: e.target.value })}
    >
     
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Advanced">Advanced</option>
    </select>
            </div>
            <div>
              <strong className='text-gray-600 font-semibold'>Average Age</strong> <br />
              <input className="rounded-lg mt-2" type="text" name='age' onChange={handleInputChange}  />
            </div>
      
          </div>
        </div>
        <h3 className="text-lg font-semibold  ml-4 mb-2">Participants</h3>
        <div className="p-6 mt-4  border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
         
    
          <div>
     
          <ParticipantsHorizontalScroll classDetails={classDetails} participants={classDetails.participants} trainees={trainees} setClassDetails={setClassDetails}/>
        </div>
    
        </div>
      
    <div className='bg-white w-full'>
    
    
    <button
          className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold  py-2 px-4 rounded mb-10"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Submit
        </button>
      </div>
      </div>
   
      </div>
      
      
    </div>
          )}
  </>
);
};


const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [rerender,setRerender] = useState(true);
  const classesCollection = collection(db, "Classes");

  useEffect(() => {
    const getClasses = async () => {
      try {

        const querySnapshot = await getDocs(classesCollection);
    
        const promises = querySnapshot.docs.map(async (doc) => {
          const classData = doc.data();
          const trainerDoc = await getDoc(classData.TrainerRef);
          const attendanceSnapshot = await getDocs(query(collection(db, `Classes/${doc.id}/attendance`),where('date','>=',(new Date()))));
          const CanceledSnapshot = (await getDocs(collection(db, `Classes/${doc.id}/CanceledClasses`)));
          const canceledClasses = CanceledSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          
          const HistorySnapshot = await getDocs(collection(db, `Classes/${doc.id}/ClassHistory`));
          const HistoryPromises = HistorySnapshot.docs.map(async (HistoryDoc) => {
            const HistoryData = HistoryDoc.data();
            const participants = HistoryData.Trainees;
  
            // Merging participant details
            const mergedParticipants = participants.map((participant) => {
              if (Array.isArray(classData.participants)) {
                const additionalDetail = classData.participants.find((detail) => detail.uid === participant.uid);
                return { ...participant, ...additionalDetail };
              } else {
                console.error('classData.participants is not an array.');
                return participant; // Return the participant without additional details
              }
            });
       
            return { ...HistoryData, Participants: mergedParticipants, id: HistoryDoc.id };
          });
   
          const attendancePromises = attendanceSnapshot.docs.map(async (attendanceDoc) => {
            const attendanceData = attendanceDoc.data();
            const participants = attendanceData.Participants;
            
            // Merging participant details
            const mergedParticipants = participants.map((participant) => {
              if (Array.isArray(classData.participants)) {
                const additionalDetail = classData.participants.find((detail) => detail.uid === participant.uid);
                console.log("mammaia");
                return { ...participant, ...additionalDetail };
              } else {
                console.error('classData.participants is not an array.');
                return participant; // Return the participant without additional details
              }
            });
       
            return { ...attendanceData, Participants: mergedParticipants, id: attendanceDoc.id };
          });
  
          const resolvedAttendance = await Promise.all(attendancePromises);
          const resolvedHistory = await Promise.all(HistoryPromises);
          return { ...classData, id: doc.id, trainer: trainerDoc.data(), attendance: resolvedAttendance,history:resolvedHistory,canceled:canceledClasses };
        });
    
        const resolvedClasses = await Promise.all(promises);
        console.log(resolvedClasses[0].Duration);
        setItems(resolvedClasses);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    getClasses()

  }, [rerender]);
  const [trainers, setTrainers] = useState([])
  useEffect(() => {
    const fetchTrainers = async () => {
      const trainersCollection = collection(db, 'Trainers');
      const querySnapshot = await getDocs(trainersCollection);
      const trainersData = querySnapshot.docs.map((doc) => ({
        
        Ref: doc.ref,
        nameandsurname: doc.data().nameandsurname,
      }));
     
      setTrainers(trainersData);
    };

    fetchTrainers();
  }, []);
  const [trainees, setTrainees] = useState([])
  useEffect(() => {
    const fetchTrainers = async () => {
      const trainersCollection = collection(db, 'Trainees');
      const querySnapshot = await getDocs(trainersCollection);
      const trainersData = querySnapshot.docs.map((doc) => ({
        Ref: doc.ref,
        ...doc.data()
      }));
      setTrainees(trainersData);
    };

    fetchTrainers();
  }, []);

 
  const navigateToDetails = (item) => {
    // You can define your navigation logic here
    console.log("Navigate to details:", item);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold  my-4 text-center">Class List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <Item
          key={index}
          item={item}
          onNavigate={navigateToDetails}
          setI={setRerender}
          i={rerender}
          trainers={trainers}
          trainees={trainees}
        />
      ))}
  
          <NewItem  trainers={trainers} trainees={trainees} setI={setRerender} i={rerender}/>
        
      </div>
    </div>
  );
};

export default Dashboard;
