"use client";

import { FormProvider } from "./context";
import Image from "next/image";
import Preview from "@/components/Preview";
import { useRouter, usePathname } from "next/navigation";

export default function OnboardingLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNextClick = () => {
    if (pathname === "/onboarding/step-2") {
      router.push("/dashboard");
    } else if (pathname === "/onboarding/step-1") {
      router.push("/onboarding/step-2");
    }
  };

  const handlePrevClick = () => {
    if (pathname === "/onboarding/step-2") {
      router.push("/onboarding/step-1");
    }
  };

  return (
    <FormProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Left side: Image with Preview */}
        <div className="w-1/2 relative flex items-center justify-center bg-white shadow-md">
          <Image
            src="/assets/images/signup_background.png"
            alt="Background Image"
            layout="fill"
            className="absolute p-10 rounded-md top-0 left-0 w-full h-full object-left-bottom"
          />
          <div className="relative mb-20 z-10 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg">
            <Preview />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute sm:top-[87%] sm:left-[43%] w-[200px] h-[74px] flex justify-center items-center gap-5 border-2 bg-smoke border-light-grey rounded-md">
          <button
            onClick={handlePrevClick}
            className="w-[72px] h-[37px] bg-white text-electric-blue border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white"
          >
            Prev
          </button>
          <button
            onClick={handleNextClick}
            className="w-[72px] h-[37px] bg-white text-electric-blue border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white"
          >
            Next
          </button>
        </div>

        {/* Right side: Form */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-white">
          <div className="w-[100vw] max-w-xl">{children}</div>
        </div>
      </div>
    </FormProvider>
  );
}
