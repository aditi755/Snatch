// app/onboarding/layout.js
"use client";

import { SelectedProjectsProvider } from "./context";
import Image from "next/image";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function OnboardingLayout({ children }) {

  return (
   <SelectedProjectsProvider>
    <div className="min-h-screen bg-gray-200 text-white">
      <Header />
      <main className="p-8">{children}</main>
    </div>
   </SelectedProjectsProvider>
     
    
  );
}

