"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import debounce from "lodash/debounce"; // Add this dependency
import { useAuth } from "@clerk/nextjs";

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

// Provider Component
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    gender: "",
    location: "",
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
    reels: 0,
    dateOfBirth: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const { userId } = useAuth(); // Get userId from Clerk

  // Fetch data on initial load or when userId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Check localStorage for existing data using userId
        if (!userId) {
          console.error("User ID is missing.");
          return;
        }

        const localData = JSON.parse(localStorage.getItem(`formData_${userId}`) || "{}");
        console.log("Local data for user:", userId, localData);

        // Step 2: Always fetch the latest data from MongoDB
        const response = await fetch("/api/onboarding/draft");
        const { data: mongoData } = await response.json();
        console.log("MongoDB data:", mongoData);

        if (mongoData) {
          // Convert timestamps to numbers for comparison
          const localTimestamp = localData.updatedAt
            ? new Date(localData.updatedAt).getTime()
            : 0;
          const mongoTimestamp = new Date(mongoData.updatedAt).getTime();
          console.log("Local timestamp:", localTimestamp);
          console.log("MongoDB timestamp:", mongoTimestamp);

          if (mongoTimestamp > localTimestamp) {
            // If MongoDB data is more recent, use it
            console.log("Using MongoDB data");
            setFormData(mongoData); // Update form state
            localStorage.setItem(`formData_${userId}`, JSON.stringify(mongoData)); // Update localStorage
          } else if (Object.keys(localData).length > 0) {
            // If localStorage data is more recent or equal, use it
            console.log("Using localStorage data");
            setFormData(localData); // Update form state
          }
        } else if (Object.keys(localData).length > 0) {
          // If no data in MongoDB, use localStorage data
          console.log("Using localStorage data (no MongoDB data)");
          setFormData(localData); // Update form state
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]); // Add userId as a dependency

  // Debounced save to MongoDB
  const saveToDatabase = debounce(async (data) => {
    try {
      setIsSaving(true);
      if (!userId) {
        console.error("User ID is missing.");
        return;
      }

      console.log("Saving data for user:", userId, data);

      await fetch(`/api/onboarding/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }), // Include userId in the request body
      });
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  }, 1000); // 1 second delay

  // Update form data and auto-save to MongoDB
  const updateFormData = (newData) => {
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }

    const timestamp = Date.now();
    const updatedData = {
      ...formData,
      ...newData,
      updatedAt: timestamp,
    };

    console.log("Updated data for user:", userId, updatedData);

    // Update state and localStorage
    setFormData(updatedData);
    localStorage.setItem(`formData_${userId}`, JSON.stringify(updatedData));

    console.log("Form data saved to localStorage for user:", userId, updatedData);

    // Auto-save to MongoDB
    saveToDatabase(updatedData);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, isSaving, userId }}>
      {children}
    </FormContext.Provider>
  );
};














