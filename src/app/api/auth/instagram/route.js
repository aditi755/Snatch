//api/auth/instagram/route.js  use "use server"  
import { NextResponse } from 'next/server';

const CLIENT_ID = '1068594868074995';
//const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';
const REDIRECT_URI = 'https://snatch-pi.vercel.app/manage-projects/pick-projects'
const SCOPES = [
  'instagram_basic',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
  'business_management'
].join(',');

export async function GET() {
    //  const instagramAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    //   REDIRECT_URI
    // )}&response_type=code&scope=${SCOPES}`; 
    const instagramAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?
  client_id=${CLIENT_ID}&
  redirect_uri=${encodeURIComponent(REDIRECT_URI)}&
  auth_type=reauthorize& 
  &response_type=code&scope=${SCOPES}`;
  
    return NextResponse.json({ url: instagramAuthUrl });
  }
