import Image from "next/image";
import { useFormContext } from "@/app/onboarding/context";
export default function Preview() {
    const { formData } = useFormContext(); // Access formData using context

 let profileImageSrc = "/assets/images/profile_defaultOnborad.svg"; // Default image

 if (formData.profilePicture) {
  // If profilePicture is a data URL (base64 string), use it
  profileImageSrc = formData.profilePicture;
}

    
    console.log("formdara from preview layout",formData)
    return (
      <div>
   
      <div className="flex gap-3 justify-center items-center">
          <span class="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium ">
              {formData.industry || "Industry"}
            </span>
            <span class="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium ">
            {formData.industry || "Industry"}
            </span>
            <span class="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium ">
            {formData.industry || "Industry"}
            </span>
      </div>

      {/* Displaying the Profile Picture */}
      <Image
        className="mx-auto mt-5 rounded-lg"
        width={80} 
        height={20} 
        alt="profile_pic"
        src={profileImageSrc} // Dynamic image source based on uploaded file
      />
  
      <h2 className="text-dark-grey text-3xl text-center mt-4">{(formData.firstName + " " + formData.lastName).trim() || "Your Name"}</h2>
  
      <div className="flex justify-center items-center gap-3 text-dark-grey ">
      <h6>{(`@${formData.firstName || ""}`).trim().toLowerCase() || "@username"}</h6>

          <h6>{formData.gender || "Gender"}</h6>
          <h6>{formData.location || "Location"}</h6>
      </div>
  
      <div className="flex gap-5 px-5 text-dark-grey mt-[30px]">
          <h5>Languages</h5>
          <div>What Languages do you speak</div>
      </div>
  
      <div className="flex gap-5 px-5 text-dark-grey mt-5">
          <h5>Open to</h5>
         <div>
                    {formData.compensation && formData.compensation.length > 0
                        ? formData.compensation.join(", ")
                        : "what comp methods are you open to?"}
                </div>
      </div>
  
      <div className="text-dark-grey px-10 flex flex-col justify-center items-center mt-10">
       <h3 className="text-3xl">$ 00 - 00</h3>
       <div>Charge per content piece</div>
      </div>


      </div>
    );
  }