// src/app/public-portfolio/[username]/post/page.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/public-portfolio/PostCard";// Adjust path as needed

export default function PostDetailsPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  useEffect(() => {

    if (!postId) {
      console.error("No postId provided in the URL.");
      return;
    }

    const fetchPostData = async () => {
      try {
        const res = await fetch(`/api/public-portfolio/preview?postId=${postId}`);
        const data = await res.json();

        if (data.success) {
          setPost(data);
        } else {
          console.error("Error fetching post:", data.error);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  if (loading) return <p>Loading...</p>;

  return <PostCard post={post} />;
}
