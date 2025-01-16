// import { NextResponse } from "next/server";
// import OnboardingData from "@/models/onboarding.model";
// import User from "@/models/user.model";
// import connectDb from "@/db/mongoose";

// // Correct export for Next.js 13+ API routes
// export const dynamic = 'force-dynamic';

// // Add OPTIONS method to handle preflight requests
// export async function OPTIONS(request) {
//   return NextResponse.json({}, { status: 200 });
// }

// // GET method to fetch or create onboarding data
// export async function GET(request) {
//   try {
//     await connectDb();
//     const url = new URL(request.url);
//     const userId = url.pathname.split("/")[3]; // Extract userId from the URL path

//     const formData = {};
//     // Extract query parameters
//     url.searchParams.forEach((value, key) => {
//       formData[key] = value;
//     });

//     if (!userId) {
//       return NextResponse.json({ error: "userId is required" }, { status: 400 });
//     }

//     console.log("Received userId: in server", userId);
//     console.log("Received formData: in server", formData);

//     // Check if onboarding data already exists
//     let onboardingData = await OnboardingData.findOne({ userId });
//     if (onboardingData) {
//       return NextResponse.json(
//         { message: "Onboarding data fetched successfully.", onboardingData },
//         { status: 200 }
//       );
//     }

//     // Create OnboardingData if not found
//     const defaultFormData =formData;

//     onboardingData = await OnboardingData.create({
//       userId,
//       ...defaultFormData,
//     });

//     console.log("New Onboarding Data created:", onboardingData);

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
//       { message: "Onboarding data created successfully.", onboardingData, user },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error in GET onboarding route:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// src/app/api/test-1/route.js

export async function POST(request) {
  try {
    // Parse JSON from the request body directly in the POST handler
    const body = await request.json();
    console.log("body", body);  
    const { message } = body;
    console.log("message", message);  

    // Check if the message is provided
    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: "No message provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return a response with the received message
    return new Response(
      JSON.stringify({ success: true, echo: message }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Handle any errors and return a response
    return new Response(
      JSON.stringify({ success: false, error: "Invalid request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

