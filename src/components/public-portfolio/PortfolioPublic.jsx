"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFetchPublicPosts } from "@/utils/public-portfolio/portfolio";
const PortfolioPublic = () => {
  const [projects, setProjects] = useState([]);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [username, setUsername] = useState("");
 
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching public posts...");
        const pathnameParts = window.location.pathname.split("/");
        const username =
          pathnameParts[pathnameParts.length - 1] || pathnameParts[pathnameParts.length - 2];
        setUsername(username);
        const url =  `/api/public-portfolio/posts?username=${username}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("Public post data:", data);

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

          console.log("Processed public projects:", processedProjects);
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
  <div className="w-full mx-auto lg:max-w-[1600px] max-w-[500px] p-6">
{projects.length > 0 ? (
  <div className="grid grid-cols-3 lg:grid-cols-4 gap-1 lg:gap-8">
    {projects.map((project, index) => (
      <div key={index} className="rounded-lg p-2">
        {project.mediaType === "CAROUSEL_ALBUM" && project.children ? (
        <Link href={`/public-portfolio/${username}/post/?postId=${project.mediaId}`} className="block">
        <div className="relative w-[80px] h-[108px] lg:w-[254px] lg:h-[254px] group">
          {project.children.map((child, idx) => (
            <div
              key={child.mediaId}
              className={`absolute inset-0 transition-all duration-500 ${
                (carouselIndexes[project.mediaId] || 0) === idx
                  ? "translate-x-0 opacity-100 z-10"
                  : "translate-x-1/2 opacity-0 z-0"
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
        </div>
      </Link>
        ) : project.mediaType.includes("VIDEO") || project.mediaType.endsWith(".mp4") ? (
          <Link href={`/public-portfolio/${username}/post/?postId=${project.mediaId}`}>
            <video
              controls
              className="w-[158px] h-[108px] lg:w-[254px] lg:h-[254px] object-cover rounded-md cursor-pointer"
            >
              <source src={project.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Link>
        ) : (
          <Link href={`/public-portfolio/${username}/post/?postId=${project.mediaId}`}>
            <Image
              width={158}
              height={108}
              src={project.mediaUrl}
              alt={`Project ${index + 1}`}
              className="w-[158px] h-[108px] lg:w-[254px] lg:h-[254px] object-cover rounded-md cursor-pointer"
            />
          </Link>
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

export default PortfolioPublic;

