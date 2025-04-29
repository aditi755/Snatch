import { NextResponse } from "next/server";
import User from "@/models/user.model";
import connectDb from "@/db/mongoose";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const instagramUsername = url.searchParams.get("username");
    const postId = url.searchParams.get("postId");

    if (!instagramUsername || !postId) {
      return NextResponse.json(
        { success: false, error: "Username and Post ID are required." },
        { status: 400 }
      );
    }

    // Find user based on username
    const user = await User.findOne({ instagramUsername });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found or missing Instagram Access Token." },
        { status: 404 }
      );
    }

    const { instagramAccessToken } = user;

    // Fetch Instagram media insights
    const insightsUrl = `https://graph.facebook.com/v17.0/${postId}/insights?metric=likes,comments,saved,shares&access_token=${instagramAccessToken}`;

    const response = await fetch(insightsUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching Instagram insights:", errorData);
      return NextResponse.json(
        { success: false, error: "Failed to fetch media insights.", details: errorData },
        { status: response.status }
      );
    }

    const insightsData = await response.json();

    return NextResponse.json({ success: true, insights: insightsData }, { status: 200 });

  } catch (error) {
    console.error("Error fetching media insights:", error);
    return NextResponse.json(
      { success: false, error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}
