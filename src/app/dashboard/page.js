"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "../onboarding/context";


export default function DashboardRedirect() {
  const router = useRouter();
  const { formData } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        if (!formData?.username) {
          router.push("/onboarding");
          return;
        }

        // Fetch initial dashboard data
        const [analyticsResponse, profileResponse] = await Promise.all([
          fetch(`/api/analytics?username=${formData.username}`),
          fetch(`/api/profile?username=${formData.username}`)
        ]);

        if (!analyticsResponse.ok || !profileResponse.ok) {
          throw new Error('Failed to load dashboard data');
        }

        // Minimum delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        router.push(`/dashboard/${formData.username}`);

      } catch (error) {
        console.error('Dashboard initialization error:', error);
        router.push("/onboarding");
      }
    };

    initializeDashboard();
  }, [formData, router]);

  return isLoading ? <div className="h-screen bg-smoke flex justify-center items-center font-qimano">Loading...</div> : null;
}
