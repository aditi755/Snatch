
"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "../context";
import { useRouter } from "next/navigation";
import CustomDropdown from "@/components/CustomDropdown";
import InstagramInput from "@/components/InstagramInput";
import SocialLinksDropdown from "@/components/SocialLinksDropdown";
import CustomFileInput from "@/components/CustomFileInput";
import FormInput from "@/components/FormInput";
import Preview from "@/components/Preview";


export default function Step1() {
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    location:"",
    links: [],
    instagram: "",
    profilePicture: null,
    backgroundPicture: null,
  });

  // Synchronize formState with formData when formData updates
  useEffect(() => {
    setFormState({
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      gender: formData.gender || "",
      location: formData.location || "",
      links: formData.links || [],
      instagram: formData.instagram || "",
      profilePicture: formData.profilePicture || null,
      backgroundPicture: formData.backgroundPicture || null,
    });
  }, [formData]);

  // Update a specific field
  const updateField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    updateFormData({ [field]: value }); // Update context immediately
  };

  console.log("formState from step1 page", formState)

  // Add a new social link
  const handleAddSocialLink = () => {
    console.log(formState.links)
    updateField("links", [...formState.links, {}]);
  };

  // Update a specific social link
  const handleLinkChange = (index, data) => {
    const updatedLinks = [...formState.links];
    updatedLinks[index] = data;
    updateField("links", updatedLinks);
  };

  console.log("updated Links", formState.links)

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formstate from step-1 page sending to context", formState)
    updateFormData(formState);
    // router.push("/onboarding/step-2");
  };

  return (
    <form
      className="w-full h-[100vh] overflow-hidden mx-auto space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl mt-10">Let's get Started</h2>

      {/* First and Last Name */}
      <div className="flex flex-row gap-6">
        <FormInput
          placeholder="First Name"
          value={formState.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
        />
        <FormInput
          placeholder="Last Name"
          value={formState.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
        />
      </div>

      {/* Gender Dropdown */}
      <div className="flex flex-row gap-6">
        <CustomDropdown
          options={["Male", "Female", "Other", "Prefer not to say"]}
          placeholder="Gender"
          onSelect={(option) => updateField("gender", option)}
          selected={formState.gender}
        />

          <FormInput
          placeholder="Date of birth"
          value={"Date of birth"}
          onChange={(e) => updateField("lastName", e.target.value)}
        />
      </div>

      <FormInput
          placeholder="Location"
          value={formState.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
     

      {/* Social Links */}
      <div>
        <h6 className="font-medium text-graphite">Add social links</h6>
        <div className="mt-3">
        <InstagramInput
          value={formState.instagram}
          onChange={(value) => updateField("instagram", value)}
        />
          {formState.links.map((link, index) => (
            <SocialLinksDropdown
              key={index}
              initialData={link}
              onChange={(data) => handleLinkChange(index, data)}
            />
          ))}
          <button
            type="button"
            className="mt-4 flex items-center gap-2 text-dark-grey cursor-pointer"
            onClick={handleAddSocialLink}
          >
            Add More Links
          </button>
        </div>
      </div>

      {/* Upload Picture & Background */}
      <div className="space-y-4">
      <CustomFileInput
    onFileChange={(file) => updateFormData({ profilePicture: file })}
    placeholder="Upload a profile picture from your device"
    iconSrc="/assets/icons/onboarding/Upload.svg"
    label="Upload picture"
    fileNameKey="profilePictureName" 
  />
  <CustomFileInput
    onFileChange={(file) => updateFormData({ backgroundPicture: file })}
    placeholder="Choose or upload a background picture"
    iconSrc="/assets/icons/onboarding/Upload.svg"
    label="Upload background"
    fileNameKey="backgroundPictureName"
  />
      </div>

      {/* Submit
      <div className="mt-6">
        <button type="submit" className="btn-primary w-full">
          Save and Continue
        </button>
      </div> */}

    </form>
  );
}





  
