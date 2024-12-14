
// //  src/middleware.js
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// // Import Clerk API keys from environment variables
// const CLERK_API_KEY = process.env.CLERK_API_KEY;
// const CLERK_API_SECRET = process.env.CLERK_API_SECRET;

// console.log("Clerk API Key:", CLERK_API_KEY);
// console.log("Clerk API Secret:", CLERK_API_SECRET);


// const isPublic = createRouteMatcher([
//   '/',
//   '/login(.*)',
//   '/signup(.*)',
// ]);

// export default clerkMiddleware((auth, request) => {
//   console.log('Middleware is running.');
//   console.log('Request URL:', request.url);

//   const { userId, sessionId, error } = auth();
//   console.log("UserId from middleware:", userId);
//   console.log("SessionId:", sessionId);
//   console.log("Error:", error);

//   if (error) {
//     // Handle error in getting user session
//     console.error("Error getting user session:", error);
//     return NextResponse.redirect(new URL('/signup', request.url));
//   }

//   const url = new URL(request.url);

//   if (!isPublic(request)) {
//     if (!userId) {
//       console.log('User not authenticated. Redirecting to /signup');
//       return NextResponse.redirect(new URL('/signup', request.url));
//     }

//     // If authenticated and on /onboarding, proceed
//     if (url.pathname === '/onboarding') {
//       console.log('User is authenticated and on /onboarding. Proceeding...');
//       return NextResponse.next();
//     }

//     // Otherwise, redirect to onboarding
//     console.log('User authenticated. Redirecting to /onboarding');
//     return NextResponse.redirect(new URL('/onboarding', request.url));
//   }

//   // Allow public routes
//   console.log('Public route. Proceeding...');
//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };


// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/login(.*)",
//   "/signup(.*)",
// ]);

// export default clerkMiddleware((auth, request) => {
//   const url = new URL(request.url);
//   const { sessionId, userId } = auth;
//   console.log("USER FROM MIDDLEWARE", { sessionId, userId });

//   const isOnboardingRoute = url.pathname === "/onboarding";

//   // Handle authenticated users accessing the onboarding route
//   if (isOnboardingRoute && userId ) {
//     return NextResponse.next();
//   }

//   // If the session exists and the user is visiting the homepage, redirect to /onboarding
//   if (sessionId && req.nextUrl.pathname === "/") {
//     const url = req.nextUrl.clone();
//     url.pathname = "/onboarding";
//     return NextResponse.redirect(url);
//   }


//   // Redirect unauthenticated users trying to access non-public routes
//   if (!isPublicRoute(request) && (!sessionId || !userId)) {
//     const redirectUrl = new URL("/signup", url.origin);
//     console.log("Redirect URL:", redirectUrl.href);
//     return NextResponse.redirect(redirectUrl);
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };





//giving sessionId and userId
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/login(.*)",
//   "/signup(.*)",
// ]);

// export default clerkMiddleware(async (authFn, request) => {
//   const auth = await authFn(); // Await the resolved auth object
//   const { sessionId, userId } = auth;
//   console.log("Resolved AUTH:", auth);
//   console.log("Session ID:", sessionId);
//   console.log("User ID:", userId);

//   console.log("USER FROM MIDDLEWARE", { sessionId, userId });

//   const isOnboardingRoute = url.pathname === "/onboarding";

//   // If the user is already authenticated and on /, redirect to /onboarding
//   if (sessionId && url.pathname === "/") {
//     const redirectUrl = url.clone();
//     redirectUrl.pathname = "/onboarding";
//     return NextResponse.redirect(redirectUrl);
//   }

//   // Allow authenticated users to access the onboarding route
//   if (isOnboardingRoute && sessionId) {
//     return NextResponse.next();
//   }

//   // Redirect unauthenticated users from private routes to signup
//   if (!isPublicRoute(req) && !sessionId) {
//     const redirectUrl = new URL("/signup", req.url);
//     console.log("Redirect URL:", redirectUrl.href);
//     return NextResponse.redirect(redirectUrl);
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };











import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
]);

export default clerkMiddleware(async (authFn, request) => {
  const auth = await authFn(); // Await the resolved auth object
  const { sessionId, userId } = auth;

  console.log("Resolved AUTH:", auth);
  console.log("Session ID:", sessionId);
  console.log("User ID:", userId);

  const url = new URL(request.url); // Initialize URL from the request object
  console.log("USER FROM MIDDLEWARE", { sessionId, userId });

  const isOnboardingRoute = url.pathname === "/onboarding";

  // If the user is already authenticated and on "/", redirect to "/onboarding"
  if (sessionId && url.pathname === "/") {
    const redirectUrl = new URL("/onboarding", request.url); // Use URL constructor for redirection
    return NextResponse.redirect(redirectUrl);
  }

  // Allow authenticated users to access the onboarding route
  if (isOnboardingRoute && sessionId) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from private routes to signup
  if (!isPublicRoute(request) && !sessionId) {
    const redirectUrl = new URL("/signup", request.url);
    console.log("Redirect URL:", redirectUrl.href);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
