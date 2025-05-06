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
You're an expert audience analyst helping a brand evaluate an influencer's Instagram audience based on their gender, age, and top country-level data. You are helping creators present their audience strengths to potential brand partners.

You identify and explain the most **statistically significant patterns** in the audience, in the form of **4 bullet points**, each on a **separate line**.

UData:
- Gender distribution:  ${JSON.stringify(demographicData.genderData)}
- Age ranges: ${JSON.stringify(demographicData.ageData)}
- Top countries: ${JSON.stringify(demographicData.countryData)}

Your goal is to write 4 clear, positive, and statistically meaningful insights that help brands understand what makes this audience valuable and relevant.

Follow these rules:
- Highlight concentrations, skews, or distinct traits in gender, age, or geography
- Use positive, brand-relevant framing (e.g. “Millennial focused” instead of “Low Gen Z reach”)
- Include percentages to support your points
- Do not repeat raw data — interpret it into meaningful takeaways
- Be under 25 words per bullet
- Avoid assumptions about behavior, income, profession, or interests
- Do not include uncertain statements or suggest further research
- If visible in the data, add 1 secondary or supporting insight

Example insights:
- 68% of followers are female, showing strong gender alignment
- Millennial focused: 71% of audience is aged 25–34
- 78% India-based audience suggests high domestic visibility and Tier 1 urban relevance
- US (12%) forms a secondary cluster, indicating strong diaspora crossover

Output:
Write only the 4 bullet points. Do not include any intro, label, or explanation.
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