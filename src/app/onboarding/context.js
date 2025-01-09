"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

// Provider Component
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    gender: "",
    location:"",
    links: [],
    instagram: "",
    profilePicture: null,
    backgroundPicture: null,
    profilePictureName: "",
    backgroundPictureName: "",
    industry: [], 
    contentType: [], 
    languages: [],
    compensation: [], 
    post: 0,
    story: 0,
    reels:0,
    dateOfBirth: "",
  });

  // Load from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      // console.log("Loaded formData from localStorage:", JSON.parse(savedData));
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // const updateFormData = (newData) => {
  //   if (newData.profilePicture && newData.profilePicture instanceof File) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const updatedData = { ...formData, profilePicture: reader.result, profilePictureName: newData.profilePicture.name }; // Store base64 and file name
  //       setFormData(updatedData);

  //       // Save updated data to localStorage
  //       if (typeof window !== "undefined") {
  //         localStorage.setItem("formData", JSON.stringify(updatedData));
  //       }
  //     };
  //     reader.readAsDataURL(newData.profilePicture); // Read file as data URL
  //   } else if (newData.backgroundPicture && newData.backgroundPicture instanceof File) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const updatedData = { ...formData, backgroundPicture: reader.result, backgroundPictureName: newData.backgroundPicture.name }; // Store base64 and file name
  //       setFormData(updatedData);

  //       // Save updated data to localStorage
  //       if (typeof window !== "undefined") {
  //         localStorage.setItem("formData", JSON.stringify(updatedData));
  //       }
  //     };
  //     reader.readAsDataURL(newData.backgroundPicture); // Read file as data URL
  //   } else {
  //     // If no file is selected, proceed as usual
  //     const updatedData = { ...formData, ...newData}
      
  //     setFormData(updatedData);
  //     if (typeof window !== "undefined") {
  //       localStorage.setItem("formData", JSON.stringify(updatedData));
  //     }
  //   }
  // };

  const updateFormData = (newData) => {
    // Handle profilePicture (URL from Cloudinary)
    if (newData.profilePicture && typeof newData.profilePicture === "string") {
      const updatedData = {
        ...formData,
        profilePicture: newData.profilePicture, // Store the URL instead of base64
        profilePictureName: newData.profilePictureName || formData.profilePictureName, // Preserve the file name
      };
      setFormData(updatedData);

      // Save updated data to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("formData", JSON.stringify(updatedData));
      }
    } 
    // Handle backgroundPicture (URL from Cloudinary)
    else if (newData.backgroundPicture && typeof newData.backgroundPicture === "string") {
      const updatedData = {
        ...formData,
        backgroundPicture: newData.backgroundPicture, // Store the URL instead of base64
        backgroundPictureName: newData.backgroundPictureName || formData.backgroundPictureName, // Preserve the file name
      };
      setFormData(updatedData);

      // Save updated data to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("formData", JSON.stringify(updatedData));
      }
    } 
    // Handle all other form fields (non-file fields)
    else {
      const updatedData = { ...formData, ...newData };
      setFormData(updatedData);

      // Save updated data to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("formData", JSON.stringify(updatedData));
      }
    }
  };
  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};




  //   if (newData.profilePicture && newData.profilePicture instanceof File) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const updatedData = {
  //         ...formData,
  //         profilePicture: reader.result,
  //         profilePictureName: newData.profilePicture.name,
  //       };
  //       setFormData(updatedData);
  
  //       // Save updated data to localStorage
  //       if (typeof window !== "undefined") {
  //         localStorage.setItem("formData", JSON.stringify(updatedData));
  //       }
  //     };
  //     reader.readAsDataURL(newData.profilePicture); // Read file as data URL
  //   } else if (newData.backgroundPicture && newData.backgroundPicture instanceof File) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const updatedData = {
  //         ...formData,
  //         backgroundPicture: reader.result,
  //         backgroundPictureName: newData.backgroundPicture.name,
  //       };
  //       setFormData(updatedData);
  
  //       // Save updated data to localStorage
  //       if (typeof window !== "undefined") {
  //         localStorage.setItem("formData", JSON.stringify(updatedData));
  //       }
  //     };
  //     reader.readAsDataURL(newData.backgroundPicture); // Read file as data URL
  //   } else {
  //     // If no file is selected, proceed as usual
  //     const updatedData = { 
  //       ...formData, 
  //       ...newData,
  //       dateOfBirth: newData.dateOfBirth ? new Date(newData.dateOfBirth).toLocaleDateString() : formData.dateOfBirth // Ensure DateOfBirth is in correct format
  //     };
      
  //     setFormData(updatedData);
  //     if (typeof window !== "undefined") {
  //       localStorage.setItem("formData", JSON.stringify(updatedData));
  //     }
  //   }
  // };
  
  //console.log("formdata from context client", formData);