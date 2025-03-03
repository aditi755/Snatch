import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb(); 

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch user from the database
    const user = await User.findOne({ userId });

    if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
      return NextResponse.json({ error: "Instagram details not found" }, { status: 404 });
    }

    const { instagramAccessToken, instagramAccountId } = user;

    // Corrected API URL
    const url = `https://graph.facebook.com/v18.0/${instagramAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=gender&access_token=${instagramAccessToken}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();

    // Ensure response has valid structure
    const results = data?.data?.[0]?.total_value?.breakdowns?.[0]?.results;
    if (!results) {
      return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
    }

    // Extract gender-based values
    let demographics = { male: 0, female: 0, unknown: 0 };
    let totalFollowers = 0;

    results.forEach(({ dimension_values, value }) => {
      const gender = dimension_values[0]; // "M", "F", or "U"
      if (gender === "M") demographics.male = value;
      else if (gender === "F") demographics.female = value;
      else demographics.unknown = value;
      totalFollowers += value;
    });

    // Convert to percentages
    const percentages = {
      male: totalFollowers ? ((demographics.male / totalFollowers) * 100).toFixed(2) : 0,
      female: totalFollowers ? ((demographics.female / totalFollowers) * 100).toFixed(2) : 0,
      unknown: totalFollowers ? ((demographics.unknown / totalFollowers) * 100).toFixed(2) : 0,
    };

    return NextResponse.json({ demographics: percentages }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
