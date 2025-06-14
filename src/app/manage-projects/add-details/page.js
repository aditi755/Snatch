"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelectedProjects } from "../context";
import TitleWithCounter from "@/components/TitleWithCounter";
import FormInput from "@/components/FormInput";
import MultiSelectInput from "@/components/MultiSelectInput";
import CustomFileInput from "@/components/CustomFileInput";
import { useRouter } from "next/navigation";
import NormalMultiSelect from "@/components/NormalMultiSelect";
import ProjectsGrid from "@/components/ProjectsGrid";
import { industryList, eventTypes } from "@/data/portfolio/industry";
import { fetchMediaInsights } from "@/utils/fetchMediaInsights";
import ProjectCustomFileInput from "@/components/ProjectCustomFileInput";
import SvgComponent from "@/components/svg/Instagramsvg";
import Uploadsvg from "@/components/svg/Uploadsvg";
import {generateFormDataFromUserInput} from "@/utils/generateFormDataFromUserInput";

export default function AddDetails() {
  const {
    selectionState,
    handleFileUpload,
    updateFormDataForMedia,
    handleCompanyLogoUpload,
    toggleIsBrandCollaboration 
  } = useSelectedProjects();

  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("instagram");
  const [carouselIndexes, setCarouselIndexes] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
  const [insights, setInsights] = useState([]);
  const [currentFormData, setCurrentFormData] = useState([
    {
      key: "",
      eventName: "",
      eventLocation: "",
      eventYear: "",
      companyName: "",
      companyLocation: "",
      titleName: "",
      description: "",
      companyLogo: null,
      industries: [],
      eventTypes: [],
      isBrandCollaboration: true,
    },
  ]);
  
  const [isBrandCollaboration, setIsBrandCollaboration] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

// Add this helper function before the return statement
const checkOrientation = (width, height) => {
  return height > width;
};

  const requiredFields = [
    "titleName",
    "description",
    "industries",
  ];

  
  if (isBrandCollaboration) {
    requiredFields.push("companyName", "companyLocation");
  }

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Extracting projects logic here
  const projects =
    activeTab === "instagram"
      ? selectionState.instagramSelected
      : selectionState.uploadedFiles;

      console.log("PROJECTS ON ADD DETAILS PAGE", projects, selectionState.instagramSelected);

      useEffect(() => {
        if (!activeImageId && projects?.length) {
          setActiveImageId(projects[0].mediaId);
        }
      }, []);  
      
      console.log("actieimageid for first time", activeImageId)

  const activeProject =
    activeImageId !== null
      ? projects.find((project) => project.mediaId === activeImageId)
      : projects[0];

  // Auto-select first project's formData when no project is selected

useEffect(() => {
  // Set activeImageId to first project's mediaId on initial load
  if (!activeImageId && projects?.length > 0) {
    const firstProjectId = projects[0].mediaId;
    setActiveImageId(firstProjectId);
    console.log("Setting initial activeImageId:", firstProjectId);
  }
}, [projects]);



// Modify the useEffect that handles form data loading:
useEffect(() => {
  if (!activeImageId) return;

  console.log("Loading form data for mediaId:", activeImageId);
  
  const formDataArray = Array.isArray(selectionState?.formData)
    ? selectionState.formData
    : [];


  // Check if form data exists for this mediaId
  const existingFormData = formDataArray.find(
    (item) => item.key === activeImageId.toString()
  );
  
  if (existingFormData) {
    // If form data exists, load it and ensure all required fields are present
    setCurrentFormData({
      ...existingFormData,
      key: activeImageId.toString(),
      eventName: existingFormData.eventName || "",
      eventLocation: existingFormData.eventLocation || "",
      eventYear: existingFormData.eventYear || "",
      companyName: existingFormData.companyName || "",
      companyLocation: existingFormData.companyLocation || "",
      companyLogo: existingFormData.companyLogo || "",
      companyLogoFileName: existingFormData.companyLogoFileName || "",
      description: existingFormData.description || "",
      eventTypes: existingFormData.eventTypes || [],
      industries: existingFormData.industries || [],
      titleName: existingFormData.titleName || "",
      isDraft: existingFormData.isDraft !== undefined ? existingFormData.isDraft : true,
      isBrandCollaboration: existingFormData.isBrandCollaboration !== undefined 
        ? existingFormData.isBrandCollaboration 
        : true,
    });
    console.log("Loaded existing form data:", existingFormData);
  } else {
    // Initialize with empty values if no existing data
    setCurrentFormData({
      key: activeImageId.toString(),
      eventName: "",
      eventLocation: "",
      eventYear: "",
      companyName: "",
      companyLocation: "",
      companyLogo: "",
      companyLogoFileName: "",
      description: "",
      eventTypes: [],
      industries: [],
      titleName: "",
      isDraft: true,
      isBrandCollaboration: true,
    });
  }
}, [activeImageId, selectionState?.formData]);

// Add this effect to sync isBrandCollaboration with currentFormData 20 april
useEffect(() => {
  if (currentFormData?.isBrandCollaboration !== undefined) {
    setIsBrandCollaboration(currentFormData.isBrandCollaboration);
  }
}, [currentFormData]);

if (!isHydrated) {
    return null;
  }



const handleProjectClick = async (mediaId) => {
  if (mediaId === activeImageId) return;
  setActiveImageId(mediaId);
  
  // Only fetch insights for Instagram files
  if (activeTab === "instagram") {
    const response = await fetchMediaInsights(mediaId);
    setInsights(response?.insights?.data || []);
  } else {
    // Clear insights for uploaded files
    setInsights([]);
  }
};


const handleInputChange = (e, mediaId) => {
  const { name, value } = e.target;
  const formDataKey = mediaId.toString();
  setCurrentFormData((prevData) => {
    const updatedData = { 
      ...prevData,
      key: mediaId, // Ensure key is set
      [name]: value 
    };
    // Only send to backend when user actually changes something
    updateFormDataForMedia(formDataKey, updatedData);
    return updatedData;
  });
};

const handleAddValue = (fieldName, value, mediaId) => {
  const formDataKey = mediaId.toString(); //string convert for update 20 may
  setCurrentFormData((prevData) => {
    const updatedEntry = { 
      ...prevData,
      key: mediaId, // Ensure key is set
      [fieldName]: [...(prevData[fieldName] || []), value] 
    };
    // Only send to backend when user actually adds a value
    updateFormDataForMedia(formDataKey, updatedEntry);
    return updatedEntry;
  });
};

const handleRemoveValue = (fieldName, value, mediaId) => {
   const formDataKey = mediaId.toString();
  setCurrentFormData((prevData) => {
    const currentEntry = Array.isArray(prevData) ? prevData[0] : prevData;
    const currentValues = Array.isArray(currentEntry[fieldName]) ? currentEntry[fieldName] : [];
    const updatedValues = currentValues.filter(item => item !== value);
    
    const updatedEntry = {
      ...currentEntry,
      key: mediaId, // Ensure key is set
      [fieldName]: updatedValues
    };
    
    // Only send to backend when user actually removes a value
    updateFormDataForMedia(formDataKey, updatedEntry);
    return updatedEntry;
  });
};

const handleToggle = () => {
  const newIsBrandCollaboration = !isBrandCollaboration;
  setIsBrandCollaboration(newIsBrandCollaboration);

  // Only update if we have an activeImageId
  if (activeImageId) {
    // Create a new form data entry if it doesn't exist
    const updatedEntry = {
      ...currentFormData,
      key: activeImageId.toString(),
      isBrandCollaboration: newIsBrandCollaboration,
      // Add required empty fields if switching to brand collaboration
      ...(newIsBrandCollaboration ? {
        companyName: currentFormData.companyName || "",
        companyLocation: currentFormData.companyLocation || "",
        eventName: currentFormData.eventName || "",
        eventTypes: currentFormData.eventTypes || [],
      } : {})
    };

    // Force string conversion for mediaId and ensure it's passed correctly
    const mediaIdString = activeImageId.toString();
    console.log("Updating form data for mediaId:", mediaIdString, updatedEntry);
    
    // Call updateFormDataForMedia with string ID
    updateFormDataForMedia(mediaIdString, updatedEntry);

    // Update local state
    setCurrentFormData(updatedEntry);
  }
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


  const handlePreviewClick = () => {
    router.push(
      `/manage-projects/preview/?activeImageId=${activeImageId}`
    );
  };

   const isFormComplete = () => {
    if (!activeImageId) return false; 
  
    // Find the correct form data using the activeImageId
    const formData = selectionState.formData.find((item) => item.key === activeImageId) || {};
  
    // Check if all required fields are filled
    const areRequiredFieldsFilled = requiredFields.every((field) => {
      const value = formData[field];
      return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== ""); // Handle arrays and strings
    });
  
    return areRequiredFieldsFilled;
  };
  


  const handleBackClick = () => {
   router.push("/manage-projects/pick-projects");
  }

  const getProjectStatus = (project) => {
    if (activeProject && project.mediaId === activeProject.mediaId) {
      return "Editing";
    }
    const formEntry = selectionState.formData.find(
      (item) => item.key === project.mediaId
    );
    if (formEntry) {
      const isComplete = requiredFields.every((field) => !!formEntry[field]);
      console.log("iscomplete project", isComplete)
      return isComplete ? "Done" : "Draft";
    }
    return "Draft";
  };

  // Map projects to add a status property
  const computedProjects = projects.map(project => ({
    ...project,
    status: getProjectStatus(project),
  }));
  

const handleUserInput = async () => {
  if (!userInput.trim()) return;
  
  setIsGenerating(true);
  try {
    const result = await generateFormDataFromUserInput(userInput, isBrandCollaboration);
    console.log('AI Response:', result); // Add this debug log
    
    if (!result) {
      throw new Error('No data received from AI');
    }

    // Update form data with AI generated content
    setCurrentFormData(prev => {
      const updatedData = {
        ...prev,
        titleName: result.title || prev.titleName,
        description: result.description || prev.description,
        industries: result.industries || prev.industries,
        ...(isBrandCollaboration ? {
          companyName: result.company_name === 'needs_confirmation' ? '' : result.company_name,
          companyLocation: result.company_location === 'needs_confirmation' ? '' : result.company_location,
          eventName: result.event_name === 'needs_confirmation' ? '' : result.event_name,
          eventTypes: result.event_type ? [result.event_type] : prev.eventTypes,
        } : {})
      };

      // Update backend
      if (activeImageId) {
        updateFormDataForMedia(activeImageId.toString(), updatedData);
      }

      return updatedData;
    });

    // Clear input after successful generation
    setUserInput('');
    
  } catch (err) {
    console.error("AI form generation error:", err); // Add detailed error logging
    alert(`Failed to generate form data: ${err.message}`);
  } finally {
    setIsGenerating(false);
  }
};

// Add these navigation functions near your other handlers
const handlePrevious = () => {
  const currentIndex = projects.findIndex(project => project.mediaId === activeImageId);
  const newIndex = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
  const prevProject = projects[newIndex];
  if (prevProject) {
    setActiveImageId(prevProject.mediaId);
  }
};

const handleNext = () => {
  const currentIndex = projects.findIndex(project => project.mediaId === activeImageId);
  const newIndex = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;
  const nextProject = projects[newIndex];
  if (nextProject) {
    setActiveImageId(nextProject.mediaId);
  }
};

  const handleHamburgerClick = () => {
    setIsMenuVisible((prev) => !prev); // Toggle menu visibility
  };


  const handleProfileClick = () => {
    router.push("/onboarding/step-1");
  };

  const handleNextClick = () => {
    router.push("/manage-projects/pick-projects");
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  }

  const handleSettingClick = () => {
   router.push("/settings")
  }

  return (
    <div className="flex flex-col items-start space-x-8 h-[77vh] w-full overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col mx-auto items-start">
        <p className="text-2xl text-black font-qimano">
          Pick content that you wish to highlight in your profile kit
        </p>
        <p className="mx-auto text-graphite font-apfel-grotezk-regular">
          Fill in details for at least 4 projects
        </p>
      </div>


     <div className="flex justify-center 7xl:min-w-[93%] mx-auto">

     <div className="flex flex-row font-apfel-grotezk-regular mt-8">
        <div className="w-[278px] bg-white text-black p-3 rounded-lg">
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

       
  <div className=" flex ">
    
<div className="w-[258px] ml-20 mt-0 relative  ">

{/* Media and Insights Container */}
<div className="w-[250px] h-auto overflow-hidden rounded-lg  flex items-center">
  <div className="w-full rounded-lg overflow-hidden">
    {/* Media Display */}
    {(activeImageId !== null || projects.length > 0) && (() => {
      if (!activeProject) {
        return (
          <p className="text-graphite flex justify-center items-center h-full">
            No project selected
          </p>
        );
      }

      if (activeProject.name === "IMAGE") {
        return (
          <Image
            src={activeProject.mediaLink}
            alt={activeProject.name}
            width={1080}
            height={1080}
            className={`w-full ${isPortrait ? 'aspect-[4/6]' : 'h-auto'}  object-cover rounded-lg`}
            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
              setIsPortrait(checkOrientation(naturalWidth, naturalHeight));
            }}
          />
        );
      }

      if (activeProject.name === "VIDEO") {
        return (
          <video
            src={activeProject.mediaLink}
            controls
            className={`w-full  ${isPortrait ? 'aspect-[4/6]' : 'h-auto'} object-cover rounded-lg`}
            onLoadedMetadata={(e) => {
              setIsPortrait(checkOrientation(e.target.videoWidth, e.target.videoHeight));
            }}
          />
        );
      }

      if (activeProject.name === "CAROUSEL_ALBUM") {
        return (
          <div className="relative w-full h-auto">
            {activeProject.children.map((child, index) => (
              <div
                key={child.id}
                className={`transition-opacity duration-500 ${
                  (carouselIndexes[activeProject.mediaId] || 0) === index
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                {child.media_type === "IMAGE" ? (
                  <Image
                    src={child.media_url}
                    alt={`Media ${child.id}`}
                    fill
                    className={`w-full object-cover rounded-lg  ${isPortrait ? 'aspect-[4/6]' : 'h-auto'}`}
                    onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                      setIsPortrait(checkOrientation(naturalWidth, naturalHeight));
                    }}
                  />
                ) : (
                  <video
                    src={child.media_url}
                    controls
                    className={`w-full  ${isPortrait ? 'aspect-[4/6]' : 'h-auto'} object-cover rounded-lg`}
                    onLoadedMetadata={(e) => {
                      setIsPortrait(checkOrientation(e.target.videoWidth, e.target.videoHeight));
                    }}
                  />
                )}
              </div>
            ))}
            {/* Navigation buttons remain the same */}
              <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
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
      }

      if (activeProject.fileUrl) {
        return (
          <div className=" w-full rounded-lg overflow-hidden">
            {activeProject.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
              <Image
                src={activeProject.fileUrl}
                alt={activeProject.fileName}
                width={1080}
                height={1080}
                className={` w-full  ${isPortrait ? 'aspect-[4/6]' : 'h-auto'} object-cover`}
                onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                  setIsPortrait(checkOrientation(naturalWidth, naturalHeight));
                }}
              />
            ) : (
              <video
                src={activeProject.fileUrl}
                controls
                className={`  w-full  ${isPortrait ? 'aspect-[4/6]' : 'h-auto'} object-cover rounded-lg`}
                onLoadedMetadata={(e) => {
                  setIsPortrait(checkOrientation(e.target.videoWidth, e.target.videoHeight));
                }}
              />
            )}
          </div>
        );
      }

      return null;
    })()}
  </div>
</div>

 {/* Insights Section - Only for Instagram content */}
{activeTab === "instagram" && insights && insights.length > 0 && (
  <div className="bg-white rounded-lg mt-2 p-4 flex gap-4 justify-center text-black">
    {insights.map((item) => (
      <div key={item.name} className="flex-col text-center">
        <p className="text-[19px]">{item.values[0]?.value || 0}</p>
        <p className="text-[12px] text-gray-500">{item.title}</p>
      </div>
    ))}
  </div>
)}
</div>



        <div className="ml-20 mt-0 flex flex-col gap-8 overflow-y-scroll overflow-x-hidden h-[70vh]  7xl:h-[80vh] 9xl:h-[80vh]   " style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex items-center justify-between ">

  <span className="text-graphite font-apfel-grotezk-mittel">Was it a brand collaboration?</span>

  <div
    className={`flex items-center rounded-full p-1 cursor-pointer w-[60px] ${
      isBrandCollaboration ? 'bg-electric-blue justify-end' : 'bg-gray-300 justify-start'
    }`}
    onClick={handleToggle}
  >
    <div className="bg-white rounded-full w-5 h-5 shadow-sm flex items-center justify-center">
      {isBrandCollaboration ? (
        <Image
          src="/assets/images/thumb-up.svg"
          alt="Thumbs Up"
          width={10}
          height={10}
          className="w-4 h-4"
        />
      ) : (
        <Image
          src="/assets/images/thumb-down.svg"
          alt="Thumbs Down"
          width={10}
          height={10}
          className="w-4 h-4"
        />
      )}
    </div>
  </div>
</div>


<div className="border-b  border-light-grey"></div>

          <MultiSelectInput
            label="Choose Industry (Max 5)"
            data={industryList}
            selectedValues={
              currentFormData?.industries?.length > 0
                ? currentFormData?.industries
                : Array.isArray(selectionState?.formData)
                ? selectionState?.formData.find(item => item.key === activeProject?.mediaId)?.industries || []
                : []
            }
            onAddValue={(value) => handleAddValue("industries", value, activeImageId)}
            onRemoveValue={(value) => handleRemoveValue("industries", value, activeImageId)}
          />

          <TitleWithCounter
            label={"Give it a title"}
            name="titleName"
            value={currentFormData?.titleName || selectionState?.formData[activeProject?.mediaId]?.titleName || ""}
            onChange={(e) => handleInputChange(e, activeImageId)}
          />

          <TitleWithCounter
            name="description"
            label={"Add description"}
            value={currentFormData?.description || selectionState?.formData[activeProject?.mediaId]?.description || ""}
            onChange={(e) => handleInputChange(e, activeImageId)}
          />

          {isBrandCollaboration && (
            <>
              <div className="text-black flex flex-col gap-5">
                <div className="flex flex-row gap-2">
                <p className=" text-md whitespace-nowrap">About Company</p>
                <div className="border-b  border-light-grey w-full mb-3"></div>
                </div>
                <FormInput
                  placeholder="Enter name of company"
                  name="companyName"
                  value={currentFormData?.companyName || selectionState?.formData[activeProject?.mediaId]?.companyName || ""}
                  onChange={(e) => handleInputChange(e, activeImageId)}
                />
                <FormInput
                  placeholder="Enter location of company"
                  name="companyLocation"
                  value={currentFormData?.companyLocation || selectionState?.formData[activeProject?.mediaId]?.companyLocation || ""}
                  onChange={(e) => handleInputChange(e, activeImageId)}
                />
              </div>

              <div className="text-black flex flex-col gap-5">
              <div className="flex flex-row gap-2">
                <p className=" text-md whitespace-nowrap">Upload logo of the Company</p>
                <div className="border-b  border-light-grey w-full mb-3"></div>
                </div>

              <ProjectCustomFileInput
                onFileChange={(uploadedUrl) => console.log("Uploaded URL:", uploadedUrl)}
                placeholder="Upload a company logo from your device"
                iconSrc="/assets/icons/onboarding/Upload.svg"
                label="Upload company logo"
                activeImageId={activeImageId} 
              />
              </div>

              <div className="text-black flex flex-col gap-5">

              <div className="flex flex-row gap-2">
                <p className=" text-md whitespace-nowrap">About the Event</p>
                <div className="border-b  border-light-grey w-full mb-3"></div>
                </div>
                <FormInput
                  placeholder="Name of the event"
                  name="eventName"
                  value={currentFormData?.eventName || selectionState?.formData[activeProject?.mediaId]?.eventName || ""}
                  onChange={(e) => handleInputChange(e, activeImageId)}
                />

                <NormalMultiSelect
                  label="Choose Event type"
                  options={eventTypes}
                  selectedValues={
                    currentFormData?.eventTypes?.length > 0
                      ? currentFormData?.eventTypes
                      : (selectionState?.formData[activeProject?.mediaId]?.eventTypes?.length > 0
                        ? selectionState?.formData[activeProject?.mediaId].eventTypes
                        : [])
                  }
                  onAddValue={(value) => handleAddValue("eventTypes", value, activeImageId)}
                  onRemoveValue={(value) => handleRemoveValue("eventTypes", value, activeImageId)}
                />

                <div className="bg-transparent h-20"></div>
              
              </div>
            </>
          )}

          {/* AI Form Generation Section - New Code Block */}
          <div className="flex flex-col gap-4 bg-white p-4 rounded-lg">
  <p className="text-graphite font-apfel-grotezk-mittel">Test AI Form Generation</p>
  
  <textarea
    className="w-full text-graphite p-2 border border-light-grey rounded-lg min-h-[100px]"
    placeholder="Describe your project or brand collaboration..."
    value={userInput}
    onChange={(e) => setUserInput(e.target.value)}
  />
  
  <button
    className={`px-4 py-2 rounded-lg ${
      isGenerating 
        ? 'bg-gray-300 text-gray-500' 
        : 'bg-electric-blue text-white hover:bg-blue-700'
    }`}
    onClick={handleUserInput}
    disabled={isGenerating || !userInput.trim()}
  >
    {isGenerating ? 'Generating...' : 'Generate Form Data'}
  </button>
</div>

<div className="border-b border-light-grey"></div>

<div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg border-t border-gray-300 py-1 px-4 mb-2">
  <div className="flex gap-2 justify-center mx-auto">
    <div className="flex gap-2 px-3 py-1.5 justify-center bg-gray-100 rounded-md">
        <button onClick={handleNextClick} className="w-[90px] h-[37px] bg-gray-100 text-electric-blue text-2xl font-semibold    text-center">
           Snatch
          </button>
       <button
                  onClick={handleHamburgerClick}
                  className="w-[50px] h-[37px] bg-gray-100 text-electric-blue border  rounded-md mx-auto font-medium hover:bg-transparent relative"
                >
                  <Image
                    className="mx-auto w-8"
                    src="/assets/icons/onboarding/Hamburger.svg"
                    alt="hamburger"
                    width={20}
                    height={20}
                  />
                </button>
      
                {/* Dropdown Menu */}
                {isMenuVisible && (
                  <div className="absolute top-[-260%] left-[-29px] w-[200px] bg-white shadow-lg rounded-md border border-light-grey z-50">
                    <ul className="flex flex-col p-3 gap-2">
                      <li
                        onClick={handleDashboardClick}
                        className="cursor-pointer text-electric-blue hover:bg-gray-100 rounded-md p-2"
                      >
                        Dashboard
                      </li>
                      <li
                        onClick={handleSettingClick}
                        className="cursor-pointer text-electric-blue hover:bg-gray-100 rounded-md p-2"
                      >
                        Settings
                      </li>
                      <li
                        onClick={handleProfileClick}
                        className="cursor-pointer text-electric-blue hover:bg-gray-100 rounded-md p-2"
                      >
                        Profile
                      </li>
                    </ul>
                  </div>
                )}
          <button
          className="px-2 py-1.5 text-electric-blue rounded hover:opacity-80 transition-colors underline underline-offset-4"
          onClick={handlePrevious}
          disabled={projects.length <= 1}
        >
          ← Previous Project
        </button>
        
        <button
          className="px-2 py-1.5 text-electric-blue rounded hover:opacity-80 transition-colors underline underline-offset-4"
          onClick={handleNext}
          disabled={projects.length <= 1}
        >
          Next Project →
        </button>
      <button className=" px-4 py-1.5 border-electric-blue border-2 text-electric-blue rounded hover:bg-electric-blue hover:text-white transition-colors" onClick={handleBackClick}>
        Back
      </button>
      <button
        className={`px-4 py-1.5  ${
          isFormComplete()
            ? "bg-electric-blue text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        } rounded transition-colors`}
        onClick={handlePreviewClick}
        disabled={!isFormComplete()} // Disable if form is incomplete
      >
        See preview
      </button>
    </div>
  </div>
</div>
        </div>

  </div>

      </div>
     </div> 
    </div>
  );
}

