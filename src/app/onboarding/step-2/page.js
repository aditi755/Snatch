// src/app/onboarding/step-2/page.js
"use client";

import { useState } from "react";
import { useFormContext } from "../context";
import MultiSelectInput from "@/components/MultiSelectInput";
import MoneyInput from "@/components/MoneyInput";
import NormalMultiSelect from "@/components/NormalMultiSelect";
import { industryList } from "@/data/portfolio/industry";
import InfoNormalMultiSelect from "@/components/InfoNormalMultiSelect";

// export const dynamic = 'force-dynamic';

export default function Step2() {
  const { formData, updateFormData, isSaving } = useFormContext();
  const contentOptions = ["Story", "Reels", "Posts"];
  const compensationOptions = ["Gifting", "Sponsorships", "Affiliate", "Hosted", "Collaboration"];
  const languageList = [
    "English", "Spanish", "French", "German", "Mandarin", "Hindi", "Japanese", "Marathi", "Gujarati", "Tamil", "Telugu", "Bengali", "Portuguese", "Italian", "Russian", "Arabic", "Korean", "Vietnamese", "Indonesian", "Turkish", "Urdu"
  ];


  console.log("saving", isSaving) //undefined
  // Handle changes for a specific field
  const handleAddValue = (fieldName, value) => {
    const updatedValues = [...(formData[fieldName] || []), value];
    updateFormData({ [fieldName]: updatedValues });
  };

  const handleRemoveValue = (fieldName, value) => {
    const updatedValues = (formData[fieldName] || []).filter((item) => item !== value);
    updateFormData({ [fieldName]: updatedValues });

  };

  return (
    <div>
    <h2 className="text-3xl mt-10 font-qimano">And we&apos;re almost there!</h2>
    <form className="w-full xl:w-[726px] 5xl:w-[800px] h-[80vh] overflow-y-scroll mx-auto space-y-6 font-apfel-grotezk-regular mt-6"    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

        <MultiSelectInput
          label="Choose Industry (Max 5)"
          data={industryList}
          selectedValues={formData.industry || []}
          onAddValue={(value) => handleAddValue("industry", value)}
          onRemoveValue={(value) => handleRemoveValue("industry", value)}
        />

      <NormalMultiSelect  
        label="Choose Content Type"
        options={contentOptions}
        selectedValues={formData.contentType || []}
        onAddValue={(value) => handleAddValue("contentType", value)}
        onRemoveValue={(value) => handleRemoveValue("contentType", value)}/>

      <MultiSelectInput
        label="Choose Languages (Max 5)"
        data={languageList}
        selectedValues={formData.languages || []}
        onAddValue={(value) => handleAddValue("languages", value)}
        onRemoveValue={(value) => handleRemoveValue("languages", value)}
      />


      <InfoNormalMultiSelect
        label="Choose Compensation"
        options={compensationOptions}
        selectedValues={formData.compensation || []}
        onAddValue={(value) => handleAddValue("compensation", value)}
        onRemoveValue={(value) => handleRemoveValue("compensation", value)}/>

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
    </div>
  );
}