// app/onboarding/layout.js   make it ssr by having compoenents using conetxt api
"use client";
import { useEffect } from "react";
import { FormProvider } from "../onboarding/context";
import Image from "next/image";
import { useFormContext } from "../onboarding/context";
import Preview from "@/components/Preview";
import { useRouter } from "next/navigation";
import DashboardPreview from "@/components/DashboardPreview";

export default function OnboardingLayout({ children }) {

  const router = useRouter();
  
  const handleNextClick = () => {
    router.push("/dashboard");
  }

  const handleProfileClick = () => {
    router.push("/profile");
  }

  const handleSettingClick = () => {
    router.push("/settings");
  }
  return (
    <FormProvider>
      <div className="flex justify-center  h-[100vh] w-[100vw] relative bg-[#E9E9E9] ">
        {/* Left side: Image with Preview items-center added above to center the dashboard */}
        <div className="w-[40vw] overflow-hidden relative flex items-center justify-center bg-[#E9E9E9] h-[100vh] ">
          <Image
            src="/assets/images/signup_background.png"
            alt="Background Image"
            layout="fill"
            className="absolute p-4 rounded-xl top-0 left-0 w-full h-screen object-left-bottom"
            loading="eager"
            priority
          />

          <div className="relative mb-20 z-10 2xl:p-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-lg grid grid-rows-1">
            <DashboardPreview />
            <div className="w-64 h-20 z-50 absolute left-24 -bottom-24  mx-auto font-qimano">
            <div className="flex justify-center items-center gap-20 text-smoke">
              <div className="flex flex-col">
                <h2 className="text-3xl">100K</h2>
                <p className="text-1xl">Views</p>
              </div>
          

              <div className="flex flex-col">
                <h2 className="text-3xl">56K</h2>
                <p className="text-1xl">Followers</p>
              </div>
          
              <div className="flex flex-col">
                <h2 className="text-3xl">35K</h2>
                <p className="text-1xl">Likes</p>
              </div>
              </div>
            </div>
          </div>

        


        </div>

        <div className="absolute top-[87%] left-[37%]  w-[530px] h-[79px] flex justify-center items-center gap-3  bg-white font-apfel-grotezk-regular rounded-xl shadow-md z-20">
          <button onClick={handleProfileClick} className="w-[80px] h-[50px] bg-gray-100 text-electric-blue  rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
            Profile
          </button>
 
          <button onClick={handleNextClick} className="w-[80px] h-[50px] bg-gray-100 text-electric-blue  rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
            Explore
          </button>

          <button onClick={handleNextClick} className="w-[90px] h-[50px] bg-gray-100 text-electric-blue  rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
            Dashboard
          </button>

          <button onClick={handleSettingClick} className="w-[80px] h-[50px] bg-gray-100 text-electric-blue  rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
           Settings
          </button>

          <button onClick={handleNextClick} className="w-[90px] h-[50px] bg-gray-100 text-electric-blue text-2xl font-semibold    text-center">
           Snatch
          </button>
        </div>

        {/* Right side: Form */}
        <div className="w-[60vw] max-w-[80%] flex flex-col bg-[#E9E9E9] h-[100vh]">
          <div className=" h-[100vh] w-[60vw] max-w-[98%] ">{children}</div>
        </div>
      </div>
    </FormProvider>
  );
}





