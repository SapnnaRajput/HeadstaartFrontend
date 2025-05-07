
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import img from '../../Assets/Images/project.png'
import flag from '../../Assets/Images/flag.png'
import { UserState } from '../../context/UserContext';
import axios from 'axios';
import Loader from '../../Utiles/Loader';
import { Download, Heart, MessageCircle, X } from 'lucide-react';

const Singleproject = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const { id } = useParams();
    const { user } = UserState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState({});

    const fetchSingleProject = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_single_project_shared`,
                {
                    project_unique_id: id,
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
                    </div>
                </div>
            </div>

        </>
    )
}

export default Singleproject