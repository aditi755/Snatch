//jai code :
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import connectDb from "@/db/mongoose";

const CLIENT_ID = '1068594868074995';
const CLIENT_SECRET = '7aa94560586507e6c840da8105090984';
//const REDIRECT_URI = 'https://snatch-pi.vercel.app/manage-projects/pick-projects'
const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';

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
      `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${CLIENT_SECRET}&code=${code}`,
      { method: "GET" }
    );
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error?.message || "Failed to fetch access token" },
        { status: 500 }
      );
    }

    const { access_token: shortLivedAccessToken } = tokenData;

    // Exchange the short-lived access token for a long-lived access token
    const longLivedTokenResponse = await fetch(
      `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&fb_exchange_token=${shortLivedAccessToken}`,
      { method: "GET" }
    );
    const longLivedTokenData = await longLivedTokenResponse.json();

    if (!longLivedTokenResponse.ok || longLivedTokenData.error) {
      return NextResponse.json(
        { error: longLivedTokenData.error?.message || "Failed to fetch long-lived access token" },
        { status: 500 }
      );
    }

    const { access_token: longLivedAccessToken } = longLivedTokenData;
    console.log("Long-lived access token:", longLivedAccessToken);

    // Fetch connected Facebook Pages
    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v17.0/me/accounts?access_token=${longLivedAccessToken}`
    );
    const pagesData = await igAccountResponse.json();

    console.log("pagesData of my fb account", pagesData);

    if (!igAccountResponse.ok || !pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json({ error: "No connected Facebook Pages found" }, { status: 500 });
    }

    // Find the first Facebook Page that has an Instagram Business Account
    let selectedPage = null;
    for (const page of pagesData.data) {
      const igAccountIdResponse = await fetch(
        `https://graph.facebook.com/v17.0/${page.id}?fields=instagram_business_account&access_token=${longLivedAccessToken}`
      );
      const igAccountIdData = await igAccountIdResponse.json();

      console.log("igAccountIdData", igAccountIdData);

      if (igAccountIdData.instagram_business_account) {
        selectedPage = {
          id: page.id,
          access_token: page.access_token,
          instagram_account_id: igAccountIdData.instagram_business_account.id
        };
        break; // Stop searching after finding the correct page
      }
    }

    if (!selectedPage) {
      return NextResponse.json(
        { error: "No connected Instagram Business Account found" },
        { status: 500 }
      );
    }

    console.log("Selected Page with IG Business Account:", selectedPage);

    // Check if the user exists in the database
    let user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in the database. Please ensure the account is created before connecting Instagram." },
        { status: 404 }
      );
    }

    // Update user with Instagram and Facebook details
    user.instagramAccessToken = longLivedAccessToken;
    user.instagramAccountId = selectedPage.instagram_account_id;
    await user.save();

    console.log("User is saved in DB:", user);

    // Fetch Instagram Media
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v17.0/${selectedPage.instagram_account_id}/media?fields=id,media_type,media_url,permalink,caption&access_token=${longLivedAccessToken}`
    );
    const mediaData = await mediaResponse.json();

    if (!mediaResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch Instagram user media" }, { status: 500 });
    }

    // Fetch children for CAROUSEL_ALBUM media types
    const enrichedMediaData = await Promise.all(
      mediaData.data.map(async (mediaItem) => {
        if (mediaItem.media_type === "CAROUSEL_ALBUM") {
          const carouselResponse = await fetch(
            `https://graph.facebook.com/v17.0/${mediaItem.id}/children?fields=id,media_type,media_url&access_token=${longLivedAccessToken}`
          );
          const carouselData = await carouselResponse.json();

          if (carouselResponse.ok && carouselData.data) {
            return { ...mediaItem, children: carouselData.data };
          }
        }
        return mediaItem;
      })
    );

    return NextResponse.json(
      {
        message: "Your Instagram account has been successfully connected",
        user,
        mediaData: enrichedMediaData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}











