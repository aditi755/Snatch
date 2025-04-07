// utils/helpers.js
import { useState, useEffect } from "react";

// 1️⃣ Fetch Portfolio Data
export const useFetchPortfolio = (ownerId) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pathnameParts = window.location.pathname.split("/");
        const username =
          pathnameParts[pathnameParts.length - 1] || pathnameParts[pathnameParts.length - 2];

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

export const useFetchPublicPosts = (ownerId) => {
  const [posts, setPosts] = useState({ instagram: [], uploaded: [] });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const pathnameParts = window.location.pathname.split("/");
        const username =
          pathnameParts[pathnameParts.length - 1] || pathnameParts[pathnameParts.length - 2];

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


export const useInstagramData = () => {
  const [data, setData] = useState({ followers: 0, posts: 0, reach: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/instagram-stats");
        if (!response.ok) {
          throw new Error("Failed to fetch Instagram data");
        }
        const result = await response.json();
        setData({
          followers: result.followers_count || 0,
          posts: result.media_count || 0,
          reach: result.reach || 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { data, loading, error };
};




// 2️⃣ Check Screen Size
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
