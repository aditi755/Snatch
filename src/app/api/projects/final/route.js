import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDb(); 
    // Get the userId from the request (authenticated user)
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    // Get the request body data
    const { activeImageId } = await req.json();
    console.log("activeImageId final submit", activeImageId);

    // Find the project based on userId
    const project = await ProjectDraft.findOne({ userId });
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    // Function to update isDraft for the correct activeImageId in formData and instagramSelected
    const updateIsDraftForActiveImageId = (items, idKey) => {
      return items.map((item) => {
        if (item[idKey] === activeImageId) {
          return { ...item, isDraft: false }; // Update isDraft to false for the matching item
        }
        return item; // Return the item unchanged if it doesn't match
      });
    };

    // Update formData and instagramSelected where activeImageId matches
    project.formData = updateIsDraftForActiveImageId(project.formData, activeImageId);
    project.instagramSelected = updateIsDraftForActiveImageId(project.instagramSelected, activeImageId);

    console.log("✅ Updated project:", project.formData, project.instagramSelected);

    // Save the updated project
    await project.save();

    // Return success response
    return NextResponse.json({ success: true, message: "Project has been finalized successfully." });

  } catch (error) {
    console.error("Error finalizing project:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
