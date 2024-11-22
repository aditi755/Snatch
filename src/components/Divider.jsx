const Divider = ({ text }) => (
    <div className="flex mt-10 items-center justify-center w-full">
      <div className="border-b-2 border-gray-600 w-[128px]"></div>
      <span className="mx-4 text-gray-600 text-lg">{text}</span>
      <div className="border-b-2 border-gray-600 w-[128px]"></div>
    </div>
  );