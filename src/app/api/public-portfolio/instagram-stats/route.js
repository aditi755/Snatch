import { NextResponse } from "next/server";
import User from "@/models/user.model";
import connectDb from "@/db/mongoose";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    // Parse the URL and get the query parameter
    const url = new URL(req.url);
    const instagramUsername = url.searchParams.get("username");

    if (!instagramUsername) {
      return NextResponse.json(
        { error: "Bad Request: 'username' query parameter is required." },
        { status: 400 }
      );
    }

    // Find user by instagramUsername
    const user = await User.findOne({ instagramUsername });

    if (!user) {
      return NextResponse.json(
        { error: "User not found for the provided Instagram username." },
        { status: 404 }
      );
    }

    if (!user.instagramAccessToken || !user.instagramAccountId) {
      return NextResponse.json(
        { error: "Instagram account details are missing for this user." },
        { status: 404 }
      );
    }

    const { instagramAccessToken, instagramAccountId } = user;

    // Instagram Graph API URL
    const apiUrl = `https://graph.facebook.com/v19.0/${instagramAccountId}?fields=followers_count,media_count,insights.metric(reach).period(days_28)&access_token=${instagramAccessToken}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Failed to fetch Instagram data", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    const reachValue =
      data?.insights?.data?.find((item) => item.name === "reach")?.values[0]
        ?.value || 0;

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
      { error: "Internal Server Error: Unable to fetch Instagram data." },
      { status: 500 }
    );
  }
}
