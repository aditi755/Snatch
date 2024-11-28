"use client"
import React from 'react'
import { useState } from "react";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("portfolio");

    const menuItems = ["portfolio", "about", "audience"];

  return (
<div className="flex justify-center items-center h-screen bg-white relative ">

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

  <button className="w-[230px] h-[47px] mt-5 bg-electric-blue text-white border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
           Login to Instgarm
          </button>
</div>



  )
}

export default Profile