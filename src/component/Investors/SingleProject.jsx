import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import img from '../../Assets/Images/project.png'
import flag from '../../Assets/Images/flag.png'
import { UserState } from '../../context/UserContext';
import axios from 'axios';
import Loader from '../../Utiles/Loader';
import { Download, Eye, Heart, MessageCircle, X, Flag } from 'lucide-react';
import SelectDropdown from '../../Utiles/SelectDropdown'
import { notify } from '../../Utiles/Notification';

const Singleproject = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const { id } = useParams();
    const { user } = UserState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [agents, setAgents] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [loadingStates, setLoadingStates] = useState(false);
    const [zipcode, setZipcode] = useState('')
    const [saving, setSaving] = useState(false)
    const [projectData, setProjectData] = useState({});
    const [clientData, setClientData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hasLead, setHasLead] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [currentClientId, setCurrentClientId] = useState(null);
    

    const fetchSingleProject = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_investor_single_project`,
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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const getCategory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/get_category`);
                if (response.data.status) {
                    const formattedCategories = response.data.category.map(cat => ({
                        value: cat.category_id,
                        label: cat.category_name,
                        ...cat
                    }));
                    setCategories(formattedCategories);
                    if (formattedCategories.length > 0) {
                        setSelectedIndustry(formattedCategories[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        const getFilterCountries = async () => {
            try {
                const response = await axios.get(`${baseUrl}/getAllCountries`);
                if (response.data.status) {
                    const formattedCountries = [
                        { value: 'all', label: 'All Countries' },
                        ...response.data.allCountries.map(country => ({
                            value: country.country_id,
                            label: country.country_name,
                            ...country
                        }))
                    ];
                    setCountries(formattedCountries);
                    setSelectedCountry(formattedCountries[0]);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            getCategory();
            getFilterCountries();
        }
    }, [isOpen, baseUrl]);

    useEffect(() => {
        const getStates = async () => {
            if (selectedCountry && selectedCountry.value !== 'all') {
                setLoadingStates(true);
                try {
                    const response = await axios.get(`${baseUrl}/getState/${selectedCountry.value}`);
                    if (response.data.status) {
                        const formattedStates = response.data.states.map(state => ({
                            value: state.state_subdivision_id,
                            label: state.state_subdivision_name,
                            ...state
                        }));
                        setStates(formattedStates);
                    }
                } catch (error) {
                    console.error('Error fetching states:', error);
                } finally {
                    setLoadingStates(false);
                }
            } else {
                setStates([]);
                setSelectedState(null);
            }
        };

        getStates();
    }, [selectedCountry, baseUrl]);



    const pathname = window.location.pathname;
    const firstPart = `/${pathname.split('/')[1]}`;

    const handleFileOpen = (url) => {
        window.open(url, '_blank');
    };

    const handleApplyFilter = async () => {
        try {
            setLoading(true);

            let verificationStatus;
            if (selectedStatus === 'All') {
                verificationStatus = 'All';
            } else if (selectedStatus === 'true') {
                verificationStatus = true;
            } else {
                verificationStatus = false;
            }

            const filterData = {
                category_id: selectedIndustry?.value || null,
                is_verified: verificationStatus,
                country_id: selectedCountry?.value || null,
                state_id: selectedState?.value || null,
                zipcode: selectedCountry?.value === 'all' ? zipcode : null,
            };

            const response = await axios.post(`${baseUrl}/filter_agent`, filterData, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status) {
                setAgents(response.data.filter_agent);
                if (user.role == 'investor') {
                    sessionStorage.setItem('investorProjectId', id);
                }
                navigate(`/${user.role}/map/filter_agent`, { state: { agents: response.data.filter_agent } });
            } else if (!response.data.status) {
                notify('error', response.data.message);
            }
        } catch (error) {
            console.error('Error filtering agents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChatAgent = () =>{
        if (user.role == 'investor') {
            sessionStorage.setItem('investorProjectId', id);
        }
         navigate(`/${user.role}/map/filter_agent`)
    }
    const handleSaveProject = async () => {

        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}/save_unsave_projects`,
                {
                    project_unique_id: id,
                    action: !projectData.isSaved,
                    customer_unique_id: user?.customer?.customer_unique_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (response.data.status) {
                fetchSingleProject()
                notify('success', response.data.message);
            } else {
                notify('error', response.data.message);
            }
        } catch (error) {
            notify('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = async (customerID) => {
        setLoading(true);
        try {
            setCurrentClientId(customerID);
            const response = await axios.post(`${baseUrl}/lead_detail_single_web`, {
                customer_unique_id: customerID,
                project_unique_id: id,
            },{
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                if (response.data.isChat) {
                    navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`);
                  } else {
                    setHasLead(response.data.status);
                    setModalMessage(response.data.message);
                    setShowModal(true);
                  }
                }
                else if(!response.data.status){
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
                project_unique_id: id,
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


    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

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

    const documentFiles = projectData.projectMedia ?? [];
    const getFileName = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const handleFlagUnflag = (isFlag) => async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        try {
          const response = await axios.post(
            `${baseUrl}/flag_or_unflag_project`,
            {
              project_unique_id: id,
              type: isFlag ? "false" : "true",
            },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
    
          if (response.data.status) {
            await fetchSingleProject();
            notify(
              "success",
              isFlag
                ? "Project unflagged successfully"
                : "Project flagged successfully"
            );
            window.location.reload();
          } else {
            notify(
              "error",
              response.data.message || "Failed to update flag status"
            );
          }
        } catch (error) {
          notify(
            "error",
            error.response?.data?.message ||
              "An error occurred while updating flag status"
          );
        } finally {
          setLoading(false);
        }
      };

    return (
        <>
            {loading && <Loader />}
            <div className="bg-white rounded-xl p-5">
                <div className="flex flex-row place-items-center justify-between">
                    <h1 className='text-3xl font-semibold capitalize'>{projectData.title}</h1>
                    <div
                      onClick={handleFlagUnflag(
                        projectData.isFlag
                      )}
                      className="cursor-pointer bg-white/90 p-2 rounded-full"
                      role="button"
                      tabIndex={0}
                    >
                      <Flag
                        className="h-6 w-6 text-gray-500"
                        fill={projectData.isFlag ? "#4A3AFF" : "none"}
                        color={projectData.isFlag ? "#4A3AFF" : "currentColor"}
                      />
                    </div>
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
                                <button onClick={() => handleSaveProject(projectData.project_unique_id)} className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors">
                                    <Heart
                                        className={`w-5 h-5 ${projectData?.isSaved ? 'fill-red-500 text-red-500' : 'text-gray-800'}`}
                                    />
                                </button>
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
                                {documentFiles.map((doc, index) => {
                                    const fileName = getFileName(doc.media_link);
                                    const extension = getFileExtension(fileName);
                                    return (
                                        <div
                                            key={doc.project_media_id}
                                            onClick={() => window.open(doc.media_link, '_blank')}
                                            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(extension)}
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {fileName.length > 20 ? `${fileName.substring(0, 20)}...` : fileName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">31.3 KB</p>
                                                </div>
                                            </div>
                                            <Eye className="w-4 h-4 text-gray-400" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button onClick={() => handleMessage(projectData.customer_unique_id)} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium">
                                Interested? Message to Entrepreneur
                            </button>
                            {!user.role === 'agent' &&
                            <button onClick={handleStartChatAgent}  className="w-full bg-white text-indigo-600 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium">
                                Contact Agent
                            </button>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl w-96 max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Find Agent</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Industry</label>
                                <SelectDropdown
                                    value={selectedIndustry}
                                    onChange={setSelectedIndustry}
                                    options={categories}
                                    placeholder="Select Industry"
                                    isLoading={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Verified Or not</label>
                                <SelectDropdown
                                    value={selectedStatus}
                                    onChange={setSelectedStatus}
                                    options={[
                                        { value: 'All', label: 'All' },
                                        { value: 'true', label: 'Verified' },
                                        { value: 'false', label: 'Unverified' },
                                    ]}
                                    placeholder="Select Status"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Country</label>
                                <SelectDropdown
                                    value={selectedCountry}
                                    onChange={setSelectedCountry}
                                    options={countries}
                                    placeholder="Select Country"
                                    isLoading={loading}
                                />
                            </div>
                            {selectedCountry && selectedCountry.value !== 'all' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">State</label>
                                    <SelectDropdown
                                        value={selectedState}
                                        onChange={setSelectedState}
                                        options={states}
                                        placeholder="Select State"
                                        isLoading={loadingStates}
                                    />
                                </div>
                            )}
                            {selectedCountry && selectedCountry.value === 'all' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Zipcode</label>
                                    <input
                                        type="text"
                                        value={zipcode}
                                        onChange={(e) => setZipcode(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Enter Zipcode"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleApplyFilter}
                                className="w-full bg-[#4A3AFF] text-white py-3 rounded-xl mt-4"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>
                </div>
            )}

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