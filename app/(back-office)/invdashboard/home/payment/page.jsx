// pages/index.js
'use client'
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

const ManageSalaryPage = () => {
  const [employees, setEmployees] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedOvertime, setSelectedOvertime] = useState({ title: '', numberOfDays: '', hours: '', rate: '' });
  const [selectedCommission, setSelectedCommission] = useState({ title: '', type: '', amount: '' });
  const [selectedOtherPayment, setSelectedOtherPayment] = useState({ title: '', type: '', amount: '' });

  useEffect(() => {
    // Fetch employees data from API or database
    // Dummy data for demonstration
    const initialEmployees = [
      {
        id: 1,
        name: 'John Doe',
        payrollType: 'Monthly',
        salary: '',
        netSalary: '₺4000',
        hourlyPayment: 10,
        weeklyworkingdays: 6,
        workinghours: '',
        extrahours: '',
        commission: [],
        overtime: [],
        otherPayments: [],
      },
      // Add more dummy data as needed
    ];
    setEmployees(initialEmployees);
  }, []);

  // Function to calculate the total salary based on employee data
  const calculateSalary = (employee) => {
    const workingDaysPerMonth = employee.weeklyworkingdays * 4;
    const baseSalary = employee.hourlyPayment * employee.workinghours * workingDaysPerMonth;
    const overtimePay = employee.overtime.reduce((total, overtime) => total + overtime.hours * overtime.rate, 0);
    const commissionPay = employee.commission.reduce((total, commission) => total + commission.amount, 0);
    const otherPayments = employee.otherPayments.reduce((total, payment) => total + payment.amount, 0);
    const totalSalary = baseSalary + overtimePay + commissionPay + otherPayments;
    return totalSalary;
  };

  // Function to handle editing commissions
  const handleEditCommission = (index, field, value) => {
    const updatedCommissions = [...selectedEmployee.commission];
    updatedCommissions[index][field] = value;
    const updatedEmployee = { ...selectedEmployee, commission: updatedCommissions };
    setSelectedEmployee(updatedEmployee);
  };

  // Function to handle editing overtime
  const handleEditOvertime = (index, field, value) => {
    const updatedOvertime = [...selectedEmployee.overtime];
    updatedOvertime[index][field] = value;
    const updatedEmployee = { ...selectedEmployee, overtime: updatedOvertime };
    setSelectedEmployee(updatedEmployee);
  };

  // Function to handle editing other payments
  const handleEditOtherPayment = (index, field, value) => {
    const updatedOtherPayments = [...selectedEmployee.otherPayments];
    updatedOtherPayments[index][field] = value;
    const updatedEmployee = { ...selectedEmployee, otherPayments: updatedOtherPayments };
    setSelectedEmployee(updatedEmployee);
  };

  // Function to handle submission of changes
  const handleSubmitChanges = () => {
    // Calculate the updated salary
    const updatedSalary = calculateSalary(selectedEmployee);
    // Update the salary field in the selected employee
    const updatedEmployee = { ...selectedEmployee, salary: updatedSalary };
    // Update the employee in the state
    const updatedEmployees = employees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp));
    setEmployees(updatedEmployees);
    // Close the details modal
    setShowDetails(false);
  };


  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleEyeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handlePayClick = () => {
    alert(`Payment for ${selectedEmployee.name} has been processed successfully!`);
    // Implement your payment logic here
  };

  const handleAddOtherPayment = () => {
    // Add functionality for adding other payments
  };

  const handleDownloadCoachesTable = () => {
    const wb = XLSX.utils.book_new();
    const coachesData = employees.map(({ id, name, payrollType, salary, netSalary, hourlyPayment, weeklyworkingdays, workinghours }) => ({
      id,
      name,
      payrollType,
      salary,
      netSalary,
      hourlyPayment,
      weeklyworkingdays,
      workinghours,
    }));
    const ws = XLSX.utils.json_to_sheet(coachesData);
    XLSX.utils.book_append_sheet(wb, ws, 'Coaches');
    XLSX.writeFile(wb, 'coaches_table.xlsx');
  };

  const handleDownloadDetailsExcel = () => {
    const wb = XLSX.utils.book_new();
    const employeeDetails = [
      ['Field', 'Value'],
      ['Name', selectedEmployee.name],
      ['Employee ID', selectedEmployee.id],
      ['Employee Salary', selectedEmployee.salary],
      ['Payslip Type', 'Monthly Payslip'],
      ['Account Type', 'Regular']
    ];
    const wsEmployeeDetails = XLSX.utils.aoa_to_sheet(employeeDetails);
    XLSX.utils.book_append_sheet(wb, wsEmployeeDetails, 'Employee Details');
    XLSX.writeFile(wb, `${selectedEmployee.name}_details.xlsx`);
  };

  const handleDownloadAttendance = async (employee) => {
    try {
      const wb = XLSX.utils.book_new();
      // Fetch attendance data for each month
      // Assume fetchAttendanceData and doc functions are implemented
      const trainerRef = doc(db, 'Trainers', employee.id);
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();
      const dates = [];
      for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
        dates.push(date.toISOString().slice(0, 7));
      }
      for (const date of dates) {
        const attendanceData = await fetchAttendanceData(trainerRef, date);
        if (attendanceData) {
          const ws = XLSX.utils.json_to_sheet([{ Month: date, ...attendanceData }]);
          XLSX.utils.book_append_sheet(wb, ws, date);
        }
      }
      XLSX.writeFile(wb, `${employee.name}_attendance.xlsx`);
    } catch (error) {
      console.error('Error downloading attendance:', error);
    }

     };
  return (
    <div className="flex flex-col items-start w-full h-screen overflow-y-scroll p-5 bg-white">
      <h1 className="text-3xl font-bold mb-5">Manage Coaches Salary</h1>
      <button
        onClick={handleDownloadCoachesTable}
        className="absolute right-0 m-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
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
                  <strong>Hourly Payment</strong> <br />
                  <input className="rounded-lg" type="text" value={selectedEmployee.hourlyPayment} onChange={(e) => {
                    const updatedEmployee = { ...selectedEmployee, hourlyPayment: e.target.value };
                    setSelectedEmployee(updatedEmployee);
                  }} />
                </div>
                <div>
                  <strong>Working Hours</strong> <br />
                  <input className="rounded-lg" type="text" value={selectedEmployee.workinghours} onChange={(e) => {
                    const updatedEmployee = { ...selectedEmployee, workinghours: e.target.value };
                    setSelectedEmployee(updatedEmployee);
                  }} />
                </div>
                <div>
                  <strong>Working Days per week</strong> <br />
                  <input className="rounded-lg" type="text" value={selectedEmployee.weeklyworkingdays} onChange={(e) => {
                    const updatedEmployee = { ...selectedEmployee, weeklyworkingdays: e.target.value };
                    setSelectedEmployee(updatedEmployee);
                  }} />
                </div>
                <div>
                  <strong>Employee Salary</strong> <br />
                  <input className="rounded-lg" type="text" value={(selectedEmployee.weeklyworkingdays * selectedEmployee.workinghours * selectedEmployee.hourlyPayment * 4) + (selectedEmployee.extrahours * selectedEmployee.workinghours)} onChange={(e) => {
                    const updatedEmployee = { ...selectedEmployee, salary: e.target.value };
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
            {/* Commission section */}
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
                          type="number"
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
            {/* Overtime section */}
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
                          type="number"
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
                          value={selectedEmployee.extrahours}
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
                          value={selectedEmployee.workinghours}
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
            {/* Other Payment section */}
            <div className='bg-white w-full '>
              <div className='bg-white w-full'>
                <div className="p-6 mt-4 border rounded-lg ml-4 mr-4 mb-8 bg-white " style={{ width: 'calc(100% - 24px)' }}>
                  <h3 className="text-lg font-bold mb-4">Other Payment</h3>
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
                              value={selectedOtherPayment.title}
                              onChange={(e) => {
                                const updatedOtherPayment = { ...selectedOtherPayment, title: e.target.value };
                                setSelectedOtherPayment(updatedOtherPayment);
                              }}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              className="rounded-lg"
                              type="number"
                              value={selectedOtherPayment.type}
                              onChange={(e) => {
                                const updatedOtherPayment = { ...selectedOtherPayment, type: e.target.value };
                                setSelectedOtherPayment(updatedOtherPayment);
                              }}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              className="rounded-lg"
                              type="text"
                              value={selectedOtherPayment.amount}
                              onChange={(e) => {
                                const updatedOtherPayment = { ...selectedOtherPayment, amount: e.target.value };
                                setSelectedOtherPayment(updatedOtherPayment);
                              }}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={handleAddOtherPayment}
                            >
                              +
                            </button>
                          </td>
                        </tr>
                        {/* Add more rows for additional other payments */}
                      </tbody>
                    </table>
                  </div>
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
