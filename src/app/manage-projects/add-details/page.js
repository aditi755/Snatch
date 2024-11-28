"use client"
import Image from "next/image";
import { useState } from "react";
import { useSelectedProjects } from "../context";
export default function AddDetails() {
  const projects = [
    { id: 1, name: "Project 1" },
    { id: 2, name: "Project 2" },
    { id: 3, name: "Project 3" },
    { id: 4, name: "Project 1" },
    { id: 5, name: "Project 2" },
    { id: 6, name: "Project 3" },
    { id: 7, name: "Project 1" },
    { id: 8, name: "Project 2" },
    { id: 9, name: "Project 3" },
    { id: 10, name: "Project 2" },
    { id: 11, name: "Project 3" },
  ];

  const { selectedProjects, addProject, removeProject, clearProjects } = useSelectedProjects();
  const [selectedTab, setSelectedTab] = useState("instagram");

  const handleTabClick = (tab) => setSelectedTab(tab);

  const handleProjectClick = (project) => addProject(project);

    return (
     <div className="h-[77vh] bg-gray-200  w-full">

    <div className="flex flex-col justify-center text-center">
      <p className="text-2xl text-black">Pick content that you wish to highlight in your profile kit</p>
      <p className="text-md text-black mt-2">Fill in details for atleast four projects</p>
    </div>

    <div className="w-[278px] h-[60vh] bg-smoke text-black p-3 overflow-auto">
          <p className="text-md">Selected projects from Instagram</p>
          <p className="text-light-grey">{selectedProjects.length} selected</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {selectedProjects.map((project) => (
              <div key={project.id} className="flex justify-center items-center">
                <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center">
                  <Image
                    src="/assets/images/projects.svg"
                    alt={project.name}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

     </div>
     

    );
  }
  