"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PublicPortfolioPage({ownerId}) {
  useEffect(() => {
    console.log("Attempting to capture profile visit...");
    posthog.capture("profile_visit", { page: "public-portfolio",
        portfolio_owner_id: ownerId,
     });

    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
      posthog.capture("time_spent", {
        page: "public-portfolio",
        portfolio_owner_id: ownerId,
        minutes: timeSpent / 60,
      });
      console.log("Time spent event captured successfully");
    };
  }, [ownerId]);

  return (
    <div>
      <h1>Public Portfolio</h1>
      <p>This is a public portfolio page.</p>
    </div>
  );
}
