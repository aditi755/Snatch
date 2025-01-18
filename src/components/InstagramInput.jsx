// "use client";

// import Image from "next/image";
// import React from "react";

// export default function InstagramInput({ placeholder = "Enter Instagram URL", value, onChange }) {
//   return (
//     <div className="flex items-center w-full rounded-md border border-stroke px-2 py-3">
//       {/* Instagram Icon */}
//       <span className="text-primary">
//         <Image src="/assets/icons/onboarding/Instagram.svg" alt="Instagram" width={30} height={34} />
//       </span>
//       {/* Vertical Line */}
//       <div className="w-[1px] h-6 bg-stroke mx-3"></div>
//       {/* Input Field */}
//       <input
//         type="url"
//         placeholder={placeholder}
//         className="flex-grow bg-transparent text-graphite outline-none transition placeholder:text-dark-grey"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import { z } from "zod";
// import Image from "next/image";

// // Instagram URL Validation Schema
// const instagramUrlSchema = z.string().url().regex(
//   /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/,
//   "Enter a valid Instagram URL"
// );

// export default function InstagramInput({ placeholder = "Enter Instagram URL", value, onChange }) {
//   const [error, setError] = useState("");

//   const handleChange = (inputValue) => {
//     onChange(inputValue); // Update parent state

//     // Validate the input
//     try {
//       instagramUrlSchema.parse(inputValue);
//       setError(""); // Clear error if valid
//     } catch (e) {
//       setError(e.errors[0].message); // Show validation error
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center w-full rounded-md border border-stroke px-2 py-3">
//         {/* Instagram Icon */}
//         <span className="text-primary">
//           <Image src="/assets/icons/onboarding/Instagram.svg" alt="Instagram" width={30} height={34} />
//         </span>
//         {/* Vertical Line */}
//         <div className="w-[1px] h-6 bg-stroke mx-3"></div>
//         {/* Input Field */}
//         <input
//           type="url"
//           placeholder={placeholder}
//           className="flex-grow bg-transparent text-graphite outline-none transition placeholder:text-dark-grey"
//           value={value}
//           onChange={(e) => handleChange(e.target.value)}
//         />
//       </div>
//       {/* Validation Error Message */}
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { useFormContext } from "@/app/onboarding/context";// Adjust the path to your FormProvider

// Instagram URL Validation Schema
const instagramUrlSchema = z.string().url().regex(
  /^(https?:\/\/)?(www\.)?instagram\.com\/([a-zA-Z0-9._-]+)\/?$/,
  "Please enter a valid Instagram profile URL"
);

export default function InstagramInput({ placeholder = "Enter Instagram URL", value, onChange }) {
  const [error, setError] = useState("");
  const { updateFormData } = useFormContext(); // Access the context

  const handleChange = (inputValue) => {
    onChange(inputValue); // Update parent state or props

    // Validate the input
    try {
      const parsedUrl = instagramUrlSchema.parse(inputValue);
      setError(""); // Clear error if valid

      // Extract the username
      const usernameMatch = inputValue.match(/instagram\.com\/([a-zA-Z0-9._-]+)\/?/);
      if (usernameMatch && usernameMatch[1]) {
        const username = usernameMatch[1];

        // Update the context
        updateFormData({ instagram: inputValue, username });

        console.log("Instagram username extracted and saved to context:", username);
      }
    } catch (e) {
      setError(e.errors[0].message); // Show validation error
    }
  };

  return (
    <div>
      <div className="flex items-center w-full rounded-md border border-stroke px-2 py-3">
        {/* Instagram Icon */}
        <span className="text-primary">
          <Image src="/assets/icons/onboarding/Instagram.svg" alt="Instagram" width={30} height={34} />
        </span>
        {/* Vertical Line */}
        <div className="w-[1px] h-6 bg-stroke mx-3"></div>
        {/* Input Field */}
        <input
          type="url"
          placeholder={placeholder}
          className="flex-grow bg-transparent text-graphite outline-none transition placeholder:text-dark-grey"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {/* Validation Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
