import Image from "next/image";

const LoadingTransition = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="animate-pulse mb-4">
        <Image
          src="/assets/images/loading.svg" 
          alt="Loading"
          width={64}
          height={64}
          className="w-16 h-16"
        />
      </div>
      <p className="text-electric-blue font-qimano text-md lg:text-2xl animate-pulse mx-auto">
        Fetching Portfolio of your favorite influencers...
      </p>
    </div>
  );
};

export default LoadingTransition;