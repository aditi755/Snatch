

import React, { useRef } from "react";
import PieChart from "./PieChart";
import SimpleWorldMap from "./Map";
import AgeRangeChart from "./AgeRangeChart";

const Audience = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    console.log("scroll function is clicked");
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return ( 
    <div className="relative mt-5 w-[100%] flex" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-md z-10"
      >
        ◀
      </button>

      {/* Scrollable Content */}
      <div className="overflow-x-auto mx-12 w-full max-w-[40vw] bg-white no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div ref={scrollRef} className="flex gap-6 w-max min-w-full">
          {[
            { title: "Gender", component: <PieChart /> },
            { title: "Country", component: <SimpleWorldMap /> },
            { title: "Age Range", component: <AgeRangeChart /> },
          ].map((item, index) => (
            <div
              key={index}
              className="w-[285px] h-[500px] bg-gray-100 rounded-md flex flex-col items-center p-4"
            >
              <h1 className="text-2xl">{item.title}</h1>
              <div className="mt-5">{item.component}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-md z-10"
      >
        ▶
      </button>
    </div>
  );
};

export default Audience;
