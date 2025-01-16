import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/db/mongoose";

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const { mediaId } = await req.json(); // Extract mediaId from the request body
    
        if (!userId || !mediaId) {
          return NextResponse.json(
            { error: 'User ID or Media ID is missing' },
            { status: 400 }
          );
        }
  
      // Find the user in the database
      const user = await User.findOne({ userId });
  
      if (!user || !user.instagramAccessToken) {
        return NextResponse.json(
          { error: "User access token not found in the database." },
          { status: 404 }
        );
      }
  
      const { instagramAccessToken } = user;

      // Fetch insights for the provided media ID
      const insightsUrl = `https://graph.facebook.com/v17.0/${mediaId}/insights?metric=likes,comments,saved,shares&access_token=${instagramAccessToken}`;
      const response = await fetch(insightsUrl);
      console.log("resposne from insights api", response)
  
      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: "Failed to fetch media insights.", details: errorData },
          { status: response.status }
        );
      }
  
      const insightsData = await response.json();
      console.log("Insights data: from api", insightsData);
  
      // Send insights data back to the client
      return NextResponse.json({ insights: insightsData }, { status: 200 });
    } catch (error) {
      console.error("Error in fetching media insights:", error);
      return NextResponse.json(
        { error: "An error occurred while processing your request." },
        { status: 500 }
      );
    }
  }