import { NextResponse } from "next/server";
import User from "@/models/user.model"; 
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/db/mongoose";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    console.log("checking ig connection")
    await connectDb(); // Ensure the database connection
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ connected: false, error: "User not authenticated! Please signup first" }, { status: 401 });
    }

    // Find the user in the database
    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json({ connected: false, error: "User not found in the database" }, { status: 404 });
    }

    // Check if Instagram details are present
    const isConnected = !!(user.instagramAccessToken && user.instagramAccountId);

    return NextResponse.json({ connected: isConnected });
  } catch (error) {
    console.error("Error checking Instagram connection:", error);
    return NextResponse.json(
      { connected: false, error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
