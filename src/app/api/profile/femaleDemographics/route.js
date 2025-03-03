import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
export async function GET(req) {
  try {
    await connectDb(); // Ensure DB is connected

    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch user from database
    const user = await User.findOne({ userId });

    if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
      return NextResponse.json({ error: "Instagram details not found" }, { status: 404 });
    }

    const { instagramAccessToken, instagramAccountId } = user;

    // Fetch Age & Gender Data from Facebook Graph API
    const demographicsResponse = await fetch(
      `https://graph.facebook.com/v21.0/${instagramAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=age,gender&access_token=${instagramAccessToken}`
    );

    const demographicsResult = await demographicsResponse.json();

    if (!demographicsResult?.data?.[0]?.total_value?.breakdowns?.[0]?.results) {
      return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
    }

    const insights = demographicsResult.data[0].total_value.breakdowns[0].results;

    // Process data for male followers only
    let femaleAgeGroups = {};
    let totalFemaleFollowers = 0;

    insights.forEach(({ dimension_values, value }) => {
      const [age, gender] = dimension_values;

      if (gender === "F") {
        if (!femaleAgeGroups[age]) {
          femaleAgeGroups[age] = 0;
        }
        femaleAgeGroups[age] += value;
        totalFemaleFollowers += value;
      }
    });

    // Convert to percentage
    const femaleAgeData = Object.keys(femaleAgeGroups).map((age) => ({
      age,
      count: femaleAgeGroups[age],
      percentage: ((femaleAgeGroups[age] / totalFemaleFollowers) * 100).toFixed(2), // Ensure sum is 100%
    }));

    console.log("femaleAgeData", femaleAgeData)

    return NextResponse.json({ success: true, femaleAgeData });

  } catch (error) {
    console.error("Error fetching demographics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
