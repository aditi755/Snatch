"use client";

import { UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-xl font-bold">signout</h1>

      <UserButton afterSignedOutUrl="/" />
      
    </div>
    </div>
  );
}

// //----2------
// 'use client';

// import { useState } from 'react';

// export default function InstagramLoginButton() {
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/auth/instagram');
//       const data = await response.json();

//       if (data.url) {
//         window.location.href = data.url; // Redirect to Instagram OAuth
//       } else {
//         alert('Failed to get Instagram login URL');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while trying to log in.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleLogin}
//       disabled={loading}
//       className="px-4 py-2 bg-blue-600 text-black rounded"
//     >
//       {loading ? 'Redirecting...' : 'Login with Instagram'}
//     </button>
//   );
// }
