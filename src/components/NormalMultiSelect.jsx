
"use client";
import React, { useState, useEffect, useRef } from "react";

const NormalMultiSelect = ({ label, options, selectedValues, onAddValue, onRemoveValue }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Label */}
      <label htmlFor={label} className="block text-md font-medium text-graphite mb-2 ">
        {label}
      </label>

      {/* Input container */}
      <div
        className="relative z-20 w-full bg-transparent border border-gray-300 p-[2px] pr-8 text-graphite outline-none transition focus:border-primary active:border-primary cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex flex-wrap items-center gap-2 min-h-[40px] " style={{ padding: "0px" }}>
          {/* Display selected values here it was -z-50  made it to z-20 to make cross clickable and remove work*/}
          { Array.isArray(selectedValues) &&
            selectedValues.map((value, index) => (
              <span
                key={`${label}-${index}`}
                className="m-[5px] flex items-center justify-center border-[.5px] border-stroke bg-[#0037EB] bg-opacity-10 py-[7px] px-[20px] text-sm font-medium text-graphite relative z-20 rounded-md"
              >
                {value}
                <span
                  className="cursor-pointer z-20 pl-2 text-gray-500 hover:text-gray-700 absolute right-[5px] top-1/2 transform -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from toggling the dropdown
                    onRemoveValue(value); // Call the remove handler
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
        <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-[#E9E9E9] py-2 h-44 overflow-y-scroll ">
          {options.map((option, idx) => (
            <li
              key={idx}
              className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer flex items-center gap-2"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NormalMultiSelect;