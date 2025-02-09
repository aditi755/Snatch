"use client";

import { useState } from "react";

const MultiSelectInput = ({ label, data, selectedValues, onAddValue, onRemoveValue }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = data.filter((item) =>
        item.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const handleAddChip = (value) => {
    const newValue = value || inputValue.trim();
    if (newValue && !selectedValues.includes(newValue)) {
      onAddValue(newValue);
      setInputValue("");
      setSuggestions([]);
    }
  };

  const handleRemoveChip = (value) => {
    onRemoveValue(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleAddChip();
    }
  };

  return (
    <div className="multi-select-input text-black">
      <label className="block mb-2 font-apfel-grotezk-regular">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300">
        {selectedValues.map((value, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 text-sm text-graphite bg-[#0037EB] bg-opacity-10 rounded-md "
          >
            <span>{value}</span>
            <button
              type="button"
              className="ml-2 text-xs text-gray-500 hover:text-gray-800"
              onClick={() => handleRemoveChip(value)}
            >
              ✕
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          className="flex-1 p-1 focus:outline-none bg-transparent text-graphite"
          placeholder="Type and press Enter"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {/* Dropdown suggestions */}
      {suggestions.length > 0 && (
        <ul className="border border-gray-300 bg-[#E9E9E9] rounded mt-2 max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:text-electric-blue"
              onClick={() => handleAddChip(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectInput;
