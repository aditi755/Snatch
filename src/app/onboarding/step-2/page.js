// app/onboarding/step-2/page.js
"use client";

import { useState } from "react";
import { useFormContext } from "../context";
export default function Step2() {
  const { formData, updateFormData } = useFormContext();
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({ address }); // Add new data to the context
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Step 2: Enter Your Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mt-4 flex justify-between">
          <button type="submit" className="btn-primary">
            Save and Continue
          </button>
        </div>
      </form>
    </div>
  );
}
