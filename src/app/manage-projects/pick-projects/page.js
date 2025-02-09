"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchInstagramMedia } from "@/utils/fetchInstagramMedia";
import { getMediaFromDatabase } from "@/utils/getMediaFromDatabase";
import Slider from "react-slick"; 
import MediaDisplay from "@/components/MediaDisplay";
import { useSelectedProjects } from "../context";
import { useRouter } from "next/navigation";
import SvgComponent from "@/components/svg/Instagramsvg";
import Uploadsvg from "@/components/svg/Uploadsvg";
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
    removeInstagramSelection, 
    removeFile
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
      const totalSelected = selectionState.instagramSelected.length + selectionState.uploadedFiles.length;

      console.log("Total selected:", totalSelected);
      
      if (totalSelected >= 4) {
        router.push("/manage-projects/add-details");
      } else {
        alert("Please select at least 4 projects before proceeding.");
      }
    };

    const isDisabled = selectionState.instagramSelected.length + selectionState.uploadedFiles.length < 4;
    
   
    const handleBackClick = () => {
     router.push("/profile")  
    }

const renderInstagramTab = () => (
  <div className="flex justify-center gap-10 mt-5">  

    <div className="w-[278px] h-full bg-white text-black p-3 rounded-lg" >
      <p className="text-md font-apfel-grotezk-regular">Selected projects from Instagram</p>
      <p className="text-light-grey font-apfel-grotezk-regular">{selectionState?.instagramSelected?.length || "0"} Selected</p>

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

    <div className="w-[70vw] h-[70vh] text-black rounded-md overflow-y-auto"  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
    <MediaDisplay media={media} displayType="instagram"/>
    </div>


  </div>
);

const renderUploadTab = () => (
  <div className="flex gap-10 mt-5">
    <div className="w-[278px] h-[60vh] bg-white text-black p-3 rounded-lg">
      {/* Header section */}
      <div>
        <p className="text-md font-apfel-grotezk-regular">Selected Files for Upload</p>
        <p className="text-light-grey font-apfel-grotezk-regular">{selectionState?.uploadedFiles?.length || "0"} selected</p>
      </div>

      {/* Border line */}
      <div className="mt-[18px] w-auto border-b border-1 border-gray-200"></div>

      {/* Scrollable area */}
      <div className="mt-5 h-[calc(60vh-120px)] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="grid grid-cols-2 gap-2">
          {selectionState.uploadedFiles.map((file, index) => (
            <div key={index} className="flex flex-col justify-center items-center">
              <div className="w-full h-full border-2 border-light-grey rounded-lg flex justify-center items-center">
                {/* Check if the file is an image */}
                {file.fileUrl?.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
                  <Image
                    src={file.fileUrl}
                    alt={file.fileName}
                    width={200}
                    height={50}
                    className="bg-cover h-36"
                  />
                ) : file.fileUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  /* Check if the file is a video */
                  <video
                    src={file.fileUrl}
                    controls
                    width={200}
                    height={50}
                    className="object-cover h-36"
                  />
                ) : (
                  <span>Invalid file type</span>
                )}
              </div>

              <button
                onClick={() => removeFile(file.mediaId)}
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
        </div>
      </div>
    </div>

    {/* Upload area */}
    <div className="w-[70vw] h-[70vh] text-black rounded-md pt-1">
      <div className="flex gap-6 7xl:justify-center  h-full">
        <label
          htmlFor="file-upload"
          className="cursor-pointer w-[200px] h-[200px] border-2 border-light-grey rounded-md flex justify-center items-center"
        >
          <div className="flex flex-col justify-center items-center">
          <span className="font-qimano text-xl">Upload your files</span>
          <span className="font-apfel-grotezk-regular text-sm text-light-grey px-3">Only png, jpg, and .mp4 files <span className="mx-auto ml-10 font-apfel-grotezk-mittel">of max limit 5mb</span></span>
          <span className="mt-2 text-dark-grey text-2xl">
            <Image
              src="/assets/images/Upload-folder.svg"
              alt="Upload Icon"
              width={44}
              height={44}
              className="h-20 w-[200px]"
              loading="eager"
              priority
            />
          </span>
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*,image/svg+xml"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
         <MediaDisplay uploadedFiles={selectionState.uploadedFiles}  displayType="uploaded"/>
      </div>
    </div>
  </div>
);


return (
    <div className="flex flex-col h-[77vh] max-w-[1800px] 7xl:max-w-[2500px] mx-auto bg-smoke w-full space-x-8 overflow-hidden" >
      
      <div className="flex flex-col mx-auto items-start text-graphite">
        <p className="text-2xl text-black font-qimano">
          Pick content that you wish to highlight in your profile kit
        </p>
        <span className="mx-auto font-qimano ">
  {(selectionState?.instagramSelected?.length || 0) + (selectionState?.uploadedFiles?.length || 0)} / 12 Selected
</span>

      </div>

      <div className="flex w-full border-b border-gray-300 mt-0 items-center ">
      <button
          onClick={() => handleTabClick("instagram")}
          className={`flex-1 py-2 text-md font-semibold text-center flex items-center justify-center ${
            selectedTab === "instagram"
              ? "text-electric-blue border-b-2 border-electric-blue"
              : "text-gray-500"
          }`}
        >
        <SvgComponent
        style={{
          color: selectedTab === "instagram" ? "blue" : "",
        }}
      />
      Instagram
        </button>

        <button
          onClick={() => handleTabClick("upload")}
          className={`flex-1 py-2 text-md font-semibold text-center flex items-center justify-center ${
            selectedTab === "upload"
              ? "text-electric-blue border-b-2 border-electric-blue"
              : "text-gray-500"
          }`}
        >
        <Uploadsvg
        style={{
          color: selectedTab === "upload" ? "blue" : "", height: "35px"
        }}
      />  
          Upload
        </button>
      </div>

      {/* {renderInstagramTab()} */}
      {selectedTab === "instagram" ? renderInstagramTab() : renderUploadTab()}

      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg border-t border-gray-300 py-1 px-4 mb-2">
  <div className="flex gap-2 justify-center mx-auto">
    <div className="flex gap-2 px-3 py-1.5 justify-center bg-gray-100 rounded-md">
      <button className=" px-4 py-1.5 border-electric-blue border-2 text-electric-blue rounded hover:bg-electric-blue hover:text-white transition-colors" onClick={handleBackClick}>
        Back
      </button>
      <button
        // className={'px-4 py-1.7 bg-electric-blue border-2 text-white rounded-md  transition-colors'}

        className={`px-4 py-1.7 border-2 rounded-md transition-colors 
          ${isDisabled ? "bg-[#6C7FA5] text-light-grey cursor-not-allowed" : "bg-electric-blue text-white"}
        `}
        onClick={handleProjectClick}
        disabled={isDisabled}
      >
        Add Details
      </button>
    </div>
  </div>
</div>


    </div>
  );
}
