// "use client";
// import React, { useRef } from "react";

// // Otp component now receives `otp` and `setOtp` from parent
// export default function Otp({ otp, setOtp }) {
//   const inputRefs = useRef([]);

//   const handleKeyDown = (e) => {
//     if (
//       !/^[0-9]{1}$/.test(e.key) &&
//       e.key !== "Backspace" &&
//       e.key !== "Delete" &&
//       e.key !== "Tab" &&
//       !e.metaKey
//     ) {
//       e.preventDefault();
//     }

//     if (e.key === "Delete" || e.key === "Backspace") {
//       const index = inputRefs.current.indexOf(e.target);
//       if (index > 0) {
//         setOtp((prevOtp) => [
//           ...prevOtp.slice(0, index - 1),
//           "",
//           ...prevOtp.slice(index),
//         ]);
//         inputRefs.current[index - 1].focus();
//       }
//     }
//   };

//   const handleInput = (e) => {
//     const { target } = e;
//     const index = inputRefs.current.indexOf(target);
//     if (target.value) {
//       setOtp((prevOtp) => [
//         ...prevOtp.slice(0, index),
//         target.value,
//         ...prevOtp.slice(index + 1),
//       ]);
//       if (index < otp.length - 1) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleFocus = (e) => {
//     e.target.select();
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const text = e.clipboardData.getData("text");
//     if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
//       return;
//     }
//     const digits = text.split("");
//     setOtp(digits);
//   };

//   return (
//     <section className="py-1">
//       <div className="container">
//         <form id="otp-form" className="flex gap-2">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               type="text"
//               maxLength={1}
//               value={digit}
//               onChange={handleInput}
//               onKeyDown={handleKeyDown}
//               onFocus={handleFocus}
//               onPaste={handlePaste}
//               ref={(el) => (inputRefs.current[index] = el)}
//               className="shadow-xs flex w-[64px] h-[64px] items-center justify-center rounded-md border border-gray-300 text-center text-2xl font-medium text-electric-blue outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue sm:text-4xl"
//             />
//           ))}
//         </form>
//       </div>
//     </section>
//   );
// }



"use client";
import React, { useRef } from "react";

export default function Otp({ otp, setOtp, onKeyDown }) {
  const inputRefs = useRef([]);

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.target);
      if (index > 0) {
        setOtp((prevOtp) => [
          ...prevOtp.slice(0, index - 1),
          "",
          ...prevOtp.slice(index),
        ]);
        inputRefs.current[index - 1].focus();
      }
    }

    // Call the parent's onKeyDown function if Enter is pressed
    if (e.key === "Enter") {
      onKeyDown(e);
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };

  return (
    <section className="py-1">
      <div className="container">
        <form id="otp-form" className="flex gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className="shadow-xs flex w-[64px] h-[64px] items-center justify-center rounded-md border border-gray-300 text-center text-2xl font-medium text-electric-blue outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue sm:text-4xl"
            />
          ))}
        </form>
      </div>
    </section>
  );
}