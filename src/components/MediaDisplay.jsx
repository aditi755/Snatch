import React, { useState } from "react";
import Image from "next/image";
import { useSelectedProjects } from "@/app/manage-projects/context";

const MediaDisplay = ({ media, uploadedFiles, displayType }) => {
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const { selectionState, addInstagramSelection } = useSelectedProjects(); // Use selectionState from context

  console.log("media in mediadisplay", media);
  console.log("uploadedFiles in mediadisplay", uploadedFiles);

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

  const handleSelect = (mediaItem) => {

      // Check if the media item is already selected
    if (isMediaSelected(mediaItem.id)) {
    console.log("Media item is already selected.");
    return; 
  }
    if (mediaItem.media_type === "CAROUSEL_ALBUM" && mediaItem.children) {
      addInstagramSelection(
        mediaItem.media_url,
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
  };

  // Check if a media item is selected
  const isMediaSelected = (mediaId) => {
    return selectionState?.instagramSelected?.some(
      (item) => item.mediaId === mediaId
    );
  };

  // Check if an uploaded file is selected
  const isUploadedFileSelected = (fileId) => {
    return selectionState?.uploadedFiles?.some((file) => file._id === fileId);
  };

  return (
    <div className="mb-20 flex  justify-start 7xl:justify-center">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-w-screen-lg 4xl:max-w-screen-xl">
        {/* Render Instagram Media */}
        {displayType === "instagram" && media?.length > 0 ? (
          media.map((mediaItem) => (
            <div
              key={mediaItem.id}
              className="relative w-[200px] h-[200px] border border-gray-300 rounded-md overflow-x-hidden overflow-y-auto cursor-pointer"
              onClick={() => handleSelect(mediaItem)}
              disabled={isMediaSelected(mediaItem.id)}
            >
              {/* Circle on Top Left */}
              <div
                className={`absolute top-2 left-2 w-4 h-4 rounded-full flex items-center justify-center z-10 ${
                  isMediaSelected(mediaItem.id)
                    ? "bg-electric-blue"
                    : "bg-transparent border border-black"
                }`}
              >
                {/* Optional: Add text or icon inside the circle */}
              </div>

              {/* Media Content */}
              {mediaItem.media_type === "IMAGE" ? (
                <img
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
                        <img
                          src={child.media_url}
                          alt={`Media ${child.id}`}
                          fill
                          className="w-full h-full object-cover"
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
                      handleSlide(
                        mediaItem.id,
                        "prev",
                        mediaItem.children.length
                      );
                    }}
                  >
                    ❮
                  </button>
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlide(
                        mediaItem.id,
                        "next",
                        mediaItem.children.length
                      );
                    }}
                  >
                    ❯
                  </button>
                </div>
              ) : (
                <p>Unsupported media type</p>
              )}

              {/* Selected Line */}
              {isMediaSelected(mediaItem.id) && (
                <div className="absolute bottom-0 left-0 right-0 bg-electric-blue h-[35px] flex items-center justify-center font-apfel-grotezk-regular">
                  <Image
                    src="/assets/images/okay.svg"
                    alt="okay"
                    width={10}
                    height={10}
                    className="w-[15px] h-[12px] mr-7"
                  />
                  <span className="text-white -ml-5" style={{ fontWeight: 10 }}>
                    Selected
                  </span>
                </div>
              )}
            </div>
          ))
        ) : displayType === "uploaded" && uploadedFiles?.length > 0 ? (
          // Render Uploaded Files
          uploadedFiles.map((file) => (
            <div
              key={file._id}
              className="relative w-[200px] h-[200px] border border-gray-300 rounded-md overflow-x-hidden overflow-y-auto cursor-pointer"
            >
              {/* Circle on Top Left */}
              <div
                className={`absolute top-2 left-2 w-4 h-4 rounded-full flex items-center justify-center z-10 ${
                  isUploadedFileSelected(file._id)
                    ? "bg-electric-blue"
                    : "bg-transparent border border-black"
                }`}
              >
                {/* Optional: Add text or icon inside the circle */}
              </div>

              {/* Media Content */}
              {file.fileUrl.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
                <img
                  src={file.fileUrl}
                  alt={file.fileName || "Uploaded File"}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              ) : file.fileUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video
                  controls
                  className="object-cover w-full h-full"
                  src={file.fileUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Unsupported file type</p>
              )}

              {/* Selected Line */}
              {isUploadedFileSelected(file._id) && (
                <div className="absolute bottom-0 left-0 right-0 bg-electric-blue h-[35px] flex items-center justify-center font-apfel-grotezk-regular rounded-b-md">
                  <Image
                    src="/assets/images/okay.svg"
                    alt="okay"
                    width={10}
                    height={10}
                    className="w-[15px] h-[12px] mr-7"
                  />
                  <span className="text-white -ml-5" style={{ fontWeight: 10 }}>
                    Selected
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          // Fallback if no media or files are available
          <p className="font-apfel-grotezk-regular">Fetching all your posts...</p>
        )}
      </div>
    </div>
  );
};

export default MediaDisplay;

// const MediaDisplay = ({ media }) => {
//   const [carouselIndexes, setCarouselIndexes] = useState({});
//   const { selectionState, addInstagramSelection } = useSelectedProjects(); // Use selectionState from context

//   console.log("media in mediadisplay", media)
//   const handleSlide = (mediaId, direction, totalSlides) => {
//     setCarouselIndexes((prev) => {
//       const currentIndex = prev[mediaId] || 0;
//       const newIndex =
//         direction === "next"
//           ? (currentIndex + 1) % totalSlides
//           : currentIndex === 0
//           ? totalSlides - 1
//           : currentIndex - 1;
//       return { ...prev, [mediaId]: newIndex };
//     });
//   };

//   const handleSelect = (mediaItem) => {
//     if (mediaItem.media_type === "CAROUSEL_ALBUM" && mediaItem.children) {
//       addInstagramSelection(
//         mediaItem.media_url,
//         mediaItem.id,
//         mediaItem.media_type,
//         mediaItem.children.map((child) => ({
//           id: child.id,
//           media_url: child.media_url,
//           media_type: child.media_type,
//         }))
//       );
//     } else {
//       addInstagramSelection(
//         mediaItem.media_url,
//         mediaItem.id,
//         mediaItem.media_type
//       );
//     }
//   };

//   // Check if a media item is selected
//   const isMediaSelected = (mediaId) => {
//     return selectionState?.instagramSelected?.some((item) => item.mediaId === mediaId);
//   };


//   return (
//     <div className="mb-20  flex justify-center ">
// <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-w-screen-lg 4xl:max-w-screen-xl ">


//       {media?.length > 0 ? (
//         media.map((mediaItem) => (
//           <div
//             key={mediaItem.id}
//             className="relative w-[200px] h-[200px] border border-gray-300 rounded-md overflow-x-hidden overflow-y-auto cursor-pointer"
//             onClick={() => handleSelect(mediaItem)}
//           >
//             {/* Circle on Top Left */}
//             <div
//               className={`absolute top-2 left-2 w-4 h-4 rounded-full flex items-center justify-center z-10 ${
//                 isMediaSelected(mediaItem.id)
//                   ? "bg-electric-blue"
//                   : "bg-transparent  border border-black "
//               }`}
//             >
//               {/* Optional: Add text or icon inside the circle */}
//             </div>

//             {/* Media Content */}
//             {mediaItem.media_type === "IMAGE" ? (
//               <img
//                 src={mediaItem.media_url}
//                 alt={mediaItem.id || "Media"}
//                 width={200}
//                 height={200}
//                 className="object-cover w-full h-full"
//               />
//             ) : mediaItem.media_type === "VIDEO" ? (
//               <video
//                 controls
//                 className="object-cover w-full h-full"
//                 src={mediaItem.media_url}
//               >
//                 Your browser does not support the video tag.
//               </video>
//             ) : mediaItem.media_type === "CAROUSEL_ALBUM" &&
//               mediaItem.children ? (
//               <div className="relative w-full h-full">
//                 {mediaItem.children.map((child, index) => (
//                   <div
//                     key={child.id}
//                     className={`absolute inset-0 transition-transform duration-500 ${
//                       (carouselIndexes[mediaItem.id] || 0) === index
//                         ? "translate-x-0 opacity-100"
//                         : "translate-x-full opacity-0"
//                     }`}
//                   >
//                     {child.media_type === "IMAGE" ? (
//                       <img
//                         src={child.media_url}
//                         alt={`Media ${child.id}`}
//                         fill
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <video
//                         controls
//                         className="w-full h-full object-cover"
//                         src={child.media_url}
//                       >
//                         Your browser does not support the video tag.
//                       </video>
//                     )}
//                   </div>
//                 ))}

//                 {/* Navigation Dots */}
//                 <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
//                   {mediaItem.children.map((_, index) => (
//                     <div
//                       key={index}
//                       className={`w-2 h-2 rounded-full ${
//                         (carouselIndexes[mediaItem.id] || 0) === index
//                           ? "bg-blue-500"
//                           : "bg-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 {/* Navigation Buttons */}
//                 <button
//                   className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleSlide(mediaItem.id, "prev", mediaItem.children.length);
//                   }}
//                 >
//                   ❮
//                 </button>
//                 <button
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleSlide(mediaItem.id, "next", mediaItem.children.length);
//                   }}
//                 >
//                   ❯
//                 </button>
//               </div>
//             ) : (
//               <p>Unsupported media type</p>
//             )}

//             {/* Selected Line */}
//             {isMediaSelected(mediaItem.id) && (
//               <div className="absolute bottom-0 left-0 right-0 bg-electric-blue h-[35px] flex items-center justify-center font-apfel-grotezk-regular">        
//                   <Image src="/assets/images/okay.svg" alt="okay" width={10} height={10} className="w-[15px] h-[12px] mr-7"/>
//                   <span className="text-white -ml-5" style={{ fontWeight: 10 }}> Selected</span>
//               </div>
//             )}
//           </div>
//         ))
//       ) : (
//         <p>Fetching all your posts...</p>
//       )}
//     </div>
//       </div>
//   );
// };

// export default MediaDisplay;






// import React, { useState } from "react";
// import Image from "next/image";
// import { useSelectedProjects } from "@/app/manage-projects/context";

// const MediaDisplay = ({ media }) => {
//   const [carouselIndexes, setCarouselIndexes] = useState({});
//   const {addInstagramSelection} = useSelectedProjects();

//   const handleSlide = (mediaId, direction, totalSlides) => {
//     setCarouselIndexes((prev) => {
//       const currentIndex = prev[mediaId] || 0;
//       const newIndex =
//         direction === "next"
//           ? (currentIndex + 1) % totalSlides
//           : currentIndex === 0
//           ? totalSlides - 1
//           : currentIndex - 1;
//       return { ...prev, [mediaId]: newIndex };
//     });
//   };

//   return (
//     <div className="grid grid-cols-5 gap-4">
//     {media?.length > 0 ? (
//       media.map((mediaItem) => (
//         <div
//           key={mediaItem.id}
//           className="relative w-[200px] h-[200px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
//           onClick={() => {
//             if (mediaItem.media_type === "CAROUSEL_ALBUM" && mediaItem.children) {
//               addInstagramSelection(
//                 mediaItem.media_url, // No single media link for a carousel, handled via children
//                 mediaItem.id,
//                 mediaItem.media_type,
//                 mediaItem.children.map((child) => ({
//                   id: child.id,
//                   media_url: child.media_url,
//                   media_type: child.media_type,
//                 }))
//               );
//             } else {
//               addInstagramSelection(
//                 mediaItem.media_url,
//                 mediaItem.id,
//                 mediaItem.media_type
//               );
//             }
//           }}
//         >
//           {mediaItem.media_type === "IMAGE" ? (
//             <Image
//               src={mediaItem.media_url}
//               alt={mediaItem.id || "Media"}
//               width={200}
//               height={200}
//               className="object-cover w-full h-full"
//             />
//           ) : mediaItem.media_type === "VIDEO" ? (
//             <video
//               controls
//               className="object-cover w-full h-full"
//               src={mediaItem.media_url}

//             >
//               Your browser does not support the video tag.
//             </video>
//           ) : mediaItem.media_type === "CAROUSEL_ALBUM" &&
//             mediaItem.children ? (
//             <div className="relative w-full h-full">
//               {mediaItem.children.map((child, index) => (
//                 <div
//                   key={child.id}
//                   className={`absolute inset-0 transition-transform duration-500 ${
//                     (carouselIndexes[mediaItem.id] || 0) === index
//                       ? "translate-x-0 opacity-100"
//                       : "translate-x-full opacity-0"
//                   }`}
//                 >
//                   {child.media_type === "IMAGE" ? (
//                     <Image
//                       src={child.media_url}
//                       alt={`Media ${child.id}`}
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <video
//                       controls
//                       className="w-full h-full object-cover"
//                       src={child.media_url}
                      
//                     >
//                       Your browser does not support the video tag.
//                     </video>
//                   )}
//                 </div>
//               ))}
  
//               {/* Navigation Dots */}
//               <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
//                 {mediaItem.children.map((_, index) => (
//                   <div
//                     key={index}
//                     className={`w-2 h-2 rounded-full ${
//                       (carouselIndexes[mediaItem.id] || 0) === index
//                         ? "bg-blue-500"
//                         : "bg-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
  
//               {/* Navigation Buttons */}
//               <button
//                 className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleSlide(mediaItem.id, "prev", mediaItem.children.length);
//                 }}
//               >
//                 ❮
//               </button>
//               <button
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleSlide(mediaItem.id, "next", mediaItem.children.length);
//                 }}
//               >
//                 ❯
//               </button>
//             </div>
//           ) : (
//             <p>Unsupported media type</p>
//           )}
//         </div>
//       ))
//     ) : (
//       <p>No media found</p>
//     )}
//   </div>
  
//   );
// };

// export default MediaDisplay;
