// //app/api/analytics/route.js
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   const POSTHOG_PROJECT_ID = 56106;
//   const POSTHOG_API_KEY =
//     "phx_LkVB5sPexsjvftPb6pmpSKtHSBr5jnTILr1oPpSeCr4c6Ll";

//   if (!POSTHOG_API_KEY) {
//     return NextResponse.json({ error: "Missing API key" }, { status: 500 });
//   }

//   try {
//     let allEvents = [];
//     let nextUrl = `https://eu.i.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/events/?after=2025-01-01`;

//     // ✅ Fetch all events with pagination
//     while (nextUrl) {
//       const response = await fetch(nextUrl, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${POSTHOG_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error fetching events: ${response.statusText}`);
//       }

//       const data = await response.json();
//       allEvents = [...allEvents, ...data.results];
//       nextUrl = data.next || null;
//     }

//     // ✅ Filter events for /public-portfolio
//     const portfolioEvents = allEvents.filter(
//       (event) =>
//         event.properties?.$current_url?.includes("/public-portfolio") ||
//         event.properties?.$session_entry_url?.includes("/public-portfolio")
//     );

//     // ✅ Track unique visitors for /public-portfolio
//     let visitorSet = new Set();
//     let countryCount = {};
//     let stateCount = {};
//     let cityCount = {};

//     portfolioEvents.forEach((event) => {
//       const visitorId = event.distinct_id;
//       const country = event.properties?.$geoip_country_name || "Unknown";
//       const state = event.properties?.$geoip_subdivision_1_name || "Unknown";
//       const city = event.properties?.$geoip_city_name || "Unknown";

//       // Track unique visitors
//       if (visitorId) {
//         visitorSet.add(visitorId);
//       }

//       // Count countries
//       if (country !== "Unknown") {
//         countryCount[country] = (countryCount[country] || 0) + 1;
//       }

//       // Count states
//       if (state !== "Unknown") {
//         stateCount[state] = (stateCount[state] || 0) + 1;
//       }

//       // Count cities
//       if (city !== "Unknown") {
//         cityCount[city] = (cityCount[city] || 0) + 1;
//       }
//     });

//     // ✅ Total visitors for /public-portfolio
//     const totalVisitors = visitorSet.size;

//     // ✅ Process top 3 countries by percentage
//     const sortedCountries = Object.entries(countryCount)
//       .sort((a, b) => b[1] - a[1]) // Sort by highest visits
//       .slice(0, 3) // Get top 3
//       .map(([country, count]) => ({
//         location: country,
//         percentage: ((count / portfolioEvents.length) * 100).toFixed(2),
//       }));

//     // ✅ Process top 3 states by percentage
//     const sortedStates = Object.entries(stateCount)
//       .sort((a, b) => b[1] - a[1]) // Sort by highest visits
//       .slice(0, 3)
//       .map(([state, count]) => ({
//         location: state,
//         percentage: ((count / portfolioEvents.length) * 100).toFixed(2),
//       }));


//     // ✅ Process top 3 cities by percentage
//     const sortedCities = Object.entries(cityCount)
//       .sort((a, b) => b[1] - a[1]) // Sort by highest visits
//       .slice(0, 3)
//       .map(([city, count]) => ({
//         location: city,
//         percentage: ((count / portfolioEvents.length) * 100).toFixed(2),
//       }));

//     // ✅ Track unique sessions and calculate time spent for /public-portfolio
//     let sessionDurations = {};
//     portfolioEvents.forEach((event) => {
//       const sessionId = event.properties?.$session_id;
//       const timestamp = new Date(event.timestamp).getTime();

//       if (sessionId) {
//         if (!sessionDurations[sessionId]) {
//           sessionDurations[sessionId] = {
//             entryTime: timestamp,
//             exitTime: timestamp,
//           };
//         } else {
//           sessionDurations[sessionId].entryTime = Math.min(
//             sessionDurations[sessionId].entryTime,
//             timestamp
//           );
//           sessionDurations[sessionId].exitTime = Math.max(
//             sessionDurations[sessionId].exitTime,
//             timestamp
//           );
//         }
//       }
//     });

//     // ✅ Calculate total session durations for /public-portfolio
//     let totalDuration = 0;
//     let sessionCount = 0;

//     Object.values(sessionDurations).forEach(({ entryTime, exitTime }) => {
//       const duration = (exitTime - entryTime) / 1000 / 60; // convert ms to minutes
//       if (duration > 0) {
//         totalDuration += duration;
//         sessionCount += 1;
//       }
//     });

//     // ✅ Average time spent for /public-portfolio
//     const totalAvgTimeSpent =
//       sessionCount > 0 ? (totalDuration / sessionCount).toFixed(2) : "0";

//     // ✅ Return aggregated data
//     return NextResponse.json({
//       totalVisitors,
//       topCountries: sortedCountries,
//       topStates: sortedStates,
//       topCities: sortedCities,
//       totalAvgTimeSpent,
//     });
//   } catch (error) {
//     console.error("Error:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";

export async function GET(req) {
  const POSTHOG_PROJECT_ID = 56106;
  const POSTHOG_API_KEY =
    "phx_LkVB5sPexsjvftPb6pmpSKtHSBr5jnTILr1oPpSeCr4c6Ll";

  if (!POSTHOG_API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // ✅ Extract username from query params
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    let allEvents = [];
    let nextUrl = `https://eu.i.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/events/?after=2025-01-01`;

    // ✅ Fetch all events with pagination
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${POSTHOG_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching events: ${response.statusText}`);
      }

      const data = await response.json();
      allEvents = [...allEvents, ...data.results];
      nextUrl = data.next || null;
    }

    // ✅ Filter events for /public-portfolio/{username}
    const portfolioEvents = allEvents.filter(
      (event) =>
        event.properties?.$current_url?.includes(
          `/public-portfolio/${username}`
        ) ||
        event.properties?.$session_entry_url?.includes(
          `/public-portfolio/${username}`
        )
    );

    // ✅ Track unique visitors for /public-portfolio/{username}
    let visitorSet = new Set();
    let countryCount = {};
    let stateCount = {};
    let cityCount = {};

    portfolioEvents.forEach((event) => {
      const visitorId = event.distinct_id;
      const country = event.properties?.$geoip_country_name || "Unknown";
      const state = event.properties?.$geoip_subdivision_1_name || "Unknown";
      const city = event.properties?.$geoip_city_name || "Unknown";

      // Track unique visitors
      if (visitorId) {
        visitorSet.add(visitorId);
      }

      // Count countries
      if (country !== "Unknown") {
        countryCount[country] = (countryCount[country] || 0) + 1;
      }

      // Count states
      if (state !== "Unknown") {
        stateCount[state] = (stateCount[state] || 0) + 1;
      }

      // Count cities
      if (city !== "Unknown") {
        cityCount[city] = (cityCount[city] || 0) + 1;
      }
    });

    // ✅ Total visitors for /public-portfolio/{username}
    const totalVisitors = visitorSet.size;

    // ✅ Process top 3 countries by percentage
    const sortedCountries = Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([country, count]) => ({
        location: country,
        percentage: ((count / portfolioEvents.length) * 100).toFixed(2),
      }));

    // ✅ Process top 3 states by percentage
    const sortedStates = Object.entries(stateCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([state, count]) => ({
        location: state,
        percentage: ((count / portfolioEvents.length) * 100).toFixed(2),
      }));

    // ✅ Process top 3 cities by percentage
    const sortedCities = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([city, count]) => ({
        location: city,
        percentage: ((count / portfolioEvents.length) * 100).toFixed(2),
      }));

    // ✅ Track unique sessions and calculate time spent for /public-portfolio/{username}
    let sessionDurations = {};
    portfolioEvents.forEach((event) => {
      const sessionId = event.properties?.$session_id;
      const timestamp = new Date(event.timestamp).getTime();

      if (sessionId) {
        if (!sessionDurations[sessionId]) {
          sessionDurations[sessionId] = {
            entryTime: timestamp,
            exitTime: timestamp,
          };
        } else {
          sessionDurations[sessionId].entryTime = Math.min(
            sessionDurations[sessionId].entryTime,
            timestamp
          );
          sessionDurations[sessionId].exitTime = Math.max(
            sessionDurations[sessionId].exitTime,
            timestamp
          );
        }
      }
    });

    // ✅ Calculate total session durations for /public-portfolio/{username}
    let totalDuration = 0;
    let sessionCount = 0;

    Object.values(sessionDurations).forEach(({ entryTime, exitTime }) => {
      const duration = (exitTime - entryTime) / 1000 / 60; // convert ms to minutes
      if (duration > 0) {
        totalDuration += duration;
        sessionCount += 1;
      }
    });

    // ✅ Average time spent for /public-portfolio/{username}
    const totalAvgTimeSpent =
      sessionCount > 0 ? (totalDuration / sessionCount).toFixed(2) : "0";

    // ✅ Return aggregated data
    return NextResponse.json({
      totalVisitors,
      topCountries: sortedCountries,
      topStates: sortedStates,
      topCities: sortedCities,
      totalAvgTimeSpent,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
