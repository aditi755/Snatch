// "use client";

// import { FormProvider } from "./context";
// import Image from "next/image";
// import Preview from "@/components/Preview";
// import { useRouter, usePathname } from "next/navigation";

// export default function OnboardingLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleNextClick = () => {
//     if (pathname === "/onboarding/step-2") {
//       router.push("/dashboard");
//     } else if (pathname === "/onboarding/step-1") {
//       router.push("/onboarding/step-2");
//     }
//   };

//   const handlePrevClick = () => {
//     if (pathname === "/onboarding/step-2") {
//       router.push("/onboarding/step-1");
//     }
//   };

//   return (
//     <FormProvider>
//       <div className="3xl:max-w-[1500px] max-w-[1200px]  h-screen max-h-screen  mx-auto ">
//       <div className="flex justify-center  gap-10 3xl:gap-0 3xl:w-full  h-[710px] 5xl:h-[100vh] relative ">
//         {/* Left side: Image with Preview (preview is shared so in layout)*/}
//         <div className="3xl:w-1/2 h-[700px] 5xl:h-[100vh]  relative flex  justify-center items-center bg-white w-[500px] ">
         
//           <div className=" absolute 3xl:w-[754px] w-[600px] h-[100vh] xl:h-[704px] ">
//           <Image
//             src="/assets/images/signup_background.png"
//             alt="Background Image"
//             layout="fill"
//             className="absolute p-10 rounded-md top-0 left-0 w-full h-full object-left-bottom"
//           />
//           </div>
         
//           <div className="relative mb-20 z-10 p-4 mt-20  bg-opacity-90 rounded-lg shadow-lg max-h-[600px] bg-white">
//             <Preview />
//           </div>

//         </div>

//         {/* Navigation Buttons */}
//         <div className="absolute sm:top-[87%]  sm:left-[40%] w-[200px] h-[74px] flex justify-center items-center gap-5 shadow-md shadow-gray-300 bg-white rounded-md font-apfel-grotezk-regular">
//           <button
//             onClick={handlePrevClick}
//             className="w-[72px] h-[37px] bg-white text-electric-blue border border-electric-blue rounded-md text-center font-medium hover:bg-electric-blue hover:text-white"
//           >
//             Prev
//           </button>
//           <button
//             onClick={handleNextClick}
//             className="w-[72px] h-[37px] bg-white text-electric-blue border border-electric-blue rounded-md text-center font-medium hover:bg-electric-blue hover:text-white"
//           >
//             Next
//           </button>
//         </div>

//         {/* Right side: Form */}
//         <div className="3xl:w-1/2 w-[600px] h-[700px] 5xl:h-[100vh]  flex flex-col justify-center bg-white">
//           <div className="w-full max-w-lg 3xl:max-w-2xl">{children}</div>
//         </div>
//       </div>
//       </div>



 
//     </FormProvider>
//   );
// }


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





