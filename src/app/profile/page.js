
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "../onboarding/context";

export default function DashboardRedirect() {
  const router = useRouter();
  const { formData } = useFormContext();

  useEffect(() => {
    if (formData?.username) {
      router.push(`/profile/${formData.username}`);
    }
  }, [formData, router]);

  return (
    <div className="h-screen bg-white flex justify-center items-center">
      <p className="text-2xl text-electric-blue">Loading Profile...</p>
    </div>
  );
}
