"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

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
      return savedState ? JSON.parse(savedState) : {
        selectedProjects: [],
        instagramSelected: [],
        uploadedFiles: [],
        svgSelected: []
      };
    }
    return {
      selectedProjects: [],
      instagramSelected: [],
      uploadedFiles: [],
      svgSelected: []
    };
  });

  // Update localStorage whenever selectionState changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Saving to localStorage:", selectionState); // Log before saving
      localStorage.setItem("selectionState", JSON.stringify(selectionState));
    }
  }, [selectionState]);
  

  // Helper function to update selectionState
  const updateSelectionState = (updater) => {
    console.log("Updating selectionState with updater:", updater);
  
    setSelectionState((prevState) => {
      const updatedState =
        typeof updater === "function" ? updater(prevState) : { ...prevState, ...updater };
  
      console.log("Updated selectionState:", updatedState);
  
      // Save updated state to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selectionState", JSON.stringify(updatedState));
      }
  
      return updatedState;
    });
  };
  
  

  // Handle file upload by converting the file to base64
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      updateSelectionState({
        uploadedFiles: [
          ...selectionState.uploadedFiles,
          { fileName: file.name, fileData: base64Data }
        ]
      });
    };
    reader.readAsDataURL(file); // Convert file to base64 string
  };

  // Convert image URL to Base64
  const convertImageToBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result); 
        };
        reader.onerror = reject; 
        reader.readAsDataURL(blob); 
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  };

  // Convert SVG path to Base64
  const convertSVGPathToBase64 = async (svgPath) => {
    try {
      const response = await fetch(svgPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.statusText}`);
      }
      const svgContent = await response.text();
      const encodedSVG = `data:image/svg+xml;base64,${btoa(svgContent)}`;
      return encodedSVG;
    } catch (error) {
      console.error("Error converting SVG to base64:", error);
    }
  };

  // Add SVG selection

  // const addSVGSelection = async (project) => {
  //   console.log("Adding SVG:", project);
  //   const svgPath = project.path;
  //   const name = project.name;
  //   console.log("SVG Path:", svgPath);
  //   console.log("Adding SVG:", { svgPath, name });
  
  //   try {
  //     const base64Image = await convertSVGPathToBase64(svgPath);
  //     console.log("Base64 Image:", base64Image); // Debug base64 conversion
  
  //     // Create the new SVG entry
  //     const newSvgEntry = { id: Date.now(), name, imageUrl: base64Image };
  
  //     updateSelectionState((prevState) => {
  //       const updatedSvgSelected = [
  //         ...prevState.svgSelected,
  //         newSvgEntry,
  //       ];
  //       console.log("Updated SVG Selected:", updatedSvgSelected); // Debug the updated SVG selection
  
  //       // Return the updated state object
  //       return {
  //         ...prevState,
  //         svgSelected: updatedSvgSelected,
  //       };
  //     });
  
  //     // Directly pass the updated SVG selection to updateSelectionState
  //     updateSelectionState({
  //       svgSelected: [{ id: Date.now(), name, imageUrl: base64Image }],
  //     });
  //   } catch (error) {
  //     console.error("Failed to add SVG selection:", error);
  //   }
  // };

  const addSVGSelection = async (project) => {
    console.log("Adding SVG:", project);
    const svgPath = project.path;
    const name = project.name;
    console.log("SVG Path:", svgPath);
  
    try {
      const base64Image = await convertSVGPathToBase64(svgPath);
      console.log("Base64 Image:", base64Image); // Debug base64 conversion
  
      // Append new SVG selection to the existing state
      updateSelectionState((prevState) => {
        const updatedSvgSelected = [
          ...prevState.svgSelected,
          { id: Date.now(), name, imageUrl: base64Image },
        ];
        console.log("Updated SVG Selected:", updatedSvgSelected); // Debug the updated SVG selection
  
        return {
          ...prevState,
          svgSelected: updatedSvgSelected,
        };
      });
    } catch (error) {
      console.error("Failed to add SVG selection:", error);
    }
  };
  
  
  

  // Add Instagram selection
  const addInstagramSelection = async (imageUrl, name) => {
    const base64Image = await convertImageToBase64(imageUrl);
    updateSelectionState({
      instagramSelected: [
        ...selectionState.instagramSelected,
        { id: Date.now(), name, imageUrl: base64Image }
      ]
    });
  };

   // Remove SVG selection
   const removeSVGSelection = (selectionId) => {
    updateSelectionState({
      svgSelected: selectionState.svgSelected.filter(
        (selection) => selection.id !== selectionId
      )
    });
  };
  
  // Remove Instagram selection
  const removeInstagramSelection = (selectionId) => {
    updateSelectionState({
      instagramSelected: selectionState.instagramSelected.filter(
        (selection) => selection.id !== selectionId
      )
    });
  };

  // Remove uploaded file
  const removeFile = (fileName) => {
    updateSelectionState({
      uploadedFiles: selectionState.uploadedFiles.filter(
        (file) => file.fileName !== fileName
      )
    });
  };

  return (
    <SelectedProjectsContext.Provider
      value={{
        selectionState,
        handleFileUpload,
        addInstagramSelection,
        removeInstagramSelection,
        addSVGSelection,
        removeSVGSelection,
        removeFile,
      }}
    >
      {children}
    </SelectedProjectsContext.Provider>
  );
}
