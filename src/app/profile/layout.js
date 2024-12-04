// app/onboarding/layout.js
"use client";

import { FormProvider } from "../onboarding/context";
import Image from "next/image";
import { useFormContext } from "../onboarding/context";
import Preview from "@/components/Preview";
import { useRouter } from "next/navigation";

export default function OnboardingLayout({ children }) {

  const router = useRouter();
  const handleNextClick = () => {
    router.push("/manage-projects/pick-projects");
  }

  const handleProfileClick = () => {
    router.push("/profile");
  }
  return (
    <FormProvider>
      <div className="flex h-screen bg-smoke justify-center">
        {/* Left side: Image with Preview */}
        <div className="w-[660px] overflow-hidden relative flex items-center justify-center bg-white shadow-md">
          <Image
            src="/assets/images/signup_background.png"
            alt="Background Image"
            layout="fill"
            className="absolute p-10 rounded-md top-0 left-0 w-full h-full object-left-bottom"
          />
          <div className="relative mb-20 z-10 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg">
            <Preview />
            
          </div>

          <div className="w-64 h-20 z-50 absolute top-[80%] mx-auto ">
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

        <div className="fixed top-[85%] left-[50%] translate-x-[-50%] w-[530px] h-[74px] flex justify-center items-center gap-3 border-2 bg-white border-light-grey rounded-md z-20">
          <button onClick={handleProfileClick} className="w-[72px] h-[37px] bg-light-grey text-electric-blue border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
            Profile
          </button>
 
          <button onClick={handleNextClick} className="w-[122px] h-[37px] bg-transparent text-electric-blue border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
            Edit Profile
          </button>

          <button onClick={handleNextClick} className="w-[120px] h-[37px] bg-transparent text-electric-blue border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
            Manage projects
          </button>

          <button onClick={handleNextClick} className="w-[72px] h-[37px] bg-light-grey text-electric-blue border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
           Snatch
          </button>
        </div>

        {/* Right side: Form */}
        <div className="w-[900px] flex flex-col justify-center items-center bg-smoke">
          <div className="w-[100vw] max-w-3xl">{children}</div>
        </div>
      </div>
    </FormProvider>
  );
}





