// app/onboarding/layout.js
"use client";

import { SelectedProjectsProvider } from "./context";
import Image from "next/image";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function OnboardingLayout({ children }) {

  return (
   <SelectedProjectsProvider>
    <div className="min-h-screen bg-smoke text-white">
      <Header />
      <main className="p-8 overflow-hidden">{children}</main>
    </div>
   </SelectedProjectsProvider>

  );
}

