// //src/app/api/onboarding/[userId]/route.js
// "use server"
// import { NextResponse } from "next/server";
// import OnboardingData from "@/models/onboarding.model";
// import User from "@/models/user.model";
// import connectDb from "@/db/mongoose";
// import { getAuth } from '@clerk/nextjs/server';
// // Correct export for Next.js 13+ API routes
// export const dynamic = 'force-dynamic';

// // Add OPTIONS method to handle preflight requests
// export async function OPTIONS(request) {
//   return NextResponse.json({}, { status: 200 });
// }

// export async function POST(request) {
//  // console.log("API Route hit with params:", params); // Add this for debugging
//   try {
//     await connectDb();
//     const {userId} = getAuth(req);
//     console.log("userid server-------", userId)
//     const formData = await request.json();

//     if (!userId) {
//       return NextResponse.json({ error: "userId is required" }, { status: 400 });
//     }

//     // Check if onboarding data already exists
//     const existingOnboarding = await OnboardingData.findOne({ userId });
//     if (existingOnboarding) {
//       return NextResponse.json(
//         { message: "Onboarding data already exists" },
//         { status: 400 }
//       );
//     }

//     // Create OnboardingData
//     const onboardingData = await OnboardingData.create({
//       userId,
//       ...formData,
//     });

//     // Check if a User exists
//     let user = await User.findOne({ userId });

//     if (!user) {
//       // Create a new User if none exists
//       user = await User.create({
//         userId,
//         instagramUsername: onboardingData.username,
//         onboardingData: onboardingData._id,
//       });
//     } else {
//       // Link OnboardingData to existing User
//       user.onboardingData = onboardingData._id;
//       await user.save();
//     }

//     return NextResponse.json(
//       { message: "Success", onboardingData, user },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
