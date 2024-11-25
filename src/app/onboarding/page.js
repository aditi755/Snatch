//app/onboardin/page.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
  const router = useRouter();

  // Redirect to step 1 by default
  useEffect(() => {
    router.replace("/onboarding/step-1"); // Use `replace` to avoid going back to this page
  }, [router]);

  return null; 
}
