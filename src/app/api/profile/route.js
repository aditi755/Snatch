import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import Questionnaire from "@/models/question.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDb();
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }
    
    const { section, questions } = await req.json();
    console.log("section question api", section, questions)

    if (!section || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const newQuestionnaire = new Questionnaire({
      userId,
      section,
      questions,
    });

    await newQuestionnaire.save();

    return NextResponse.json({ message: "Questionnaire saved successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving questionnaire:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
