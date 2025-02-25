

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/api/auth/refreshInstagram",
]);

export default clerkMiddleware(async (authFn, request) => {
  const auth = await authFn(); 
  const { sessionId, userId } = auth;
  console.log("Session ID:", sessionId);
  console.log("User ID:", userId);

  const url = new URL(request.url); 

  const isDashboardRoute = url.pathname === "/dashboard";

  if (sessionId && (url.pathname === "/" )) {
    const redirectUrl = new URL("dashboard", request.url); 
    return NextResponse.redirect(redirectUrl);
  }
  

  // Allow authenticated users to access the onboarding route
  if (isDashboardRoute && sessionId) {
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
