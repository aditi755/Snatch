"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import PostCard from "@/components/public-portfolio/PostCard";
import { usePostsContext } from "@/context/PostContext";

export default function PostDetailsPage() {
  const { allPosts, username: contextUsername } = usePostsContext();
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

          // Default insights values when not available
          const defaultInsights = {
            engagement: 0,
            impressions: 0,
            reach: 0,
            saved: 0,
            likes: 0,
            comments: 0
          };

          // Combine API data with local data
          setPost({
            post: data.post,
            media: data.media,
            mediaType: matchingPost?.mediaType || data.media.type,
            mediaUrl: matchingPost?.mediaUrl || (data.media.files[0]?.url || ''),
            children: matchingPost?.children || data.media.files,
            insights: matchingPost?.insights || defaultInsights
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

  if (loading) {
    return <div className="w-[100vw] text-center h-[60vh] flex items-center justify-center">
      <p className="text-2xl text-electric-blue animate-pulse">Loading...</p>
    </div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return <PostCard post={post} username={username} postId={postId} allPosts={allPosts}/>;
}