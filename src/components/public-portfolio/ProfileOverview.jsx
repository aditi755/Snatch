// components/ProfileOverview.js
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import PortfolioStatsCard from "../PortfolioStatsCard";

const ProfileOverview = ({
  formData,
  height,
  backgroundColor,
  scale,
  translateY,
  usernameOpacity,
  usernameVisibility,
  industryOpacity,
  industryVisibility,
  displayNone,
  buttonY,
  statsY,
  currentDirection,
  containerRef,
}) => {
  return (
    <motion.div
      ref={containerRef}
      className="sticky w-full top-3 z-10 rounded-3xl h-[100vh]"
      style={{
        overflow: "hidden",
        willChange: "transform, height, background-color",
        height,
        backgroundColor,
        transition: "height 0.4s ease-in-out, background-color 0.4s linear",
      }}
    >
      <div className="flex flex-col items-center mt-5">
        {/* User Name */}
        <motion.p
          className="text-white"
          style={{
            scale,
            translateY,
          }}
        >
          {`${formData.firstName.charAt(0).toUpperCase()}${formData.firstName.slice(
            1
          )} ${formData.lastName.charAt(0).toUpperCase()}${formData.lastName.slice(
            1
          )}`}
        </motion.p>

        {/* Username, Location, Industry */}
        <motion.div
          className="flex gap-2 text-white text-xl mx-auto mt-10 lg:mt-20 7xl:mt-28 max-w-56"
          style={{
            opacity: usernameOpacity,
            visibility: usernameVisibility,
          }}
        >
          <motion.div>@{formData.username || "username"}</motion.div>
          <Image
            width={10}
            height={10}
            src="/assets/icons/onboarding/Fullstop.svg"
            className="mx-auto w-1.5 h-1.5 mt-3"
            alt="separator"
          />
          <motion.div>{formData.location || "Location"}</motion.div>
        </motion.div>

        {/* Industry */}
        <motion.div
          className="flex gap-0 justify-center flex-wrap max-w-[480px] px-6 mx-auto"
          style={{
            opacity: industryOpacity,
            visibility: industryVisibility,
          }}
        >
          {(formData.industry && formData.industry.length > 0
            ? formData.industry
            : ["Industry"]
          ).map((industry, index) => (
            <span
              key={index}
              className="bg-[#808080] m-[3px] inline-block border border-transparent py-1 px-2.5 text-sm text-white rounded-md"
            >
              {industry}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Stats, Image, Request Button */}
      <div className="flex flex-col-reverse lg:flex-row justify-between">
        {/* Left Side Content */}
        <div className="flex flex-col mt-20 text-white">
          <motion.div
            className="px-10 flex flex-row gap-2 justify-center items-center mt-12"
            style={{
              visibility: displayNone,
            }}
          >
            <h3 className="text-3xl font-qimano ">
              ₹ {formData.story} - ₹ {formData.reels}
            </h3>
            <p>Value per content piece</p>
          </motion.div>

          {/* Compensation */}
          <motion.div
            className="flex flex-wrap items-center gap-0 text-sm ml-20"
            style={{
              visibility: displayNone,
            }}
          >
            {formData.compensation && formData.compensation.length > 0 ? (
              formData.compensation.map((item, index) => (
                <div key={index} className="flex items-center gap-0">
                  <span>{item}</span>
                  {index < formData.compensation.length - 1 && (
                    <Image
                      width={10}
                      height={20}
                      src="/assets/icons/onboarding/Fullstop.svg"
                      className="mx-1.5 w-1.5 h-1.5"
                      alt="separator"
                    />
                  )}
                </div>
              ))
            ) : (
              <span>What comp methods are you open to?</span>
            )}
          </motion.div>

          {/* Request Button */}
          <motion.button
            style={{ y: buttonY }}
            className="px-4 max-w-80 py-2 bg-lime-yellow text-black mt-5 rounded-md mx-auto"
          >
           Send Request
          </motion.button>
        </div>

        {/* Profile Picture */}
        <motion.div
          className="w-56 h-56 mx-auto mt-5 object-contain rounded-full overflow-hidden"
          style={{
            visibility: displayNone,
            opacity: usernameOpacity,
          }}
        >
          <Image
            className="object-cover w-full h-full"
            width={80}
            height={80}
            alt="profile_pic"
            src={formData.profilePicture}
          />
        </motion.div>

        {/* Portfolio Stats Card */}
        <motion.div
          ref={containerRef}
          className="flex"
          style={{
            y: statsY,
          }}
        >
          <PortfolioStatsCard flexDirection={currentDirection} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileOverview;
