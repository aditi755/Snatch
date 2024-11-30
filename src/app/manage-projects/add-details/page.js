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
import TitleWithCounter from "@/components/TitleWithCounter";
import FormInput from "@/components/FormInput"
import CustomFileInput from "@/components/CustomFileInput"
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
  const [activeTab, setActiveTab] = useState("instagram"); 

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
                  src={project.imageUrl}
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
    <div className="flex flex-col h-[77vh] bg-gray-200 w-full space-x-8 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col mx-auto items-start">
        <p className="text-2xl text-black">Pick content that you wish to highlight in your profile kit</p>
        <p className="mx-auto text-black">Fill in details for atleast 4 projects</p>
      </div>
     
     <div className="flex flex-row">
     <div className="w-[278px] bg-smoke  text-black p-3 overflow-auto">
           <div className="flex justify-between ">
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

         <div className="flex flex-row">
  {/* White Box Container */}
  <div className="bg-white w-[258px] h-[460px] ml-20 mt-4  flex items-center justify-center relative">
    <Image
      className="w-[320px] h-[400px] m-0 p-0 -mt-[72px]"
      src="/assets/images/influencer.svg"
      width={44}
      height={32}
      alt="influencer"
    />

    <div className="mt-2 flex gap-4 text-black absolute top-[85%]">
      <div className="flex-col text-center">
      <p>1.2M</p>
      <p>Views</p>
      </div>

      <div className="flex-col text-center">
      <p>56K</p>
      <p>Likes</p>
      </div>

      <div className="flex-col text-center">
      <p>40K</p>
      <p>Shares</p>
      </div>

      <div className="flex-col text-center">
      <p>30K</p>
      <p>Comments</p>
      </div>
    </div>

  </div>

</div>

<div className="ml-20 mt-5 flex flex-col gap-8 ">
        <TitleWithCounter />

        <div className="text-black flex flex-col gap-5">
          <p>About the event</p>
          <FormInput
          placeholder="Name of the event"
          // value={formState.firstName}
          // onChange={(e) => updateField("firstName", e.target.value)}
        />
        <FormInput
          placeholder="Location of the event"
          // value={formState.lastName}
          // onChange={(e) => updateField("lastName", e.target.value)}
        />
          <FormInput
          placeholder="Year"
          // value={formState.lastName}
          // onChange={(e) => updateField("lastName", e.target.value)}
        />

        <TitleWithCounter />
        </div>
       
       <div className="text-black flex flex-col gap-5">
        <p>About Company</p> 
        <FormInput
          placeholder="Enter name of company"
          // value={formState.firstName}
          // onChange={(e) => updateField("firstName", e.target.value)}
        />
        <FormInput
          placeholder="Enter location of company"
          // value={formState.lastName}
          // onChange={(e) => updateField("lastName", e.target.value)}
        />
       </div>

       <div className="text-black ">
        <p>Upload logo of company</p>
        {/* <CustomFileInput /> */}
       </div>

</div>

     </div>     
    </div>
  );
}
