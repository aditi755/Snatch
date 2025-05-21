import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { debounce } from "lodash"; 
import { useAuth } from "@clerk/clerk-react";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
import deleteFormDataFromDatabase from "@/utils/deleteFormDataFromDatabase";

// Context for selection state
const SelectedProjectsContext = createContext();

export function useSelectedProjects() {
  return useContext(SelectedProjectsContext);
}

// Provider component
export function SelectedProjectsProvider({ children }) {
  const { userId } = useAuth();
  const [selectionState, setSelectionState] = useState({
    uploadedFiles: [],
    instagramSelected: [],
    formData: {},
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isBrandCollaboration, setIsBrandCollaboration] = useState(true);
  
  // Fetch draft data on initial load
  useEffect(() => {
    const fetchDraftData = async () => {
    try {
      if (!userId) {
        console.error("User ID is missing.");
        return;
      }
  
      // Clear localStorage before fetching new data
      localStorage.removeItem(`selectionState_${userId}`);
  
      // Fetch fresh data from MongoDB
      const response = await fetch("/api/projects/draft");
      const { data: mongoData } = await response.json();
      console.log("MongoDB data:", mongoData);
  
      if (mongoData) {
        setSelectionState(mongoData);
        localStorage.setItem(`selectionState_${userId}`, JSON.stringify(mongoData));
      }
    } catch (error) {
      console.error("Error fetching draft data:", error);
    }
  };

  
    fetchDraftData();
  }, [userId]);

  // Debounced function to save draft to MongoDB  
  const saveDraftToDatabase = useCallback(
    debounce(async (state) => {
      try {
        console.log("Saving draft... TO DATABASE CONTEXT", state);
        setIsSaving(true);
        if (!userId) {
          console.error("User ID is missing.");
          return;
        }

        console.log("Saving draft for user:", userId, state);

        await fetch("/api/projects/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state, userId }),
        });
      } catch (error) {
        console.error("Error saving draft:", error);
      } finally {
        setIsSaving(false);
      }
    }, 2000, { leading: true }), // 2-second debounce
    [userId]
  );


    const toggleIsBrandCollaboration = useCallback(() => {
    setIsBrandCollaboration(prev => !prev);
  }, []);

const updateFormDataForMedia = (mediaId, newFormData) => {
  if (!mediaId) return;

  setSelectionState((prevState) => {
    console.log("Updating formData for mediaId:", mediaId);
    console.log("Previous state:", prevState);

    // Ensure formData is an array
    const currentFormData = Array.isArray(prevState.formData) ? prevState.formData : [];

    // Check if entry already exists
    const existingIndex = currentFormData.findIndex(item => item.key === mediaId);
    
    // Create updated form data array
    let newFormDataArray;
    if (existingIndex >= 0) {
      // Update existing entry
      newFormDataArray = currentFormData.map((item, index) => 
        index === existingIndex 
          ? { ...item, ...newFormData, key: mediaId }
          : item
      );
    } else {
      // Add new entry
      newFormDataArray = [
        ...currentFormData,
        { ...newFormData, key: mediaId }
      ];
    }

    const newState = {
      ...prevState,
      formData: newFormDataArray
    };

    // Save to localStorage and database
    const timestamp = new Date().toISOString();
    const stateToSave = {
      ...newState,
      updatedAt: timestamp
    };

    localStorage.setItem(`selectionState_${userId}`, JSON.stringify(stateToSave));
    saveDraftToDatabase(stateToSave);


    console.log("Updated state:", newState);
    return newState;
  });
};

// Add Instagram selection without map key
const addInstagramSelection = (mediaLink, mediaId, name, children = []) => {
  setSelectionState((prevState) => {
    const newState = {
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
    };

    const timestamp = new Date().toISOString();

    // Save to localStorage with updated Instagram selections
    localStorage.setItem(
      `selectionState_${userId}`,
      JSON.stringify({
        ...newState,
        instagramSelected: [
          ...(newState.instagramSelected || []),
        ],
        updatedAt: timestamp,
      })
    );

    // Auto-save to MongoDB
    saveDraftToDatabase({ ...newState, updatedAt: timestamp });

    return newState;
  });
};
  const removeInstagramSelection = async (selectionId) => {
    setSelectionState((prevState) => {
      // Find the formData associated with the selectionId (if it exists)
      const formDataToDelete = prevState.formData.find((item) => item.key === selectionId);
  
      console.log("Form data to delete: remove instagram", formDataToDelete, selectionId);
    
      // Filter out the deleted instagramSelected item with logging
      const newInstagramSelected = prevState.instagramSelected.filter((selection) => {
        console.log("Evaluating selection.mediaId:", selection.mediaId, "against selectionId:", selectionId);
        return selection.mediaId !== selectionId;
      });
      console.log("New instagramSelected:", newInstagramSelected);
    
      // Filter out the formData that has the selectionId
      const newFormData = prevState.formData.filter((item) => item.key !== selectionId);
  
      // Create the new state without the deleted instagramSelected and its formData
      const newState = {
        ...prevState,
        instagramSelected: newInstagramSelected,
        formData: newFormData, // Update the formData without the deleted entry
      };
    
      const timestamp = new Date().toISOString();
    
      // Save to localStorage
      localStorage.setItem(
        `selectionState_${userId}`,
        JSON.stringify({ ...newState, updatedAt: timestamp })
      );
    
      // Auto-save to MongoDB
      saveDraftToDatabase({ ...newState, updatedAt: timestamp });
    
      return newState;
    });
    
    // Optionally, you can also explicitly delete the formData from the database
    try {
      await deleteFormDataFromDatabase(selectionId); // Call a function to delete formData from the database
    } catch (error) {
      console.error("Failed to delete formData from the database:", error);
    }
  };
  

  // Remove uploaded file
  const removeFile = (mediaId) => {
    setSelectionState((prevState) => {
      const newState = {
        ...prevState,
        uploadedFiles: prevState.uploadedFiles.filter((file) => file.mediaId !== mediaId),
      };

      const timestamp = new Date().toISOString();

      // Save to localStorage
      localStorage.setItem(
        `selectionState_${userId}`,
        JSON.stringify({ ...newState, updatedAt: timestamp })
      );

      // Auto-save to MongoDB
      saveDraftToDatabase({ ...newState, updatedAt: timestamp });

      return newState;
    });
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    try {
      const fileUrl = await cloudinaryUpload(file);
      const mediaId = Date.now();
      const media = {
        mediaId,
        fileName: file.name,
        fileUrl,
      };

      setSelectionState((prevState) => {
        const newState = {
          ...prevState,
          uploadedFiles: [...prevState.uploadedFiles, media],
        };

        const timestamp = new Date().toISOString();

        // Save to localStorage
        localStorage.setItem(
          `selectionState_${userId}`,
          JSON.stringify({ ...newState, updatedAt: timestamp })
        );

        // Auto-save to MongoDB
        saveDraftToDatabase({ ...newState, updatedAt: timestamp });

        return newState;
      });

      console.log("File uploaded successfully:", media);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  // Handle company logo upload
  const handleCompanyLogoUpload = async (file, mediaId) => {
    try {
      const fileUrl = await cloudinaryUpload(file);
      updateFormDataForMedia(mediaId, { companyLogo: fileUrl });
      console.log("Company logo uploaded successfully. URL:", fileUrl);
      alert("Company logo uploaded successfully.");
      return fileUrl;
    } catch (error) {
      console.error("Error uploading company logo:", error);
      alert("Error uploading company logo. Please try again.");
      throw error;
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
        handleCompanyLogoUpload,
        isBrandCollaboration, 
        setIsBrandCollaboration,
        toggleIsBrandCollaboration,
        isSaving,
      }}
    >
      {children}
    </SelectedProjectsContext.Provider>
  );
}








  // Add Instagram selection
  // const addInstagramSelection = (mediaLink, mediaId, name, children = []) => {
  //   setSelectionState((prevState) => {
  //     const newState = {
  //       ...prevState,
  //       instagramSelected: [
  //         ...(prevState.instagramSelected || []),
  //         {
  //           id: Date.now(),
  //           name,
  //           mediaLink,
  //           mediaId,
  //           children,
  //         },
  //       ],
  //     };

  //     const timestamp = new Date().toISOString();

  //     // Save to localStorage
  //     localStorage.setItem(
  //       `selectionState_${userId}`,
  //       JSON.stringify({ ...newState, updatedAt: timestamp })
  //     );

  //     // Auto-save to MongoDB
  //     saveDraftToDatabase({ ...newState, updatedAt: timestamp });

  //     return newState;
  //   });
  // };


  //without dymanic map data addInstagramSelection
  // const removeInstagramSelection = async (selectionId) => {
  //   setSelectionState((prevState) => {
  //     // Find the index of the formData object with the matching key (selectionId)
  //     const formDataIndex = prevState.formData.findIndex((item) => item.key === selectionId);
  
  //     // Log for debugging
  //     console.log("Form data to delete:", prevState.formData[formDataIndex], selectionId);
  
  //     // Filter out the deleted instagramSelected item
  //     const newInstagramSelected = prevState.instagramSelected.filter((selection) => {
  //       return selection.mediaId !== selectionId;
  //     });
  //     console.log("New instagramSelected:", newInstagramSelected);
  
  //     // Create the new state without the deleted instagramSelected and its formData
  //     const newState = {
  //       ...prevState,
  //       instagramSelected: newInstagramSelected,
  //       formData: prevState.formData.filter((item, index) => index !== formDataIndex), // Remove the item at the found index
  //     };
  
  //     const timestamp = new Date().toISOString();
  
  //     // Save to localStorage
  //     localStorage.setItem(
  //       `selectionState_${userId}`,
  //       JSON.stringify({ ...newState, updatedAt: timestamp })
  //     );
  
  //     // Auto-save to MongoDB
  //     saveDraftToDatabase({ ...newState, updatedAt: timestamp });
  
  //     return newState;
  //   });
  
  //   // Optionally, you can also explicitly delete the formData from the database
  //   try {
  //     await deleteFormDataFromDatabase(selectionId); // Call a function to delete formData from the database
  //   } catch (error) {
  //     console.error("Failed to delete formData from the database:", error);
  //   }
  // };
  


  // const removeInstagramSelection = async (selectionId) => {
  //   setSelectionState((prevState) => {
  //     // Find the formData associated with the selectionId (if it exists)
  //     const formDataToDelete = prevState.formData?.[selectionId];

  //     console.log("Form data to delete: remove instgarm", formDataToDelete, selectionId);
  
  //     // Filter out the deleted instagramSelected item with logging
  //     const newInstagramSelected = prevState.instagramSelected.filter((selection) => {
  //       console.log("Evaluating selection.id:", selection.id, "against selectionId:", selectionId);
  //       return selection.mediaId !== selectionId;
  //     });
  //     console.log("New instagramSelected:", newInstagramSelected);
  
  //     // Create the new state without the deleted instagramSelected and its formData
  //     const newState = {
  //       ...prevState,
  //       instagramSelected: newInstagramSelected,
  //       formData: {
  //         ...prevState.formData,
  //         [selectionId]: undefined, // Remove the formData for the deleted selection
  //       },
  //     };
  
  //     const timestamp = new Date().toISOString();
  
  //     // Save to localStorage
  //     localStorage.setItem(
  //       `selectionState_${userId}`,
  //       JSON.stringify({ ...newState, updatedAt: timestamp })
  //     );
  
  //     // Auto-save to MongoDB
  //     saveDraftToDatabase({ ...newState, updatedAt: timestamp });
  
  //     return newState;
  //   });
  
  //   // Optionally, you can also explicitly delete the formData from the database
  //   try {
  //     await deleteFormDataFromDatabase(selectionId); // Call a function to delete formData from the database
  //   } catch (error) {
  //     console.error("Failed to delete formData from the database:", error);
  //   }
  // };

