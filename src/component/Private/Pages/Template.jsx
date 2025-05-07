import React from 'react'
import Heading from '../../../Utiles/Heading'
import { Link } from 'react-router-dom'

const Template = () => {
    return (
        <>
            <div className="flex flex-row place-items-center justify-between">
                <Heading label='Legal Template' />
                <Link to='add-template' className="px-5 py-2.5 text-sm font-medium text-white bg-[#4A3AFF] rounded-lg hover:bg-[#3D32CC] shadow-sm transition-all duration-200">Upload New Legal Templates</Link>
            </div>
        </>
    )
}

export default Template