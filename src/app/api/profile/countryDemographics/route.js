import { NextResponse } from "next/server";
import connectDb from "@/db/mongoose";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
      await connectDb(); // Ensure database connection
  
     const {userId} = getAuth(req)
  
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      // Fetch user details from the database
      const user = await User.findOne({ userId });
  
      if (!user || !user.instagramAccessToken || !user.instagramAccountId) {
        return NextResponse.json({ error: "Instagram details not found" }, { status: 404 });
      }
  
      const { instagramAccessToken, instagramAccountId } = user;
  
      // Fetch Country Data from Facebook Graph API
      const countryResponse = await fetch(
        `https://graph.facebook.com/v21.0/${instagramAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=country&access_token=${instagramAccessToken}`
      );
  
      const countryResult = await countryResponse.json();
  
      if (!countryResult?.data?.[0]?.total_value?.breakdowns?.[0]?.results) {
        return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
      }
  
      const insights = countryResult.data[0].total_value.breakdowns[0].results;
  
      let countryBreakdown = {};
      let totalFollowers = 0;
  
      insights.forEach(({ dimension_values, value }) => {
        const country = dimension_values[0];
  
        if (!countryBreakdown[country]) {
          countryBreakdown[country] = 0;
        }
  
        countryBreakdown[country] += value;
        totalFollowers += value;
      });
  
      // Convert country breakdown to percentage
      const formattedCountryData = Object.keys(countryBreakdown).map((country) => ({
        country,
        count: countryBreakdown[country],
        percentage: ((countryBreakdown[country] / totalFollowers) * 100).toFixed(2),
      }));
  
      return NextResponse.json({
        success: true,
        totalFollowers,
        countryDistribution: formattedCountryData,
      });
  
    } catch (error) {
      console.error("Error fetching country demographics:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }