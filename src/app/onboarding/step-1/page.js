// "use client";

// import React, { useState, useEffect } from "react";
// import { useFormContext } from "../context";
// import { useRouter } from "next/navigation";
// import CustomDropdown from "@/components/CustomDropdown";
// import InstagramInput from "@/components/InstagramInput";
// import SocialLinksDropdown from "@/components/SocialLinksDropdown";
// import CustomFileInput from "@/components/CustomFileInput";
// import FormInput from "@/components/FormInput";
// import { useAuth } from "@clerk/nextjs";
// import DateInput from "@/components/DateInput";

// export default function Step1() {
//   const { formData, updateFormData } = useFormContext();
//   const router = useRouter();
//   const [formState, setFormState] = useState({
//     firstName: "",
//     lastName: "",
//     gender: "",
//     location: "",
//     links: [],
//     instagram: "",
//     profilePicture: null,
//     backgroundPicture: null,
//     dateOfBirth: "",
//   });

  

//   useEffect(() => {
//     // Synchronize formState with formData when formData updates
//     setFormState({
//       firstName: formData.firstName || "",
//       lastName: formData.lastName || "",
//       gender: formData.gender || "",
//       location: formData.location || "",
//       links: formData.links || [],
//       instagram: formData.instagram || "",
//       profilePicture: formData.profilePicture || null,
//       backgroundPicture: formData.backgroundPicture || null,
//       dateOfBirth: formData.dateOfBirth || "",
//     });
//   }, [formData]);

//   const updateField = (field, value) => {
//     setFormState((prev) => ({ ...prev, [field]: value }));
//     updateFormData({ [field]: value }); // Update context immediately
//   };

//   const handleAddSocialLink = () => {
//     updateField("links", [...formState.links, {}]);
//   };

//   const handleLinkChange = (index, data) => {
//     const updatedLinks = [...formState.links];
//     updatedLinks[index] = data;
//     updateField("links", updatedLinks);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateFormData(formState);
//   };

//   //string manipulation and regex exp to fetch instagram username via link

//   return (
//     <form
//       className="w-[725px] xl:w-[726px] 5xl:w-[800px] h-[100vh] overflow-y-scroll mx-auto space-y-6 font-apfel-grotezk-regular "
//       onSubmit={handleSubmit}
//     >
//       <h2 className="text-2xl mt-10">Let&apos;s get Started</h2>

//       {/* First and Last Name */}
//       <div className="flex flex-row gap-6">
//         <FormInput
//           placeholder="First Name"
//           value={formState.firstName}
//           onChange={(e) => updateField("firstName", e.target.value)}
//         />
//         <FormInput
//           placeholder="Last Name"
//           value={formState.lastName}
//           onChange={(e) => updateField("lastName", e.target.value)}
//         />
//       </div>

//       {/* Gender Dropdown */}
//       <div className="flex flex-row gap-0">
//         <CustomDropdown
//           options={["Male", "Female", "Other", "Prefer not to say"]}
//           placeholder="Gender"
//           onSelect={(option) => updateField("gender", option)}
//           selected={formState.gender}
//         />
//         <DateInput 
//         placeholder="Date of birth"
//         value={formState.dateOfBirth}
//         onChange={(value) => updateField("dateOfBirth", value)}/>
//       </div>

//       {/* Location */}
//       <FormInput
//         placeholder="Location"
//         value={formState.location}
//         onChange={(e) => updateField("location", e.target.value)}
//       />

//       {/* Social Links */}
//       <div>
//         <h6 className="font-medium text-graphite">Add social links</h6>
//         <div className="mt-3">
//           <InstagramInput
//             value={formState.instagram}
//             onChange={(value) => updateField("instagram", value)}
//           />
//           {formState.links.map((link, index) => (
//             <SocialLinksDropdown
//               key={index}
//               initialData={link}
//               onChange={(data) => handleLinkChange(index, data)}
//             />
//           ))}
//           <button
//             type="button"
//             className="mt-4 flex items-center gap-2 text-dark-grey cursor-pointer"
//             onClick={handleAddSocialLink}
//           >
//             Add More Links
//           </button>
//         </div>
//       </div>

//       {/* Upload Picture & Background */}
//       <div className="space-y-4">
//         <CustomFileInput
//           onFileChange={(file) => updateFormData({ profilePicture: file })}
//           placeholder="Upload a profile picture from your device"
//           iconSrc="/assets/icons/onboarding/Upload.svg"
//           label="Upload picture"
//           fileNameKey="profilePictureName"
//         />
//         <CustomFileInput
//           onFileChange={(file) => updateFormData({ backgroundPicture: file })}
//           placeholder="Choose or upload a background picture"
//           iconSrc="/assets/icons/onboarding/Upload.svg"
//           label="Upload background"
//           fileNameKey="backgroundPictureName"
//         />
//       </div>
//     </form>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "../context";
import { useRouter } from "next/navigation";
import CustomDropdown from "@/components/CustomDropdown";
import InstagramInput from "@/components/InstagramInput";
import SocialLinksDropdown from "@/components/SocialLinksDropdown";
import CustomFileInput from "@/components/CustomFileInput";
import FormInput from "@/components/FormInput";
import { useAuth } from "@clerk/nextjs";
import DateInput from "@/components/DateInput";

export default function Step1() {
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    location: "",
    links: [],
    instagram: "",
    profilePicture: null,
    backgroundPicture: null,
    dateOfBirth: "",
  });

  const [numLinks, setNumLinks] = useState(formData?.length || 0);

  useEffect(() => {
    // Synchronize formState with formData when formData updates
    setFormState({
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      gender: formData.gender || "",
      location: formData.location || "",
      links: formData.links || [],
      instagram: formData.instagram || "",
      profilePicture: formData.profilePicture || null,
      backgroundPicture: formData.backgroundPicture || null,
      dateOfBirth: formData.dateOfBirth || "",
    });
  }, [formData]);

  const updateField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    updateFormData({ [field]: value }); // Update context immediately
  };

  const handleAddSocialLink = () => {
    updateField("links", [...formState.links, {}]);
  };

  const handleLinkChange = (index, data) => {
    const updatedLinks = [...formState.links];
    updatedLinks[index] = data;
    updateField("links", updatedLinks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(formState);
  };

  return (

    <div>
        <h2 className="text-3xl mt-10 font-qimano">Let&apos;s get Started !</h2>
        <form
      className="mt-6 w-[725px] xl:w-[726px] 5xl:w-[800px] h-[80vh] overflow-y-scroll mx-auto space-y-6 font-apfel-grotezk-regular "
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      onSubmit={handleSubmit}
    >
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
      <div className="flex flex-row gap-0">
        <CustomDropdown
          options={["Male", "Female", "Other", "Prefer not to say"]}
          placeholder="Gender"
          onSelect={(option) => updateField("gender", option)}
          selected={formState.gender}
        />
        <DateInput 
        placeholder="Date of birth"
        value={formState.dateOfBirth}
        onChange={(value) => updateField("dateOfBirth", value)}/>
      </div>

      {/* Location */}
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
          {formState.links.slice(0, 4).map((link, index) => (
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
          disabled={numLinks >= 4}
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

        <div className="bg-transparent w-full h-24"></div>
      </div>
    </form>
    </div>

 

  );
}