"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [carouselIndexes, setCarouselIndexes] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects/all-projects");
        const data = await response.json();

        console.log("Project data in Portfolio:", data);

        if (data.success && data.instagram && data.uploaded) {
          // Process projects: For carousel albums, keep album details instead of flattening children.
          const processedProjects = [
            ...data.instagram.map((item) => {
              if (item.name === "CAROUSEL_ALBUM" && item.children?.length > 0) {
                return {
                  mediaType: "CAROUSEL_ALBUM",
                  children: item.children.map((child) => ({
                    mediaType: child.media_type,
                    mediaUrl: child.media_url,
                    mediaId: child.id,
                  })),
                  mediaId: item.mediaId,
                  title: item.name,
                };
              }
              return {
                mediaType: item.name || item.fileName,
                mediaUrl: item.mediaLink || item.fileUrl,
                mediaId: item.mediaId,
                title: item.name,
              };
            }),
            ...data.uploaded.map((item) => ({
              mediaType: item.mediaType || item.fileName,
              mediaUrl: item.mediaUrl || item.fileUrl,
              mediaId: item.mediaId,
              title: item.name,
            })),
          ];
          console.log("processedprojects", processedProjects);
          setProjects(processedProjects);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

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
    <div className="w-full max-w-5xl p-6">
      {projects.length > 0 ? (
        <div className="grid grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className=" rounded-lg p-2">
              {project.mediaType === "CAROUSEL_ALBUM" && project.children ? (
                <div className="relative w-[165px] h-[170px] group">
                  {project.children.map((child, idx) => (
                    <div
                      key={child.id}
                      className={`absolute inset-0 transition-transform duration-500 ${
                        (carouselIndexes[project.mediaId] || 0) === idx
                          ? "translate-x-0 opacity-100"
                          : "translate-x-50 opacity-0"
                      }`}
                    >
                      {child.mediaType === "IMAGE" ? (
                        <Image
                          src={child.mediaUrl}
                          alt={`Media ${child.mediaId}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <video
                          className="w-full h-full object-cover rounded-md"
                          src={child.mediaUrl}
                          alt={child.mediaId}
                        />
                      )}
                    </div>
                  ))}
                  {project.children.length > 1 && (
                    <div className="absolute z-10 inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) =>
                          handleSlide(
                            e,
                            project.mediaId,
                            "prev",
                            project.children.length
                          )
                        }
                        className="bg-black/50 text-white rounded-full w-6 h-6 ml-1"
                      >
                        ❮
                      </button>
                      <button
                        onClick={(e) =>
                          handleSlide(
                            e,
                            project.mediaId,
                            "next",
                            project.children.length
                          )
                        }
                        className="bg-black/50 text-white rounded-full w-6 h-6 mr-1"
                      >
                        ❯
                      </button>
                    </div>
                  )}
                </div>
              ) : project.mediaType.includes("VIDEO") || project.mediaType.endsWith(".mp4") ? (
                <video
                  controls
                  className="w-[165px] h-[170px] object-cover rounded-md"
                >
                  <source src={project.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  width={32}
                  height={32}
                  src={project.mediaUrl}
                  alt={`Project ${index + 1}`}
                  className="w-[165px] h-[170px] object-cover rounded-md"
                />
              )}
              
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 font-qimano">Finding your projects...</p>
      )}
    </div>
  );
};

export default Portfolio;

