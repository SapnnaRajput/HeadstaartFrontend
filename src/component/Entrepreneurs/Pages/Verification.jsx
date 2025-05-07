import React, { useState, useEffect } from 'react'
import profile from '../../../Assets/Images/agent-1.png'
import { Upload } from 'lucide-react';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';

const Verification = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    const [verify, setVerify] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = UserState();
    const [data, setData] = useState(null);

    const RequiredLabel = ({ text }) => (
        <div className="block text-base font-semibold mb-2 flex items-center">
            <span className="text-black">{text}</span>
            <span className="text-red-500 ml-0.5">*</span>
        </div>
    );

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseUrl}/customer_data`,
                    { customer_unique_id: user?.customer?.customer_unique_id },
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
                if (response.data.status) {
                    setData(response.data.customer_data)
                }
            } catch (error) {
                notify('error', 'Unauthorized access please login again');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user]);


    return (
        <>
            {loading && <Loader />}
            <div className="container ms-10 rounded-xl p-6 bg-white w-2/5">
                <div className="flex flex-col justify-center place-items-center">
                    <h1 className='text-xl font-semibold mb-6 text-[#05004E]'>Verification</h1>
                    <img src={profile} alt="" className='rounded-full h-36 w-36' />
                    {verify ? (
                        <>
                            <div className="my-5 flex justify-center place-items-center flex-col">
                                <div className="flex flex-row font-bold place-items-end mb-5">
                                    <h1 className='text-xl '>$ 29</h1>
                                    <span className='text-sm'>.00/Monthly</span>
                                </div>
                                <span className='text-center text-[#535763] text-sm w-1/2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam accumsan eros nec dolor tempus gravida.</span>
                                <label htmlFor="monthly" className='bg-white cursor-pointer py-3 shadow-xl rounded-lg flex flow-row place-items-center justify-between w-full px-8'>
                                    <div className="flex flex-row font-medium place-items-end my-5">
                                        <h1 className='text-xl'>$ 29</h1>
                                        <span className='text-sm'>.00/Monthly</span>
                                    </div>
                                    <input type="radio" name="verify" id="monthly" className='focus:ring-0' />
                                </label>
                                <label htmlFor="yearly" className='bg-white mt-4 cursor-pointer py-3 shadow-xl rounded-lg flex flow-row place-items-center justify-between w-full px-8'>
                                    <div className="flex flex-row font-medium place-items-end my-5">
                                        <h1 className='text-xl'>$ 199</h1>
                                        <span className='text-sm'>.00/Yearly</span>
                                    </div>
                                    <input type="radio" name="verify" id="yearly" className='focus:ring-0' />
                                </label>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className='font-bold text-base my-5'>Verify Your Profile </h1>
                            <div className="flex place-items-start flex-col w-full">
                                <RequiredLabel text='Enter Your ID No' />
                                <input
                                    type="text"
                                    placeholder="Type Here..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <RequiredLabel text='Upload ID Front Side Photo' />
                                <div className="w-full mb-5">
                                    <div className="text-[#7e7e80] flex flex-row place-items-center justify-between  py-3 px-5 border-[#E4E4E7] border-2 rounded-xl cursor-pointer">
                                        <span>Upload Here</span>
                                        <Upload />
                                    </div>
                                </div>
                                <RequiredLabel text='Upload ID Back Side Photo' />
                                <div className="w-full">
                                    <div className="text-[#7e7e80] flex flex-row place-items-center justify-between  py-3 px-5 border-[#E4E4E7] border-2 rounded-xl cursor-pointer">
                                        <span>Upload Here</span>
                                        <Upload />
                                    </div>
                                </div>
                                <RequiredLabel text='EIN' />
                                <input
                                    type="text"
                                    placeholder="Type Here..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <RequiredLabel text='Address ( Smiler to Uploaded ID )' />
                                <input
                                    type="text"
                                    placeholder="Type Here..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </>
                    )}

                    {verify ? (
                        <button className='px-14 py-3 text-white bg-[#4A3AFF] rounded-full mt-20'>Pay</button>
                    ) : (
                        <button onClick={() => setVerify(true)} className='px-14 py-3 text-white bg-[#4A3AFF] rounded-full'>Verify</button>
                    )}
                </div >
            </div >
        </>
    )
}

export default Verification