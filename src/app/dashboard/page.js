import React from 'react'
import DashboardCard from '@/components/DashboardCard'
import LocationCard from '@/components/LocationCard'

const page = () => {
  return (
    <div className="relative flex flex-col">

    <div className="mb-[500px] flex gap-8">
      <DashboardCard count={6} label={"Profile Visit"}/>
      <DashboardCard count={8} label={"Request Received"}/>
      <DashboardCard  count={4} label={"Avg time spent"}/>
    </div>

      <div className="absolute top-32">
        <LocationCard /> 
      </div>



    <div className="absolute top-[340px] ">
    <div className="w-[699px] h-[330px] bg-light-grey">


  <div className="flex gap-4">
  <div className="max-w-[333px] h-[300px] flex flex-col ">
    <p className='mx-auto mt-20 text-2xl'>Explore Influencers</p>
    <p className="px-10 mt-3">Influencers leverage various platforms, such as social media and videos, to share content, promote products and engage with their followers.</p>
  </div>

  <div className="w-[333px] h-[300px] mt-5 bg-white">
    <p>Influencer info</p>
  </div>
  </div>

    </div>
    </div>
      




    </div>
  )
}

export default page