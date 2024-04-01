'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ClassDetails = () => {
  const { id } = useParams(); // Get the class ID from URL parameters

  // Dummy data for demonstration
  const [classDetails, setClassDetails] = useState(null);

  // Simulating fetching class details using useEffect
  useEffect(() => {
    // Assuming fetchData is a function to fetch class details by ID
    const fetchData = async () => {
      // Example API endpoint: `/api/classes/:id`
      const response = await fetch(`/api/classes/${id}`);
      const data = await response.json();
      setClassDetails(data);
    };

    fetchData();
  }, [id]);

  if (!classDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Class Details for ID: {id}</h2>
      <p>Name: {classDetails.name}</p>
      <p>Description: {classDetails.description}</p>
      <p>Instructor: {classDetails.instructor}</p>
      <p>Schedule: {classDetails.schedule}</p>
      {/* Add more details about the class */}
    </div>
  );
};

export default ClassDetails;
