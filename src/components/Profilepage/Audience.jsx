import React from 'react'
import PieChart from './PieChart'
import SimpleWorldMap from './Map'
import AgeRangeChart from './AgeRangeChart'

const Audience = () => {
  return (
    <div className="flex gap-10 mt-5 overflow--x-hidden">
      <div className="w-[285px] h-[500px] bg-gray-100 rounded-md">
      <h1 className='text-2xl text-center'>Gender</h1>
      <div className="mt-5">
      <PieChart />
      </div>
      </div>

      <div className="w-[285px] h-[500px] bg-gray-100">
      <h1 className='text-2xl text-center'>Country</h1>
      <div className="mt-5">
      <SimpleWorldMap />
      </div>
      </div>

      <div className="w-[285px] h-[500px] bg-gray-100">
      <h1 className='text-2xl text-center'>Age Range</h1>
      <div className="mt-5">
      <AgeRangeChart />
      </div>
      </div>

      
    </div>
  )
}

export default Audience

