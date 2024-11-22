"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingLayout({ children }) {
  const [formData, setFormData] = useState({ name: '', email: '' });  // To store form data
  const router = useRouter();

  const handleNextStep = () => {
    router.push('/onboarding/step-2');
  };

  // Update form data on step 1 form submission
  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-smoke overflow-hidden">
      {/* Left side: Image preview */}
      <div className="relative sm:w-1/2 h-screen flex justify-center items-center overflow-hidden rounded-md">
        {/* Background Image */}
        <Image
          src="/assets/images/signup_background.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="absolute p-0 sm:p-10 top-0 left-0 w-full max-h-[50vh] sm:max-h-full z-0 rounded-lg"
        />

        {/* White Box with Preview */}
        <div className="flex w-[319px] h-[450px] bg-smoke rounded-lg z-10 p-4">
          <div>
            <h3 className="text-lg font-medium">Preview:0</h3>
            <div className="mt-4">
              <div>
                <strong>Name: </strong> {formData.name || 'Your name'}
              </div>
              <div>
                <strong>Email: </strong> {formData.email || 'Your email'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center items-center">
        {/* Display Step Content (step 1 or step 2 form) */}
        {children}

        {/* Navigation Buttons */}
        <div className="mt-4 flex justify-between w-full">
          <button onClick={handleNextStep} className="btn-primary">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

