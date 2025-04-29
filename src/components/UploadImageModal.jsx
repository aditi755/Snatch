"use client";

import React, { useState, useRef, useEffect } from "react";
import { fetchProfileData, saveQuestionsToDB } from "@/utils/postQuestions";
import Image from "next/image";
import clsx from "clsx";

const imageNameMapping = {
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396552/7_r6djcr.jpg": "Sunlit Studio",
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740392519/3_koofyi.jpg": "Urban Coffee Shop",
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396410/4_fcsbyd.jpg": "Modern Workspace",
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396474/2_svbihw.jpg": "Creative Corner",
  "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg": "Minimalist Desktop",
};

export default function UploadImageModal({ isOpen, onClose, onImageSelect, type, questionIndex, currentQuestion }) {
  const imagesByType = [
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396552/7_r6djcr.jpg",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740392519/3_koofyi.jpg",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396410/4_fcsbyd.jpg",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396474/2_svbihw.jpg",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [iconSrc, setIconSrc] = useState("");
  const [tempSelectedImage, setTempSelectedImage] = useState(null);

  const scrollRef = useRef(null);

  const fetchData = async () => {
    try {
      const { aboutQuestions, audienceQuestions, brandQuestions } = await fetchProfileData();

      let defaultImage = "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg";
      let currentImage = defaultImage;
      let currentQuestionText = "";
      let currentAnswerText = "";

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
          return;
      }

      if (questionsArray?.length > 0 && questionsArray[questionIndex]) {
        const selected = questionsArray[questionIndex];
        currentImage = selected.coverImage || defaultImage;
        currentQuestionText = selected.question || "";
        currentAnswerText = selected.answer || "";
      }

      setSelectedImage(currentImage);
      setQuestion(currentQuestionText);
      setAnswer(currentAnswerText);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setTempSelectedImage(null);
    }
  }, [isOpen]);

  const handleImageSelect = (image) => {
    const imageName = imageNameMapping[image] || "Selected Image";
    setTempSelectedImage({ url: image, name: imageName });
    setSelectedImage(image);
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 180;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const typeColors = {
    about: { bg: "bg-lime-yellow", text: "text-graphite" },
    audience: { bg: "bg-electric-blue", text: "text-white" },
    brand: { bg: "bg-graphite", text: "text-lime-yellow" },
  };

  const cardType = typeColors[type] || typeColors.about;

  const handleConfirmUpload = async () => {
    if (tempSelectedImage) {
      try {
        const updatedQuestion = {
          ...currentQuestion,
          coverImage: tempSelectedImage.url,
          coverImageName: tempSelectedImage.name || imageNameMapping[tempSelectedImage.url] || "Selected Image",
        };

        await saveQuestionsToDB(type, [updatedQuestion]);

        onImageSelect({
          url: tempSelectedImage.url,
          name: tempSelectedImage.name || "Selected Image",
        });

        onClose();
      } catch (err) {
        console.error("Save failed:", err);
        alert("Failed to save image. Please try again.");
      }
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <h2 className="text-3xl text-electric-blue font-qimano">Upload Background</h2>
              <p className="font-apfel-grotezk-regular text-gray-500">Select an image that sets with the vibe of your question</p>
            </div>
            <button onClick={onClose} className="text-red-500 text-lg">
              <Image src="/assets/images/close.svg" alt="Close" width={20} height={20} />
            </button>
          </div>

          <div className="flex mb-2">
            <p className="font-qimano text-graphite">Choose from our collection</p>
            <div className="flex-1 ml-2 mt-2.5 border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 mt-5">
            <div
              className="relative border rounded-md w-[165px] h-[228px] overflow-hidden cursor-pointer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Image
                src={selectedImage || imageNameMapping[4]}
                alt="Preview"
                className="w-full h-full object-cover"
                width={165}
                height={228}
              />
              <div
                className={clsx(
                  `absolute left-0 bottom-0 w-full flex flex-col items-center justify-center transition-all duration-300 rounded-t-md`,
                  cardType.bg,
                  cardType.text,
                  hovered ? "h-full" : "h-1/2"
                )}
              >
                <Image src={iconSrc} alt="icon" width={80} height={68} className="mt-1" />
                <p className="text-center font-qimano">{question}</p>
                {hovered && <p className="text-xs text-center font-apfel-grotezk-regular mt-4">{answer}</p>}
              </div>
            </div>

            <div className="relative col-span-2 sm:col-span-3">
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-[-184px] top-1/2 transform -translate-y-1/2 bg-[#212121]/60 p-3 rounded-full shadow-lg z-10"
              >
                <Image
                  src="/assets/images/forwardArrowBlack.svg"
                  alt="Left Arrow"
                  width={20}
                  height={20}
                  className="transform rotate-180"
                />
              </button>

              <div ref={scrollRef} className="flex overflow-x-auto space-x-4 mt-2">
                {imagesByType.map((image) => (
                  <div
                    key={image}
                    className={`cursor-pointer border-2 rounded-md ${
                      tempSelectedImage?.url === image ? "border-electric-blue" : "border-transparent"
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <Image src={image} alt="option" width={100} height={140} className="object-cover rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirmUpload}
            className="bg-electric-blue text-white py-2 px-6 rounded-md font-qimano hover:bg-electric-blue/90"
          >
            Confirm Upload
          </button>
        </div>
      </div>
    )
  );
}
