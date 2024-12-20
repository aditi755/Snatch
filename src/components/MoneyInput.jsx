export default function MoneyInput({ title, placeholder, value, onChange }) {
    return (
      <div className="flex items-center justify-between border border-gray-300 rounded-lg w-[186px] h-[54px] px-3">
        <span className="text-sm text-dark-grey">{title}</span>
  
        <div className="h-full w-px bg-gray-300 mx-2"></div>
  
        {/* Input and $ sign on the right */}
        <div className="flex items-center">
          <input
            type="text"
            value={value}
            placeholder={placeholder || "0.00"}
            className="outline-none text-graphite text-right w-full text-sm  placeholder-gray-400"
            onChange={(e) => onChange(e.target.value)} // Pass updated value to the parent
          />
          <span className="text-graphite text-sm ml-1">₹</span>
        </div>
      </div>
    );
  }
  