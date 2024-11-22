import Image from "next/image";

const AuthLayout = ({ children }) => (
  <div className="h-screen bg-smoke flex flex-col sm:flex-row overflow-hidden">
    <div className="relative sm:w-1/2 h-screen flex justify-center items-center overflow-hidden">
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
      <Image
        src="/assets/images/signup_background.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute p-0 sm:p-10 top-0 left-0 w-full max-h-[50vh] sm:max-h-full z-0"
      />
      <Image
        src="/assets/logo/snatch_white.svg"
        alt="Mobile Logo"
        width={189}
        height={24}
        className="block sm:hidden mx-auto absolute top-10 z-10"
      />
    </div>
    <div className="flex h-1/2 sm:h-full w-full sm:w-1/2 justify-center items-center bg-smoke mb-20 sm:mb-0 relative">
      {children}
    </div>
  </div>
);

export default AuthLayout;
