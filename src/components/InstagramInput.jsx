"use client";

import Image from "next/image";
import React from "react";

export default function InstagramInput({ placeholder = "Enter instagram url" }) {
  return (
    <div className="flex items-center w-full rounded-md border border-stroke px-2 py-3">
      {/* Instagram Icon */}
      <span className="text-primary">
       <Image src="/assets/icons/onboarding/Instagram.svg" alt="Instagram" width={30} height={34} />
      </span>
      {/* Vertical Line */}
      <div className="w-[1px] h-6 bg-stroke mx-3"></div>
      {/* Input Field */}
      <input
        type="url"
        placeholder={placeholder}
        className="flex-grow bg-transparent text-graphite outline-none transition placeholder:text-dark-grey"
      />
    </div>
  );
}
