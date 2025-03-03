import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { get } from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
      await connectDb(); // Ensure DB is connected
  
      const {userId} = getAuth(req);
  
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      // Fetch user from database
      const user = await User.findOne({ userId });
  
      if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
        return NextResponse.json({ error: "Instagram details not found" }, { status: 404 });
      }
  
      const { instagramAccessToken, instagramAccountId } = user;
  
      // Fetch Age Data from Facebook Graph API
      const demographicsResponse = await fetch(
        `https://graph.facebook.com/v21.0/${instagramAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=age&access_token=${instagramAccessToken}`
      );
  
      const demographicsResult = await demographicsResponse.json();

      console.log("demographicsresult", demographicsResponse)
  
      if (!demographicsResult?.data?.[0]?.total_value?.breakdowns?.[0]?.results) {
        return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
      }
  
      const insights = demographicsResult.data[0].total_value.breakdowns[0].results;
  
      let ageGroups = {};
      let totalFollowers = 0;
  
      insights.forEach(({ dimension_values, value }) => {
        const age = dimension_values[0];
  
        if (!ageGroups[age]) {
          ageGroups[age] = 0;
        }
  
        ageGroups[age] += value;
        totalFollowers += value;
      });
  
      // Convert to percentage ensuring total is 100%
      const formattedAgeData = Object.keys(ageGroups).map((age) => ({
        age,
        count: ageGroups[age],
        percentage: ((ageGroups[age] / totalFollowers) * 100).toFixed(2),
      }));

      console.log("formateedAgeData", formattedAgeData)
  
      return NextResponse.json({
        success: true,
        totalFollowers,
        ageDistribution: formattedAgeData,
      });
  
    } catch (error) {
      console.error("Error fetching demographics:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }