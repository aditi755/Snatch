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

export default function AddDetails() {
  const {
    selectionState,
    handleFileUpload,
    updateFormDataForMedia,
  } = useSelectedProjects();

  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("instagram");
  const [carouselIndexes, setCarouselIndexes] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
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

  const industryList = [
    "Accounting", "Advertising", "Aerospace", "Agriculture", "AI & Machine Learning",
    "Alternative Medicine", "Apparel", "Architecture", "Arts & Culture", "Automotive",
    "Aviation", "Baking & Bakeware", "Beauty", "Biotechnology", "Blogging & Vlogging",
    "Broadcasting", "Business & Finance", "Chemicals", "Clean Energy", "Climate Change",
    "Comedy", "Construction", "Consumer Electronics", "Consulting", "Cooking",
    "Crypto & Blockchain", "Cybersecurity", "Dance", "Design", "Digital Marketing",
    "DIY & Crafts", "E-Commerce", "Education", "Entertainment", "Environment",
    "Events Management", "Fashion", "Financial Services", "Fitness & Wellness",
    "Food & Beverage", "Gaming & Esports", "Games & Toys", "Government", "Haircare",
    "Healthcare & Medicine", "History", "Home & Decor", "Hospitality", "Human Rights",
    "Insurance", "Internet & Software", "Investments", "Jewelry", "Legal Services",
    "Literature", "Luxury Goods", "Makeup & Skincare", "Manufacturing", "Marketing",
    "Media & Publishing", "Mental Health", "Modeling", "Music", "Nonprofit & Social Causes",
    "Nutrition", "Outdoor Recreation", "Parenting & Kids", "Performing Arts", "Personal Care",
    "Pets", "Philosophy", "Photography", "Psychology", "Public Relations", "Real Estate",
    "Renewable Energy", "Retail", "Robotics", "Science", "Security", "Social Entrepreneurship",
    "Social Impact", "Social Media", "Software Development", "Spirituality", "Sports",
    "Sustainability", "Teaching & Education", "Tech & Gadgets", "Telecommunications",
    "Transportation", "Travel & Tourism", "Video & Production", "Virtual Reality",
    "Web Design & Development", "Wine & Spirits",
  ];

  const eventTypes = ["Conference", "Workshop", "Webinar", "Networking"];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (activeImageId !== null) {
      console.log("selectionstate fromdata", selectionState.formData);
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

  if (!isHydrated) {
    return null;
  }

  const handleProjectClick = (mediaId) => {
    setActiveImageId(mediaId); // Update the active image ID in state

    if (mediaId) {
      // Construct the URL with media_id as a query parameter
      const url = `/manage-projects/add-details?media_id=${mediaId}`;
      //router.push(url, undefined, { shallow: true }); // This will dynamically update the URL
    }
  };

 // Extracting projects logic here
  const projects =
  activeTab === "instagram"
  ? selectionState.instagramSelected
  : selectionState.uploadedFiles;


const activeProject = projects.find(
(project) => project.mediaId === activeImageId // Match only using `mediaId` unique and both have it 
);

const handleAddValue = (fieldName, value, mediaId) => {

  // Ensure the form data for this mediaId exists
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

const handleRemoveValue = (fieldName, value,mediaId) => {
  const updatedValues = (currentFormData[fieldName] || []).filter((item) => item !== value);
  updateFormDataForMedia(mediaId, { [fieldName]: updatedValues });

};

const handleInputChange = (e, mediaId) => {
  const { name, value } = e.target;

  // Update the state and also handle formDataForMedia inside the updater
  setCurrentFormData((prevData) => {
    const updatedData = {
      ...prevData,
      [mediaId]: {
        ...prevData[mediaId],
        [name]: value,
      },
    };

    updateFormDataForMedia(mediaId, updatedData[mediaId]);

    return updatedData; // Ensure state is updated
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
 
  const handleIndustryAdd = (value) => {
    setCurrentFormData((prevData) => ({
      ...prevData,
      industries: [...(prevData.industries || []), value], 
    }));
  };
  
  const handleIndustryRemove = (value) => {
    setCurrentFormData((prevData) => ({
      ...prevData,
      industries: (prevData.industries || []).filter((industry) => industry !== value), 
    }));
  };
  

// For adding/removing event types
const handleEventTypeAdd = (value) => {
  setCurrentFormData((prevData) => ({
    ...prevData,
    eventTypes: [...(prevData.eventTypes || []), value],
  }));
};

const handleEventTypeRemove = (value) => {
  setCurrentFormData((prevData) => ({
    ...prevData,
    eventTypes: (prevData.eventTypes || []).filter((eventType) => eventType !== value),
  }));
};

  const saveFormData = () => {
    if (activeImageId !== null) {
      console.log("saving form data", currentFormData)
      updateFormDataForMedia(activeImageId, currentFormData);
    }
  };

  return (
    <div className="flex flex-col  items-start space-x-8 h-[77vh]  w-full overflow-x-hidden overflow-y-auto ">
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


        <div className="flex flex-row">
          {/* White Box Container */}
          <div className="bg-white w-[258px] h-[460px] ml-20 mt-4 flex items-center justify-center relative">
          {(activeImageId !== null || projects.length > 0) && (
  (() => {
    const activeProject =
      activeImageId !== null
        ? projects.find((project) => project.mediaId === activeImageId)
        : projects[0];
  

    if (!activeProject) {
      return <p>No project selected</p>;
    }

    if (activeProject.name === "IMAGE") {
      return (
        <Image
          src={activeProject.mediaLink}
          alt={activeProject.name}
          width={500}
          height={1200}
          className="absolute bottom-[68px] h-[400px] object-cover"
        />
      );
    } else if (activeProject.name === "VIDEO") {
      return (
        <video
          src={activeProject.mediaLink}
          controls
          width={500}
          height={1200}
          className="absolute bottom-[68px] h-[400px] object-cover"
        />
      );
    } else if (activeProject.name === "CAROUSEL_ALBUM") {
      return (
        <div className="relative w-full h-full">
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


      <div className="mt-2 flex gap-4 text-black absolute top-[85%]">
      <div className="flex-col text-center">
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

        <div className="ml-20 mt-5 flex flex-col gap-8">

        <MultiSelectInput
          label="Choose Industry (Max 5)"
          data={industryList}
          selectedValues={currentFormData.industries || []}
          onAddValue={(value) => handleAddValue("industries", value, activeImageId)}
          onRemoveValue={(value) => handleRemoveValue("industries", value, activeImageId)}
        />

          <TitleWithCounter label={"Give it a title"} name="titleName"  value={currentFormData.titleName || ""} onChange={(e) => handleInputChange(e,activeImageId)}/>

          <TitleWithCounter 
            name="description" 
            label={"Add description"} 
            value={currentFormData.description || ""} 
            onChange={(e) => handleInputChange(e,activeImageId)}/>


       <div className="text-black flex flex-col gap-5">
            <p className="font-bold text-md">About Company</p>
            <FormInput
              placeholder="Enter name of company"
              name="companyName"
              value={currentFormData.companyName}
              onChange={(e) => handleInputChange(e,activeImageId)}
            />
            <FormInput
              placeholder="Enter location of company"
              name="companyLocation"
              value={currentFormData.companyLocation}
              onChange={(e) => handleInputChange(e,activeImageId)}
            />
          </div>

          <div className="text-black flex flex-col gap-5">
          <p className="font-bold text-md">Upload logo of the Company</p>
          {/* <CustomFileInput /> */}
            </div>


          <div className="text-black flex flex-col gap-5">
            <p className="font-bold text-md">About the event</p>

         

       <NormalMultiSelect 
        label="Choose Event type"
        options={eventTypes}
        selectedValues={currentFormData.eventTypes || []}
        onAddValue={(value) => handleAddValue("eventTypes", value, activeImageId)}
        onRemoveValue={(value) => handleRemoveValue("eventTypes", value, activeImageId)}/>

        <FormInput
          placeholder="Name of the event"
          name="eventName"
          value={currentFormData.eventName}
          onChange={(e) => handleInputChange(e,activeImageId)}
        />
      
          </div>

          <button
            onClick={saveFormData}
            className="px-4 py-2 bg-blue-500 rounded text-white bg-electric-blue w-20 mx-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

