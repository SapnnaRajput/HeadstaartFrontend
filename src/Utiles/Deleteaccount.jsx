import React, { useState } from 'react'
import Loader from './Loader'

const Deleteaccount = () => {

    const [custData, setCustData] = useState({
        name: '',
        email: '',
        mobile: '',
    })

    const [error, setError] = useState()
    const [done, setDone] = useState()
    const [loading, setLoading] = useState(false)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustData({ ...custData, [name]: value });
    };

    const handle = () => {

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!custData?.name) {
            setError('Please Enter Name')
            return
        }
        if (!custData?.email) {
            setError('Please Enter Email')
            return
        }
        if (!custData?.mobile) {
            setError('Please Enter Mobile Number')
            return
        }
        if (!emailRegex.test(custData.email)) {
            setError('Enter Valid E-mail Formate');
            return;
        }
        if (custData?.mobile?.length != 10) {
            setError('Please Enter 10-Digit Mobile Number')
            return
        }
        setLoading(true)

        setTimeout(() => {
            setDone('Your request has been submitted successfully. Your account will be deleted in next 7 days')
            setLoading(false);
        }, 3000);


        setError()
    }

    return (
        <>
            {loading && <Loader />}
            <div className="h-screen flex justify-center place-items-center bg-gray-200">
                <div className="w-1/3 rounded-lg bg-white flex justify-center place-items-center flex-col py-10">
                    <h1 className='text-center font-semibold text-3xl'>Delete Data Request</h1>
                    <div className="px-5 space-y-5 mt-8">
                        <span className='text-center mt-5 text-neutral-500'>Please fill in your details to submit a data deletion request</span>
                        {error &&
                            <div className="bg-red-100 rounded-lg p-2">
                                <h1 className='text-red-500'>{error}</h1>
                            </div>
                        }
                        {done &&
                            <div className="bg-green-200 rounded-lg p-2">
                                <h1 className='text-green-500'>{done}</h1>
                            </div>
                        }
                        <div className="flex flex-col w-full">
                            <span className={`text-[#918C8C] text-sm  text-nowrap`}>Name</span>
                            <input type='text' onChange={handleInputChange} value={custData.name} name='name' placeholder='Enter Your Name' className='border-[#C0BDBD] text-sm focus-within:border-black focus:ring-0 mt-2 text-black border-2 px-3 py-2 no-arrows rounded-md' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                        </div>
                        <div className="flex flex-col w-full">
                            <span className='text-sm text-[#918C8C] text-nowrap'>E-Mail</span>
                            <input type='email' name='email' placeholder='Enter Your E-Mail' value={custData.email} onChange={handleInputChange} className='border-[#C0BDBD] text-sm focus-within:border-black focus:ring-0 mt-2 text-black border-2 px-3 py-2 no-arrows rounded-md' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                        </div>
                        <div className="flex flex-col w-full">
                            <span className={`text-[#918C8C] text-sm  text-nowrap`}>Mobile No.</span>
                            <input type='number' onChange={handleInputChange} value={custData.mobile} name='mobile' placeholder='Enter mobile number' className='border-[#C0BDBD] text-sm focus-within:border-black focus:ring-0 mt-2 text-black border-2 px-3 py-2 no-arrows rounded-md' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                        </div>
                        <button onClick={handle} className="px-5 py-2.5 text-base w-full font-medium text-white bg-[#4A3AFF] rounded-lg hover:bg-[#3D32CC] shadow-sm transition-all duration-200">submit request</button>
                        <p className='text-center mt-5 text-neutral-500 '>By submitting this form, you agree to our data deletion policy and terms of service.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Deleteaccount