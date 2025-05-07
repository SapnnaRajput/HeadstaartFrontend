import React from 'react'
import img from '../../../Assets/Images/template.png'

const Template = () => {

    const data = [
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
        {
            img: img,
            title: 'Ethics, Nature and Society',
        },
    ]
    return (
        <>
            <div className="bg-white rounded-xl p-5 mb-64">
                <h1 className='text-3xl font-semibold text-[#05004E]'>Choose Template</h1>
                <div className="grid grid-cols-4 mt-5 gap-5">
                    {data.map((list, index) => (
                        <div className="" key={index}>
                            <img src={list.img} alt="" className='rounded-xl' />
                            <h1 className='text-[#39434F] text-base font-normal mt-2'>{list.title}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Template