import { NextResponse } from 'next/server';

const CLIENT_ID = '1068594868074995';
const REDIRECT_URI = 'https://ig-api-indol.vercel.app/api/auth/instagram/callback';
const SCOPES = [
  'instagram_basic',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
].join(',');

// export async function GET() {
//   const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
//     REDIRECT_URI
//   )}&response_type=code&scope=${SCOPES}`;

//   return NextResponse.json({ url: instagramAuthUrl });
// }


export async function GET() {
    const instagramAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=${SCOPES}`;
  
    return NextResponse.json({ url: instagramAuthUrl });
  }
