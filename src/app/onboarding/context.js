"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
const FormContext = createContext();

// Custom hook to use the Form Context
export const useFormContext = () => useContext(FormContext);

// Provider Component
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    links: [],
    instagram: "",
    profilePicture: null,
    backgroundPicture: null,
    profilePictureName: "",
    backgroundPictureName: "",
    industry: [], 
    contentType: [], 
    compensation: [], 
  });

  // Load from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      console.log("Loaded formData from localStorage:", JSON.parse(savedData));
      setFormData(JSON.parse(savedData));
    }
  }, []);
  const updateFormData = (newData) => {
    if (newData.profilePicture && newData.profilePicture instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = { ...formData, profilePicture: reader.result, profilePictureName: newData.profilePicture.name }; // Store base64 and file name
        setFormData(updatedData);

        // Save updated data to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("formData", JSON.stringify(updatedData));
        }
      };
      reader.readAsDataURL(newData.profilePicture); // Read file as data URL
    } else if (newData.backgroundPicture && newData.backgroundPicture instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = { ...formData, backgroundPicture: reader.result, backgroundPictureName: newData.backgroundPicture.name }; // Store base64 and file name
        setFormData(updatedData);

        // Save updated data to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("formData", JSON.stringify(updatedData));
        }
      };
      reader.readAsDataURL(newData.backgroundPicture); // Read file as data URL
    } else {
      // If no file is selected, proceed as usual
      const updatedData = { ...formData, ...newData };
      setFormData(updatedData);
      if (typeof window !== "undefined") {
        localStorage.setItem("formData", JSON.stringify(updatedData));
      }
    }
  };

  const clearLinks = () => {
    localStorage.removeItem("links");
    updateField("links", []); // Ensure state reflects the cleared localStorage
  };

  console.log("formdata from context client", formData);

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};
