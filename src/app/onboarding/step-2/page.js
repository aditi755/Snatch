// app/step-2/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Step2() {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { address, phoneNumber };
    console.log(formData);  // Optionally log data to check
    // Final step (can redirect to a confirmation page or dashboard)
    router.push('/onboarding-complete'); // Redirect to the final page
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Step 2: Enter Your Address and Phone Number</h2>
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

        <div>
          <label htmlFor="phoneNumber" className="block text-sm">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mt-4 flex justify-between">
          <button type="submit" className="btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
