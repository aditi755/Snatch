"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const SelectedProjectsContext = createContext();

// Custom Hook to use the SelectedProjectsContext
export const useSelectedProjects = () => {
  const context = useContext(SelectedProjectsContext);
  if (!context) {
    throw new Error("useSelectedProjects must be used within SelectedProjectsProvider");
  }
  return context;
};

// Provider Component
export const SelectedProjectsProvider = ({ children }) => {
  const [selectedProjects, setSelectedProjects] = useState([]);

  // Load selected projects from localStorage when the component mounts
  useEffect(() => {
    const savedProjects = localStorage.getItem("selectedProjects");
    if (savedProjects) {
      setSelectedProjects(JSON.parse(savedProjects));
    }
  }, []);

    // Update localStorage whenever selectedProjects changes
    useEffect(() => {
      if (selectedProjects.length > 0) {
        localStorage.setItem("selectedProjects", JSON.stringify(selectedProjects));
      }
    }, [selectedProjects]);
  

  // Add a project to the selected list
  const addProject = (project) => {
    if (!selectedProjects.some((p) => p.id === project.id)) {
      setSelectedProjects((prev) => [...prev, project]);
    }
  };

  // Remove a project from the selected list
  const removeProject = (projectId) => {
    setSelectedProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  return (
    <SelectedProjectsContext.Provider value={{ selectedProjects, addProject, removeProject }}>
      {children}
    </SelectedProjectsContext.Provider>
  );
};
