// /app/api/influencer-requests/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import User from "@/models/user.model";
import CollaborationRequest from "@/models/collaborationRequest.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const influencerUsername = searchParams.get("username");

    if (!influencerUsername) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Get userId of influencer from username
    const user = await User.findOne({ instagramUsername: influencerUsername });

    if (!user) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const totalRequests = await CollaborationRequest.countDocuments({
      influencerUserId: user.userId,
    });

    return NextResponse.json({ totalRequests });
  } catch (error) {
    console.error("Error fetching influencer requests count:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
