const InputField = ({ type, placeholder }) => (
    <div className="relative w-full sm:w-[356px]">
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent rounded-md border border-stroke py-3 pl-5 text-dark-6 outline-none transition focus:border-primary"
      />
    </div>
  );
  