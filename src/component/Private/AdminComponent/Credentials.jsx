import React, { useEffect, useState } from 'react'
import { UserState } from '../../../context/UserContext';
import { notify } from '../../../Utiles/Notification';
import axios from 'axios';
import Loader from '../../../Utiles/Loader';
import CustomButton from "../../../Utiles/CustomButton";
import { Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const Credentials = () => {
    const navigate = useNavigate();
    const { user } = UserState();
    const [loading, setLoading] = useState(false);
    const [cust, setCust] = useState();
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [payment, setPayment] = useState(false);
    const [showTwoFAModal, setShowTwoFAModal] = useState(true);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const sendVerificationCode = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/send_2fa_code`, {
                user_id: user?.user_id,
                // email: user?.email
                email: 'sevents2010@gmail.com'
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                notify('success', 'Verification code sent to your email');
            }
        } catch (error) {
            notify('error', 'Failed to send verification code');
            navigate(-1);
        }
        setLoading(false);
    };

    const verifyCode = async () => {
        if (!verificationCode) {
            notify('error', 'Please enter verification code');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/verify_2fa_code`, {
                code: verificationCode
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                setIsVerified(true);
                setShowTwoFAModal(false);
                getCustdata();
                notify('success', 'Code Verified successfully');
                localStorage.setItem('2FA_Verified', true);
            } else {
                notify('error', 'Invalid verification code');
            }
        } catch (error) {
            notify('error', 'Verification failed');
            navigate(-1);
        }
        setLoading(false);
    };

    useEffect(() => {
        if ((user && !isVerified) && !localStorage.getItem('2FA_Verified')) {
            sendVerificationCode();
        }else{
            setIsVerified(true);
            setShowTwoFAModal(false);
            getCustdata();
        }
    }, [user]);

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
                setPayment(response.data.user_data.payment_accepted == '1' ? true : false)
            }
        } catch (error) {
            notify("error", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            getCustdata();
        }
    }, [user])

    const handleaddInfoChange = (e) => {
        const { name, value } = e.target;
        setCust({ ...cust, [name]: value });
    };


    const updateStripe = async () => {
        if (!cust?.stripe_key) {
            notify('danger', `Please Enter Stripe Key`);
            return false;
        }
        if (!cust?.secret_key) {
            notify('danger', `Please Enter Stripe Secret Key`);
            return false;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/update_key_admin `, {
                ...cust,
                payment_accepted: payment ? '1' : '0'
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

    if (!isVerified) {
        return (
            <Modal show={showTwoFAModal} onClose={() => navigate(-1)}>
                <Modal.Header>Two-Factor Authentication Required</Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        <p>Please enter the verification code sent to {user?.email?.replace(/(.{1}).*(@.*)/, '$1***$2')}</p>
                        <input
                            type="text"
                            className="w-full rounded-md border-gray-300"
                            placeholder="Enter verification code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={verifyCode}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Verify Code
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <>
            {loading && <Loader />}
            <div className="p-5 space-y-3">
                <h2>Stripe Credentials</h2>
                <div className="flex flex-col gap-2">
                    <span>Stripe Key</span>
                    <input type="text" className='rounded-md' onChange={handleaddInfoChange} value={cust?.stripe_key} name='stripe_key' placeholder='Enter Stripe Key' />
                </div>
                <div className="flex flex-col gap-2">
                    <span>Secret Key</span>
                    <input type="text" className='rounded-md' onChange={handleaddInfoChange} value={cust?.secret_key} name='secret_key' placeholder='Enter Secret Key' />
                </div>
                <div className="flex flex-row gap-5">
                    <span>Payment Accept</span>
                    <div className="flex flex-row gap-5">
                        <label htmlFor="1" onClick={() => setPayment(true)}><input type="radio" name="payment" id="1" className='checked:bg-black focus:ring-0' checked={payment} /> Yes</label>
                        <label htmlFor="0" onClick={() => setPayment(false)}><input type="radio" name="payment" id="0" className='checked:bg-black focus:ring-0' checked={!payment} /> No</label>
                    </div>
                </div>
                <div className="flex justify-center flex-row gap-5 mt-5">
                    <CustomButton onClick={getCustdata} cancel={true} label={'Cancel'} />
                    <CustomButton onClick={updateStripe} label={'Update'} />
                </div>
            </div>
        </>
    )
}

export default Credentials;