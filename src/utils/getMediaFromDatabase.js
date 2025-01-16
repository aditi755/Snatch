export async function getMediaFromDatabase() {
    try {
        const response = await fetch('/api/auth/get-media');
        console.log("response", response);
        const data = await response.json();
        console.log("Instagram media data:", data);
        if (data?.mediaData) {
          return data.mediaData; 
        }
       
      } catch (error) {
        console.error("Error fetching Instagram media:", error);
        throw error;
      }
}