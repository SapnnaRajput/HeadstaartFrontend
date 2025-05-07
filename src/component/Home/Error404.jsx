import React from 'react'
import { Link } from 'react-router-dom'

const Error404 = () => {
    return (
        <>
            <div className="container mx-auto my-40">
                <div className="flex flex-col bg-[#4A3AFF] rounded-xl place-items-center p-20">
                    <h1 className='text-9xl text-white'>404</h1>
                    <span className='my-5 text-white text-lg'>Sorry!</span>
                    <p className='mb-5 text-white text-lg'>The link is broken, try to refresh or go to home</p>
                    <Link to='/' className='bg-white text-black font-semibold px-7 py-4 rounded-xl'>Go To home</Link>
                </div>
            </div>
        </>
    )
}

export default Error404