import { NextResponse } from "next/server";

export async function GET(req) {
  const POSTHOG_PROJECT_ID = 56106;
  const POSTHOG_API_KEY = "phx_LkVB5sPexsjvftPb6pmpSKtHSBr5jnTILr1oPpSeCr4c6Ll";

  if (!POSTHOG_API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // Get events from last 30 days only
    let allEvents = [];
    const filters = encodeURIComponent(JSON.stringify([
      {
        key: "$current_url",
        value: `/public-portfolio/${username}`,
        operator: "icontains",
        type: "event",
      }
    ]));
    
    // Use current year as base date to ensure we catch all events
    const currentYear = new Date().getFullYear();
    let nextUrl = `https://eu.i.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/events/?after=${currentYear}-01-01&limit=100&properties=${filters}`;
    
    let pageCounter = 0;
    const MAX_PAGES = 5;

    // Add debug logging
    console.log(`Fetching analytics for username: ${username}`);

    while (nextUrl && pageCounter < MAX_PAGES) {
      pageCounter++;
      console.log(`Fetching page ${pageCounter}`);
      
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
      const events = data.results || [];


    // Process data
    let visitorSet = new Set();
    let countryCount = {};
    let stateCount = {};
    let cityCount = {};
    let totalDuration = 0;
    let sessionCount = 0;
    const sessionDurations = {};

    // Single pass through events
    events.forEach(event => {
      // Track unique visitors
      visitorSet.add(event.distinct_id);

      // Track location data
      const country = event.properties?.$geoip_country_name;
      const state = event.properties?.$geoip_subdivision_1_name;
      const city = event.properties?.$geoip_city_name;

      if (country) countryCount[country] = (countryCount[country] || 0) + 1;
      if (state) stateCount[state] = (stateCount[state] || 0) + 1;
      if (city) cityCount[city] = (cityCount[city] || 0) + 1;

      // Track session duration
      const sessionId = event.properties?.$session_id;
      if (sessionId) {
        const timestamp = new Date(event.timestamp).getTime();
        if (!sessionDurations[sessionId]) {
          sessionDurations[sessionId] = { start: timestamp, end: timestamp };
        } else {
          sessionDurations[sessionId].start = Math.min(sessionDurations[sessionId].start, timestamp);
          sessionDurations[sessionId].end = Math.max(sessionDurations[sessionId].end, timestamp);
        }
      }
    });

    // Calculate average session duration
    Object.values(sessionDurations).forEach(({ start, end }) => {
      const duration = (end - start) / 1000 / 60; // minutes
      if (duration > 0 && duration < 180) { // Ignore sessions > 3 hours
        totalDuration += duration;
        sessionCount++;
      }
    });

    // Process top locations
    const getTopLocations = (data, total) => 
      Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([location, count]) => ({
          location,
          percentage: ((count / total) * 100).toFixed(2)
        }));

    return NextResponse.json({
      totalVisitors: visitorSet.size,
      topCountries: getTopLocations(countryCount, events.length),
      topStates: getTopLocations(stateCount, events.length),
      topCities: getTopLocations(cityCount, events.length),
      totalAvgTimeSpent: sessionCount ? (totalDuration / sessionCount).toFixed(2) : "0"
    });
  }
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}