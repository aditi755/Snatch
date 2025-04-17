"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { FormProvider } from "@/app/onboarding/context";
import ProfileOverview from "@/components/public-portfolio/ProfileOverview";
import LoadingTransition from "@/components/public-portfolio/LoadingTransition";
import { useFetchPortfolio } from "@/utils/public-portfolio/portfolio";

function PortfolioContent({ ownerId }) {
  const [isLoading, setIsLoading] = useState(true);
  const portfolioData = useFetchPortfolio(ownerId);

  useEffect(() => {
    // When portfolio data is available, set loading to false
    if (portfolioData) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Add a minimum loading time of 1 second
      return () => clearTimeout(timer);
    }
  }, [portfolioData]);

  if (isLoading) {
    return <LoadingTransition />;
  }

  return (
    <div className="h-[200vh] py-[1%] px-[1%] relative">
      <ProfileOverview ownerId={ownerId} />
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
