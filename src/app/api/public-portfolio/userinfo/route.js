import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import OnboardingData from "@/models/onboarding.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    // Extract the username from the URL
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    console.log("public route ", username)
      // Check if username is provided
    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required." },
        { status: 400 }
      );
    }

    // Query the database to find the public portfolio
    const draft = await OnboardingData.findOne({ username });

    // Check if data is found
    if (!draft) {
      return NextResponse.json(
        { success: false, error: "No public portfolio found." },
        { status: 404 }
      );
    }

    // Return the public data
    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
