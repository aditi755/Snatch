"use client";

import { UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-xl font-bold">signout</h1>
      <UserButton afterSignedOutUrl="/" />
    </div>
  );
}
