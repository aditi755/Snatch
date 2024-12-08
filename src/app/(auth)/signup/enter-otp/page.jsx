// import Image from "next/image";
// import Link from "next/link";
// import Otp from "@/components/Otp";

// export default function Home() {
//   return (
//     <div className="h-screen bg-smoke flex flex-col sm:flex-row overflow-hidden">
//       {/* Left Section for Image */}
//       <div className="relative sm:w-1/2 h-screen flex justify-center items-center overflow-hidden">
//         {/* Signup Frame (relative container) */}
//         <div className="relative z-20 ">
//           {/* Signup Frame */}
//           <Image
//             src="/assets/images/signup_frame.svg"
//             alt="Signup Frame"
//             width={304}
//             height={257}
//             className="hidden sm:block mx-auto"
//           />

//           {/* Logo (absolute inside the frame) */}
//           <Image
//             src="/assets/logo/snatch_white.svg"
//             alt="Logo"
//             width={220}
//             height={50}
//             className="absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//           />
//         </div>

//         {/* Background Image */}
//         <Image
//           src="/assets/images/signup_background.png"
//           alt="Background Image"
//           layout="fill"
//           objectFit="cover"
//           className="absolute p-0 sm:p-10 top-0 left-0 w-full max-h-[50vh] sm:max-h-full z-0"
//         />

//                   {/* Mobile Logo */}
//         <Image
//         src="/assets/logo/snatch_white.svg"
//         alt="Logo"
//         width={189}
//         height={24}
//         className="block sm:hidden mx-auto absolute top-10 z-10"
//     />

//       </div>

//       {/* Right Section for Text */}
//       <div className="flex h-1/2 sm:h-full w-full sm:w-1/2 justify-center items-center bg-smoke mb-20 sm:mb-0 relative">
//         <div className="flex flex-col justify-center items-center text-center w-full px-6 sm:px-10">
//           <h1 className="text-graphite text-2xl sm:text-5xl mb-8">Enter OTP</h1>

//           <Otp />

//           {/* <button className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-9">
//             Verify email
//           </button> */}

//     <Link href="/onboarding">
//       <button className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-9">
//         Verify email
//       </button>
//     </Link>

//         </div>
//       </div>
//     </div>
//   );
// }





// "use client";
// import { useSignUp } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import Image from "next/image";
// export default function EnterOtp() {
//   const { isLoaded, signUp } = useSignUp();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");

//   const email = searchParams.get("email");

//   const verifyOtp = async () => {
//     if (!isLoaded) return;

//     try {
//       await signUp.attemptEmailAddressVerification({
//         code: otp,
//       });

//       // On successful verification, redirect to onboarding
//       router.push("/onboarding");
//     } catch (err) {
//       setError(err.errors[0]?.message || "Invalid OTP. Please try again.");
//     }
//   };

//   return (
//     <div className="h-screen bg-smoke flex flex-col sm:flex-row overflow-hidden">
//       {/* Left Section for Image */}
//       <div className="relative sm:w-1/2 h-screen flex justify-center items-center overflow-hidden">
//         <Image
//           src="/assets/images/signup_frame.svg"
//           alt="Signup Frame"
//           width={304}
//           height={257}
//           className="hidden sm:block mx-auto"
//         />
//         <Image
//           src="/assets/images/signup_background.png"
//           alt="Background Image"
//           layout="fill"
//           objectFit="cover"
//           className="absolute top-0 left-0 w-full max-h-full z-0"
//         />
//       </div>

//       {/* Right Section for Text */}
//       <div className="flex h-1/2 sm:h-full w-full sm:w-1/2 justify-center items-center bg-smoke relative">
//         <div className="flex flex-col justify-center items-center text-center w-full px-6 sm:px-10">
//           <h1 className="text-graphite text-2xl sm:text-5xl mb-8">Enter OTP</h1>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             className="w-full bg-transparent rounded-md border border-stroke py-3 pl-5 text-dark-6 outline-none"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <button
//             onClick={verifyOtp}
//             className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-4"
//           >
//             Verify OTP
//           </button>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useSignUp } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Image from "next/image";

// export default function EnterOtp() {
//   const { isLoaded, signUp } = useSignUp();
//   const router = useRouter();
//   const [otp, setOtp] = useState("");
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
//     if (!isLoaded || !email) return;

//     try {
//       // Verify OTP using Clerk's signUp method
//       await signUp.attemptEmailAddressVerification({ code: otp });

//       // On successful verification, redirect to onboarding
//       router.push("/onboarding");
//     } catch (err) {
//       setError(err.errors[0]?.message || "Invalid OTP. Please try again.");
//     }
//   };

//   return (
//     <div className="h-screen bg-smoke flex flex-col sm:flex-row overflow-hidden">
//         {/* Left Section for Image */}
//         <div className="relative sm:w-1/2 h-screen flex justify-center items-center overflow-hidden">
//          {/* Signup Frame (relative container) */}
//          <div className="relative z-20 ">
//            {/* Signup Frame */}
//            <Image
//              src="/assets/images/signup_frame.svg"
//              alt="Signup Frame"
//              width={304}
//              height={257}
//              className="hidden sm:block mx-auto"
//            />

//            {/* Logo (absolute inside the frame) */}
//            <Image
//              src="/assets/logo/snatch_white.svg"
//              alt="Logo"
//              width={220}
//              height={50}
//              className="absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//            />
//         </div>

//          {/* Background Image */}
//          <Image
//            src="/assets/images/signup_background.png"
//            alt="Background Image"
//            layout="fill"
//            objectFit="cover"
//            className="absolute p-0 sm:p-10 top-0 left-0 w-full max-h-[50vh] sm:max-h-full z-0"
//          />

//                    {/* Mobile Logo */}
//      <Image
//      src="/assets/logo/snatch_white.svg"
//      alt="Logo"
//      width={189}
//      height={24}
//      className="block sm:hidden mx-auto absolute top-10 z-10"
//    />

//        </div>

//       {/* Right Section for Text */}
//       <div className="flex h-1/2 sm:h-full w-full sm:w-1/2 justify-center items-center bg-smoke relative">
//         <div className="flex flex-col justify-center items-center text-center w-full px-6 sm:px-10">
//           <h1 className="text-graphite text-2xl sm:text-5xl mb-8">Enter OTP</h1>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             className="w-full bg-transparent rounded-md border border-stroke py-3 pl-5 text-dark-6 outline-none"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <button
//             onClick={verifyOtp}
//             className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-4"
//           >
//             Verify OTP
//           </button>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Otp from "@/components/Otp";

export default function EnterOtp() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill("")); // Initialize OTP state as an array of 6 empty strings
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get the email from the query string on page load
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, []);

  const verifyOtp = async () => {
    if (!isLoaded || !email) return;

    try {
      // Verify OTP using Clerk's signUp method
      await signUp.attemptEmailAddressVerification({ code: otp.join("") });

      // On successful verification, redirect to onboarding
      router.push("/onboarding");
    } catch (err) {
      setError(err.errors[0]?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-smoke flex flex-col sm:flex-row overflow-hidden">
      {/* Left Section for Image */}
      <div className="relative sm:w-1/2 h-screen flex justify-center items-center overflow-hidden">
        {/* Signup Frame */}
        <div className="relative z-20">
          <Image
            src="/assets/images/signup_frame.svg"
            alt="Signup Frame"
            width={304}
            height={257}
            className="hidden sm:block mx-auto"
          />
          <Image
            src="/assets/logo/snatch_white.svg"
            alt="Logo"
            width={220}
            height={50}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        {/* Background Image */}
        <Image
          src="/assets/images/signup_background.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="absolute p-0 sm:p-10 top-0 left-0 w-full max-h-[50vh] sm:max-h-full z-0"
        />

        {/* Mobile Logo */}
        <Image
          src="/assets/logo/snatch_white.svg"
          alt="Logo"
          width={189}
          height={24}
          className="block sm:hidden mx-auto absolute top-10 z-10"
        />
      </div>

      {/* Right Section for Text */}
      <div className="flex h-1/2 sm:h-full w-full sm:w-1/2 justify-center items-center bg-smoke relative">
        <div className="flex flex-col justify-center items-center text-center w-full px-6 sm:px-10">
          <h1 className="text-graphite text-2xl sm:text-5xl mb-8">Enter OTP</h1>
          <Otp otp={otp} setOtp={setOtp} /> {/* Use Otp component here */}
          <button
            onClick={verifyOtp}
            className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-4"
          >
            Verify OTP
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
