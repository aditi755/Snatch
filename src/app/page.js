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

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser(); // Destructure isLoaded and isSignedIn

  // Show a loading state while the user data is being hydrated
  if (!isLoaded) {
    return <div className=" flex justify-center items-center text-3xl h-screen">Loading...</div>;
  }

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
