import Link from "next/link";
import Image from "next/image";
import { useState } from "react";


export default function Menu() {
  const [open, setOpen] = useState(false);


  return (
    <div className="fixed bottom-5 w-full flex justify-center items-center z-50">
      {/* Common Wrapper */}
      <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-lg">
       
        {/* Individual Wrapper for Hamburger Icon */}
        <button
          className="bg-[#F7F7F7] p-4 rounded-xl shadow-md"
          onClick={() => setOpen(!open)}
        >
          <Image
            src="/assets/icons/settings/solar_hamburger-menu-linear.svg"
            alt="Menu Icon"
            width={24}
            height={24}
            className="hover:opacity-80 transition-opacity"
          />
        </button>


        {/* Individual Wrapper for SNATCH logo */}
        <div className="bg-[#F7F7F7] px-4 py-3 rounded-xl shadow-md flex items-center justify-center">
          <span className="text-electric-blue font-bold text-lg tracking-wide">SNATCH</span>
        </div>
      </div>


      {/* Dropdown Menu */}
      {open && (
        <div className="absolute bottom-[78px] bg-white shadow-lg rounded-lg p-8 w-[217px] z-50">
          <ul className="space-y-2 text-[#0044FF] font-medium font-apfel-grotezk-regular">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/settings">Settings</Link></li>
            <li><Link href="/explore">Explore</Link></li>
            <li><Link href="/profile">Profile</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
}
