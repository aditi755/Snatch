// "use client";

// import { useUser } from "@clerk/nextjs";
// import Link from "next/link";

// export default function Home() {
//   const { isSignedIn } = useUser(); // Check if user is signed in

//   return (
//     <div className="h-screen bg-smoke flex gap-4 justify-center items-center sm:flex-col overflow-hidden">
//       <p className="text-5xl mx-auto text-electric-blue">Welcome to Snatch</p>
//       <p>
//         <Link
//           className="text-2xl"
//           href={isSignedIn ? "/dashboard" : "/signup"} // Redirect based on login status
//         >
//           Click here: {isSignedIn ? "Dashboard" : "Signup"} page
//         </Link>
//       </p>
//     </div>
//   );
// }



"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useFormContext } from "./onboarding/context";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser(); // Check if user data is loaded
  const { formData } = useFormContext();
  const { userId } = useAuth(); // Get userId from Clerk in client comp to send to api
  
  if (!isLoaded) {
    return (
      <div className="h-screen bg-smoke flex justify-center items-center">
        <p className="text-2xl text-electric-blue">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-smoke flex gap-4 justify-center items-center sm:flex-col overflow-hidden">
      <p className="text-5xl mx-auto text-electric-blue">Welcome to Snatch</p>
      <p>
        <Link
          className="text-2xl"
          href={isSignedIn ? `/dashboard/${formData.username}` : "/signup"} // Redirect based on login status
        >
          Click here: {isSignedIn ? "Dashboard" : "Signup"} page
        </Link>
      </p>
    </div>
  );
}
