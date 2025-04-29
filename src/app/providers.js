"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// 🌟 PostHogProvider component
function PostHogProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.init(
        process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_j5chnS7H8Lbghn45GojA3yDiYxxbJi4VjnxQW1SEHtn",
        {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
          capture_pageview: false,
          debug: true,
          person_profiles: "identified_only",
        }
      );
      console.log("✅ PostHog initialized successfully");
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

// Manual pageview capture
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.location.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

// Use Suspense to avoid de-optimizing
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

// 🧩 Main Providers component combining Clerk, Posthog, React Query
export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <PostHogProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
}
