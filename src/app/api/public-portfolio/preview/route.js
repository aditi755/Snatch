

// stats of each specific project is left

// it is to get the formdata of a specific post as per postid receive from frontend

// //api/public-portfolio/preview/route.js
import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";
import OnboardingData from "@/models/onboarding.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId")?.toString();
    const username = url.searchParams.get("username"); // Add username parameter

    if (!postId || !username) {
      return NextResponse.json({ 
        success: false, 
        error: "Both postId and username are required." 
      }, { status: 400 });
    }

    // First find the user's project
    const onboardingData = await OnboardingData.findOne({ username });
    if (!onboardingData) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found." 
      }, { status: 404 });
    }

    // Find the specific user's project
    const project = await ProjectDraft.findOne({ userId: onboardingData.userId });
    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: "Project not found." 
      }, { status: 404 });
    }

    // Find matching form data for this specific user's project
    const matchedFormData = project.formData.find(item => item.key === postId);
    if (!matchedFormData) {
      return NextResponse.json({ 
        success: false, 
        error: "Matching form data not found." 
      }, { status: 404 });
    }

    let media = null;
    const matchedInstagram = project.instagramSelected.find(insta =>
      insta.mediaId === postId || insta.id?.toString() === postId
    );

    if (matchedInstagram) {
      media = {
        source: "instagram",
        type: matchedInstagram.name === "CAROUSEL_ALBUM"
          ? "CAROUSEL"
          : matchedInstagram.name === "VIDEO"
          ? "VIDEO"
          : "IMAGE",
        files: matchedInstagram.name === "CAROUSEL_ALBUM"
          ? matchedInstagram.children.map(child => ({
              type: child.media_type,
              url: child.media_url,
            }))
          : [{
              type: matchedInstagram.name === "VIDEO" ? "VIDEO" : "IMAGE",
              url: matchedInstagram.mediaLink,
            }],
      };
    } else {
      // Check uploaded files if no Instagram match
      const matchedUpload = project.uploadedFiles.find(
        upload => String(upload.mediaId) === String(postId)
      );
      
      if (matchedUpload) {
        media = {
          source: "uploaded",
          type: matchedUpload.fileName.endsWith(".mp4") ? "VIDEO" : "IMAGE",
          files: [{
            type: matchedUpload.fileName.endsWith(".mp4") ? "VIDEO" : "IMAGE",
            url: matchedUpload.fileUrl,
          }],
        };
      }
    }

    return NextResponse.json({ success: true, post: matchedFormData, media });
  } catch (error) {
    console.error("Error in preview route:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

