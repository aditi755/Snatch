
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";

const Questionnaire = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="lg:mt-10 pb-40 ml-10 ">
          <h3 className="lg:text-6xl text-2xl font-qimano text-electric-blue mb-4">About Radhika</h3>  
          <div className="mt-5 lg:mt-10 pb-5 lg:pb-40 overflow-x-auto">
        <div className="flex gap-4 w-max rounded-3xl overflow-hidden lg:max-w-[1600px]">
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

    </div>
  );
};

// 🟡 QuestionCard component inside the same file
const QuestionCard = ({ question, answer, coverImage, cardType }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex border rounded-3xl w-[165px] h-[228px] lg:w-[360px] lg:h-[500px] overflow-hidden cursor-pointer"
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
        <p className={clsx("text-center font-qimano", cardType.text)}>
          {question}
        </p>

        {hovered && (
          <p
            className={clsx(
              "text-xs text-center font-apfel-grotezk-regular mt-4",
              cardType.text
            )}
          >
            {answer}
          </p>
        )}
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
