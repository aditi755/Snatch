
// src/app/public-portfolio/[username]/post/page.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import PostCard from "@/components/public-portfolio/PostCard";
import { usePostsContext } from "@/context/PostContext";
export default function PostDetailsPage() {
  const { allPosts, username: contextUsername } = usePostsContext(); // Get data from context

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const params = useParams();
  const postId = searchParams.get("postId");
  const username = params.username;


  useEffect(() => {
    if (!postId || !username) {
      console.error("Missing required params:", { postId, username });
      return;
    }

    const fetchPostData = async () => {
      try {
        const res = await fetch(`/api/public-portfolio/preview?postId=${postId}&username=${username}`);
        const data = await res.json();

        if (data.success) {
          // Find the matching post from allPosts
          const matchingPost = allPosts?.find(p => String(p.mediaId) === String(postId));
          
          // Combine API data with matching post data
          setPost({
            ...data,
            mediaType: matchingPost?.mediaType,
            mediaUrl: matchingPost?.mediaUrl,
            children: matchingPost?.children
          });
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
  }, [postId, username, allPosts]);

  console.log("Rendering PostCard with:", { username, postId, post, allPosts }); // Add this debug log

  const currentPost = allPosts?.find(post => post.mediaId === postId);

  console.log("Current post:", currentPost); 
  if (!currentPost) {
    return <div>Post not found</div>;
  }

  if (loading) return <div className="w-[100vw] text-center h-[60vh] flex items-center justify-center">
<p className="text-2xl text-electric-blue animate-pulse ">Loading...</p>;
  </div> 

  return <PostCard post={post} username={username} postId={postId} allPosts={allPosts}/>;
}
