//src/components/NextButton.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useFormContext } from "@/app/onboarding/context";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { handler } from "@/app/actions/onboarding";
import { useState } from "react";

const NextButton = () => {
  const [response, setResponse] = useState({});
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
      if (!formData?.username) {
        alert("Username is missing. Please provide your username.");
        return;
      }

      try {
        console.log("Making API call to:", `/api/onboarding/${userId}`); // Add this for debugging

        const data = await handler({ userId, formData });
        console.log("API response:", data);
        setResponse(data);

        console.log("API response:", response);
        if (data.success && data.status === 201 || data.status === 400) {
          console.log(
            "Onboarding data and user successfully created:",
           
          );

         //  Redirect to dashboard
          router.push(`/dashboard/${formData.username}`);
        } 

      } catch (error) {
        console.error("Full error details:", error.response || error); // Enhanced error logging
        alert("An error occurred while submitting your data. Please try again.");
      }
    } else if (pathname === "/onboarding/step-1") {
      router.push("/onboarding/step-2");
    }
  };

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
