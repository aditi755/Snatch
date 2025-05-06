"use client";
import Image from "next/image";

const SendRequestPopup = ({ onClose, username }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      brandName: e.target[0].value,
      role: e.target[1].value,
      email: e.target[2].value,
      bio: e.target[3].value,
      discussion: e.target[4].value,
      influencerUsername: username, // coming from props
    };
  
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Request sent successfully!");
      } else {
        alert(data.error || "Failed to send request.");
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl shadow-xl relative border border-gray-200">
        {/* Close icon */}
        <button className="absolute top-4 right-4" onClick={onClose}>
          <Image
            src="/assets/icons/settings/Cross.svg"
            alt="Close"
            width={24}
            height={24}
          />
        </button>

        {/* Header */}
        <h2 className="text-[18px] font-medium text-[#0037eb] mb-6 font-qimano leading-none">
          Send request to :&nbsp;
          <span className="font-semibold inline-flex items-center gap-2 text-black align-middle">
            <Image
              src="/assets/images/popupImg.svg"
              alt="Profile"
              width={30}
              height={30}
              className="rounded-full"
            />
            {username}
            <Image
              src="/assets/icons/verify.svg"
              alt="Verified"
              width={18}
              height={18}
            />
          </span>
        </h2>

        {/* Form */}
        <form className="space-y-5 font-apfel">
          {/* First Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Name of the Company/Brand*"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Your role in the company/Brand*"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Company/Brand Email id*"
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Company Bio */}
          <div className="p-4 border border-gray-300 rounded-xl bg-white">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-black">
                Company Bio*
              </label>
              <span className="text-xs text-gray-400">100/200</span>
            </div>
            <textarea
              placeholder="Tell us a little about your brand, audience and what you stand for."
              className="w-full border-none outline-none resize-none text-sm text-gray-700 placeholder:text-gray-400"
              rows={4}
              maxLength={200}
              required
            />
          </div>

          {/* What would you like to discuss? */}
          <div className="p-4 border border-gray-300 rounded-xl bg-white">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-black">
                What would you like to discuss?*
              </label>
              <span className="text-xs text-gray-400">100/200</span>
            </div>
            <textarea
              placeholder="Share a quick brief – what’s the collab about?"
              className="w-full border-none outline-none resize-none text-sm text-gray-700 placeholder:text-gray-400"
              rows={4}
              maxLength={200}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-[#0037eb] hover:bg-blue-700 text-white font-apfel font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendRequestPopup;
