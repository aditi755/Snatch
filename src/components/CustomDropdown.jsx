"use client";

import { useState, useEffect } from "react";

const CustomDropdown = ({ options, placeholder, onSelect, selected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    onSelect(option); 
    setIsOpen(false); 
  };

  return (
    <div className="relative w-[369px]">
      {/* Display selected option or placeholder */}
      <div
       className={`rounded-lg border border-stroke bg-transparent py-[10px] px-5 cursor-pointer ${
        selected ? "text-graphite" : "text-gray-400"
      }`}
        onClick={toggleDropdown}
      >
        {selected || placeholder}
      </div>

      {isOpen && (
        <ul className="absolute mt-2 w-[300px] rounded-lg border border-stroke bg-[#E9E9E9] py-2 text-graphite">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;

