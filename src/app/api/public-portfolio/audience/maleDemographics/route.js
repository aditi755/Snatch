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

    const user = await User.findOne({ instagramUsername: username });

    if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
      return NextResponse.json({ error: "Instagram details not found" }, { status: 404 });
    }

    const { instagramAccessToken, instagramAccountId } = user;

    const demographicsResponse = await fetch(
      `https://graph.facebook.com/v21.0/${instagramAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=age,gender&access_token=${instagramAccessToken}`
    );

    const demographicsResult = await demographicsResponse.json();

    if (!demographicsResult?.data?.[0]?.total_value?.breakdowns?.[0]?.results) {
      return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
    }

    const insights = demographicsResult.data[0].total_value.breakdowns[0].results;

    // Extract only male follower data
    let maleAgeGroups = {};
    let totalMaleFollowers = 0;

    insights.forEach(({ dimension_values, value }) => {
      const [age, gender] = dimension_values;

      if (gender === "M") {
        if (!maleAgeGroups[age]) {
          maleAgeGroups[age] = 0;
        }
        maleAgeGroups[age] += value;
        totalMaleFollowers += value;
      }
    });

    const maleAgeData = Object.keys(maleAgeGroups).map((age) => ({
      age,
      count: maleAgeGroups[age],
      percentage: ((maleAgeGroups[age] / totalMaleFollowers) * 100).toFixed(2),
    }));

    return NextResponse.json({ success: true, maleAgeData });

  } catch (error) {
    console.error("Error fetching male age demographics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
