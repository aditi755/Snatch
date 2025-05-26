import { NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import connectDB from '@/db/mongoose';
import User from '@/models/user.model';

export async function GET(req) {
  try {
    // 1. Get current user from Clerk
    const {userId} = await getAuth(req);
    if (!userId) {
      return NextResponse.json({
        count: 0,
        error: 'User not authenticated'
      }, { status: 401 });
    }

    // 2. Connect to database
    await connectDB();

    // 3. Find user in our database using Clerk userId
    const dbUser = await User.findOne({ userId });
    if (!dbUser || !dbUser.instagramAccessToken || !dbUser.instagramAccountId) {
      return NextResponse.json({
        count: 0,
        error: 'Instagram not connected'
      }, { status: 404 });
    }

    // 4. Use the Instagram Graph API to fetch follower count
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${dbUser.instagramAccountId}?fields=followers_count&access_token=${dbUser.instagramAccessToken}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Instagram API Error:', errorData);
      throw new Error(`Failed to fetch from Instagram API: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    return NextResponse.json({
      count: data.followers_count || 0,
      connected: true
    });

  } catch (error) {
    console.error('Error fetching Instagram followers:', error);
    return NextResponse.json({
      count: 0,
      error: 'Failed to fetch follower count',
      connected: false
    }, { status: 500 });
  }
}