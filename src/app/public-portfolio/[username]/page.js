"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import posthog from "posthog-js";
import PortfolioStatsCard from "@/components/PortfolioStatsCard";
import { FormProvider } from "@/app/onboarding/context";
import ProfileOverview from "@/components/public-portfolio/ProfileOverview";
import {  useFetchPortfolio, useCheckScreenSize, Loader} from "@/utils/public-portfolio/portfolio";


function PortfolioContent({ ownerId }) {
  const containerRef = useRef(null);
  const formData = useFetchPortfolio(ownerId);
  const isMobile = useCheckScreenSize();

  // Track scroll relative to the document, not container
  const { scrollYProgress } = useScroll();
  const [currentDirection, setCurrentDirection] = useState("column");

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const direction = value <= 0.34 ? "column" : "row";
    setCurrentDirection(direction);
  });
  
  useMotionValueEvent(scrollYProgress, "change", (value) => {
   console.log(value);
  })
 
  const height = useTransform(scrollYProgress, [0, 0.34], ["73vh", "10vh"]);
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.64],
    ["#000000", "#686868"]
  );
    // Scale and translateY for name animation
    const scale = useTransform(
      scrollYProgress,
      [0, 0.3],
      isMobile ? [2.5, 1.2] : [5, 2.5] // Smaller scale for mobile
    );
    const translateY = useTransform(
      scrollYProgress,
      [0, 0.3],
      isMobile ? ["3vh", "1vh"] : ["6vh", "3vh"]
    );
    const usernameOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0]);
    const usernameVisibility = useTransform(scrollYProgress, [0, 0.30], ["visible", "hidden"]);
    const displayNone = useTransform(
      scrollYProgress,
      [0, 0.31],
      ["visible", "hidden"]
    );
    const industryOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0]);
    const industryVisibility = useTransform(scrollYProgress, [0, 0.30], ["visible", "hidden"]);
    const statsY = useTransform(scrollYProgress, [0, 0.30], ["0vh", "-32vh"]);
    const buttonY = useTransform(scrollYProgress, [0, 0.30], ["0vh", "-48vh"]);
    const scaleY = useTransform(scrollYProgress, [0, 0.34], ["73vh", "10vh"]);
  
  
    if (!formData) {
      return <Loader />;
    }
  

  return (
    
    <div className=" h-[200vh] py-[2%] px-[3%] relative" ref={containerRef}>
  {/* Sticky header that animates */}
  <ProfileOverview
    formData={formData}
    height={height}
    backgroundColor={backgroundColor}
    scale={scale}
    translateY={translateY}
    usernameOpacity={usernameOpacity}
    usernameVisibility={usernameVisibility}
    industryOpacity={industryOpacity}
    industryVisibility={industryVisibility}
    displayNone={displayNone}
    buttonY={buttonY}
    statsY={statsY}
    currentDirection={currentDirection}
    ref={containerRef}
    // containerRef={containerRef}
  />

  {/* Content that creates scroll space */}
  <motion.div
    className=" w-full h-[100vh] z-0 relative"
    style={{ height: "100vh" }}
  >
    <p className="text-5xl">
      Press Kit
    </p>
  </motion.div>
</div>

  );
}


export default function PublicPortfolioPage({ ownerId }) {
  useEffect(() => {
    console.log("Attempting to capture profile visit...");
    posthog.capture("profile_visit", {
      page: "public-portfolio",
      portfolio_owner_id: ownerId,
    });

    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      posthog.capture("time_spent", {
        page: "public-portfolio",
        portfolio_owner_id: ownerId,
        minutes: timeSpent / 60,
      });
      console.log("Time spent event captured successfully");
    };
  }, [ownerId]);

  return (
    <FormProvider>
      <PortfolioContent ownerId={ownerId} />
    </FormProvider>
  );
}
