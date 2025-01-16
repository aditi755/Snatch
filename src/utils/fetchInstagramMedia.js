export async function fetchInstagramMedia(code) {
    try {
      const response = await fetch(`/api/auth/instagram/callback?code=${code}`);
      console.log("response", response);
      const data = await response.json();
      console.log("Instagram media data:", data);
      if (data?.mediaData) {
        return data.mediaData; // Return the media data
      }
      //  else {
      //   throw new Error("Failed to fetch Instagram media.");
      // }
    } catch (error) {
      console.error("Error fetching Instagram media:", error);
      throw error;
    }
  }
  