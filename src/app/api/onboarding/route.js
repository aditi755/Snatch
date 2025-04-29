// src/app/api/test-1/route.js

export async function POST(request) {
  try {
    // Parse JSON from the request body directly in the POST handler
    const body = await request.json();
    console.log("body", body);  
    const { message } = body;
    console.log("message", message);  

    // Check if the message is provided
    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: "No message provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return a response with the received message
    return new Response(
      JSON.stringify({ success: true, echo: message }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Handle any errors and return a response
    return new Response(
      JSON.stringify({ success: false, error: "Invalid request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

