import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDb();
    const { userId } = getAuth(req);
    const { activeImageId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    const project = await ProjectDraft.findOne({ userId });
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    // Function to update isDraft for formData
    const updateIsDraftForActiveImageId = (items) => {
      return items
        .filter((item) => item && item.key && item.key.trim() !== "")
        .map((item) => {
          if (item.key === activeImageId) {
            return { ...item, isDraft: false };
          }
          return item;
        });
    };
    
    // Function to update isDraft for instagramSelected
    const updateInstagramSelectedforActiveImageId = (items) => {
      return items
        .filter((item) => item && item.mediaId && item.mediaId.trim() !== "")
        .map((item) => {
          if (item.mediaId === activeImageId) {
            return { ...item, isDraft: false };
          }
          return item;
        });
    };

    // Function to update isDraft for uploadedFiles
    const updateUploadedFilesForActiveImageId = (items) => {
      return items
        .filter((item) => item && item.mediaId)
        .map((item) => {
          if (String(item.mediaId) === String(activeImageId)) {
            return { ...item, isDraft: false };
          }
          return item;
        });
    };

    // Update formData, instagramSelected, and uploadedFiles where activeImageId matches
    project.formData = updateIsDraftForActiveImageId(project.formData);
    project.instagramSelected = updateInstagramSelectedforActiveImageId(project.instagramSelected);
    project.uploadedFiles = updateUploadedFilesForActiveImageId(project.uploadedFiles);

    // Save the updated project
    await project.save();

    return NextResponse.json({ 
      success: true, 
      message: "Project has been finalized successfully." 
    });

  } catch (error) {
    console.error("Error finalizing project:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}