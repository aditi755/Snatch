import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import User from "@/models/user.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Instagram username is required" }, { status: 400 });
    }

    // Find user by their Instagram username
    const user = await User.findOne({ instagramUsername: username });

    if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
      return NextResponse.json({ error: "Instagram details not found" }, { status: 404 });
    }

    const { instagramAccessToken, instagramAccountId } = user;

    const url = `https://graph.facebook.com/v18.0/${instagramAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=gender&access_token=${instagramAccessToken}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data from Graph API");

    const data = await response.json();

    const results = data?.data?.[0]?.total_value?.breakdowns?.[0]?.results;
    if (!results) {
      return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
    }

    const demographics = { male: 0, female: 0, unknown: 0 };
    let totalFollowers = 0;

    results.forEach(({ dimension_values, value }) => {
      const gender = dimension_values[0]; // "M", "F", or "U"
      if (gender === "M") demographics.male = value;
      else if (gender === "F") demographics.female = value;
      else demographics.unknown = value;
      totalFollowers += value;
    });

    const percentages = {
      male: totalFollowers ? ((demographics.male / totalFollowers) * 100).toFixed(2) : "0.00",
      female: totalFollowers ? ((demographics.female / totalFollowers) * 100).toFixed(2) : "0.00",
      unknown: totalFollowers ? ((demographics.unknown / totalFollowers) * 100).toFixed(2) : "0.00",
    };

    return NextResponse.json({ demographics: percentages }, { status: 200 });

  } catch (error) {
    console.error("Error fetching gender demographics:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
