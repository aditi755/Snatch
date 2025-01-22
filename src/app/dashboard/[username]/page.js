import React from 'react'
import DashboardCard from '@/components/DashboardCard'
import LocationCard from '@/components/LocationCard'

const page = () => {

  return (
    <div className="relative flex flex-col p-3  ">

    <div className="mb-[500px] flex gap-3">
      <DashboardCard count={6} label={"Profile Visit"}/>
      <DashboardCard count={8} label={"Request Received"}/>
      <DashboardCard  count={4} label={"Avg time spent"} className="flex-auto"/>
      
    
    </div>

      <div className="absolute top-[21%] 4xl:top-[24%] 5xl:top-[27%] flex-auto">
        <LocationCard /> 
        <div className="absolute top-[110%]  font-qimano flex-auto">
    <div className="w-[58vw] h-[47vh] bg-gray-300 rounded-xl">


  <div className="flex gap-4">
  <div className="max-w-[50%] h-[300px] flex flex-col ">
    <p className='mx-auto mt-20 text-2xl'>Explore Influencers</p>
    <p className="px-10 mt-3">Influencers leverage various platforms, such as social media and videos, to share content, promote products and engage with their followers.</p>
  </div>

  <div className="w-[45%] h-[43vh] mt-2 bg-white rounded-md">
    <p>Influencer info</p>
  </div>
  </div>

    </div>
    </div>
      </div>
      
    </div>
  )
}

export default page