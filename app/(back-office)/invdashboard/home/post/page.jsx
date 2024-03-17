'use client'



import Chart from 'chart.js/auto';

import React from 'react';
import { Bar } from 'react-chartjs-2';

const Dashboard = () => {
  // Data for the chart
  const chartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{
      label: 'Data',
      data: [10, 20, 30, 25, 15, 10, 5], // Sample data
      backgroundColor: '#3182CE', // Bar color
    }]
  };

  // Options for the chart
  const chartOptions = {
    indexAxis: 'x', // Rotate chart to horizontal
    plugins: {
      legend: {
        display: false // Hide legend
      }
    }
  };

  return (
    <div className="container mx-auto bg-white h-full">
      <div className="h-full flex flex-col relative">
        <h2 className="text-3xl font-bold mb-10 ml-2">Dashboard</h2>
        <div className="mb-4 ml-4" style={{ height: '340px', width: '100%' }}>
          {/* Render the chart */}
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
