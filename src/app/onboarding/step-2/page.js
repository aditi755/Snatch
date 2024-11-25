"use client";

import { useState } from "react";
import { useFormContext } from "../context";
import MultiSelectInput from "@/components/MultiSelectInput";
import MoneyInput from "@/components/MoneyInput";

export default function Step2() {
  const { formData, updateFormData } = useFormContext();

  const industryOptions = ["Design", "Marketing", "Development", "Product", "Sales", "Human Resources"];
  const contentOptions = ["Story", "Reels", "Posts"];
  const compensationOptions = ["Gifting", "Sponsorships", "Affiliate"];

  // Handle changes for a specific field
  const handleAddValue = (fieldName, value) => {
    const updatedValues = [...(formData[fieldName] || []), value];
    updateFormData({ [fieldName]: updatedValues });
  };

  const handleRemoveValue = (fieldName, value) => {
    const updatedValues = (formData[fieldName] || []).filter((item) => item !== value);
    updateFormData({ [fieldName]: updatedValues });
    console.log('remove click ')
  };

  return (
    <form className="w-full h-[100vh] overflow-hidden mx-auto space-y-6">
      <h2 className="text-2xl mt-10">And we're almost there!</h2>
      <div className="flex flex-row gap-6">
        <MultiSelectInput
          label="Choose Industry"
          options={industryOptions}
          selectedValues={formData.industry || []}
          onAddValue={(value) => handleAddValue("industry", value)}
          onRemoveValue={(value) => handleRemoveValue("industry", value)}
        />
      </div>
      <MultiSelectInput
        label="Choose Content Type"
        options={contentOptions}
        selectedValues={formData.contentType || []}
        onAddValue={(value) => handleAddValue("contentType", value)}
        onRemoveValue={(value) => handleRemoveValue("contentType", value)}
      />
      <MultiSelectInput
        label="Choose Compensation"
        options={compensationOptions}
        selectedValues={formData.compensation || []}
        onAddValue={(value) => handleAddValue("compensation", value)}
        onRemoveValue={(value) => handleRemoveValue("compensation", value)}
      />

       <div className="space-x-0 flex flex-col">
        <h4 className="mb-5">Add pricing for your services</h4>
        <div className="flex flex-row gap-3">
          <MoneyInput
          title="Post"
          placeholder="Enter amount"
          value={formData.post}
          onChange={(value) => updateFormData({ post: value })}
        />
        <MoneyInput
          title="Story"
          placeholder="Enter amount"
          value={formData.story}
          onChange={(value) => updateFormData({ story: value })}
        />
        <MoneyInput
          title="Reel"
          placeholder="Enter amount"
          value={formData.reels}
          onChange={(value) => updateFormData({ reels: value })}
        />
        </div>
        </div>
    </form>
  );
}
