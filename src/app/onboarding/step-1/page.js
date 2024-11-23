"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "../context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomDropdown from "@/components/CustomDropdown";
import InstagramInput from "@/components/InstagramInput";
import SocialLinksDropdown from "@/components/SocialLinksDropdown";
import CustomFileInput from "@/components/CustomFileInput";

export default function Step1() {
  const { formData, updateFormData } = useFormContext(); // Access context
  const [name, setName] = useState(formData.name || ""); // Initialize with context value
  const [email, setEmail] = useState(formData.email || ""); // Initialize with context value
  const [selectedOption, setSelectedOption] = useState(""); // Track dropdown selection
  const router = useRouter();

  // Sync state with formData (if necessary)
  useEffect(() => {
    setName(formData.name);
    setEmail(formData.email);
  }, [formData]);

  const handleDropdownSelect = (option) => {
    setSelectedOption(option);
    updateFormData({ selectedOption: option }); // Update context if needed
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({ name, email, selectedOption }); // Update context
    setTimeout(() => {
      router.push("/onboarding/step-2");
    }, 5000); // Navigate to Step 2
  };

  const [links, setLinks] = useState([]);

  const handleLinkChange = (index, data) => {
    const updatedLinks = [...links];
    updatedLinks[index] = data;
    setLinks(updatedLinks);
  };

  const handleAddMore = () => setLinks([...links, {}]);

  const handleFileChange = (file) => {
    console.log("Selected file:", file);
  }

  return (
    <div className="w-full h-[100vh] overflow-hidden mx-auto">
      <h2 className="text-2xl mt-20">Let's get Started</h2>

      <div className="flex flex-row mt-6 gap-11">
        <input
          type="text"
          placeholder="First Name"
          className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
        />
      </div>

      <div className="mt-7 flex flex-row gap-10">
        <CustomDropdown
          options={["Male", "Female", "Other", "Prefer not to say"]}
          placeholder="Select an Option"
          onSelect={handleDropdownSelect}
        />
        <input
          type="text"
          placeholder="Gender"
          className="w-[250px] bg-transparent rounded-md border border-stroke py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
        />
      </div>

      <div className="mt-4 text-[#212121] font-regular">
        <h6>Add social links</h6>
      
      <div className="mt-3">
      <InstagramInput />
      <SocialLinksDropdown />

      {links.map((_, index) => (
        <SocialLinksDropdown
          key={index}
          onChange={(data) => handleLinkChange(index, data)}
        />
      ))}

<button
        className="mt-4 flex items-center gap-2 text-dark-grey cursor-pointer"
        onClick={handleAddMore}
      >
      
        Add More Links
      </button>
      </div> 
      </div>


      <div className="mt-5">

        {/* For uploading picture */}
      <CustomFileInput
        onFileChange={handleFileChange}
        placeholder="Upload a profile picture from your device"
        iconSrc="/assets/icons/onboarding/Upload.svg"
        label="Upload picture"  
      />
      
      {/* For uploading background */}
      <CustomFileInput
        onFileChange={handleFileChange}
        placeholder="Choose or upload a background picture"
        iconSrc="/assets/icons/onboarding/Upload.svg"
        label="Upload background"  
      />
      </div>

      <div className="mt-4 flex justify-between">
          <button type="submit" className="btn-primary">
            Save and Continue
          </button>
        </div>

    </div>
  );
}








  {/* <form onSubmit={handleSubmit} className="space-y-4 mt-10">
        <div>
          <label htmlFor="name" className="block text-sm">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button type="submit" className="btn-primary">
            Save and Continue
          </button>
        </div>
      </form> */}



      // "use client";

// import { useState, useEffect } from "react";
// import { useFormContext } from "../context";
// import { useRouter } from "next/navigation";

// export default function Step1() {
//   const { formData, updateFormData } = useFormContext(); // Access context
//   const [name, setName] = useState(formData.name || ""); // Initialize with context value
//   const [email, setEmail] = useState(formData.email || ""); // Initialize with context value
//   const router = useRouter();

//     // Use effect to sync state with formData (if necessary)
//     useEffect(() => {
//         setName(formData.name); // Sync name when formData changes
//         setEmail(formData.email); // Sync email when formData changes
//       }, [formData]);

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateFormData({ name, email }); // Update context
//     setTimeout(() => {
//         router.push("/onboarding/step-2");
//     }, [5000]) // Navigate to Step 2
//   };

//   return (
//     <div className="w-full h-[100vh] overflow-hidden  mx-auto">
//       <h2 className="text-2xl mt-20">Let's get Started</h2>

//      <div className="flex flex-row mt-6 gap-11">
//       <input
//         type='text'
//         placeholder='First Name'
//         className='w-full bg-transparent rounded-md border border-stroke  py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2'
//       />

//       <input
//         type='text'
//         placeholder='Last Name'
//         className='w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2'
//       />
//      </div>

//     <div classame="flex flex-row gap-10">
//       {/* <div className='relative z-20'> */}
//       <div className="mt-7 relative z-20 w-[268px]">
//   <div className="rounded-lg border border-stroke bg-transparent py-[10px] px-5 text-dark-6 cursor-pointer">
//     Select an Option
//   </div>
//   <ul className="absolute mt-2 w-full rounded-lg border border-stroke bg-light-grey py-2">
//     <li
//       className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer"
//     >
//       Option 1
//     </li>
//     <li
//       className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer"
//     >
//       Option 2
//     </li>
//     <li
//       className="px-5 py-2 text-graphite hover:text-electric-blue cursor-pointer"
//     >
//       Option 3
//     </li>
//   </ul>
// </div>

        
//       {/* </div> */}

//       <input
//         type='text'
//         placeholder='Gender'
//         className='w-[250px]  ml-10 bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2'
//       />
//       </div>

      

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm">Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="email" className="block text-sm">Email</label>
//           <input
//             type="text"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md"
//             required
//           />
//         </div>

//         <div className="mt-4 flex justify-between">
//           <button type="submit" className="btn-primary">
//             Save and Continue
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

