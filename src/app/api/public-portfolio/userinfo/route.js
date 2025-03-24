import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import OnboardingData from "@/models/onboarding.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    // Extract params from URL
    const url = new URL(req.url);
    const username = url.searchParams.get("username"); // Check for username in URL
    const { userId } = getAuth(req); // Authenticated user (optional)

    let query = {};
    if (userId) {
      query = { userId }; // Authenticated user
    } else if (username) {
      query = { username }; // Public user by username
    } else {
      return NextResponse.json(
        { success: false, error: "No identifier provided." },
        { status: 400 }
      );
    }

    const draft = await OnboardingData.findOne(query);
    if (!draft) {
      return NextResponse.json(
        { success: false, error: "No data found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
