// // get only isdraft : false so completed posts come
// import { NextResponse } from "next/server";
// import connectDb from "@/db/mongoose";
// import ProjectDraft from "@/models/project.model";
// import OnboardingData from "@/models/onboarding.model";

// export const dynamic = "force-dynamic";

// export async function GET(req) {
//   try {
//     await connectDb();

//     const url = new URL(req.url);
//     const username = url.searchParams.get("username");

//     console.log("Public portfolio API called with username:", username);

//     if (!username) {
//       return NextResponse.json(
//         { success: false, error: "Username is required." },
//         { status: 400 }
//       );
//     }

//     // Step 1: Find the onboarding data to get userId
//     const onboardingData = await OnboardingData.findOne({ username });

//     if (!onboardingData) {
//       return NextResponse.json(
//         { success: false, error: "User not found in onboarding data." },
//         { status: 404 }
//       );
//     }

//     const userId = onboardingData.userId;

//     // Step 2: Find the project using userId
//     const project = await ProjectDraft.findOne({ userId });

//     if (!project) {
//       return NextResponse.json(
//         { success: false, error: "Project not found." },
//         { status: 404 }
//       );
//     }

//     // ✅ Filter out drafts
//     const instagramProjects = project.instagramSelected.filter(item => !item.isDraft);
//     const uploadedProjects = project.uploadedFiles.filter(item => !item.isDraft);
//     const formData = project.formData.filter(item => !item.isDraft); // In case you need it

//     return NextResponse.json({
//       success: true,
//       instagram: instagramProjects,
//       uploaded: uploadedProjects,
//       // formData: formData, // Optional: uncomment if needed
//     });

//   } catch (error) {
//     console.error("Error fetching public portfolio:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";
import OnboardingData from "@/models/onboarding.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const userIdParam = url.searchParams.get("userId");

    if (!username && !userIdParam) {
      return NextResponse.json(
        { success: false, error: "Either username or userId is required." },
        { status: 400 }
      );
    }

    let userId = userIdParam;

    // If only username is provided, resolve userId
    if (!userId && username) {
      const onboardingData = await OnboardingData.findOne({ username });

      if (!onboardingData) {
        return NextResponse.json(
          { success: false, error: "User not found in onboarding data." },
          { status: 404 }
        );
      }

      userId = onboardingData.userId;
    }

    // Get the project data for that user
    const project = await ProjectDraft.findOne({ userId });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "No project data found for this user." },
        { status: 404 }
      );
    }

    // Filter out drafts
    const instagramProjects = project.instagramSelected.filter(item => !item.isDraft);
    const uploadedProjects = project.uploadedFiles.filter(item => !item.isDraft);
    const formData = project.formData.filter(item => !item.isDraft); // optional

    return NextResponse.json({
      success: true,
      instagram: instagramProjects,
      uploaded: uploadedProjects,
      // formData: formData, // optional
    });

  } catch (error) {
    console.error("Error in /api/posts route:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
