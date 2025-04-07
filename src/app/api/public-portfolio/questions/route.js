import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import Questionnaire from "@/models/question.model";
import OnboardingData from "@/models/onboarding.model"; // adjust path as needed

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required." },
        { status: 400 }
      );
    }

    // Step 1: Get userId from onboarding data
    const onboardingData = await OnboardingData.findOne({ username });

    if (!onboardingData) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    const userId = onboardingData.userId;

    // Step 2: Fetch questionnaire by userId
    const questionnaires = await Questionnaire.find({ userId });

    if (!questionnaires || questionnaires.length === 0) {
      return NextResponse.json(
        { success: false, error: "No questionnaire data found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, questionnaires }, { status: 200 });
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error." },
      { status: 500 }
    );
  }
}
