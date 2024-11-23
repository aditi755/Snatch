// app/onboarding/layout.js
"use client";

import { FormProvider } from "./context";
import Image from "next/image";
import { useFormContext } from "./context";

export default function OnboardingLayout({ children }) {
  return (
    <FormProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Left side: Image with Preview */}
        <div className="w-1/2 relative flex items-center justify-center bg-white shadow-md">
          <Image
            src="/assets/images/signup_background.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            className="absolute p-10 rounded-md top-0 left-0 w-full h-full"
          />
          <div className="relative mb-20 z-10 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg">
            <Preview />
          </div>
        </div>

        {/* Right side: Form */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-white">
          <div className="w-[100vw] max-w-xl">{children}</div>
        </div>
      </div>
    </FormProvider>
  );
}

// Separate Preview Component
function Preview() {
  const { formData } = useFormContext(); // Access formData using context
  
  console.log("formdara from preview layout",formData)
  return (
    <div>
 
    <div className="flex gap-3 justify-center items-center">
        <span class="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium ">
            Indutsry
          </span>
          <span class="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium ">
          Industry
          </span>
          <span class="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium ">
            Industry
          </span>
    </div>


    <Image className="mx-auto mt-5" width={80} height={40} alt="profile_pic" src="/assets/images/profile_defaultOnborad.svg"/>

    <h2 className="text-dark-grey text-3xl text-center mt-4">Your Name</h2>

    <div className="flex justify-center items-center gap-3 text-dark-grey ">
        <h6>@username</h6>
        <h6>she/her</h6>
        <h6>Location</h6>
    </div>

    <div className="flex gap-5 px-5 text-dark-grey mt-[50px]">
        <h5>Languages</h5>
        <div>What Languages do you speak</div>
    </div>

    <div className="flex gap-5 px-5 text-dark-grey mt-5">
        <h5>Open to</h5>
        <div>What Comp methods are you open to?</div>
    </div>

    <div className="text-dark-grey px-10 flex flex-col justify-center items-center mt-10">
     <h3 className="text-3xl">$ 00 - 00</h3>
     <div>Charge per content piece</div>
    </div>

      {/* <h3 className="font-bold text-lg mb-2">Preview:</h3>
      <p className="text-sm">Name: {formData.name || "Your name"}</p>
      <p className="text-sm">Email: {formData.email || "Your email"}</p>
      <p className="text-sm">Address: {formData.address || "Your address"}</p> */}
    </div>
  );
}
