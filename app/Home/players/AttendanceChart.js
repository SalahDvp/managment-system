import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,LineChart,CartesianGrid,Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
  
  // Function to get the week number from a date
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysPassed = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((date.getDay() + 1 + daysPassed) / 7);
    return weekNumber;
  };
const AttendanceRateChart = ({ coachDetails }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const calculateAttendanceRate = () => {
      const newData = coachDetails.classes.map((classItem) => ({
        id: classItem.id,
        className: classItem.className, // Assuming className is stored in classItem object
        attendanceRate: calculateAttendanceRateForClass(classItem.attendance,coachDetails.uid,classItem),
        satisfactionRate: calculateSatisfactionRateForClass(classItem.classhistory,coachDetails.uid),
      }));
      setData(newData);
    };

    const calculateAttendanceRateForClass = (attendanceData,userId,classItem) => {
      if (!attendanceData || attendanceData.length === 0) return 0;

      // Filter attendance data for the specific user
      const userAttendance = attendanceData.filter(attendance => attendance.participants.some(participant => participant.uid === userId));
    
      const totalDays = userAttendance.length;
      if (totalDays === 0) return 0; // User didn't attend any days
    
      const totalParticipants = userAttendance.reduce(
        (total, attendance) => total + attendance.participants.length,
        0
      );
      const averageParticipantsPerDay = totalParticipants / totalDays;
      const expectedParticipants = classItem.participants.length; // Assuming expectedParticipants per class
      const attendanceRate = (averageParticipantsPerDay / expectedParticipants) * 100;
      return attendanceRate.toFixed(2);  // Return the attendance rate with 2 decimal places
    };
    const calculateSatisfactionRateForClass = (classHistoryData, userId) => {
      if (!classHistoryData || classHistoryData.length === 0) return [];
    

      // Calculate satisfaction rate for each class and include the date
      const satisfactionRates = classHistoryData.map(classData => {
        const participant = classData.participants.find(participant => participant.uid === userId);

        if (!participant) return null; // Skip if participant not found
    
        return { date:   classData.date.toDate(), satisfactionRate: participant.classRate.overAll,classRate:{forehand: participant.classRate.forehand,backhand:participant.classRate.backhand,serve:participant.classRate.serve}};
      }).filter(rate => rate !== null); // Remove null entries
    
      return satisfactionRates;
    };
   
    if (coachDetails && coachDetails.classes) {
      calculateAttendanceRate();
    }
  }, []);

  const transformedData = data.map(({ className, satisfactionRate }) => ({
    className,
    satisfactionRate: satisfactionRate.map(({ date, classRate }) => ({
      date,
      classRate: [
        { subject: 'Forehand', rate: classRate.forehand },
        { subject: 'Backhand', rate: classRate.backhand },
        { subject: 'Serve', rate: classRate.serve },
      ],
    })),
  }));
  // Function to calculate average
const calculateAverage = (arr) => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((total, rate) => total + rate, 0);
  return sum / arr.length;
};
// Calculate average rates for each subject for each class
const averageRates = data.reduce((result, { className, satisfactionRate }) => {
  satisfactionRate.forEach(({ classRate }) => {
    Object.entries(classRate).forEach(([subject, rate]) => {
      if (!result[subject]) {
        result[subject] = { subject, [className]: [rate] };
      } else {
        result[subject][className] = [...(result[subject][className] || []), rate];
      }
    });
  });
  return result;
}, {});

// Calculate average for each subject and class
const averageData = Object.values(averageRates).map(({ subject, ...rates }) => {
  const avgRates = Object.fromEntries(
    Object.entries(rates).map(([className, ratesArr]) => [className, calculateAverage(ratesArr)])
  );
  return { subject, ...avgRates };
});


// Render Radar components dynamically based on keys

  return (

    <div>
<ResponsiveContainer width="100%" height={400}  className='mt-20 mb-5'>
          
          <h1 className="text-lg font-bold ml-4 mb-2">Attendance Participants Rate</h1>
  <BarChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 20,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <XAxis dataKey="className" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="attendanceRate" fill="#8884d8" />
  </BarChart>
  </ResponsiveContainer>
  <ResponsiveContainer width="100%" height={400}  className='mt-20 mb-5'>
  <h1 className="text-lg font-bold ml-4 mb-2">Client Performance chart</h1>
{data.length>0 &&(  
<LineChart width="100%" height={400} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" type="category" tick={{ textAnchor: 'end', dy: 10 }} />
    <YAxis domain={[0, 10]} /> {/* Set a fixed upper limit for the Y-axis */}
    <Tooltip />
    <Legend />
    {/* Render lines for each class */}
    {data.map((classData, index) => (
      <Line
        key={index}
        type="monotone"
        dataKey="satisfactionRate"
        data={classData.satisfactionRate}
        name={classData.className}
        stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
        dot={{ strokeWidth: 4 }}
      />
    ))}
  </LineChart>)}
</ResponsiveContainer>
<ResponsiveContainer width="100%" height={400}  className='mt-20 mb-5'>
<h1 className="text-lg font-bold ml-4 mb-2"        >Average Satisfaction Rate for Each Class</h1>
{data.length>0 &&( 

      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={averageData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 50]} />
          {Object.keys(averageData[0]).filter(key => key !== 'subject').map((key, index) => (
  <Radar
    key={index}
    name={key} // Use the key (rate name) as the name for the Radar component
    dataKey={key} // Use the key as the dataKey for the Radar component
    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random stroke color
    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random fill color
    fillOpacity={0.6}
    data={averageData.map(item => ({
      subject: item.subject, // Include subject in the data for Tooltip display
      [key]: item[key] // Include the rate value for the current key
    }))}
  />
))}
          <Legend />
 
    </RadarChart>


)}

</ResponsiveContainer>
  </div>
  );
};

export default AttendanceRateChart;
// const attendanceByWeek = {};
// coachDetails.classes.forEach((classData) => {
//   const className = classData.className; // Assuming className is stored in 'className' field
//   classData.attendance.forEach((attendance) => {
//     const date = new Date(attendance.date.seconds * 1000); // Convert timestamp to milliseconds
//     const week = getWeekNumber(date); // Function to get the week number from a date
//     if (!attendanceByWeek[week]) {
//       attendanceByWeek[week] = {};
//     }
//     if (!attendanceByWeek[week][className]) {
//       attendanceByWeek[week][className] = 0;
//     }
//     attendanceByWeek[week][className] += attendance.participants.length;
//   });
// });


// // Format data for line chart
// const chartData = [];
// Object.keys(attendanceByWeek).forEach((week) => {
//   const weekData = { name: `Week ${week}` };
//   Object.keys(attendanceByWeek[week]).forEach((className) => {
//     weekData[className] = attendanceByWeek[week][className];
//   });
//   chartData.push(weekData);
// });