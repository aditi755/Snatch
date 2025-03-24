// // src/app/layout.js
// import localFont from "next/font/local";
// import "./globals.css";
// import {
//   ClerkProvider,
//   SignedIn,
//   SignedOut,
// } from '@clerk/nextjs'
// import posthog from 'posthog-js'

// const apfelGrotezkMittel = localFont({
//   src: [
//     {
//       path: "./fonts/ApfelGrotezk-Mittel.otf", 
//       weight: "400", 
//       style: "normal", 
//     },
//   ],
//   variable: "--font-apfel-grotezk-mittel", 
// });

// const apfelGrotezkRegular = localFont({
//   src: [
//     {
//       path: "./fonts/ApfelGrotezk-Regular.otf", 
//       weight: "400",
//       style: "normal", 
//     },
//   ],
//   variable: "--font-apfel-grotezk-regular", 
// });

// const qimano = localFont({
//   src: [
//     {
//       path: "./fonts/Qimano-aYxdE.otf", 
//       weight: "400", 
//       style: "normal", 
//     },
//   ],
//   variable: "--font-qimano", 
// });

// export const metadata = {
//   title: "Snatch",
//   description: "Connecting Influencers",
//   viewport: {
//     width: "device-width",
//     initialScale: 1,
//   },
// };

// // ✅ Corrected PostHog Initialization
// if (typeof window !== "undefined") {
//   posthog.init("phc_j5chnS7H8Lbghn45GojA3yDiYxxbJi4VjnxQW1SEHtn", {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
//     capture_pageview: true, // Optional: Disable automatic pageview tracking
//     debug: true,
//      person_profiles: 'identified_only'
//   });

//   console.log("✅ PostHog initialized successfully");

// }
// export default function RootLayout({ children }) {
//   return (
//     <ClerkProvider>
//     <html lang="en">
//       <body
//         className={`${apfelGrotezkMittel.variable} ${apfelGrotezkRegular.variable} ${qimano.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//     </ClerkProvider>
//   );
// }



import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { PostHogProvider } from "./providers"; // Import the PostHogProvider

const apfelGrotezkMittel = localFont({
  src: [
    {
      path: "./fonts/ApfelGrotezk-Mittel.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-apfel-grotezk-mittel",
});

const apfelGrotezkRegular = localFont({
  src: [
    {
      path: "./fonts/ApfelGrotezk-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-apfel-grotezk-regular",
});

const qimano = localFont({
  src: [
    {
      path: "./fonts/Qimano-aYxdE.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-qimano",
});

export const metadata = {
  title: "Snatch",
  description: "Connecting Influencers",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        <html lang="en">
          <body
            className={`${apfelGrotezkMittel.variable} ${apfelGrotezkRegular.variable} ${qimano.variable} antialiased`}
          >
            {children}
          </body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  );
}
