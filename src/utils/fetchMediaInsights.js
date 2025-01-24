export async function fetchMediaInsights(mediaId) {
    try {
      // Make a POST request to the backend API
      const response = await fetch('/api/media-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId }), // Send mediaId in the request body
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to fetch media insights');
      }
  
      // Parse the JSON response
      const data = await response.json();
      console.log("Raw API Response:", data); 
      return data;
   
    } catch (error) {
      console.error('Error fetching media insights:', error);
      throw error;
    }
  }
  