import { NextResponse } from 'next/server';

const CLIENT_ID = '1068594868074995';
const CLIENT_SECRET = 'faad8ab62a7f87122cbbbe167b1d81e3';
const REDIRECT_URI = 'https://ig-api-indol.vercel.app/api/auth/instagram/callback';

// export async function GET(request) {
//   const url = new URL(request.url);
//   const code = url.searchParams.get('code');

//   console.log('server facebook code', code);

//   if (!code) {
//     return NextResponse.json({ success: false, message: 'Authorization code not found' }, { status: 400 });
//   }

//   // Exchange the code for an access token
//   const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: new URLSearchParams({
//       client_id: INSTAGRAM_CLIENT_ID,
//       client_secret: INSTAGRAM_CLIENT_SECRET,
//       grant_type: 'authorization_code',
//       redirect_uri: REDIRECT_URI,
//       code,
//     }),
//   });

//   const tokenData = await tokenResponse.json();

//   if (!tokenData.access_token) {
//     return NextResponse.json({ success: false, message: 'Failed to exchange code for access token' }, { status: 400 });
//   }

//   return NextResponse.json({ success: true, accessToken: tokenData.access_token, user: tokenData.user });
// }

export async function POST(request) {
  const { code } = await request.json();

  console.log("code form facebook SERVER", code)

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }

  const tokenUrl = `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&client_secret=${CLIENT_SECRET}&code=${code}`;

  try {
    const tokenResponse = await fetch(tokenUrl, { method: 'GET' });
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error.message);
    }

    // Store tokenData.access_token securely in your database with the user's info.
    return NextResponse.json({ accessToken: tokenData.access_token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


