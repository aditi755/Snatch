import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useFormContext } from "@/app/onboarding/context";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
import Cropper from "react-easy-crop";


const CustomFileInput = ({ onFileChange, placeholder, iconSrc, label, fileNameKey }) => {
  const [fileName, setFileName] = useState("");
  const [imageSrc, setImageSrc] = useState(null); // For cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false); // Modal toggle
  const { formData } = useFormContext();
  const fileInputRef = useRef(null);


  useEffect(() => {
    // Load the file name and preview image from localStorage
    const savedImage = localStorage.getItem(fileNameKey);
    if (formData && formData[fileNameKey]) {
      setFileName(formData[fileNameKey]);
    }
  }, [formData, fileNameKey]);


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
      //onFileChange(selectedFile); // Pass raw file to parent
    }
  };


  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };


  const cropImage = async () => {
    const croppedImage = await getCroppedImage(imageSrc, croppedAreaPixels, fileName);
    const uploadedUrl = await cloudinaryUpload(croppedImage);
   // onFileChange(croppedImage); // Pass cropped file to parent
   console.log("uploaded url", uploadedUrl)
    onFileChange(uploadedUrl);
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
    <div className="mt-4">
      <h5>{label}</h5>
      <div
        className="mt-4 flex gap-8 cursor-pointer rounded-md border border-stroke px-5 py-3 text-dark-grey outline-none transition hover:border-primary active:border-primary"
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
      <div className="flex  gap-4 mt-4">
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


export default CustomFileInput;


// import React, { useRef, useState, useEffect } from "react";
// import Image from "next/image";
// import { useFormContext } from "@/app/onboarding/context";


//   const CustomFileInput = ({ onFileChange, placeholder, iconSrc, label, fileNameKey }) => {
//     const [fileName, setFileName] = useState(""); 
//     const { formData } = useFormContext(); 
//     const fileInputRef = useRef(null);
  
//     // Load the file name directly from context when the component mounts
//     useEffect(() => {
//       if (formData && formData[fileNameKey]) {
//         setFileName(formData[fileNameKey]); 
//       }
//     }, [formData, fileNameKey]); 
  
//     const handleButtonClick = () => {
//       fileInputRef.current.click(); 
//     };
  
//     const handleFileChange = (event) => {
//       if (event.target.files) {
//         const selectedFile = event.target.files[0];
//         setFileName(selectedFile.name); 
//         onFileChange(selectedFile); 
//       }
//     };
  
//     return (
//       <div className="mt-4">
//         <h5>{label}</h5> 
//         <div
//           className="mt-4 flex gap-8 cursor-pointer rounded-md border border-stroke px-5 py-3 text-dark-grey outline-none transition hover:border-primary active:border-primary"
//           onClick={handleButtonClick}
//         >
//           <Image src={iconSrc} alt="upload" width={30} height={20} />
//           <span>{fileName || placeholder}</span> 
//         </div>
//         <input
//           type="file"
//           className="hidden"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//         />
//       </div>
//     );
//   };

// export default CustomFileInput;
