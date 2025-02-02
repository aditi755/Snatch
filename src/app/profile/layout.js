
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormProvider } from "../onboarding/context";
import DashboardPreview from "@/components/DashboardPreview";
import {useAuth} from "@clerk/nextjs";

export default function OnboardingLayout({ children }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const router = useRouter();
  const {isSignedIn, isLoaded} = useAuth();

  if(!isLoaded){
  return <div className="flex justify-center items-center text-2xl h-screen">Loading...</div>
  }

  if(!isSignedIn){
   router.push("/signup");
   return null;
  }
  const handleHamburgerClick = () => {
    setIsMenuVisible((prev) => !prev); // Toggle menu visibility
  };


  const handleProfileClick = () => {
    router.push("/onboarding/step-1");
  };

  const handleNextClick = () => {
    router.push("/manage-projects/pick-projects");
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  }

  const handleSettingClick = () => {
   router.push("/settings")
  }
  
  return (
    <FormProvider>
      <div className="flex h-screen bg-white justify-center">
        {/* Left side: Image with Preview */}
        <div className="w-[660px] overflow-hidden relative flex items-center justify-center bg-white">
          <Image
            src="/assets/images/signup_background.png"
            alt="Background Image"
            layout="fill"
            className="absolute p-10 rounded-md top-0 left-0 w-full h-full object-left-bottom"
            loading="eager"
            priority
          />
          <div className="relative mb-20 z-10 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg">
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

        {/* Toolbar */}
        <div className="fixed top-[85%] left-[50%] translate-x-[-50%] w-[500px] h-[74px] flex justify-center items-center gap-3 border-2 bg-white border-light-grey rounded-md z-20 p-5 font-apfel-grotezk-regular">
          {/* Hamburger Button */}
          <button
            onClick={handleHamburgerClick}
            className="w-[50px] h-[37px] bg-gray-100 text-electric-blue border  rounded-md mx-auto font-medium hover:bg-transparent relative"
          >
            <Image
              className="mx-auto w-8"
              src="/assets/icons/onboarding/Hamburger.svg"
              alt="hamburger"
              width={20}
              height={20}
            />
          </button>

          {/* Dropdown Menu */}
          {isMenuVisible && (
            <div className="absolute top-[-280%] left-[-50px] w-[200px] bg-white shadow-lg rounded-md border border-light-grey z-50">
              <ul className="flex flex-col p-3 gap-2">
                <li
                  onClick={handleDashboardClick}
                  className="cursor-pointer text-electric-blue hover:bg-gray-100 rounded-md p-2"
                >
                  Dashboard
                </li>
                <li
                  onClick={handleSettingClick}
                  className="cursor-pointer text-electric-blue hover:bg-gray-100 rounded-md p-2"
                >
                  Settings
                </li>
                <li
                  className="cursor-pointer text-electric-blue hover:bg-gray-100 rounded-md p-2"
                  onClick={() => alert("Explore clicked")}
                >
                  Explore
                </li>
                <li
                  onClick={handleProfileClick}
                  className="cursor-pointer text-electric-blue hover:bg-gray-100 rounded-md p-2"
                >
                  Profile
                </li>
              </ul>
            </div>
          )}

          {/* Other Buttons */}
          <div className="w-[265px] h-[56px] gap-2 bg-gray-100 flex justify-between items-center rounded-md p-2">
            <button
              onClick={handleProfileClick}
              className="w-[122px] h-[37px] bg-transparent text-electric-blue border border-electric-blue rounded-md text-center font-medium hover:bg-electric-blue hover:text-white"
            >
              Edit Profile
            </button>

            <button
              onClick={handleNextClick}
              className="w-[135px] h-[37px] bg-transparent text-electric-blue border border-electric-blue rounded-md text-center font-medium hover:bg-electric-blue hover:text-white"
            >
              Manage Projects
            </button>
          </div>

          <button
            onClick={handleNextClick}
            className="w-[90px] h-[50px] bg-gray-100 text-electric-blue text-2xl font-semibold border  text-center"
          >
            Snatch
          </button>
        </div>

        {/* Right side: Form */}
        <div className="w-[900px] flex flex-col justify-center items-center bg-whitee">
          <div className="w-[100vw] max-w-3xl">{children}</div>
        </div>
      </div>
    </FormProvider>
  );
}


