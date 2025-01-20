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

export default function AddDetails() {
  const {
    selectionState,
    handleFileUpload,
    updateFormDataForMedia,
    handleCompanyLogoUpload,
  } = useSelectedProjects();

  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("instagram");
  const [carouselIndexes, setCarouselIndexes] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
  const [insights, setInsights] = useState([]);
  const [currentFormData, setCurrentFormData] = useState({
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
  });
  const [isBrandCollaboration, setIsBrandCollaboration] = useState(false);

  const requiredFields = [
    "titleName",
    "description",
    "industries",
  ];
  
  if (isBrandCollaboration) {
    requiredFields.push("companyName", "companyLocation");
  }

  const handleToggle = () => {
    setIsBrandCollaboration(!isBrandCollaboration);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Extracting projects logic here
  const projects =
    activeTab === "instagram"
      ? selectionState.instagramSelected
      : selectionState.uploadedFiles;

  const activeProject =
    activeImageId !== null
      ? projects.find((project) => project.mediaId === activeImageId)
      : projects[0];

  useEffect(() => {
    if (activeImageId !== null) {
      const savedData =
        selectionState.formData &&
        selectionState.formData[activeImageId]
          ? selectionState.formData[activeImageId]
          : {
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
            };
      setCurrentFormData(savedData);
    }
  }, [activeImageId, selectionState.formData]);

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


  const handleProjectClick = async (mediaId) => {
    setActiveImageId(mediaId);
    const response = await fetchMediaInsights(mediaId);
    setInsights(response?.insights?.data || []);
    if (mediaId) {
      const url = `/manage-projects/add-details?media_id=${mediaId}`;
      //router.push(url, undefined, { shallow: true });
    }
  };

  const handleAddValue = (fieldName, value, mediaId) => {
    const existingData = currentFormData[fieldName] || [];
    if (existingData.includes(value)) {
      return;
    }

    if (existingData.length < 5) {
      const updatedValues = [...existingData, value];
      setCurrentFormData((prevData) => ({
        ...prevData,
        [mediaId]: {
          ...prevData[mediaId],
          [fieldName]: updatedValues,
        },
      }));
      updateFormDataForMedia(mediaId, {
        ...currentFormData[mediaId],
        [fieldName]: updatedValues,
      });
    } else {
      alert("You can only select up to 5 industries.");
    }
  };

  const handleRemoveValue = (fieldName, value, mediaId) => {
    const updatedValues = (currentFormData[fieldName] || []).filter((item) => item !== value);
    updateFormDataForMedia(mediaId, { [fieldName]: updatedValues });
  };

  const handleInputChange = (e, mediaId) => {
    const { name, value } = e.target;
    setCurrentFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [mediaId]: {
          ...prevData[mediaId],
          [name]: value,
        },
      };
      updateFormDataForMedia(mediaId, updatedData[mediaId]);
      return updatedData;
    });
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
    const previewUrl = `/manage-projects/preview/?activeImageId=${activeImageId}`;
    // Navigate to the preview page
    router.push(previewUrl);
  };

  const isFormComplete = () => {
    if (!activeImageId) return false; // No project selected
  
    const formData = selectionState.formData[activeImageId] || {};
  
    // Check if all required fields are filled
    return requiredFields.every((field) => {
      const value = formData[field];
      if (Array.isArray(value)) {
        return value.length > 0; // For arrays (e.g., industries, eventTypes)
      }
      return !!value; // For strings and other fields check that they have a value 
    });
  };

  const handleBackClick = () => {
   router.push("/manage-projects/pick-projects");
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

      <div className="flex flex-row font-apfel-grotezk-regular mt-8">
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

       
        <div className="w-[258px] ml-20 mt-4 relative ">
  {/* Media Container right side */}
  <div
    className="w-full h-full rounded-lg overflow-hidden "
    style={{
      height:
        activeProject?.name === "VIDEO"
          ? "373px" // Adjust height for video
          : "335px", // Auto height for image or carousel
    }}
  >
    {(activeImageId !== null || projects.length > 0) &&
      (() => {
        if (!activeProject) {
          return <p>No project selected</p>;
        }

        if (activeProject.name === "IMAGE") {
          return (
            <Image
              src={activeProject.mediaLink}
              alt={activeProject.name}
              width={20}
              height={20} // Use `fill` to make the image take full width and height bg-cover makes it perfect
              className=" bg-cover rounded-lg w-full h-full" 
            />
          );
        } else if (activeProject.name === "VIDEO") {
          return (
            <video
              src={activeProject.mediaLink}
              controls
              className="w-full h-full object-cover rounded-lg" // Object-cover for videos
            />
          );
        } else if (activeProject.name === "CAROUSEL_ALBUM") {
          return (
            <div className="relative w-full h-full">
              {activeProject.children.map((child, index) => (
                <div
                  key={child.id}
                  className={`absolute inset-0 transition-transform duration-500 ${
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
                      className="object-cover rounded-lg" // Object-cover for carousel images
                    />
                  ) : (
                    <video
                      controls
                      className="w-full h-full object-cover rounded-lg" // Object-cover for carousel videos
                      src={child.media_url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}

              {/* Carousel navigation buttons */}
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
              fill
              className="object-cover rounded-lg" // Object-cover for file images
            />
          );
        }

        return null;
      })()}
  </div>

  {/* Insights Section */}
  <div
    className={`bg-white rounded-lg mt-2 p-4 flex gap-4 justify-center text-black ${
      activeProject?.name === "VIDEO" ? "h-16 mt-0" : "h-16 mt-0"
    }`}
  >
    {insights &&
      insights.map((item) => (
        <div key={item.name} className="flex-col text-center">
          <p className="text-[19px]">{item.values[0]?.value || 0}</p>
          <p className="text-[12px] text-gray-500">{item.title}</p>
        </div>
      ))}
  </div>
</div>


        <div className="ml-20 mt-5 flex flex-col gap-8 overflow-y-scroll overflow-x-hidden h-[400px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex items-center justify-between ">
  <span className="text-graphite">Was it a brand collaboration?</span>
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

          <MultiSelectInput
            label="Choose Industry (Max 5)"
            data={industryList}
            selectedValues={
              currentFormData.industries?.length > 0
                ? currentFormData.industries
                : (selectionState.formData[activeProject?.mediaId]?.industries?.length > 0
                  ? selectionState.formData[activeProject?.mediaId].industries
                  : [])
            }
            onAddValue={(value) => handleAddValue("industries", value, activeImageId)}
            onRemoveValue={(value) => handleRemoveValue("industries", value, activeImageId)}
          />

          <TitleWithCounter
            label={"Give it a title"}
            name="titleName"
            value={currentFormData.titleName || selectionState.formData[activeProject?.mediaId]?.titleName || ""}
            onChange={(e) => handleInputChange(e, activeImageId)}
          />

          <TitleWithCounter
            name="description"
            label={"Add description"}
            value={currentFormData.description || selectionState.formData[activeProject?.mediaId]?.description || ""}
            onChange={(e) => handleInputChange(e, activeImageId)}
          />

          {isBrandCollaboration && (
            <>
              <div className="text-black flex flex-col gap-5">
                <p className=" text-md">About Company</p>
                <FormInput
                  placeholder="Enter name of company"
                  name="companyName"
                  value={currentFormData.companyName || selectionState.formData[activeProject?.mediaId]?.companyName || ""}
                  onChange={(e) => handleInputChange(e, activeImageId)}
                />
                <FormInput
                  placeholder="Enter location of company"
                  name="companyLocation"
                  value={currentFormData.companyLocation || selectionState.formData[activeProject?.mediaId]?.companyLocation || ""}
                  onChange={(e) => handleInputChange(e, activeImageId)}
                />
              </div>

              <div className="text-black flex flex-col gap-5">
                <p className="text-md">Upload logo of the Company</p>
                {/* <ProjectCustomFileInput
                onFileChange={(uploadedUrl) => updateFormDataForMedia({ companyLogo: uploadedUrl })}
                placeholder="Upload a company logo from your device"
                iconSrc="/assets/icons/onboarding/Upload.svg"
                label="Upload company logo"
              /> */}

              <ProjectCustomFileInput
                onFileChange={(uploadedUrl) => console.log("Uploaded URL:", uploadedUrl)}
                placeholder="Upload a company logo from your device"
                iconSrc="/assets/icons/onboarding/Upload.svg"
                label="Upload company logo"
                activeImageId={activeImageId} // Pass the activeImageId
              />
              </div>

              <div className="text-black flex flex-col gap-5">

                <p className=" text-md">About the event</p>
                <FormInput
                  placeholder="Name of the event"
                  name="eventName"
                  value={currentFormData.eventName || selectionState.formData[activeProject?.mediaId]?.eventName || ""}
                  onChange={(e) => handleInputChange(e, activeImageId)}
                />

                <NormalMultiSelect
                  label="Choose Event type"
                  options={eventTypes}
                  selectedValues={
                    currentFormData.eventTypes?.length > 0
                      ? currentFormData.eventTypes
                      : (selectionState.formData[activeProject?.mediaId]?.eventTypes?.length > 0
                        ? selectionState.formData[activeProject?.mediaId].eventTypes
                        : [])
                  }
                  onAddValue={(value) => handleAddValue("eventTypes", value, activeImageId)}
                  onRemoveValue={(value) => handleRemoveValue("eventTypes", value, activeImageId)}
                />
              
              </div>
            </>
          )}

<div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 h-[55px] bg-white rounded-lg w-[250px] border-t border-gray-300 py-2">
  <div className="flex gap-2 justify-center mx-auto">
    <div className="flex gap-2 w-[210px] h-[40px] justify-center bg-gray-100 rounded-sm">
      <button className="w-[72px] px-4 py-1 border-electric-blue border-2 text-electric-blue rounded hover:bg-electric-blue hover:text-white transition-colors" onClick={handleBackClick}>
        Back
      </button>
      <button
        className={`px-4 py-1 ${
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
  );
}



  {/* <button
            onClick={saveFormData}
            className="px-4 py-2 bg-blue-500 rounded text-white bg-electric-blue w-20 mx-auto"
          >
            Save
          </button> */}

           // const saveFormData = () => {
  //   if (activeImageId !== null) {
  //     console.log("saving form data", currentFormData)
  //     updateFormDataForMedia(activeImageId, currentFormData);
  //   }
  // };


  // export default function AddDetails() {
//   const {
//     selectionState,
//     handleFileUpload,
//     updateFormDataForMedia,
//   } = useSelectedProjects();

//   const router = useRouter();

//   const [isHydrated, setIsHydrated] = useState(false);
//   const [activeTab, setActiveTab] = useState("instagram");
//   const [carouselIndexes, setCarouselIndexes] = useState([]);
//   const [activeImageId, setActiveImageId] = useState(null);
//   const [insights, setInsights] = useState([]);
//   const [currentFormData, setCurrentFormData] = useState({
//     eventName: "",
//     eventLocation: "",
//     eventYear: "",
//     companyName: "",
//     companyLocation: "",
//     titleName: "",
//     description: "",
//     companyLogo: null,
//     industries: [],
//     eventTypes: [],
//   });
//   const [isBrandCollaboration, setIsBrandCollaboration] = useState(false);

//   const handleToggle = () => {
//     setIsBrandCollaboration(!isBrandCollaboration);
//   };

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//    // Extracting projects logic here
//    const projects =
//    activeTab === "instagram"
//    ? selectionState.instagramSelected
//    : selectionState.uploadedFiles;
 
 
//  const activeProject =
//  activeImageId !== null
//    ? projects.find((project) => project.mediaId === activeImageId)
//    : projects[0];
 

//   useEffect(() => {
//     if (activeImageId !== null) {
//       console.log("selectionstate fromdata", selectionState.formData, selectionState.formData[activeImageId], activeProject);
//       const savedData =
//         selectionState.formData &&
//         selectionState.formData[activeImageId]
//           ? selectionState.formData[activeImageId]
//           : {
//               eventName: "",
//               eventLocation: "",
//               eventYear: "",
//               companyName: "",
//               companyLocation: "",
//               titleName: "",
//               description: "",
//               companyLogo: null,
//               industries: [],
//               eventTypes: [],
//             };
//       setCurrentFormData(savedData);
//     }
//   }, [activeImageId, selectionState.formData]);

//     // Fetch insights whenever the active project changes and when first time user comes on page
//     useEffect(() => {
//       console.log("active project fetching insights", activeProject);
//       if (activeProject) {
//         const fetchData = async () => {
//           const response = await fetchMediaInsights(activeProject.mediaId);
//           setInsights(response?.insights?.data || []);
//         };
  
//         fetchData();
//       }
//     }, [activeProject]);

//   if (!isHydrated) {
//     return null;
//   }

//   const handleProjectClick = async (mediaId) => {
//     setActiveImageId(mediaId); // Update the active image ID in state
  
//     //server action or api to send activeimageid to db and eftch analytics of image 
//     const response = await fetchMediaInsights(mediaId);
//     console.log("response from fetchMediaInsights", response?.insights);
//     setInsights(response?.insights?.data || []); 
//     if (mediaId) {
//       // Construct the URL with media_id as a query parameter
//       const url = `/manage-projects/add-details?media_id=${mediaId}`;
//       //router.push(url, undefined, { shallow: true }); // This will dynamically update the URL
//     }
//   };


// const handleAddValue = (fieldName, value, mediaId) => {
//   // Ensure the form data for this mediaId exists
//   const existingData = currentFormData[fieldName] || [];
//   if (existingData.includes(value)) {
//     return;
//   }

//   if (existingData.length < 5) {
//     const updatedValues = [...existingData, value];

//     setCurrentFormData((prevData) => ({
//       ...prevData,
//       [mediaId]: {
//         ...prevData[mediaId],
//         [fieldName]: updatedValues,
//       },
//     }));

//     updateFormDataForMedia(mediaId, {
//       ...currentFormData[mediaId],
//       [fieldName]: updatedValues,
//     });
//   } else {
//     alert("You can only select up to 5 industries.");
//   }
// };

// const handleRemoveValue = (fieldName, value,mediaId) => {
//   const updatedValues = (currentFormData[fieldName] || []).filter((item) => item !== value);
//   updateFormDataForMedia(mediaId, { [fieldName]: updatedValues });
// };

// const handleInputChange = (e, mediaId) => {
//   const { name, value } = e.target;

//   // Update the state and also handle formDataForMedia inside the updater
//   setCurrentFormData((prevData) => {
//     const updatedData = {
//       ...prevData,
//       [mediaId]: {
//         ...prevData[mediaId],
//         [name]: value,
//       },
//     };

//     updateFormDataForMedia(mediaId, updatedData[mediaId]);

//     return updatedData; // Ensure state is updated
//   });
// };


//   const handleSlide = (mediaId, direction, totalSlides) => {
//     setCarouselIndexes((prev) => {
//       const currentIndex = prev[mediaId] || 0;
//       const newIndex =
//         direction === "next"
//           ? (currentIndex + 1) % totalSlides
//           : currentIndex === 0
//           ? totalSlides - 1
//           : currentIndex - 1;
//       return { ...prev, [mediaId]: newIndex };
//     });
//   };
 
//   const handleIndustryAdd = (value) => {
//     setCurrentFormData((prevData) => ({
//       ...prevData,
//       industries: [...(prevData.industries || []), value], 
//     }));
//   };
  
//   const handleIndustryRemove = (value) => {
//     setCurrentFormData((prevData) => ({
//       ...prevData,
//       industries: (prevData.industries || []).filter((industry) => industry !== value), 
//     }));
//   };
  

// // For adding/removing event types
// const handleEventTypeAdd = (value) => {
//   setCurrentFormData((prevData) => ({
//     ...prevData,
//     eventTypes: [...(prevData.eventTypes || []), value],
//   }));
// };

// const handleEventTypeRemove = (value) => {
//   setCurrentFormData((prevData) => ({
//     ...prevData,
//     eventTypes: (prevData.eventTypes || []).filter((eventType) => eventType !== value),
//   }));
// };

//   return (
//     <div className="flex flex-col  items-start space-x-8 h-[77vh]  w-full overflow-x-hidden overflow-y-auto ">
//       <div className="flex flex-col mx-auto items-start">
//         <p className="text-2xl text-black font-qimano">
//           Pick content that you wish to highlight in your profile kit
//         </p>
//         <p className="mx-auto text-black">
//           Fill in details for at least 4 projects
//         </p>
//       </div>

//       <div className="flex flex-row font-apfel-grotezk-regular">
//     <div className="w-[278px] bg-white text-black p-3">
//       {/* Tabs */}
//       <div className="flex justify-between items-center border-b border-light-grey">
//         {/* IG Tab */}
//         <button
//           className={`relative px-4 py-2 text-lg font-medium ${
//             activeTab === "instagram" ? "text-electric-blue" : "text-light-grey"
//           }`}
//           onClick={() => setActiveTab("instagram")}
//         >
//           IG
//           {/* Active underline */}
//           {activeTab === "instagram" && (
//             <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-electric-blue"></span>
//           )}
//         </button>

//         {/* Uploaded Tab */}
//         <button
//           className={`relative px-4 py-2 text-lg font-medium ${
//             activeTab === "uploaded" ? "text-electric-blue" : "text-light-grey"
//           }`}
//           onClick={() => setActiveTab("uploaded")}
//         >
//           Uploaded
//           {/* Active underline */}
//           {activeTab === "uploaded" && (
//             <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-electric-blue"></span>
//           )}
//         </button>
//       </div>

//       {/* Content */}
//       <div className="mt-4">
//         <p className="text-md font-semibold">Selected Projects</p>
//         <p className="text-light-grey text-sm">
//         {activeTab === "instagram"
//               ? selectionState.instagramSelected.length
//               : selectionState.uploadedFiles.length}{" "}
//         </p>

//         <ProjectsGrid 
//             projects={projects}
//             activeTab={activeTab}
//             onProjectClick={handleProjectClick}
//             showStatus={true}
//           />
//       </div>
//     </div>


//         <div className="flex flex-row">
//           {/* White Box Container */}
//           <div className="bg-white w-[258px] h-[460px] ml-20 mt-4 flex items-center justify-center relative">
//           {(activeImageId !== null || projects.length > 0) && (
//   (() => {
   

//     if (!activeProject) {
//       return <p>No project selected</p>;
//     }

//     if (activeProject.name === "IMAGE") {
//       return (
//         <Image
//           src={activeProject.mediaLink}
//           alt={activeProject.name}
//           width={500}
//           height={1200}
//           className="absolute bottom-[68px] h-[400px] object-cover"
//         />
//       );
//     } else if (activeProject.name === "VIDEO") {
//       return (
//         <video
//           src={activeProject.mediaLink}
//           controls
//           width={500}
//           height={1200}
//           className="absolute bottom-[68px] h-[400px] object-cover"
//         />
//       );
//     } else if (activeProject.name === "CAROUSEL_ALBUM") {
//       return (
//         <div className="relative w-full h-full">
//           {activeProject.children.map((child, index) => (
//             <div
//               key={child.id}
//               className={`absolute inset-0 transition-transform duration-500 h-[400px] ${
//                 (carouselIndexes[activeProject.mediaId] || 0) === index
//                   ? "translate-x-0 opacity-100"
//                   : "translate-x-50 opacity-0"
//               }`}
//             >
//               {child.media_type === "IMAGE" ? (
//                 <Image
//                   src={child.media_url}
//                   alt={`Media ${child.id}`}
//                   fill
//                   className="object-cover"
//                 />
//               ) : (
//                 <video
//                   controls
//                   className="w-full h-full object-cover"
//                   src={child.media_url}
//                 >
//                   Your browser does not support the video tag.
//                 </video>
//               )}
//             </div>
//           ))}

//           {/* Carousel Navigation */}
//           <button
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
//             onClick={() =>
//               handleSlide(
//                 activeProject.mediaId,
//                 "prev",
//                 activeProject.children.length
//               )
//             }
//           >
//             ❮
//           </button>
//           <button
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
//             onClick={() =>
//               handleSlide(
//                 activeProject.mediaId,
//                 "next",
//                 activeProject.children.length
//               )
//             }
//           >
//             ❯
//           </button>
//         </div>
//       );
//     } else if (activeProject.fileUrl) {
//       return (
//         <Image
//           src={activeProject.fileUrl}
//           alt={activeProject.fileName}
//           width={500}
//           height={1200}
//           className="h-[400px] object-contain"
//         />
//       );
//     }

//     return null;
//   })()
// )}


//     <div className="mt-4 flex gap-4 text-black absolute top-[85%]">
//       {insights && insights.map((item) => (
//         <div key={item.name} className="flex-col text-center">
//           <p>{item.values[0]?.value || 0}</p>
//           <p>{item.title}</p>
//         </div>
//       ))}
//     </div>
//           </div>
//         </div>

//         <div className="ml-20 mt-5 flex flex-col gap-8">
 
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
//         <span className="text-graphite">Was it a brand collaboration?</span>
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: isBrandCollaboration ? '#4CAF50' : '#ccc',
//             borderRadius: '20px',
//             padding: '5px',
//             cursor: 'pointer',
//             width: '60px',
//             justifyContent: isBrandCollaboration ? 'flex-end' : 'flex-start',
//           }}
//           onClick={handleToggle}
//         >
//           <div
//             style={{
//               backgroundColor: 'white',
//               borderRadius: '50%',
//               width: '20px',
//               height: '20px',
//               boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//             }}
//           />
//         </div>
//       </div>


//         <MultiSelectInput
//           label="Choose Industry (Max 5)"
//           data={industryList}
//           selectedValues={
//             currentFormData.industries?.length > 0 
//             ? currentFormData.industries 
//             : (selectionState.formData[activeProject?.mediaId]?.industries?.length > 0 
//               ? selectionState.formData[activeProject?.mediaId].industries 
//               : [])
//           }
          
//           onAddValue={(value) => handleAddValue("industries", value, activeImageId)}
//           onRemoveValue={(value) => handleRemoveValue("industries", value, activeImageId)}
//         />

//           <TitleWithCounter label={"Give it a title"} name="titleName" value={currentFormData.titleName || selectionState.formData[activeProject?.mediaId]?.titleName || ""}
//           onChange={(e) => handleInputChange(e,activeImageId)}/>

//           <TitleWithCounter 
//             name="description" 
//             label={"Add description"} 
//             value={currentFormData.description || selectionState.formData[activeProject?.mediaId]?.description || ""}
//             onChange={(e) => handleInputChange(e,activeImageId)}/>


//        <div className="text-black flex flex-col gap-5">
//             <p className="font-bold text-md">About Company</p>
//             <FormInput
//               placeholder="Enter name of company"
//               name="companyName"
//               value={currentFormData.companyName || selectionState.formData[activeProject?.mediaId]?.companyName || ""}
//               onChange={(e) => handleInputChange(e,activeImageId)}
//             />
//             <FormInput
//               placeholder="Enter location of company"
//               name="companyLocation"
//               value={currentFormData.companyLocation || selectionState.formData[activeProject?.mediaId]?.companyLocation || ""}
//               onChange={(e) => handleInputChange(e,activeImageId)}
//             />
//           </div>

//           <div className="text-black flex flex-col gap-5">
//           <p className="font-bold text-md">Upload logo of the Company</p>
//           {/* <CustomFileInput /> */}
//             </div>


//           <div className="text-black flex flex-col gap-5">
//             <p className="font-bold text-md">About the event</p>

         

//        <NormalMultiSelect 
//         label="Choose Event type"
//         options={eventTypes}
//         selectedValues={
//           currentFormData.eventTypes?.length > 0
//             ? currentFormData.eventTypes
//             : (selectionState.formData[activeProject?.mediaId]?.eventTypes?.length > 0
//               ? selectionState.formData[activeProject?.mediaId].eventTypes
//               : [])
//         }        
//         onAddValue={(value) => handleAddValue("eventTypes", value, activeImageId)}
//         onRemoveValue={(value) => handleRemoveValue("eventTypes", value, activeImageId)}/>

//         <FormInput
//           placeholder="Name of the event"
//           name="eventName"
//           value={currentFormData.eventName || selectionState.formData[activeProject?.mediaId]?.eventName || ""}
//           onChange={(e) => handleInputChange(e,activeImageId)}
//         />
      
//           </div>
          
//       <div className="flex gap-2 p-2 h-[60px] bg-white w-64 border-b border-gray-300 -ml-20">
//       <button className="px-2  py-2 border-electric-blue border-2 text-electric-blue rounded hover:bg-blue-700 transition-colors">
//         Back
//       </button>
//       <button className="px-4 py-2 bg-electric-blue text-white rounded hover:bg-blue-700 transition-colors">
//         Add Project details
//       </button>
//     </div>


//         </div>
//       </div>
//     </div>
//   );
// }