import React, {useState, useEffect} from 'react'
import PieChart from "../Profilepage/PieChart";
import SimpleWorldMap from "../Profilepage/Map";
import AgeRangeChart from "../Profilepage/AgeRangeChart";
const AudienceCard = () => {
  const [genderEndpoint, setGenderEndpoint] = useState("");
  const [ageEndpoint, setAgeEndpoint] = useState("");
  const [locationEndpoint, setLocationEndpoint] = useState("");

  useEffect(() => {
    const pathnameParts = window.location.pathname.split("/");
    const username =
      pathnameParts[pathnameParts.length - 1] ||
      pathnameParts[pathnameParts.length - 2];

    if (username) {
      setGenderEndpoint(`/api/public-portfolio/audience/genderDemographics?username=${username}`);
      setAgeEndpoint(`/api/public-portfolio/audience/allDemographics?username=${username}`);
      setLocationEndpoint(`/api/public-portfolio/audience/countryDemographics?username=${username}`);
    }
  }, []);

  return (
    <div className="lg:mt-10 w-full flex flex-col justify-center items-center mb-10">
    <h3 className="lg:text-6xl text-2xl font-qimano text-electric-blue text-center px-4 py-2 rounded-xl">
      Audience
    </h3>

    <p className="text-center text-lg font-qimano text-gray-600 mt-2 max-w-[600px]">
      Here are the demographics of your audience. This data is collected from your Instagram account and it will be visible to the public with your audience.
      </p>

    <div className='flex flex-col lg:flex-row gap-4 mt-5 lg:mt-1 w-full justify-center items-center lg:p-20'>
    {genderEndpoint && <PieChart apiEndpoint={genderEndpoint} />}
    {ageEndpoint && <AgeRangeChart apiEndpoint={ageEndpoint} />}
    {locationEndpoint && <SimpleWorldMap apiEndpoint={locationEndpoint} />}
    </div>

  </div>
  )
}

export default AudienceCard



// import React, { useRef } from "react";
// import PieChart from "../Profilepage/PieChart";
// import SimpleWorldMap from "../Profilepage/Map";
// import AgeRangeChart from "../Profilepage/AgeRangeChart";

// const AudienceCard = () => {
//   const scrollRef = useRef(null);

//   const scroll = (direction) => {
//     console.log("scroll function is clicked");
//     if (scrollRef.current) {
//       const scrollAmount = 300;
//       scrollRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   return ( 
//     <div className="relative mt-5 w-[100%] flex" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
//       {/* Left Scroll Button */}
//       <button
//         onClick={() => scroll("left")}
//         className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-md z-10"
//       >
//         ◀
//       </button>

//       {/* Scrollable Content */}
//       <div className="overflow-x-auto mx-12 w-full max-w-[40vw] bg-white no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
//         <div ref={scrollRef} className="flex gap-6 w-max min-w-full">
//           {[
//             { title: "Gender", component: <PieChart /> },
//             { title: "Country", component: <SimpleWorldMap /> },
//             { title: "Age Range", component: <AgeRangeChart /> },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className="w-[285px] h-[500px] bg-gray-100 rounded-md flex flex-col items-center p-4"
//             >
//               <h1 className="text-2xl">{item.title}</h1>
//               <div className="mt-5">{item.component}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Scroll Button */}
//       <button
//         onClick={() => scroll("right")}
//         className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-md z-10"
//       >
//         ▶
//       </button>
//     </div>
//   );
// };

// export default AudienceCard;
