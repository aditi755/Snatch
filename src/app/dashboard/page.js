"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "../onboarding/context";

export default function DashboardRedirect() {
  const router = useRouter();
  const { formData } = useFormContext();

  useEffect(() => {
    if (formData?.username) {
      router.push(`/dashboard/${formData.username}`);
    }
  }, [formData, router]);

  return (
    <div className="h-screen bg-smoke flex justify-center items-center">
      <p className="text-2xl text-electric-blue">Loading dashboard...</p>
    </div>
  );
}