"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
const Questionnaire = ({ name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Define desktopScrollRef for desktop scrollable area and mobileScrollRef for mobile scrollable area
  const desktopScrollRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const [scrollResetTrigger, setScrollResetTrigger] = useState(0);

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

  if (loading) return <div>Loading...</div>;

  // Function to scroll for desktop view
  const scrollDesktop = (direction) => {
    const container = desktopScrollRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={clsx(
      "relative pb-10 ml-4",
      "lg:mt-10 lg:ml-10",
      "flex flex-col"
    )}>
      <h3 className=" text-[45px] lg:text-6xl text-2xl font-qimano text-electric-blue mb-4">About {name}</h3>

      {/* Mobile view: horizontal scroll with snap and partial next card visibility */}
      <div className="lg:hidden relative flex-grow flex justify-center items-center">
        {allCards.length > 0 && (
          <div
            ref={mobileScrollRef}
            className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={() => setScrollResetTrigger(prev => prev + 1)}
          >
            {allCards.map((card, index) => (
              <div
                key={card.key}
                className="flex-shrink-0 snap-center"
                style={{
                  width: '85vw',
                  marginRight: (index < allCards.length - 1) ? '5vw' : '0',
                  marginLeft: (index === 0) ? '5vw' : '0'
                }}
              >
                <QuestionCard
                  question={card.question}
                  answer={card.answer}
                  coverImage={card.coverImage}
                  cardType={card.cardType}
                  isMobile
                  scrollResetTrigger={scrollResetTrigger}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop view: horizontal scroll */}
     <div className="hidden lg:block relative flex-grow">
  {/* Left Scroll Button */}
  <button
    onClick={() => scrollDesktop("left")}
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
    ref={desktopScrollRef}
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
    onClick={() => scrollDesktop("right")}
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

const QuestionCard = ({ question, answer, coverImage, cardType, isMobile = false, scrollResetTrigger }) => {
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleTouchStart = () => {
    if (isMobile) {
      setTouched(true);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      setTouched(false);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsRevealed(!isRevealed);
    }
  };

  // Reset revealed state when card changes
  useEffect(() => {
    setIsRevealed(false);
  }, [question, scrollResetTrigger]);

  return (
    <div
      className={clsx(
        "relative flex border rounded-3xl overflow-hidden cursor-pointer shrink-0 transition-transform duration-300",
        isMobile ? "w-[65vw] h-[450px]" : "w-[360px] h-[500px] mr-3",
        isMobile && touched ? "-translate-y-4" : ""
      )}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <Image
        src={coverImage || "/default-image.jpg"}
        alt="Preview"
        className="w-full h-full object-cover"
        width={165}
        height={228}
      />

      {/* Overlay for 'Click to reveal' on mobile when not revealed */}
      {isMobile && !isRevealed && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bottom-20 font-qimano  bg-black/40 text-white text-[38px] ">
          <p>Click to reveal</p>
        </div>
      )}

      <div
        className={clsx(
          `absolute left-0 bottom-0 w-full flex flex-col items-center justify-center transition-all duration-300 rounded-t-xl`,
          cardType.bg,
          cardType.text,
          isMobile ? (isRevealed ? "h-[100%]" : "h-[50%]") : (hovered ? "h-[100%]" : "h-[50%]")
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

        {(isMobile ? isRevealed : hovered) && (
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