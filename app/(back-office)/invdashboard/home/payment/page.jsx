// pages/index.js
'use client'
import { Eye } from 'lucide-react';
import React, { useState } from 'react';

const ManageSalaryPage = () => {
  // Dummy data, replace with actual data fetched from API or database
  const initialEmployees = [
    { id: 1, name: 'John Doe', payrollType: 'Monthly', salary: '$5000', netSalary: '$4000' },
    { id: 2, name: 'Jane Smith', payrollType: 'Monthly', salary: '$5500', netSalary: '$4400' },
    { id: 3, name: 'Alice Johnson', payrollType: 'Bi-weekly', salary: '$4000', netSalary: '$3200' },
    { id: 4, name: 'Michael Brown', payrollType: 'Monthly', salary: '$6000', netSalary: '$4800' },
    { id: 5, name: 'Emily Davis', payrollType: 'Weekly', salary: '$4500', netSalary: '$3600' },
    { id: 6, name: 'Robert Wilson', payrollType: 'Monthly', salary: '$7000', netSalary: '$5600' },
    { id: 7, name: 'Olivia Taylor', payrollType: 'Monthly', salary: '$4800', netSalary: '$3840' },
    { id: 8, name: 'Daniel Martinez', payrollType: 'Bi-weekly', salary: '$5200', netSalary: '$4160' },
    { id: 9, name: 'Sophia Garcia', payrollType: 'Monthly', salary: '$5800', netSalary: '$4640' },
    { id: 10, name: 'Matthew Lopez', payrollType: 'Weekly', salary: '$4200', netSalary: '$3360' },
    { id: 11, name: 'Isabella Rodriguez', payrollType: 'Monthly', salary: '$6500', netSalary: '$5200' },
    { id: 12, name: 'James Wilson', payrollType: 'Bi-weekly', salary: '$4800', netSalary: '$3840' },
    { id: 13, name: 'Benjamin Lee', payrollType: 'Monthly', salary: '$7200', netSalary: '$5760' },
    { id: 14, name: 'Charlotte Young', payrollType: 'Monthly', salary: '$4900', netSalary: '$3920' },
    { id: 15, name: 'William Clark', payrollType: 'Weekly', salary: '$4300', netSalary: '$3440' },
    { id: 16, name: 'Ava Hernandez', payrollType: 'Monthly', salary: '$6700', netSalary: '$5360' },
    { id: 17, name: 'Alexander King', payrollType: 'Bi-weekly', salary: '$5000', netSalary: '$4000' },
    { id: 18, name: 'Mia Adams', payrollType: 'Monthly', salary: '$5300', netSalary: '$4240' },
    { id: 19, name: 'Ethan White', payrollType: 'Monthly', salary: '$7100', netSalary: '$5680' },
    { id: 20, name: 'Emma Martinez', payrollType: 'Bi-weekly', salary: '$4900', netSalary: '$3920' },
    // Add more dummy data as needed
  ];
   
  const [employees, setEmployees] = useState(initialEmployees);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleEyeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  return (
    <div className="flex flex-col items-start w-full h-screen overflow-y-scroll p-5 bg-white" >
      <h1 className="text-3xl font-bold mb-5">Manage Coaches Salary</h1>
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
        <div className="fixed inset-0 flex bg-indigo-600 bg-opacity-50 justify-end items-center overflow-auto h-auto " style={{height:'100%'}}>
          <div className="w-11/12 h-auto bg-white border rounded-t flex flex-col justify-start items-start bg-white" style={{height:'100%'}}>
            <div className='flex bg-white h-auto'>
              <h2 className="text-xl font-bold ml-4 mt-4 mb-6">Employee Details</h2>
              <div className='ml-72 h-full'/>
              <div className="mt-4" >
                <strong className='ml-2 mt-4 mb-6'>Employee ID</strong> 
                <input className="rounded-lg ml-5" type="text" readOnly value={selectedEmployee.id} />
              </div>
            </div>
                      <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }}>
            <div className="ml-4 grid grid-cols-2 gap-4">
              <div>
                <strong>Employee Salary</strong> <br />
                <input className="rounded-lg" type="text" readOnly value={selectedEmployee.salary} />
              </div>
              <div>
                <strong>Payslip Type</strong> <br />
                <input className="rounded-lg" type="text" readOnly value="Monthly Payslip" />
              </div>
              <div>
                <strong>Salary</strong> <br />
                <input className="rounded-lg" type="text" readOnly value="50" />
              </div>
              <div>
                <strong>Account Type</strong> <br />
                <input className="rounded-lg" type="text" readOnly value="Benjamin Adams" />
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
            Employee Name
          </th>
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
          <td className="px-6 py-4 whitespace-nowrap">{selectedEmployee.name}</td>
          <td className="px-6 py-4 whitespace-nowrap">Beatae voluptatibus</td>
          <td className="px-6 py-4 whitespace-nowrap">Percentage</td>
          <td className="px-6 py-4 whitespace-nowrap">10% ($5.00)</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {/* Action button */}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">{selectedEmployee.name}</td>
          <td className="px-6 py-4 whitespace-nowrap">Excepteur consectetu</td>
          <td className="px-6 py-4 whitespace-nowrap">Fixed</td>
          <td className="px-6 py-4 whitespace-nowrap">$7.00</td>
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
            Employee Name
          </th>
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
          <td className="px-6 py-4 whitespace-nowrap">{selectedEmployee.name}</td>
          <td className="px-6 py-4 whitespace-nowrap">test</td>
          <td className="px-6 py-4 whitespace-nowrap">10</td>
          <td className="px-6 py-4 whitespace-nowrap">10</td>
          <td className="px-6 py-4 whitespace-nowrap">$6.00</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {/* Action button */}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">{selectedEmployee.name}</td>
          <td className="px-6 py-4 whitespace-nowrap">Dolorem dolor rem no</td>
          <td className="px-6 py-4 whitespace-nowrap">70</td>
          <td className="px-6 py-4 whitespace-nowrap">78</td>
          <td className="px-6 py-4 whitespace-nowrap">$11.00</td>
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
<div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 bg-white " style={{ width: 'calc(100% - 24px)'   }}>
  <h3 className="text-lg font-bold mb-4">Other Payment</h3>
  <div className="overflow-x-auto">
    <table className="w-full min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Employee
          </th>
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
          <td className="px-6 py-4 whitespace-nowrap">{selectedEmployee.name}</td>
          <td className="px-6 py-4 whitespace-nowrap">Quia occaecat laboru</td>
          <td className="px-6 py-4 whitespace-nowrap">Fixed</td>
          <td className="px-6 py-4 whitespace-nowrap">$1,000.00</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {/* Action button */}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">{selectedEmployee.name}</td>
          <td className="px-6 py-4 whitespace-nowrap">Deleniti exercitatio</td>
          <td className="px-6 py-4 whitespace-nowrap">Fixed</td>
          <td className="px-6 py-4 whitespace-nowrap">$46.00</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {/* Action button */}
          </td>
        </tr>
        {/* Add more rows for additional other payments */}
      </tbody>
    </table>
  </div>
</div>

</div>
<div className='bg-white w-full'>
           <strong className="text-lg font-bold ml-4 mt-8">Note</strong>
            <div className='bg-white w-full'>
              <input className="p-2 mt-4 border shadow-lg rounded-lg ml-4 mr-4 mb-8" style={{ width: 'calc(100% - 24px)' }} type="text" readOnly value={selectedEmployee.description} />
              <button className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10">Edit</button>
              <button className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-10">Submit</button>
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
    </div>
  );
};

export default ManageSalaryPage;