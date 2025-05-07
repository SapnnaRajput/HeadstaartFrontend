import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { notify } from '../../../Utiles/Notification';
import { UserState } from '../../../context/UserContext';
import { BadgeCheck, Clock, Eye } from 'lucide-react';
import Loader from '../../../Utiles/Loader';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import CustomButton from '../../../Utiles/CustomButton';

const Blueticksingleuser = () => {


    const searchParams = new URLSearchParams(location.search);
    const all = searchParams.get('all');
    const investor = searchParams.get('investor');
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [loading, setLoading] = useState(false);
    const [single, setSingle] = useState(null)
    const [data, setData] = useState([])
    const [dataInvest, setDatainvest] = useState([])
    const { user } = UserState();
    const [to, setTo] = useState();
    const [from, setFrom] = useState();
    const [verID, setVerId] = useState(null)
    const [custID, setCustId] = useState(null)
    const [reason, setReason] = useState('')
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)

    const getAll = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_bluetick_verify_request_admin`, {
                min_date: from ? dateFormate2(from) : null,
                max_date: to ? dateFormate2(to) : null,
                status: null,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                setData(response.data.BlueTickData);
            } else {
                setData([]);

            }
        } catch (error) {
            notify("error", error.message);
        } finally {
            setLoading(false);
        }
    }

    const getAllinvest = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_fund_verify_request_admin`, {
                min_date: from ? dateFormate2(from) : null,
                max_date: to ? dateFormate2(to) : null,
                status: null,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                setDatainvest(response.data.FundDetail);
            } else {
                setDatainvest([]);
                // notify('error', response?.data?.message);
            }
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        getAll()
        getAllinvest()
    }, [])

    useEffect(() => {
        if (all) {
            const newData = data.find(list => list.blue_tick_verification_id == all)
            setSingle(newData)
        }
    }, [all, data])

    useEffect(() => {
        if (investor) {
            const newData = dataInvest.find(list => list.investor_fund_verification_id == investor)
            setSingle(newData)
        }
    }, [investor, dataInvest])

    const getType = (image) => {
        if (image == null) {
            return ''
        } else {
            return image.split('.').pop()
        }
    }

    const getName = (image) => {
        if (image == null) {
            return ''
        } else {
            return image.split('/').pop()
        }
    }

    const declineRequestinvest = async (id, verid) => {
        setVerId(verid)
        setCustId(id)
        setOpenModal(true)
    }

    const updateRequestinvest = async (id, verid, status) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/approve_investor_fund`, {
                investor_fund_verification_unique_id: verid,
                customer_unique_id: id,
                status: status,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                notify('success', response?.data?.message);
                navigate('/superadmin/blue-tick')
            } else {
                // notify("error", response?.data?.message);
            }
        } catch (error) {
            notify("error", error.message);
        } finally {
            setLoading(false);
        }
    }

    const updateRequestinvestdecliend = async () => {

        if (!reason) {
            notify("error", 'Please Enter Reason');
            return
        }

        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/approve_investor_fund`, {
                investor_fund_verification_unique_id: verID,
                customer_unique_id: custID,
                status: 'Decliend',
                decliend_reason: reason,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                notify('success', response?.data?.message);
                navigate('/superadmin/blue-tick')
                setOpenModal(false)
            } else {
                // notify("error", response?.data?.message);
            }
        } catch (error) {
            notify("error", error.message);
        } finally {
            setLoading(false);
        }
    }


    const updateRequest = async (id, bid, status) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/customer_approve_unapprove_bluetick`, {
                customer_unique_id: id,
                blue_tick_verification_id: bid,
                status: status,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                notify('success', response?.data?.message);
                navigate('/superadmin/blue-tick')
            } else {
                // notify("error", response?.data?.message);
            }
        } catch (error) {
            notify("error", error.message);
        } finally {
            setLoading(false);
        }
    }


    const getFileIcon = (extension) => {
        switch (extension) {
            case 'pdf':
                return (
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-red-600 text-xs font-bold">PDF</span>
                    </div>
                );
            case 'mp4':
                return (
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-500 text-xs font-bold">MP4</span>
                    </div>
                );
            case 'jpg':
                return (
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <span className="text-orange-500 text-xs font-bold">JPG</span>
                    </div>
                );
            case 'jpeg':
                return (
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <span className="text-orange-500 text-xs font-bold">JPEG</span>
                    </div>
                );
            case 'png':
                return (
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <span className="text-orange-500 text-xs font-bold">PNG</span>
                    </div>
                );
            case 'xls':
            case 'xlsx':
                return (
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">XLS</span>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                );
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className="p-5">
                <div className="bg-white h-fit rounded-xl p-5">
                    <div className="flex  justify-end">
                        {single?.verify_status === 'Pending' &&
                            <div className="flex items-center gap-2 rounded-full px-4 py-2 text-base text-yellow-600">
                                <Clock className="font-bold w-6 h-6 animate-pulse" />
                                <span className="font-bold text-base">Pending</span>
                            </div>
                        }
                        {single?.verify_status === 'Approved' &&
                            <div className="flex items-center gap-2 rounded-full px-4 py-2 text-base text-green-600">
                                <BadgeCheck className="font-bold  w-6 h-6 animate-pulse text-green-600" />
                                <span className="font-bold text-base">Verified</span>
                            </div>
                        }
                        {single?.verify_status === 'Decliend' &&
                            <div className="flex items-center gap-2 rounded-full px-4 py-2 text-base text-red-500">
                                {/* <BadgeCheck className="font-bold  w-6 h-6 animate-pulse text-red-500" /> */}
                                <span className="font-bold text-base">Decliend</span>
                            </div>
                        }
                    </div>
                    <div className="flex flex-row gap-3 place-items-center">
                        {single?.customer_profile_image ?
                            <img src={single?.customer_profile_image} alt="" className='md:h-36 h-24 w-24 md:w-36 rounded-full' />
                            :
                            <h1 className='h-24 w-24 rounded-full flex justify-center place-items-center bg-gray-200 text-2xl font-medium capitalize '>{single?.full_name?.charAt()}</h1>
                        }
                        <div className="grid grid-cols-1">
                            <h1 className='text-xl font-semibold capitalize'>{single?.full_name}</h1>
                            <h1 className='text-base text-neutral-500'>{single?.email}</h1>
                            <h1 className='text-base text-neutral-500'>ID : {single?.id_number}</h1>
                            <h1 className='text-base text-neutral-500'>Role : {single?.role}</h1>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h1 className='text-lg font-medium'>Details</h1>
                        <div className="mt-3 space-y-1">
                            {single?.address &&
                                <h1 className='text-base text-neutral-500'>Address : {single?.address}</h1>
                            }
                            {single?.net_worth &&
                                <h1 className='text-base text-neutral-500'>Net Worth : {single?.net_worth}</h1>
                            }
                            {single?.experience &&
                                <h1 className='text-base text-neutral-500'>Experience : {single?.experience} Years</h1>
                            }
                            {single?.website &&
                                <h1 className='text-base text-neutral-500 flex flex-row gap-2 place-items-center'>Website : <a className='text-blue-500 text-sm underline' href={single?.website} target='_blank'>{single?.website}</a></h1>
                            }
                            {single?.payment_method &&
                                <h1 className='text-base text-neutral-500'>Payment Method : {single?.payment_method}</h1>
                            }
                            {single?.payment_id &&
                                <h1 className='text-base text-neutral-500'>Payment ID : {single?.payment_id}</h1>
                            }
                            {single?.ein &&
                                <h1 className='text-base text-neutral-500'>EIN : {single?.ein}</h1>
                            }
                            {single?.duration &&
                                <h1 className='text-base text-neutral-500'>Duration : {single?.duration} Days</h1>
                            }
                            {single?.amount &&
                                <h1 className='text-base text-neutral-500'>Amount : ${single?.amount}</h1>
                            }
                        </div>
                    </div>
                    <div className="mt-5 grid lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 grid-cols-1 w-fit gap-3">
                        {single?.id_front_image &&
                            <div className="flex flex-col">
                                <h1>ID Front Image</h1>
                                <a href={single?.id_front_image} target='_blank'>
                                    <img src={single?.id_front_image} alt="" className='h-full w-full aspect-square rounded-lg' />
                                </a>
                            </div>
                        }
                        {single?.id_back_image &&
                            <div className="flex flex-col">
                                <h1>ID Back Image</h1>
                                <a href={single?.id_back_image} target='_blank'>
                                    <img src={single?.id_back_image} alt="" className='h-full w-full aspect-square rounded-lg' />
                                </a>
                            </div>
                        }
                        {single?.document &&
                            <div className="flex flex-col">
                                {getType(single?.document) == 'jpg' || getType(single?.document) == 'png' || getType(single?.document) == 'jpeg' ?
                                    <>
                                        <h1>Document</h1>
                                        <a href={single?.document} target='_blank'>
                                            <img src={single?.document} alt="" className='h-full w-full aspect-square rounded-lg' />
                                        </a>
                                    </>
                                    :
                                    <div className=""></div>
                                }
                            </div>
                        }
                        {single?.license &&
                            <div className="flex flex-col">
                                {getType(single?.license) == 'jpg' || getType(single?.license) == 'png' || getType(single?.license) == 'jpeg' ?
                                    <>
                                        <h1>License</h1>
                                        <a href={single?.license} target='_blank'>
                                            <img src={single?.license} alt="" className='h-full w-full aspect-square rounded-lg' />
                                        </a>
                                    </>
                                    :
                                    <div className=""></div>
                                }
                            </div>
                        }
                        {single?.resume &&
                            <div className="flex flex-col">
                                {getType(single?.resume) == 'jpg' || getType(single?.resume) == 'png' || getType(single?.resume) == 'jpeg' ?
                                    <>
                                        <h1>Resume</h1>
                                        <a href={single?.resume} target='_blank'>
                                            <img src={single?.resume} alt="" className='h-full w-full aspect-square rounded-lg' />
                                        </a>
                                    </>
                                    :
                                    <div className=""></div>
                                }
                            </div>
                        }
                    </div>
                    <div className="mt-5 space-y-2">
                        {single?.resume &&
                            <div className="">
                                <h1>Resume</h1>
                                <div
                                    onClick={() => window.open(single?.resume, '_blank')}
                                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        {getFileIcon(getType(single?.resume))}
                                        <div>
                                            <p className="text-sm font-medium">
                                                {getName(single?.resume).length > 20 ? `${getName(single?.resume).substring(0, 20)}...` : getName(single?.resume)}
                                            </p>
                                            <p className="text-xs text-gray-500">31.3 KB</p>
                                        </div>
                                    </div>
                                    <Eye className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        }
                        {single?.bank_letter &&
                            <div className="">
                                <h1>Bank Statement</h1>
                                <div
                                    onClick={() => window.open(single?.bank_letter, '_blank')}
                                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        {getFileIcon(getType(single?.bank_letter))}
                                        <div>
                                            <p className="text-sm font-medium">
                                                {getName(single?.bank_letter).length > 20 ? `${getName(single?.bank_letter).substring(0, 20)}...` : getName(single?.bank_letter)}
                                            </p>
                                            <p className="text-xs text-gray-500">31.3 KB</p>
                                        </div>
                                    </div>
                                    <Eye className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        }
                        {single?.credit &&
                            <div className="">
                                <h1>Letter of Credit</h1>
                                <div
                                    onClick={() => window.open(single?.credit, '_blank')}
                                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        {getFileIcon(getType(single?.credit))}
                                        <div>
                                            <p className="text-sm font-medium">
                                                {getName(single?.credit).length > 20 ? `${getName(single?.credit).substring(0, 20)}...` : getName(single?.credit)}
                                            </p>
                                            <p className="text-xs text-gray-500">31.3 KB</p>
                                        </div>
                                    </div>
                                    <Eye className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        }
                        {single?.document &&
                            <div className="">
                                <h1>Utility Bills or Official Documentation</h1>
                                <div
                                    onClick={() => window.open(single?.document, '_blank')}
                                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        {getFileIcon(getType(single?.document))}
                                        <div>
                                            <p className="text-sm font-medium">
                                                {getName(single?.document).length > 20 ? `${getName(single?.document).substring(0, 20)}...` : getName(single?.document)}
                                            </p>
                                            <p className="text-xs text-gray-500">31.3 KB</p>
                                        </div>
                                    </div>
                                    <Eye className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {investor && single?.verify_status === 'Pending' &&
                    <div className="flex flex-row gap-5 justify-center mt-5">
                        <CustomButton label='Decliend' cancel={true} onClick={() => declineRequestinvest(single?.customer_unique_id, single?.investor_fund_verification_unique_id, 'Decliend')} />
                        <CustomButton label='Approve' onClick={() => updateRequestinvest(single?.customer_unique_id, single?.investor_fund_verification_unique_id, 'Approved')} />
                    </div>
                }
                {all && single?.verify_status === 'Pending' &&
                    <div className="flex flex-row gap-5 justify-center mt-5">
                        <CustomButton label='Decliend' cancel={true} onClick={() => updateRequest(single?.customer_unique_id, single?.blue_tick_verification_id, 'Decliend')} />
                        <CustomButton label='Approve' onClick={() => updateRequest(single?.customer_unique_id, single?.blue_tick_verification_id, 'Approved')} />
                    </div>
                }
            </div>
            <Modal show={openModal} className='z-30' onClose={() => setOpenModal(false)}>
                <Modal.Header>Reason</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-2">
                        <span>Reason</span>
                        <textarea rows={5} type="text" onChange={(e) => setReason(e.target.value)} value={reason} className='rounded-md' placeholder='Enter Reason' ></textarea>
                    </div>
                    <div className="flex justify-center flex-row gap-5 mt-5">
                        <CustomButton label='Cancel' cancel={true} onClick={() => setOpenModal(false)} />
                        <CustomButton label='Declined' onClick={updateRequestinvestdecliend} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Blueticksingleuser