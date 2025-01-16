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
      <main className="p-8">{children}</main>
      
    <div className="flex gap-2 p-2 h-[60px] bg-white w-[290px] border-b border-gray-300 justify-center mx-auto">
      <div className="flex gap-2 w-[260px] h-[40px] justify-center bg-gray-100 rounded-sm ">
      <button className="w-[72px] px-2 py-1 border-electric-blue border-2 text-electric-blue rounded hover:bg-blue-700 transition-colors">
        Back
      </button>
      <button className="px-4 py-1 bg-electric-blue text-white rounded hover:bg-blue-700 transition-colors">
        Add Project details
      </button>
      </div>
      </div>
    </div>
   </SelectedProjectsProvider>

  );
}

