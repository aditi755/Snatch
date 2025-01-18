
"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useFormContext } from "@/app/onboarding/context";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const menuItems = ["portfolio", "about", "audience"];
  const { userId } = useAuth();
  const { formData } = useFormContext();

  // Check if the user's Instagram account is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/auth/check-instagram-connection");
        const data = await response.json();

        if (data.connected) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error checking Instagram connection:", error);
      }
    };

    checkConnection();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/instagram");
      const data = await response.json();

      console.log("data url", data.url)

      if (data.url) {
        window.location.href = data.url; // Redirect to Instagram OAuth via fb
      } else {
        alert("Failed to get Instagram login URL");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while trying to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white relative font-qimano">
      <div className="flex absolute top-10 space-x-6">
        {menuItems.map((item) => (
          <div
            key={item}
            className={`relative cursor-pointer text-2xl ${
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

      <button
        onClick={!isConnected ? handleLogin : null}
        disabled={loading || isConnected}
        className={`w-[230px] h-[47px] mt-5 ${
          isConnected
            ? "bg-green-600 text-white cursor-not-allowed"
            : "bg-electric-blue text-white"
        } border border-light-grey rounded-md text-center font-medium ${
          !isConnected && "hover:bg-electric-blue hover:text-white"
        }`}
      >
        {loading
          ? "Redirecting..."
          : isConnected
          ? "Your account is connected"
          : "Login to Instagram"}
      </button>
    </div>
  );
};

export default Profile;

