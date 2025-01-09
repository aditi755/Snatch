import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
const CLIENT_ID = '1068594868074995';
const CLIENT_SECRET = '7aa94560586507e6c840da8105090984';
const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';

// Enforce dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const code = req.nextUrl.searchParams.get('code');
 const {userId} = getAuth(req);
 console.log("userid server", userId) //clerk user id - unique, store in db and use to associate info and query userid server user_2qJ1BL0VU0eFlpaNpMhjwBeQitV

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  try {
    // Exchange authorization code for an access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&client_secret=${CLIENT_SECRET}&code=${code}`,
      { method: 'GET' }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      return NextResponse.json({ error: tokenData.error?.message || 'Failed to fetch access token' }, { status: 500 });
    }

    const { access_token } = tokenData;

    // Fetch Instagram Business Account details
    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v17.0/me/accounts?access_token=${access_token}`
    );

    const pagesData = await igAccountResponse.json();

    if (!igAccountResponse.ok || !pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json({ error: 'No connected Facebook Pages found' }, { status: 500 });
    }

    const page = pagesData.data[0];
    const igAccountIdResponse = await fetch(
      `https://graph.facebook.com/v17.0/${page.id}?fields=instagram_business_account&access_token=${access_token}`
    );

    const igAccountIdData = await igAccountIdResponse.json();

    if (!igAccountIdResponse.ok || !igAccountIdData.instagram_business_account) {
      return NextResponse.json({ error: 'No connected Instagram Business Account found' }, { status: 500 });
    }

    const instagramAccountId = igAccountIdData.instagram_business_account.id;

    // Fetch Instagram Media
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${access_token}`
    );

    const mediaData = await mediaResponse.json();

    if (!mediaResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch Instagram user media' }, { status: 500 });
    }

    // Fetch children for CAROUSEL_ALBUM media types
    const enrichedMediaData = await Promise.all(
      mediaData.data.map(async (mediaItem) => {
        if (mediaItem.media_type === 'CAROUSEL_ALBUM') {
          const carouselResponse = await fetch(
            `https://graph.facebook.com/v17.0/${mediaItem.id}/children?fields=id,media_type,media_url&access_token=${access_token}`
          );

          const carouselData = await carouselResponse.json();

          if (carouselResponse.ok && carouselData.data) {
            return { ...mediaItem, children: carouselData.data };
          }
        }
        return mediaItem; // Return non-carousel items as-is
      })
    );

    return NextResponse.json({ mediaData: enrichedMediaData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
