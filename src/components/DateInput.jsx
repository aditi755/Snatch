import React, { useState, useEffect, useRef } from "react";

export default function DatePicker4({ value, onChange, placeholder }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const datepickerRef = useRef(null);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      const dayString = day.toLocaleDateString("en-US");
      let className =
        "flex items-center justify-center cursor-pointer w-[40px] 2xl:w-[35px] h-[46px] rounded-full text-dark-3 hover:bg-primary hover:text-white";

      if (selectedDate && dayString === selectedDate) {
        className += " bg-primary text-white";
      }

      daysArray.push(
        <div
          key={i}
          className={className}
          data-date={dayString}
          onClick={() => handleDayClick(dayString)}
        >
          {i}
        </div>
      );
    }

    return daysArray;
  };

  const handleDayClick = (selectedDay) => {
    setSelectedDate(selectedDay);
  };

  const updateInput = () => {
    return selectedDate || "";
  };

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  const handleApply = () => {
    onChange(selectedDate); // Pass the selected date directly
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setIsOpen(false);
  };

  const handleDocumentClick = (e) => {
    if (datepickerRef.current && !datepickerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <section className="bg-white w-1/2 -ml-2">
      <div className="container">
        <div className="flex w-[385px]">
          <div className="w-full px-4">
            <div className="mb-0">
              <div className="relative" ref={datepickerRef}>
                <div className="relative flex items-center">
                  <span className="absolute left-0 pl-5 text-dark-5">
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 3.3125H15.8125V2.625C15.8125 2.25 15.5 1.90625 15.0937 1.90625C14.6875 1.90625 14.375 2.21875 14.375 2.625V3.28125H5.59375V2.625C5.59375 2.25 5.28125 1.90625 4.875 1.90625C4.46875 1.90625 4.15625 2.21875 4.15625 2.625V3.28125H2.5C1.4375 3.28125 0.53125 4.15625 0.53125 5.25V16.125C0.53125 17.1875 1.40625 18.0937 2.5 18.0937H17.5C18.5625 18.0937 19.4687 17.2187 19.4687 16.125V5.25C19.4687 4.1875 18.5625 3.3125 17.5 3.3125ZM2.5 4.71875H4.1875V5.34375C4.1875 5.71875 4.5 6.0625 4.90625 6.0625C5.3125 6.0625 5.625 5.75 5.625 5.34375V4.71875H14.4687V5.34375C14.4687 5.71875 14.7812 6.0625 15.1875 6.0625C15.5937 6.0625 15.9062 5.75 15.9062 5.34375V4.71875H17.5C17.8125 4.71875 18.0625 4.96875 18.0625 5.28125V7.34375H1.96875V5.28125C1.96875 4.9375 2.1875 4.71875 2.5 4.71875ZM17.5 16.6562H2.5C2.1875 16.6562 1.9375 16.4062 1.9375 16.0937V8.71875H18.0312V16.125C18.0625 16.4375 17.8125 16.6562 17.5 16.6562Z"
                        fill=""
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="w-full pl-[50px] pr-4 py-2 border rounded focus:outline-none"
                    placeholder={placeholder}
                    readOnly
                    value={value}
                    onClick={toggleDatepicker}
                  />
                </div>

                {isOpen && (
                  <div className="absolute top-[100%] mt-2 p-2  bg-white border rounded shadow-md z-20">
                    <div className="flex items-center justify-between mb-4">
                      {/* <select
                        value={currentDate.getFullYear()}
                        onChange={(e) =>
                          setCurrentDate(
                            new Date(e.target.value, currentDate.getMonth())
                          )
                        }
                        className="px-4 py-2 border rounded"
                      >
                        {Array.from({ length: 100 }, (_, i) =>
                          new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select> */}

                     <select
                      value={currentDate.getFullYear()}
                      onChange={(e) =>
                        setCurrentDate(
                          new Date(e.target.value, currentDate.getMonth())
                        )
                      }
                      className="px-4 py-2 border rounded"
                    >
                      {Array.from(
                        { length: 2012 - 1926 + 1 }, // Calculate the number of years from 1926 to 2012
                        (_, i) => 2012 - i // Generate years in descending order from 2012 to 1926
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select> 
                      
                      <select
                        value={currentDate.getMonth()}
                        onChange={(e) =>
                          setCurrentDate(
                            new Date(currentDate.getFullYear(), e.target.value)
                          )
                        }
                        className="px-4 py-2 border rounded"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>
                            {new Date(0, i).toLocaleString("en-US", {
                              month: "long",
                            })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {renderCalendar()}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button
                        className="px-4 py-2 bg-gray-300 text-dark-3 rounded"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-primary text-white rounded"
                        onClick={handleApply}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
