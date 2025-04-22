//app/dashboard/[username]/page.js
"use client";

import { useEffect, useState } from "react";
import DashboardCardwrapper from "@/components/DashboardCardwrapper";
import LocationWrapper from "@/components/LocationWrapper";
import { usePathname } from "next/navigation";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    totalAvgTimeSpent: 0,
    topCountries: [],
    topStates: [],
    topCities: [],
  });

  const [selectedLocationType, setSelectedLocationType] = useState("country");
  const pathname = usePathname();
  const username = pathname.split("/").pop();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetch(`/api/analytics?username=${username}`);
        const data = await response.json();
        
        // Minimum delay to ensure smooth transition
        //await new Promise(resolve => setTimeout(resolve, 1500));
        
        setAnalytics(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setIsLoading(false);
      }
    };

    if (username) {
      loadDashboardData();
    }
  }, [username]);

  if (isLoading) {
    return <div className="h-screen bg-smoke flex justify-center items-center font-qimano text-3xl text-electric-blue">Loading...</div>;
  }

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

  return (
    <div className="relative flex flex-col p-3">
      {/* Top Analytics Cards */}
      <div className="mb-[500px] flex gap-3">
        <DashboardCardwrapper
          count={analytics.totalVisitors}
          label={"Profile Visits"}
        />
        <DashboardCardwrapper count={8} label={"Request Received"} />
        <DashboardCardwrapper
          count={Number(analytics?.totalAvgTimeSpent)?.toFixed(1) || "0.0"}
          label={"Avg Time Spent (Mins)"}
          className="flex-auto"
        />
      </div>

      {/* Location Analytics */}
      <div className="absolute top-[23%] flex-auto">
        <LocationWrapper
          topLocations={getTopLocations()}
          setSelectedLocationType={setSelectedLocationType}
          selectedLocationType={selectedLocationType}
        />

        {/* Influencer Info Section */}
        <div className="absolute top-[110%] font-qimano flex-auto">
          <div className="w-[58vw] h-[47vh] bg-gray-300 rounded-xl">
            <div className="flex gap-4">
              <div className="max-w-[50%] h-[300px] flex flex-col">
                <p className="mx-auto mt-20 text-2xl">Explore Influencers</p>
                <p className="px-10 mt-3">
                  Influencers leverage various platforms, such as social media
                  and videos, to share content, promote products, and engage
                  with their followers.
                </p>
              </div>

              <div className="w-[45%] h-[43vh] mt-2 bg-white rounded-md">
                <p>Influencer Info</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

// {
//     "totalVisitors": 100,
//     "topCountries": [
//       { "location": "India", "percentage": "60.00" },
//       { "location": "US", "percentage": "25.00" },
//       { "location": "UK", "percentage": "10.00" }
//     ],
//     "topStates": [
//       { "location": "Delhi", "percentage": "40.00" },
//       { "location": "California", "percentage": "35.00" },
//       { "location": "Maharashtra", "percentage": "15.00" }
//     ],
//     "topCities": [
//       { "location": "Mumbai", "percentage": "30.00" },
//       { "location": "San Francisco", "percentage": "25.00" },
//       { "location": "New Delhi", "percentage": "20.00" }
//     ],
//     "totalAvgTimeSpent": "4.32"
//   }

