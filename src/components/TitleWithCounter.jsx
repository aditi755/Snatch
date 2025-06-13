const TitleWithCounter = ({ label, value, onChange, maxWords = label === "Give it a title" ? 12 : 30, name }) => {
  
  // Helper function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Handler to enforce word limit
  const handleChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length <= maxWords) {
      onChange(e);
    } else {
      // If over limit, truncate to max words
      const truncatedText = words.slice(0, maxWords).join(' ');
      onChange({
        ...e,
        target: {
          ...e.target,
          value: truncatedText
        }
      });
    }
  };

  const currentWords = countWords(value);

  return (
    <div className="p-4 border border-gray-300 rounded-lg w-[534px]">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-md font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">
          {currentWords}/{maxWords} words
        </span>
      </div>
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder="Enter text here"
          className="bg-transparent w-full p-3 rounded-md border-t-2 border-gray-200 focus:outline-none text-gray-700 text-sm font-apfel-grotezk-regular resize-none"
          rows={2}
        />
      </div>
    </div>
  );
};

export default TitleWithCounter;