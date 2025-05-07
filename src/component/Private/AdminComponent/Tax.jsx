import React, { useEffect, useState } from 'react'
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';
import CustomButton from '../../../Utiles/CustomButton';

const Tax = () => {



    const { user } = UserState();
    const [loading, setLoading] = useState(false);
    const [cust, setCust] = useState()
    const baseUrl = import.meta.env.VITE_APP_BASEURL;



    const getCustdata = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user_data`, {
                user_id: user?.user_id
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                setCust(response.data.user_data);
            }
        } catch (error) {
            notify("error", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCustdata();
    }, [])


    const handleaddInfoChange = (e) => {
        const { name, value } = e.target;
        setCust({ ...cust, [name]: value });
    };


    const updateStripe = async () => {
        if (!cust?.template_tax) {
            notify('danger', `Please Enter Template Tax`);
            return false;
        }
        if (!cust?.template_service_fee) {
            notify('danger', `Please Enter Template Service Fee`);
            return false;
        }
        if (!cust?.subscription_government_tax) {
            notify('danger', `Please Enter Subscription Goverment Tax`);
            return false;
        }
        if (!cust?.subscription_service_amount) {
            notify('danger', `Please Enter Subscription Service Amount`);
            return false;
        }
        if (!cust?.lead_government_tax) {
            notify('danger', `Goverment Tax`);
            return false;
        }
        if (!cust?.lead_service_tax) {
            notify('danger', `Please Enter Service Tax`);
            return false;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/update_key_admin `, {
                ...cust,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                notify('success', `Stripe credentials Update Successfully`);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false)
    }


    return (
        <>
            {loading && <Loader />}
            <div className="p-5 ">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="flex flex-col gap-2">
                        <span>Template Tax</span>
                        <input type="text" className='rounded-md' onChange={handleaddInfoChange} value={cust?.template_tax} name='template_tax' placeholder='Enter Template Tax' />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span>Template Service Fee</span>
                        <input type="text" className='rounded-md' onChange={handleaddInfoChange} value={cust?.template_service_fee} name='template_service_fee' placeholder='Enter Template Service Fee' />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span>Subscription Goverment Tax</span>
                        <input type="text" className='rounded-md' onChange={handleaddInfoChange} value={cust?.subscription_government_tax} name='subscription_government_tax' placeholder='Enter Subscription Goverment Tax' />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span>Subscription Service Amount</span>
                        <input type="text" className='rounded-md' onChange={handleaddInfoChange} value={cust?.subscription_service_amount} name='subscription_service_amount' placeholder='Enter Subscription Service Amount' />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span>Goverment Tax</span>
                        <input type="text" className='rounded-md' onChange={handleaddInfoChange} value={cust?.lead_government_tax} name='lead_government_tax' placeholder='Enter Goverment Tax' />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span>Service Tax</span>
                        <input type="text" className='rounded-md' onChange={handleaddInfoChange} value={cust?.lead_service_tax} name='lead_service_tax' placeholder='Enter Service Tax' />
                    </div>
                </div>
                <div className="flex justify-center flex-row gap-5 mt-5">
                    <CustomButton onClick={getCustdata} cancel={true} label={'cancel'} />
                    <CustomButton onClick={updateStripe} label={'update'} />
                </div>
            </div>
        </>
    )
}

export default Tax