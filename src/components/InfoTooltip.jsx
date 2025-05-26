"use client";

import { useState } from 'react';

const InfoTooltip = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="ml-2 w-5 h-5 rounded-full bg-[#F5F5F5] flex items-center justify-center text-gray-500 text-sm hover:bg-gray-200"
      >
        i
      </button>
      
      {showTooltip && (
        <div className="absolute z-50 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-sm text-gray-700 -right-2 top-8">
          <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
          {text}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;