import React from 'react'
import PieChart from './PieChart'
import SimpleWorldMap from './Map'

const Audience = () => {
  return (
    <div className="flex gap-10 mt-5">
      <div className="w-[285px] h-[500px] bg-gray-200 rounded-md">
      <h1 className='text-2xl text-center'>Gender</h1>
      <div className="mt-5">
      <PieChart />
      </div>
      </div>

      <div className="w-[285px] h-[500px] bg-gray-200">
      <h1 className='text-2xl text-center'>Gender</h1>
      <div className="mt-5">
      <SimpleWorldMap />
      </div>
      </div>

      
    </div>
  )
}

export default Audience