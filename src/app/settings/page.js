"use client";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
export default function Page() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
// const [finalizedImages, setFinalizedImages] = useState([]);
// const [finalizedFormData, setFinalizedFormData] = useState([]);
// const [formData, setFormData] = useState(null);
// const key = "18030304070228137";

// useEffect(() => {
//   const fetchFinalizedImages = async () => {
//     try {
//       const response = await fetch(`/api/projects/all-projects?key=${key}`);
//       const data = await response.json();

//       if (data.success) {
//         setFinalizedImages(data.finalizedImages);
//         setFinalizedFormData(data.finalizedFormData);
//       } else {
//         console.error("Error:", data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching finalized images:", error);
//     }
//   };

//   fetchFinalizedImages();
// }, []);

//   // Function to fetch form data by key
//   const fetchFormDataByKey = async (key) => {
//     try {
//       const response = await fetch(`/api/projects/all-projects?key=${key}`);
//       const data = await response.json();
//       console.log("data fin settings", data);

//       if (data.success) {
//         console.log("✅ Form Data:", data.formData);
//         return data.formData;
//       } else {
//         console.error("Error:", data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching form data:", error);
//     }
//   };

//   // Fetch data when key changes
//   useEffect(() => {
//     const getData = async () => {
//       const data = await fetchFormDataByKey(key);
//       setFormData(data);
//     };

//     if (key) getData();
//   }, [key]); // Runs when key changes


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
    <div>
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-xl font-bold">signout</h1>

      <UserButton afterSignedOutUrl="/" />

    </div>
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
}



