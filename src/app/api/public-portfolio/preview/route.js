

// stats of each specific project is left

//api/public-portfolio/preview/route.js
import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "postId is required." },
        { status: 400 }
      );
    }

    // Find the project containing the formData
    const project = await ProjectDraft.findOne({ "formData.key": postId });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 }
      );
    }

    const matchedFormData = project.formData.find(item => item.key === postId);

    if (!matchedFormData) {
      return NextResponse.json(
        { success: false, error: "Matching form data not found." },
        { status: 404 }
      );
    }

    let media = null;

    // 🟢 First try to match Instagram media by mediaId === postId
    const matchedInstagram = project.instagramSelected.find(insta =>
      insta.mediaId === postId || insta.id?.toString() === postId
    );

    if (matchedInstagram) {
      media = {
        source: "instagram",
        type:
  matchedInstagram.name === "CAROUSEL_ALBUM"
    ? "CAROUSEL"
    : matchedInstagram.name === "VIDEO"
    ? "VIDEO"
    : "IMAGE",

files:
  matchedInstagram.name === "CAROUSEL_ALBUM"
    ? matchedInstagram.children.map(child => ({
        type: child.media_type,
        url: child.media_url,
      }))
    : [
        {
          type: matchedInstagram.name === "VIDEO" ? "VIDEO" : "IMAGE",
          url: matchedInstagram.mediaLink,
        },
      ],
      };
    }

    // 🔵 Else try to match uploaded files by mediaId === postId
    if (!media) {
      const matchedUploads = project.uploadedFiles.filter(
        upload => upload.mediaId?.toString() === postId
      );

      if (matchedUploads.length > 0) {
        media = {
          source: "uploaded",
          type: matchedUploads[0].fileName.endsWith(".mp4") ? "VIDEO" : "IMAGE",
          files: matchedUploads.map(upload => ({
            type: upload.fileName.endsWith(".mp4") ? "VIDEO" : "IMAGE",
            url: upload.fileUrl,
          })),
        };
      }
    }

    // If no media found at all
    if (!media) {
      media = {
        source: null,
        type: null,
        files: [],
      };
    }

    return NextResponse.json({
      success: true,
      post: matchedFormData,
      media,
    });

  } catch (error) {
    console.error("Error fetching post data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
