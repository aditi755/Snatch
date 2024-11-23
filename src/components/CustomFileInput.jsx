
import React, { useRef } from "react";
import Image from "next/image";

const CustomFileInput = ({ onFileChange, placeholder, iconSrc, label }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      onFileChange(event.target.files[0]); // Call the passed function on file selection
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
        <span>{placeholder}</span> {/* Placeholder text */}
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

