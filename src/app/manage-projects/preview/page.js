"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelectedProjects } from "../context";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function Preview() {
  const [activeTab, setActiveTab] = useState("instagram");
  const {
    selectionState,
    handleFileUpload,
    updateFormDataForImage,
  } = useSelectedProjects();
  const [activeImageId, setActiveImageId] = useState(null);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const projects = activeTab === "instagram"
    ? selectionState.instagramSelected
    : selectionState.uploadedFiles;

  const handleProjectClick = (projectId) => {
    setActiveImageId(projectId);
  };

  const handleSlide = (mediaId, direction, totalSlides) => {
    setCarouselIndexes((prev) => {
      const currentIndex = prev[mediaId] || 0;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % totalSlides
          : currentIndex === 0
          ? totalSlides - 1
          : currentIndex - 1;
      return { ...prev, [mediaId]: newIndex };
    });
  };

  console.log(
    "selectionstate from preview ", activeImageId, selectionState,
    selectionState?.formData?.[activeImageId]?.eventName || "No data for this ID"
  );
  
 

  return (
    <div className="flex flex-col items-start  h-[77vh] bg-smoke w-full space-x-8 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col mx-auto items-start">
        <p className="text-2xl text-black font-qimano">
          Pick content that you wish to highlight in your profile kit
        </p>
        <p className="mx-auto text-black">
          Fill in details for at least 4 projects
        </p>
      </div>

      <div className="flex flex-row font-apfel-grotezk-regular">
        <div className="w-[278px] bg-white text-black p-3">
          {/* Tabs */}
          <div className="flex justify-between items-center border-b border-light-grey">
            {/* IG Tab */}
            <button
              className={`relative px-4 py-2 text-lg font-medium ${
                activeTab === "instagram" ? "text-electric-blue" : "text-light-grey"
              }`}
              onClick={() => setActiveTab("instagram")}
            >
              IG
              {/* Active underline */}
              {activeTab === "instagram" && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-electric-blue"></span>
              )}
            </button>

            {/* Uploaded Tab */}
            <button
              className={`relative px-4 py-2 text-lg font-medium ${
                activeTab === "uploaded" ? "text-electric-blue" : "text-light-grey"
              }`}
              onClick={() => setActiveTab("uploaded")}
            >
              Uploaded
              {/* Active underline */}
              {activeTab === "uploaded" && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-electric-blue"></span>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="mt-4">
            <p className="text-md font-semibold">Selected Projects</p>
            <p className="text-light-grey text-sm">
              {projects.length}
            </p>
            <ProjectsGrid 
              projects={projects}
              activeTab={activeTab}
              onProjectClick={handleProjectClick}
              showStatus={true}
            />
          </div>
        </div>       

        {/* preview card */}
        <div className="w-[864px] bg-white ml-28 mt-5">
          <div className="flex gap-5 ">
            {/* <Image src="/assets/images/influencer.svg" alt="Logo" width={250} height={90} className="p-2 h-[435px]"/> */}


           <div className="w-[300px] h-full  ">
           {activeImageId !== null && (
                (() => {
                  const activeProject = projects.find(
                    (project) => project.mediaId === activeImageId
                  );
            
                  if (!activeProject) {
                    return <p>No project selected</p>;
                  }
            
                  if (activeProject.name === "IMAGE") {
                    return (
                      <div className="relative h-[400px] p-5 w-[300px]">
                      <Image
                        src={activeProject.mediaLink}
                        alt={activeProject.name}
                        width={300}
                        height={1200}
                        className=" h-[380px] object-cover "
                      />
                      </div>
                    );
                  } else if (activeProject.name === "VIDEO") {
                    return (
                      <div className="relative h-[400px] p-5 w-[300px]">
                      <video
                        src={activeProject.mediaLink}
                        controls
                        width={300}
                        height={1200}
                        className=" h-[400px] object-cover"
                      />
                      </div>
                    );
                  } else if (activeProject.name === "CAROUSEL_ALBUM") {
                    return (
                      <div className="relative h-[400px] p-5 w-[300px]">
                        {activeProject.children.map((child, index) => (
                          <div
                            key={child.id}
                            className={`absolute inset-0 transition-transform duration-500 h-[400px] ${
                              (carouselIndexes[activeProject.mediaId] || 0) === index
                                ? "translate-x-0 opacity-100"
                                : "translate-x-50 opacity-0"
                            }`}
                          >
                            {child.media_type === "IMAGE" ? (
                              <Image
                                src={child.media_url}
                                alt={`Media ${child.id}`}
                                fill
                                className="object-cover h-[400px] p-5"
                              />
                            ) : (
                              <video
                                controls
                                className=" object-cover h-[400px] p-5"
                                src={child.media_url}
                              >
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        ))}
            
                        {/* Carousel Navigation */}
                        <button
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                          onClick={() =>
                            handleSlide(
                              activeProject.mediaId,
                              "prev",
                              activeProject.children.length
                            )
                          }
                        >
                          ❮
                        </button>
                        <button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                          onClick={() =>
                            handleSlide(
                              activeProject.mediaId,
                              "next",
                              activeProject.children.length
                            )
                          }
                        >
                          ❯
                        </button>
                      </div>
                    );
                  } else if (activeProject.fileUrl) {
                    return (
                      <Image
                        src={activeProject.fileUrl}
                        alt={activeProject.fileName}
                        width={500}
                        height={1200}
                        className="h-[400px] object-contain"
                      />
                    );
                  }
            
                  return null;
                })()
              )}
           </div>

           <div className="w-full h-full mt-5">

            <p className="text-2xl text-graphite font-qimano">{selectionState?.formData?.[activeImageId]?.titleName || "Title of the project"}</p>

            <div className="flex gap-1 flex-wrap max-w-[380px]">
            {selectionState?.formData?.[activeImageId]?.industries?.map((industry, index) => (
              <span
                key={index}
                className="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium"
              >
                {industry}
              </span>
            )) || "Industry"}
          </div>

          <div className="w-full border-b-2 border-gray-300 mt-4"></div>

          <div className="flex items-center space-x-4  mt-[3rem]">
  {/* Logo */}
  <div className="flex items-center">
    <Image
      src="/assets/images/logo.svg" 
      width={50}
      height={50}
      alt="CAI Logo"
      className="h-12 w-12 object-contain rounded-full"
    />
  </div>

  {/* Divider */}
  <div className="h-12 border-l border-gray-300"></div>

  {/* Text Details */}
  <div className="text-gray-500 text-sm space-y-1">
    <p>• Mumbai, India</p>
    <p>• Casa Cai Mumbai • Launch Event</p>
  </div>
          </div>

          <p className="text-graphite mt-5">{selectionState?.formData?.[activeImageId]?.description || "Description of the project"}</p>

          <div className="w-full border-b-2 border-gray-300 mt-8"></div>

          
<div className="mt-5 ml-20 flex gap-20 justify-center items-center text-black w-[300px]">
      <div className="flex-row text-center">
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
        </div>
      </div>
    </div>
  );
}
