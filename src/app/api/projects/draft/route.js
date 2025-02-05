//api/projects/draft/route.js
import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";


// Fetch draft data
export async function GET(req) {
  try {
    await connectDb();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    const draft = await ProjectDraft.findOne({ userId });

    if (!draft) {
      return NextResponse.json({ success: false, error: "Draft not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



// Save draft data
export async function POST(req) {
  try {
    // Connect to the database
    await connectDb();

    // Retrieve the userId from authentication
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    // Parse the incoming request body
    const data = await req.json();
    const timestamp = new Date().toISOString();

    const validateInstagramSelected = (instagramSelected) => {
      // Ensure instagramSelected is an array, even if it is a single object
      if (!Array.isArray(instagramSelected)) {
        instagramSelected = [instagramSelected];  // Wrap in an array
      }
    
      return instagramSelected.map((item) => {
        const validatedItem = {
          id: item.id || "",
          name: item.name || "",
          mediaId: item.mediaId || "",
          mediaLink: item.mediaLink || "",
          children: item.children ? item.children.map(child => ({
            id: child.id || "",
            media_type: child.media_type || "",
            media_url: child.media_url || ""
          })) : [],
          isDraft: item.isDraft !== undefined ? item.isDraft : true,  // Default to true if undefined
        };
    
        return validatedItem;
      });
    };
    const updatedInstagramSelected = validateInstagramSelected(data.instagramSelected);

const validateFormData = (formData) => {
  console.log("BEFORE POST FORMDATA", formData);
  // If formData is not an array, default to an empty array
  if (!Array.isArray(formData)) {
    formData = [formData];
  }
  console.log("AFTER POST FORMDATA", formData);
  // Map through formData and ensure each item has the necessary structure
  return formData.map((item) => {
    return {
      key: item.key ? String(item.key) : "",  // Default to empty string if key is missing
      eventName: item.eventName || "",
      eventLocation: item.eventLocation || "",
      eventYear: item.eventYear || "",
      companyName: item.companyName || "",
      companyLocation: item.companyLocation || "",
      companyLogo: item.companyLogo || "",
      companyLogoFileName: item.companyLogoFileName || "",
      description: item.description || "",
      eventTypes: Array.isArray(item.eventTypes) ? item.eventTypes : [],  // Ensure eventTypes is an array
      industries: Array.isArray(item.industries) ? item.industries : [],  // Ensure industries is an array
      titleName: item.titleName || "",
      isDraft: item.isDraft !== undefined ? item.isDraft : true,  // Default to true if undefined
      isBrandCollaboration: item.isBrandCollaboration !== undefined ? item.isBrandCollaboration : true,
    };
  });
};

    const updatedFormData = validateFormData(data.formData);
    console.log("UPDATED FORMDATA", typeof updatedFormData, updatedFormData);


    // Create or update the draft based on whether it already exists
    let draft = await ProjectDraft.findOneAndUpdate(
      { userId },
      {
        // Update or create a new document with all necessary fields
        ...data,
        formData: updatedFormData,
        instagramSelected: updatedInstagramSelected,
        updatedAt: timestamp,
      },
      { upsert: true, new: true } // Create if not found, return the updated document
    );

    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// // Save draft data only diff properties
// export async function POST(req) {
//   try {
//     // Connect to the database
//     await connectDb();

//     // Retrieve the userId from authentication
//     const { userId } = getAuth(req);

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: "User ID is required." },
//         { status: 400 }
//       );
//     }

//     // Parse the incoming request body
//     const data = await req.json();
//     const timestamp = new Date().toISOString();

//     // Get the existing draft (if any)
//     const existingDraft = await ProjectDraft.findOne({ userId });

//     // --- Process instagramSelected ---
//     // If the payload contains instagramSelected (the full array), validate it.
//     // Otherwise, keep the existing value or default to an empty array.
//     let updatedInstagramSelected = [];
//     if (data.instagramSelected) {
//       updatedInstagramSelected = validateInstagramSelected(data.instagramSelected);
//     } else if (existingDraft && existingDraft.instagramSelected) {
//       updatedInstagramSelected = existingDraft.instagramSelected;
//     }

//     // --- Process formData ---
//     // Here we check if the payload contains a delta update.
//     // For a delta update, we expect properties like "id" and "changes".
//     let updatedFormData = [];
//     if (data.changes && data.id) {
//       // If we have a delta update, merge the changes into the existing formData.
//       const mediaKey = data.id; // 'id' from the delta payload
//       const existingFormData = existingDraft?.formData || [];
//       // Find the record for the given media key.
//       const existingRecord = existingFormData.find(item => item.key === mediaKey) || { key: mediaKey };

//       // Merge the existing record with the changes
//       const mergedRecord = { ...existingRecord, ...data.changes };

//       // Replace or add the record in the formData array.
//       updatedFormData = existingFormData.map(item => 
//         item.key === mediaKey ? mergedRecord : item
//       );
//       // If the record didn't exist, push the new one.
//       if (!existingFormData.some(item => item.key === mediaKey)) {
//         updatedFormData.push(mergedRecord);
//       }
//     } else if (data.formData) {
//       // Otherwise, if the payload has full formData, validate it.
//       updatedFormData = validateFormData(data.formData);
//     } else if (existingDraft && existingDraft.formData) {
//       updatedFormData = existingDraft.formData;
//     }

//     // --- Prepare the update payload ---
//     // Combine the existing draft (if any) with the new values.
//     const updatePayload = {
//       // Spread any other data fields if needed (or list them explicitly)
//       ...data,
//       instagramSelected: updatedInstagramSelected,
//       formData: updatedFormData,
//       updatedAt: timestamp,
//     };

//     // Update (or create) the draft document
//     let draft = await ProjectDraft.findOneAndUpdate(
//       { userId },
//       updatePayload,
//       { upsert: true, new: true } // Create if not found, return the updated document
//     );

//     return NextResponse.json({ success: true, data: draft });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// /* --- Helper Functions --- */

// // Validate instagramSelected
// const validateInstagramSelected = (instagramSelected) => {
//   // Ensure instagramSelected is an array, even if it is a single object
//   if (!Array.isArray(instagramSelected)) {
//     instagramSelected = [instagramSelected];  // Wrap in an array
//   }
//   return instagramSelected.map((item) => {
//     const validatedItem = {
//       id: item.id || "",
//       name: item.name || "",
//       mediaId: item.mediaId || "",
//       mediaLink: item.mediaLink || "",
//       children: item.children ? item.children.map(child => ({
//         id: child.id || "",
//         media_type: child.media_type || "",
//         media_url: child.media_url || ""
//       })) : [],
//       isDraft: item.isDraft !== undefined ? item.isDraft : true,  // Default to true if undefined
//     };
//     return validatedItem;
//   });
// };

// // Validate full formData
// const validateFormData = (formData) => {
//   console.log("BEFORE POST FORMDATA", formData);
//   // If formData is not an array, default to an empty array
//   if (!Array.isArray(formData)) {
//     formData = [formData];
//   }
//   console.log("AFTER POST FORMDATA", formData);
//   // Map through formData and ensure each item has the necessary structure
//   return formData.map((item) => {
//     return {
//       key: item.key ? String(item.key) : "",  // Default to empty string if key is missing
//       eventName: item.eventName || "",
//       eventLocation: item.eventLocation || "",
//       eventYear: item.eventYear || "",
//       companyName: item.companyName || "",
//       companyLocation: item.companyLocation || "",
//       companyLogo: item.companyLogo || "",
//       companyLogoFileName: item.companyLogoFileName || "",
//       description: item.description || "",
//       eventTypes: Array.isArray(item.eventTypes) ? item.eventTypes : [],  // Ensure eventTypes is an array
//       industries: Array.isArray(item.industries) ? item.industries : [],  // Ensure industries is an array
//       titleName: item.titleName || "",
//       isDraft: item.isDraft !== undefined ? item.isDraft : true,  // Default to true if undefined
//       isBrandCollaboration: item.isBrandCollaboration !== undefined ? item.isBrandCollaboration : true,
//     };
//   });
// };
