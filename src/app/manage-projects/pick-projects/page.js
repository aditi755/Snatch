// "use client"
// import React, { useState } from "react";
// import Image from "next/image";

// export default function PickProjects() {// Mock Data for Projects
// const projects = [
//     { id: 1, name: "Project 1" },
//     { id: 2, name: "Project 2" },
//     { id: 3, name: "Project 3" },
//   ];


//   const [selectedTab, setSelectedTab] = useState("instagram");
//   const [selectedProjects, setSelectedProjects] = useState([]);

//   const handleTabClick = (tab) => {
//     setSelectedTab(tab);
//   };

//   const handleProjectClick = (project) => {
//     setSelectedProjects((prevProjects) => [...prevProjects, project]);
//   };

  
//     return (
//         <div className="flex flex-col h-[77vh] w-full  space-x-8 overflow-x-hidden bg-light-grey">
//         {/* Left Side: Tabs for Instagram and Upload */}
//         <div className="flex flex-row overflow-x-hiddden  w-[100vw] items-start">
//           <button
//             onClick={() => handleTabClick("instagram")}
//             className={`w-[50vw] mb-0 p-2 text-lg ${
//               selectedTab === "instagram" ? "text-electric-blue" : "text-light-grey"
//             }`}
//           >
//             Instagram
//           </button>
//           <button
//             onClick={() => handleTabClick("upload")}
//             className={`w-[50vw] p-2 text-lg ${
//               selectedTab === "upload" ? "text-electric-blue" : "text-light-grey"
//             }`}
//           >
//             Upload
//           </button>
//         </div>

//         <div className="flex gap-10">
//         <div className="w-[478px] h-[60vh] bg-smoke text-black">
//          <p className=" text-md">Selected projects from Instgarm</p>
//          <p className="text-light-grey">7 selected</p>
//         </div>

//         <div className="w-[56vw] h-[70vh] bg-smoke text-black rounded-md p-5 overflow-hidden">
//   <p className="ml-10 mt-3 mb-5 text-md">Show entire list of Instagram projects</p>

//   <div className="overflow-y-auto h-full">
//     <div className="grid grid-cols-4 gap-5 w-full">
//       {[
//         { id: 1, src: '/assets/images/projects.svg', alt: 'project-1' },
//         { id: 2, src: '/assets/images/projects.svg', alt: 'project-2' },
//         { id: 3, src: '/assets/images/projects.svg', alt: 'project-3' },
//         { id: 4, src: '/assets/images/projects.svg', alt: 'project-4' },
//         { id: 5, src: '/assets/images/projects.svg', alt: 'project-5' },
//         { id: 6, src: '/assets/images/projects.svg', alt: 'project-6' },
//         { id: 7, src: '/assets/images/projects.svg', alt: 'project-7' },
//         { id: 8, src: '/assets/images/projects.svg', alt: 'project-8' },
//         { id: 9, src: '/assets/images/projects.svg', alt: 'project-9' },
//         // Add more projects if needed
//       ].map((image) => (
//         <div key={image.id} className="flex justify-center items-center">
//           <Image
//             src={image.src}
//             alt={image.alt}
//             width={100}
//             height={100}
//             className="w-[200px] object-contain"
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// </div>

//         </div>


//       </div>
//     );
//   }

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSelectedProjects } from "../context";

export default function PickProjects() {
  const projects = [
    { id: 1, name: "Project 1" },
    { id: 2, name: "Project 2" },
    { id: 3, name: "Project 3" },
    { id: 4, name: "Project 1" },
    { id: 5, name: "Project 2" },
    { id: 6, name: "Project 3" },
    { id: 7, name: "Project 1" },
    { id: 8, name: "Project 2" },
    { id: 9, name: "Project 3" },
    { id: 10, name: "Project 2" },
    { id: 11, name: "Project 3" },
  ];

  const { selectedProjects, addProject, removeProject, clearProjects } = useSelectedProjects();
  const [selectedTab, setSelectedTab] = useState("instagram");

  const handleTabClick = (tab) => setSelectedTab(tab);

  const handleProjectClick = (project) => addProject(project);

  return (
    <div className="flex flex-col h-[77vh] bg-gray-200  w-full space-x-8 overflow-x-hidden overflow-y-hidden">

      <div className="flex mx-auto items-start">
        <p className="text-2xl text-black">Pick content that you wish to highlight in your profile kit</p>
      </div>

  

<div className="flex w-full border-b border-gray-300 mt-5">
  <button
    onClick={() => handleTabClick("instagram")}
    className={`flex-1 py-2 text-lg font-semibold text-center ${
      selectedTab === "instagram"
        ? "text-electric-blue border-b-2 border-electric-blue"
        : "text-gray-500"
    }`}
  >
    <span className="flex items-center justify-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 2.005.24 2.668.511a5.4 5.4 0 011.947 1.267 5.4 5.4 0 011.267 1.947c.27.663.457 1.498.511 2.668.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 2.005-.511 2.668a5.4 5.4 0 01-1.267 1.947 5.4 5.4 0 01-1.947 1.267c-.663.27-1.498.457-2.668.511-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-2.005-.24-2.668-.511a5.4 5.4 0 01-1.947-1.267 5.4 5.4 0 01-1.267-1.947c-.27-.663-.457-1.498-.511-2.668C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-2.005.511-2.668a5.4 5.4 0 011.267-1.947 5.4 5.4 0 011.947-1.267c.663-.27 1.498-.457 2.668-.511C8.416 2.175 8.796 2.163 12 2.163m0-2.163C8.738 0 8.332.012 7.052.07c-1.304.062-2.464.296-3.514.815a7.362 7.362 0 00-2.656 1.737A7.362 7.362 0 00.87 5.658c-.519 1.05-.753 2.21-.815 3.514C.012 8.332 0 8.738 0 12c0 3.262.012 3.668.07 4.948.062 1.304.296 2.464.815 3.514a7.362 7.362 0 001.737 2.656 7.362 7.362 0 002.656 1.737c1.05.519 2.21.753 3.514.815 1.28.058 1.686.07 4.948.07 3.262 0 3.668-.012 4.948-.07 1.304-.062 2.464-.296 3.514-.815a7.362 7.362 0 002.656-1.737 7.362 7.362 0 001.737-2.656c.519-1.05.753-2.21.815-3.514.058-1.28.07-1.686.07-4.948 0-3.262-.012-3.668-.07-4.948-.062-1.304-.296-2.464-.815-3.514a7.362 7.362 0 00-1.737-2.656A7.362 7.362 0 0019.948.87c-1.05-.519-2.21-.753-3.514-.815C15.668.012 15.262 0 12 0z"></path>
        <circle cx="12" cy="12" r="3.516"></circle>
        <path d="M18.406 4.594a1.44 1.44 0 00-2.031 0 1.44 1.44 0 000 2.031 1.44 1.44 0 002.031 0 1.44 1.44 0 000-2.031z"></path>
      </svg>
      Instagram
    </span>
  </button>
  <button
    onClick={() => handleTabClick("upload")}
    className={`flex-1 py-2 text-lg font-semibold text-center ${
      selectedTab === "upload"
        ? "text-electric-blue border-b-2 border-electric-blue"
        : "text-gray-500"
    }`}
  >
    <span className="flex items-center justify-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16.5v-9m0 0l3.75 3.75M12 7.5L8.25 11.25m11.25 3v3.375A2.625 2.625 0 0116.875 21H7.125A2.625 2.625 0 014.5 18.375V15m0 0v-3.375C4.5 7.682 7.682 4.5 12 4.5s7.5 3.182 7.5 7.125V15z"
        />
      </svg>
      Upload
    </span>
  </button>
</div>

      <div className="flex gap-10 mt-5">
        <div className="w-[278px] h-[60vh] bg-smoke text-black p-3 overflow-auto">
          <p className="text-md">Selected projects from Instagram</p>
          <p className="text-light-grey">{selectedProjects.length} selected</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {selectedProjects.map((project) => (
              <div key={project.id} className="flex justify-center items-center">
                <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center">
                  <Image
                    src="/assets/images/projects.svg"
                    alt={project.name}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[70vw] h-[70vh]  text-black rounded-md p-5 overflow-hidden">
          <p className="ml-0 mt-3 mb-5 text-md">Show entire list of Instagram projects</p>
          <div className="overflow-y-auto h-full">
            <div className="grid grid-cols-5 gap-2 w-full">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="w-[200px] h-[200px] border-2 border-light-grey rounded-md flex justify-center items-center">
                    <Image
                      src="/assets/images/projects.svg"
                      alt={project.name}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
