//api/auth/instagram/callback/route.js  

import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/db/mongoose";

const CLIENT_ID = '1068594868074995';
const CLIENT_SECRET = '7aa94560586507e6c840da8105090984';
//const REDIRECT_URI = 'https://l6r9j4st-3000.inc1.devtunnels.ms/manage-projects/pick-projects'
//const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';
const REDIRECT_URI = 'https://snatch-pi.vercel.app/manage-projects/pick-projects';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const code = req.nextUrl.searchParams.get("code");
  const { userId } = getAuth(req);

  if (!code) {
    return NextResponse.json({ error: "Authorization code not found" }, { status: 400 });
  }

  try {
    await connectDb();

    // Exchange authorization code for a short-lived access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${CLIENT_SECRET}&code=${code}`,
      { method: "GET" }
    );
    const tokenData = await tokenResponse.json();
    console.log("Short-lived token data:", tokenData);

    if (!tokenResponse.ok || tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error?.message || "Failed to fetch access token" },
        { status: 500 }
      );
    }

    const { access_token: shortLivedAccessToken } = tokenData;

    // Exchange for long-lived access token
    const longLivedTokenResponse = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&fb_exchange_token=${shortLivedAccessToken}`,
      { method: "GET" }
    );
    const longLivedTokenData = await longLivedTokenResponse.json();
    console.log("Long-lived token data:", longLivedTokenData);

    const { access_token: longLivedAccessToken } = longLivedTokenData;

    // Fetch user's Facebook Pages directly
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${longLivedAccessToken}`
    );
    // Add this right after the pagesResponse fetch
    console.log("Pages Response Status:", pagesResponse.status);
    console.log("Pages Response Headers:", Object.fromEntries(pagesResponse.headers));

    const pagesData = await pagesResponse.json();

    console.log("Raw Pages Data:", JSON.stringify(pagesData, null, 2));
    // Add error checking
if (pagesData.error) {
  console.error("Facebook API Error:", pagesData.error);
  return NextResponse.json(
    { error: `Facebook API Error: ${pagesData.error.message}` },
    { status: 500 }
  );
}
    console.log("Pages Data:", pagesData);

    if (!pagesResponse.ok || !pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json(
        { error: "No Facebook Pages found. Please ensure you have a Facebook Page connected to your Instagram Business/Creator account." },
        { status: 404 }
      );
    }

    // Find the Facebook Page with an Instagram Business Account
    let selectedPage = null;
    for (const page of pagesData.data) {
      const igAccountResponse = await fetch(
        `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${longLivedAccessToken}`
      );
      const igAccountData = await igAccountResponse.json();
      console.log(`Instagram account data for page ${page.id}:`, igAccountData);

      if (igAccountData.instagram_business_account) {
        selectedPage = {
          pageId: page.id,
          pageToken: page.access_token,
          instagramAccountId: igAccountData.instagram_business_account.id
        };
        break;
      }
    }

    if (!selectedPage) {
      return NextResponse.json(
        { error: "No Instagram Business/Creator account found connected to your Facebook Pages" },
        { status: 404 }
      );
    }

    // Save to database
    let user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    user.instagramAccessToken = selectedPage.pageToken; // Using page token for Instagram API calls
    user.instagramAccountId = selectedPage.instagramAccountId;
    await user.save();

    const insightsResponse = await fetch(
      `https://graph.facebook.com/v21.0/${selectedPage.instagramAccountId}/insights?` +
      `metric=follower_demographics&` +
      `period=lifetime&` +
      `timeframe=this_week&` +
      `breakdown=country&` +
      `metric_type=total_value&` +
      `access_token=${selectedPage.pageToken}`
    );

    const insightsData = await insightsResponse.json();
    console.log("Full Response:", insightsData);

    const demographicsMetric = insightsData.data?.find(
      item => item.name === 'follower_demographics'
    );

    if (
      demographicsMetric?.total_value?.breakdowns &&
      Array.isArray(demographicsMetric.total_value.breakdowns)
    ) {
      const breakdowns = demographicsMetric.total_value.breakdowns;

      breakdowns.forEach(entry => {
        const { dimension_keys, results } = entry;
       
        // Log to inspect the structure of the results
        console.log("Dimension Keys:", dimension_keys);
        console.log("Results:", results);
       
        // If results is an object, try to extract its proper value
        dimension_keys.forEach((key, index) => {
          const result = results[index];
         
          // If result is an object, let's log it to understand its structure
          if (typeof result === 'object') {
            console.log(`Result for ${key}:`, result);
          } else {
            console.log(`Country: ${key}, Followers: ${result}`);
          }
        });
      });
    } else {
      console.warn("Breakdown data not found in follower_demographics.");
    }

    const mediaResponse = await fetch(
      `https://graph.facebook.com/v21.0/${selectedPage.instagramAccountId}/media?` +
      `fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,thumbnail_url,username&` +
      `access_token=${selectedPage.pageToken}`
    );

    const mediaData = await mediaResponse.json();
    console.log("Instagram Media Data:", mediaData);

    if (!mediaResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Instagram media" },
        { status: 500 }
      );
    }

    // Enrich media data with carousel items
    const enrichedMediaData = await Promise.all(
      mediaData.data.map(async (mediaItem) => {
        if (mediaItem.media_type === "CAROUSEL_ALBUM") {
          const carouselResponse = await fetch(
            `https://graph.facebook.com/v21.0/${mediaItem.id}/children?` +
            `fields=id,media_type,media_url&access_token=${selectedPage.pageToken}`
          );
          const carouselData = await carouselResponse.json();

          if (carouselResponse.ok && carouselData.data) {
            return { ...mediaItem, children: carouselData.data };
          }
        }
        return mediaItem;
      })
    );

    return NextResponse.json({
      message: "Instagram Business/Creator account connected successfully",
      user,
      insights: insightsData,
      mediaData: enrichedMediaData
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
