
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
  