import { GoogleGenerativeAI } from "@google/generative-ai";

const generateAudienceInsights = async (demographicData) => {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured");
      }
  
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model:  "gemini-1.5-flash"  });
    console.log("Demographic Data: GEMEINI API FILE", demographicData);

    const prompt = `
      Analyze this Instagram audience demographic data and provide maximum of 4 key insights in 4 lines:
      Gender distribution: ${JSON.stringify(demographicData.genderData)}
      Age ranges: ${JSON.stringify(demographicData.ageData)}
      Top countries: ${JSON.stringify(demographicData.countryData)}
      
      Focus on the most significant patterns and noteworthy statistics.
      Keep each insight concise and actionable.
      Use percentage figures when relevant.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Unable to generate insights at this time.";
  }
};

export default generateAudienceInsights;