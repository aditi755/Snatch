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
  const pathname = usePathname();
  
  useEffect(() => {
    // Only initialize PostHog if we're on a public portfolio path
    if (typeof window !== "undefined" && pathname.includes('/media-kit')) {
      posthog.init(
        process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_j5chnS7H8Lbghn45GojA3yDiYxxbJi4VjnxQW1SEHtn",
        {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
          capture_pageview: false,
          debug: true,
          person_profiles: "identified_only",
          // Only load PostHog on public portfolio paths
          loaded: (posthog) => {
            posthog.debug = window.location.pathname.includes('/media-kit');
          }
        }
      );
      console.log("✅ PostHog initialized for public portfolio view");
    }
  }, [pathname]);

  // Only render PostHog provider if we're on a public portfolio path
  if (!pathname.includes('/media-kit')) {
    return children;
  }

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
    // Only track views for public portfolio paths
    if (pathname && posthog && pathname.includes('/media-kit')) {
      let url = window.location.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }
      
      // Capture pageview with additional context
      posthog.capture("$pageview", {
        $current_url: url,
        path_type: 'public_portfolio',
        username: pathname.split('/')[1] // Captures the username from the URL
      });
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
