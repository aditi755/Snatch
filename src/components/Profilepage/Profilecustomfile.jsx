import React, { useState } from "react";
import Image from "next/image";
import UploadImageModal from "../UploadImageModal";

const Profilecustomfile = ({ onFileChange, placeholder, iconSrc, label, type, currentQuestionIndex }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const imageNameMapping = {
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396552/7_r6djcr.jpg": "Sunlit Studio",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740392519/3_koofyi.jpg": "Urban Coffee Shop",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396410/4_fcsbyd.jpg": "Modern Workspace",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396474/2_svbihw.jpg": "Creative Corner",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg": "Minimalist Desktop"
  };

  const handleImageSelect = (imageUrl) => {
    const imageName = imageNameMapping[imageUrl] || 'Selected Image';
    setSelectedImage({ url: imageUrl, name: imageName });
    setIsModalOpen(false); 
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
        <span className="-ml-4 font-apfel-grotezk-regular">
          {selectedImage ? selectedImage.name : placeholder}
        </span>
      </div>

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
