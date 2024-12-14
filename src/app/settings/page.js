"use client"  //i need to make every page client page forceably fix it 
import { useAuth } from '@clerk/nextjs';

export default function SignOutButton() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  return <button className="text-3xl text-graphite flex justify-center items-center" onClick={handleSignOut}>Sign Out</button>;
}




// "use client";

// import { useAuth } from '@clerk/nextjs';
// import { useRouter } from 'next/router';

// export default function SignOutButton() {
//   const { signOut } = useAuth();
//   const router = useRouter();

//   const handleSignOut = async () => {
//     try {
//       await signOut();

//       // Clear any local session data
//       document.cookie = ''; // Clear all cookies
//       localStorage.clear(); // Clear local storage

//       // Optional: Manually revoke session from Clerk's API
//       // This can be done if you need more forceful session revocation
//       // Example:
//       // const response = await fetch('/api/revoke-session', {
//       //   method: 'POST',
//       // });
//       // if (response.ok) {
//       //   console.log('Session revoked successfully');
//       // } else {
//       //   console.error('Failed to revoke session');
//       // }

//       console.log('User signed out successfully');
//       router.push('/login'); // Redirect to login page
//     } catch (error) {
//       console.error('Sign-out failed:', error);
//     }
//   };

//   return (
//     <button
//       className="text-3xl text-graphite flex justify-center items-center"
//       onClick={handleSignOut}
//     >
//       Sign Out
//     </button>
//   );
// }
