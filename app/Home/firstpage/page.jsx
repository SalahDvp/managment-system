'use client'
import React from 'react';
import { MdSupervisedUserCircle } from "react-icons/md";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mocked data for cards and chart
const cardsData = [
  { id: 1, title: "Active Users", number: 1024, change: 5 },
  { id: 2, title: "New Registrations", number: 75, change: -2 },
];

const Image = ({ src, alt, width, height, className }) => (
  <img src={src} alt={alt} style={{ width, height, borderRadius: '50%' }} className={className} />
);
const chartData = [
  { name: "Sun", visit: 4000, click: 2400 },
  { name: "Mon", visit: 3000, click: 1398 },
  { name: "Tue", visit: 2000, click: 9800 },
  { name: "Wed", visit: 2780, click: 3908 },
  { name: "Thu", visit: 1890, click: 4800 },
  { name: "Fri", visit: 2390, click: 3800 },
  { name: "Sat", visit: 3490, click: 4300 },
];

// Card Component


// Chart Component
const ChartComponent = () => (
  <div style={{ height: '400px', backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <h2>Weekly Recap</h2>
    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="visit" stroke="#8884d8" />
        <Line type="monotone" dataKey="click" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);


// Dashboard Component
// Card Component
const Card = ({ item }) => (
  <div style={{
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    marginLeft: '20px', // Added margin
    marginRight: '20px', // Added margin
  }}>
    <MdSupervisedUserCircle size={24} />
    <div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{item.title}</div> {/* Added margin bottom */}
      <div style={{ fontSize: '24px', fontWeight: '500', marginBottom: '10px' }}>{item.number}</div> {/* Added margin bottom */}
      <div>
        <span style={{ color: item.change > 0 ? 'green' : 'red' }}>
          {item.change}%
        </span>{" "}
        {item.change > 0 ? "Increase" : "Decrease"} from last week
      </div>
    </div>
  </div>
);

// Transactions Component
const Transactions = () => {
  const containerStyle = {
    backgroundColor: 'var(--bgSoft)',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    marginLeft: '20px',
    marginRight: '20px',
    border: '1px solid #ddd',
  };

  const titleStyle = {
    marginBottom: '20px',
    fontWeight: '200',
    color: 'var(--textSoft)',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  };

  // Example transaction data
  const transactionsData = [
    { name: 'John Doe', status: 'Pending', date: '14.02.2024', amount: '$3,200' },
    { name: 'Jane Smith', status: 'Done', date: '15.02.2024', amount: '$2,500' },
    // Add more transactions as needed
  ];

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Latest Transactions</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <td style={tdStyle}>Name</td>
            <td style={tdStyle}>Status</td>
            <td style={tdStyle}>Date</td>
            <td style={tdStyle}>Amount</td>
          </tr>
        </thead>
        <tbody>
          {transactionsData.map((transaction, index) => (
            <tr key={index}>
              <td style={tdStyle}>{transaction.name}</td>
              <td style={tdStyle}>{transaction.status}</td>
              <td style={tdStyle}>{transaction.date}</td>
              <td style={tdStyle}>{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



// Dashboard Component
const Dashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#FFFFFF', padding: '20px' }}> {/* Added padding */}
      <div style={{ display: 'flex', gap: '20px', marginLeft: '-20px', marginRight: '-20px' }}> {/* Flex container for cards, adjusted margin */}
        {cardsData.map(card => (
          <Card key={card.id} item={card} />
        ))}
      </div>
      <Transactions />
      <ChartComponent />
    </div>
  );
};

export default Dashboard;
