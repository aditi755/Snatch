import React, { useState } from "react";
import Image from "next/image";
import UploadImageModal from "../UploadImageModal";

const Profilecustomfile = ({ onFileChange, placeholder, iconSrc, label, type, currentQuestionIndex }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  console.log("currentQuestionIndex", currentQuestionIndex);

  const handleImageSelect = (imageUrl) => {
    console.log("iamgeurl", imageUrl)
    setSelectedImage(imageUrl);
    onFileChange(imageUrl);
  };

  return (
    <div className="mt-4">
    
      <div
        className="mt-4 flex gap-8 cursor-pointer rounded-md border border-stroke px-5 py-3 text-dark-grey outline-none transition hover:border-primary active:border-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <Image src={iconSrc} alt="upload" width={30} height={20} />
        <span className="border-r-2 border-gray-300 -ml-4 "></span>
        <span className="-ml-4 font-apfel-grotezk-regular">{selectedImage || placeholder}</span>
      </div>

      {/* Upload Image Modal */}
      {isModalOpen && (
        <UploadImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImageSelect={handleImageSelect}
          type={type}
          questionIndex={currentQuestionIndex}
        />
      )}
    </div>
  );
};

export default Profilecustomfile;
