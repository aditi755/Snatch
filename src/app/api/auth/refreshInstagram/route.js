import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";


//now we just need to delete the localstorage data to let UI know that localstorage is emepty so again getmediafromdatabaase and now our db contains fresh media cuz of this endpoint in 2 days so that things appear in the UI 
 export const dynamic = "force-dynamic";
 
export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { apiKey } = body;

    console.log("apikey", apiKey);
    console.log("body", body);
    console.log("api key process env", process.env.CRON_JOB_API_KEY);
    // Validate API key
    if (apiKey !== process.env.CRON_JOB_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Find all users with a valid Instagram access token
    const users = await User.find({ instagramAccessToken: { $exists: true, $ne: null } });
    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users found with valid Instagram access tokens." },
        { status: 404 }
      );
    }

    // Loop through each user and refresh their posts
    for (const user of users) {
      const userId = user.userId;
      const accessToken = user.instagramAccessToken;

      // Fetch drafts for the specific user
      const drafts = await ProjectDraft.find({ userId, instagramSelected: { $exists: true, $ne: [] } });
      if (drafts.length === 0) {
        console.log(`No drafts found for user ${userId}.`);
        continue;
      }

      // Refresh Instagram media URLs for each draft
      for (const draft of drafts) {
        for (let i = 0; i < draft.instagramSelected.length; i++) {
          const instaItem = draft.instagramSelected[i];
          const mediaId = instaItem.mediaId;

          if (!mediaId) {
            console.error("Media ID is missing for item:", instaItem);
            continue;
          }

          try {
            // Fetch media details
            const mediaUrl = `https://graph.facebook.com/v17.0/${mediaId}?fields=media_type,media_url&access_token=${accessToken}`;
            const mediaResponse = await axios.get(mediaUrl);
            const mediaData = mediaResponse.data;

            instaItem.mediaLink = mediaData.media_url;

            // Fetch children for CAROUSEL_ALBUM
            if (mediaData.media_type === "CAROUSEL_ALBUM") {
              try {
                const childrenUrl = `https://graph.facebook.com/v17.0/${mediaId}/children?fields=id,media_type,media_url&access_token=${accessToken}`;
                const childrenResponse = await axios.get(childrenUrl);
                const childrenData = childrenResponse.data.data || [];

                instaItem.children = childrenData.map((child) => ({
                  id: child.id,
                  media_type: child.media_type,
                  media_url: child.media_url,
                }));
              } catch (childErr) {
                console.error(`Failed to fetch child media for ${mediaId}:`, childErr.message);
              }
            }
          } catch (err) {
            console.error(`Failed to fetch media for ${mediaId}:`, err.message);
          }
        }

        // Update the draft
        await ProjectDraft.findByIdAndUpdate(
          draft._id,
          { $set: { instagramSelected: draft.instagramSelected } },
          { new: true }
        );
      }

      console.log(`Instagram media URLs refreshed for user ${userId}.`);
    }

    return NextResponse.json({
      message: "Instagram media URLs refreshed for all users successfully.",
    });
  } catch (error) {
    console.error("Error refreshing Instagram media URLs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//Failed to fetch media for 18234429007088467: Request failed with status code 400  --> happening because im logged into jaini account as of now so media id is not matching (dont worry ) 
