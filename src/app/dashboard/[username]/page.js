// app/dashboard/[username]/page.js
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DashboardCardwrapper from "@/components/DashboardCardwrapper";
import LocationWrapper from "@/components/LocationWrapper";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const DashboardPage = () => {
  const [selectedLocationType, setSelectedLocationType] = useState("country");
  const [isInstagramLinked, setIsInstagramLinked] = useState(true); // default true to avoid flash
  const pathname = usePathname();
  const username = pathname.split("/").pop();

  // React Query to fetch analytics
  const {
    data: analytics = {
      totalVisitors: 0,
      totalAvgTimeSpent: 0,
      topCountries: [],
      topStates: [],
      topCities: [],
    },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["analytics", username],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?username=${username}`);
      if (!res.ok) {
        throw new Error("Failed to fetch analytics");
      }
      return res.json();
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  // Instagram connection check
  useEffect(() => {
    const checkInstagramConnection = async () => {
      try {
        const response = await fetch("/api/auth/check-instagram-connection");
        const data = await response.json();
        setIsInstagramLinked(data.connected);
      } catch (error) {
        console.error("Error checking Instagram connection:", error);
        setIsInstagramLinked(false);
      }
    };

    if (username) {
      checkInstagramConnection();
    }
  }, [username]);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/instagram");
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to get Instagram login URL");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while trying to log in.");
    }
  };

  const getTopLocations = () => {
    switch (selectedLocationType) {
      case "state":
        return analytics.topStates || [];
      case "city":
        return analytics.topCities || [];
      default:
        return analytics.topCountries || [];
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-smoke flex justify-center items-center font-qimano text-3xl text-electric-blue">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen bg-smoke flex justify-center items-center font-qimano text-3xl text-red-500">
        Failed to load analytics.
      </div>
    );
  }

  return (
    <div className="mt-2 relative flex flex-col p-3">
      {/* Top Analytics Cards */}
      <div className="mb-[500px] flex gap-3">
        <DashboardCardwrapper
          count={analytics.totalVisitors}
          label={"Profile Visits"}
        />
        <DashboardCardwrapper count={0} label={"Request Received"} />
        <DashboardCardwrapper
          count={Number(analytics?.totalAvgTimeSpent)?.toFixed(1) || "0.0"}
          label={"Avg Time Spent (Mins)"}
          className="flex-auto"
        />
      </div>

      {/* Location Analytics */}
      <div className="absolute top-[38%] w-full">
        <LocationWrapper
          topLocations={getTopLocations()}
          setSelectedLocationType={setSelectedLocationType}
          selectedLocationType={selectedLocationType}
        />

        {/* Creator Circle Section */}
        <div className="mt-4 w-[98%] mr-5 mx-auto bg-white rounded-xl shadow relative font-qimano overflow-hidden px-6 py-12">
          <div
            className="absolute top-3 -left-14 w-96 z-30"
            style={{ transform: "rotate(-25deg)" }}
          >
            <div className="bg-[#e7e300] text-black text-center text-2xl py-4 shadow-md">
              Coming Soon!
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-10">
            {/* Left Text */}
            <div className="md:w-[50%] w-full text-center">
              <h2 className="text-3xl text-gray-800">Explore the Creator Circle</h2>
              <p className="mt-4 text-base text-center font-apfel-grotezk-regular text-gray-700 leading-relaxed">
                Get inspired by fellow influencers on the platform. Browse profiles,
                see how they’re showcasing themselves, and discover fresh ways to shine.
              </p>
            </div>

            {/* Right Images */}
            <div className="flex justify-center items-end relative bottom-8">
              <div className="w-32 h-40 rounded-xl overflow-hidden shadow-md z-10 translate-y-4 -mr-4">
                <Image
                  src="/assets/images/dashboard/influencer1.svg"
                  alt="Influencer 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-32 h-44 rounded-xl overflow-hidden shadow-xl z-20 relative">
                <Image
                  src="/assets/images/dashboard/influencer2.svg"
                  alt="Influencer 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-32 h-40 rounded-xl overflow-hidden shadow-md z-10 translate-y-4 -ml-4">
                <Image
                  src="/assets/images/dashboard/influencer3.svg"
                  alt="Influencer 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay if Instagram not connected */}
      {!isInstagramLinked && (
        <div
          className="absolute inset-0 z-50 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-6"
          style={{ height: "680px" }}
        >
          <h2 className="text-3xl md:text-4xl text-[#e7e300] font-qimano mb-4">
            Dashboard Inactive
          </h2>
          <p className="text-white mb-6 max-w-lg font-apfel-grotezk-regular">
            Complete your Press Kit by adding your work and their details to activate the dashboard
          </p>
          <button
            onClick={handleLogin}
            className="bg-[#e7e300] text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-all duration-200 flex items-center gap-2"
          >
            Get Started / Complete Press Kit
            <span className="text-xl">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
// // {
// //     "totalVisitors": 100,
// //     "topCountries": [
// //       { "location": "India", "percentage": "60.00" },
// //       { "location": "US", "percentage": "25.00" },
// //       { "location": "UK", "percentage": "10.00" }
// //     ],
// //     "topStates": [
// //       { "location": "Delhi", "percentage": "40.00" },
// //       { "location": "California", "percentage": "35.00" },
// //       { "location": "Maharashtra", "percentage": "15.00" }
// //     ],
// //     "topCities": [
// //       { "location": "Mumbai", "percentage": "30.00" },
// //       { "location": "San Francisco", "percentage": "25.00" },
// //       { "location": "New Delhi", "percentage": "20.00" }
// //     ],
// //     "totalAvgTimeSpent": "4.32"
// //   }

