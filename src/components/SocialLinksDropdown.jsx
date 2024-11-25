"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const SOCIAL_OPTIONS = [
  { value: "facebook", label: "Facebook", icon: "/assets/icons/onboarding/Facebook.svg" },
  { value: "reddit", label: "Reddit", icon: "/assets/icons/onboarding/Plusicon.svg" },
  { value: "threads", label: "Threads", icon: "/assets/icons/onboarding/Plusicon.svg" },
  { value: "default", label: "Select", icon: "/assets/icons/onboarding/Plusicon.svg" }, // Default Icon
];

export default function SocialLinksDropdown({ initialData, onChange }) {
  const [selectedOption, setSelectedOption] = useState(
    initialData?.icon
      ? SOCIAL_OPTIONS.find((opt) => opt.icon === initialData.icon) || SOCIAL_OPTIONS[3]
      : SOCIAL_OPTIONS[3]
  );
  const [url, setUrl] = useState(initialData?.url || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Call onChange only when selectedOption or url explicitly changes
  useEffect(() => {
    if (onChange) {
      onChange({ icon: selectedOption.icon, url });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, url]);

  const handleIconSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="relative w-full mt-4">
      {/* Input container */}
      <div className="flex items-center gap-2 w-full">
        {/* Left-most Icon inside the input field */}
        <div className="flex items-center justify-center w-10 h-10 absolute left-2">
          <Image src={selectedOption.icon} alt={selectedOption.label} width={10} height={24} />
        </div>

        {/* URL Input */}
        <input
          type="url"
          placeholder="Enter Social Link URL"
          className="flex-1 rounded-lg border border-stroke py-[10px] pl-12 pr-14 text-graphite outline-none"
          value={url}
          onChange={handleUrlChange}
        />

        {/* Dropdown Icon (Arrow) */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 h-10 cursor-pointer"
          onClick={toggleDropdown}
        >
          <Image
            src="/assets/icons/onboarding/Dropdownarrow.svg" 
            alt="Dropdown Arrow"
            width={16}
            height={16}
          />
        </div>
      </div>

      {/* Dropdown List - Full Width of Input */}
      {isDropdownOpen && (
        <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-light-grey py-2 z-10">
          {SOCIAL_OPTIONS.map((option) => (
            <li
              key={option.value}
              className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer flex items-center gap-2"
              onClick={() => handleIconSelect(option)}
            >
              <Image src={option.icon} alt={option.label} width={10} height={24} />
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
