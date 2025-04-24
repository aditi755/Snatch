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
      if (!formData?.username) {
        alert("Username is missing. Please provide your username.");
        return;
      }

      try {
        setIsSubmitting(true); // show loading

        const data = await handler({ userId, formData });
        setResponse(data);
        console.log("API response:", data);

        if (data.success && (data.status === 201 || data.status === 400)) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // delay for 3s
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
    
      const hasAtLeastOneLink = links?.some(link => link.url?.trim());
    
      if (
        !firstName?.trim() ||
        !lastName?.trim() ||
        !gender ||
        !dateOfBirth ||
        !location?.trim() ||
        !profilePicture ||
        !hasAtLeastOneLink
      ) {
        alert("Please complete all required fields before continuing.");
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
