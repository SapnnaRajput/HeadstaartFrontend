import { MoveRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Heading = ({ label, to, view }) => {
    return (
        <>
            <div className={`flex flex-row ${view && 'px-3'} place-items-center justify-between`}>
                <h1 className='xl:text-3xl md:text-2xl text-xl font-medium text-center'>{label}</h1>
                {view &&
                    <Link to={to} className='font-medium text-base flex flex-row place-items-center gap-3 group'>View All<span className='group-hover:scale-125 transition-all duration-300 ease-out'><MoveRight /></span></Link>
                }
            </div>
        </>
    )
}

export default Heading