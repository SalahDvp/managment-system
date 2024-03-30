'use client'
import Link from "next/link";
import React, {useEffect,useState} from "react";
export default function Login() {

 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Perform authentication logic here, for demonstration purposes, let's assume authentication is successful
      // Replace this with actual authentication logic
      if (email && password) {
        // Navigate to dashboard after successful login
        window.location.href = "/invdashboard/home/dashboard";
      } else {
        // Handle invalid credentials
        alert("Please enter valid email and password");
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <h2 className="text-3xl mb-4">Inventory Management</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
        <div>
          {/* Alternatively, you can use Link component if you prefer */}
          {/* <Link href="/invdashboard/home/dashboard">View Dashboard</Link> */}
          {/* But for programmatic navigation, using window.location is preferred */}
          <p>
            <a href="/invdashboard/home/dashboard">View Dashboard</a>
          </p>
        </div>
      </div>
    );
  }