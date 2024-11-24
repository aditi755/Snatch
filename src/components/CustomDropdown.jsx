// "use client";

// import { useState } from "react";

// const CustomDropdown = ({ options, placeholder, onSelect, selected }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("");

//   const toggleDropdown = () => setIsOpen((prev) => !prev);

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//     onSelect(option); // Pass selected option to parent
//     setIsOpen(false); // Close dropdown
//   };

//   return (
//     <div className="relative w-[568px]">
//       <div
//         className="rounded-lg border border-stroke bg-transparent py-[10px] px-5 text-dark-6 cursor-pointer"
//         onClick={toggleDropdown}
//       >
//         {selectedOption || placeholder}
//       </div>
//       {isOpen && (
//         <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-light-grey py-2">
//           {options.map((option, index) => (
//             <li
//               key={index}
//               className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer"
//               onClick={() => handleOptionClick(option)}
//             >
//               {option}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CustomDropdown;


"use client";

import { useState, useEffect } from "react";

const CustomDropdown = ({ options, placeholder, onSelect, selected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    onSelect(option); // Pass selected option to parent
    setIsOpen(false); // Close dropdown
  };

  return (
    <div className="relative w-[568px]">
      {/* Display selected option or placeholder */}
      <div
        className="rounded-lg border border-stroke bg-transparent py-[10px] px-5 text-dark-6 cursor-pointer"
        onClick={toggleDropdown}
      >
        {selected || placeholder}
      </div>

      {isOpen && (
        <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-light-grey py-2">
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

