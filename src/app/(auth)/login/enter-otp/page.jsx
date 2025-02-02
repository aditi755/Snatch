// "use client";
// import { useSignIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Otp from "@/components/Otp";

// export default function EnterOtp() {
//   const { isLoaded, signIn } = useSignIn();
//   const router = useRouter();
//   const [otp, setOtp] = useState(Array(6).fill("")); // Initialize OTP state as an array of 6 empty strings
//   const [error, setError] = useState("");
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     // Get the email from the query string on page load
//     const urlParams = new URLSearchParams(window.location.search);
//     const emailFromUrl = urlParams.get("email");
//     if (emailFromUrl) {
//       setEmail(emailFromUrl);
//     }
//   }, []);

//   const verifyOtp = async () => {
//     console.log("verify otp is callefd")
//     if (!isLoaded || !email) return;

//     try {

//       console.log('Signin', signIn)
//       await signIn.attemptFirstFactor({
//         strategy: "email_code",
//         code: otp.join(""), // Combine the OTP digits into a single string
//       });

//       // On successful verification and session sync, redirect to home page
//       router.push("/dashboard");
//     } catch (err) {
//       setError(err.message || "Invalid OTP. Please try again.");
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       verifyOtp();
//     }
//   }

//   return (
//       <div className="h-screen  flex flex-col justify-center lg:flex-row overflow-hidden ">
//         {/* Left Section for Image */}
//         <div className="lg:px-10 lg:py-9 xl:px-10 xl:py-9 2xl:px-10  relative lg:w-1/2 h-screen">
//         <Image
//           src="/assets/images/signup_background.png"
//           alt="Signup Background"
//           width={557}
//           height={764}
//           className=" w-full max-h-[50vh] aspect-auto lg:max-h-full rounded-sm object-fill"
//         />
    
//           {/* Signup Frame and Logo */}
//     <div className="absolute h-[300px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 2xl:max-lg:left-10 z-10 flex flex-col items-center justify-center ">
//       {/* Signup Frame */}
//       <Image
//         src="/assets/images/signup_frame.svg"
//         alt="Signup Frame"
//         width={304}
//         height={40}
//         className="hidden lg:block mx-auto"
//       />
    
//       {/* Logo (absolute inside the frame) */}
//       <Image
//         src="/assets/logo/snatch_white.svg"
//         alt="Logo"
//         width={220}
//         height={50}
//         className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//       />
    
//     </div>
    
//           {/* Mobile Logo */}
//           <Image
//           src="/assets/logo/snatch_white.svg"
//           alt="Mobile Logo"
//           width={189}
//           height={20}
//           className="w-[120px] block lg:hidden mx-auto absolute top-10 left-1/2 transform -translate-x-1/2 z-20"
//           />
//       </div>
    
    
//         {/* Right Section for Text */}
//         <div className="flex h-[100%] lg:h-full w-full lg:w-1/2 justify-center items-center ">
//           <div className="flex flex-col justify-center items-center text-center w-full px-6 sm:px-10">
//           <h1 className="text-graphite text-2xl sm:text-5xl mb-8 font-qimano">Enter OTP</h1>
//           <Otp otp={otp} setOtp={setOtp}  onKeyDown={handleKeyDown}/> {/* Use Otp component here */}
//                  <button
//                  onClick={verifyOtp}
//                  className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-4"
//                >
//                  Verify OTP
//               </button>
//               {error && <p className="text-red-500 mt-2">{error}</p>}     
//           </div>
//         </div>
//       </div>
//   );
// }


"use client";
import { useSignIn, useSession } from "@clerk/nextjs"; 
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Otp from "@/components/Otp";

export default function EnterOtp() {
  const { isLoaded, signIn } = useSignIn();
  const { session } = useSession(); // Use Clerk's useSession hook
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill("")); // Initialize OTP state as an array of 6 empty strings
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add a loading state

  useEffect(() => {
    // Get the email from the query string on page load
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, []);

  const verifyOtp = async () => {
    console.log("verify otp is called");
    if (!isLoaded || !email) return;

    setIsLoading(true); // Start loading
    setError("");

    try {
      console.log("Signin", signIn);
      await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: otp.join(""), // Combine the OTP digits into a single string
      });

      console.log("OTP verification successful. Reloading session...");
      await signIn.reload(); // Force session synchronization

      // Programmatically refresh the browser as a last resort
      window.location.reload();
      // Short delay to allow cookies to propagate
      // setTimeout(() => {
      //   window.location.href = "/dashboard";
      // }, 500); // 500ms delay
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Redirect to dashboard when session is available
  useEffect(() => {
    if (session) {
      console.log("Session is available. Redirecting to /dashboard");
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      verifyOtp();
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center lg:flex-row overflow-hidden">
      {/* Left Section for Image */}
      <div className="lg:px-10 lg:py-9 xl:px-10 xl:py-9 2xl:px-10 relative lg:w-1/2 h-screen">
        <Image
          src="/assets/images/signup_background.png"
          alt="Signup Background"
          width={557}
          height={764}
          className="w-full max-h-[50vh] aspect-auto lg:max-h-full rounded-sm object-fill"
          loading="eager"
          priority
        />

        {/* Signup Frame and Logo */}
        <div className="absolute h-[300px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 2xl:max-lg:left-10 z-10 flex flex-col items-center justify-center">
          {/* Signup Frame */}
          <Image
            src="/assets/images/signup_frame.svg"
            alt="Signup Frame"
            width={304}
            height={40}
            className="hidden lg:block mx-auto"
            loading="eager"
            priority
          />

          {/* Logo (absolute inside the frame) */}
          <Image
            src="/assets/logo/snatch_white.svg"
            alt="Logo"
            width={220}
            height={50}
            className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            loading="eager"
            priority
          />
        </div>

        {/* Mobile Logo */}
        <Image
          src="/assets/logo/snatch_white.svg"
          alt="Mobile Logo"
          width={189}
          height={20}
          className="w-[120px] block lg:hidden mx-auto absolute top-10 left-1/2 transform -translate-x-1/2 z-20"
          loading="eager"
          priority
        />
      </div>

      {/* Right Section for Text */}
      <div className="flex h-[100%] lg:h-full w-full lg:w-1/2 justify-center items-center">
        <div className="flex flex-col justify-center items-center text-center w-full px-6 sm:px-10">
          <h1 className="text-graphite text-2xl sm:text-5xl mb-8 font-qimano">
            Enter OTP
          </h1>
          <Otp otp={otp} setOtp={setOtp} onKeyDown={handleKeyDown} />{" "}
          {/* Use Otp component here */}
          <button
            onClick={verifyOtp}
            disabled={isLoading} // Disable button while loading
            className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-4 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}