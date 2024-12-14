"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/nextjs";

export default function SignUp() {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  //const { isSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

   // Check if user is already signed in and redirect to /dashboard
  //  useEffect(() => {
  //   if (isSignedIn) {
  //     router.push("/dashboard");
  //   }
  // }, [isSignedIn, router]);


  const handleVerifyEmail = async () => {
    if (!isLoaded) return;

    try {
      // Ensure the email_address is passed correctly in the sign-up process
      const { createdUser } = await signUp.create({
        email_address: email,  // Correctly specify email_address
      });

      // Prepare the email address for OTP verification
      await signUp.prepareEmailAddressVerification();

      // Navigate to OTP entry page
      router.push(`/signup/enter-otp?email=${email}`);
    } catch (err) {
      setError(err.errors[0]?.message || "Something went wrong.");
    }
  };

  return (
    <div className="h-screen bg-smoke flex flex-col sm:flex-row overflow-hidden">
       {/* Left Section for Image */}
       <div className="relative sm:w-1/2 h-screen flex justify-center items-center overflow-hidden">
         {/* Signup Frame (relative container) */}
         <div className="relative z-20 ">
           {/* Signup Frame */}
           <Image
             src="/assets/images/signup_frame.svg"
             alt="Signup Frame"
             width={304}
             height={257}
             className="hidden sm:block mx-auto"
           />

           {/* Logo (absolute inside the frame) */}
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
          <h1 className="text-graphite text-2xl sm:text-5xl mb-8">Sign Up</h1>
          <div className="relative w-full sm:w-[356px]">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full bg-transparent rounded-md border border-stroke py-3 pl-5 text-dark-6 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            onClick={handleVerifyEmail}
            className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-4"
          >
            Verify email
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-5 text-dark-grey">
            Already have an account?
            <Link href="/login">
              <span className="text-electric-blue ml-2 cursor-pointer">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
