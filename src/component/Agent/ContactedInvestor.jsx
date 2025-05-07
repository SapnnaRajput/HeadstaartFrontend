import React, { useEffect, useState } from 'react'
import { UserState } from '../../context/UserContext';
import axios from 'axios';
import Loader from '../../Utiles/Loader';
import { notify } from '../../Utiles/Notification';
import { useNavigate } from 'react-router-dom'
import { Mail, BadgeCheck, ChevronRight, UserX, X } from 'lucide-react'
import CustomButton from '../../Utiles/CustomButton';



const ContactedInvestor = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL
    const { user } = UserState()
    const [skeletonLoading, setSkeletonLoading] = useState(false)
    const [investors, setInvestors] = useState([])
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)
    const [singleAgent, setSingleAgent] = useState(null)
    const [showAllServices, setShowAllServices] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hasLead, setHasLead] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [investorId,setInvestorId] = useState(null)



    const fetchAssistance = async () => {
        setSkeletonLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/contected_investor_agent`,
                {
                    customer_unique_id: user?.customer?.customer_unique_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (response?.data?.status) {
                setInvestors(response?.data.contected_investor)

            } else {
                notify('error', response?.data?.message);
            }
        } catch (error) {
            notify('error', error.message);
        } finally {
            setSkeletonLoading(false);
        }
    };
    useEffect(() => {
        fetchAssistance();
    }, [baseUrl]);

    const displayedServices = showAllServices
        ? singleAgent?.agent_services
        : singleAgent?.agent_services?.slice(0, 1);


    const handelSendMessage = async (chatId) => {
        setLoading(true);
        setInvestorId(chatId)
        try {
          const response = await axios.post(`${baseUrl}/lead_detail_web`, {
            customer_unique_id: chatId,
          }, {
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
              setOpenModal(false);
              setShowModal(true);
            }
          }
          else if (!response.data.status) {
            if (response.data.isChat) {
              setHasLead(response.data.status);
              setModalMessage(response.data.message);
              setOpenModal(false);
              setShowModal(true);
            }
          }
        } catch (error) {
          notify('error', 'Unauthorized access please login again');
        }
        setLoading(false);
      };

      const handleStartChat = async () => {
        setLoading(true);
        try {
          const response = await axios.post(`${baseUrl}/opportunity_lead_cut`, {
            customer_unique_id: investorId,
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

            {skeletonLoading && <div className="rounded-xl md:p-6 p-3 bg-white">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
                <div className="grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="shadow-xl rounded-xl overflow-hidden animate-pulse">
                            <div className="w-full h-40 bg-gray-300"></div>
                            <div className="flex flex-col pt-2 gap-1 justify-center items-center p-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="mt-5 h-8 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}

            {!skeletonLoading &&
                <div className="rounded-2xl bg-white">
                    <div className=" px-6 py-4 ">
                        <h1 className="text-2xl font-bold text-black">Contacted Investor</h1>
                    </div>
                    {investors.length > 0 ? (
                        <div className="grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5 p-6">
                            {investors.map((investor) => (
                                <div
                                    key={investor.client_unique_id}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] flex flex-col h-full"
                                >
                                    <div className="relative">
                                        <img
                                            src={investor.customer_profile_image || "/placeholder.svg"}
                                            alt={investor.client_name}
                                            className="w-full h-48 object-cover cursor-pointer"
                                        />
                                        {investor.isVerified && (
                                            <div className="absolute top-2 right-2 bg-blue-500/10 rounded-full p-1">
                                                <BadgeCheck className="w-6 h-6 text-blue-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center p-4 text-center flex-grow">
                                        <div className="flex items-center mb-1">
                                            <h2 className="font-bold text-base text-[#05004E] line-clamp-1 capitalize">
                                                {investor.client_name}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => handelSendMessage(investor.client_unique_id)}
                                            className="w-full py-2 px-4 bg-[#4A3AFF] text-white rounded-lg hover:bg-[#3D32CC] transition-colors flex items-center justify-center gap-2 mt-auto"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Message
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <UserX className="w-12 h-12 text-gray-400 mb-3" />
                            <span className="text-gray-500 text-lg font-medium">No Agent Assistance Available</span>
                        </div>
                    )}
                </div>
            }

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

export default ContactedInvestor