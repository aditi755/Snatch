
// app/context.js
"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
const FormContext = createContext();

// Custom hook to use the Form Context
export const useFormContext = () => useContext(FormContext);

// Provider Component
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: ""
  });

  // Ensure localStorage access happens only on the client
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []); // Empty dependency array ensures it runs only once after component mounts

  const updateFormData = (newData) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    // Save to localStorage after state update
    if (typeof window !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(updatedData));
    }
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};
