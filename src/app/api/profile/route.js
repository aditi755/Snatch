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
      return NextResponse.json({ success: false, error: "User ID is required." }, { status: 400 });
    }

    const { section, questions } = await req.json();
    if (!section || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Find the user's questionnaire
    let userQuestionnaire = await Questionnaire.findOne({ userId });

    if (!userQuestionnaire) {
      // Create a new document if none exists
      userQuestionnaire = new Questionnaire({
        userId,
        sections: [{ section, questions }], // Save the section and questions
      });
    } else {
      // Ensure `sections` is initialized as an array
      if (!userQuestionnaire.sections) {
        userQuestionnaire.sections = [];
      }

      // Check if the section exists
      const sectionIndex = userQuestionnaire.sections.findIndex((s) => s.section === section);

      if (sectionIndex !== -1) {
        // Section exists, update or add questions
        const existingSection = userQuestionnaire.sections[sectionIndex];

        questions.forEach((newQuestion) => {
          // Check if the question already exists in the section
          const questionIndex = existingSection.questions.findIndex(
            (q) => q.question === newQuestion.question
          );

          if (questionIndex !== -1) {
            // Update the existing question
            existingSection.questions[questionIndex] = {
              ...existingSection.questions[questionIndex],
              ...newQuestion, // Update with new data
            };
          } else {
            // Add new question to the section
            existingSection.questions.push(newQuestion);
          }
        });
      } else {
        // Add new section if not found
        userQuestionnaire.sections.push({ section, questions });
      }
    }

    // Save the updated questionnaire
    await userQuestionnaire.save();

    return NextResponse.json(
      {
        message: "Questionnaire saved successfully!",
        userQuestionnaire, // Return the saved document for debugging
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving questionnaire:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    await connectDb();
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    const questionnaires = await Questionnaire.find({ userId });

    if (!questionnaires || questionnaires.length === 0) {
      return NextResponse.json(
        { error: "No sections found" },
        { status: 404 }
      );
    }

    // const sections = questionnaires.map((q) => q.section);

    return NextResponse.json({ questionnaires }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving sections:", error);
    return NextResponse.json({ error: "Failed to retrieve sections" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDb();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const { section, questionId } = await req.json();
    if (!section || !questionId) {
      return NextResponse.json({ error: "Section and questionId are required." }, { status: 400 });
    }

    const questionnaire = await Questionnaire.findOne({ userId });
    if (!questionnaire) {
      return NextResponse.json({ error: "Questionnaire not found." }, { status: 404 });
    }

    const sectionData = questionnaire.sections.find((s) => s.section === section);
    if (!sectionData) {
      return NextResponse.json({ error: "Section not found." }, { status: 404 });
    }

    const questionIndex = sectionData.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    // Remove the question
    sectionData.questions.splice(questionIndex, 1);
    await questionnaire.save();

    return NextResponse.json({ message: "Question deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}

