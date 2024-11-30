import React, { useState } from "react";

const TitleWithCounter = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const maxTitleLength = 100;

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md w-[534px]">
      <label className="block text-md text-black mb-1">
        Give it a title
      </label>
      <div className="flex items-center justify-between">
        <textarea
          type="text"
          maxLength={maxTitleLength}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title here"
          className="w-full border-b bg-transparent border-gray-300 focus:outline-none focus:border-gray-500 text-gray-800 text-lg mb-2"
        />
        <span className="text-sm text-gray-500">
          {title.length}/{maxTitleLength}
        </span>
      </div>
     
    </div>
  );
};

export default TitleWithCounter;
