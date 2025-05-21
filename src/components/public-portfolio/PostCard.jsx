"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostCard({ post, postId, username, allPosts }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!username || !postId) {
      console.error("Missing required props:", { username, postId });
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      // Only fetch insights for Instagram posts
      if (post.media.source === "instagram") {
        try {
          const url = `/api/public-portfolio/media-insights?username=${encodeURIComponent(
            username
          )}&postId=${encodeURIComponent(postId)}`;

          const res = await fetch(url);
          const data = await res.json();

          if (data.success) {
            const insightsArray = data.insights.data;
            const insightsMap = {};

            insightsArray.forEach((item) => {
              insightsMap[item.name] = item.values?.[0]?.value || 0;
            });

            setInsights(insightsMap);
          } else {
            throw new Error(data.error || "Failed to fetch insights");
          }
        } catch (error) {
          console.error("Error fetching insights:", error);
          setInsights(null);
        }
      }
      setLoading(false);
    };

    fetchInsights();
  }, [username, postId, post.media.source]);

  const handleNavigation = (direction) => {
    if (!allPosts || allPosts.length === 0) return;

    const currentIndex = allPosts.findIndex((p) => p.mediaId === postId);
    let nextIndex;

    if (direction === "next") {
      nextIndex = currentIndex === allPosts.length - 1 ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex === 0 ? allPosts.length - 1 : currentIndex - 1;
    }

    const nextPost = allPosts[nextIndex];
    const pathname = window.location.pathname;
    const isAdminView = pathname.includes('/adminview');
    
    // Construct the URL based on whether it's admin view or not
    const baseUrl = `/${username}/media-kit${isAdminView ? '/adminview' : ''}/post`;
    router.push(`${baseUrl}/?postId=${nextPost.mediaId}`);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft") {
        handleNavigation("prev");
      } else if (event.key === "ArrowRight") {
        handleNavigation("next");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [postId, allPosts]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <p>No post found.</p>;

  const imageUrl = post.media?.files?.[0]?.url;
  const title = post.post?.titleName || "Untitled";
  const description = post.post?.description || "No description available.";
  const industries = post.post?.industries || [];
  const companyName = post.post?.companyName;
  const companyLocation = post.post?.companyLocation;
  const companyLogo = post.post?.companyLogo;
  const eventTypes = post.post?.eventTypes || [];

  const hasCompanyInfo =
    companyName &&
    (companyLocation || eventTypes.length > 0 || companyLogo);

  return (
    <div className="max-w-3xl md:max-w-4xl mx-auto p-2 md:p-0 font-sans bg-white mt-10 relative rounded-2xl md:shadow-lg">
      {/* Desktop navigation (fixed, outside card) */}
      <>
        <button
          onClick={() => handleNavigation("prev")}
          className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full shadow-lg p-2 border border-gray-200 hover:bg-gray-50 transition-all duration-200"
          aria-label="Previous"
        >
          <div className="w-14 h-14 flex items-center justify-center">
            <Image
              src="/assets/images/Lefthand.svg"
              alt="Previous"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-base text-electric-blue ml-2"></span>
        </button>
        <button
          onClick={() => handleNavigation("next")}
          className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full shadow-lg p-2 border border-gray-200 hover:bg-gray-50 transition-all duration-200"
          aria-label="Next"
        >
          <span className="text-base text-electric-blue mr-2"></span>
          <div className="w-14 h-14 flex items-center justify-center">
            <Image
              src="/assets/images/Righthand.svg"
              alt="Next"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
        </button>
      </>
      <div className="flex md:h-auto flex-col md:flex-row gap-0 md:gap-6 bg-white rounded-2xl overflow-hidden">
        {/* Media Section */}
        <div className="relative w-full md:w-[340px] flex-shrink-0 flex items-center justify-center bg-[#f7f7f7] p-0 md:p-6">
          <div className="relative w-full aspect-[4/5] max-w-[320px] max-h-[400px] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            {post.media?.type === "CAROUSEL" && post.media.files?.length > 0 ? (
              <div className="relative w-full h-full">
                <div className="w-full h-full overflow-hidden rounded-2xl">
                  <div className="flex overflow-x-hidden h-full">
                    {post.media.files.map((file, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-transform duration-500 h-full w-full ${carouselIndex === index ? "translate-x-0 opacity-100" : "translate-x-50 opacity-0"}`}
                      >
                        {file.type === "IMAGE" ? (
                          <Image
                            src={file.url}
                            alt={`Carousel image ${index + 1}`}
                            fill
                            className="object-cover rounded-2xl"
                          />
                        ) : file.type === "VIDEO" ? (
                          <video
                            controls
                            className="w-full h-full object-cover rounded-2xl"
                          >
                            <source src={file.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                {post.media.files.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex justify-center items-center z-10"
                      onClick={() =>
                        setCarouselIndex((prev) =>
                          prev === 0
                            ? post.media.files.length - 1
                            : prev - 1
                        )
                      }
                    >
                      ❮
                    </button>
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex justify-center items-center z-10"
                      onClick={() =>
                        setCarouselIndex((prev) =>
                          prev === post.media.files.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      ❯
                    </button>
                  </>
                )}
              </div>
            ) : post.media?.type === "VIDEO" ? (
              <video
                controls
                className="w-full h-full object-cover rounded-2xl"
              >
                <source src={post.media.files[0].url} type="video/mp4" />
              </video>
            ) : post.media?.type === "IMAGE" ? (
              <Image
                src={post.media.files[0].url}
                alt="Post media"
                fill
                className="object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                No Media Available
              </div>
            )}
            {/* Play Icon and Views Overlay */}
            <div className="absolute left-3 bottom-3 flex items-center gap-2 bg-black/60 rounded-lg px-2 py-1">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#fff"/><path d="M7.5 6.5L12 9L7.5 11.5V6.5Z" fill="#212121"/></svg>
              <span className="text-white text-base font-semibold">{insights?.impressions ?? 0}</span>
            </div>
          </div>
        </div>
        {/* Content Section */}
        <div className="flex-1 py-6 px-4 md:pr-8 flex flex-col justify-start md:justify-center md:pl-0 md:pt-8 md:pb-8">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-[1.45rem]  font-normal text-base font-qimano  text-[#212121] leading-tight max-w-[90%] md:max-w-[95%]">
              {title}
            </h2>
            <button
              className="w-10 h-10 ml-2 mt-1"
              onClick={() => router.push(`/${username}/media-kit`)}
              aria-label="Go to Portfolio"
            >
              <Image
                src="/assets/icons/cross-mark.svg"
                alt="Go to Portfolio"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2 mt-1">
            {industries.length > 0 ? (
              industries.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#f2f2f2] text-graphite text-[0.95rem] font-medium font-inter rounded-lg"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-[0.95rem]">No industries listed</span>
            )}
          </div>
          <div className="w-full h-px bg-[#cbcbcb] my-3"></div>
          {hasCompanyInfo && (
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs">
                {companyLogo ? (
                  <Image
                    src={companyLogo}
                    alt="Company Logo"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs">{companyName.slice(0, 7).toUpperCase()}</span>
                )}
              </div>
              <div className="border-l border-[#cbcbcb] pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[1rem]">{companyName}</span>
                  {companyLocation && (
                    <>
                      <span className="text-[#cbcbcb]">•</span>
                      <span className="text-[#212121] text-[1rem]">{companyLocation}</span>
                    </>
                  )}
                </div>
                {eventTypes.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#212121] text-[0.95rem] flex flex-wrap items-center gap-1">
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
          )}
          <p className="text-graphite font-apfel-grotezk-regular font-sm mt-2 mb-2 text-[0.93rem] leading-snug max-w-[95%]">
            {description}
          </p>

          {/* Only show engagement metrics for Instagram posts */}
          {post.media.source === "instagram" && (
            <>
              <div className={`w-full h-px bg-[#cbcbcb] my-6 ${
                hasCompanyInfo ? "mt-5" : "mt-44"
              }`}></div>
              <div className="flex justify-between mt-[1%] font-qimano">
                {[
                  { label: "Views", key: "impressions" },
                  { label: "Likes", key: "likes" },
                  { label: "Shares", key: "shares" },
                  { label: "Comments", key: "comments" },
                ].map(({ label, key }, idx) => (
                  <div className="text-center" key={idx}>
                    <div className="text-2xl font- text-[#212121]">
                      {insights?.[key] ?? 0}
                    </div>
                    <div className="text-sm text-graphite">{label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Mobile navigation (unchanged, at bottom) */}
      <div className="md:hidden relative mt-6 flex justify-between items-center w-full px-4">
        <button
          onClick={() => handleNavigation("prev")}
          className="flex flex-col items-center space-y-1 group"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <Image
              src="/assets/images/Lefthand.svg"
              alt="Previous"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm text-gray-700 group-hover:underline">Prev</span>
        </button>
        <button
          onClick={() => handleNavigation("next")}
          className="flex flex-col items-center space-y-1 group"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <Image
              src="/assets/images/Righthand.svg"
              alt="Next"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm text-gray-700 group-hover:underline">Next</span>
        </button>
      </div>
    </div>
  );
}