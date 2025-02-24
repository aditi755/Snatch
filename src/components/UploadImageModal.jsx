"use client";

import React, { useState, useRef, useEffect } from "react";
import { fetchProfileData } from "@/utils/postQuestions";
import Image from "next/image";
import clsx from "clsx";

export default function UploadImageModal({ isOpen, onClose, onImageSelect, type, questionIndex }) {

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
          break;
        case "audience":
          questionsArray = audienceQuestions;
          break;
        case "brand":
          questionsArray = brandQuestions;
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
  }, []);
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImages((prev) => [...prev, imageUrl]);
      setSelectedImage(imageUrl);
    }
  };

  const handleImageSelect = (image) => {
    console.log("imahge", image)
    setSelectedImage(image);
    onImageSelect(image);
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150; // Adjust scrolling speed
      scrollRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

   // Map type to colors
   const typeColors = {
    about: "bg-lime-yellow", 
    audience: "bg-electric-blue",
    brand: "bg-black", 
  };

  const cardColor = typeColors[type]; 
  const predefinedImages = imagesByType || [];

  const handleClose = () => {
    console.log("Modal close triggered");
    onClose(); // Calls the parent function
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
                className="relative border rounded-md w-[135px] h-[228px] overflow-hidden cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {/* Selected Image or Default */}
                <Image
                  src={selectedImage || "/assets/images/preview.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  width={135}
                  height={228}
                />
                
                {/* Sliding Yellow Question Box */}
              <div
               className={clsx(
                `absolute left-0 bottom-0 w-full ${cardColor} flex flex-col items-center justify-center text-white transition-all duration-300 rounded-t-md text-graphite`,
                hovered ? "h-[100%]" : "h-[50%]"
              )}
              >
                <p className="text-center font-qimano  text-graphite">{question}</p>
                {hovered && (
                <p className="text-xs text-center  text-graphite">
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
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md z-10"
                >
                  ←
                </button>

                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto space-x-4 scrollbar-hide px-3 w-[480px]"
                >
                  {/* Uploaded + Predefined Images */}
                  {[...uploadedImages, ...predefinedImages].map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageSelect(image)}
                      className="cursor-pointer border rounded-md overflow-hidden flex-shrink-0 w-[135px] h-[228px]"
                    >
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-[135px] h-[228px] object-cover"
                        width={135}
                        height={228}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Scroll Button */}
                <button
                  onClick={() => handleScroll("right")}
                  className="absolute -right-80  top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md z-10"
                >
                  →
                </button>
              </div>
            </div>

            <button className="bg-electric-blue px-5 py-3 text-white rounded-md flex justify-center items-center mx-auto ">
              <p className="font-apfel-grotezk-regular text-lg">Confirm Upload</p>
            </button>

          </div>
        </div>
      )}
    </>
  );
}

 