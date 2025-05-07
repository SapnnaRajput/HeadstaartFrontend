import React, { useState } from 'react'
import pdf from '../../../Assets/Images/PDF.png'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Pitchready = () => {

    const [display, setDisplay] = useState(false);


    return (
        <>
            <div className="bg-white container mx-auto rounded-xl p-5 mb-64 h-full">
                <h1 className='text-3xl font-semibold text-[#05004E] mb-7'>Your Pitch Deck is Ready</h1>
                <span className=' text-[#1B2B41B8] font-medium text-base'>You can now review and customize your deck</span>
                <div className="rounded-xl shadow-xl flex flex-row place-items-center gap-4 mt-5 mb-10 p-4">
                    <img src={pdf} alt="" />
                    <div className="flex flex-col">
                        <h1 className='font-medium text-[#324054] text-base'>Pitch Deck.pdf</h1>
                        <span className='text-sm text-[#71839B] font-normal'>313 KB</span>
                    </div>
                </div>
                <div className="flex justify-center place-items-center">
                <button className="border border-[#4C4DDC] rounded-xl text-[#4C4DDC] py-3 font-bold text-base px-28">
                    {display ? 'Share with Investors' : 'Edit'}
                </button>
                </div>
                {display ? (
                    <>
                        <button className="border bg-[#4C4DDC] w-full rounded-xl text-white mt-5 py-3 font-bold text-base px-28">
                            Download as PDF
                        </button>
                        <div className="flex mt-5 flex-row justify-between place-items-center">
                            <h1 className='font-medium text-base'>Receive AI or Investor Feedback</h1>
                            <label className="inline-flex items-center cursor-pointer text-nowrap ">
                                <input type="checkbox" className="sr-only peer" value='active'
                                // checked={user.status === "Active"}
                                // onClick={() => updatestatus(user.user_id, user.status, "user")}
                                />
                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                            </label>
                        </div>
                        <Link className='px-28 w-fit mx-auto mt-2 py-3 bg-[#4A3AFF] flex place-items-center gap-3 flex-row rounded-full text-white'>Done</Link>
                    </>
                ) : (

                    <Link onClick={() => setDisplay(true)} className='px-24 w-fit mx-auto mt-2 py-3 bg-[#4A3AFF] flex place-items-center gap-3 flex-row rounded-full text-white'>Next<ArrowRight /></Link>
                )
                }
            </div>
        </>
    )
}

export default Pitchready