// src/app/onboarding/step-2/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "../context";
import MultiSelectInput from "@/components/MultiSelectInput";
import MoneyInput from "@/components/MoneyInput";
import NormalMultiSelect from "@/components/NormalMultiSelect";
import InfoNormalMultiSelect from "@/components/InfoNormalMultiSelect";
import { industryList } from "@/data/portfolio/industry";

export default function Step2() {
  const { formData, updateFormData, isSaving } = useFormContext();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add state to track form completion
  const [isFormComplete, setIsFormComplete] = useState(false);

  // Check if essential fields are filled
  useEffect(() => {
    const checkFormCompletion = () => {
      const requiredFields = {
        industry: formData.industry?.length > 0,
        contentType: formData.contentType?.length > 0,
        languages: formData.languages?.length > 0,
        compensation: formData.compensation?.length > 0,
      };
      
      setIsFormComplete(Object.values(requiredFields).every(Boolean));
    };

    checkFormCompletion();
  }, [formData]);

  const handleAddValue = (field, value) => {
    if (!formData[field]?.includes(value)) {
      updateFormData({
        [field]: [...(formData[field] || []), value],
      });
    }
  };
  
  const handleRemoveValue = (field, value) => {
    updateFormData({
      [field]: formData[field].filter((item) => item !== value),
    });
  };
  

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormComplete) return;
    
    setIsSubmitting(true);
    
    try {
      // Save final form data
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      await new Promise(resolve => setTimeout(resolve, 5000));
      router.push('/dashboard');

    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsSubmitting(false);
    }
  };

  // Show loading transition when submitting
  if (isSubmitting) {
    router.push('/onboarding/loading');
  }

  return (
    <div>
      <h2 className="text-3xl mt-10 font-qimano">And we&apos;re almost there!</h2>
      <form className="w-full xl:w-[726px] 5xl:w-[800px] h-[80vh] overflow-y-scroll mx-auto space-y-6 font-apfel-grotezk-regular mt-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

        <MultiSelectInput
          label="Choose Industry (Max 5)"
          data={industryList}
          selectedValues={formData.industry || []}
          onAddValue={(value) => handleAddValue("industry", value)}
          onRemoveValue={(value) => handleRemoveValue("industry", value)}
        />

        <NormalMultiSelect  
          label="Choose Content Type"
          options={["Story", "Reels", "Posts"]}
          selectedValues={formData.contentType || []}
          onAddValue={(value) => handleAddValue("contentType", value)}
          onRemoveValue={(value) => handleRemoveValue("contentType", value)}
        />

        <MultiSelectInput
          label="Choose Languages (Max 5)"
          data={[
            "English", "Spanish", "French", "German", "Mandarin", "Hindi", "Japanese", "Marathi", "Gujarati", "Tamil", "Telugu", "Bengali", "Portuguese", "Italian", "Russian", "Arabic", "Korean", "Vietnamese", "Indonesian", "Turkish", "Urdu"
          ]}
          selectedValues={formData.languages || []}
          onAddValue={(value) => handleAddValue("languages", value)}
          onRemoveValue={(value) => handleRemoveValue("languages", value)}
        />

        <InfoNormalMultiSelect
          label="Choose Compensation"
          options={["Gifting", "Sponsorships", "Affiliate", "Hosted", "Collaboration"]}
          selectedValues={formData.compensation || []}
          onAddValue={(value) => handleAddValue("compensation", value)}
          onRemoveValue={(value) => handleRemoveValue("compensation", value)}
        />

        <div className="space-x-0 flex flex-col">
          <h4 className="mb-5">Add pricing for your services</h4>
          <div className="flex flex-row gap-3">
            <MoneyInput
              title="Story"
              placeholder="Enter amount"
              value={formData.story}
              onChange={(value) => updateFormData({ story: value })}
            />
            <MoneyInput
              title="Post"
              placeholder="Enter amount"
              value={formData.post}
              onChange={(value) => updateFormData({ post: value })}
            />
            <MoneyInput
              title="Reel"
              placeholder="Enter amount"
              value={formData.reels}
              onChange={(value) => updateFormData({ reels: value })}
            />
          </div>
        </div>

        <div className="bg-transparent w-full h-24"></div>
      </form>
      {/* <button
        type="button"
        className={`mt-6 px-4 py-2 rounded ${isFormComplete ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        onClick={handleSubmit}
        disabled={!isFormComplete}
      >
        Complete Onboarding
      </button> */}
    </div>
  );
}