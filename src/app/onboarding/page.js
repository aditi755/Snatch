// "use client";
// import { useRouter } from "next/navigation";

// export default function OnboardingPage() {
//   const router = useRouter();

//   // Redirect to step 1 by default
//   router.push("/onboarding/step-1");

//   return null; // Empty as it only handles redirection
// }


"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
  const router = useRouter();

  // Redirect to step 1 by default
  useEffect(() => {
    router.replace("/onboarding/step-1"); // Use `replace` to avoid going back to this page
  }, [router]);

  return null; // Empty component as it only handles redirection
}
