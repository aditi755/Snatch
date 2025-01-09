"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchInstagramMedia } from "@/utils/fetchInstagramMedia";
import Slider from "react-slick"; 
import MediaDisplay from "@/components/MediaDisplay";
import { useSelectedProjects } from "../context";

export default function PickProjects() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedTab, setSelectedTab] = useState("instagram");
  const [carouselIndexes, setCarouselIndexes] = useState({});
  
  const [media, setMedia] = useState([]);
  const { 
    selectionState, 
    handleFileUpload, 
    addInstagramSelection,
  } = useSelectedProjects();

  
  useEffect(() => {
    setIsHydrated(true);
  }, []);


  useEffect(() => {
    // Use URLSearchParams to get the query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    if (code) {
      fetchInstagramMedia(code)
        .then((mediaData) => setMedia(mediaData))
        .catch((error) => alert(error.message));
    }
  }, []); // Run only once on mount

  if (!isHydrated) {
    return null;
  }

  const handleTabClick = (tab) => setSelectedTab(tab);

  
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


    // Handle file selection and upload (No SVG to base64 conversion here)
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        if (file) {
          handleFileUpload(file);  // Pass the file directly to context for handling
        }
      });
    };

  const renderInstagramTab = () => (
    <div className="flex justify-center gap-10 mt-5">
      <div className="w-[278px] h-[60vh] bg-white text-black p-3 overflow-auto">
        <p className="text-md">Selected projects from Instagram</p>
        <p className="text-light-grey"> {selectionState.instagramSelected.length}</p>
        <div className="grid grid-cols-2 gap-2 mt-4">
        {selectionState.instagramSelected.map((project) => (
  <div key={project.mediaId} className="flex justify-center items-center">
    <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center">
      {project.mediaLink ? (
        project.name === "VIDEO" ? (
          <video
            controls
            className="object-contain w-full h-full"
            src={project.mediaLink}
          >
            Your browser does not support the video tag.
          </video>
        ) : project.name === "CAROUSEL_ALBUM" && project.children ? (
          <div className="relative w-full h-full">
            {project.children.map((child, index) => (
              <div
                key={child.id}
                className={`absolute inset-0 transition-transform duration-500 ${
                  (carouselIndexes[project.mediaId] || 0) === index
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }`}
              >
                {child.media_type === "IMAGE" ? (
                  <Image
                    src={child.media_url}
                    alt={`Media ${child.id}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={child.media_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {project.children.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    (carouselIndexes[project.mediaId] || 0) === index
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
              onClick={() =>
                handleSlide(project.mediaId, "prev", project.children.length)
              }
            >
              ❮
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
              onClick={() =>
                handleSlide(project.mediaId, "next", project.children.length)
              }
            >
              ❯
            </button>
          </div>
        ) : (
          <Image
            src={project.mediaLink}
            alt={`Project ${project.mediaId}`}
            width={200}
            height={150}
            className="object-contain w-full h-full"
          />
        )
      ) : (
        <p>Invalid media data</p>
      )}
    </div>
  </div>
))}

          
        </div>
      </div>

      <div className="w-[70vw] h-[70vh] text-black rounded-md p-5 overflow-y-scroll">
        <p className="ml-0 mt-3 mb-5 text-md">
          Show the entire list of Instagram projects
        </p>

         {console.log("media from pick-project", media)}
          <MediaDisplay media={media} />


      </div>
    </div>
  );


  const renderUploadTab = () => (
    <div className="flex gap-10 mt-5">
      <div className="w-[278px] h-[60vh] bg-white text-black p-3 overflow-auto">
        <p className="text-md">Selected Files for Upload</p>
        <p className="text-light-grey">{selectionState.uploadedFiles.length} selected</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
        {selectionState.uploadedFiles.map((file, index) => (
  <div key={index} className="flex justify-center items-center">
    <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center">
      {/* Check if the file is an image */}
      {file.fileUrl?.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
        <Image
          src={file.fileUrl}
          alt={file.fileName}
          width={200}
          height={150}
          className="object-contain"
        />
      ) : file.fileUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
        /* Check if the file is a video */
        <video
          src={file.fileUrl}
          controls
          width={200}
          height={150}
          className="object-contain"
        />
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
    <div className="flex flex-col h-[77vh] bg-smoke w-full space-x-8 overflow-x-hidden overflow-y-scroll">
      <div className="flex mx-auto items-start">
        <p className="text-2xl text-black font-qimano">
          Pick content that you wish to highlight in your profile kit
        </p>
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
            src="/assets/icons/onboarding/Upload2.svg"
            alt="Upload Icon"
            width={30}
            height={34}
          />
          Upload
        </button>
      </div>

      {/* {renderInstagramTab()} */}
      {selectedTab === "instagram" ? renderInstagramTab() : renderUploadTab()}

    </div>
  );
}
