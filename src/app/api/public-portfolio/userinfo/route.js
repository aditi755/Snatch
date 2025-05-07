//app/api/public-portfolio/[userinfo]/route.js
import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import OnboardingData from "@/models/onboarding.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const userId = url.searchParams.get("userId");

    // If neither username nor userId is provided
    if (!username && !userId) {
      return NextResponse.json(
        { success: false, error: "Either username or userId is required." },
        { status: 400 }
      );
    }

    // Query the database based on available parameter
    const query = userId ? { userId } : { username };
    const draft = await OnboardingData.findOne(query);

    // Check if data is found
    if (!draft) {
      return NextResponse.json(
        { success: false, error: "No portfolio found." },
        { status: 404 }
      );
    }

    // Return the data
    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
