"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
const Questionnaire = ({ name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const pathname = usePathname();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const parts = pathname.split("/").filter(Boolean);
        const username = parts[0];
        const url = `/api/public-portfolio/questions?username=${username}`;
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
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const allCards = data.flatMap((item) =>
    item.sections.flatMap((section) =>
      section.questions.map((q, i) => ({
        question: q.question,
        answer: q.answer,
        coverImage: q.coverImage,
        cardType: getCardType(section.section),
        key: `${section.section}-${i}`,
      }))
    )
  );

  const handlePrev = () => {
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => Math.min(prev + 1, allCards.length - 1));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative lg:mt-10 pb-10 ml-4 lg:ml-10">
      <h3 className="lg:text-6xl text-2xl font-qimano text-electric-blue mb-4">About {name}</h3>

      {/* Mobile view: one card with side buttons */}
      <div className="lg:hidden relative flex justify-center items-center">
        {currentCardIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-2xl p-2 shadow-md hover:bg-white"
          >
            <Image src="/assets/images/Lefthand.svg" alt="left-arrow" width={30} height={30} />
          </button>
        )}

        {allCards.length > 0 && (
          <QuestionCard
            question={allCards[currentCardIndex].question}
            answer={allCards[currentCardIndex].answer}
            coverImage={allCards[currentCardIndex].coverImage}
            cardType={allCards[currentCardIndex].cardType}
            isMobile
          />
        )}

        {currentCardIndex < allCards.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-2xl p-2 shadow-md hover:bg-white"
          >
            <Image src="/assets/images/next.svg" alt="right-arrow" width={30} height={30} />
          </button>
        )}
      </div>

      {/* Desktop view: horizontal scroll */}
     <div className="hidden lg:block relative">
  {/* Left Scroll Button */}
  <button
    onClick={() => scroll("left")}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-110 w-14 h-14"
    aria-label="Scroll Left"
  >
    <div className="w-full h-full">
      <Image
        src="/assets/images/Lefthand.svg"
        alt="left-arrow"
        width={56}
        height={56}
        className="w-full h-full object-contain"
      />
    </div>
  </button>

  {/* Scrollable Cards */}
  <div
    ref={scrollRef}
    className="mt-5 lg:mt-10 pb-5 lg:pb-0 overflow-x-auto scrollbar-hide max-w-full"
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    <div className="flex gap-4 w-full sm:w-max rounded-3xl overflow-hidden px-2">
      {allCards.map((card) => (
        <QuestionCard
          key={card.key}
          question={card.question}
          answer={card.answer}
          coverImage={card.coverImage}
          cardType={card.cardType}
        />
      ))}
    </div>
  </div>

  {/* Right Scroll Button */}
  <button
    onClick={() => scroll("right")}
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-110 w-8 h-14"
    aria-label="Scroll Right"
  >
    <div className="w-full h-full">
      <Image
        src="/assets/images/next.svg"
        alt="right-arrow"
        width={56}
        height={56}
        className="w-full h-full object-contain"
      />
    </div>
  </button>
</div>

    </div>
  );
};

const QuestionCard = ({ question, answer, coverImage, cardType, isMobile = false }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={clsx(
        "relative flex border rounded-3xl overflow-hidden cursor-pointer shrink-0 mr-3",
        isMobile ? "w-[90vw] h-[400px]" : "w-[360px] h-[500px]"
      )}
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

        <p className="mt-2 font-apfel-grotezk-regular text-xs text-center">
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
        text: "text-white",
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