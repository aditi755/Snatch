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
  
      // Fetch city Data from Facebook Graph API
      const cityResponse = await fetch(
        `https://graph.facebook.com/v21.0/${instagramAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=city&access_token=${instagramAccessToken}`
      );
  
      const cityResult = await cityResponse.json();
  
      if (!cityResult?.data?.[0]?.total_value?.breakdowns?.[0]?.results) {
        return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
      }
  
      const insights = cityResult.data[0].total_value.breakdowns[0].results;
  
      let cityBreakdown = {};
      let totalFollowers = 0;
  
      insights.forEach(({ dimension_values, value }) => {
        const city = dimension_values[0];
  
        if (!cityBreakdown[city]) {
          cityBreakdown[city] = 0;
        }
  
        cityBreakdown[city] += value;
        totalFollowers += value;
      });
  
      // Convert city breakdown to percentage
      const formattedCityData = Object.keys(cityBreakdown).map((city) => ({
        city,
        count: cityBreakdown[city],
        percentage: ((cityBreakdown[city] / totalFollowers) * 100).toFixed(2),
      }));
  
      return NextResponse.json({
        success: true,
        totalFollowers,
        cityDistribution: formattedCityData,
      });
  
    } catch (error) {
      console.error("Error fetching city demographics:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }