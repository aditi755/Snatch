// utils/helpers.js
import { useState, useEffect } from "react";


const extractUsernameFromPath = (pathname) => {
  // Remove leading and trailing slashes and split
  const parts = pathname.split("/").filter(Boolean);
  console.log("Current pathname: parts", parts);
  // For admin view URL: ['snatchsocial', 'media-kit', 'adminview']
  // For public view URL: ['snatchsocial', 'media-kit']

  // Always return the first segment as it's the username in both cases
  return parts[0] || null;
};



// Update useFetchPortfolio
export const useFetchPortfolio = (ownerId) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = extractUsernameFromPath(window.location.pathname);

        const url = ownerId
          ? `/api/public-portfolio/userinfo?userId=${ownerId}`
          : `/api/public-portfolio/userinfo?username=${username}`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          setFormData(result.data);
        } else {
          console.error("Error fetching data:", result.error);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    fetchData();
  }, [ownerId]);

  return formData;
};

// Update useFetchPublicPosts
export const useFetchPublicPosts = (ownerId) => {
  const [posts, setPosts] = useState({ instagram: [], uploaded: [] });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const pathname = window.location.pathname;  
        const username = extractUsernameFromPath(pathname);

        const url = ownerId
          ? `/api/public-portfolio/posts?userId=${ownerId}`
          : `/api/public-portfolio/posts?username=${username}`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          setPosts({
            instagram: result.instagram || [],
            uploaded: result.uploaded || [],
          });
        } else {
          console.error("Error fetching posts:", result.error);
        }
      } catch (error) {
        console.error("Error fetching public posts:", error);
      }
    };

    fetchPosts();
  }, [ownerId]);

  return posts;
};

// Update useInstagramData
export const useInstagramData = () => {
  const [data, setData] = useState({ followers: 0, posts: 0, reach: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = extractUsernameFromPath(window.location.pathname);

        if (!username) {
          throw new Error("Username not found in URL");
        }

        const response = await fetch(
          `/api/public-portfolio/instagram-stats?username=${encodeURIComponent(username)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch Instagram data.");
        }

        const result = await response.json();
        setData({
          followers: result.followers_count || 0,
          posts: result.media_count || 0,
          reach: result.reach || 0,
        });
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useCheckScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize(); // Check on initial load
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
};

// 3️⃣ Loader Component
export const Loader = () => {
  return (
    <div className="h-screen flex items-center justify-center text-white">
      Loading...
    </div>
  );
};
