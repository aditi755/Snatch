import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen bg-smoke flex">
      {/* Left Section for Image */}
      <div className="w-1/2 relative">
          <Image
            src="/assets/logo/snatch_white.svg"
            alt="Logo"
            width={236} 
            height={50} 
            className="absolute top-64 left-40 z-10"
          />

          <Image src="/assets/images/signup_frame.svg" alt="logo1" width={304} height={257} className="absolute top-[300px] left-32 z-10"/>
       
        <Image
          src="/assets/images/signup_background.png"
          alt="Your Image"
          layout="responsive"
          width={555}
          height={764}
          className="absolute right-20 p-8 object-contain max-w-full max-h-full"
        />
      </div>

      {/* Right Section for Text */}
      <div className="w-1/2 flex justify-center items-center h-full  bg-smoke relative">
        <h1 className="text-graphite w-[367px] text-6xl absolute top-56">Sign Up</h1>
      </div>


    </div>
  );
}



