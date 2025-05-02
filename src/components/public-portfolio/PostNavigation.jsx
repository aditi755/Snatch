import Image from "next/image";

export default function PostNavigation({ onPrev, onNext }) {
  return (
    <div className="fixed inset-y-0 inset-x-0 flex items-center justify-between px-4 sm:px-10 md:px-20 pointer-events-none z-50">
      <button
        onClick={onPrev}
        className="pointer-events-auto p-2 text-white rounded-r-lg transition-colors flex flex-col items-center"
        aria-label="Previous post"
      >
        <Image
          src="/assets/images/Lefthand.svg"
          alt="left-arrow"
          width={32}
          height={32}
          className="w-12 h-12 sm:w-16 sm:h-16"
        />
        <p className="text-electric-blue -mt-2 text-sm sm:text-base">Prev</p>
      </button>

      <button
        onClick={onNext}
        className="pointer-events-auto p-2 text-white rounded-l-lg transition-colors flex flex-col items-center"
        aria-label="Next post"
      >
        <Image
          src="/assets/images/Righthand.svg"
          alt="right-arrow"
          width={32}
          height={32}
          className="w-12 h-12 sm:w-16 sm:h-16"
        />
        <p className="text-electric-blue -mt-2 text-sm sm:text-base">Next</p>
      </button>
    </div>
  );
}
