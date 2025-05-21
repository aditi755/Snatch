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
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [username, postId]);

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

  if (loading) return <div>Loading insights...</div>;
  if (!insights) return <div>No insights available</div>;
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
    <div className="max-w-6xl mx-auto p-4 font-sans bg-white mt-10">
      <div className="flex md:h-[70%] flex-col md:flex-row gap-8 bg-gray-100/40 rounded-lg overflow-hidden">
        {/* Media Section */}
        <div className="relative w-full md:w-[35%] md:px-8 md:py-12 aspect-[4/5]">
          <div className="relative w-full h-full">
            {post.media?.type === "CAROUSEL" &&
            post.media.files?.length > 0 ? (
              <div className="relative w-full h-full">
                <div className="w-full h-full overflow-hidden rounded-3xl">
                  <div className="flex overflow-x-hidden h-full">
                    {post.media.files.map((file, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-transform duration-500 h-full w-full ${
                          carouselIndex === index
                            ? "translate-x-0 opacity-100"
                            : "translate-x-50 opacity-0"
                        }`}
                      >
                        {file.type === "IMAGE" ? (
                          <Image
                            src={file.url}
                            alt={`Carousel image ${index + 1}`}
                            fill
                            className="object-cover rounded-3xl"
                          />
                        ) : file.type === "VIDEO" ? (
                          <video
                            controls
                            className="w-full h-full object-cover rounded-3xl"
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
                className="w-full h-full object-cover rounded-3xl"
              >
                <source src={post.media.files[0].url} type="video/mp4" />
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

        {/* Content Section */}
        <div className="flex-1 py-6 px-4 md:pr-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-graphite font-qimano text-2xl font-medium leading-tight mb-6">
              {title}
            </h2>

          {/* Title */}
          <h2 className="text-graphite font-qimano text-2xl font-medium leading-tight mt-5">
                  {title}
          </h2>

<button
  className="w-6 h-6 mb-6"
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

          {/* Industries */}
          <div className="flex flex-wrap gap-2  max-w-3xl">
            {industries.length > 0 ? (
              industries.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1 bg-[#f2f2f2] text-graphite text-sm font-medium rounded-lg"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">
                No industries listed
              </span>
            )}
          </div>

          {/* Company Info */}
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
                    <span className="text-white text-xs">
                      {companyName.slice(0, 7).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="border-l border-[#cbcbcb] pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{companyName}</span>
                    {companyLocation && (
                      <>
                        <span className="text-[#cbcbcb]">•</span>
                        <span className="text-[#212121]">
                          {companyLocation}
                        </span>
                      </>
                    )}
                  </div>
                  {eventTypes.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
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

          <div
            className={`${
              hasCompanyInfo ? "w-0" : "w-full h-px bg-[#cbcbcb] my-3"
            }`}
          ></div>

          <p className="text-graphite font-apfel-grotezk-regular font-medium mt-5">
            {description}
          </p>

          <div
            className={`w-full h-px bg-[#cbcbcb] my-6 ${
              hasCompanyInfo ? "mt-5" : "mt-44"
            }`}
          ></div>

          {/* Engagement Metrics */}
          <div className="flex justify-between mt-[1%] font-qimano">
            {[
              { label: "Views", key: "impressions" },
              { label: "Likes", key: "likes" },
              { label: "Shares", key: "shares" },
              { label: "Comments", key: "comments" },
            ].map(({ label, key }, idx) => (
              <div className="text-center" key={idx}>
                <div className="text-2xl font- text-[#212121]">
                  {insights[key] ?? 0}
                </div>
                <div className="text-sm text-[#cbcbcb]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev/Next Buttons Section */}
      <div className="relative mt-6 flex justify-between items-center w-full px-4 md:px-12">
        {/* Prev */}
        <button
          onClick={() => handleNavigation("prev")}
          className="flex flex-col items-center space-y-1 group"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <Image
              src="/assets/images/Lefthand.svg"
              alt="Previous"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm md:text-base text-gray-700 group-hover:underline">
            Prev
          </span>
        </button>
<p>hello</p>
        {/* Next */}
        <button
          onClick={() => handleNavigation("next")}
          className="flex flex-col items-center space-y-1 group"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <Image
              src="/assets/images/Righthand.svg"
              alt="Next"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm md:text-base text-gray-700 group-hover:underline">
            Next
          </span>
        </button>
      </div>
    </div>
  );
}
