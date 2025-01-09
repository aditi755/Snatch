import React, { useState } from "react";
import Image from "next/image";
import { useSelectedProjects } from "@/app/manage-projects/context";

const MediaDisplay = ({ media }) => {
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const {addInstagramSelection} = useSelectedProjects();

  const handleSlide = (mediaId, direction, totalSlides) => {
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
    <div className="grid grid-cols-5 gap-4">
    {media.length > 0 ? (
      media.map((mediaItem) => (
        <div
          key={mediaItem.id}
          className="relative w-[200px] h-[200px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
          onClick={() => {
            if (mediaItem.media_type === "CAROUSEL_ALBUM" && mediaItem.children) {
              addInstagramSelection(
                mediaItem.media_url, // No single media link for a carousel, handled via children
                mediaItem.id,
                mediaItem.media_type,
                mediaItem.children.map((child) => ({
                  id: child.id,
                  media_url: child.media_url,
                  media_type: child.media_type,
                }))
              );
            } else {
              addInstagramSelection(
                mediaItem.media_url,
                mediaItem.id,
                mediaItem.media_type
              );
            }
          }}
        >
          {mediaItem.media_type === "IMAGE" ? (
            <Image
              src={mediaItem.media_url}
              alt={mediaItem.id || "Media"}
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
          ) : mediaItem.media_type === "VIDEO" ? (
            <video
              controls
              className="object-cover w-full h-full"
              src={mediaItem.media_url}

            >
              Your browser does not support the video tag.
            </video>
          ) : mediaItem.media_type === "CAROUSEL_ALBUM" &&
            mediaItem.children ? (
            <div className="relative w-full h-full">
              {mediaItem.children.map((child, index) => (
                <div
                  key={child.id}
                  className={`absolute inset-0 transition-transform duration-500 ${
                    (carouselIndexes[mediaItem.id] || 0) === index
                      ? "translate-x-0 opacity-100"
                      : "translate-x-full opacity-0"
                  }`}
                >
                  {child.media_type === "IMAGE" ? (
                    <Image
                      src={child.media_url}
                      alt={`Media ${child.id}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      controls
                      className="w-full h-full object-cover"
                      src={child.media_url}
                      
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
  
              {/* Navigation Dots */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {mediaItem.children.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      (carouselIndexes[mediaItem.id] || 0) === index
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
  
              {/* Navigation Buttons */}
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlide(mediaItem.id, "prev", mediaItem.children.length);
                }}
              >
                ❮
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlide(mediaItem.id, "next", mediaItem.children.length);
                }}
              >
                ❯
              </button>
            </div>
          ) : (
            <p>Unsupported media type</p>
          )}
        </div>
      ))
    ) : (
      <p>No media found</p>
    )}
  </div>
  
  );
};

export default MediaDisplay;
