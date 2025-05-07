import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import CustomButton from '../../../Utiles/CustomButton'

const Growthplan = ({backGrowthPlan, nextGrowthPlan }) => {
    return (
        <div className="bg-white rounded-xl p-5 mb-64">
            <h1 className='text-3xl font-semibold text-[#05004E]'>Growth Plan</h1>
            <div className="w-full">
                <h1 className='text-lg font-medium text-[#1B2B41B8] mt-5 mb-3'>Business Vision<span className='text-red-600'>*</span></h1>
                <textarea name="" id="" className='border-2 rounded-xl py-3 px-2 w-full border-[#E4E4E7] focus:ring-0 focus:border-black' rows={6} placeholder='Text input to describe the business’s long-term vision' ></textarea>
            </div>
            <div className="w-full">
                <h1 className='text-lg font-medium text-[#1B2B41B8] mt-5 mb-3'>Goals for Next 5 Years<span className='text-red-600'>*</span></h1>
                <textarea name="" id="" className='border-2 rounded-xl py-3 px-2 w-full border-[#E4E4E7] focus:ring-0 focus:border-black' rows={6} placeholder='Text input to describe  the  Future Goal With Investor in next few years and planning ' ></textarea>
            </div>
            <div className='flex flex-row gap-5 mt-5'>
                <CustomButton label='Back' onClick={backGrowthPlan} />
                <CustomButton label='Next' onClick={nextGrowthPlan} />
            </div>
        </div>
    )
}

export default Growthplan