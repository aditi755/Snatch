import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/db/mongoose";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    console.log("Checking token and user ID from the database...");
    await connectDb();

    // Authenticate the user using Clerk
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { connected: false, error: "User not present! Please sign up first." },
        { status: 401 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json(
        { connected: false, error: "User not found in the database." },
        { status: 404 }
      );
    }

    // Retrieve Instagram details from the user record
    const { instagramAccessToken, instagramAccountId } = user;

    if (!instagramAccessToken || !instagramAccountId) {
      return NextResponse.json(
        { error: "Instagram access token or account ID is missing." },
        { status: 400 }
      );
    }

    // Fetch Instagram Media
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${instagramAccessToken}`
    );

    const mediaData = await mediaResponse.json();

    if (!mediaResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Instagram user media." },
        { status: 500 }
      );
    }

    // Fetch children for CAROUSEL_ALBUM media types
    const enrichedMediaData = await Promise.all(
      mediaData.data.map(async (mediaItem) => {
        if (mediaItem.media_type === "CAROUSEL_ALBUM") {
          const carouselResponse = await fetch(
            `https://graph.facebook.com/v17.0/${mediaItem.id}/children?fields=id,media_type,media_url&access_token=${instagramAccessToken}`
          );

          const carouselData = await carouselResponse.json();

          if (carouselResponse.ok && carouselData.data) {
            return { ...mediaItem, children: carouselData.data };
          }
        }
        return mediaItem;
      })
    );

    console.log("enrichedMediaData:", enrichedMediaData);

    // Respond with the enriched media data
    return NextResponse.json({ mediaData: enrichedMediaData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching media data:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
