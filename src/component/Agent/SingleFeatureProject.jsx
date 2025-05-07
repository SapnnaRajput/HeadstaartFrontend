import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import img from '../../Assets/Images/project.png'
import flag from '../../Assets/Images/flag.png'
import { UserState } from '../../context/UserContext';
import axios from 'axios';
import Loader from '../../Utiles/Loader';
import { Download, Heart, MessageCircle, X } from 'lucide-react';
import SelectDropdown from '../../Utiles/SelectDropdown'
import { notify } from '../../Utiles/Notification';

const Singleproject = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const flagged_by = searchParams.get("flagged_by");
    const { id } = useParams();
    const { user } = UserState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [hasLead, setHasLead] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [currentClientId, setCurrentClientId] = useState(null);

    const fetchSingleProject = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_agent_single_project_web`,
                {
                    project_unique_id: projectId,
                    flagged_by: flagged_by === "investor" ? "investor" : "null"
                }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                setProjectData(response.data.projectDetail)
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSingleProject();
    }, []);




    const pathname = window.location.pathname;
    const firstPart = `/${pathname.split('/')[1]}`;

    const handleFileOpen = (url) => {
        window.open(url, '_blank');
    };

    const handleMessage = async (customerID) => {
        setLoading(true);
        try {
            setCurrentClientId(customerID);
            const response = await axios.post(`${baseUrl}/lead_detail_single_web`, {
                customer_unique_id: customerID,
                project_unique_id: projectId,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                if (response.data.isChat) {
                    navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`)
                } else {
                    setHasLead(response.data.status);
                    setModalMessage(response.data.message);
                    setShowModal(true);
                }
            } else {
                setHasLead(response.data.status);
                setModalMessage(response.data.message);
                setShowModal(true);
            }
        } catch (error) {
            notify('error', 'Unauthorized access please login again');
        }
        setLoading(false);
    };

    const handleStartChat = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/chat_initiate_web`, {
                customer_unique_id: currentClientId,
                project_unique_id: projectId,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                setShowModal(false);
                navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`)
            } else {
                navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`)
            }
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }

    const handleBuyLead = () => {
        navigate(`/${user.role}/purchase-lead`);
    }
    return (
        <>
            {loading && <Loader />}
            <div className="bg-white rounded-xl p-5">
                <div className="flex flex-row place-items-center justify-between">
                    <h1 className='text-3xl font-semibold capitalize'>{projectData.title}</h1>
                </div>
                <div className="flex flex-row mt-5 gap-5">
                    <div className="w-3/5 relative">
                        {projectData?.projectMedia?.find(media => media.media_type === "photo") && (
                            <>
                                <img
                                    src={projectData.projectMedia.find(media => media.media_type === "photo").media_link}
                                    alt=""
                                    className="w-full h-80 object-fill rounded-xl"
                                />

                            </>
                        )}
                        <p className="text-base font-normal mt-4 text-gray-600">{projectData?.description}</p>
                    </div>
                    <div className="w-2/5">
                        {projectData?.pitch_deck_file && (
                            <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-50 p-1 rounded">
                                        <span className="text-xs font-medium text-red-500">PDF</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Pitch Deck.pdf</p>
                                        <p className="text-xs text-gray-500">313 KB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleFileOpen(projectData.pitch_deck_file)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    View
                                </button>
                            </div>
                        )}

                        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-4">
                            <h2 className="text-lg font-semibold mb-4">Innovative CleanTech Solutions</h2>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Industry:</span> {projectData?.category?.category_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Geographic Location:</span> {`${projectData?.city?.city_name}, ${projectData?.country?.country_name}`}</p>
                                </div>
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Business Stage:</span> {projectData?.stage?.business_stage_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Funding Goal:</span> ${projectData?.fund_amount} For {projectData?.equity}% equity</p>
                                </div>
                                {/* <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Quick Fact:</span> Operating in North America and Europe with expansion plans in Asia</p>
                                </div> */}
                            </div>
                        </div>

                        {/* <div className="bg-white rounded-lg border border-gray-100 p-6 mb-4">
                            <h2 className="text-lg font-semibold mb-4">Financials & Key Milestones</h2>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Projected revenue:</span> The next year: $5M, with a 40% profit margin</p>
                                </div>
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Secured partnerships:</span> ABC Corp. Launched V2 product line, Expanded to European markets.</p>
                                </div>
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Upcoming Milestones:</span> Launching in Asia Q4 2024, Targeting profitability by 2025.</p>
                                </div>
                            </div>
                        </div> */}

                        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-4">
                            <h2 className="text-lg font-semibold mb-4">Important Documents</h2>

                            <div className="space-y-3">
                                {projectData?.projectMedia?.map((media, index) => (
                                    media.media_type === "document" && (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-50 p-1 rounded">
                                                    <span className="text-xs font-medium text-red-500">PDF</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{media.media_title || "Document.pdf"}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <Download
                                                    className="w-6 h-6 text-gray-500 cursor-pointer"
                                                    onClick={() => handleFileOpen(media.media_link)}
                                                />
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {projectData?.additional_info?.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-100 p-6 mb-4">
                                <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
                                <div className="space-y-4">
                                    {projectData.additional_info.map((info) => (
                                        <div key={info.additional_info_id}>
                                            <h3 className="text-sm font-medium text-gray-900">{info.heading}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{info.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="space-y-3">
                            <button onClick={() => handleMessage(projectData.customer_unique_id)} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium">
                                Interested? Message to Entrepreneur
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowModal(false)}
                    />

                    <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Lead Information</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center p-6">
                            <p className="text-center mb-6">{modalMessage}</p>
                            {hasLead ? (
                                <button
                                    onClick={handleStartChat}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Start Chat
                                </button>
                            ) : (
                                <button
                                    onClick={handleBuyLead}
                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Buy Lead
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default Singleproject