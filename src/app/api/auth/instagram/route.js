//api/auth/instagram/route.js  
import { NextResponse } from 'next/server';


const CLIENT_ID = '1068594868074995';
//const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';
const REDIRECT_URI = 'https://snatch-pi.vercel.app/manage-projects/pick-projects'


const SCOPES = [
  'instagram_basic',                // Basic instagram account info
  'instagram_manage_insights',      // Access to account insights
  'pages_show_list',               // Access to page list
  'pages_read_engagement',         // Read page engagement metrics
  'public_profile'                 // Basic Facebook profile info
].join(',');


export async function GET() {
    const instagramAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?` +
      `client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${SCOPES}` +
      `&auth_type=rerequest`;      // Always show consent dialog
 
    return NextResponse.json({ url: instagramAuthUrl });
}
