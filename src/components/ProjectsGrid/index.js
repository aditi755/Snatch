"use client";
import React, { useState } from "react";
import Image from "next/image";

const ProjectsGrid = ({
  projects,
  activeTab,
  onProjectClick,
  showStatus = true,
  containerClassName = "grid grid-cols-2 gap-2 mt-4 overflow-y-scroll overflow-x-hidden max-h-[40vh]",
}) => {
  const [carouselIndexes, setCarouselIndexes] = useState({});

  // Mapping status to custom styling
  const statusStyles = {
    Done: "bg-[#e9e9e9] text-electric-blue",
    Editing: "bg-electric-blue text-white",
    Draft: "bg-[#e9e9e9] text-red-500",
    Selected: "bg-electric-blue text-white",
  };

  const handleSlide = (e, mediaId, direction, totalSlides) => {
    e.stopPropagation();
    setCarouselIndexes((prev) => {
      const currentIndex = prev[mediaId] || 0;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % totalSlides
          : currentIndex === 0
          ? totalSlides - 1
          : currentIndex - 1;
      return { ...prev, [mediaId]: newIndex };
    });
  };

  return (
    <div className={containerClassName} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      {projects.map((project, index) => (
        <div
          key={index}
          className="flex justify-center items-center cursor-pointer"
          onClick={() => onProjectClick?.(project.mediaId || index)}
        >
          <div className="w-[200px] h-[150px] rounded-md relative">
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
                        className="bg-cover rounded-md"
                      />
                    ) : (
                      <video
                        className="w-full h-full object-cover rounded-md"
                        src={child.media_url}
                      />
                    )}
                  </div>
                ))}

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
            ) : project.name === "IMAGE" ? (
              <Image
                src={project.mediaLink}
                alt={project.name || project.fileName}
                width={200}
                height={150}
                className="bg-cover h-36 rounded-md"
              />
            ) : (
              <div className="w-full h-full rounded-lg flex justify-center items-center">
                {project.mediaLink || project.fileUrl ? (
                  (project.mediaLink || project.fileUrl).match(/\.(jpeg|jpg|gif|png)$/) ? (
                    <Image
                      src={project.mediaLink || project.fileUrl}
                      alt={project.name || project.fileName}
                      width={200}
                      height={150}
                      className="bg-cover h-36 rounded-md"
                    />
                  ) : (
                    <video
                      src={project.mediaLink || project.fileUrl}
                      controls
                      width={200}
                      height={150}
                      className="object-cover h-36 rounded-md"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <p>No media available</p>
                )}
              </div>
            )}
            {showStatus && (
              <div
                className={`absolute bottom-0 left-0 right-0 flex items-center justify-center text-sm py-1 rounded-b-md font-apfel-grotezk-regular ${
                  statusStyles[project.status]
                }`}
              >
                <Image
                  src={
                    project.status === "Done"
                      ? "/assets/images/okayblue.svg"
                      : project.status === "Editing"
                      ? "/assets/images/write.svg"
                      : project.status === "Selected"
                      ? "/assets/images/okay.svg"
                      : "/assets/images/redwrite.svg"
                  }
                  alt={project.status}
                  width={12}
                  height={12}
                  className="w-[15px] h-[12px] mr-3"
                />
                <span className="-ml-2 ">{project.status}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsGrid;
