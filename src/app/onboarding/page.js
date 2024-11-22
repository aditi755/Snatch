// app/onboarding/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
export default function Step1() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store the form data in the state or send it to the server
    const formData = { name, email };
    console.log(formData); 
    router.push('/onboarding/step-2'); 
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Step 1: Enter Your Information</h2>
     
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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


