
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { clsx } from "clsx";

const Questionnaire = ({name}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null); // for scrolling control
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching QUESTIONSSSs...");
        const pathnameParts = window.location.pathname.split("/");
        const username =
          pathnameParts[pathnameParts.length - 1] || pathnameParts[pathnameParts.length - 2];

        const url =  `/api/public-portfolio/questions?username=${username}`;

        const response = await fetch(url);
        const result = await response.json();
        setData(result.questionnaires || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchQuestions();
  }, []);

    const scroll = (direction) => {
    console.log("Scrolling", direction);
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (

  <div className="relative lg:mt-10 pb-10 ml-10">
  <h3 className="lg:text-6xl text-2xl font-qimano text-electric-blue mb-4">About {name}</h3>

  <div className="relative">
    <button
      onClick={() => scroll("left")}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-2xl p-2 shadow-md max-w-32 hover:bg-white transition-all"
    >
 <Image src="/assets/images/Lefthand.svg" alt="left-arrow" width={10} height={10} className="w-10 h-10"/>
  <p className="text-electric-blue -mt-2 text-sm">Prev</p>
    </button>

    <div
      ref={scrollRef}
      className="mt-5 lg:mt-10 pb-5 lg:pb-0 overflow-x-auto scrollbar-hide"    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="flex gap-4 w-max rounded-3xl overflow-hidden  px-2">
        {data.flatMap((item) =>
          item.sections.flatMap((section) =>
            section.questions.map((q, i) => (
              <QuestionCard
                key={`${section.section}-${i}`}
                question={q.question}
                answer={q.answer}
                coverImage={q.coverImage}
                cardType={getCardType(section.section)}
              />
            ))
          )
        )}
      </div>
    </div>

    <button
      onClick={() => scroll("right")}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-2xl p-2 shadow-md text-electric-blue hover:bg-white transition-all"
    >
      {/* Replace with your right arrow icon */}
      <Image src="/assets/images/next.svg" alt="icon" height={10} width={10} className="w-10 h-10"/>

      <p className="text-electric-blue -mt-2 text-sm">Next</p>
    </button>
  </div>
</div>

  );
};

// 🟡 QuestionCard component inside the same file


const QuestionCard = ({ question, answer, coverImage, cardType }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex border rounded-3xl w-[300px] h-[510px] lg:w-[360px] lg:h-[500px] overflow-x-auto cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={coverImage || "/default-image.jpg"}
        alt="Preview"
        className="w-full h-full object-cover"
        width={165}
        height={228}
      />

      <div
        className={clsx(
          `absolute left-0 bottom-0 w-full flex flex-col items-center justify-center transition-all duration-300 rounded-t-xl`,
          cardType.bg,
          cardType.text,
          hovered ? "h-[100%]" : "h-[50%]"
        )}
      >
        <Image
          src={cardType.icon}
          alt="icon"
          height={10}
          width={10}
          className="w-20 h-17 mt-1"
        /> 
        <p className={clsx("text-center lg:text-xl font-qimano", cardType.text)}>
          {question}
        </p>

        {hovered && (
          <p
            className={clsx(
              "text-xs lg:text-xl text-center font-apfel-grotezk-regular mt-4",
              cardType.text
            )}
            >
         
            {answer}
          </p>
        )}
     
       <p className="mt-2 font-apfel-grotezk-regular text-xs  text-center ">
        {cardType.bg === "bg-lime-yellow"
          ? "About"
          : cardType.bg === "bg-graphite"
          ? "Audience"
          : cardType.bg === "bg-electric-blue"
          ? "Brand"
          : ""}
      </p>

      </div>
    </div>
  );
};

// 🔵 Helper function to determine card type
function getCardType(section) {
  switch (section) {
    case "about":
      return {
        bg: "bg-lime-yellow",
        text: "text-black",
        icon: "/assets/images/aboutIcon.svg",
      };
    case "brand":
      return {
        bg: "bg-electric-blue",
        text: "text-white",
        icon: "/assets/images/brandIcon.svg",
      };
    case "audience":
      return {
        bg: "bg-graphite",
        text: "text-lime-yellow",
        icon: "/assets/images/audienceIcon.svg",
      };
    default:
      return { 
        bg: "bg-gray-200",
        text: "text-black",
        icon: "/assets/images/defaultIcon.svg",
      };
  }
}

export default Questionnaire;
