"use client"
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSelectedProjects } from "../context";
import ProjectsGrid from "@/components/ProjectsGrid";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchMediaInsights } from "@/utils/fetchMediaInsights";
import Popup from "@/components/Popup";
import Uploadsvg from "@/components/svg/Uploadsvg";
import SvgComponent from "@/components/svg/Instagramsvg";

 function PreviewContent() {
  const [activeTab, setActiveTab] = useState("instagram");
  const {
    selectionState,
    handleFileUpload,
    updateFormDataForImage,
    isBrandCollaboration,
    setIsBrandCollaboration
  } = useSelectedProjects();
 // const [activeImageId, setActiveImageId] = useState(null);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [insights, setInsights] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeImageId = searchParams.get("activeImageId");

  const [isModalOpen, setIsModalOpen] = useState(false);
  //const isBrandCollaboration = searchParams.get('isBrandCollaboration');

  const requiredFields = ["titleName", "description", "industries"];
  const handleSubmit = () => {
    setIsModalOpen(true);

  };

  const handleContinueEditing = () => {
    setIsModalOpen(false);
    // Add logic for continue editing
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNextStep = () => {
    setIsModalOpen(false);
    // Add logic for next step data submit
    const finalSubmit = async () => {
      try {
        const response = await fetch('/api/projects/final', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Ensure JSON content type
          },
          body: JSON.stringify({ activeImageId }) // Send the activeImageId in the body
        });
    
        console.log("FormData deleted successfully");
      } catch (error) {
        console.error("Error deleting formData:", error);
        throw error;
      }
    }
finalSubmit();
  };

  const projects = activeTab === "instagram"
  ? selectionState.instagramSelected
  : selectionState.uploadedFiles;

  console.log("CURRENT PROJECTS", projects)

  // const activeProject =
  // activeImageId !== null
  //   ? projects.find((project) => project.mediaId === activeImageId)
  //   : projects[0];
//error activeproject undefined maybe mediais is number in uploadedfile
   
const activeProject =
  activeImageId !== null
    ? projects.find((project) => String(project.mediaId) === String(activeImageId))
    : projects[0];

console.log("preview activeimageid", activeProject,  activeImageId);

  useEffect(() => {
    setIsHydrated(true);
  }, []);


 // Compute status for each project
  const getProjectStatus = (project) => {
    if (activeProject && String(project.mediaId) === String(activeProject.mediaId)) {
      return "Selected";
    }
    const formEntry = selectionState.formData.find(
      (item) => String(item.key) === String(project.mediaId)
    );
    if (formEntry) {
      const isComplete = requiredFields.every((field) => !!formEntry[field]);
      return isComplete ? "Done" : "Draft";
    }
    return "Draft";
  };

  const computedProjects = projects.map((project) => ({
    ...project,
    status: getProjectStatus(project),
  }));

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

  
  const handleBackClick = () => {
   router.push("/manage-projects/add-details")
  }

  return (
    <div className={`flex flex-col items-start h-[77vh] w-full space-x-8 overflow-x-hidden overflow-y-auto ${isModalOpen ? 'bg-transparent pointer-events-none' : 'bg-transparent'}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex flex-col mx-auto items-start">
        <p className="text-2xl text-black font-qimano">
          Pick content that you wish to highlight in your profile kit
        </p>
        <p className="mx-auto h-7 text-black font-apfel-grotezk-regular">
          
        </p>
      </div>

      <div className="flex justify-center 7xl:min-w-[93%] mx-auto">
        
      <div className="flex flex-row font-apfel-grotezk-regular">
      {/* <div className="w-[278px] bg-white text-black p-3 rounded-lg">
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

          <div className="mt-4 h-full  " style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} >
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
        </div>       */}

<div className="w-[278px] bg-white text-black p-3 rounded-lg 5xl:h-[700px]">
          <div className="flex justify-between items-center border-b w-[260px]  border-light-grey">
            <button
              className={`relative px-4 py-2 text-lg font-medium ${
                activeTab === "instagram" ? "text-electric-blue" : "text-light-grey"
              }`}
              onClick={() => setActiveTab("instagram")}
            >
              <div className="flex justify-center items-center ml-4 font-apfel-grotezk-regular">
             <SvgComponent
              style={{
                color: activeTab === "instagram" ? "blue" : "",
              }}
            />
              IG
              </div>
              
              {activeTab === "instagram" && (
                <span className="absolute bottom-[-1px] left-0 w-32 h-[2px] bg-electric-blue"></span>
              )}
            </button>
            <button
              className={`relative px-4 py-2 text-lg font-medium ${
                activeTab === "uploaded" ? "text-electric-blue" : "text-light-grey"
              }`}
              onClick={() => setActiveTab("uploaded")}
            >
             <div className="flex justify-center items-center font-apfel-grotezk-regular">
             <Uploadsvg
            style={{
              color: activeTab === "upload" ? "blue" : "", height: "35px"
            }}
          />  
              Uploaded
              </div>
              {activeTab === "uploaded" && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-electric-blue"></span>
              )}
            </button>
          </div>

          <div className="mt-4 h-full  " style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} >
            <p className="text-md">Selected Projects</p>
            <p className="text-light-grey text-sm">
              {activeTab === "instagram"
                ? selectionState.instagramSelected.length
                : selectionState.uploadedFiles.length}{" "}
            </p>
            <ProjectsGrid
              projects={computedProjects}
              activeTab={activeTab}
              onProjectClick={handleProjectClick}
              showStatus={true}
            />
          </div>
        </div>

        {/* preview card */}
        <div className="w-[864px] h-[430px]  bg-white ml-28 mt-1 rounded-lg">
          <div className="flex gap-5 ">
           <div className="w-[300px] h-full  ">
           {activeImageId !== null && (
                (() => {
                  const activeProject = projects.find(
                    (project) => String(project.mediaId) === activeImageId
                  );
            
                  if (!activeProject) {
                    return <p className="text-graphite flex justify-center items-center h-[50vh]">No project selected</p>;
                  }

                  if (activeProject.name === "IMAGE") {
                    return (
                      <div className="relative h-[400px] p-5 w-[300px]">
                      <Image
                        src={activeProject.mediaLink}
                        alt={activeProject.name}
                        width={300}
                        height={1200}
                        className=" h-[380px] bg-cover rounded-lg"
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
                  } if (activeProject.name === "IMAGE") {
                    return (
                      <div className="relative h-[400px] p-5 w-[300px]">
                        <Image
                          src={activeProject.mediaLink}
                          alt={activeProject.name}
                          width={300}
                          height={1200}
                          className="h-[380px] bg-cover rounded-lg"
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
                          className="h-[400px] object-cover rounded-lg"
                        />
                      </div>
                    );
                  } else if (activeProject.name === "CAROUSEL_ALBUM") {
                    return (
                      <div className="relative h-[400px] p-5 w-[300px] rounded-lg overflow-hidden">
                        {activeProject.children.map((child, index) => (
                          <div
                            key={child.id}
                            className={`absolute inset-0 transition-transform duration-500 h-full w-full ${
                              (carouselIndexes[activeProject.mediaId] || 0) === index
                                ? "translate-x-0 opacity-100"
                                : "translate-x-50 opacity-0"
                            }`}
                            style={{ padding: '20px' }} // Add padding here
                          >
                            {child.media_type === "IMAGE" ? (
                              <div className="flex justify-center items-center h-full w-full rounded-lg">
                                <Image
                                  src={child.media_url}
                                  alt={`Media ${child.id}`}
                                  width={300}
                                  height={400}
                                  className="h-full w-full rounded-lg bg-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex justify-center items-center h-full w-full rounded-lg">
                                <video
                                  controls
                                  className="h-full w-full rounded-lg object-cover"
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
                          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
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
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
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
                              <div className="relative h-[400px] p-5 w-[300px]">
                                {activeProject.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                  <Image
                                    src={activeProject.fileUrl}
                                    alt={activeProject.fileName}
                                    width={200}
                                    height={150}
                                    className="h-[350px] w-full bg-cover rounded-lg"
                                  />
                                ) : (
                                  <video
                                    src={activeProject.fileUrl}
                                    controls
                                    width={200}
                                    height={150}
                                    className="h-[350px] w-full object-cover rounded-lg"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </div>
                            );
                          }
            
                  return null;
                })()
              )}
           </div>

           <div className="w-full h-full mt-5">

            <p className="text-2xl text-graphite font-qimano">{Array.isArray(selectionState?.formData) 
    ? selectionState.formData.find(item => item.key === activeProject?.mediaId)?.titleName || "Title of the project"
    : "Loading..."}</p>

            <div className="flex gap-1 flex-wrap max-w-[380px]">

          {Array.isArray(selectionState?.formData) &&
            selectionState.formData.find((item) => item.key === activeImageId)?.industries?.length > 0 ? (
              selectionState.formData
                .find((item) => item.key === activeImageId)
                ?.industries.map((industry, index) => (
                  <span
                    key={index}
                    className="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium"
                  >
                    {industry}
                  </span>
                ))
            ) : (
              <span>Industry</span>
            )}
          </div>

          <div className="w-full border-b-[0.5px] border-gray-300 mt-4"></div>

          <div  className={`flex items-center space-x-4 ${
    selectionState?.formData?.find(item => item.key === activeImageId)
      ?.isBrandCollaboration
      ? "mt-[3rem]"
      : "mt-[0]"
  }`}>
  {/* Logo */}
  <div className="flex items-center">

        
  <div className="pointer-events-auto">
      {isModalOpen && (
        <Popup onClose={handleCloseModal} onContinueEditing={handleCloseModal} onNextStep={handleNextStep} />
      )}
  </div> 

{selectionState?.formData?.find(item => item.key === activeImageId)?.isBrandCollaboration && (
  <div className="brand-collaboration-section flex gap-3">
    {/* Company Logo */}
    {selectionState?.formData?.find(item => item.key === activeImageId)?.companyLogo ? (
      // Display the company logo if available
      <Image
        src={selectionState.formData.find(item => item.key === activeImageId).companyLogo}
        width={50}
        height={50}
        alt="Company Logo"
        className="h-12 w-12 bg-cover rounded-full"
      />
    ) : (
      // Display the default image if no company logo is selected
      <Image
        src="/assets/images/logo.svg"
        width={50}
        height={50}
        alt="CAI Logo"
        className="h-12 w-12 object-contain rounded-full"
      />
    )}

    {/* Divider */}
    <div className="h-12 border-l border-gray-400"></div>

    {/* Text Details */}
    <div className="text-gray-500 text-sm space-y-1">
    <p>
  {selectionState?.formData?.find(item => item.key === activeImageId) && (
    <>
      • <span className="text-graphite">
        {selectionState?.formData?.find(item => item.key === activeImageId)?.companyName || "Name of company"}
      </span>{" "}
      • {selectionState?.formData?.find(item => item.key === activeImageId)?.companyLocation || "Location of company"}
    </>
  )}
</p>

<p>
  {selectionState?.formData?.find(item => item.key === activeImageId) && (
    <>
      • {selectionState?.formData?.find(item => item.key === activeImageId)?.companyLocation || "Location of company"}
      {selectionState?.formData?.find(item => item.key === activeImageId)?.eventTypes?.length > 0 && (
        <>
         {"   • "}
          {selectionState?.formData?.find(item => item.key === activeImageId)?.eventTypes?.map((eventType, index) => (
            <span key={index} className="px-1 text-sm">
              {eventType}
            </span>
          ))}
        </>
      )}
    </>
  )}
</p>

    </div>
  </div>
)}

          </div>
          </div>

          <p className={`${isBrandCollaboration ? 'text-graphite mr-3  mt-5' : 'text-graphite mr-3 mt-0'}`}> {selectionState?.formData?.find(item => item.key === activeImageId)?.description || "Description of the project"}</p>

          <div  className={`w-full border-b-[0.5px] border-gray-300 ${selectionState?.formData?.find(item => item.key === activeImageId)?.isBrandCollaboration ? "mt-8" : "mt-40"}`}></div>

          
<div className="mt-5 ml-20 flex gap-20 justify-center items-center text-black w-[300px]">     
{/* {insights &&
    insights.map((item) => (
      <div key={item.name} className="flex-col text-center">
        <p className="text-[19px]">{item.values[0]?.value || 0}</p>
        <p className="text-[12px] text-gray-500">{item.title}</p>
      </div>
    ))} */}

{insights &&
  insights.map((item) => (
    <div key={item.name} className="flex-col text-center">
      <p className="text-[19px]">
        {projects === selectionState.uploads ? 0 : item.values[0]?.value || 0}
      </p>
      <p className="text-[12px] text-gray-500">{item.title}</p>
    </div>
  ))
}
            </div>
           </div>           
            
          </div>
        </div>


        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 h-[67px] bg-white rounded-lg w-[210px] border-t border-gray-300 py-2 mb-2">
  <div className="flex gap-2 justify-center items-center mx-auto">
    <div className="flex gap-2 w-[180px] h-[50px] justify-center bg-gray-100 rounded-lg p-2">
      <button className="w-[72px] px-4 py-1 border-electric-blue border-2 text-electric-blue rounded hover:bg-blue-700 transition-colors  " onClick={handleBackClick}>
        Back
      </button>

      <div>
            <button
              className="px-5 py-1 bg-electric-blue text-white rounded hover:bg-electric-blue transition-colors pointer-events-auto"
              onClick={handleSubmit}
            >
              Save
            </button>
      
          </div>
          </div>
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


