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
        //here maybe we can add that dashboard inactive if nothing is there 
        router.push(`/dashboard/${formData.username}`);

      } catch (error) {
        console.error('Dashboard initialization error:', error);
        router.push("/onboarding");
      }
    };

    initializeDashboard();
  }, [formData, router]);

  return isLoading ? <div className="h-screen bg-smoke flex justify-center items-center font-qimano text-3xl text-electric-blue">Loading...</div> : null;
}
