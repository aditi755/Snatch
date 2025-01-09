"use client";

import { useRouter, usePathname } from "next/navigation";
import { useFormContext } from "@/app/onboarding/context";

const NextButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { formData } = useFormContext();

  const handleNextClick = () => {
    if (pathname === "/onboarding/step-2") {
      if (!formData?.username) {
        alert("Username is missing. Please provide your username.");
        return;
      }
      router.push(`/dashboard/${formData.username}`);
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
