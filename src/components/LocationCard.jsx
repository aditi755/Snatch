import React from 'react'
import Image from 'next/image'
const LocationCard = () => {
  return (
    <div className='w-[697px] h-[200px] bg-white border-2 rounded-md flex px-2 space-x-1'>
   
   <div className='flex flex-row w-[319px] h-[180px] mt-2 ml-3'>
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

   <div className='flex flex-col w-[319px] h-[180px] mt-2 ml-3 p-2'>
  {[
    { id: '01', city: 'New York', percentage: '30%' },
    { id: '02', city: 'London', percentage: '45%' },
    { id: '03', city: 'Tokyo', percentage: '60%' },
  ].map((item, index) => (
    <div 
      key={item.id} 
      className={`flex flex-row w-[300px] h-[48px] text-2xl justify-between items-center ${
        index !== 2 ? 'border-b border-gray-300' : ''
      }`}
    >
      <span className='text-graphite w-[50px]'>{item.id}</span>
      <span className='text-graphite w-[150px] text-center'>{item.city}</span>
      <span className='text-electric-blue w-[50px] text-right'>{item.percentage}</span>
    </div>
  ))}
</div>



    </div>
  )
}

export default LocationCard