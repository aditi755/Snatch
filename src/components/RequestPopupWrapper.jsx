"use client";
import { useState } from "react";
import SendRequestPopup from "@/components/SendRequestPopup";
import { useSearchParams } from "next/navigation";

export default function RequestPopupWrapper() {
  const [showPopup, setShowPopup] = useState(true);
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "unknown influencer";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Show Popup
      </button>

      {showPopup && (
        <SendRequestPopup onClose={() => setShowPopup(false)} username={username} />
      )}
    </div>
  );
}
