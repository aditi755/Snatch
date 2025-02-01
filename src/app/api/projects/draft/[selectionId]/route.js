import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    console.log("Starting DELETE operation...");
    
    const { userId } = getAuth(req);
    const { selectionId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!selectionId) {
      return NextResponse.json(
        { success: false, error: "Selection ID is required." },
        { status: 400 }
      );
    }

    // Find the user's draft
    const draft = await ProjectDraft.findOne({ userId });
    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Draft not found." },
        { status: 404 }
      );
    }

    console.log("Draft found for user", userId);

    // Filter out the instagramSelected and formData entries with the given selectionId
    const updatedInstagramSelected = draft.instagramSelected.filter(
      (item) => item.id !== Number(selectionId) // Ensure selectionId is a number
    );

    const updatedFormData = draft.formData.filter(
      (item) => item.key !== selectionId
    );

    // Update the database
    await ProjectDraft.updateOne(
      { _id: draft._id },
      {
        $set: {
          instagramSelected: updatedInstagramSelected,
          formData: updatedFormData,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "FormData and InstagramSelected entry deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


