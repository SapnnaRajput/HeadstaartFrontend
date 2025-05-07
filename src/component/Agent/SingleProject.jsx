// import { BellDot, EllipsisVertical, Eye, FileStack, MessageCircleMore, Video } from 'lucide-react';
// import React, { useEffect, useState } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import img from '../../Assets/Images/project.png'
// import flag from '../../Assets/Images/flag.png'
// import { UserState } from '../../context/UserContext';
// import axios from 'axios';
// import Loader from '../../Utiles/Loader';

// const Singleproject = () => {

//     const baseUrl = import.meta.env.VITE_APP_BASEURL;
//     const { id } = useParams();
//     const { user } = UserState();
//     const [loading, setLoading] = useState(false);


//     const [projectData, setProjectData] = useState({});


//     useEffect(() => {
//         const fetchCategories = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(`${baseUrl}/get_agent_single_project_web`,
//                     {
//                         project_unique_id: id,
//                     }, {
//                     headers: {
//                         Authorization: `Bearer ${user?.token}`,
//                     },
//                 });
//                 if (response.data.status) {
//                     setProjectData(response.data.projectDetail)
//                 }
//             } catch (error) {
//                 console.error('Error fetching categories:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCategories();
//     }, []);


//     const pathname = window.location.pathname;
//     const firstPart = `/${pathname.split('/')[1]}`;

//     return (
//         <>
//             {loading && <Loader />}
//             <div className="bg-white rounded-xl p-5">
//                 <div className="flex flex-row place-items-center justify-between">
//                     <h1 className='text-3xl font-semibold text-[#05004E]'>{projectData.title}</h1>
//                     <button>
//                         <img src={flag} alt="" />
//                     </button>
//                 </div>
//                 <div className="flex flex-row mt-5 gap-5">
//                     <div className="w-3/5">
//                         <img src={img} alt="" className='rounded-xl' />
//                         <p className='text-base font-normal mt-4'>{projectData.description}</p>
//                     </div>
//                     <div className="w-2/5">
//                         <h1 className='text-base font-bold'>Project Views</h1>
//                         <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden">
//                             <div className="w-full flex justify-between place-items-center p-5">
//                                 <h1 className='text-[#535763] text-LG font-semibold'>Total View</h1>
//                                 <div className="flex flow-row gap-2 place-items-center text-[#B7B7B7] font-bold text-sm ">
//                                     <Eye size={20} />
//                                     {projectData.total_view} k
//                                 </div>
//                             </div>
//                         </div>
//                         <h1 className='text-base font-bold mt-5'>Investor Interest</h1>
//                         <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden flex justify-around place-items-center py-4">
//                             <h1 className='text-sm font-semibold '>Investor interacted</h1>
//                             <span className='text-[#535763] font-medium text-sm'>{projectData.investor_interacted}</span>
//                         </div>
//                         <div className="flex flex-row mt-5 gap-10 place-items-center justify-evenly">
//                             <Link to={`${firstPart}/messages/${id}/${projectData.customer_unique_id}`} className="bg-[#DFF1FF] w-fit p-5 rounded-full flex justify-center place-items-center text-[#0F65A9] relative">
//                                 <MessageCircleMore size={32} />
//                                 <div className="absolute bg-[#0F65A9] rounded-full h-5 w-5 top-0 right-1 text-white font-semibold text-sm flex place-items-center justify-center">
//                                     {projectData.message}
//                                 </div>
//                             </Link>
//                             <div className="bg-[#E8FFEB] w-fit p-5 rounded-full flex justify-center place-items-center text-[#008211] relative">
//                                 <FileStack size={32} />
//                                 <div className="absolute bg-[#008211] rounded-full h-5 w-5 top-0 right-1 text-white font-semibold text-sm flex place-items-center justify-center">
//                                     2
//                                 </div>
//                             </div>
//                             {/* <div className="bg-[#DCD9FF] w-fit p-5 rounded-full flex justify-center place-items-center text-[#3728E3] relative">
//                             <Video size={32} />
//                             <div className="absolute bg-[#3728E3] rounded-full h-5 w-5 top-0 right-1 text-white font-semibold text-sm flex place-items-center justify-center">
//                                 2
//                             </div>
//                         </div>
//                         <div className="bg-[#FFECEF] w-fit p-5 rounded-full flex justify-center place-items-center text-[#E50B2E] relative">
//                             <BellDot size={32} />
//                             <div className="absolute bg-[#E50B2E] rounded-full h-5 w-5 top-0 right-1 text-white font-semibold text-sm flex place-items-center justify-center">
//                                 2
//                             </div>
//                         </div> */}
//                         </div>
//                         <h1 className='text-base font-bold mt-8'> </h1>
//                         <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden flex justify-between px-8 place-items-center py-4">
//                             <h1 className='text-sm font-semibold '>Investor Inquiries</h1>
//                             <span className='text-[#535763] font-medium text-sm'>{projectData.investor_inuqiries}</span>
//                         </div>
//                         <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden flex justify-between px-8 place-items-center py-4">
//                             <h1 className='text-sm font-semibold '>Agent Inquires</h1>
//                             <span className='text-[#535763] font-medium text-sm'>{projectData.agent_inuqiries}</span>
//                         </div>
//                         <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden flex justify-between px-8 place-items-center py-4">
//                             <h1 className='text-sm font-semibold '>Document Requests</h1>
//                             <span className='text-[#050040] font-medium text-sm'>Request: 3</span>
//                         </div>
//                         <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden flex justify-between px-8 place-items-center py-4">
//                             <h1 className='text-sm font-semibold '>Messages</h1>
//                             <span className='text-[#E50B2E] font-medium text-sm'>Unread: {projectData.message}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Singleproject


import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import img from '../../Assets/Images/project.png'
import flag from '../../Assets/Images/flag.png'
import { UserState } from '../../context/UserContext';
import axios from 'axios';
import Loader from '../../Utiles/Loader';
import { Download, Eye, Heart, MessageCircle, X } from 'lucide-react';
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
                console.log(response?.data?.projectDetail);
                
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

    return (
      <>
        {loading && <Loader />}
        <div className="bg-white rounded-xl p-5">
          <div className="flex flex-row place-items-center justify-between">
            <h1 className="text-3xl font-semibold capitalize">
              {projectData.title}
            </h1>
          </div>
          <div className=" flex flex-col sm:flex-row mt-5 gap-5">
            <div className="w-full sm:w-1/2 relative">
              {projectData?.projectMedia?.find(
                (media) => media.media_type === 'photo'
              ) && (
                <>
                  <img
                    src={
                      projectData.projectMedia.find(
                        (media) => media.media_type === 'photo'
                      ).media_link
                    }
                    alt=""
                    className="w-full h-80 object-fill rounded-xl"
                  />
                </>
              )}
              <Link to={`/agent/entrepreneur-profile/${projectData?.project_creator_id}`}>
                <p className='font-medium text-xl text-gray-700 hover:text-blue-500 hover:underline'>{projectData?.project_creator_name}</p>
              </Link>
              <p className="text-base font-normal mt-4 text-gray-600">
                {projectData?.description}
              </p>
            </div>
            <div className="w-full sm:w-1/2">
              {projectData?.pitch_deck_file && (
                <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-1 rounded">
                      <span className="text-xs font-medium text-red-500">
                        PDF
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pitch Deck</p>
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
                <h2 className="text-lg font-semibold mb-4">
                  Innovative CleanTech Solutions
                </h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Industry:</span>{' '}
                      {projectData?.category?.category_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Geographic Location:</span>{' '}
                      {`${projectData?.city?.city_name}, ${projectData?.country?.country_name}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Business Stage:</span>{' '}
                      {projectData?.stage?.business_stage_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Funding Goal:</span> $
                      {projectData?.fund_amount} For {projectData?.equity}% equity
                    </p>
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
                <h2 className="text-lg font-semibold mb-4">
                  Important Documents
                </h2>

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
                              {fileName.length > 20
                                ? `${fileName.substring(0, 20)}...`
                                : fileName}
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

              {projectData?.additional_info?.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-100 p-6 mb-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Additional Information
                  </h2>
                  <div className="space-y-4">
                    {projectData.additional_info.map((info) => (
                      <div key={info.additional_info_id}>
                        <h3 className="text-sm font-medium text-gray-900">
                          {info.heading}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {info.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => handleMessage(projectData.customer_unique_id)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium"
                >
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
    );
}

export default Singleproject