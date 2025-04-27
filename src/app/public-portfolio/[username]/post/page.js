// src/app/public-portfolio/[username]/post/page.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import PostCard from "@/components/public-portfolio/PostCard";// Adjust path as needed

export default function PostDetailsPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const params = useParams();
  const postId = searchParams.get("postId");
  const username = params.username;

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
  console.log("Rendering PostCard with:", { username, postId, post }); // Add this debug log


  if (loading) return <div className="w-[100vw] text-center h-[60vh] flex items-center justify-center">
<p className="text-2xl text-electric-blue animate-pulse ">Loading...</p>;
  </div> 

  return <PostCard post={post} username={username} postId={postId} />;
}
