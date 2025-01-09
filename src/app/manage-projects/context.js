//-------------new------------------

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
// Context for selection state
const SelectedProjectsContext = createContext();

export function useSelectedProjects() {
  return useContext(SelectedProjectsContext);
}

// Provider component
export function SelectedProjectsProvider({ children }) {
  const [selectionState, setSelectionState] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("selectionState");
      return savedState
        ? JSON.parse(savedState)
        : {
            uploadedFiles: [],
            instagramSelected: [],
            formData: {},
          };
    }
    return {
      uploadedFiles: [],
      instagramSelected: [],
      formData: {},
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectionState", JSON.stringify(selectionState));
    }
  }, [selectionState]);

  // Helper function to update selectionState
  const updateSelectionState = (updater) => {
    setSelectionState((prevState) =>
      typeof updater === "function" ? updater(prevState) : { ...prevState, ...updater }
    );
  };

  // Update form data for Instagram media
  const updateFormDataForMedia = (mediaId, newFormData) => {
    const defaultFormData = {
      eventName: "",
      eventLocation: "",
      eventYear: "",
      companyName: "",
      companyLocation: "",
      companyLogo: null,
      description: "",
      eventTypes: [],
      industries: [],
      titleName: "",
    };
  
    // Merge new form data with the existing data and the default structure
    updateSelectionState((prevState) => {
      const existingData = prevState.formData[mediaId] || defaultFormData;
  
      const updatedFormData = {
        ...defaultFormData,
        ...existingData, // Keep existing data
        ...newFormData, // Apply new changes
      };
  
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          [mediaId]: updatedFormData,
        },
      };
    });
  };
  

  const addInstagramSelection = (mediaLink, mediaId, name, children = []) => {
    updateSelectionState((prevState) => ({
      ...prevState,
      instagramSelected: [
        ...(prevState.instagramSelected || []),
        {
          id: Date.now(),
          name,
          mediaLink,
          mediaId,
          children,
        },
      ],
    }));
  };
  

  // Remove Instagram media selection
  const removeInstagramSelection = (selectionId) => {
    updateSelectionState((prevState) => ({
      ...prevState,
      instagramSelected: prevState.instagramSelected.filter(
        (selection) => selection.id !== selectionId
      ),
    }));
  };

  // Remove uploaded file
  const removeFile = (fileName) => {
    updateSelectionState((prevState) => ({
      ...prevState,
      uploadedFiles: prevState.uploadedFiles.filter((file) => file.fileName !== fileName),
    }));
  };

  const handleFileUpload = async (file) => {
    try {
      // Upload file to Cloudinary
      const fileUrl = await cloudinaryUpload(file);
  
      // Generate a unique media ID
      const mediaId = Date.now();
  
      // Create a media object
      const media = {
        mediaId,
        fileName: file.name,
        fileUrl,
      };
  
      // Update the context state (uploadedFiles) using updateSelectionState
      updateSelectionState((prevState) => ({
        ...prevState,
        uploadedFiles: [...prevState.uploadedFiles, media],
      }));
  
      console.log("File uploaded successfully:", media);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };
  
  return (
    <SelectedProjectsContext.Provider
      value={{
        selectionState,
        addInstagramSelection,
        removeInstagramSelection,
        removeFile,
        updateFormDataForMedia,
        handleFileUpload,
      }}
    >
      {children}
    </SelectedProjectsContext.Provider>
  );
}

