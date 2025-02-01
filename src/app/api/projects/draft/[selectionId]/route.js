// //api/projects/draft/selectionId/route.js
// import { NextResponse } from "next/server";
// import connectDb from "@/db/mongoose";
// import ProjectDraft from "@/models/project.model";
// import { getAuth } from "@clerk/nextjs/server";

// export const dynamic = "force-dynamic";

// export async function POST(req) {
//     try {
//       await connectDb();
//       const { userId } = getAuth(req);
  
//       if (!userId) {
//         return NextResponse.json(
//           { success: false, error: "User ID is required." },
//           { status: 400 }
//         );
//       }
  
//       const data = await req.json();
//       const timestamp = new Date().toISOString();
  
//       const draft = await ProjectDraft.findOneAndUpdate(
//         { userId },
//         { ...data, updatedAt: timestamp },
//         { upsert: true, new: true }
//       );
  
//       return NextResponse.json({ success: true, data: draft });
//     } catch (error) {
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       );
//     }
//   }
  
//   // Delete formData fields associated with a selectionId
//   export async function DELETE(req, { params }) {
//     try {
//       await connectDb();
//       console.log("starting deleteing the databse DEELETE ")
//       const { userId } = getAuth(req);
//       const { selectionId } = params;
  
//       console.log("DELEET SELECTION ID in [] dynamic api ", selectionId)
  
//       if (!userId) {
//         return NextResponse.json(
//           { success: false, error: "User ID is required." },
//           { status: 400 }
//         );
//       }
  
//       if (!selectionId) {
//         return NextResponse.json(
//           { success: false, error: "Selection ID is required." },
//           { status: 400 }
//         );
//       }
  
//       // Find the draft associated with the userId
//       const draft = await ProjectDraft.findOne({ userId });
  
//       if (!draft) {
//         return NextResponse.json(
//           { success: false, error: "Draft not found." },
//           { status: 404 }
//         );
//       }
  
//       // Check if the formData Map has the selectionId key
//       console.log("drfat formdata", draft.formData, draft.formData.has(selectionId));
//       if (!draft.formData.has(selectionId)) {
//         return NextResponse.json(
//           { success: false, error: "FormData not found for the given selectionId." },
//           { status: 404 }
//         );
//       }


//       await ProjectDraft.updateOne(
//         { _id: draft._id }, // Find the document
//         { $unset: { [`formData.${selectionId}`]: "" } } // Remove the specific key
//       );
      
  
//       return NextResponse.json({
//         success: true,
//         message: "FormData deleted successfully.",
//       });
//     } catch (error) {
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       );
//     }
//   }


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



//   export async function POST(req) {
//     try {
//       const { selectionId, userId } = await req.json();
  
//       if (!selectionId || !userId) {
//         return NextResponse.json(
//           { success: false, message: "selectionId and userId are required." },
//           { status: 400 }
//         );
//       }
  
//       // Fetch the project draft for the given user
//       const projectDraft = await ProjectDraft.findOne({ userId });
  
//       if (!projectDraft) {
//         return NextResponse.json(
//           { success: false, message: "No project draft found for the user." },
//           { status: 404 }
//         );
//       }
  
//       // Check if the selectionId exists in the formData
//       const formDataKeys = Array.from(projectDraft.formData.keys());
//       const exists = formDataKeys.includes(selectionId);
  
//       return NextResponse.json({ success: true, exists });
//     } catch (error) {
//       console.error("Error checking formData:", error);
//       return NextResponse.json(
//         { success: false, message: "An error occurred while checking formData." },
//         { status: 500 }
//       );
//     }
//   }