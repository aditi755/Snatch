"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useSelectedProjects } from "@/app/manage-projects/context";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
import Cropper from "react-easy-crop";

const ProjectCustomFileInput = ({
  placeholder,
  iconSrc,
  label,
  onFileChange, // Callback to handle the uploaded URL
  activeImageId, // Pass the activeImageId to update the correct formData
}) => {
  const [fileName, setFileName] = useState("");
  const [imageSrc, setImageSrc] = useState(null); // For cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false); // Modal toggle
  const fileInputRef = useRef(null);

  const { handleCompanyLogoUpload, updateFormDataForMedia } = useSelectedProjects();

  console.log("activeImageId: from logo company", activeImageId);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFileName(selectedFile.name);
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        setImageSrc(reader.result); // Load image for cropping
        setIsCropping(true); // Open cropping modal
      };
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    const croppedImage = await getCroppedImage(imageSrc, croppedAreaPixels, fileName);
    const uploadedUrl = await handleCompanyLogoUpload(croppedImage); // Upload cropped file to Cloudinary

    // Update the formData for the specific activeImageId
    console.log("activeImageId BEFORE IN CONTEXT", activeImageId);
    updateFormDataForMedia(activeImageId, { companyLogo: uploadedUrl });

    onFileChange(uploadedUrl); // Pass the uploaded URL to the parent component
    setIsCropping(false); // Close modal
    setImageSrc(null);
  };

  const getCroppedImage = (imageSrc, croppedAreaPixels, originalFileName) => {
    return new Promise((resolve) => {
      const image = new window.Image(); // Use native Image constructor
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          const file = new File([blob], originalFileName, { type: "image/jpeg" });
          resolve(file);
        }, "image/jpeg");
      };
    });
  };

  return (
    <div className="mt-0">
      <div
        className="mt-0 flex gap-8 cursor-pointer rounded-md border border-stroke px-5 py-3 text-dark-grey outline-none transition hover:border-primary active:border-primary"
        onClick={handleButtonClick}
      >
        <Image src={iconSrc} alt="upload" width={30} height={20} />
        <span>{fileName || placeholder}</span>
      </div>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />

      {/* Crop Modal */}
      {isCropping && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90%] overflow-auto">
            <div className="relative w-full h-[300px] md:h-[400px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // Adjust aspect ratio as needed
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={cropImage}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCustomFileInput;