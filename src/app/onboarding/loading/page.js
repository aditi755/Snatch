import Image from "next/image";

export default function LoadingTransition() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="animate-pulse mb-4">
        <Image
          src="/assets/images/loading.svg"
          alt="Loading"
          width={64}
          height={64}
          className="w-16 h-16"
        />
      </div>
      <p className="text-electric-blue font-qimano text-md lg:text-2xl animate-pulse text-center">
        Snatching opportunities for you...
      </p>
    </div>
  );
}
