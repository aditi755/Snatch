import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateFormDataFromUserInput = async (userInput, isBrandCollaboration) => {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured");
  }

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const basePrompt = `
        You are a brand marketing assistant helping creators create polished, press kit–ready entries for brand collaborations or projects.

        A user will provide a casual text or voice note describing their ${
            isBrandCollaboration ? "brand collaboration" : "project"
          }.

        ---

        🎯 PURPOSE:
        The output will be shown in a public-facing press kit, read by brand managers, agencies, and marketing decision-makers.

        🗣️ TONE & STYLE:
        - Confident, polished, and editorial
        - Professional but not overly corporate
        - No first-person language ("I", "we", "my", etc.)

        ---

        🧠 INSTRUCTIONS:
        - Use only the user's input — do not invent new information
        - Do not leave any fields blank
        - If a field is unclear or inferred, fill it with your best guess and mark it for confirmation using the \`needs_confirmation\` object

        ---

        ${
            isBrandCollaboration
              ? `📦 OUTPUT FORMAT:
        {
          "title": "Short headline summary of the collab (max 100 characters)",
          "description": "Professional, polished summary of what the creator did (max 100 characters not more than 100 characters)",
          "industries": ["Industry1", "Industry2", "Industry3"],
          "company_name": "Brand or company name",
          "company_location": "City, Country",
          "event_type": "One of the predefined event types below",
          "event_name": "Name of the event, if provided",
          "needs_confirmation": {
            "title": true,
            "description": true,
            "industries": true,
            "company_name": true,
            "company_location": true,
            "event_type": true,
            "event_name": true
          }
        }`
              : `📦 OUTPUT FORMAT:
        {
          "title": "Short headline summary of the project (max 100 characters)",
          "description": "Professional summary of the project (max 200 characters)",
          "industries": ["Industry1", "Industry2", "Industry3"],
          "needs_confirmation": {
            "title": true,
            "description": true,
            "industries": true
          }
        }`
        }

        ✅ APPROVED EVENT TYPES (choose only from this list atleast two or three):
          "Conference", "Workshop", "Webinar", "Networking", "Product Launch", "Brand Activation", "Store Opening", "Exclusive Brand Experience", "Industry Conference", "Panel Livestream", "Virtual Event", "Podcast or Interview", "Workshop or Training Session"

          ✅ APPROVED INDUSTRIES (choose only from this list, atleast two or three):
          "Accounting", "Advertising", "Aerospace", "Agriculture", "AI & Machine Learning",
          "Alternative Medicine", "Apparel", "Architecture", "Arts & Culture", "Automotive",
          "Aviation", "Baking & Bakeware", "Beauty", "Biotechnology", "Blogging & Vlogging",
          "Broadcasting", "Business & Finance", "Chemicals", "Clean Energy", "Climate Change",
          "Comedy", "Construction", "Consumer Electronics", "Consulting", "Cooking",
          "Crypto & Blockchain", "Cybersecurity", "Dance", "Design", "Digital Marketing",
          "DIY & Crafts", "E-Commerce", "Education", "Entertainment", "Environment",
          "Events Management", "Fashion", "Financial Services", "Fitness & Wellness",
          "Food & Beverage", "Gaming & Esports", "Games & Toys", "Government"

          🔒 DO NOT invent or infer new values for industries or event types.
            🔒 RULES FOR INDUSTRIES AND EVENT TYPES:
            - You must choose only from the approved lists exactly as written.
            - Do not invent, modify, or guess new industry or event type values.
            - If no valid industry or event type can be confidently assigned, choose the most relevant option from the list and flag it in \`needs_confirmation\`.
            - And choose at least two or three industries and atleast one event types and try your best to make sure that it is relavant to the user input context.
        ---

        ✍️ USER INPUT:
        """${userInput}"""
    `;

  try {
    const result = await model.generateContent(basePrompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text); // Debug log

    // Extract JSON more reliably
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    console.log('Parsed data:', parsedData); // Debug log
    
    return parsedData;

  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};