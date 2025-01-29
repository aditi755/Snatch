// import { NextResponse } from 'next/server';
// import { getAuth } from '@clerk/nextjs/server';
// import connectDb from '@/db/mongoose';
// import User from '@/models/user.model';
// const CLIENT_ID = '1068594868074995';
// const CLIENT_SECRET = '7aa94560586507e6c840da8105090984';
// const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';

// // Enforce dynamic rendering
// export const dynamic = 'force-dynamic';

// export async function GET(req) {
//   const code = req.nextUrl.searchParams.get('code');
//  const {userId} = getAuth(req);
//  console.log("userid server", userId) //clerk user id - unique, store in db and use to associate info and query userid server user_2qJ1BL0VU0eFlpaNpMhjwBeQitV

//   if (!code) {
//     return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
//   }

//   try {
//     await connectDb(); // Ensure DB is connected

//     // Exchange authorization code for an access token
//     const tokenResponse = await fetch(
//       `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
//         REDIRECT_URI
//       )}&client_secret=${CLIENT_SECRET}&code=${code}`,
//       { method: 'GET' }
//     );

//     const tokenData = await tokenResponse.json();

//     if (!tokenResponse.ok || tokenData.error) {
//       return NextResponse.json({ error: tokenData.error?.message || 'Failed to fetch access token' }, { status: 500 });
//     }

//     const { access_token } = tokenData;

//     // Fetch fb page details
//     const igAccountResponse = await fetch(
//       `https://graph.facebook.com/v17.0/me/accounts?access_token=${access_token}`
//     );

//     const pagesData = await igAccountResponse.json();

//     if (!igAccountResponse.ok || !pagesData.data || pagesData.data.length === 0) {
//       return NextResponse.json({ error: 'No connected Facebook Pages found' }, { status: 500 });
//     }

//     const page = pagesData.data[0];
//     const igAccountIdResponse = await fetch(
//       `https://graph.facebook.com/v17.0/${page.id}?fields=instagram_business_account&access_token=${access_token}`
//     );

//     const igAccountIdData = await igAccountIdResponse.json();

//     if (!igAccountIdResponse.ok || !igAccountIdData.instagram_business_account) {
//       return NextResponse.json({ error: 'No connected Instagram Business Account found' }, { status: 500 });
//     }

//     const instagramAccountId = igAccountIdData.instagram_business_account.id;

//     // Fetch Instagram Media
//     const mediaResponse = await fetch(
//       `https://graph.facebook.com/v17.0/${instagramAccountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${access_token}`
//     );

//     const mediaData = await mediaResponse.json();

//     if (!mediaResponse.ok) {
//       return NextResponse.json({ error: 'Failed to fetch Instagram user media' }, { status: 500 });
//     }

//     // Check if the user exists in the database
//    let user = await User.findOne({ userId });
 
//     if (!user) {
//   // Return a response indicating that the user is not present
//    return NextResponse.json(
//     { error: "User not found in the database. Please ensure the account is created before connecting Instagram." },
//     { status: 404 }
//   );
//   }

//   // Update existing user with new Instagram details
//   user.instagramAccessToken = access_token;
//   user.instagramAccountId = instagramAccountId;
//   await user.save();

//   console.log("Updated User:", user);

//   return NextResponse.json({ message: "Instagram details updated successfully", user }, { status: 200 });

//     // Fetch children for CAROUSEL_ALBUM media types
//     const enrichedMediaData = await Promise.all(
//       mediaData.data.map(async (mediaItem) => {
//         if (mediaItem.media_type === 'CAROUSEL_ALBUM') {
//           const carouselResponse = await fetch(
//             `https://graph.facebook.com/v17.0/${mediaItem.id}/children?fields=id,media_type,media_url&access_token=${access_token}`
//           );

//           const carouselData = await carouselResponse.json();

//           if (carouselResponse.ok && carouselData.data) {
//             return { ...mediaItem, children: carouselData.data };
//           }
//         }
//         return mediaItem; // Return non-carousel items as-is
//       })
//     );

//     return NextResponse.json({ mediaData: enrichedMediaData }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
//   }
// }



// import { NextResponse } from "next/server";
// import User from "@/models/user.model"; 
// import { getAuth } from "@clerk/nextjs/server"; 
// import connectDb from "@/db/mongoose";

//  const CLIENT_ID = '1068594868074995';
//  const CLIENT_SECRET = '7aa94560586507e6c840da8105090984';
//  const REDIRECT_URI = 'https://snatch-pi.vercel.app/manage-projects/pick-projects'
// //const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';
//  export const dynamic = 'force-dynamic';

// export async function GET(req) {
//   const code = req.nextUrl.searchParams.get("code");
//   const { userId } = getAuth(req);

//   if (!code) {
//     return NextResponse.json({ error: "Authorization code not found" }, { status: 400 });
//   }

//   try {
//     await connectDb(); 

//     // Exchange authorization code for a short-lived access token
//     const tokenResponse = await fetch(
//       `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
//         REDIRECT_URI
//       )}&client_secret=${CLIENT_SECRET}&code=${code}`,
//       { method: "GET" }
//     );

//     const tokenData = await tokenResponse.json();

//     if (!tokenResponse.ok || tokenData.error) {
//       return NextResponse.json(
//         { error: tokenData.error?.message || "Failed to fetch access token" },
//         { status: 500 }
//       );
//     }

//     const { access_token: shortLivedAccessToken } = tokenData;

//     // Exchange the short-lived access token for a long-lived access token
//     const longLivedTokenResponse = await fetch(
//       `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&fb_exchange_token=${shortLivedAccessToken}`,
//       { method: "GET" }
//     );

//     const longLivedTokenData = await longLivedTokenResponse.json();

//     if (!longLivedTokenResponse.ok || longLivedTokenData.error) {
//       return NextResponse.json(
//         {
//           error: longLivedTokenData.error?.message || "Failed to fetch long-lived access token",
//         },
//         { status: 500 }
//       );
//     }

//     const { access_token: longLivedAccessToken } = longLivedTokenData;

//     console.log("Long-lived access token:", longLivedAccessToken);

//     // Fetch connected Facebook Pages
//     const igAccountResponse = await fetch(
//       `https://graph.facebook.com/v17.0/me/accounts?access_token=${longLivedAccessToken}`
//     );

//     const pagesData = await igAccountResponse.json();

//     if (!igAccountResponse.ok || !pagesData.data || pagesData.data.length === 0) {
//       return NextResponse.json({ error: "No connected Facebook Pages found" }, { status: 500 });
//     }

//     const page = pagesData.data[0];

//     // Fetch Instagram Business Account
//     const igAccountIdResponse = await fetch(
//       `https://graph.facebook.com/v17.0/${page.id}?fields=instagram_business_account&access_token=${longLivedAccessToken}`
//     );

//     const igAccountIdData = await igAccountIdResponse.json();

//     if (!igAccountIdResponse.ok || !igAccountIdData.instagram_business_account) {
//       return NextResponse.json({ error: "No connected Instagram Business Account found" }, { status: 500 });
//     }

//     const instagramAccountId = igAccountIdData.instagram_business_account.id;

//     // Check if the user exists in the database
//     let user = await User.findOne({ userId });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found in the database. Please ensure the account is created before connecting Instagram." },
//         { status: 404 }
//       );
//     }

//     // Update user with Instagram and Facebook details
//     user.instagramAccessToken = longLivedAccessToken;
//     user.instagramAccountId = instagramAccountId;
//     await user.save();

//     console.log("user is saved in db", user);

//    // Fetch Instagram Media
//     const mediaResponse = await fetch(
//       `https://graph.facebook.com/v17.0/${instagramAccountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${longLivedAccessToken}`
//     );

//     const mediaData = await mediaResponse.json();

//     if (!mediaResponse.ok) {
//       return NextResponse.json({ error: "Failed to fetch Instagram user media" }, { status: 500 });
//     }

//      // Fetch children for CAROUSEL_ALBUM media types
//     const enrichedMediaData = await Promise.all(
//       mediaData.data.map(async (mediaItem) => {
//         if (mediaItem.media_type === "CAROUSEL_ALBUM") {
//           const carouselResponse = await fetch(
//             `https://graph.facebook.com/v17.0/${mediaItem.id}/children?fields=id,media_type,media_url&access_token=${longLivedAccessToken}`
//           );

//           const carouselData = await carouselResponse.json();

//           if (carouselResponse.ok && carouselData.data) {
//             return { ...mediaItem, children: carouselData.data };
//           }
//         }
//         return mediaItem;
//       })
//     );


//     return NextResponse.json(
//       {
//         message: "Your instagram account has been successfully connected",
//         user,
//         mediaData: enrichedMediaData,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message || "An unknown error occurred" },
//       { status: 500 }
//     );
//   }
// }







import { NextResponse } from "next/server";
import User from "@/models/user.model"; 
import { getAuth } from "@clerk/nextjs/server"; 
import connectDb from "@/db/mongoose";

 const CLIENT_ID = '1068594868074995';
 const CLIENT_SECRET = '7aa94560586507e6c840da8105090984';
 const REDIRECT_URI = 'https://snatch-pi.vercel.app/manage-projects/pick-projects'
//const REDIRECT_URI = 'https://wf7s4f88-3000.inc1.devtunnels.ms/manage-projects/pick-projects';
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
      `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&client_secret=${CLIENT_SECRET}&code=${code}`,
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
        {
          error: longLivedTokenData.error?.message || "Failed to fetch long-lived access token",
        },
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
    console.log("pagesData of my fb account", pagesData, pagesData.data, pagesData.data.length);

    if (!igAccountResponse.ok || !pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json({ error: "No connected Facebook Pages found" }, { status: 500 });
    }

    const page = pagesData.data[0];
    console.log("page after found INFO", page)

    // Fetch Instagram Business Account and creator account (both comes in professional type and category doesn't matter here)
    const igAccountIdResponse = await fetch(
      `https://graph.facebook.com/v17.0/${page.id}?fields=instagram_business_account&access_token=${longLivedAccessToken}`
    );

    const igAccountIdData = await igAccountIdResponse.json();


    console.log("igACCOUNT RESPOSNE and data",  igAccountIdData);

    if (!igAccountIdResponse.ok || !igAccountIdData.instagram_business_account) {
      return NextResponse.json({ error: "No connected public Instagram Account found" }, { status: 500 });
    }

    const instagramAccountId = igAccountIdData.instagram_business_account.id;

    // const igAccountInfoResponse = await fetch(
    //   `https://graph.facebook.com/v17.0/${instagramAccountId}?fields=username,name,profile_picture_url,account_type&access_token=${longLivedAccessToken}`
    // );
    // const igAccountInfoData = await igAccountInfoResponse.json();
    // console.log("Account Type:", igAccountInfoData,igAccountInfoData.account_type); // Returns "BUSINESS", or "CREATOR"

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
    user.instagramAccountId = instagramAccountId;
    await user.save();

    console.log("user is saved in db", user);

   // Fetch Instagram Media
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${longLivedAccessToken}`
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
        message: "Your instagram account has been successfully connected",
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















//   // Fetch Instagram Media
//     // const mediaResponse = await fetch(
//     //   `https://graph.facebook.com/v17.0/${instagramAccountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${longLivedAccessToken}`
//     // );

//     // const mediaData = await mediaResponse.json();

//     // if (!mediaResponse.ok) {
//     //   return NextResponse.json({ error: "Failed to fetch Instagram user media" }, { status: 500 });
//     // }

//     // Fetch children for CAROUSEL_ALBUM media types
//     // const enrichedMediaData = await Promise.all(
//     //   mediaData.data.map(async (mediaItem) => {
//     //     if (mediaItem.media_type === "CAROUSEL_ALBUM") {
//     //       const carouselResponse = await fetch(
//     //         `https://graph.facebook.com/v17.0/${mediaItem.id}/children?fields=id,media_type,media_url&access_token=${longLivedAccessToken}`
//     //       );

//     //       const carouselData = await carouselResponse.json();

//     //       if (carouselResponse.ok && carouselData.data) {
//     //         return { ...mediaItem, children: carouselData.data };
//     //       }
//     //     }
//     //     return mediaItem;
//     //   })
//     // );
