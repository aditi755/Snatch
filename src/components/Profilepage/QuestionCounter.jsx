import { useState } from "react";

const QuestionCounter = ({
  value,
  onQuestionChange,
  onAnswerChange,
  maxLength = 100,
  name,
  type,
  answerValue,
  selectedQuestion,
  onSelectQuestion,
}) => {
  const questionSets = {
    general: [
      "What’s one thing your content always delivers—no exceptions?",
      "What’s the wildest idea you’ve turned into content—and did it work?",
      "How do you stay real when the internet loves perfect?",
      "What’s one lesson you’ve learned about keeping things relatable?",
      "What’s your why—the thing that fuels your creativity?",
      "How do you stay ahead without losing yourself in trends?",
      "Other",
    ],
    audience: [
      "What’s the one question your DMs never stop asking?",
      "What’s one topic your followers can’t get enough of right now?",
      "What’s one product your audience still thanks you for recommending?",
      "How do you know when something’s actually connecting with your audience?",
      "What’s one thing your audience has taught you about your influence?",
      "How do you hope your audience feels after every post?",
      "Other", 
    ],
    brand: [
      "What’s one thing that makes a brand an instant yes for you?",
      "What’s the best feedback you’ve ever gotten from a collaboration?",
      "How do you make branded content feel anything but branded?",
      "What’s one thing you won’t compromise on in a partnership?",
      "What’s been your most unexpected collab—and why did it click?",
      "What’s one thing brands might not know about working with you?",
      "Other",  
    ],
  };

  const questions = questionSets[type] || questionSets.general; // Default to "general" if type is undefined
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false); // Track if "Other" is selected

  const handleSelect = (question, index) => {
    if (!question || question.trim() === "") {
      question = questions[0]; 
    }

    if (question === "Other") {
      setIsOtherSelected(true);
      onSelectQuestion(""); 
    } else {
      setIsOtherSelected(false); 
      onSelectQuestion(question); 
    }
    setDropdownOpen(false);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg w-[564px] relative">
      <div className="flex justify-between items-center mb-2">
        <span className="block text-md font-medium text-gray-700 font-apfel-grotezk-regular">
          {selectedQuestion || questions[0]}
        </span>
        <div
          className="flex items-center cursor-pointer text-sm text-gray-500"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="ml-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M12 15.5a.75.75 0 0 1-.53-.22l-6-6a.75.75 0 1 1 1.06-1.06L12 13.69l5.47-5.47a.75.75 0 0 1 1.06 1.06l-6 6a.75.75 0 0 1-.53.22z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute bg-white border border-gray-300 rounded-md w-[520px] mt-1 shadow-md z-10">
          {questions.map((question, index) => (
            <div
              key={index}
              className="p-2 text-sm hover:bg-gray-100 cursor-pointer font-apfel-grotezk-regular"
              onClick={() => handleSelect(question, index)}
            >
              {question}
            </div>
          ))}
        </div>
      )}

      {/* Custom question input */}
      {isOtherSelected && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Type your custom question..."
            value={value}
            onChange={onQuestionChange}
            className="w-full p-2 border border-gray-300 rounded-md font-apfel-grotezk-regular focus:outline-none"
          />
        </div>
      )}

      {/* Answer textarea */}
      <div className="relative mt-2">
        <textarea
          name={name}
          maxLength={maxLength}
          value={answerValue}
          onChange={onAnswerChange}
          placeholder="Enter your response here..."
          className="bg-transparent w-full p-3 rounded-md border-t-2 font-apfel-grotezk-regular border-gray-200 focus:outline-none text-gray-700 text-sm  resize-none"
          rows={2}
        />
        <span className="absolute bottom-2 right-3 text-xs text-gray-500">
          {answerValue.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default QuestionCounter;