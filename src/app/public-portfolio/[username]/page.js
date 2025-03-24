"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { FormProvider } from "@/app/onboarding/context";
import StatsCard from "@/components/StatsCard";

function PortfolioContent({ ownerId }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = window.location.pathname.split("/").pop(); // Extract username from URL
        const url = ownerId
          ? `/api/public-portfolio/userinfo?userId=${ownerId}`
          : `/api/public-portfolio/userinfo?username=${username}`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          setFormData(result.data);
        } else {
          console.error("Error fetching data:", result.error);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    fetchData();
  }, [ownerId]);

  if (!formData) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="h-screen bg-graphite text-white flex flex-col items-center justify-center">
      <div className="text-3xl font-bold">
        {formData.firstName || "Name"} {formData.lastName || ""}
      </div>
      <div className="text-2xl mt-2">{`@${formData.username || "username"}`}</div>
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
