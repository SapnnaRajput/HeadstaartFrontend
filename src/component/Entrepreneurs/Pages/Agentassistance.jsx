import React, { useEffect, useState } from 'react'
import { Mail, BadgeCheck, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { UserState } from "../../../context/UserContext"
import { notify } from "../../../Utiles/Notification"
import Loader from "../../../Utiles/Loader"
import CustomButton from "../../../Utiles/CustomButton"
import axios from "axios"
import { Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom'

const Agentassistance = ({ investor }) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL
  const { user } = UserState()
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [singleAgent, setSingleAgent] = useState(null)
  const [showAllServices, setShowAllServices] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(false);
  const navigate = useNavigate()
  const [single, setSingle] = useState(null)

  const fetchAssistance = async () => {
    setSkeletonLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/entu_agent_assistance`,
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
        setAgents(response?.data?.chat_user_data)
      } else {
        // notify('error', response?.data?.message);
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

  const handleAgentClick = (agent) => {
    setOpenModal(true)
    setSingleAgent(agent)
  }

  const handleCloseModal = () => {
    setOpenModal(false);
    setSingleAgent(null)
  }

  const handelSendMessage = (chatId) => {
    navigate(`/${user.role}/messages/${chatId}`)
  }

  const openData = (list) => {
    navigate('/entrepreneur/agent-assistance/agent-profile' ,{
      state : list
    })
    // setSingle(list)
    // setOpen(true)
  }

  console.log(single)

  return (
    <>
      {loading && <Loader />}

      {skeletonLoading && <div className=" container mx-auto rounded-xl md:p-6 p-3 bg-white">
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

      {!skeletonLoading && <div className="container mx-auto rounded-2xl bg-white">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-black">Agent Assistance</h1>
        </div>

        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <Mail className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Agent Assistance Available</h2>
            <p className="text-gray-500 max-w-md">
              There are currently no agent assistances available. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5 p-6">
          {agents.map((agent) => (
            <div
              key={agent.agent_unique_id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] flex flex-col h-full"
            >
              <div className="relative w-full h-48">
                <Link
                  to={`/entrepreneur/agent-opportunities/${agent.chat_initiate_id}/${agent.agent_unique_id}/${agent.project_unique_id}`}
                  target="_blank"
                  className="block w-full h-full"
                >
                  <img
                    src={agent.agent_profile_image || "/placeholder.svg"}
                    alt={agent.agent_full_name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                {agent.isVerified && (
                  <div className="absolute top-2 right-2 bg-blue-500/10 rounded-full p-1">
                    <BadgeCheck className="w-6 h-6 text-blue-500" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col p-4 flex-grow">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <button className="font-bold text-base text-[#05004E] mr-2 capitalize truncate max-w-full transition-all duration-300 ease-out">
                      {agent.agent_full_name}
                    </button>
                  </div>
                  
                  <Link 
                    to={`/${user.role}/projects/${agent.project_unique_id}`} 
                    className="text-sm text-gray-500 mb-4 capitalize block truncate hover:underline transition-all duration-300 ease-out"
                  >
                    {agent.title}
                  </Link>
                  
                  <h3 className="text-base text-black mb-4">
                    Asking for: <span className="text-green-600 font-semibold">{agent.agent_deal_per}%</span>
                  </h3>
                </div>
                
                <div className="mt-auto">
                  <button
                    onClick={() => handelSendMessage(agent.chat_initiate_id)}
                    className="w-full py-2 px-4 bg-[#4A3AFF] text-white rounded-lg 
                         hover:bg-[#3D32CC] transition-colors 
                         flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>}

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center gap-4">
                <img
                  src={singleAgent.agent_profile_image}
                  alt={singleAgent.agent_profile_image}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold capitalize">{singleAgent.agent_full_name}</h2>
                    {singleAgent.isVerified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-500">Asking for {singleAgent.fund_amount}$ for Deal</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <h3 className="font-semibold mb-3">Message</h3>
              <p className="text-gray-600 text-sm">{singleAgent.last_message || "No message available"}</p>
            </div>

            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Agent Service</h3>
                {singleAgent.agent_services?.length > 1 && (
                  <button
                    onClick={() => setShowAllServices(!showAllServices)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    {showAllServices ? "View Less" : "View More"}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {displayedServices?.map((service) => (
                  <div key={service.agent_service_unique_id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{service.category.category_name}</h4>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-b">
              <h3 className="font-semibold mb-4">Project</h3>
              <div className="rounded-lg border overflow-hidden">
                <img
                  src={singleAgent.project_media[0]?.media_link}
                  alt="Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-medium mb-1 capitalize">{singleAgent.title || "Project Title"}</h4>
                  <p className="text-sm text-gray-500">
                    ${singleAgent.fund_amount} for {singleAgent.equity}% equity
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 p-4">
              <CustomButton label="Reply" onClick={() => handelSendMessage(singleAgent.chat_initiate_id)} />
              <CustomButton onClick={handleCloseModal} label="Back" cancel={true} />
            </div>
          </div>
        </div>
      )}
      <Modal show={open} className='z-30' onClose={() => setOpen(false)}>
        <Modal.Header>Agent Profile</Modal.Header>
        <Modal.Body>
          <div className="flex justify-end">
            {single?.isVerified &&
              <div className="flex items-center gap-2 rounded-full px-4 py-2 text-base text-green-600">
                <BadgeCheck className="font-bold  w-6 h-6 animate-pulse text-green-600" />
                <span className="font-bold text-base">Verified</span>
              </div>
            }
          </div>
          <div className="flex flex-row place-items-center gap-3">
            {single?.agent_profile_image ?
              <img src={single?.agent_profile_image} className='h-32 w-32 aspect-square rounded-full' />
              :
              <h1 className='h-32 w-32 aspect-square flex justify-center place-items-center bg-gray-200 capitalize rounded-full font-medium text-xl'>{single?.agent_full_name?.charAt()}</h1>
            }
            <div className="flex flex-col">
              <h1 className='text-xl font-medium capitalize'>{single?.agent_full_name}</h1>
              <span className=''>{single?.agent_email}</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-5">
            {single?.country?.country_name &&
              <div className="flex flex-col">
                <span className='text-sm text-neutral-500'>City</span>
                <h1 className='font-medium text-base'>{single?.city?.city_name}</h1>
              </div>
            }
            {single?.country?.country_name &&
              <div className="flex flex-col">
                <span className='text-sm text-neutral-500'>State</span>
                <h1 className='font-medium text-base'>{single?.state?.state_name}</h1>
              </div>
            }
            {single?.country?.country_name &&
              <div className="flex flex-col">
                <span className='text-sm text-neutral-500'>Country</span>
                <h1 className='font-medium text-base'>{single?.country?.country_name}</h1>
              </div>
            }
            {single?.about_me &&
              <div className="flex flex-col col-span-3">
                <span className='text-sm text-neutral-500'>About Me</span>
                <p className='font-medium text-base'>{single?.about_me}</p>
              </div>
            }
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Agentassistance