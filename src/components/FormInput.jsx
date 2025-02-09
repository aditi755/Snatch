//  const FormInput = ({...props }) => (
//     <div className="w-full">
  
//       <input
//         {...props}
//         className="w-full bg-transparent rounded-md border border-gray-300  py-[10px] px-5 text-graphite outline-none transition focus:border-electric-blue active:border-electric-blue active:text-electric-blue focus:text-electric-blue disabled:cursor-default disabled:bg-gray-2"
//       />
//     </div>
//   );

//   export default FormInput

import React, { useState } from 'react';

const FormInput = ({ ...props }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e) => {
    setIsFocused(false);
    setIsFilled(e.target.value.trim().length > 0); // Check if the field is filled
  };

  return (
    <div className="w-full">
      <input
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full bg-transparent rounded-md border py-[10px] px-5 outline-none transition 
          ${isFilled ? 'border-light-grey text-black' : isFocused ? 'border-electric-blue text-electric-blue' : 'border-gray-300'}
          disabled:cursor-default disabled:bg-gray-2`}
      />
    </div>
  );
};

export default FormInput;



  