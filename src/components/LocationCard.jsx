import React from 'react'
import Image from 'next/image'
const LocationCard = () => {
  return (
    <div className='w-[57.5vw] h-[27vh] bg-white rounded-md flex justify-between px-2 space-x-1 font-qimano'>
   
   <div className='flex flex-row w-[50%]  h-[90%] mt-2 ml-3 '>
    <div className="flex flex-col justify-center items-center mx-auto">
    <Image className="mb-5" width={36} height={20} src="/assets/icons/dashboard/email.svg" alt="email"/>
    <p className='text-2xl'>Top 3 Location</p>
    <div className="flex gap-5 mt-3">
    <button className="w-[72px] h-[37px] bg-light-grey text-graphite border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
       Country
    </button>
    <button className="w-[72px] h-[37px] bg-light-grey text-graphite border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
      State
    </button>
    <button className="w-[72px] h-[37px] bg-light-grey text-graphite border border-light-grey rounded-md text-center font-medium hover:bg-electric-blue hover:text-white">
       City
    </button>
    </div>
    </div>
   </div>

   <div className='flex flex-col  w-[50%] h-[80%] 5xl:h-[80%]   mt-2 ml-3 p-2 place-content-center'>
  {[
    { id: '01', city: 'New York', percentage: '30%' },
    { id: '02', city: 'London', percentage: '45%' },
    { id: '03', city: 'Tokyo', percentage: '60%' },
  ].map((item, index) => (
    <div 
      key={item.id} 
      className={`flex flex-row w-[96%] h-[48px] text-[20px] 5xl:text-[25px] justify-between items-center p-7 ${
        index !== 2 ? 'border-b border-gray-300' : ''
      }`}
    >
      <span className='text-graphite w-[50px]'>{item.id}</span>
      <span className='text-graphite w-[150px] text-center '>{item.city}</span>
      <span className='text-electric-blue w-[50px] text-right'>{item.percentage}</span>
    </div>
  ))}
</div>

    </div>
  )
}

export default LocationCard