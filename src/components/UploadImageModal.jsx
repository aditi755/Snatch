"use client";

import React, { useState, useRef, useEffect } from "react";
import { fetchProfileData } from "@/utils/postQuestions";
import { saveQuestionsToDB } from "@/utils/postQuestions";

import Image from "next/image";
import clsx from "clsx";

// At the top of the file, add this mapping object
const imageNameMapping = {
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396552/7_r6djcr.jpg": "Sunlit Studio",
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740392519/3_koofyi.jpg": "Urban Coffee Shop",
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396410/4_fcsbyd.jpg": "Modern Workspace",
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396474/2_svbihw.jpg": "Creative Corner",
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg": "Minimalist Desktop"
};

export default function UploadImageModal({ isOpen, onClose, onImageSelect, type, questionIndex, currentQuestion }) {

  const imagesByType =  [
      "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396552/7_r6djcr.jpg",
      "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740392519/3_koofyi.jpg",
      "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396410/4_fcsbyd.jpg",
      "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396474/2_svbihw.jpg",
      "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg"
    ]


  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [iconSrc, setIconSrc] = useState("");
  const [tempSelectedImage, setTempSelectedImage] = useState(null); // Add this new state

  const scrollRef = useRef(null);


  const fetchData = async () => {
    try {
      console.log("type first", type);
      const { aboutQuestions, audienceQuestions, brandQuestions } = await fetchProfileData();
      console.log("Fetched questionnaires:", { aboutQuestions, audienceQuestions, brandQuestions });
  
      let defaultImage = "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg";
      let currentImage = defaultImage;
      let currentQuestion = "";
      let currentAnswer = "";
  
      // Determine which array to use based on the `type` prop
      let questionsArray;
      switch (type) {
        case "about":
          questionsArray = aboutQuestions;
          setIconSrc("/assets/images/aboutIcon.svg");
          break;
        case "audience":
          questionsArray = audienceQuestions;
          setIconSrc("/assets/images/audienceIcon.svg");
          break;
        case "brand":
          questionsArray = brandQuestions;
          setIconSrc("/assets/images/brandIcon.svg");
          break;
        default:
          console.warn("Invalid type provided");
          return;
      }
  
      console.log("Selected questions array:", questionsArray);
  
      // Check if the questions array exists and has questions
      if (questionsArray && questionsArray.length > 0) {
        // Use questionIndex to get the correct question
        const selectedQuestion = questionsArray[questionIndex];
        if (selectedQuestion) {
          currentImage = selectedQuestion.coverImage || defaultImage;
          currentQuestion = selectedQuestion.question || "";
          currentAnswer = selectedQuestion.answer || "";
          console.log("CURRENTIMAGE", currentImage);
          console.log("CURRENTQUESTION", currentQuestion);
          console.log("CURRENTANSWER", currentAnswer);
        }
      }
  
      console.log("Selected image:", currentImage);
      setSelectedImage(currentImage);
      setQuestion(currentQuestion); // Set the question state
      setAnswer(currentAnswer); // Set the answer state
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

    useEffect(() => {
    fetchData();
    // Reset temp selection when modal opens
    setTempSelectedImage(null);
  }, [isOpen]);
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImages((prev) => [...prev, imageUrl]);
      setSelectedImage(imageUrl);
    }
  };

  // Find the handleImageSelect function and modify it:
  const handleImageSelect = (image) => {
    console.log("image", image);
    const imageName = imageNameMapping[image] || 'Selected Image';
    setTempSelectedImage({ url: image, name: imageName }); // Update temporary selection
    setSelectedImage(image); // Update preview
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150; // Adjust scrolling speed
      scrollRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

   // Map type to colors
   const typeColors = {
    about: { bg: "bg-lime-yellow", text: "text-graphite" },
    audience: { bg: "bg-electric-blue", text: "text-white" },
    brand: { bg: "bg-graphite", text: "text-lime-yellow" },
  };

  const cardType = typeColors[type] || typeColors.about; 
  const predefinedImages = imagesByType || [];

  const handleClose = () => {
    console.log("Modal close triggered");
    onClose(); // Calls the parent function
  };

  const handleConfirmUpload = async () => {
    if (tempSelectedImage) {
      try {
        // Prepare the question data
        const updatedQuestion = {
          ...currentQuestion,
          coverImage: tempSelectedImage.url,
          coverImageName: tempSelectedImage.name || imageNameMapping[tempSelectedImage.url] || 'Selected Image'
        };

        // Save to database
        await saveQuestionsToDB(type, [updatedQuestion]);

        // Update UI
        onImageSelect({
          url: tempSelectedImage.url,
          name: tempSelectedImage.name || imageNameMapping[tempSelectedImage.url] || 'Selected Image'
        });
        
        onClose();
      } catch (error) {
        console.error("Failed to save image:", error);
        alert("Failed to save image. Please try again.");
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h2 className="text-3xl text-electric-blue font-qimano">
                  Upload Background
                </h2>
                <p className="font-apfel-grotezk-regular text-gray-500">
                  Select an image that sets with the vibe of your question
                </p>
              </div>
              <button onClick={handleClose} className="text-red-500 text-lg ">
                <Image src="/assets/images/close.svg" alt="Close" width={20} height={20} />
              </button>
            </div>

            {/* Image Collection */}
            <div className="flex">
              <p className="font-qimano text-graphite">Choose from our collection</p>
              <div className="flex-1 ml-2 mt-2.5 border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 mt-5">
              {/* Interactive Preview Card */}
              <div
                className="relative border rounded-md w-[165px] h-[228px] overflow-hidden cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {/* Selected Image or Default */}
                <Image
                  src={selectedImage || "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  width={165}
                  height={228}
                />
                
                {/* Sliding Yellow Question Box */}
              <div
                className={clsx(
                  `absolute left-0 bottom-0 w-full flex flex-col items-center justify-center transition-all duration-300 rounded-t-md`,
                  cardType.bg, cardType.text, 
                  hovered ? "h-[100%]" : "h-[50%]"
                )}
              >
                <Image src={iconSrc || "/assets/images/aboutIcon.svg"} alt="about-icon" height={10} width={10} className="w-20 h-17 mt-1"/>
                      <p className={clsx("text-center font-qimano", cardType.text)}>
                      {question}
                      </p>

                      {hovered && (
                      <p
                      className={clsx(
                      "text-xs text-center font-apfel-grotezk-regular mt-4",
                      cardType.text // Dynamically apply text color
                      )}
                      >
                      {answer}
                      </p>
                  )}
              </div>
              </div>

                {/* Scrollable Image Row with Navigation */}
                <div className="relative flex-1">
                {/* Left Scroll Button */}
                <button
                onClick={() => handleScroll("left")}
                className="absolute w-[45px] h-[43px] left-3 top-1/2 transform -translate-y-1/2 bg-[#212121]/60 text-white rounded-full shadow-md hover:bg-[#212121]/80 transition duration-200 z-10"
              >
                &larr;
              </button>

                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto space-x-4 scrollbar-hide px-3 w-[480px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {/* Uploaded + Predefined Images */}
                  {[...uploadedImages, ...predefinedImages].map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageSelect(image)}
                      className="cursor-pointer border rounded-md overflow-hidden flex-shrink-0 w-[165px] h-[228px]"
                    >
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-[165px] h-[228px] object-cover"
                        width={165}
                        height={228}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Scroll Button */}
                <button
                  onClick={() => handleScroll("right")}
                  className="absolute w-[45px] h-[43px] -right-80 top-1/2 transform -translate-y-1/2 bg-[#212121]/60 p-3 rounded-full shadow-lg flex items-center justify-center"
                >
                  <Image src="/assets/images/forwardArrowBlack.svg" alt="Right Arrow" width={20} height={20} className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button 
              onClick={handleConfirmUpload}
              className="bg-electric-blue px-5 py-3 text-white rounded-md flex justify-center items-center mx-auto"
            >
              <p className="font-apfel-grotezk-regular text-lg">Confirm Upload</p>
            </button>

          </div>
        </div>
      )}
    </>
  );
}

