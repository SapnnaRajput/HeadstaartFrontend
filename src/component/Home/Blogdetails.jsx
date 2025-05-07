import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './Foooter';
import CustomButton from '../../Utiles/CustomButton';

const Blogdetails = ({ data }) => {

    const { id } = useParams();

    const blogData = data.find(list => list.id = id);

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4">
                <div className="py-14">
                    <div className="flex flex-row place-items-center gap-5">
                        <h1 className='font-semibold text-xs'>{blogData.ctg}</h1>
                        <span className='font-medium text-xs text-[#999999]'>16 March 2023</span>
                    </div>
                    <h1 className='text-[#666666] text-base font-semibold text-center'>OUR BLOGS</h1>
                </div>
                <h1 className='font-bold text-5xl text-center'>{blogData.title}</h1>
                <div className="h-[60vh]  w-full mt-8 rounded-2xl overflow-hidden px-20">
                    <img src={blogData.img} alt="" className='w-full h-full object-cover rounded-2xl' />
                </div>
                <div className="ps-20 text-[#666666]">
                    <p className='mt-10 text-start'>{blogData.desc}.</p>
                    <p className='mt-10 text-start'>{blogData.desc}.</p>
                    <p className='text-2xl font-normal mt-10 line-clamp-2 w-[72%] ps-10 border-l-4 border-[#4A3AFF]'>{blogData.thought}</p>
                    <h1 className="mt-7 font-medium text-base ps-10 text-black">- {blogData.by}</h1>
                    <p className='mt-10 text-start'>{blogData.desc}.</p>
                </div>
                <div className="h-96  w-full mt-8 rounded-2xl overflow-hidden px-56">
                    <img src={blogData.img} alt="" className='w-full h-full object-cover rounded-2xl' />
                </div>
                <p className='mt-10 text-start ps-20 text-[#666666]'>{blogData.desc}.</p>
                <div className="mt-20">
                    <div className="flex flex-row place-items-center justify-between">
                        <h1 className='font-semibold text-4xl'>Popular Post</h1>
                        <CustomButton label='View All' />
                    </div>
                    <div className="grid grid-cols-3 gap-7 mt-10">
                        {data.slice(0,3).map((list, i) => (
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
            <Footer />
        </>
    )
}

export default Blogdetails