// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";

// const SOCIAL_OPTIONS = [
//   { value: "facebook", label: "Facebook", icon: "/assets/icons/onboarding/Facebook.svg" },
//   { value: "Youtube", label: "Reddit", icon: "/assets/icons/onboarding/Plusicon.svg" },
//   { value: "X", label: "Threads", icon: "/assets/icons/onboarding/Plusicon.svg" },
//   { value: "Linkedin", label: "Select", icon: "/assets/icons/onboarding/Plusicon.svg" }, 
// ];

// export default function SocialLinksDropdown({ initialData, onChange }) {
//   const [selectedOption, setSelectedOption] = useState(
//     initialData?.icon
//       ? SOCIAL_OPTIONS.find((opt) => opt.icon === initialData.icon) || SOCIAL_OPTIONS[3]
//       : SOCIAL_OPTIONS[3]
//   );
//   const [url, setUrl] = useState(initialData?.url || "");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Call onChange only when selectedOption or url explicitly changes
//   useEffect(() => {
//     if (onChange) {
//       onChange({ icon: selectedOption.icon, url });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedOption, url]);

//   const handleIconSelect = (option) => {
//     setSelectedOption(option);
//     setIsDropdownOpen(false);
//   };

//   const handleUrlChange = (e) => {
//     setUrl(e.target.value);
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prevState) => !prevState);
//   };

//   return (
//     <div className="relative w-full mt-4">
//       {/* Input container */}
//       <div className="flex items-center gap-2 w-full">
//         {/* Left-most Icon inside the input field */}
//         <div className="flex items-center justify-center w-10 h-10 absolute left-2">
//           <Image src={selectedOption.icon} alt={selectedOption.label} width={10} height={24} />
//         </div>

//         {/* URL Input */}
//         <input
//           type="url"
//           placeholder="Enter Social Link URL"
//           className="flex-1 rounded-lg border border-stroke py-[10px] pl-12 pr-14 text-graphite outline-none "
//           value={url}
//           onChange={handleUrlChange}
//         />

//         {/* Dropdown Icon (Arrow) */}
//         <div
//           className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 h-10 cursor-pointer"
//           onClick={toggleDropdown}
//         >
//           <Image
//             src="/assets/icons/onboarding/Dropdownarrow.svg" 
//             alt="Dropdown Arrow"
//             width={16}
//             height={16}
//           />
//         </div>
//       </div>

//       {/* Dropdown List - Full Width of Input */}
//       {isDropdownOpen && (
//         <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-[#E2E2E2] py-2 z-10">
//           {SOCIAL_OPTIONS.map((option) => (
//             <li
//               key={option.value}
//               className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer flex items-center gap-2 -z-10"
//               onClick={() => handleIconSelect(option)}
//             >
//               <Image src={option.icon} alt={option.label} width={10} height={24} />
//               {option.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import Image from "next/image";

// const SOCIAL_OPTIONS = [
//   {
//     value: "facebook",
//     label: "Facebook",
//     icon: "/assets/icons/onboarding/Facebook.svg",
//     pattern: /^https:\/\/(www\.)?facebook\.com\/(?!pages\/)([a-zA-Z0-9.]+|(profile\.php\?id=\d+))$/,
//     errorMessage: "Invalid Facebook profile URL"
//   },
//   {
//     value: "youtube",
//     label: "Youtube",
//     icon: "/assets/icons/onboarding/Plusicon.svg",
//     pattern: /^https:\/\/(www\.)?youtube\.com\/(user\/[a-zA-Z0-9_-]+|channel\/[a-zA-Z0-9_-]+|\@[a-zA-Z0-9._-]+)$/,
//     errorMessage: "Invalid YouTube profile URL"
//   },
//   {
//     value: "x",
//     label: "X (formerly Twitter)",
//     icon: "/assets/icons/onboarding/Plusicon.svg",
//     pattern: /^https:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+$/,
//     errorMessage: "Invalid X (Twitter) profile URL"
//   },
//   {
//     value: "linkedin",
//     label: "LinkedIn",
//     icon: "/assets/icons/onboarding/Plusicon.svg",
//     pattern: /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/,
//     errorMessage: "Invalid LinkedIn profile URL"
//   }
// ];

// export default function SocialLinksDropdown({ initialData, onChange }) {
//   const [selectedOption, setSelectedOption] = useState(
//     initialData?.icon
//       ? SOCIAL_OPTIONS.find((opt) => opt.icon === initialData.icon) || SOCIAL_OPTIONS[3]
//       : SOCIAL_OPTIONS[3]
//   );
//   const [url, setUrl] = useState(initialData?.url || "");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     if (onChange) {
//       onChange({ icon: selectedOption.icon, url });
//     }
//   }, [selectedOption, url, onChange]);

//   const validateUrl = (url, pattern, errorMessage) => {
//     if (!url) {
//       return "URL is required";
//     }

//     try {
//       new URL(url); // Check if it's a valid URL
//     } catch {
//       return "Invalid URL format";
//     }

//     if (!pattern.test(url)) {
//       return errorMessage;
//     }

//     return ""; // No error
//   };

//   const handleIconSelect = (option) => {
//     setSelectedOption(option);
//     setIsDropdownOpen(false);
//     // Revalidate URL with new pattern
//     const error = validateUrl(url, option.pattern, option.errorMessage);
//     setErrorMessage(error);
//   };

//   const handleUrlChange = (e) => {
//     const newUrl = e.target.value;
//     setUrl(newUrl);

//     // Only validate if there's a value to avoid showing errors immediately
//     if (newUrl) {
//       const error = validateUrl(newUrl, selectedOption.pattern, selectedOption.errorMessage);
//       setErrorMessage(error);
//     } else {
//       setErrorMessage("");
//     }
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div className="relative w-full mt-4">
//       <div className="flex items-center gap-2 w-full">
//         <div className="flex items-center justify-center w-10 h-10 absolute left-2">
//           <Image src={selectedOption.icon} alt={selectedOption.label} width={10} height={24} />
//         </div>
//         <input
//           type="url"
//           placeholder="Enter Social Link URL"
//           className={`flex-1 rounded-lg border ${
//             errorMessage ? 'border-red-500' : 'border-stroke'
//           } py-[10px] pl-12 pr-14 text-graphite outline-none focus:ring-2 focus:ring-electric-blue/20`}
//           value={url}
//           onChange={handleUrlChange}
//           onBlur={() => {
//             if (!url) {
//               setErrorMessage("URL is required");
//             }
//           }}
//         />
//         <div
//           className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 h-10 cursor-pointer"
//           onClick={toggleDropdown}
//         >
//           <Image
//             src="/assets/icons/onboarding/Dropdownarrow.svg"
//             alt="Dropdown Arrow"
//             width={16}
//             height={16}
//           />
//         </div>
//       </div>
//       {errorMessage && (
//         <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
//       )}
//       {isDropdownOpen && (
//         <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-[#E2E2E2] py-2 z-10">
//           {SOCIAL_OPTIONS.map((option) => (
//             <li
//               key={option.value}
//               className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer flex items-center gap-2"
//               onClick={() => handleIconSelect(option)}
//             >
//               <Image src={option.icon} alt={option.label} width={10} height={24} />
//               {option.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }





"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { z } from "zod";

const SOCIAL_OPTIONS = [
  {
    value: "facebook",
    label: "Facebook",
    icon: "/assets/icons/onboarding/Facebook.svg",
    pattern: /^https:\/\/(www\.)?facebook\.com\/(?!pages\/)([a-zA-Z0-9.]+|(profile\.php\?id=\d+))$/,
    errorMessage: "Invalid Facebook profile URL",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: "/assets/icons/onboarding/Plusicon.svg",
    pattern: /^https:\/\/(www\.)?youtube\.com\/(user\/[a-zA-Z0-9_-]+|channel\/[a-zA-Z0-9_-]+|\@[a-zA-Z0-9._-]+)$/,
    errorMessage: "Invalid YouTube profile URL",
  },
  {
    value: "x",
    label: "X (formerly Twitter)",
    icon: "/assets/icons/onboarding/Plusicon.svg",
    pattern: /^https:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+$/,
    errorMessage: "Invalid X (Twitter) profile URL",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: "/assets/icons/onboarding/Plusicon.svg",
    pattern: /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/,
    errorMessage: "Invalid LinkedIn profile URL",
  },
];

// Generate Zod schemas for each social platform
const urlSchemas = SOCIAL_OPTIONS.reduce((schemas, option) => {
  schemas[option.value] = z.string().regex(option.pattern, { message: option.errorMessage });
  return schemas;
}, {});

export default function SocialLinksDropdown({ initialData, onChange, onDelete }) {
  const [selectedOption, setSelectedOption] = useState(
    initialData?.icon
      ? SOCIAL_OPTIONS.find((opt) => opt.icon === initialData.icon) || SOCIAL_OPTIONS[0]
      : SOCIAL_OPTIONS[0]
  );
  const [url, setUrl] = useState(initialData?.url || "");
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange({ icon: selectedOption.icon, url });
    }
  }, [selectedOption, url]);

  const validateUrl = (currentUrl) => {
    try {
      urlSchemas[selectedOption.value].parse(currentUrl);
      setError(null);
    } catch (e) {
      setError(e.errors[0]?.message || "Invalid URL");
    }
  };

  const handleIconSelect = (option) => {
    setSelectedOption(option);
    validateUrl(url); // Revalidate URL when changing platform
    setIsDropdownOpen(false);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    validateUrl(newUrl);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(); // Call the onDelete function passed from the parent
    }
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
          className={`flex-1 rounded-lg border py-[10px] pl-12 pr-14 text-graphite outline-none ${
            error ? "border-red-500" : "border-stroke"
          }`}
          value={url}
          onChange={handleUrlChange}
        />

        {/* Delete Icon */}
        <div
          className="absolute right-10 top-0 bottom-0 flex items-center justify-center w-10 h-10 cursor-pointer"
          onClick={handleDelete}
        >
          <Image
            src="/assets/images/delete.svg" // Replace with your delete icon path
            alt="Delete"
            width={21}
            height={16}
          />
        </div>

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

      {/* Error Message */}
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

      {/* Dropdown List - Full Width of Input */}
      {isDropdownOpen && (
        <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-[#E2E2E2] py-2 z-10">
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
