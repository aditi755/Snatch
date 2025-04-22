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
  //   try {
  //     console.log("frontend question delete", questionTitle);
  //     const response = await fetch("/api/profile", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ section: sectionKey, index, questionTitle }),
  //     });
  
  //     const result = await response.json();
  //     if (!response.ok) throw new Error(result.error || "Failed to delete");
  
  //     // Remove from local state after successful deletion
  //     const updatedQuestions = (sectionKey === "about" ? aboutQuestions :
  //       sectionKey === "audience" ? audienceQuestions : brandQuestions)
  //       .filter((_, i) => i !== index);
  
  //     updateSectionState(sectionKey, updatedQuestions);
  //     alert("Question deleted successfully! refresh the page to see the changes.");
  //   } catch (error) {
  //     console.error("Error removing question:", error);
  //   }
  // };
  


  // export const removeQuestion = async (index, sectionKey, questionTitle, updateSectionState) => {
  //   try {
  //     console.log("frontend question delete", questionTitle);
  //     const response = await fetch("/api/profile", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ section: sectionKey, index, questionTitle }),
  //     });
  
  //     const result = await response.json();
  //     if (!response.ok) throw new Error(result.error || "Failed to delete");
  
  //     // Update local state immediately after successful deletion
  //     const updatedQuestions = fetchProfileData().then(data => {
  //       // Get the appropriate questions array based on section
  //       const questionsArray = sectionKey === "about" ? data.aboutQuestions :
  //                            sectionKey === "audience" ? data.audienceQuestions :
  //                            data.brandQuestions;
                             
  //       // Update the state with fresh data
  //       updateSectionState(sectionKey, questionsArray);
  //     });
  
  //     // Show success message
  //     alert("Question deleted successfully!");
  //   } catch (error) {
  //     console.error("Error removing question:", error);
  //     alert("Failed to delete question. Please try again.");
  //   }
  // };


  // export const removeQuestion = async (index, sectionKey, questionTitle, updateSectionState) => {
  //   try {
  //     console.log("frontend question delete", questionTitle);
  //     const response = await fetch("/api/profile", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ section: sectionKey, index, questionTitle }),
  //     });
  
  //     const result = await response.json();
  //     if (!response.ok) throw new Error(result.error || "Failed to delete");
  
  //     // Get current data from API
  //     const data = await fetchProfileData();
      
  //     // Get the appropriate questions array based on section
  //     let questionsArray = sectionKey === "about" ? data.aboutQuestions :
  //                         sectionKey === "audience" ? data.audienceQuestions :
  //                         data.brandQuestions;
  
  //     // Remove only the specific question that matches both index and title
  //     questionsArray = questionsArray.filter((question, idx) => 
  //       !(idx === index && question.question === questionTitle)
  //     );
  
  //     // Update the state with the filtered questions
  //     updateSectionState(sectionKey, questionsArray);
  
  //     // Show success message
  //     alert("Question deleted successfully!");
  //   } catch (error) {
  //     console.error("Error removing question:", error);
  //     alert("Failed to delete question. Please try again.");
  //   }
  // };

  export const removeQuestion = async (questionId, sectionKey, updateSectionState) => {
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section: sectionKey, questionId }),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to delete");
  
      // Get updated data and update UI
      const data = await fetchProfileData();
      let questionsArray = sectionKey === "about" ? data.aboutQuestions :
                           sectionKey === "audience" ? data.audienceQuestions :
                           data.brandQuestions;
  
      updateSectionState(sectionKey, questionsArray);
      alert("Question deleted successfully!");
    } catch (error) {
      console.error("Error removing question:", error);
      alert("Failed to delete question. Please try again.");
    }
  };
  