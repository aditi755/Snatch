import Image from "next/image";
export default function PostNavigation({ onPrev, onNext }) {
    return (
      <div className="fixed inset-y-0 left-24 right-24 flex items-center justify-between pointer-events-none">
        <button
          onClick={onPrev}
          className="pointer-events-auto p-2 text-white rounded-r-lg  transition-colors"
          aria-label="Previous post"
        >
          <Image src="/assets/images/Lefthand.svg" alt="left-arrow" width={32} height={32} className="w-28 h-28"/>
          <p className="text-electric-blue -mt-7">Prev</p>
        </button>
        
        <button
          onClick={onNext}
          className="pointer-events-auto p-4  text-white rounded-l-lg transition-colors"
          aria-label="Next post"
        >
           <Image src="/assets/images/Righthand.svg" alt="left-arrow" width={32} height={32} className="w-28 h-28"/>
           <p className="text-electric-blue -mt-7">Next</p>
        </button>
      </div>
    );
  }