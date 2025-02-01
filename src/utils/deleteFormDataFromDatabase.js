const deleteFormDataFromDatabase = async (selectionId) => {
    try {
      const response = await fetch(`/api/projects/draft/${selectionId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete formData from the database");
      }
  
      console.log("FormData deleted successfully");
    } catch (error) {
      console.error("Error deleting formData:", error);
      throw error;
    }
  };

  export default deleteFormDataFromDatabase;