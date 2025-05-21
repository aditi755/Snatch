

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/api/auth/refreshInstagram",
  "/privacy-policy",
  "/terms-and-services",
  "/api/public-portfolio/userinfo",
  "/api/public-portfolio/posts",
  "/api/public-portfolio/questions",
  "/api/public-portfolio/audience/allDemographics",
  "/api/public-portfolio/audience/cityDemographics",
  "/api/public-portfolio/audience/countryDemographics",
  "/api/public-portfolio/audience/femaleDemographics",
  "/api/public-portfolio/audience/genderDemographics",
  "/api/public-portfolio/audience/maleDemographics",
  "/api/public-portfolio/preview",
  "/api/public-portfolio/media-insights",
  "/api/public-portfolio/instagram-stats",
  "/request-popup",
  "/api/send-email",
  "/:username/media-kit",
  "/:username/media-kit/post"
]);

export default clerkMiddleware(async (authFn, request) => {
  const auth = await authFn(); 
  const { sessionId, userId } = auth;
  console.log("Session ID:", sessionId);
  console.log("User ID:", userId);

  const url = new URL(request.url); 
  const isAdminRoute = url.pathname.includes('/adminview');
  const isDashboardRoute = url.pathname === "/dashboard";

  // If it's an admin route and user is not authenticated, redirect to signup
  if (isAdminRoute && !sessionId) {
    const redirectUrl = new URL("/signup", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (sessionId && (url.pathname === "/" )) {
    const redirectUrl = new URL("dashboard", request.url); 
    return NextResponse.redirect(redirectUrl);
  }

  // Allow authenticated users to access the dashboard route
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
