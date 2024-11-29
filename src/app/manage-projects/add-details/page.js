// "use client";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useSelectedProjects } from "../context";

// export default function AddDetails() {
//   const { 
//     selectionState, 
//     addProject, 
//     removeProject, 
//     handleFileUpload, 
//     removeFile, 
//     addInstagramSelection, 
//     removeInstagramSelection 
//   } = useSelectedProjects();

//   const [isHydrated, setIsHydrated] = useState(false);

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   if (!isHydrated) {
//     return null;
//   }

//   return (
//     <div>
//       <div className="flex gap-10 mt-5">
//         <div className="w-[278px] h-[60vh] bg-smoke text-black p-3 overflow-auto">
//           <p className="text-md">Selected projects from Instagram</p>
//           <p className="text-light-grey">{selectionState.instagramSelected.length} selected</p>
          
//           <div className="grid grid-cols-2 gap-2 mt-4">
//             {selectionState.instagramSelected.map((project) => (
//               <div key={project.id} className="flex justify-center items-center">
//                 <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center">
//                   <Image
//                     src="/assets/images/projects.svg"
//                     alt={project.name}
//                     width={200}
//                     height={200}
//                     className="object-contain"
//                   />
//                   <div className="absolute top-0 right-0 p-2 bg-white bg-opacity-60">
//                     {project.status === 'Done' && <span className="text-green-500">Done</span>}
//                     {project.status === 'Editing' && <span className="text-blue-500">Editing</span>}
//                     {project.status === 'Draft' && <span className="text-red-500">Draft</span>}
//                     {project.status === 'Yet to start' && <span className="text-gray-500">Yet to start</span>}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelectedProjects } from "../context";

export default function AddDetails() {
  const { 
    selectionState, 
    addProject, 
    removeProject, 
    handleFileUpload, 
    removeFile, 
    addInstagramSelection, 
    removeInstagramSelection 
  } = useSelectedProjects();

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("instagram"); // Track active tab: "instagram" or "uploaded"

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  // Render Instagram projects or uploaded projects based on activeTab
  const renderProjects = () => {
    if (activeTab === "instagram") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {selectionState.svgSelected.map((project) => (
            <div key={project.id} className="flex justify-center items-center">
              <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center relative">
                <Image
                  src="/assets/images/projects.svg"
                  alt={project.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
                <div className="absolute top-0 right-0 p-2 bg-white bg-opacity-60">
                  {project.status === 'Done' && <span className="text-green-500">Done</span>}
                  {project.status === 'Editing' && <span className="text-blue-500">Editing</span>}
                  {project.status === 'Draft' && <span className="text-red-500">Draft</span>}
                  {project.status === 'Yet to start' && <span className="text-gray-500">Yet to start</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (activeTab === "uploaded") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {selectionState.uploadedFiles.map((file, index) => (
            <div key={index} className="flex justify-center items-center">
              <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center relative">
                <Image
                  src={file.fileData} // Assuming fileData is a base64-encoded image or valid URL
                  alt={file.fileName}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex gap-10 mt-5">
        {/* Tab navigation */}
        <div className="w-[278px] bg-smoke text-black p-3 overflow-auto">
          <div className="flex justify-between">
            <button
              className={`px-4 py-2 ${activeTab === "instagram" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
              onClick={() => setActiveTab("instagram")}
            >
              IG
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "uploaded" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
              onClick={() => setActiveTab("uploaded")}
            >
              Uploaded
            </button>
          </div>
          
          <p className="text-md mt-4">Selected projects</p>
          <p className="text-light-grey">{activeTab === "instagram" ? selectionState.instagramSelected.length : selectionState.uploadedFiles.length} selected</p>
          
          {/* Display Projects */}
          {renderProjects()}
        </div>
      </div>
    </div>
  );
}
