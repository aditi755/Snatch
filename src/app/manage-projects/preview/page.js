"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelectedProjects } from "../context";
import ProjectsGrid from "@/components/ProjectsGrid";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchMediaInsights } from "@/utils/fetchMediaInsights";

 function PreviewContent() {
  const [activeTab, setActiveTab] = useState("instagram");
  const {
    selectionState,
    handleFileUpload,
    updateFormDataForImage,
  } = useSelectedProjects();
 // const [activeImageId, setActiveImageId] = useState(null);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [insights, setInsights] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeImageId = searchParams.get("activeImageId");

  const projects = activeTab === "instagram"
  ? selectionState.instagramSelected
  : selectionState.uploadedFiles;

  const activeProject =
  activeImageId !== null
    ? projects.find((project) => project.mediaId === activeImageId)
    : projects[0];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

    // Fetch insights whenever the active project changes
    useEffect(() => {
      if (activeProject) {
        const fetchData = async () => {
          const response = await fetchMediaInsights(activeProject.mediaId);
          setInsights(response?.insights?.data || []);
        };
        fetchData();
      }
    }, [activeProject]);

  if (!isHydrated) {
    return null;
  }

  // const handleProjectClick = (projectId) => {
  //   setActiveImageId(projectId);
  // };

  const handleProjectClick = (projectId) => {
    // Update the URL with the new activeImageId
    router.push(`/manage-projects/preview?activeImageId=${projectId}`);
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
  
  const handleBackClick = () => {
   router.push("/manage-projects/add-details")
  }

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
          <div className="flex justify-between items-center border-b border-light-grey">
            <button
              className={`relative px-4 py-2 text-lg font-medium ${
                activeTab === "instagram" ? "text-electric-blue" : "text-light-grey"
              }`}
              onClick={() => setActiveTab("instagram")}
            >
              <div className="flex justify-center items-center">
              <Image src="/assets/images/instagram.svg" alt="instagram" width={10} height={10} className="w-10 h-4" />
              IG
              </div>
              
              {activeTab === "instagram" && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-electric-blue"></span>
              )}
            </button>
            <button
              className={`relative px-4 py-2 text-lg font-medium ${
                activeTab === "uploaded" ? "text-electric-blue" : "text-light-grey"
              }`}
              onClick={() => setActiveTab("uploaded")}
            >
             <div className="flex justify-center items-center">
              <Image src="/assets/images/upload-icon.svg" alt="instagram" width={10} height={10} className="w-10 h-4" />
              Uploaded
              </div>
              {activeTab === "uploaded" && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-electric-blue"></span>
              )}
            </button>
          </div>

          <div className="mt-4 overflow-y-scroll overflow-x-hidden h-[400px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} >
            <p className="text-md font-semibold">Selected Projects</p>
            <p className="text-light-grey text-sm">
              {activeTab === "instagram"
                ? selectionState.instagramSelected.length
                : selectionState.uploadedFiles.length}{" "}
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
        <div className="w-[864px] bg-white ml-28 mt-5 rounded-lg">
          <div className="flex gap-5 ">
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
                        className=" h-[380px] object-cover rounded-lg"
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
                        className=" h-[400px] object-cover rounded-lg"
                      />
                      </div>
                    );
                  } else if (activeProject.name === "CAROUSEL_ALBUM") {
                    return (                    
                      <div className="relative h-[400px] p-5 w-[300px] rounded-lg overflow-hidden">
  {activeProject.children.map((child, index) => (
    <div
      key={child.id}
      className={`absolute inset-0 transition-transform duration-500 h-[580px] -mt-[90px] rounded-lg bg-red-500 ${
        (carouselIndexes[activeProject.mediaId] || 0) === index
          ? "translate-x-0 opacity-100"
          : "translate-x-50 opacity-0"
      }`}
    >
      {child.media_type === "IMAGE" ? (
        <div className="flex justify-center items-center h-full w-full rounded-lg">
          <Image
            src={child.media_url}
            alt={`Media ${child.id}`}
            width={300}
            height={400}
            className="object-contain h-[500px] w-full rounded-lg"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full rounded-lg">
          <video
            controls
            className="object-contain h-full w-full rounded-lg"
            src={child.media_url}
          >
            Your browser does not support the video tag.
          </video>
        </div>
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
  <div className="h-12 border-l border-gray-400"></div>

  {/* Text Details */}
  <div className="text-gray-500 text-sm space-y-1">
  <p>
  •{" "}
  <span className="text-graphite">
    {selectionState?.formData?.[activeImageId]?.companyName || "Name of company"}
  </span>{" "}
  • {selectionState?.formData?.[activeImageId]?.companyLocation || "Location of company"}
</p>
    <p>• Casa Cai Mumbai • Launch Event</p>
  </div>
          </div>

          <p className="text-graphite mt-5">{selectionState?.formData?.[activeImageId]?.description || "Description of the project"}</p>

          <div className="w-full border-b-2 border-gray-300 mt-8"></div>

          
<div className="mt-5 ml-20 flex gap-20 justify-center items-center text-black w-[300px]">     
{insights &&
    insights.map((item) => (
      <div key={item.name} className="flex-col text-center">
        <p className="text-[19px]">{item.values[0]?.value || 0}</p>
        <p className="text-[12px] text-gray-500">{item.title}</p>
      </div>
    ))}
            </div>
           </div>           
            
          </div>
        </div>


        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 h-[67px] bg-white rounded-lg w-[210px] border-t border-gray-300 py-2">
  <div className="flex gap-2 justify-center items-center mx-auto">
    <div className="flex gap-2 w-[180px] h-[50px] justify-center bg-gray-100 rounded-lg p-2">
      <button className="w-[72px] px-4 py-1 border-electric-blue border-2 text-electric-blue rounded hover:bg-blue-700 transition-colors  " onClick={handleBackClick}>
        Back
      </button>
      <button className="px-4 py-1 bg-electric-blue text-white rounded hover:bg-electric-blue  transition-colors">
        Submit
      </button>
    </div>
  </div>
       </div>


      </div>
    </div>
  );
}



export default function Preview() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}



// <div className="relative h-[400px] p-5 w-[300px] rounded-lg">
                      //   {activeProject.children.map((child, index) => (
                      //     <div
                      //       key={child.id}
                      //       className={`absolute inset-0 transition-transform duration-500 h-[400px] rounded-lg ${
                      //         (carouselIndexes[activeProject.mediaId] || 0) === index
                      //           ? "translate-x-0 opacity-100"
                      //           : "translate-x-50 opacity-0"
                      //       }`}
                      //     >
                      //       {child.media_type === "IMAGE" ? (
                      //         <Image
                      //           src={child.media_url}
                      //           alt={`Media ${child.id}`}
                      //           fill
                      //           className="object-cover h-[400px] p-5 rounded-lg"
                      //         />
                      //       ) : (
                      //         <video
                      //           controls
                      //           className=" object-cover h-[400px] p-5 rounded-lg"
                      //           src={child.media_url}
                      //         >
                      //           Your browser does not support the video tag.
                      //         </video>
                      //       )}
                      //     </div>
                      //   ))}
            
                      //   {/* Carousel Navigation */}
                      //   <button
                      //     className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                      //     onClick={() =>
                      //       handleSlide(
                      //         activeProject.mediaId,
                      //         "prev",
                      //         activeProject.children.length
                      //       )
                      //     }
                      //   >
                      //     ❮
                      //   </button>
                      //   <button
                      //     className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                      //     onClick={() =>
                      //       handleSlide(
                      //         activeProject.mediaId,
                      //         "next",
                      //         activeProject.children.length
                      //       )
                      //     }
                      //   >
                      //     ❯
                      //   </button>
                      // </div>