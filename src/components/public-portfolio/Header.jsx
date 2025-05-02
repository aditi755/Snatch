import { motion } from "framer-motion";
import { useCheckScreenSize } from "@/utils/public-portfolio/portfolio";
import { useRouter, usePathname } from "next/navigation";
const Header = ({ formData, data, headerOpacity }) => {
  const router = useRouter();
  const pathname = usePathname(); 
  const isMobile = useCheckScreenSize(); // Detect mobile screen
  
  // Hide the header on mobile
  if (isMobile) return null;

  const handleRequest = () => {
    const parts = pathname.split("/");
    const influencerUsername = parts[2]; // assuming route is /public-portfolio/[username]
    router.push(`/request-popup?username=${influencerUsername}`);
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-[99%] z-20 py-2 mt-2 mx-2 lg:flex items-center rounded-3xl"
      style={{
        backgroundColor: "#7f7f7f",
        opacity: headerOpacity,
        height: "80px",
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.button className="bg-lime-yellow text-graphite font-semibold py-2 px-6 w-[300px] max-w-[300px] rounded font-apfel-grotezk-regular" onClick={handleRequest}>
          Send request
        </motion.button>

        <div className="flex items-center">
          <h1 className="text-5xl font-serif text-white flex items-center gap-1">
            {formData?.firstName
              ? formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1)
              : ""}
            {" "}
            {formData?.lastName
              ? formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1)
              : ""}
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-medium font-qimano">{data?.reach}</h2>
            <p className="text-md text-white font-apfel-grotezk-regular">avg reach</p>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-medium font-qimano">{data?.followers}</h2>
            <p className="text-md text-white font-apfel-grotezk-regular">followers</p>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-medium font-qimano">{data?.posts}</h2>
            <p className="text-md text-white font-apfel-grotezk-regular">posts</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
