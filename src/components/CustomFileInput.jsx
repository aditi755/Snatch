import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useFormContext } from "@/app/onboarding/context";


  const CustomFileInput = ({ onFileChange, placeholder, iconSrc, label, fileNameKey }) => {
    const [fileName, setFileName] = useState(""); 
    const { formData } = useFormContext(); 
    const fileInputRef = useRef(null);
  
    // Load the file name directly from context when the component mounts
    useEffect(() => {
      if (formData && formData[fileNameKey]) {
        setFileName(formData[fileNameKey]); // Retrieve and set the file name from formData
      }
    }, [formData, fileNameKey]); // Dependency on formData and fileNameKey
  
    const handleButtonClick = () => {
      fileInputRef.current.click(); // Trigger file input click
    };
  
    const handleFileChange = (event) => {
      if (event.target.files) {
        const selectedFile = event.target.files[0];
        setFileName(selectedFile.name); 
        onFileChange(selectedFile); 
      }
    };
  
    return (
      <div className="mt-4">
        <h5>{label}</h5> {/* Dynamic label */}
        <div
          className="mt-4 flex gap-8 cursor-pointer rounded-md border border-stroke px-5 py-3 text-dark-grey outline-none transition hover:border-primary active:border-primary"
          onClick={handleButtonClick}
        >
          <Image src={iconSrc} alt="upload" width={30} height={20} />
          <span>{fileName || placeholder}</span> {/* Display file name or placeholder */}
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    );
  };

export default CustomFileInput;

