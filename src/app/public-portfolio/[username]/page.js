

"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { FormProvider, useFormContext } from "@/app/onboarding/context";
import StatsCard from "@/components/StatsCard";

function PortfolioContent({ ownerId }) {
  const { formData } = useFormContext(); // ✅ Now inside the provider

  return (
    <div className="h-screen bg-graphite text-white flex justify-center ">
      <div className="text-3xl mt-5">{formData?.firstName || "name" + formData?.lastName}</div>
      <div className="text-3xl mt-5">{`@${formData?.username}`}</div>
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
