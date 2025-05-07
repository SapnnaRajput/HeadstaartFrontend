import React from 'react'
import Footer from './Foooter'


import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import UpcomingEvents from './Upcomingevent';
import { ArrowRight, Mail, User } from 'lucide-react';


const Blog = ({ data }) => {


    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-4 place-items-center justify-center py-20">
                    <span className='text-[#666666] font-semibold text-base'>OUR BLOGS</span>
                    <h1 className='text-4xl font-semibold'>Find our all blogs from here</h1>
                    <p className='md:w-1/2 text-center w-full'>our blogs are written from very research research and well known writers writers so that  we can provide you the best blogs and articles articles for you to read them all along</p>
                    <div className="grid grid-cols-3 gap-7 mt-10">
                        {data.map((list, i) => (
                            <Link to={'/blog/' + list.id} className="hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-out p-2 rounded-md" key={i}>
                                <img src={list.img} alt="" className='rounded-xl aspect-square object-cover' />
                                <div className="mt-10">
                                    <div className="flex flex-row gap-5">
                                        <h1 className='font-semibold text-xs pb-5'>{list.ctg}</h1>
                                        <span className='font-medium text-xs text-[#999999]'>{list.date}</span>
                                    </div>
                                    <h1 className='font-bold text-lg pb-5'>{list.title}</h1>
                                    <p className='text-base text-[#666666] pb-5'>{list.text}</p>
                                    <Link className='font-semibold text-lg text-[#4A3AFF] border-b  border-[#4A3AFF]'>Read More...</Link>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <UpcomingEvents />
            {/* <div className="flex justify-center place-items-center py-20 flex-col">
                <h1 className='text-4xl font-bold'>Reach our <span className='text-[#4A3AFF]'>Help Desk</span> for support</h1>
                <p className='text-center text-base font-medium w-1/4 my-10 text-[#B0B0B0]'>Questions? Need assistance? Our dedicated support team is here to help you every step of the way:</p>
                <div className="flex flex-row gap-8 place-items-center">
                    <div className="flex flex-row gap-5 place-items-center">
                        <label htmlFor='name' className="flex flex-row gap-3 rounded-2xl place-items-center border-2 p-1.5 overflow-hidden border-[#666666] focus-within:border-[#4A3AFF]">
                            <div className="text-[#4A3AFF]">
                                <User />
                            </div>
                            <input type="text" name="name" id="name" className='border-0 focus:ring-0' placeholder='Enter Your First Name' />
                        </label>
                        <label htmlFor='email' className="flex flex-row gap-3 rounded-2xl place-items-center border-2 p-1.5 overflow-hidden border-[#666666] focus-within:border-[#4A3AFF]">
                            <div className="text-[#4A3AFF]">
                                <Mail />
                            </div>
                            <input type="text" name="email" id="email" className='border-0 focus:ring-0' placeholder='Enter Your Email Address' />
                        </label>
                    </div>
                    <button className='bg-[#4A3AFF] text-white flex flex-row place-items-center gap-5 rounded-2xl py-4 px-6 hover:scale-105 transition-all duration-300 ease-out'>Contact us
                        <div className="bg-white h-5 w-5 text-[#4A3AFF] flex justify-center place-items-center rounded-full">
                            <ArrowRight size={18} />
                        </div>
                    </button>
                </div>
            </div> */}
            <Footer />
        </>
    )
}

export default Blog