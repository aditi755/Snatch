  // import Image from "next/image";
  // import Link from 'next/link';

  // export default function Home() {
  //   return (
  //     <div className="h-screen bg-smoke flex gap-4 justify-center items-center sm:flex-col overflow-hidden">
       
  //        <p className="text-5xl mx-auto text-electric-blue">Welcome to Snatch</p>  

  //         <p>
  //         <Link className=" text-2xl" href="/signup">Click here: Signup page</Link>
  //         </p>
      
  //     </div>
  //   );
  // }


"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser(); // Check if user is signed in

  return (
    <div className="h-screen bg-smoke flex gap-4 justify-center items-center sm:flex-col overflow-hidden">
      <p className="text-5xl mx-auto text-electric-blue">Welcome to Snatch</p>
      <p>
        <Link
          className="text-2xl"
          href={isSignedIn ? "/dashboard" : "/signup"} // Redirect based on login status
        >
          Click here: {isSignedIn ? "Dashboard" : "Signup"} page
        </Link>
      </p>
    </div>
  );
}
