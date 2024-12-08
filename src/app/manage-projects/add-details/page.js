"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelectedProjects } from "../context";
import TitleWithCounter from "@/components/TitleWithCounter";
import FormInput from "@/components/FormInput";
import MultiSelectInput from "@/components/MultiSelectInput";
export default function AddDetails() {
  const {
    selectionState,
    handleFileUpload,
    updateFormDataForImage,
  } = useSelectedProjects();

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("instagram");
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

  const industries = ["Technology", "Healthcare", "Finance", "Education"];
  const eventTypes = ["Conference", "Workshop", "Webinar", "Networking"];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  if (!isHydrated) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
      updateFormDataForImage(activeImageId, currentFormData);
    }
  };

  const renderProjects = () => {
    const projects =
      activeTab === "instagram"
        ? selectionState.svgSelected
        : selectionState.uploadedFiles;

    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="flex justify-center items-center cursor-pointer"
            onClick={() =>
              setActiveImageId(project.id || index)
            }
          >
            <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center relative">
              <Image
                src={project.imageUrl || project.fileData}
                alt={project.name || project.fileName}
                width={200}
                height={200}
                className="object-contain"
              />
              <div className="absolute top-0 right-0 p-2 bg-white bg-opacity-60">
                {project.status === "Done" && (
                  <span className="text-green-500">Done</span>
                )}
                {project.status === "Editing" && (
                  <span className="text-blue-500">Editing</span>
                )}
                {project.status === "Draft" && (
                  <span className="text-red-500">Draft</span>
                )}
                {project.status === "Yet to start" && (
                  <span className="text-gray-500">Yet to start</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const activeImageUrl =
    selectionState.svgSelected.concat(
      selectionState.uploadedFiles
    ).find((project) => project.id === activeImageId)?.imageUrl ||
    "/assets/images/influencer.svg";

  return (
    <div className="flex flex-col  items-start 2xl:items-center  h-[77vh]  w-full space-x-8 overflow-x-hidden overflow-y-auto ">
      <div className="flex flex-col mx-auto items-start">
        <p className="text-2xl text-black">
          Pick content that you wish to highlight in your profile kit
        </p>
        <p className="mx-auto text-black">
          Fill in details for at least 4 projects
        </p>
      </div>

      <div className="flex flex-row font-apfel-grotezk-regular">
    <div className="w-[278px] bg-smoke text-black p-3">
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
              ? selectionState.svgSelected.length
              : selectionState.uploadedFiles.length}{" "}
        </p>

        {renderProjects()}
      </div>
    </div>


        <div className="flex flex-row">
          {/* White Box Container */}
          <div className="bg-white w-[258px] h-[460px] ml-20 mt-4 flex items-center justify-center relative">
            <Image
              className="w-[320px] h-[400px] m-0 p-0 -mt-[72px]"
              src={activeImageUrl}
              width={44}
              height={32}
              alt="Selected Image"
            />

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
          <TitleWithCounter label={"Give it a title"} name="titleName"  value={currentFormData.titleName || ""} onChange={handleInputChange}/>

          <MultiSelectInput label="Choose Industry"
          options={industries}
          selectedValues={currentFormData.industries || []}
          onAddValue={handleIndustryAdd}
          onRemoveValue={handleIndustryRemove}/>

          <div className="text-black flex flex-col gap-5">
            <p className="font-bold text-md">About the event</p>
            <MultiSelectInput label="Choose Event type"
            options={eventTypes}
            selectedValues={currentFormData.eventTypes || []}
            onAddValue={handleEventTypeAdd}
            onRemoveValue={handleEventTypeRemove} />
            <FormInput
              placeholder="Name of the event"
              name="eventName"
              value={currentFormData.eventName}
              onChange={handleInputChange}
            />
            <FormInput
              placeholder="Location of the event"
              name="eventLocation"
              value={currentFormData.eventLocation}
              onChange={handleInputChange}
            />
            <FormInput
              placeholder="Year"
              name="eventYear"
              value={currentFormData.eventYear}
              onChange={handleInputChange}
            />
            <TitleWithCounter name="description" label={"Add description"} value={currentFormData.description || ""} onChange={handleInputChange}/>
          </div>

          <div className="text-black flex flex-col gap-5">
            <p className="font-bold text-md">About Company</p>
            <FormInput
              placeholder="Enter name of company"
              name="companyName"
              value={currentFormData.companyName}
              onChange={handleInputChange}
            />
            <FormInput
              placeholder="Enter location of company"
              name="companyLocation"
              value={currentFormData.companyLocation}
              onChange={handleInputChange}
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

