"use client";

import { useRouter, usePathname } from "next/navigation";
import { useFormContext } from "@/app/onboarding/context";
import { useAuth } from "@clerk/nextjs";
import { handler } from "@/app/actions/onboarding";
import { useState } from "react";


const NextButton = () => {
  const [response, setResponse] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // <- add loading state
  const router = useRouter();
  const pathname = usePathname();
  const { formData } = useFormContext();
  const { userId } = useAuth(); 

  const handleNextClick = async () => {
    if (!userId) {
      alert("User ID is missing. Please log in.");
      return;
    }

    if (pathname === "/onboarding/step-2") {
      const {
        username,
        industry,
        contentType,
        languages,
        compensation,
        post,
        story,
        reels,
        dateOfBirth
      } = formData;
    
      const missingFields = [];
    
      if (!username?.trim()) missingFields.push("Username");
      if (!dateOfBirth?.trim()) missingFields.push("Date of Birth");
    
      if (!Array.isArray(industry) || industry.length === 0) missingFields.push("Industry");
      if (!Array.isArray(contentType) || contentType.length === 0) missingFields.push("Content Type");
      if (!Array.isArray(languages) || languages.length === 0) missingFields.push("Languages");
      if (!Array.isArray(compensation) || compensation.length === 0) missingFields.push("Compensation");
    
      if (post === 0) missingFields.push("Post Count");
      if (story === 0) missingFields.push("Story Count");
      if (reels === 0) missingFields.push("Reels Count");
    
      if (missingFields.length > 0) {
        alert(`Please complete the following field(s) before continuing:\n\n${missingFields.join("\n")}`);
        return;
      }
    
      try {
        setIsSubmitting(true); // show loading
        const data = await handler({ userId, formData });
        setResponse(data);
        console.log("API response:", data);
    
        if (data.success && (data.status === 201 || data.status === 400)) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // delay for 5s
          router.push(`/dashboard/${formData.username}`);
        } else {
          throw new Error("Unexpected response from server.");
        }
    
      } catch (error) {
        console.error("Error completing onboarding:", error.response || error);
        alert("An error occurred while submitting your data. Please try again.");
        setIsSubmitting(false);
      }

    } else if (pathname === "/onboarding/step-1") {
      const {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        location,
        profilePicture,
        links,
      } = formData;
    
      const missingFields = [];
    
      if (!firstName?.trim()) missingFields.push("First Name");
      if (!lastName?.trim()) missingFields.push("Last Name");
      if (!gender) missingFields.push("Gender");
      if (!dateOfBirth) missingFields.push("Date of Birth");
      if (!location?.trim()) missingFields.push("Location");
      if (!profilePicture) missingFields.push("Profile Picture");
    
      // const hasAtLeastOneLink = links?.some(link => link.url?.trim());
      // if (!hasAtLeastOneLink) missingFields.push("At least one social link");
    
      if (missingFields.length > 0) {
        alert(`Please fill in the following required field(s):\n\n${missingFields.join("\n")}`);
        return;
      }
    
      router.push("/onboarding/step-2");
    }
  };

  if (isSubmitting) {
    router.push("/onboarding/loading"); // 
  }

  return (
    <button
      onClick={handleNextClick}
      className="w-[72px] h-[37px] bg-white text-electric-blue border border-electric-blue rounded-md text-center font-medium hover:bg-electric-blue hover:text-white"
    >
      Next
    </button>
  );
};

export default NextButton;


// const handleNextClick = async () => {
//   if (!userId) {
//     alert("User ID is missing. Please log in.");
//     return;
//   }

//   if (pathname === "/onboarding/step-2") {
//     if (!formData?.username) {
//       alert("Username is missing. Please provide your username.");
//       return;
//     }

//     try {
//       setIsSubmitting(true); // show loading

//       const data = await handler({ userId, formData });
//       setResponse(data);
//       console.log("API response:", data);

//       if (data.success && (data.status === 201 || data.status === 400)) {
//         await new Promise(resolve => setTimeout(resolve, 5000)); // delay for 3s
//         router.push(`/dashboard/${formData.username}`);
//       } else {
//         throw new Error("Unexpected response from server.");
//       }

//     } catch (error) {
//       console.error("Error completing onboarding:", error.response || error);
//       alert("An error occurred while submitting your data. Please try again.");
//       setIsSubmitting(false);
//     }

//   } else if (pathname === "/onboarding/step-1") {
//     const {
//       firstName,
//       lastName,
//       gender,
//       dateOfBirth,
//       location,
//       profilePicture,
//       links,
//     } = formData;
  
//     const missingFields = [];
  
//     if (!firstName?.trim()) missingFields.push("First Name");
//     if (!lastName?.trim()) missingFields.push("Last Name");
//     if (!gender) missingFields.push("Gender");
//     if (!dateOfBirth) missingFields.push("Date of Birth");
//     if (!location?.trim()) missingFields.push("Location");
//     if (!profilePicture) missingFields.push("Profile Picture");
  
//     // const hasAtLeastOneLink = links?.some(link => link.url?.trim());
//     // if (!hasAtLeastOneLink) missingFields.push("At least one social link");
  
//     if (missingFields.length > 0) {
//       alert(`Please fill in the following required field(s):\n\n${missingFields.join("\n")}`);
//       return;
//     }
  
//     router.push("/onboarding/step-2");
//   }
// };