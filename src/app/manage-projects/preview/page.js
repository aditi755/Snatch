"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelectedProjects } from "../context";
export default function Preview() {
  const [activeTab, setActiveTab] = useState("instagram");
  const {
    selectionState,
    handleFileUpload,
    updateFormDataForImage,
  } = useSelectedProjects();
  const [activeImageId, setActiveImageId] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);


  if (!isHydrated) {
    return null;
  }

  const renderProjects = () => {
    const projects =
      activeTab === "instagram"
        ? selectionState.svgSelected
        : selectionState.uploadedFiles;

    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="flex justify-center items-center cursor-pointer"
            onClick={() =>
              setActiveImageId(project.id || index)
            }
          >
            <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center relative">
              <Image
                src={project.imageUrl || project.fileData}
                alt={project.name || project.fileName}
                width={200}
                height={200}
                className="object-contain"
              />
              <div className="absolute top-0 right-0 p-2 bg-white bg-opacity-60">
                {project.status === "Done" && (
                  <span className="text-green-500">Done</span>
                )}
                {project.status === "Editing" && (
                  <span className="text-blue-500">Editing</span>
                )}
                {project.status === "Draft" && (
                  <span className="text-red-500">Draft</span>
                )}
                {project.status === "Yet to start" && (
                  <span className="text-gray-500">Yet to start</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

    return (
      <div className="flex flex-col items-start 2xl:items-center h-[77vh] bg-gray-200 w-full space-x-8 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col mx-auto items-start">
        <p className="text-2xl text-black">
          Pick content that you wish to highlight in your profile kit
        </p>
        <p className="mx-auto text-black">
          Fill in details for at least 4 projects
        </p>
      </div>

      <div className="flex flex-row">
        <div className="w-[278px] bg-smoke text-black p-3 overflow-auto">
          <div className="flex justify-between">
            <button
              className={`px-4 py-2 ${
                activeTab === "instagram"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setActiveTab("instagram")}
            >
              IG
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "uploaded"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setActiveTab("uploaded")}
            >
              Uploaded
            </button>

          </div>
          
          <p className="text-md mt-4">Selected projects</p>
          <p className="text-light-grey">
            {activeTab === "instagram"
              ? selectionState.svgSelected.length
              : selectionState.uploadedFiles.length}{" "}
            selected
          </p>

          {renderProjects()}
          </div>
        

          {/* preview card */}
          <div className="w-[864px] h-[447px] bg-white ml-28 mt-5">
            <div className="flex">
           <Image src="/assets/images/influencer.svg" alt="Logo" width={250} height={90} className="p-2 h-[435px]"/>
           
           <div className="ml-5 mt-4 flex flex-col">
           <p className="text-black text-2xl">Attended and created an event in Mumbai</p>
           <div className="flex gap-3  flex-wrap max-w-[380px]">
           <span
                className=" bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium "
            >
               Lifestyle
            </span>   

            <span
                className=" bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium "
            >
                Travel
            </span> 

            <span
                className=" bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium "
            >
               Food
            </span> 
           </div>
                     

          {/* Location and Event Type */}
      <div className="mt-4 text-gray-600 text-sm flex flex-col space-y-2">
        <p>• Mumbai, India</p>
        <p>• Casa Cai Mumbai • Launch Event</p>
      </div>        
            </div>
            </div>

          </div>





          </div>
          </div>
    );
  }
  