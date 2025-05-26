

//onboarding/layout.js
"use client";

import { FormProvider } from "./context";
import Image from "next/image";
import Preview from "@/components/Preview";
import { useRouter, usePathname } from "next/navigation";
import NextButton from "@/components/NextButton";

export default function OnboardingLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePrevClick = () => {
    if (pathname === "/onboarding/step-2") {
      router.push("/onboarding/step-1");
    }
  };

  return (
    <FormProvider className="mx-auto">
    <div className=" max-w-screen  h-screen max-h-screen  mx-auto">
    <div className="flex h-screen">
        {/* Left side: Image with Preview */}
        <div className="w-1/2 lg:h-[100vh] xl:h-[100vh] relative flex items-center justify-center bg-white ">
          <Image
            src="/assets/images/signup_background.png"
            alt="Background Image"
            layout="fill"
            className="absolute p-10 rounded-md top-0 left-0 w-full h-full object-left-bottom"
            loading="eager"
            priority
          />
          <div className="relative mb-20 z-10 p-0 mt-20 bg-white bg-opacity-90 rounded-xl shadow-lg font-apfel-grotezk-regular">
            <Preview />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute sm:top-[87%] sm:left-[43%] w-[200px] h-[74px] flex justify-center items-center gap-5 bg-white shadow-md rounded-md font-apfel-grotezk-regular">
        <button
            onClick={handlePrevClick}
            className="w-[72px] h-[37px] bg-white text-electric-blue border border-electric-blue rounded-md text-center font-medium hover:bg-electric-blue hover:text-white"
          >
            Back
          </button>
          <NextButton  />

        </div>

        {/* Right side: Form */}
        <div className="w-1/2 grid grid-cols-1  bg-white ">
          <div className="w-[100vw] max-w-xl">{children}</div>
        </div>
      </div>
    </div>


   
    </FormProvider>
  );
}





