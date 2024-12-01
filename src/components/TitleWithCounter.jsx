const TitleWithCounter = ({ label, value, onChange, maxLength = 100, name }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md w-[534px]">
      <label className="block text-md font-bold text-black mb-1">{label}</label>
      <div className="flex items-center justify-between">
        <textarea
          name={name} // Pass the name prop
          maxLength={maxLength}
          value={value}
          onChange={onChange} // Forward onChange
          placeholder="Enter title here"
          className="w-full border-b bg-transparent border-gray-300 focus:outline-none focus:border-gray-500 text-gray-800 text-sm font-apfelgrotesk mb-2"
        />
        <span className="text-sm text-gray-500">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};


export default TitleWithCounter