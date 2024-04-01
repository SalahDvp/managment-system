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
        attendanceRate: calculateAttendanceRateForClass(classItem.attendance,classItem),
        satisfactionRate: calculateSatisfactionRateForClass(classItem.classhistory),
      }));
      setData(newData);
    };

    const calculateAttendanceRateForClass = (attendanceData,classItem) => {
      if (!attendanceData || attendanceData.length === 0) return 0;

      const totalParticipants = attendanceData.reduce(
        (total, attendance) => total + attendance.participants.length,
        0
      );
      const totalDays = attendanceData.length;
      const averageParticipantsPerDay = totalParticipants / totalDays;
      const expectedParticipants = classItem.participants.length; // Assuming expectedParticipants per class
      const attendanceRate = (averageParticipantsPerDay / expectedParticipants) * 100;
      return attendanceRate.toFixed(2); // Return the attendance rate with 2 decimal places
    };
    const calculateSatisfactionRateForClass = (classHistoryData) => {
        if (!classHistoryData || classHistoryData.length === 0) return 0;
  
        const totalSatisfaction = classHistoryData.reduce(
          (total, classData) => total + classData.participants.reduce(
            (participantTotal, participant) => participantTotal + participant.TraineeRate, 0
          ), 0
        );
        const totalParticipants = classHistoryData.reduce(
          (total, classData) => total + classData.participants.length, 0
        );
        const averageSatisfaction = totalSatisfaction / totalParticipants;
        return averageSatisfaction.toFixed(2); // Return the average satisfaction rate with 2 decimal places
      };
    if (coachDetails && coachDetails.classes) {
      calculateAttendanceRate();
    }
  }, []);
  const attendanceByWeek = {};
  coachDetails.classes.forEach((classData) => {
    const className = classData.className; // Assuming className is stored in 'className' field
    classData.attendance.forEach((attendance) => {
      const date = new Date(attendance.date.seconds * 1000); // Convert timestamp to milliseconds
      const week = getWeekNumber(date); // Function to get the week number from a date
      if (!attendanceByWeek[week]) {
        attendanceByWeek[week] = {};
      }
      if (!attendanceByWeek[week][className]) {
        attendanceByWeek[week][className] = 0;
      }
      attendanceByWeek[week][className] += attendance.participants.length;
    });
  });

  
  // Format data for line chart
  const chartData = [];
  Object.keys(attendanceByWeek).forEach((week) => {
    const weekData = { name: `Week ${week}` };
    Object.keys(attendanceByWeek[week]).forEach((className) => {
      weekData[className] = attendanceByWeek[week][className];
    });
    chartData.push(weekData);
  });
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
  <h1 className="text-lg font-bold ml-4 mb-2">Attendance Participants Chart</h1>
  <LineChart
  width={800}
  height={400}
  data={chartData}
  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  {/* Render lines for each class */}
  {Object.keys(chartData[0]).map((key, index) => {
    if (key !== 'name') {
      return <Line key={index} type="monotone" dataKey={key} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />;
    }
    return null;
  })}
</LineChart>
</ResponsiveContainer>
<ResponsiveContainer width="100%" height={400}  className='mt-20 mb-5'>
<h1 className="text-lg font-bold ml-4 mb-2"        >Average Satisfaction Rate for Each Class</h1>
      <RadarChart
        width={600}
        height={400}
        data={data}
        outerRadius={150}
        style={{ background: '#ffffff' }}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="className" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Average Satisfaction Rate" dataKey="satisfactionRate" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>



</ResponsiveContainer>
  </div>
  );
};

export default AttendanceRateChart;
