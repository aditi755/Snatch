export const fetchProfileData = async () => {
  try {
    const response = await fetch('/api/profile');
    const data = await response.json();
    console.log("DATA", data);

    // Define a mapping for coverImage to coverImageName
    const imageNameMapping = {
      "https://res.cloudinary.com/dgk9ok5fx/image/upload/v1740396552/7_r6djcr.jpg": "Sunlit Studio",
      // Add more mappings as needed
    };

    if (Array.isArray(data.questionnaires) && data.questionnaires.length > 0) {
      const aboutSection = data.questionnaires[0].sections.find(section => section.section === "about");
      const audienceSection = data.questionnaires[0].sections.find(section => section.section === "audience");
      const brandSection = data.questionnaires[0].sections.find(section => section.section === "brand");

      // Process questions to include coverImageName
      const processQuestions = (questions) => {
        return questions.map(q => ({
          ...q,
          coverImageName: q.coverImageName || imageNameMapping[q.coverImage] || 'Default Image',
        }));
      };

      return {
        aboutQuestions: processQuestions(aboutSection?.questions || []),
        audienceQuestions: processQuestions(audienceSection?.questions || []),
        brandQuestions: processQuestions(brandSection?.questions || []),
      };
    } else {
      console.warn("No questionnaires found.");
      return { aboutQuestions: [], audienceQuestions: [], brandQuestions: [] };
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};


export const saveQuestionsToDB = async (section, questions) => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section, questions }),
      });
  
      if (!response.ok) throw new Error("Failed to save");
  
      return await response.json(); 
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      throw error;
    }
  };
  
  export const removeQuestion = async (index, sectionKey, questionTitle, updateSectionState) => {
    try {
      console.log("frontend question delete", questionTitle);
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section: sectionKey, index, questionTitle }),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to delete");
  
      // Remove from local state after successful deletion
      const updatedQuestions = (sectionKey === "about" ? aboutQuestions :
        sectionKey === "audience" ? audienceQuestions : brandQuestions)
        .filter((_, i) => i !== index);
  
      updateSectionState(sectionKey, updatedQuestions);
    } catch (error) {
      console.error("Error removing question:", error);
    }
  };
  