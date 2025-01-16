"use client";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
export default function Page() {
  return (
    <div>
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-xl font-bold">signout</h1>

      <UserButton afterSignedOutUrl="/" />
      
    </div>
    </div>
  );
}



