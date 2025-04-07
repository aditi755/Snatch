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

  return (
    
    <div className=" h-[200vh] py-[1%] px-[1%] relative">
  {/* Sticky header that animates */}
  <ProfileOverview ownerId={ownerId}
  />
</div>

  );
}

// function PortfolioContent({ ownerId }) {
// <main className="min-h-screen bg-red-500 flex items-center justify-center p-10">
// <ProfileOverview />
// <div className="text-black text-lg">bdbfedvbdvd</div>
// </main>
// }


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
