import React, { useState, useEffect } from "react";
import Image from "next/image";
import UploadImageModal from "../UploadImageModal";

const Profilecustomfile = ({
  onFileChange,
  placeholder,
  iconSrc,
  label,
  type,
  currentQuestionIndex,
  coverImage, // Passed from parent (About component)
  coverImageName, // Passed from parent (About component)
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    url: coverImage || null,
    name: coverImageName || null,
  });

  // Update selectedImage when coverImage or coverImageName props change
  useEffect(() => {
    setSelectedImage({
      url: coverImage || null,
      name: coverImageName || null,
    });
  }, [coverImage, coverImageName]);

  const imageNameMapping = {
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396552/7_r6djcr.jpg": "Sunlit Studio",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740392519/3_koofyi.jpg": "Urban Coffee Shop",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396410/4_fcsbyd.jpg": "Modern Workspace",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396474/2_svbihw.jpg": "Creative Corner",
    "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740397248/10_o9u87n.jpg": "Minimalist Desktop",
  };

  const handleImageSelect = (imageData) => {
    setSelectedImage({
      url: imageData.url,
      name: imageData.name,
    });
    setIsModalOpen(false);
    onFileChange(imageData); // Pass both URL and name to parent
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
          {selectedImage?.name || placeholder}
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