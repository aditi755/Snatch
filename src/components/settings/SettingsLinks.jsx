import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsLinks() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const items = [
    {
      label: "Privacy policy",
      icon: "/assets/icons/settings/privacy.svg",
      href: "/privacy-policy",
    },
    {
      label: "Terms and Services",
      icon: "/assets/icons/settings/Terms.svg",
      href: "/terms",
    },
    {
      label: "Cookies policy",
      icon: "/assets/icons/settings/Cookies.svg",
      href: "/cookies",
    },
    {
      label: "Delete Account",
      icon: "/assets/icons/settings/Delete.svg",
      href: "#",
    },
    {
      label: "Logout",
      icon: "/assets/icons/settings/logout.svg",
      href: "/logout",
    },
  ];

  const handleItemClick = (label, href) => {
    if (label === "Delete Account") {
      setShowDeleteModal(true);
    } else if (label === "Logout") {
      router.push("/logout");
    } else {
      router.push(href);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    router.push("/delete-account");
  };

  return (
    <div className="space-y-2 mt-10">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => handleItemClick(item.label, item.href)}
          className="w-full text-left flex items-center justify-between border-b pb-3 hover:bg-gray-100 px-2 rounded transition group"
        >
          <div className="flex items-center gap-3">
            <Image src={item.icon} alt={item.label} width={18} height={18} />
            <span className="text-sm text-black group-hover:text-[#0037EB] transition-colors">
              {item.label}
            </span>
          </div>
          {item.label === "Delete Account" ? (
            <span className="text-gray-400 text-lg">…</span>
          ) : null}
        </button>
      ))}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[320px] sm:w-[400px]">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-md font-semibold">Hold on!</h2>
              <button onClick={() => setShowDeleteModal(false)}>
                <Image
                  src="/assets/icons/settings/Cross.svg" // replace this path with your actual cross icon
                  alt="Close"
                  width={16}
                  height={16}
                />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-700">
              Are you sure you want to delete your account? This action is
              permanent and all your data will be removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-blue-600 text-blue-600 rounded px-4 py-1 hover:bg-blue-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
