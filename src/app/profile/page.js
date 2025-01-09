//  https://wf7s4f88-3000.inc1.devtunnels.ms/profile
"use client"
import React from 'react'
import { useState } from "react";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("portfolio");
    const [loading, setLoading] = useState(false);
    const menuItems = ["portfolio", "about", "audience"];

    const handleLogin = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/instagram');
        const data = await response.json();
  
        if (data.url) {
          window.location.href = data.url; // Redirect to Instagram OAuth
        } else {
          alert('Failed to get Instagram login URL');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to log in.');
      } finally {
        setLoading(false);
      }
    };

  return (
<div className="flex justify-center items-center h-screen bg-white relative font-qimano ">

<div className="flex absolute top-10 space-x-6 ">
      {menuItems.map((item) => (
        <div
          key={item}
          className={`relative cursor-pointer text-2xl  ${
            activeTab === item ? "text-electric-blue" : "text-black"
          }`}
          onClick={() => setActiveTab(item)}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
          <span
            className={`absolute bottom-0 left-0 w-full h-[2px] bg-electric-blue transition-all duration-300 ${
              activeTab === item ? "scale-x-100" : "scale-x-0"
            }`}
          ></span>
        </div>
      ))}
    </div>

  <h1 className="text-3xl absolute top-1/3 transform -translate-y-1/3">
    Connect with Instagram to add projects
  </h1>
  <p className="text-md absolute top-[40%] transform -translate-y-1/3 h-auto max-w-[380px] text-center leading-relaxed">
    Link your Instagram account here to add projects to
    <span className="block max-w-[300px] text-center mx-auto">
      make your portfolio and show to brands
    </span> 
  </p>

  <button onClick={handleLogin} disabled={loading} className="w-[230px] h-[47px] mt-5 bg-electric-blue text-white border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
   {loading ? 'Redirecting...' : 'Login to Instagram'}
    </button>
</div>



  )
}

export default Profile
