
import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import User from "@/models/user.model";
import CollaborationRequest from "@/models/collaborationRequest.model"; // ✅ import
import { clerkClient } from "@clerk/clerk-sdk-node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export async function POST(req) {
  try {
    const body = await req.json();
    const { brandName, role, email, bio, discussion, influencerUsername } = body;

    await connectDB();

    // Find influencer
    const influencer = await User.findOne({ instagramUsername: influencerUsername });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const influencerUserId = influencer.userId;

    // Step 1: Check for existing request
    const existingRequest = await CollaborationRequest.findOne({
      email,
      influencerUserId,
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You've already contacted this influencer." },
        { status: 400 }
      );
    }

    // Step 2: Get influencer email from Clerk
    const clerkUser = await clerkClient.users.getUser(influencerUserId);
    const influencerEmail = clerkUser.emailAddresses[0].emailAddress;

    // Step 3: Send email
    const emailResponse = await resend.emails.send({
      from: "Snatch <no-reply@snatchsocial.com>",
      to: influencerEmail, // influencerEmail add after custom domain setup,
      subject: `New Collaboration Request from ${brandName}`,
      html: `
        <h2>New Request from ${brandName}</h2>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Bio:</strong> ${bio}</p>
        <p><strong>Discussion:</strong> ${discussion}</p>
      `,
    });

    console.log("Email resposne", emailResponse);

    // Step 4: Save new request to DB
    await CollaborationRequest.create({
      brandName,
      email,
      role,
      bio,
      discussion,
      influencerUsername,
      influencerUserId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in send-request API:", error);

    if (error.code === 11000) {
      // Duplicate key error (from unique index)
      return NextResponse.json(
        { error: "You've already contacted this influencer." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
