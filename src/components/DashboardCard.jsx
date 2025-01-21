import React from 'react'

const DashboardCard = ({count,label}) => {
  return (
    <div className="w-[291px] 4xl:w-[320px] 5xl:w-[400px] h-[112px] 4xl:h-[140px] 5xl:h-[160px] bg-white rounded-md relative font-qimano flex-auto">
   <h5 className='absolute top-2 left-[86%]  5xl:text-6xl text-5xl font-medium '>
    {count}
   </h5>
   <h3 className="absolute top-[76%] left-2 text-[23px]">{label}</h3>
    </div>
  )
}

export default DashboardCard

// import React from 'react';

// const DashboardCard = ({ count, label }) => {
//   return (
//     <div className="w-full max-w-[400px] bg-white rounded-md relative font-qimano p-6 sm:p-8 lg:p-[8%] ">
//       <h5 className="absolute top-4 right-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium">
//         {count}
//       </h5>
//       <h3 className="absolute bottom-4 left-4 text-lg sm:text-xl md:text-2xl lg:text-3xl">
//         {label}
//       </h3>
//     </div>
//   );
// };

// export default DashboardCard;
