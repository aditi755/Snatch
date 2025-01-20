"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import usePathname

const steps = [
  {
    id: "/manage-projects/pick-projects",
    label: "Pick Projects",
    icon: "/assets/images/instagram.svg",
  },
  {
    id: "/manage-projects/add-details",
    label: "Add Details",
    icon: "/assets/images/write.svg",
  },
  {
    id: "/manage-projects/preview",
    label: "Preview",
    icon: "/assets/images/view.svg",
  },
];

const Header = () => {
  const pathname = usePathname(); // Get the current route

  return (
    <div className="sticky top-0 bg-electric-blue p-4 text-white shadow-lg">
      <div className="flex items-center justify-around">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Marker */}
            <div className="flex flex-col items-center px-10">
              {/* SVG Icon */}
              <Image
                src={step.icon}
                alt={`${step.label} Icon`}
                width={32}
                height={32}
                className={`w-5 h-5 transition-all duration-300 ${
                  pathname === step.id ? "text-lime-yellow" : "text-white"
                }`}
                style={{
                  filter:
                    pathname === step.id
                      ? "invert(81%) sepia(66%) saturate(316%) hue-rotate(7deg) brightness(97%) contrast(104%)" // Yellow color filter
                      : "invert(100%)", // White color filter
                }}
              />

              {/* Step Label */}
              <span
                className={`mt-2 transition-all duration-300 font-apfel-grotezk-regular ${
                  pathname === step.id
                    ? "text-lime-yellow "
                    : "text-gray-300"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-[0.95px] mx-2 transition-all duration-300 ${
                  pathname === step.id || pathname === steps[index + 1].id
                    ? "bg-[#CBCBCB] opacity-75"
                    : "bg-gray-400"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Header;


// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const steps = [
//   {
//     id: "/manage-projects/pick-projects",
//     label: "Pick Projects",
//     icon: "/assets/images/Instagram.svg", 
//   },
//   {
//     id: "/manage-projects/add-details",
//     label: "Add Details",
//     icon: "/assets/images/write.svg", 
//   },
//   {
//     id: "/manage-projects/preview",
//     label: "Preview",
//     icon: "/assets/images/view.svg", 
//   },
// ];

// const Header = () => {
//   const router = useRouter();
//   const [activeStep, setActiveStep] = useState(steps[0].id); // Initialize with the first step

//   const handleStepClick = (stepId) => {
//     setActiveStep(stepId); // Set the active step
//     //router.push(stepId); // Navigate to the clicked step
//   };

//   return (
//     <div className="sticky top-0 bg-electric-blue p-4 text-white shadow-lg">
//       <div className="flex items-center justify-around">
//         {steps.map((step, index) => (
//           <React.Fragment key={index}>
//             {/* Step Marker */}
//             <div
//               className="flex flex-col items-center cursor-pointer"
//               onClick={() => handleStepClick(step.id)} // Navigate to the clicked step
//             >
//               {/* SVG Icon */}
//               <Image
//                 src={step.icon}
//                 alt={`${step.label} Icon`}
//                 width={32}
//                 height={32}
//                 className={`w-5 h-5 transition-all duration-300 ${
//                   activeStep === step.id ? "text-yellow-500" : "text-white"
//                 }`}
//                 style={{
//                   filter:
//                     activeStep === step.id
//                       ? "invert(81%) sepia(66%) saturate(316%) hue-rotate(7deg) brightness(97%) contrast(104%)" // Yellow color filter
//                       : "invert(100%)", // White color filter
//                 }}
//               />

//               {/* Step Label */}
//               <span
//                 className={`mt-2 transition-all duration-300 font-apfel-grotezk-regular ${
//                   activeStep === step.id
//                     ? "text-yellow-500 font-bold"
//                     : "text-gray-300"
//                 }`}
//               >
//                 {step.label}
//               </span>
//             </div>

//             {/* Connecting Line */}
//             {index < steps.length - 1 && (
//               <div
//                 className={`flex-1 h-1 mx-2 transition-all duration-300 ${
//                   activeStep === step.id || activeStep === steps[index + 1].id
//                     ? "bg-white"
//                     : "bg-gray-400"
//                 }`}
//               ></div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Header;
