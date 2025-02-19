'use client';

import React from 'react';

const Accordion = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-[584px] p-2 text-left bg-white transition-colors flex justify-between items-center"
      >
        <div className="flex flex-col">
          <span className="font-medium text-xl text-electric-blue font-qimano">{title}</span>
          <span className="font-medium text-md text-gray-600">
            At least one response is mandatory
          </span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out  ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-2">{isOpen && children}</div>
      </div>
    </div>
  );
};

export default Accordion;
