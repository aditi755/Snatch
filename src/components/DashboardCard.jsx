import React from 'react'

const DashboardCard = ({count,label}) => {
  return (
    <div className="w-[211px] h-[112px] bg-white border-2 rounded-sm relative">
   <h5 className='absolute top-2 left-44 text-4xl'>
    {count}
   </h5>
   <h3 className="absolute top-[77px] left-2 text-2xl">{label}</h3>
    </div>
  )
}

export default DashboardCard