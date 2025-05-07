import React, { useEffect, useRef, useState } from 'react'
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { Modal } from 'flowbite-react';
import { ArrowLeft, FileText } from 'lucide-react';
import CustomButton from '../../../Utiles/CustomButton';
import { FaFilePdf, FaFileWord } from 'react-icons/fa6';
import { AiFillFilePpt } from "react-icons/ai";
import { GrDocumentTxt } from 'react-icons/gr';
import { TbFileTypeXls } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import Loader from '../../../Utiles/Loader';
import Msgsend from '../../../Utiles/Msgsend';
import { notify } from '../../../Utiles/Notification';


const Headstartteam = () => {

    const tabs = ['customer', 'Headstart Team']
    const [active, setActive] = useState(tabs[0])
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const { user } = UserState();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])
    const [customers, setCustomers] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [singleData, setSingledata] = useState()
    const [openChat, setOpenchat] = useState(false)
    const [chats, setChats] = useState([])
    const [single, setSingle] = useState()
    const [msg, setMsg] = useState('')
    const [file, setFile] = useState(null);
    const [imageFile, setImageFile] = useState({
        file: '',
        new_img: ''
    });
    const searchParams = new URLSearchParams(location.search);
    const team = searchParams.get('team');



    const getHead = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/get_headstart_customer_admin`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                setData(response.data.headstaart_team_details);
            }
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false);
    }

    const getCustdata = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/get_service_customer_admin`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                setCustomers(response.data.headstaart_team_details);
            }
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        getHead();
        getCustdata();
    }, [])

    const allData = active == 'customer' ? customers : active == 'Headstart Team' ? data : []

    const openData = (list) => {
        setSingledata(list)
        setSingle(list?.customer_details)
        setOpenModal(true)
    }


    
    const handleCloseModal = () => {
        setSingledata(null)
        setOpenModal(false)
    };


    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom whenever the component updates
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    const openchats = async (id) => {
        if (!msg && !file && !imageFile.file) {
            setLoading(true)
        }
        try {
            const response = await axios.post(`${baseUrl}/get_all_headstart_inbox_message_admin`, {
                headstaart_chat_initiate_id: id
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                setOpenModal(false)
                setOpenchat(true)
                setChats(response.data.chatDetails);
            }
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false)
    }


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

    const sendMsg = async () => {

        const formData = new FormData();

        formData.append('sender_unique_id', user?.user_unique_id);
        formData.append('reciver_unique_id', single?.customer_unique_id);
        formData.append('message', msg);
        formData.append('headstaart_chat_initiate_id', singleData?.headstaart_chat_initiate_id);
        formData.append('reciver_fcm_token', single?.customer_fcm_token);

        if (imageFile.file) {
            formData.append('attachment', imageFile.file);
        }
        if (file) {
            formData.append('attachment', file);
        }

        try {
            const response = await axios.post(`${baseUrl}/send_headstart_message_admin`, formData, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                setFile(null)
                setImageFile({
                    file: '',
                    new_img: ''
                });
                openchats(response.data.message.headstaart_chat_initiate_id)
                setMsg('')
            }
        } catch (error) {
            notify("error", error.message);
        }
    }


    useEffect(() => {
        if (team) {
            const newData = data.find(list => list.headstaart_chat_initiate_id == team)
            setSingledata(newData)
            setSingle(newData?.customer_details)
            setActive(tabs[1])
            openchats(team)
        }
    }, [team ,data ,customers])

    const setActiveData = (list)=>{
        setActive(list)
        setOpenchat(false)
    }

    return (
        <>
            {loading && <Loader />}
            <div className="p-5">
                <div className="bg-white h-fit rounded-xl p-5">
                    <div className="overflow-x-auto flex py-2 w-full ">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveData(tab)}
                                className={`pb-4 px-6 text-lg whitespace-nowrap capitalize border-b-2 flex-shrink-0 transition-all duration-200 font-medium relative ${active === tab
                                    ? "text-blue-600  border-blue-600"
                                    : "text-gray-500 hover:text-gray-800 border-transparent"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    {allData.length > 0 ?
                        <>
                            {openChat &&
                                <button className='capitalize pt-2 ps-2 flex flex-row gap-3 place-items-center md:hidden' onClick={() => setOpenchat(false)}><ArrowLeft />Back</button>
                            }
                            <div className="mt-2 2xl:h-[70vh] xl:h-[100vh] md:h-[70vh] h-[90vh] flex flex-row pt-1 ">
                                <div className={`xl:w-2/5 md:w-1/2 w-full flex flex-col md:border-r ${openChat ? 'md:block hidden' : 'block md:block'} overflow-auto`}>
                                    {allData.map((list, i) => (
                                        <div onClick={() => openData(list)} className="flex flex-row p-2 group w-full overflow-hidden gap-3 cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-all duration-200 ease-out rounded-xl" key={i}>
                                            {list.customer_details.customer_profile_image ?
                                                <img src={list.customer_details.customer_profile_image} alt="" className='h-12 w-12 rounded-full' />
                                                :
                                                <h1 className='h-12 w-12 font-medium bg-gray-200 group-hover:bg-white  rounded-full flex justify-center place-items-center'>{list.customer_details.customer_full_name.charAt()}</h1>
                                            }
                                            <div className="flex flex-col">
                                                <h1>{list.customer_details.customer_full_name}</h1>
                                                <spam className='text-sm text-neutral-400 line-clamp-1' >{list.inbox_message.headstaart_chat_message}</spam>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {openChat &&
                                    <div className={`md:w-1/2 xl:w-3/5 w-full ${openChat ? 'md:block block' : 'md:block hidden'}`}>
                                        <Link to={`/${user?.role}/user-manager/${single?.customer_unique_id}`} className="flex flex-row place-items-center gap-3 px-2 pb-2 border-b-2">
                                            {single?.customer_profile_image &&
                                                <img src={single?.customer_profile_image} alt="" className='h-12 w-12 rounded-full' />
                                            }
                                            <div className="flex flex-col">
                                                <h1>{single?.customer_full_name}</h1>
                                                <spam className='text-sm text-neutral-400 line-clamp-1'>{single?.customer_email}</spam>
                                            </div>
                                        </Link>
                                        <div ref={chatContainerRef} className="md:h-[45vh] h-[60vh] p-2 w-full overflow-hidden overflow-y-auto scroll bg-gray-50">
                                            {chats.length > 0 ?
                                                <>
                                                    {chats.map((list, i) => (
                                                        <>
                                                            <div className={`flex flex-col gap-2 `} key={i}>
                                                                <div className={`md:w-1/2 w-4/5 ${list.sender_unique_id === user?.user_unique_id ? 'self-end text-right ml-auto   rounded-t-lg rounded-l-lg' : 'self-start rounded-r-lg rounded-t-lg  text-left mr-auto '} mb-2`}>
                                                                    <div className={`${list.sender_unique_id === user?.user_unique_id ? ' self-end text-right ml-auto bg-blue-600 text-white  rounded-t-lg rounded-l-lg' : ' rounded-r-lg bg-white text-gray-800 border rounded-t-lg self-start  text-left mr-auto'} p-2 w-fit`}>
                                                                        {getType(list.attachment) == 'jpg' || getType(list.attachment) == 'png' || getType(list.attachment) == 'jpeg' ?
                                                                            <img src={list.attachment} alt="" className='h-28 w-28 aspect-square object-cover rounded-lg' />
                                                                            :
                                                                            <a href={list.attachment} target='_blank' className="flex flex-row gap-2 p-1">
                                                                                {getType(list.attachment) == 'pdf' &&
                                                                                    <h1 className='text-2xl '><FaFilePdf /></h1>
                                                                                }
                                                                                {getType(list.attachment) == 'docx' &&
                                                                                    <h1 className='text-2xl '><FaFileWord /></h1>
                                                                                }
                                                                                {getType(list.attachment) == 'doc' &&
                                                                                    <h1 className='text-2xl '><FaFileWord /></h1>
                                                                                }
                                                                                {getType(list.attachment) == 'pptx' &&
                                                                                    <h1 className='text-2xl '><AiFillFilePpt /></h1>
                                                                                }
                                                                                {getType(list.attachment) == 'ppt' &&
                                                                                    <h1 className='text-2xl '><AiFillFilePpt /></h1>
                                                                                }
                                                                                {getType(list.attachment) == 'txt' &&
                                                                                    <h1 className='text-2xl '><GrDocumentTxt /></h1>
                                                                                }
                                                                                {getType(list.attachment) == 'xls' &&
                                                                                    <h1 className='text-2xl  '><TbFileTypeXls /></h1>
                                                                                }
                                                                                {getType(list.attachment) == 'xlsx' &&
                                                                                    <h1 className='text-2xl  '><TbFileTypeXls /></h1>
                                                                                }
                                                                                <div className="flex flex-col">
                                                                                    <h1 className='text-xs font-medium'>{getName(list.attachment)}</h1>
                                                                                </div>
                                                                            </a>
                                                                        }
                                                                        <h1 className='text-xs mt-1'>{list.message}</h1>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ))}
                                                </>
                                                :
                                                <div className="flex justify-center place-items-center h-full">
                                                    <h1 className=''>Not Message Yet</h1>
                                                </div>
                                            }
                                        </div>
                                        <div className="px-2">
                                            <Msgsend sendMsg={sendMsg} file={file} setFile={setFile} imageFile={imageFile} setImageFile={setImageFile} setMsg={setMsg} msg={msg} />
                                        </div>
                                    </div>
                                }
                            </div>
                        </>
                        :
                        <div className="mt-10 px-5 pb-4 flex justify-center">
                            <h1>Art Enquiry Not Available</h1>
                        </div>
                    }
                </div>
            </div>
            <Modal show={openModal} size='3xl' onClose={() => setOpenModal(false)}>
                {/* <Modal.Header className='p-0 border-0'></Modal.Header> */}
                <Modal.Body>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Headstaart Team
                        </h2>
                        <div className="space-y-4">
                            <Link to={`/superadmin/content-moderation/${singleData?.project_details?.project_unique_id}`}>
                            <img
                                src={singleData?.projectMedia[0].media_link}
                                alt="City street view"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            </Link>
                            <div>
                            <Link to={`/superadmin/content-moderation/${singleData?.project_details?.project_unique_id}`}>
                                <h3 className="text-xl font-semibold text-gray-900 capitalize">
                                    {singleData?.project_details.title}
                                </h3>
                                </Link>
                                <Link to={`/superadmin/content-moderation/${singleData?.project_details?.project_unique_id}`}>
                                <p className="text-sm text-gray-500">
                                    {singleData?.project_details.category.category_name}
                                </p>
                                </Link>
                                <p className="mt-2 text-gray-700">
                                    ${singleData?.project_details.fund_amount} for{" "}
                                    {singleData?.project_details.equity}% equity.
                                </p>
                                <div>
                                    {singleData?.headstaartServices &&
                                        singleData?.headstaartServices.length > 0 ? (
                                        <div className="space-y-6">
                                            <h4 className="font-medium mt-3 text-gray-900">
                                                Our Services
                                            </h4>
                                            {singleData?.headstaartServices.map(
                                                (service, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                                                    >
                                                        <div className="p-5 space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="text-lg font-semibold text-gray-900">
                                                                    {service.title}
                                                                </h5>
                                                                {/* <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                                                                    {service.status}
                                                                </span> */}
                                                            </div>

                                                            <p className="text-sm text-gray-600 font-medium">
                                                                {service.sub_title}
                                                            </p>

                                                            <p className="text-sm text-gray-600">
                                                                {service.paragraph}
                                                            </p>

                                                            <div className="pt-4 border-t border-gray-100">
                                                                <div className="flex flex-wrap gap-3">
                                                                    <div className="flex items-center text-sm text-gray-600">
                                                                        <span className="font-medium mr-2">
                                                                            Location:
                                                                        </span>
                                                                        {service.city.city_name},{" "}
                                                                        {service.state.state_name},{" "}
                                                                        {service.country.country_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (

                                        <div>
                                            <h4 className="font-medium text-gray-900">Our Offer</h4>
                                            <p className="text-green-500">
                                                ${singleData?.fund_amount} for {singleData?.equity}%
                                                equity.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {singleData?.inbox_message &&
                                    singleData?.inbox_message.headstaart_chat_message && (
                                        <div className='mb-2'>
                                            <h4 className="font-medium text-gray-900 my-2">Inbox</h4>
                                            <div className="p-4 border rounded-lg bg-gray-50">
                                                <p className="text-sm text-gray-600">
                                                    {singleData?.inbox_message.headstaart_chat_message}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                {singleData?.projectMedia?.some(
                                    (media) => media.media_type === "document"
                                ) && (
                                        <div className="p-4  border rounded-lg bg-gray-50">
                                            {singleData?.projectMedia
                                                .filter((media) => media.media_type === "document")
                                                .map((doc, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center space-x-3 text-sm text-gray-600"
                                                    >
                                                        <FileText className="h-5 w-5 text-red-500" />
                                                        <a
                                                            href={doc.media_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:underline"
                                                        >
                                                            {doc.media_title || `Document ${index + 1}`}
                                                        </a>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-gray-50 flex justify-end gap-3">
                    <CustomButton
                        label="Reply"
                        onClick={() =>
                            openchats(
                                singleData?.headstaart_chat_initiate_id
                            )
                        }
                    />
                    <CustomButton
                        label="Close"
                        cancel={true}
                        onClick={handleCloseModal}
                    />
                </Modal.Footer>
            </Modal>

            {/* <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        chatDetails={chatDetails}
        headstaartChatInitiateId={selectedItem?.headstaart_chat_initiate_id}
        senderUniqueId={user?.customer?.customer_unique_id}
        receiverUniqueId={selectedItem?.user_details.sender_unique_id}
      /> */}
        </>
    )
}

export default Headstartteam