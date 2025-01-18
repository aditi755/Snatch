
"use client";
import React, { useState, useEffect, useRef } from "react";

const InfoNormalMultiSelect = ({ label, options, selectedValues, onAddValue, onRemoveValue }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleOptionSelect = (option) => {
    if (!selectedValues.includes(option)) {
      onAddValue(option);
    }
    setIsDropdownOpen(false);
  };

  const getTooltipText = (option) => {
    switch (option) {
      case "Sponsorships":
        return "Influencers are paid a fixed amount for each piece of content they create.";
      case "Gifting":
        return "Compensating Influencers with products or services instead of money.";
        case "Affiliate":
      return (
        <>
          Influencers promote a product or service and receive a commission<br />
           for every sale made through a unique   affiliate link they share. <br />
        </>
      );
      case "Hosted":
        return (
          <>
          Influencers are invited to events or trips, often in exchange for creating and <br /> sharing content related to the experience.
          </>)
      case "Collaboration":
        return "Influencers sometimes collaborate with brands to create a product.";
      default:
        return "";
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Label and Info Icon */}
      <div className="flex items-center mb-2">
        <label htmlFor={label} className="block text-md font-medium text-graphite">
          {label}
        </label>
      </div>

      {/* Input container */}
      <div
        className="relative z-20 w-full bg-transparent rounded-md border border-gray-300 p-[2px] pr-8 text-graphite outline-none transition focus:border-primary active:border-primary cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex flex-wrap items-center gap-2 min-h-[40px]" style={{ padding: "0px" }}>
          {Array.isArray(selectedValues) &&
            selectedValues.map((value, index) => (
              <span
                key={`${label}-${index}`}
                className="m-[5px] flex items-center justify-center border-[.5px] border-stroke bg-[#0037EB] bg-opacity-10 py-[7px] px-[20px] text-sm font-medium text-graphite relative z-20"
              >
                {value}
                <span
                  className="cursor-pointer z-20 pl-2 text-gray-500 hover:text-gray-700 absolute right-[5px] top-1/2 transform -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onRemoveValue(value); 
                  }}
                >
                  <svg
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </span>
            ))}
        </div>
        {/* Dropdown Icon */}
        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity={0.8}>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="#6B7280"
              />
            </g>
          </svg>
        </span>
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-[#E9E9E9] py-2 z-50">
          {options.map((option, idx) => (
            <li
              key={idx}
              className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer flex items-center gap-2"
              onClick={() => handleOptionSelect(option)}
            >
              <span>{option}</span>
              <div
                className="relative"
                onMouseEnter={() => setIsTooltipVisible(idx)}
                onMouseLeave={() => setIsTooltipVisible(null)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer"
                >
                  <path
                    d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5Z"
                    fill="#6B7280"
                  />
                  <path
                    d="M8 7C8.27614 7 8.5 7.22386 8.5 7.5V11C8.5 11.2761 8.27614 11.5 8 11.5C7.72386 11.5 7.5 11.2761 7.5 11V7.5C7.5 7.22386 7.72386 7 8 7Z"
                    fill="#6B7280"
                  />
                  <path
                    d="M8 5.5C8.27614 5.5 8.5 5.27614 8.5 5C8.5 4.72386 8.27614 4.5 8 4.5C7.72386 4.5 7.5 4.72386 7.5 5C7.5 5.27614 7.72386 5.5 8 5.5Z"
                    fill="#6B7280"
                  />
                </svg>
                {isTooltipVisible === idx && (
                  <div className="absolute left-full top-0 px-1 py-1 text-xs text-graphite rounded-lg whitespace-nowrap max-w-[800px] ">
                    {getTooltipText(option)}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InfoNormalMultiSelect;