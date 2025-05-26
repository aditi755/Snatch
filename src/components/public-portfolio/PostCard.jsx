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
    <>
      {/* Cross icon: fixed for desktop, absolute/scrollable for mobile */}
      <button
        className="z-50 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center flex
          absolute right-2 top-2 w-7 h-7 min-w-[28px] min-h-[28px]
          md:fixed md:right-4 md:top-4 md:w-10 md:h-10 md:min-w-[40px] md:min-h-[40px]"
        onClick={() => router.push(`/${username}/media-kit`)}
        aria-label="Go to Portfolio"
      >
        <Image
          src="/assets/icons/cross-mark.svg"
          alt="Go to Portfolio"
          width={20}
          height={20}
          className="w-full h-full object-contain md:w-6 md:h-6"
        />
      </button>
      {/* Desktop navigation (fixed, outside card) */}
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
      </button>
      <button
        onClick={() => handleNavigation("next")}
        className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full shadow-lg p-2 border border-gray-200 hover:bg-gray-50 transition-all duration-200"
        aria-label="Next"
      >
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
      {/* Desktop layout: only for md+ screens */}
      <div className="hidden md:flex w-full justify-center mt-10">
        <div className="w-[864px] h-[430px] bg-white rounded-lg overflow-hidden shadow-md flex gap-5 h-full">
          {/* Media Section */}
          <div className="w-[300px] h-full flex items-center justify-center">
            {(() => {
              if (!post) {
                return <p className="text-graphite flex justify-center items-center h-[50vh]">No post selected</p>;
              }
              if (post.media?.type === "IMAGE") {
                return (
                  <div className="relative h-[400px] w-[260px] flex items-center justify-center">
                    <Image
                      src={post.media.files[0].url}
                      alt={post.media.files[0].name || 'Image'}
                      width={260}
                      height={400}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                );
              } else if (post.media?.type === "VIDEO") {
                return (
                  <div className="relative h-[400px] w-[260px] flex items-center justify-center">
                    <video
                      src={post.media.files[0].url}
                      controls
                      width={260}
                      height={400}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                );
              } else if (post.media?.type === "CAROUSEL" && post.media.files?.length > 0) {
                return (
                  <div className="relative h-[400px] w-[260px] rounded-lg overflow-hidden flex items-center justify-center">
                    {post.media.files.map((file, index) => (
                      <div
                        key={file.url}
                        className={`absolute inset-0 transition-transform duration-500 h-full w-full ${carouselIndex === index ? 'translate-x-0 opacity-100' : 'translate-x-50 opacity-0'}`}
                        style={{ padding: '0px' }}
                      >
                        {file.type === 'IMAGE' ? (
                          <div className="flex justify-center items-center h-full w-full rounded-lg">
                            <Image
                              src={file.url}
                              alt={`Media ${index}`}
                              width={260}
                              height={400}
                              className="h-full w-full rounded-lg object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex justify-center items-center h-full w-full rounded-lg">
                            <video
                              controls
                              className="h-full w-full rounded-lg object-cover"
                              src={file.url}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Carousel Navigation */}
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                      onClick={() => setCarouselIndex(carouselIndex === 0 ? post.media.files.length - 1 : carouselIndex - 1)}
                    >
                      ❮
                    </button>
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex justify-center items-center"
                      onClick={() => setCarouselIndex(carouselIndex === post.media.files.length - 1 ? 0 : carouselIndex + 1)}
                    >
                      ❯
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          {/* Details Section */}
          <div className="flex-1 h-full mt-5 pr-8 overflow-hidden">
            <p className="text-2xl text-graphite font-qimano break-words whitespace-normal">{post.post?.titleName || 'Title of the project'}</p>
            <div className="flex gap-1 flex-wrap max-w-xl">
              {post.post?.industries?.length > 0 ? (
                post.post.industries.map((industry, index) => (
                  <span
                    key={index}
                    className="bg-dark/10 text-dark-grey m-2 inline-block rounded border border-transparent py-1 px-2.5 text-xs font-medium"
                  >
                    {industry}
                  </span>
                ))
              ) : (
                <span>Industry</span>
              )}
            </div>
            <div className="w-full border-b-[0.5px] border-gray-300 mt-4"></div>
            <div className={`flex items-center space-x-4 ${post.post?.isBrandCollaboration ? 'mt-[3rem]' : 'mt-[0]'}`}> 
              {/* Brand Collaboration Section */}
              {post.post?.isBrandCollaboration && (
                <div className="brand-collaboration-section flex gap-3">
                  {/* Company Logo */}
                  {post.post.companyLogo ? (
                    <Image
                      src={post.post.companyLogo}
                      width={50}
                      height={50}
                      alt="Company Logo"
                      className="h-12 w-12 bg-cover rounded-full"
                    />
                  ) : (
                    <Image
                      src="/assets/images/logo.svg"
                      width={50}
                      height={50}
                      alt="CAI Logo"
                      className="h-12 w-12 object-contain rounded-full"
                    />
                  )}
                  {/* Divider */}
                  <div className="h-12 border-l border-gray-400"></div>
                  {/* Text Details */}
                  <div className="text-gray-500 text-sm space-y-1">
                    <p>
                      • <span className="text-graphite">{post.post.companyName || 'Name of company'}</span> • {post.post.companyLocation || 'Location of company'}
                    </p>
                    <p>
                      • {post.post.companyLocation || 'Location of company'}
                      {post.post.eventTypes?.length > 0 && (
                        <>
                          {' • '}
                          {post.post.eventTypes.map((eventType, index) => (
                            <span key={index} className="px-1 text-sm">{eventType}</span>
                          ))}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className={`${post.post?.isBrandCollaboration ? 'text-graphite mr-3 mt-5' : 'text-graphite mr-3 mt-0'} break-words whitespace-normal`}>
              {post.post?.description || 'Description of the project'}
            </p>
            <div className={`w-full border-b-[0.5px] border-gray-300 ${post.post?.isBrandCollaboration ? 'mt-8' : 'mt-40'}`}></div>
            {/* Metrics */}
            <div className="mt-5 mb-8 flex gap-20 justify-center items-center text-black w-full max-w-[400px] mx-auto">
              {insights && [
                { name: 'impressions', title: 'Views' },
                { name: 'likes', title: 'Likes' },
                { name: 'comments', title: 'Comments' },
                { name: 'shares', title: 'Shares' },
              ].map((item) => (
                <div key={item.name} className="flex-col text-center">
                  <p className="text-[19px]">{insights[item.name] || 0}</p>
                  <p className="text-[12px] text-gray-500">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile layout: only for mobile screens */}
      <div className="flex md:hidden flex-col w-full">
        {/* Media Section (mobile) */}
        <div className="relative w-full flex-shrink-0 flex items-center justify-center bg-[#f7f7f7] p-0">
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
        {/* Title (no cross icon here, it's now outside/absolute) */}
        <div className="flex items-start justify-between mt-2 mb-1 px-2 relative">
          <h2 className="text-[1.1rem] font-qimano text-[#212121] leading-tight max-w-[85%] min-h-[32px] flex items-center">
            {title}
          </h2>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2 mt-1 min-h-[24px] items-center px-2">
          {industries.length > 0 ? (
            industries.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#f2f2f2] text-graphite text-[0.85rem] font-medium font-inter rounded-lg"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-[0.85rem]">No industries listed</span>
          )}
        </div>
        {/* Company Info */}
        {hasCompanyInfo ? (
          <div className="flex items-center gap-3 mb-2 min-h-[36px] px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs">
              {companyLogo ? (
                <Image
                  src={companyLogo}
                  alt="Company Logo"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-xs">{companyName.slice(0, 7).toUpperCase()}</span>
              )}
            </div>
            <div className="border-l border-[#cbcbcb] pl-2">
              <div className="flex items-center gap-1 mb-1 min-h-[16px]">
                <span className="font-medium text-[0.95rem]">{companyName}</span>
                {companyLocation && (
                  <>
                    <span className="text-[#cbcbcb]">•</span>
                    <span className="text-[#212121] text-[0.95rem]">{companyLocation}</span>
                  </>
                )}
              </div>
              {eventTypes.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap min-h-[14px]">
                  <span className="text-[#212121] text-[0.8rem] flex flex-wrap items-center gap-1">
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
        ) : (
          <div className="min-h-[36px] mb-2"></div>
        )}
        {/* Description */}
        <p className="text-graphite font-apfel-grotezk-regular font-sm mt-1 mb-2 text-[0.85rem] leading-snug max-w-[98%] min-h-[28px] flex items-center px-2">
          {description}
        </p>
        {/* Engagement Metrics Section (only once, after description) */}
        <div className="w-full">
          <div className="w-full h-px bg-[#e5e5e5] mb-4"></div>
          <div className="w-full flex justify-between items-start px-1">
            {[
              { label: "Views", key: "impressions" },
              { label: "Likes", key: "likes" },
              { label: "Shares", key: "shares" },
              { label: "Comments", key: "comments" },
            ].map(({ label, key }) => (
              <div className="flex flex-col items-center min-w-[40px] text-center" key={key}>
                <div className="text-[1.25rem] leading-none font-qimano text-[#212121]">
                  {insights?.[key] ?? 0}
                </div>
                <div className="text-[0.85rem] text-graphite font-apfel-grotezk-regular mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Prev/Next navigation at bottom for mobile */}
        <div className="w-full flex justify-between items-center px-6 py-2 mt-2">
          <button
            onClick={() => handleNavigation("prev")}
            className="flex flex-col items-center space-y-1 group"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <Image
                src="/assets/images/Lefthand.svg"
                alt="Previous"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs text-gray-700 group-hover:underline">Prev</span>
          </button>
          <button
            onClick={() => handleNavigation("next")}
            className="flex flex-col items-center space-y-1 group"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <Image
                src="/assets/images/Righthand.svg"
                alt="Next"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs text-gray-700 group-hover:underline">Next</span>
          </button>
        </div>
      </div>
    </>
  );
}