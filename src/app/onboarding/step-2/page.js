// // app/onboarding/step-2/page.js
// "use client";

// import { useState } from "react";
// import { useFormContext } from "../context";
// import MultiSelectInput from "@/components/MultiSelectInput";

// export default function Step2() {

//   // Sample JSON options
// const industryOptions = [
//   "Design",
//   "Marketing",
//   "Development",
//   "Product",
//   "Sales",
//   "Human Resources",
// ];

// const contentOptions = [
//   "Story",
//   "Reels",
//   "Posts"
// ]

// const compensationOptions = [
//   "Gifting", 
//   "Sponsorships",
//   "Affiliate"
// ]

//   const { formData, updateFormData } = useFormContext();
//   const [address, setAddress] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateFormData({ address }); 
//   };

//   return (
//     <form
//     className="w-full h-[100vh] overflow-hidden mx-auto space-y-6"
//     onSubmit={handleSubmit}
//     >

// <h2 className="text-2xl mt-10">And we're almost there!</h2>
// <div className="flex flex-row gap-6">
// <MultiSelectInput fieldName="industry" label="Choose Industry" options={industryOptions} />

//   </div>
//   <MultiSelectInput fieldName="contentType" label="Choose Content Type" options={contentOptions} />
//   <MultiSelectInput fieldName="compensation" label="Choose Compensation" options={compensationOptions} />
//     </form>
//   );
// }


"use client";

import { useState } from "react";
import { useFormContext } from "../context";
import MultiSelectInput from "@/components/MultiSelectInput";

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
    </form>
  );
}
