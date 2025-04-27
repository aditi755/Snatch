"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PostCard({ post, postId, username }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("PostCard mount with props:", { username, postId });
    
    if (!username || !postId) {
      console.error("Missing required props:", { username, postId });
      setError("Missing username or postId");
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        const url = `/api/public-portfolio/media-insights?username=${encodeURIComponent(username)}&postId=${encodeURIComponent(postId)}`;
        console.log("Fetching insights from:", url);

        const res = await fetch(url);
        const data = await res.json();

        console.log("Insights API response:", data);

        if (data.success) {
          const insightsArray = data.insights.data;
          const insightsMap = {};

          insightsArray.forEach(item => {
            insightsMap[item.name] = item.values?.[0]?.value || 0;
          });

          setInsights(insightsMap);
        } else {
          throw new Error(data.error || 'Failed to fetch insights');
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [username, postId]);

  if (loading) {
    return <div>Loading insights...</div>; // or you can make a skeleton loader
  }

  if (!insights) {
    return <div>No insights available</div>;
  }

  if (!post) return <p>No post found.</p>;

  const imageUrl = post.media?.files?.[0]?.url;
  const title = post.post?.titleName || "Untitled";
  const description = post.post?.description || "No description available.";
  const industries = post.post?.industries || [];
  const companyName = post.post?.companyName;
  const companyLocation = post.post?.companyLocation;
  const companyLogo = post.post?.companyLogo;
  const eventTypes = post.post?.eventTypes || [];

  const hasCompanyInfo = companyName && (companyLocation || eventTypes.length > 0 || companyLogo);

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans bg-white mt-10">
      <div className="flex md:h-[70%] flex-col md:flex-row gap-8 bg-gray-100/40 rounded-lg overflow-hidden">

        {/* Left: Media */}
        <div className="relative w-full md:w-[35%] md:px-8 md:py-5 aspect-[4/5]">
          <div className="relative w-full h-full">
            {post.media?.type === "CAROUSEL" && post.media.files?.length > 0 ? (
              <div className="w-full h-full overflow-hidden rounded-3xl">
                <div className="flex overflow-x-auto gap-2 h-full">
                  {post.media.files.map((file, index) =>
                    file.type === "IMAGE" ? (
                      <Image
                        key={index}
                        src={file.url}
                        alt={`Carousel image ${index + 1}`}
                        width={400}
                        height={500}
                        className="object-cover rounded-3xl shrink-0 w-full h-auto"
                      />
                    ) : file.type === "VIDEO" ? (
                      <video
                        key={index}
                        controls
                        className="rounded-3xl shrink-0 w-full h-full object-cover"
                      >
                        <source src={file.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null
                  )}
                </div>
              </div>
            ) : post.media?.type === "VIDEO" ? (
              <video controls className="w-full h-full object-cover rounded-3xl">
                <source src={post.media.files[0].url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : post.media?.type === "IMAGE" ? (
              <Image
                src={post.media.files[0].url}
                alt="Post media"
                fill
                className="object-cover rounded-3xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                No Media Available
              </div>
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 py-6 px-4 md:pr-8 flex flex-col">
          {/* Title */}
          <h2 className="text-graphite font-qimano text-2xl font-medium leading-tight mb-6">
            {title}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 max-w-3xl">
            {industries.length > 0 ? (
              industries.map((tag, idx) => (
                <span key={idx} className="px-4 py-1 bg-[#f2f2f2] text-graphite text-sm font-medium rounded-lg">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No industries listed</span>
            )}
          </div>

          {/* Company Info Section - Only render if company info exists */}
          {hasCompanyInfo && (
            <>
              <div className="w-full h-px bg-[#cbcbcb] my-3"></div>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xs">
                  {companyLogo ? (
                    <Image
                      src={companyLogo}
                      alt="Company Logo"
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs">{companyName.slice(0, 7).toUpperCase()}</span>
                  )}
                </div>
                <div className="border-l border-[#cbcbcb] pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{companyName}</span>
                    {companyLocation && (
                      <>
                        <span className="text-[#cbcbcb]">•</span>
                        <span className="text-[#212121]">{companyLocation}</span>
                      </>
                    )}
                  </div>
                  {eventTypes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#212121] flex flex-wrap items-center gap-1">
                        {eventTypes.map((type, index) => (
                          <div key={index}>
                            <span>{type}</span>
                            {index !== eventTypes.length - 1 && (
                              <span className="text-[#cbcbcb]">•</span>
                            )}
                          </div>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Description */}
          <div className={`${hasCompanyInfo ? 'w-0' : 'w-full h-px bg-[#cbcbcb] my-3'}`}></div>
          <p className="text-graphite font-apfel-grotezk-regular font-medium mt-5">{description}</p>

          <div className={`w-full h-px bg-[#cbcbcb] my-6 ${hasCompanyInfo ? 'mt-5' : 'mt-44'}`}></div>

          {/* Engagement Metrics */}
          {/* <div className="flex justify-between mt-[1%] font-qimano">
            {[
              { label: "Views", count: "6,638" },
              { label: "Likes", count: "147" },
              { label: "Shares", count: "16" },
              { label: "Comments", count: "19" }
            ].map(({ label, count }, idx) => (
              <div className="text-center" key={idx}>
                <div className="text-2xl font-semibold text-[#212121]">{count}</div>
                <div className="text-sm text-[#cbcbcb]">{label}</div>
              </div>
            ))}
          </div> */}
              <div className="flex justify-between mt-[1%] font-qimano">
      {[
        { label: "Views", key: "impressions" }, // or "reach" depending what you fetch
        { label: "Likes", key: "likes" },
        { label: "Shares", key: "shares" },
        { label: "Comments", key: "comments" },
      ].map(({ label, key }, idx) => (
        <div className="text-center" key={idx}>
          <div className="text-2xl font-semibold text-[#212121]">
            {insights[key] ?? 0}
          </div>
          <div className="text-sm text-[#cbcbcb]">{label}</div>
        </div>
      ))}
    </div>

        </div>
      </div>
    </div>
  );
}
