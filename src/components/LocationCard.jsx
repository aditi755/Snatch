"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const LocationCard = ({
  topLocations,
  selectedLocationType,
  setSelectedLocationType,
}) => {
  const [filteredLocations, setFilteredLocations] = useState([]);

  // Update location data based on selected filter
  useEffect(() => {
    const getFilteredData = () => {
      const filteredData = topLocations?.slice(0, 3) || [];
      setFilteredLocations(filteredData);
    };

    getFilteredData();
  }, [selectedLocationType, topLocations]);

  return (
    <div className="w-[57.5vw] h-[27vh] bg-white rounded-md flex justify-between px-2 space-x-1 font-qimano">
      {/* Left Section */}
      <div className="flex flex-row w-[50%] h-[90%] mt-2 ml-3">
        <div className="flex flex-col justify-center items-center mx-auto">
          <Image
            className="mb-5"
            width={36}
            height={20}
            src="/assets/icons/dashboard/email.svg"
            alt="email"
          />
          <p className="text-2xl">Top 3 Locations</p>
          <div className="flex gap-5 mt-3">
            {["country", "state", "city"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedLocationType(filter)}
                className={`w-[72px] h-[37px] ${
                  selectedLocationType === filter
                    ? "bg-electric-blue text-white"
                    : "bg-light-grey text-graphite"
                } border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

{/* Right Section - Dynamic Location Data */}
<div className="flex flex-col w-[50%] h-[80%] mt-2 ml-3 p-4 ">
  {filteredLocations.length > 0 ? (
    filteredLocations.map((item, index) => (
      <div
        key={item.id || index}
        className={`flex flex-row w-[96%] h-[48px] text-[20px] items-center  ${
          index !== filteredLocations.length - 1 ? 'border-b border-gray-200' : ''
        }`}
      >
        {/* ID and Location Together */}
        <div className="flex items-center w-[70%]">
          <span className="text-gray-500 font-medium mr-2">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-graphite font-qimano ">{item.location || 'N/A'}</span>
        </div>
        {/* Percentage on the right */}
        <span className="text-blue-600 w-[50px] text-right font-medium">{item.percentage+"%" || '0%'}</span>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500">No location data available</p>
  )}
</div>

    </div>
  );
};

export default LocationCard;
