"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchInstagramMedia } from "@/utils/fetchInstagramMedia";
import { getMediaFromDatabase } from "@/utils/getMediaFromDatabase";
import Slider from "react-slick"; 
import MediaDisplay from "@/components/MediaDisplay";
import { useSelectedProjects } from "../context";
import { useRouter } from "next/navigation";

export default function PickProjects() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedTab, setSelectedTab] = useState("instagram");
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const router = useRouter();
  const [media, setMedia] = useState([]);
  const { 
    selectionState, 
    handleFileUpload, 
    addInstagramSelection,
    removeInstagramSelection
  } = useSelectedProjects();

  
  useEffect(() => {
    setIsHydrated(true);
  }, []);


  useEffect(() => {
    // Use URLSearchParams to get the query parameters
    // const queryParams = new URLSearchParams(window.location.search);
    // const code = queryParams.get("code");

    // if (code) {
    //   fetchInstagramMedia(code)
    //     .then((mediaData) => setMedia(mediaData))
    //     .catch((error) => alert(error.message));
    // } else {
    //   const mediaData = await getMediaFromDatabase();
    //   setMedia(mediaData);
    // }

    const fetchMedia = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      try {
        if (code) {
          // Call the server action to fetch media using the code
          const mediaData = await fetchInstagramMedia(code);
          console.log("media data", mediaData)
          setMedia(mediaData);
        } else {
          // Call the server action to fetch media from the database
          const mediaData = await getMediaFromDatabase();
          console.log("media from database", mediaData)
          setMedia(mediaData);
        }
      } catch (error) {
        alert(error.message || "An error occurred while fetching media");
      }
    };

    fetchMedia();
  }, []); 

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
          handleFileUpload(file); 
        }
      });
    };

    const handleProjectClick = () => {
      router.push("/manage-projects/add-details");
    }
   
    const handleBackClick = () => {
     router.push("/profile")  
    }

const renderInstagramTab = () => (
  <div className="flex justify-center gap-10 mt-5">  

    <div className="w-[278px] h-full bg-white text-black p-3" >
      <p className="text-md">Selected projects from Instagram</p>
      <p className="text-light-grey">{selectionState?.instagramSelected?.length || "0"}</p>

      <div className="mt-[18px] w-auto border-b border-1 border-gray-200  "> 
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-7 overflow-y-auto max-h-[40vh]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {selectionState?.instagramSelected?.map((project) => (
          <div key={project.mediaId} className="flex flex-col items-center">
            {/* Project Container */}
            <div className="relative w-[120px] h-[120px] rounded-md overflow-hidden">
              {project.name === "VIDEO" ? (
                // Video Content
                <video
                 
                  className="w-full h-full object-cover"
                  src={project.mediaLink}
                >
                  Your browser does not support the video tag.
                </video>
              ) : project.name === "CAROUSEL_ALBUM" && project.children ? (
                // Carousel Content
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
                        
                          className="w-full h-full object-cover"
                          src={child.media_url}
                        />
                      )}
                    </div>
                  ))}

                  {/* Carousel Navigation */}
                  <button
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    onClick={() => handleSlide(project.mediaId, "prev", project.children.length)}
                  >
                    ❮
                  </button>
                  <button
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    onClick={() => handleSlide(project.mediaId, "next", project.children.length)}
                  >
                    ❯
                  </button>
                </div>
              ) : (
                <Image
                  src={project.mediaLink}
                  alt={`Project ${project.mediaId}`}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Delete Button - Outside and below the content */}
            <button
              onClick={() => removeInstagramSelection(project.mediaId)}
              className="mt-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Image
                src="/assets/images/delete.svg"
                alt="delete"
                width={16}
                height={16}
                className="cursor-pointer w-20 h-6"
              />
            </button>
          </div>
        ))}
        <div className="-mb-10"></div>
      </div>
    </div>

    <div className="w-[70vw] h-[70vh] text-black rounded-md p-5 overflow-y-scroll"  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
    <MediaDisplay media={media} />
    </div>


  </div>
);

  const renderUploadTab = () => (
    <div className="flex gap-10 mt-5">
      <div className="w-[278px] h-[60vh] bg-white text-black p-3 overflow-auto">
        <p className="text-md">Selected Files for Upload</p>
        <p className="text-light-grey">{selectionState?.uploadedFiles?.length || "0" } selected</p>

        
        <div className="mt-[18px] w-auto border-b border-1 border-gray-200"> 
        </div>

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

      <div className="w-[70vw] h-[70vh] text-black rounded-md p-5">
        <div className="flex justify-center items-center h-full">
          <label
            htmlFor="file-upload"
            className="cursor-pointer w-[200px] h-[200px] border-2 border-light-grey rounded-md flex justify-center items-center"
          >
            <span className="mt-2 text-dark-grey text-2xl">
            <Image
            src="/assets/icons/onboarding/Upload2.svg"
            alt="Upload Icon"
            width={30}
            height={34}
            className="h-20 w-20"
          />
            </span>
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
    <div className="flex flex-col h-[77vh] bg-smoke w-full space-x-8 overflow-hidden" >
      
      <div className="flex mx-auto items-start">
        <p className="text-2xl text-black font-qimano">
          Pick content that you wish to highlight in your profile kit
        </p>
      </div>

      <div className="flex w-full border-b border-gray-300 mt-5 items-center ">
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

      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg border-t border-gray-300 py-1 px-4">
  <div className="flex gap-2 justify-center mx-auto">
    <div className="flex gap-2 px-2 py-1.5 justify-center bg-gray-100 rounded-md">
      <button className=" px-4 py-1.5 border-electric-blue border-2 text-electric-blue rounded hover:bg-electric-blue hover:text-white transition-colors" onClick={handleBackClick}>
        Back
      </button>
      <button
        className={'px-4 py-1.5 border-electric-blue border-2 text-electric-blue rounded hover:bg-electric-blue hover:text-white transition-colors'}
        onClick={handleProjectClick}
      // Disable if form is incomplete
      >
        Add Details
      </button>
    </div>
  </div>
</div>


    </div>
  );
}
