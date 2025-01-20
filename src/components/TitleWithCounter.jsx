// const TitleWithCounter = ({ label, value, onChange, maxLength = 100, name }) => {
//   return (
//     <div className="p-4 border border-gray-300 rounded-md  w-[534px]">
//       <label className="block text-md text-black mb-1">{label}</label>
//       <div className="flex items-center justify-between">
//         <textarea
//           name={name} // Pass the name prop
//           maxLength={maxLength}
//           value={value}
//           onChange={onChange} // Forward onChange
//           placeholder="Enter title here"
//           className="w-full border-b bg-transparent border-gray-300 focus:outline-none focus:border-gray-500 text-gray-800 text-sm font-apfelgrotesk mb-2"
//         />
//         <span className="text-sm text-gray-500">
//           {value.length}/{maxLength}
//         </span>
//       </div>
//     </div>
//   );
// };


// export default TitleWithCounter

const TitleWithCounter = ({ label, value, onChange, maxLength = 100, name }) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg w-[534px] ">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-md font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">
          {value.length}/{maxLength}
        </span>
      </div>
      <div className="relative">
        <textarea
          name={name}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder="Enter title here"
          className="bg-transparent w-full p-3 rounded-md border-t-2 border-gray-200 focus:outline-none text-gray-700 text-sm font-apfel-grotezk-regular resize-none"
          rows={2}
        />
      </div>
    </div>
  );
};

export default TitleWithCounter;