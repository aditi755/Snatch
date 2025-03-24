import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/db/mongoose";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // Get authenticated user ID from Clerk
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: User ID is missing" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectDb();

    // Find the user in the database
    const user = await User.findOne({ userId });

    if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
      return NextResponse.json(
        { error: "User or Instagram credentials not found" },
        { status: 404 }
      );
    }

    const { instagramAccessToken, instagramAccountId } = user;

    // Instagram Graph API endpoint to fetch followers, posts, and reach
    const url = `https://graph.facebook.com/v19.0/${instagramAccountId}?fields=followers_count,media_count,insights.metric(reach).period(days_28)&access_token=${instagramAccessToken}`;


    // Fetch data from Instagram Graph API
    const response = await fetch(url);

    // Handle errors if the request fails
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Failed to fetch Instagram data", details: errorData },
        { status: response.status }
      );
    }

    // Parse JSON response
    const data = await response.json();

    // Extract reach value safely
    const reachValue =
      data?.insights?.data?.find((item) => item.name === "reach")?.values[0]
        ?.value || 0;

    // Return required data
    return NextResponse.json(
      {
        followers_count: data.followers_count || 0,
        media_count: data.media_count || 0,
        reach: reachValue,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}
