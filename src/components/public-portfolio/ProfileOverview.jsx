"use client";

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"

import { FormProvider } from "@/app/onboarding/context";
import { useFetchPortfolio, useInstagramData, useCheckScreenSize } from "@/utils/public-portfolio/portfolio";
import Header from "./Header";
import Image from "next/image" 
import PortfolioPublic from "./PortfolioPublic";
import QuestionCard from "./QuestionCard";
import Questionnaire from "./QuestionCard";
import AudienceCard from "./AudienceCard";


const useAnimatedNumber = (target) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1.2 });
  const rounded = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (target !== undefined && target !== null) {
      motionValue.set(target);
    }
  }, [target]);

  return rounded;
};

const ProfileOverview = ({ ownerId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 1000]);
  const containerRef = useRef(null);
  const pressKitRef = useRef(null);
  const formData = useFetchPortfolio(ownerId);
  const { data, loading, error } = useInstagramData(); // Instagram data
  const router = useRouter()
  const pathname = usePathname(); // e.g., "/public-portfolio/snatchsocial"
  
  const isMobile = useCheckScreenSize();


  const reach = useAnimatedNumber(data?.reach);
  const followers = useAnimatedNumber(data?.followers);
  const posts = useAnimatedNumber(data?.posts);


// Always define motion values, but assign static values for mobile
const defaultBg = "rgb(0, 0, 0)";
const defaultHeight = "560px";

const headerBg = useTransform(scrollY, [0, 200], ["rgb(0, 0, 0)", "rgb(80, 80, 80)"]);
const headerHeight = useTransform(scrollY, [0, 200], ["560px", "80px"]);

// If on mobile, override motion values with static values
const finalBg = isMobile ? defaultBg : headerBg;
const finalHeight = isMobile ? defaultHeight : headerHeight;
  //const nameSize = useTransform(scrollY, [0, 200], [88, 28])
  const nameSize = useTransform(
    scrollY,
    [0, 200],
    isMobile ? [28, 28] : [88, 28] // Fixed size for mobile, animated for desktop
  );
  const contentOpacity = useTransform(scrollY, [0, 150], [1, 0])
  const headerOpacity = useTransform(scrollY, [0, 150], [0, 1])
  const profileImageScale = useTransform(scrollY, [0, 150], [1, 0.8])
  const profileImageOpacity = useTransform(scrollY, [0, 150], [1, 0])
  const myOpacity = useTransform(scrollY, [0, 150], [0, 1])
  // For the press kit section to stay below the header
  const pressKitMargin = useTransform(scrollY, [0, 200], ["40px", "150px"])
  const fontSizeStyle = useMotionTemplate`${nameSize}px`;
  
  // Always define useTransform, but use static values for mobile
  const visibility = useTransform(scrollY, [150, 151], isMobile ? ["visible", "visible"] : ["visible", "hidden"]);
  const opacity = useTransform(scrollY, [0, 150], isMobile ? [1, 1] : [1, 0]);
  const story = Number(formData?.story) || 0;
  const reel = Number(formData?.reels) || 0;
  const post = Number(formData?.post) || 0;
 
 // Average engagement
 const average = Math.round((story + reel + post) / 3);
 const lower = Math.round(average * 0.8);
 const upper = Math.round(average * 1.2);

  function formatNumber(value) {
    const num = Number(value); // parse string/number safely
  
    if (isNaN(num)) return '0'; // if not a number, fallback to '0'
  
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }
  
  const priceRange = `₹ ${formatNumber(lower)} - ₹ ${formatNumber(upper)}`;
  
  const handleRequest = () => {
    const parts = pathname.split("/");
    const influencerUsername = parts[1]; // assuming route is /public-portfolio/[username]
    router.push(`/request-popup?username=${influencerUsername}`);
  };

  return (
    <div className="flex flex-col w-full p-1 rounded-xl" ref={containerRef}>
    {/* Sticky Header (appears on scroll) */}
    <Header formData={formData} data={data} headerOpacity={headerOpacity} />

    {/* Main Content */}
    <motion.div
      className={`w-full text-white relative rounded-3xl z-10 ${
        isMobile ? "h-[560px] bg-black" : ""
      }`}
      style={
        isMobile
          ? {} // No inline styles for mobile (use CSS classes)
          : {
              backgroundColor: finalBg,
              height: finalHeight,
              position: "sticky",
              top: 0,
              zIndex: 10,
              overflow: "hidden",
              visibility: isMobile ? "visible" : visibility,
              opacity: isMobile ? 1 : opacity,
            }
      }
    >
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Name and Location */}
        <motion.h1
          className="flex items-center gap-2 font-qimano text-2xl lg:text-6xl"
          style={{ fontSize: fontSizeStyle  }}
        >
           {formData?.firstName
          ? formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1)
            : ""}
          {" "}
          {formData?.lastName
            ? formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1)
            : ""}
        </motion.h1>

        <motion.p className="text-gray-300 text-lg font-apfel-grotezk-regular" style={{ opacity: contentOpacity }}>
          @{formData?.username} • {formData?.location}
        </motion.p>

        {/* Category Tags */}
        <motion.div className="flex gap-2 mt-2" style={{ opacity: contentOpacity }}>
        {formData?.industry?.length > 0 ? (
          formData.industry.map((item, index) => (
            <div key={index} className="flex items-center justify-start gap-1">
              <span className="bg-brown text-gray-200 px-3 py-1.5 rounded-md text-xs">
                {item}
              </span>
            </div>
          ))
        ) : (
          // Fallback industry tag
          <span className="bg-brown text-gray-200 px-3 py-1 rounded-md text-xs">
            Industry
          </span>
        )}
        </motion.div>
      </div>

      <div className="container mx-auto px-10 relative lg:mt-10 flex justify-center overflow-visible">
        <motion.div className="flex flex-col-reverse lg:flex-row justify-between w-80 lg:w-[1600px] lg:relative z-10 overflow-visible" style={{ opacity: isMobile? "1": contentOpacity }}>

          {/*1 Left Side - Pricing and Services */}
          <div className="w-[370px] pt-20 ml-10 hidden lg:block">
            <div className="flex gap-3  items-center mb-4">
              <h2 className=" font-medium font-qimano text-3xl">{priceRange}</h2>
              <p className=" text-gray-500 font-apfel-grotezk-regular text-lg ">Value per content piece</p>
            </div>

            <div className=" border-b-[1px] -mt-4 bg-lime-yellow ">

            </div>

           
          {/* Services */}
{/* Services */}
<div className="flex flex-wrap text-sm mt-2 gap-3">
  {formData?.compensation?.length > 0 ? (
    formData.compensation.map((item, index) => (
      <div
        key={index}
        className="inline-flex items-center font-qimano text-xl relative group"
      >
        <span className="transition-colors duration-300 group-hover:text-lime-yellow">
          {item}
        </span>

        {/* Info icon */}
        <img
          src="/assets/icons/i.svg"
          alt="info"
          className="w-4 h-4 ml-1 cursor-pointer transition-colors duration-300 group-hover:brightness-0 group-hover:invert"
        />

        {/* Tooltip on hover */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-lime-yellow text-black text-sm px-3 py-2 rounded-md shadow-md max-w-[200px] w-max whitespace-normal text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
  {item === "Sponsorships"
    ? "Influencers are paid a fixed amount for each piece of content they create."
    : item === "Gifting"
    ? "This involves compensating influencers with products or services instead of money."
    : item === "Affiliate"
    ? "Influencers promote a product or service and receive a commission for every sale made through a unique affiliate link they share."
    : item === "Hosted"
    ? "Influencers are invited to events or trips, often in exchange for creating and sharing content related to the experience."
    : item === "Collaboration"
    ? "Influencers sometimes collaborate with brands to create a product."
    : "More info coming soon."}
</span>


        {/* Separator */}
        {index !== formData.compensation.length - 1 && (
          <span className="text-white px-2">|</span>
        )}
      </div>
    ))
  ) : (
    <div className="flex items-center justify-center">
      <span>Compensation</span>
    </div>
  )}
</div>




            {/* CTA Button */}
            <button className="bg-lime-yellow text-graphite font-semibold py-2 px-4 rounded mt-6 w-[328px] max-w-[328px] font-apfel-grotezk-regular" onClick={handleRequest}>
              Send request
            </button>
          </div>

          {/*2 Center - Profile Image desktop */}
          <motion.div
            className="block relative left-[22%] mt-5 lg:mt-0 lg:left-1/3 transform -translate-x-1/3 -translate-y-3/4 top-[100%] lg:-top-5 lg:right-10 rounded-xl overflow-visible z-20"
            style={{
              scale: isMobile ? "0" :profileImageScale,
              opacity: isMobile? "1" :profileImageOpacity,
              zIndex: 100,
              position: "absolute",
              bottom: "-20px",
            }}
          >
         <div className="lg:absolute overflow-visible z-[9999]">
        <div className="absolute -top-6 -left-6 bg-black bg-opacity-70 rounded-full p-2 z-[9999]">
          {/* heart icon */}
        </div>
        <div className="absolute  lg:translate-x-1/2 rounded-xl w-64 h-80 overflow-visible ">
          <Image
            src={formData?.profilePicture || "/assets/images/profile_defaultOnborad.svg"}
            alt={`${formData?.firstName} ${formData?.lastName}`}
            width={256}
            height={320}
            className="object-cover lg:w-80 lg:h-96 w-56 h-80 relative z-[9999] rounded-xl"
          />
        </div>
      </div>
          </motion.div>

         {/* 3 Right Side - Stats */}
<div className="w-full lg:w-1/2 flex lg:flex-col items-end justify-center lg:justify-normal mr-20 gap-6 pt-4 z-20">
  <div className="text-center">
    <h2 className="text-5xl font-medium font-qimano">
      <motion.span>{reach}</motion.span>
    </h2>
    <p className="text-md text-white font-apfel-grotezk-regular">avg reach</p>
  </div>
  <div className="text-center">
    <h2 className="text-5xl font-medium font-qimano">
      <motion.span>{followers}</motion.span>
    </h2>
    <p className="text-md text-white font-apfel-grotezk-regular">followers</p>
  </div>
  <div className="text-center">
    <h2 className="text-5xl font-medium font-qimano">
      <motion.span>{posts}</motion.span>
    </h2>
    <p className="text-md text-white font-apfel-grotezk-regular">posts</p>
  </div>
</div>


        </motion.div>
      </div>
    </motion.div>


<div className="w-full max-w-sm px-4 pt-20 mx-auto block lg:hidden overflow-x-hidden">
  {/* Pricing */}
  <div className="flex flex-wrap gap-3 items-center mb-4">
    <h2 className="font-medium font-qimano text-2xl sm:text-3xl">{priceRange}</h2>
    <p className="text-gray-500 font-apfel-grotezk-regular text-base sm:text-lg">
      Value per content piece
    </p>
  </div>

  {/* Divider */}
  <div className="border-b-[1px] bg-lime-yellow w-full mb-2" />

  <div className="flex flex-wrap text-sm mt-2 gap-x-3 gap-y-2">
  {formData?.compensation?.length > 0 ? (
    formData.compensation.map((item, index) => (
      <div
        key={index}
        className="inline-flex items-center font-qimano text-sm sm:text-base md:text-lg relative group"
      >
        {/* Compensation Item */}
        <span className="px-1">{item}</span>

        {/* Info Icon */}
        <img
          src="/assets/icons/i.svg"
          alt="info"
          className="w-4 h-4 ml-1 cursor-pointer transition duration-300 group-hover:brightness-0 group-hover:invert"
          style={{ filter: "brightness(0)" }}
        />

        {/* Tooltip */}
        <span className="absolute bottom-full left-1/9 -translate-x-1/6 mb-2 bg-lime-yellow text-black text-xs sm:text-sm px-3 py-2 rounded-md shadow-md max-w-[200px] w-max whitespace-normal text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {item === "Sponsorships"
            ? "Influencers are paid a fixed amount for each piece of content they create."
            : item === "Gifting"
            ? "Compensating with products or services instead of money."
            : item === "Affiliate"
            ? "Earn a commission per sale through a unique link."
            : item === "Hosted"
            ? "Influencers attend events or trips to promote the brand."
            : item === "Collaboration"
            ? "Co-creating a product with the brand."
            : "More info coming soon."}
        </span>

        {/* Separator */}
        {index !== formData.compensation.length - 1 && (
          <span className="text-white px-2 hidden sm:inline">|</span>
        )}
      </div>
    ))
  ): (
      <div className="flex items-center justify-center w-full">
        <span>Compensation</span>
      </div>
    )}
  </div>

  {/* CTA Button */}
  <button
    className="bg-lime-yellow text-graphite font-semibold py-2 px-4 rounded mt-6 w-full font-apfel-grotezk-regular"
    onClick={handleRequest}
  >
    Send request
  </button>
</div>


    {/* Press Kit Section */}
    <motion.div
      className="w-full bg-white"
      style={{
        marginTop: isMobile ? 20 : pressKitMargin,
        position: "relative",
        zIndex: 5,
      }}
      ref={pressKitRef}
    >
      <div className="container mx-auto">
        <h2 className="text-5xl lg:text-7xl  font-serif text-blue-600 text-center mb-8 text-electric-blue">
          Press Kit
        </h2>

        {/* Content Grid */}
        <PortfolioPublic />
       
        <div className=" w-full mx-auto lg:max-w-[1900px] max-w-[500px]">
        <Questionnaire name={formData?.firstName
          ? formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1)
            : ""}/>
        </div>

        {/* social links */}
       <div className="text-graphite mt-4 text-nowrap text-sm lg:text-xl flex ">
        <span>My social media</span>
        <span className="flex items-center w-[75%]">
        <span className="border-b-[0.5px] border-gray-400 mx-2 w-full "></span>
        </span>
       
        <span className="flex gap-2">
        <span className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
          <Image
            src="/assets/images/insta.svg"
            alt="Instagram"
            width={20}
            height={20}

          />
        </span>
        <span className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
          <Image
            src="/assets/images/X.svg"
            alt="Instagram"
            width={20}
            height={20}
          />
        </span>
        <span className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
          <Image
            src="/assets/icons/facebook.svg"
            alt="Instagram"
            width={20}
            height={20}
          />
        </span>
        <span className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
          <Image
            src="/assets/icons/linkedin.svg"
            alt="Instagram"
            width={20}
            height={20}
          />
        </span>
        </span>
       </div>

        <div className="w-full mx-auto lg:max-w-[1300px] max-w-[500px] ">
        <AudienceCard />
        </div>

      </div>
    </motion.div>
  </div>
  )
}

export default ProfileOverview;
