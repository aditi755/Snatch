// import { useState } from "react";

// const QuestionCounter = ({ value, onQuestionChange, onAnswerChange, maxLength = 100, name, type, answerValue, selectedQuestion, onSelectQuestion }) => {
//   const questionSets = {
//     general: [
//       "What is the impact of AI on healthcare?",
//       "How can technology improve education?",
//       "What are the benefits of remote work?",
//     ],
//     audience: [
//       "General Public",
//       "Healthcare Professionals",
//       "Educators",
//     ],
//     brand: [
//       "What defines your brand’s unique identity?",
//       "How do you engage with your audience?",
//       "What are your key brand values?",
//     ],
//   };

//   const questions = questionSets[type] || questionSets.general; // Default to "general" if type is undefined
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleSelect = (question, index) => {
//     console.log("slectedquestion: ", selectedQuestion)
//     const updatedQuestions = [...selectedQuestion]; // Clone array to avoid direct mutation
//     updatedQuestions[index] = question; // Update only the specific index
    
//     console.log("Updated questions array:", updatedQuestions); // Debugging log
    
//     onSelectQuestion([updatedQuestions]); // Update entire array in parent state
//     setDropdownOpen(false);
// };


//   return (
//     <div className="p-4 border border-gray-300 rounded-lg w-[534px] relative">
//       <div className="flex justify-between items-center mb-2">
//         <span className="block text-md font-medium text-gray-700">
//           {console.log('RENDER SELCTED QUESTIONS', selectedQuestion)}
//           {selectedQuestion || questions[0]}
//         </span>
//         <div
//           className="flex items-center cursor-pointer text-sm text-gray-500"
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//         >
//           <span className="ml-1">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//               className="w-4 h-4"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M12 15.5a.75.75 0 0 1-.53-.22l-6-6a.75.75 0 1 1 1.06-1.06L12 13.69l5.47-5.47a.75.75 0 0 1 1.06 1.06l-6 6a.75.75 0 0 1-.53.22z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </span>
//         </div>
//       </div>

//       {/* Dropdown menu */}
//       {dropdownOpen && (
//         <div className="absolute bg-white border border-gray-300 rounded-md w-[520px] mt-1 shadow-md z-10">
//           {questions.map((question, index) => (
//             <div
//               key={index}
//               className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
//               onClick={() => handleSelect(question, index)}
//             >
//               {question}
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="relative">
//         <textarea
//           name={name}
//           maxLength={maxLength}
//           value={answerValue}
//           onChange={onAnswerChange}
//           placeholder="Enter your response here..."
//           className="bg-transparent w-full p-3 rounded-md border-t-2 border-gray-200 focus:outline-none text-gray-700 text-sm font-apfel-grotezk-regular resize-none"
//           rows={2}
//         />
//         <span className="absolute bottom-2 right-3 text-xs text-gray-500">
//           {answerValue.length}/{maxLength}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default QuestionCounter;



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
      "What is the impact of AI on healthcare?",
      "How can technology improve education?",
      "What are the benefits of remote work?",
      "Other", // Add "Other" option
    ],
    audience: [
      "General Public",
      "Healthcare Professionals",
      "Educators",
      "Other", // Add "Other" option
    ],
    brand: [
      "What defines your brand’s unique identity?",
      "How do you engage with your audience?",
      "What are your key brand values?",
      "Other", // Add "Other" option
    ],
  };

  const questions = questionSets[type] || questionSets.general; // Default to "general" if type is undefined
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false); // Track if "Other" is selected

  const handleSelect = (question, index) => {
    if (question === "Other") {
      setIsOtherSelected(true); // Show input for custom question
      onSelectQuestion(""); // Reset selected question
    } else {
      setIsOtherSelected(false); // Hide input for custom question
      onSelectQuestion(question); // Update selected question
    }
    setDropdownOpen(false);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg w-[534px] relative">
      <div className="flex justify-between items-center mb-2">
        <span className="block text-md font-medium text-gray-700">
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
              className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
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
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
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
          className="bg-transparent w-full p-3 rounded-md border-t-2 border-gray-200 focus:outline-none text-gray-700 text-sm font-apfel-grotezk-regular resize-none"
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