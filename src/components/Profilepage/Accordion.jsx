'use client';

import React from 'react';

const Accordion = ({ title, children, isOpen, onToggle }) => {
  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-300 ease-in-out shadow-md ${
        isOpen ? 'bg-[#F9FBFF] shadow-lg' : 'bg-white shadow-md'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-[584px] px-4 py-3 text-left flex justify-between items-center transition-colors"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex flex-col p-2">
          <span className="font-medium text-xl text-electric-blue font-qimano">
            {title}
          </span>
          <span className="font-medium text-sm text-gray-600 font-apfel-grotezk-regular">
            At least one response is mandatory
          </span>
        </div>

        <span className="text-3xl font-bold text-electric-blue">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-1 pb-2 px-4">{isOpen && children}</div>
      </div>
    </div>
  );
};

export default Accordion;
