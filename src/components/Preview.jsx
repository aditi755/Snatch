import Image from "next/image";
import { useFormContext } from "@/app/onboarding/context";

export default function Preview() {
 const { formData } = useFormContext(); 

 let profileImageSrc = "/assets/images/profile_defaultOnborad.svg"; 

 if (formData.profilePicture) {
  profileImageSrc = formData.profilePicture;
}   
    console.log("formdara from preview layout",formData)
    
    return (
      <div>

          <div className="flex gap-3 justify-center items-center flex-wrap max-w-[380px]  mx-auto">
                {(formData.industry && formData.industry.length > 0
                    ? formData.industry
                    : ["Industry"] 
                ).map((industry, index) => (
                    <span
                        key={index}
                        className="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium"
                    >
                        {industry}
                    </span>
                ))}
            </div>


      {/* Displaying the Profile Picture  default*/}
      <div className="w-20 h-20 mx-auto mt-8 object-contain rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          width={80}
          height={80}
          alt="profile_pic"
          src={profileImageSrc}
        />
      </div>
  
      <h2 className="text-graphite text-3xl text-center mt-4">{(formData.firstName + " " + formData.lastName).trim() || "Your Name"}</h2>
  
      <div className="flex justify-center items-center gap-3 text-dark-grey ">
      <h6>{(`@${formData.firstName || ""}`).trim().toLowerCase() || "@username"}</h6>

          <h6>{formData.gender || "Gender"}</h6>
          <h6>{formData.location || "Location"}</h6>
      </div>
  
      <div className="flex flex-wrap mx-auto  gap-5 px-10 text-dark-grey mt-[30px] max-w-[500px] font-apfel-grotezk-regular">
        <Image 
        width={24}
        height={20}
        src="/assets/icons/onboarding/Language.svg"
        alt="languages"/>
          <h5 className="text-electric-blue -ml-1">Languages</h5>
          <div className="text-graphite"> What Languages do you speak</div>
      </div>
  
      <div className="flex flex-wrap mx-auto  gap-9 px-10 text-dark-grey mt-[30px] max-w-[500px] font-apfel-grotezk-regular">
      <Image 
        width={24}
        height={20}
        src="/assets/icons/onboarding/Language.svg"
        alt="languages"/>
          <h5 className="text-electric-blue -ml-5">Open to</h5>
          <div className="flex flex-wrap items-center gap-0">
    {formData.compensation && formData.compensation.length > 0 ? (
      formData.compensation.map((item, index) => (
        <div key={index} className="flex items-center gap-0 text-graphite">
          <span>{item}</span>
          {index < formData.compensation.length - 1 && (
            <Image
              width={10}
              height={20}
              src="/assets/icons/onboarding/Fullstop.svg"
              className="mx-1"
              alt="separator"
            />
          )}
        </div>
      ))
    ) : (
      <span>What comp methods are you open to?</span>
    )}
  </div>
        
      </div>
  
      <div className="text-dark-grey px-10 flex flex-col justify-center items-center mt-10">
       <h3 className="text-3xl">$ {formData.post} - {formData.reels}</h3>
       <div>Charge per content piece</div>
      </div>


      </div>
    );
  }