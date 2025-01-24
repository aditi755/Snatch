"use client";
import React, { useState } from "react";
import Image from "next/image";

const ProjectsGrid = ({ 
  projects, 
  activeTab, 
  onProjectClick, 
  showStatus = false,
  containerClassName = "grid grid-cols-2 gap-2 mt-4  overflow-y-scroll overflow-x-hidden max-h-[40vh]",

}) => {
  const [carouselIndexes, setCarouselIndexes] = useState({});

  const handleSlide = (e, mediaId, direction, totalSlides) => {
    e.stopPropagation(); // Prevent click from bubbling to parent
    setCarouselIndexes((prev) => {
      const currentIndex = prev[mediaId] || 0;
      const newIndex = direction === "next"
        ? (currentIndex + 1) % totalSlides
        : currentIndex === 0
          ? totalSlides - 1 
          : currentIndex - 1;
      return { ...prev, [mediaId]: newIndex };
    });
  };

  return (
    <div className={containerClassName} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {projects.map((project, index) => (
        <div
          key={index}
          className="flex justify-center items-center cursor-pointer "
          onClick={() => onProjectClick?.(project.mediaId || index)}
        >
          <div className="w-[200px] h-[150px] border-2 border-light-grey rounded-md flex justify-center items-center relative">
            {project.name === "VIDEO" ? (
              <video
                src={project.mediaLink || project.fileUrl}
                
                className="object-cover w-full h-full rounded-md"
              />
            ) : project.name === "CAROUSEL_ALBUM" && project.children ? (
              <div className="relative w-full h-full">
                {project.children.map((child, index) => (
                  <div
                    key={child.id}
                    className={`absolute inset-0 transition-transform duration-500 ${
                      (carouselIndexes[project.mediaId] || 0) === index
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0"
                    }`}
                  >
                    {child.media_type === "IMAGE" ? (
                      <Image
                        src={child.media_url}
                        alt={`Media ${child.id}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <video
                        
                        className="w-full h-full object-cover rounded-md"
                        src={child.media_url}
                      />
                    )}
                  </div>
                ))}
                
                {/* Navigation Controls */}
                <div className="absolute z-10 inset-0 flex items-center justify-between">
                  <button
                    onClick={(e) => handleSlide(e, project.mediaId, "prev", project.children.length)}
                    className="bg-black/50 text-white rounded-full w-6 h-6 ml-1"
                  >
                    ❮
                  </button>
                  <button
                    onClick={(e) => handleSlide(e, project.mediaId, "next", project.children.length)}
                    className="bg-black/50 text-white rounded-full w-6 h-6 mr-1"
                  >
                    ❯
                  </button>
                </div>
              </div>
            ) : (
              <Image
                src={project.mediaLink || project.fileUrl}
                alt={project.name || project.fileName}
                width={200}
                height={150}
                className="bg-cover rounded-md h-[150px]"
              />
            )}

            {showStatus && (
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsGrid;
