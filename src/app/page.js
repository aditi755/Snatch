
// "use client";

// import { useUser } from "@clerk/nextjs";
// import Link from "next/link";


// export default function Home() {
//   const { isSignedIn, isLoaded } = useUser();

//   if (!isLoaded) {
//     return (
//       <div className="h-screen bg-smoke flex justify-center items-center">
//         <p className="text-2xl text-electric-blue">Loading...</p>
//       </div>
//     );
//   }


//   //in deployment error is coming that formData is not defined here, because this page is rendering first at that time the form data is not available. to fix this maybe take formData on next page as like Next Button compoenent or first go to dashboard then form dashboard go to /dashboard/{formData.username} page as formData would already be there
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


// app/page.js (Server Component)
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  const { userId } = auth();

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-screen bg-smoke flex gap-4 justify-center items-center sm:flex-col overflow-hidden">
        <p className="text-5xl mx-auto text-electric-blue">Welcome to Snatch</p>
        <p>
          <Link
            className="text-2xl"
            href={userId ? "/dashboard" : "/signup"} // Redirect based on login status
          >
            Click here: {userId ? "Dashboard" : "Signup"} page
          </Link>
        </p>
      </div>
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="h-screen bg-smoke flex justify-center items-center">
      <p className="text-2xl text-electric-blue">Loading...</p>
    </div>
  );
}