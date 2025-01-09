//api/auth/instagram/route.js
import { NextResponse } from 'next/server';

const CLIENT_ID = '1068594868074995';
//const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/profile';
const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';
const SCOPES = [
  'instagram_basic',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
].join(',');

export async function GET() {
    const instagramAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=${SCOPES}`;
  
    return NextResponse.json({ url: instagramAuthUrl });
  }
