// pages/index.js
'use client'
import { Eye } from 'lucide-react';
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
const ManageSalaryPage = () => {
  // Dummy data, replace with actual data fetched from API or database
  const initialEmployees = [
    { id: 1, name: 'John Doe', payrollType: 'Monthly', salary: '₺5000', netSalary: '₺4000',hourlyPayment: '₺10' },
    { id: 2, name: 'Jane Smith', payrollType: 'Monthly', salary: '₺5500', netSalary: '₺4400' ,hourlyPayment: '₺10'},
    { id: 3, name: 'Alice Johnson', payrollType: 'Bi-weekly', salary: '₺4000', netSalary: '₺3200' ,hourlyPayment: '₺10'},
    { id: 4, name: 'Michael Brown', payrollType: 'Monthly', salary: '₺6000', netSalary: '₺4800' ,hourlyPayment: '₺10'},
    { id: 5, name: 'Emily Davis', payrollType: 'Weekly', salary: '₺4500', netSalary: '₺3600' ,hourlyPayment: '₺10'},
    { id: 6, name: 'Robert Wilson', payrollType: 'Monthly', salary: '₺7000', netSalary: '₺5600' ,hourlyPayment: '₺10'},
    { id: 7, name: 'Olivia Taylor', payrollType: 'Monthly', salary: '₺4800', netSalary: '₺3840',hourlyPayment: '₺10' },
    { id: 8, name: 'Daniel Martinez', payrollType: 'Bi-weekly', salary: '₺5200', netSalary: '₺4160' ,hourlyPayment: '₺10'},
    { id: 9, name: 'Sophia Garcia', payrollType: 'Monthly', salary: '₺5800', netSalary: '₺4640' ,hourlyPayment: '₺10'},
    { id: 10, name: 'Matthew Lopez', payrollType: 'Weekly', salary: '₺4200', netSalary: '₺3360' ,hourlyPayment: '₺10'},
    { id: 11, name: 'Isabella Rodriguez', payrollType: 'Monthly', salary: '₺6500', netSalary: '₺5200' ,hourlyPayment: '₺10'},
    { id: 12, name: 'James Wilson', payrollType: 'Bi-weekly', salary: '₺4800', netSalary: '₺3840' ,hourlyPayment: '₺10'},
    { id: 13, name: 'Benjamin Lee', payrollType: 'Monthly', salary: '₺7200', netSalary: '₺5760' ,hourlyPayment: '₺10'},
    { id: 14, name: 'Charlotte Young', payrollType: 'Monthly', salary: '₺4900', netSalary: '₺3920' ,hourlyPayment: '₺10'},
    { id: 15, name: 'William Clark', payrollType: 'Weekly', salary: '₺4300', netSalary: '₺3440',hourlyPayment: '₺10' },
    { id: 16, name: 'Ava Hernandez', payrollType: 'Monthly', salary: '₺6700', netSalary: '₺5360' ,hourlyPayment: '₺10'},
    { id: 17, name: 'Alexander King', payrollType: 'Bi-weekly', salary: '₺5000', netSalary: '₺4000' ,hourlyPayment: '₺10'},
    { id: 18, name: 'Mia Adams', payrollType: 'Monthly', salary: '₺5300', netSalary: '₺4240' ,hourlyPayment: '₺10'},
    { id: 19, name: 'Ethan White', payrollType: 'Monthly', salary: '₺7100', netSalary: '₺5680' ,hourlyPayment: '₺10'},
    { id: 20, name: 'Emma Martinez', payrollType: 'Bi-weekly', salary: '₺4900', netSalary: '₺3920' ,hourlyPayment: '₺10'},
    // Add more dummy data as needed
  ];
   
 

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleEyeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handlePayClick = () => {
    // Perform payment logic here
    alert(`Payment for ${selectedEmployee.name} has been processed successfully!`);
    // You can implement your payment logic here, such as sending a request to a payment gateway or updating the database
  };

  const handleDownloadCoachesTable = () => {
    const wb = XLSX.utils.book_new();
    // Table data for coaches
    const coachesData = employees.map(({ id, name, payrollType, salary, netSalary, hourlyPayment }) => ({
      id,
      name,
      payrollType,
      salary,
      netSalary,
      hourlyPayment
    }));

    // Add coaches data to the worksheet
    const ws = XLSX.utils.json_to_sheet(coachesData);
    XLSX.utils.book_append_sheet(wb, ws, 'Coaches');

    // Save the Excel file
    XLSX.writeFile(wb, 'coaches_table.xlsx');
  };





  const handleDownloadDetailsExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
  
    // Employee Details
    const employeeDetails = [
      ['Field', 'Value'],
      ['Name', selectedEmployee.name],
      ['Employee ID', selectedEmployee.id],
      ['Employee Salary', selectedEmployee.salary],
      ['Payslip Type', 'Monthly Payslip'],
      ['Account Type', 'Regular']
    ];
  
    // Commission Details
    const commissionData = [
      ['Title', 'Type', 'Amount'],
      ['Performance-based', 'Percentage', '10% (₺5.00)'],
      ['Recruitment', 'Fixed', '₺7.00']
    ];
  
    // Overtime Details
    const overtimeData = [
      ['Overtime Title', 'Number of days', 'Hours', 'Rate'],
      ['Last week', '10', '10', '₺6.00'],
      ['This month', '70', '78', '₺11.00']
    ];
  
    // Add each section of details to a separate sheet in the workbook
    const wsEmployeeDetails = XLSX.utils.aoa_to_sheet(employeeDetails);
    const wsCommissionDetails = XLSX.utils.aoa_to_sheet(commissionData);
    const wsOvertimeDetails = XLSX.utils.aoa_to_sheet(overtimeData);
  
    // Apply styling to tables
    wsEmployeeDetails['!cols'] = [{ width: 100 }, { width: 200 }];
    wsCommissionDetails['!cols'] = [{ width: 150 }, { width: 100 }, { width: 100 }];
    wsOvertimeDetails['!cols'] = [{ width: 150 }, { width: 100 }, { width: 100 }, { width: 100 }];
  
    // Append sheets to the workbook
    XLSX.utils.book_append_sheet(wb, wsEmployeeDetails, 'Employee Details');
    XLSX.utils.book_append_sheet(wb, wsCommissionDetails, 'Commission Details');
    XLSX.utils.book_append_sheet(wb, wsOvertimeDetails, 'Overtime Details');
  
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `${selectedEmployee.name}_details.xlsx`);
  };
  

  const [employees, setEmployees] = useState(initialEmployees);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Function to handle downloading attendance records for a specific coach
  const handleDownloadAttendance = async (employee) => {
    try {
      // Fetch attendance data for each month
      const wb = XLSX.utils.book_new();
      const trainerRef = doc(db, 'Trainers', employee.id); // Assuming employee ID is the same as trainer ID
      const startDate = new Date();
      startDate.setDate(1); // Start of current month
      const endDate = new Date();
      const dates = [];
      for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
        dates.push(date.toISOString().slice(0, 7)); // Format: YYYY-MM
      }

      for (const date of dates) {
        const attendanceData = await fetchAttendanceData(trainerRef, date);
        if (attendanceData) {
          const ws = XLSX.utils.json_to_sheet([{ Month: date, ...attendanceData }]);
          XLSX.utils.book_append_sheet(wb, ws, date);
        }
      }

      // Save the Excel file
      XLSX.writeFile(wb, `${employee.name}_attendance.xlsx`);
    } catch (error) {
      console.error('Error downloading attendance:', error);
    }
  };
  const [selectedOvertime, setSelectedOvertime] = useState({
    title: '',
    numberOfDays: '',
    hours: '',
    rate: ''
  });
  return (
    <div className="flex flex-col items-start w-full h-screen overflow-y-scroll p-5 bg-white" >
      <h1 className="text-3xl font-bold mb-5">Manage Coaches Salary</h1>
      <button
        onClick={handleDownloadCoachesTable}
        className="absolute right-0 m-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded "
      >
        Download Table
      </button>
      <div className="overflow-x-auto w-full border">
      
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Id
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payroll Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Salary
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map(employee => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">{employee.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.payrollType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.salary}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.netSalary}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleEyeClick(employee)}>
                    <Eye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDetails && selectedEmployee && (
  <div className="fixed inset-0 flex bg-indigo-600 bg-opacity-50 justify-end items-center overflow-auto h-auto " style={{ height: '100%' }}>
    <div className="w-11/12 h-auto bg-white border rounded-t flex flex-col justify-start items-start bg-white" style={{ height: '100%' }}>
      <div className='flex bg-white h-auto'>
        <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Employee Details</h2>
        <div className='ml-72 h-full' />
        <div className="mt-4" >
          <strong className='ml-2 mt-4 mb-6'>Employee ID</strong>
          <input className="rounded-lg ml-5" type="text" readOnly value={selectedEmployee.id} />
        </div>
      </div>
      <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
        <div className="ml-4 grid grid-cols-4 gap-4">
          <div>
            <strong>Name</strong> <br />
            <input className="rounded-lg" type="text" value={selectedEmployee.name} onChange={(e) => {
              const updatedEmployee = { ...selectedEmployee, name: e.target.value };
              setSelectedEmployee(updatedEmployee);
            }} />
          </div>
          <div>
            <strong>Employee Salary</strong> <br />
            <input className="rounded-lg" type="text" value={selectedEmployee.salary} onChange={(e) => {
              const updatedEmployee = { ...selectedEmployee, salary: e.target.value };
              setSelectedEmployee(updatedEmployee);
            }} />
          </div>
          <div>
            <strong>Hourly Payment</strong> <br />
            <input className="rounded-lg" type="text" value={selectedEmployee?.hourlyPayment} onChange={(e) => {
              const updatedEmployee = { ...selectedEmployee, hourlyPayment: e.target.value };
              setSelectedEmployee(updatedEmployee);
            }} />
          </div>
          <div>
            <strong>Payslip Type</strong> <br />
            <input className="rounded-lg" type="text" readOnly value="Monthly Payslip" />
          </div>
          <div>
            <strong>Account Type</strong> <br />
            <input className="rounded-lg" type="text" readOnly value="Regular" />
          </div>
        </div>
      </div>
      <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
        <h3 className="text-lg font-bold mb-4">Commission</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    className="rounded-lg"
                    type="text"
                    value={selectedCommission.title}
                    onChange={(e) => {
                      const updatedCommission = { ...selectedCommission, title: e.target.value };
                      setSelectedCommission(updatedCommission);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    className="rounded-lg"
                    type="text"
                    value={selectedCommission.type}
                    onChange={(e) => {
                      const updatedCommission = { ...selectedCommission, type: e.target.value };
                      setSelectedCommission(updatedCommission);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    className="rounded-lg"
                    type="text"
                    value={selectedCommission.amount}
                    onChange={(e) => {
                      const updatedCommission = { ...selectedCommission, amount: e.target.value };
                      setSelectedCommission(updatedCommission);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Action button */}
                </td>
              </tr>
              {/* Add more rows for additional commissions */}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 h-4/5 h-11/12" style={{ width: 'calc(100% - 24px)' }}>
        <h3 className="text-lg font-bold mb-4">Overtime</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overtime Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number of days
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    className="rounded-lg"
                    type="text"
                    value={selectedOvertime.title}
                    onChange={(e) => {
                      const updatedOvertime = { ...selectedOvertime, title: e.target.value };
                      setSelectedOvertime(updatedOvertime);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    className="rounded-lg"
                    type="text"
                    value={selectedOvertime.numberOfDays}
                    onChange={(e) => {
                      const updatedOvertime = { ...selectedOvertime, numberOfDays: e.target.value };
                      setSelectedOvertime(updatedOvertime);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    className="rounded-lg"
                    type="text"
                    value={selectedOvertime.hours}
                    onChange={(e) => {
                      const updatedOvertime = { ...selectedOvertime, hours: e.target.value };
                      setSelectedOvertime(updatedOvertime);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    className="rounded-lg"
                    type="text"
                    value={selectedOvertime.rate}
                    onChange={(e) => {
                      const updatedOvertime = { ...selectedOvertime, rate: e.target.value };
                      setSelectedOvertime(updatedOvertime);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Action button */}
                </td>
              </tr>
              {/* Add more rows for additional overtime entries */}
            </tbody>
          </table>
        </div>
      </div>
      <div className='bg-white w-full '>
        <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 bg-white " style={{ width: 'calc(100% - 24px)' }}>
          <h3 className="text-lg font-bold mb-4">Other Payment</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              {/* Table content for other payments */}
            </table>
          </div>
        </div>
      </div>
      <div className='bg-white w-full'>
        <div className='bg-white w-full'>
          <button className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10">Edit</button>
          <button className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10">Submit</button>
          <button onClick={handlePayClick} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-4 ml-4">Pay</button>
          <button onClick={handleDownloadDetailsExcel} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Download Excel</button>
          <button onClick={handleDownloadAttendance} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Download Attendance</button>
        </div>
      </div>
      <button onClick={toggleDetails} className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 focus:outline-none">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}




      {employees.map(employee => (
        <div key={employee.id}>
          {/* Coach card */}
         
        </div>
      ))}
    </div>
  );
};

export default ManageSalaryPage;