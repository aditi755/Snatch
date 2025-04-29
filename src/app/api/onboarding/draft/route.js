import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import OnboardingData from "@/models/onboarding.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    console.log("runnign the onbaoridng auto save")
    await connectDb();
    const { userId } = getAuth(req);

    const draft = await OnboardingData.findOne({ 
      userId,
      //isDraft: true 
    });

    return NextResponse.json({ 
      success: true, 
      data: draft 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log("runnign the onbaoridng auto save")

    await connectDb();
    const { userId } = getAuth(req);

    const { _id, ...updateData } = await req.json(); // exclude _id
    //console.log("updateData", updateData); // log the updateData

    //also nned to update user model for igusername = username edit it on furether edits by user as well
    const draft = await OnboardingData.findOneAndUpdate(
      { userId },
      { ...updateData },
      { upsert: true, new: true }
    );


    return NextResponse.json({ 
      success: true, 
      data: draft 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}


 //const data = await req.json();

    // const draft = await OnboardingData.findOneAndUpdate(
    //   { userId, isDraft: true },
    //   { ...data, isDraft: true },
    //   { upsert: true, new: true }
    // );