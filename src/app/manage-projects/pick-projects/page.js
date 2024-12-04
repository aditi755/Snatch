"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelectedProjects } from "../context";

export default function PickProjects() {
  const projects = [
    { id: 1, name: "Project 1", path: "/assets/images/projects.svg" },
    { id: 2, name: "Project 2", path: "/assets/images/projects.svg" },
    { id: 3, name: "Project 3", path: "/assets/images/projects.svg" },
    { id: 4, name: "Project 1", path: "/assets/images/projects.svg" },
    { id: 5, name: "Project 2", path: "/assets/images/projects.svg" },
    { id: 6, name: "Project 3", path: "/assets/images/projects.svg" },
    { id: 7, name: "Project 1", path: "/assets/images/influencer.svg" },
    { id: 8, name: "Project 2", path: "/assets/images/projects.svg" },
    { id: 9, name: "Project 3", path: "/assets/images/projects.svg" },
    { id: 10, name: "Project 2", path: "/assets/images/projects.svg" },
    { id: 11, name: "Project 3", path: "/assets/images/projects.svg" },
  ];

  const { 
    selectionState, 
    handleFileUpload, 
    addSVGSelection
  } = useSelectedProjects();

  const [selectedTab, setSelectedTab] = useState("instagram");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const handleTabClick = (tab) => setSelectedTab(tab);

  const handleProjectClick = (project) => {
    console.log("project clicked", project);
    addSVGSelection(project);  // Handles Instagram project selection
    console.log("Selection State: after adding svg selcetion", selectionState);
  };

  // Handle file selection and upload (No SVG to base64 conversion here)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file) {
        handleFileUpload(file);  // Pass the file directly to context for handling
      }
    });
  };

  // Render the Instagram projects tab
  const renderInstagramTab = () => (
    <div className="flex  justify-center gap-10 mt-5">
      <div className="w-[278px] h-[60vh] bg-smoke text-black p-3 overflow-auto">
        <p className="text-md">Selected projects from Instagram</p>
        <p className="text-light-grey">{selectionState.svgSelected.length || "0"} selected</p>
        <div className="grid grid-cols-2 gap-2 mt-4">
        {selectionState.svgSelected.map((project) => (
  <div key={project.id} className="flex justify-center items-center">
    <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center">
      {project.imageUrl && project.imageUrl.startsWith("data:image/svg+xml") ? (
        <Image
          src={project.imageUrl}
          alt={`Project ${project.id}`}
          width={200}
          height={32}
          className="object-contain w-full h-full"
        />
      ) : (
        <p>Invalid image data</p>
      )}
    </div>
  </div>
))}

        </div>
      </div>

      <div className="w-[70vw] h-[70vh] text-black rounded-md p-5 overflow-hidden">
        <p className="ml-0 mt-3 mb-5 text-md">Show entire list of Instagram projects</p>
        <div className="overflow-y-auto h-full">
          <div className="grid grid-cols-5 gap-2 w-full">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex justify-center items-center cursor-pointer"
              >
                <div
                  className="w-[200px] h-[200px] border-2 border-light-grey rounded-md flex justify-center items-center"
                  onClick={() => handleProjectClick(project)}
                >
                  <Image
                    src={project.path}
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
  );

  // Render the file upload tab
  const renderUploadTab = () => (
    <div className="flex gap-10 mt-5">
      <div className="w-[278px] h-[60vh] bg-smoke text-black p-3 overflow-auto">
        <p className="text-md">Selected Files for Upload</p>
        <p className="text-light-grey">{selectionState.uploadedFiles.length} selected</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {selectionState.uploadedFiles.map((file, index) => (
            <div key={index} className="flex justify-center items-center">
              <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center">
                {file.fileData && file.fileData.startsWith("data:image/") ? (
                  <Image
                    src={file.fileData}
                    alt={file.fileName}
                    width={200}
                    height={150}
                    className="object-contain"
                  />
                ) : file.fileData && file.fileData.startsWith("data:video/") ? (
                  <video
                    src={file.fileData}
                    controls
                    width={200}
                    height={150}
                    className="object-contain"
                  />
                ) : file.fileData && file.fileData.startsWith("data:image/svg+xml") ? (
                  <div dangerouslySetInnerHTML={{ __html: file.fileData }} />
                ) : (
                  <span>Invalid file type</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[70vw] h-[70vh] text-black rounded-md p-5 overflow-hidden">
        <div className="flex justify-center items-center h-full">
          <label
            htmlFor="file-upload"
            className="cursor-pointer w-[200px] h-[200px] border-2 border-light-grey rounded-md flex justify-center items-center"
          >
            <span className="mt-2 text-dark-grey text-2xl">Upload</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*,image/svg+xml"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[77vh] bg-gray-200 w-full space-x-8 overflow-x-hidden overflow-y-hidden">
      <div className="flex mx-auto items-start">
        <p className="text-2xl text-black">Pick content that you wish to highlight in your profile kit</p>
      </div>

      <div className="flex w-full border-b border-gray-300 mt-5 items-center">
        <button
          onClick={() => handleTabClick("instagram")}
          className={`flex-1 py-2 text-lg font-semibold text-center flex items-center justify-center gap-2 ${
            selectedTab === "instagram"
              ? "text-electric-blue border-b-2 border-electric-blue"
              : "text-gray-500"
          }`}
        >
          <Image
            src="/assets/icons/onboarding/Instagram.svg"
            alt="Instagram Icon"
            width={30}
            height={34}
          />
          Instagram
        </button>
        <button
          onClick={() => handleTabClick("upload")}
          className={`flex-1 py-2 text-lg font-semibold text-center flex items-center justify-center gap-2 ${
            selectedTab === "upload"
              ? "text-electric-blue border-b-2 border-electric-blue"
              : "text-gray-500"
          }`}
        >
          <Image
            src="/assets/icons/onboarding/upload.svg"
            alt="Upload Icon"
            width={30}
            height={34}
          />
          Upload
        </button>
      </div>

      {selectedTab === "instagram" ? renderInstagramTab() : renderUploadTab()}
    </div>
  );
}
