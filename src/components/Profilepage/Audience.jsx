

import React, { useRef } from "react";
import PieChart from "./PieChart";
import SimpleWorldMap from "./Map";
import AgeRangeChart from "./AgeRangeChart";
import generateAudienceInsights from "@/utils/generateAudienceInsights";
import { useEffect, useState } from "react";
const Audience = () => {
  const scrollRef = useRef(null);
  const [insights, setInsights] = useState("");
  const [demographicData, setDemographicData] = useState({
    genderData: {},
    ageData: [],
    countryData: []
  });
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      // Calculate card width including gap (285px + 24px gap)
      const cardWidth = 209;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const fetchAllDemographics = async () => {
      try {
        // Fetch all demographic data
        const [genderRes, ageRes, countryRes] = await Promise.all([
          fetch('/api/profile/genderDemographics'),
          fetch('/api/profile/allDemographics'),
          fetch('/api/profile/countryDemographics')
        ]);

        const [genderData, ageData, countryData] = await Promise.all([
          genderRes.json(),
          ageRes.json(),
          countryRes.json()
        ]);

        const combinedData = {
          genderData: genderData.demographics,
          ageData: ageData.ageDistribution,
          countryData: countryData.countryDistribution
        };

        setDemographicData(combinedData);

        // Generate insights
        const generatedInsights = await generateAudienceInsights(combinedData);
        setInsights(generatedInsights);
      } catch (error) {
        console.error("Error fetching demographics:", error);
      }
    };

    fetchAllDemographics();
  }, []);


  return ( 
    <div className="relative mt-5 w-[100%]">
         {/* AI Generated Insights */}
     {insights && (
        <div className=" mx-auto">
          <div className="text-gray-700 whitespace-pre-line">
            {insights}
          </div>
        </div>
      )}

      {/* Left Scroll Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-[100px] 7xl:-translate-y-[200px] bg-gray-300 p-3 rounded-full shadow-md z-10 hover:bg-gray-400"
      >
        ◀
      </button>

      {/* Scrollable Content */}
      <div className="overflow-x-hidden mx-12 ">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-scroll snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {[
            { title: "Gender", component: <PieChart apiEndpoint={'/api/profile/genderDemographics'}/> },
            { title: "Country", component: <SimpleWorldMap apiEndpoint={'/api/profile/countryDemographics'}/> },
            { title: "Age Range", component: <AgeRangeChart apiEndpoint={'/api/profile/allDemographics'}/> },
          ].map((item, index) => (
            <div
              key={index}
              className="flex-none w-[285px] h-[500px] bg-gray-100 rounded-md flex flex-col items-center p-4 snap-start"
            >
              <h1 className="text-2xl">{item.title}</h1>
              <div className="mt-5">{item.component}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-[100px] 7xl:-translate-y-[200px] bg-gray-300 p-3 rounded-full shadow-md z-10 hover:bg-gray-400"
      >
        ▶
      </button>

    </div>
  );
};
export default Audience;
