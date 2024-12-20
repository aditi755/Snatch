"use client";

import { useState } from "react";
import { useFormContext } from "../context";
import MultiSelectInput from "@/components/MultiSelectInput";
import MoneyInput from "@/components/MoneyInput";
import NormalMultiSelect from "@/components/NormalMultiSelect";
export default function Step2() {
  const { formData, updateFormData } = useFormContext();

  const contentOptions = ["Story", "Reels", "Posts"];
  const compensationOptions = ["Gifting", "Sponsorships", "Affiliate"];

  const industryList = [
    "Accounting", "Advertising", "Aerospace", "Agriculture", "AI & Machine Learning",
    "Alternative Medicine", "Apparel", "Architecture", "Arts & Culture", "Automotive",
    "Aviation", "Baking & Bakeware", "Beauty", "Biotechnology", "Blogging & Vlogging",
    "Broadcasting", "Business & Finance", "Chemicals", "Clean Energy", "Climate Change",
    "Comedy", "Construction", "Consumer Electronics", "Consulting", "Cooking",
    "Crypto & Blockchain", "Cybersecurity", "Dance", "Design", "Digital Marketing",
    "DIY & Crafts", "E-Commerce", "Education", "Entertainment", "Environment",
    "Events Management", "Fashion", "Financial Services", "Fitness & Wellness",
    "Food & Beverage", "Gaming & Esports", "Games & Toys", "Government", "Haircare",
    "Healthcare & Medicine", "History", "Home & Decor", "Hospitality", "Human Rights",
    "Insurance", "Internet & Software", "Investments", "Jewelry", "Legal Services",
    "Literature", "Luxury Goods", "Makeup & Skincare", "Manufacturing", "Marketing",
    "Media & Publishing", "Mental Health", "Modeling", "Music", "Nonprofit & Social Causes",
    "Nutrition", "Outdoor Recreation", "Parenting & Kids", "Performing Arts", "Personal Care",
    "Pets", "Philosophy", "Photography", "Psychology", "Public Relations", "Real Estate",
    "Renewable Energy", "Retail", "Robotics", "Science", "Security", "Social Entrepreneurship",
    "Social Impact", "Social Media", "Software Development", "Spirituality", "Sports",
    "Sustainability", "Teaching & Education", "Tech & Gadgets", "Telecommunications",
    "Transportation", "Travel & Tourism", "Video & Production", "Virtual Reality",
    "Web Design & Development", "Wine & Spirits",
  ];

  const languageList = [
    "English", "Spanish", "French", "German", "Mandarin", "Hindi", "Japanese", "Marathi", "Gujrati", "Tamil", "Telugu", "Bengali", "Portuguese", "Italian", "Russian", "Arabic", "Korean", "Vietnamese", "Indonesian", "Turkish", "Urdu"
  ];

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
    <form className="w-full h-[100vh] overflow-hidden mx-auto space-y-6 font-apfel-grotezk-regular">
      <h2 className="text-2xl mt-10">And we&apos;re almost there!</h2>

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


      <NormalMultiSelect 
        label="Choose Compensation"
        options={compensationOptions}
        selectedValues={formData.compensation || []}
        onAddValue={(value) => handleAddValue("compensation", value)}
        onRemoveValue={(value) => handleRemoveValue("compensation", value)}/>

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
