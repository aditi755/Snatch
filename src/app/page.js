  import Image from "next/image";

  export default function Home() {
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
        <div className="flex h-1/2 sm:h-full w-full sm:w-1/2 justify-center items-center bg-smoke mb-20 sm:mb-0 relative">
          <div className="flex flex-col justify-center items-center text-center w-full px-6 sm:px-10">
            <h1 className="text-graphite text-2xl sm:text-5xl mb-8">Sign Up</h1>

            <div className="relative w-full sm:w-[356px]">
              <input
                type="text"
                placeholder="Enter email address"
                className="w-full bg-transparent rounded-md border border-stroke py-3 pl-5 text-dark-6 outline-none transition focus:border-primary"
              />
            </div>

            <button className="w-full sm:w-[356px] h-12 bg-[#0037EB] text-white rounded-lg mt-4">
              Verify email
            </button>

            <div className="flex mt-10 items-center justify-center w-full">

          <div className="border-b-2 border-[3D3D3D] w-[128px]"></div>

            <span className="mx-4 text-[3D3D3] text-lg">or</span>
    
          <div className="border-b-2 border-[3D3D3D] w-[128px]"></div>
          </div>

          <div className="mt-5 text-dark-grey">Already have an account?
            <span className="text-electric-blue ml-2">Login</span>
          </div>

          </div>
        </div>
      </div>
    );
  }
