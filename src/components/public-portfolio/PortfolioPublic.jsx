"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PortfolioPublic = () => {
  const [projects, setProjects] = useState([]);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [username, setUsername] = useState("");
  const pathname = usePathname();
  const isAdminView = pathname.includes('/adminview');
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const pathnameParts = window.location.pathname.split("/");
        const username = pathnameParts[1];
        setUsername(username)
        // const username = pathnameParts[pathnameParts.length - 2];
        // setUsername(username);

        const url = `/api/public-portfolio/posts?username=${username}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.instagram && data.uploaded) {
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

          setProjects(processedProjects);
        } else {
          console.error("Error in posts:", data.error);
        }
      } catch (error) {
        console.error("Error fetching public posts:", error);
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
    <div className="w-full mx-auto max-w-[600px] lg:max-w-[1600px] p-2 sm:p-4">
      {projects.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2 lg:gap-8">
          {projects.map((project, index) => (
           <div key={index} className="relative w-full aspect-square p-[6px] sm:p-2">

              <Link
                href={`/${username}/media-kit/post/?postId=${project.mediaId}`}
                className="block w-full h-full"
              >
                <div className="relative w-full h-full group rounded-md overflow-hidden">
                  {project.mediaType === "CAROUSEL_ALBUM" && project.children ? (
                    <>
                      {project.children.map((child, idx) => (
                        <div
                          key={child.mediaId}
                          className={`absolute inset-0 transition-all duration-500 ${
                            (carouselIndexes[project.mediaId] || 0) === idx
                              ? "opacity-100 z-10"
                              : "opacity-0 z-0"
                          }`}
                        >
                          {child.mediaType === "IMAGE" ? (
                            <Image
                              src={child.mediaUrl}
                              alt={`Media ${child.mediaId}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <video
                              className="w-full h-full object-cover"
                              src={child.mediaUrl}
                              muted
                              playsInline
                            />
                          )}
                        </div>
                      ))}

                      {project.children.length > 1 && (
                        <div className="absolute z-20 inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) =>
                              handleSlide(
                                e,
                                project.mediaId,
                                "prev",
                                project.children.length
                              )
                            }
                            className="bg-black/50 text-white rounded-full w-6 h-6 ml-1 z-30"
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
                            className="bg-black/50 text-white rounded-full w-6 h-6 mr-1 z-30"
                          >
                            ❯
                          </button>
                        </div>
                      )}
                    </>
                  ) : project.mediaType.includes("VIDEO") ||
                    project.mediaType.endsWith(".mp4") ? (
                    <video
                      className="w-full h-full object-cover"
                      src={project.mediaUrl}
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={project.mediaUrl}
                      alt={`Project ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-yellow-300 text-center text-base sm:text-lg text-Apfel-Grotezk">
                      Post Info & Insights ↗
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 font-qimano">
          Finding your projects...
        </p>
      )}
    </div>
  );
};

export default PortfolioPublic;
