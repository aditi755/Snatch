"use client";
import Image from "next/image";

export default function PostCard({ post }) {
  if (!post) return <p>No post found.</p>;

  const imageUrl = post.media?.files?.[0]?.url;
  const title = post.post?.titleName || "Untitled";
  const description = post.post?.description || "No description available.";
  const industries = post.post?.industries || [];
  const companyName = post.post?.companyName || "Unknown Company";
  const companyLocation = post.post?.companyLocation || "Unknown Location";
  const eventYear = post.post?.eventYear || "Year not specified";
  const eventLocation = post.post?.eventLocation || "Unknown Location";
  const eventName = post.post?.eventName || "Unnamed Event";

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

          <div className="w-full h-px bg-[#cbcbcb] my-3"></div>

          {/* Profile Section */}
          <div className="flex items-center gap-4 mt-3">
            <div className="w-16 h-16 rounded-full bg-[#212121] flex items-center justify-center text-white text-xs">
              {companyName.slice(0, 7).toUpperCase()}
            </div>
            <div className="border-l border-[#cbcbcb] pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{companyName}</span>
                <span className="text-[#cbcbcb]">•</span>
                <span className="text-[#212121]">{companyLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#212121]">{eventYear}</span>
                <span className="text-[#cbcbcb]">•</span>
                <span className="text-[#212121]">{eventLocation}</span>
                <span className="text-[#cbcbcb]">•</span>
                <span className="text-[#212121]">{eventName}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-graphite font-apfel-grotezk-regular font-medium mt-5">{description}</p>

          <div className="w-full h-px bg-[#cbcbcb] my-6"></div>

          {/* Engagement Metrics */}
          <div className="flex justify-between mt-[1%] font-qimano">
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
          </div>
        </div>
      </div>
    </div>
  );
}
