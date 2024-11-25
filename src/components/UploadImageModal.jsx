"use client";

import React, { useState } from "react";
import Image from "next/image";
export default function UploadImageModal({ isOpen, onClose, onImageSelect }) {
  const [images] = useState([
    "/assets/images/sample1.jpg",
    "/assets/images/sample2.jpg",
    "/assets/images/sample3.jpg",
    "/assets/images/sample4.jpg",
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageSelect(imageUrl);
      onClose(); 
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Choose an Image</h2>
              <button onClick={onClose} className="text-red-500 text-lg">
                ×
              </button>
            </div>

            {/* Image Collection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onImageSelect(image);
                    onClose();
                  }}
                  className="cursor-pointer border rounded-md overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={24}
                    height={24}
                  />
                </div>
              ))}
            </div>

            {/* Choose from Device */}
            <div className="text-center">
              <p className="mb-4 text-gray-600">Choose from your device</p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center justify-center w-24 h-24 border border-dashed border-gray-400 rounded-md"
              >
                <span className="text-gray-400 text-2xl">+</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}