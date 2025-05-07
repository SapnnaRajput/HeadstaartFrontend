import React, { useEffect, useState } from "react";
import { UserState } from "../../context/UserContext";
import axios from "axios";
import Loader from "../../Utiles/Loader";
import { notify } from "../../Utiles/Notification";
import { Link, useNavigate } from "react-router-dom";
import { Mail, BadgeCheck, ChevronRight, ChevronDown, X } from "lucide-react";
import CustomButton from "../../Utiles/CustomButton";

const AgentForProject = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [singleAgent, setSingleAgent] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchAssistance = async () => {
    setSkeletonLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/investor_agent_assistance`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          project_type: "with project",
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        setAgents(response?.data?.data?.agent_with_project);
      } else {
        notify("error", response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
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
    navigate(`/investor/agent-with-project/${agent?.agent_unique_id}/${agent?.chat_initiate_id}`)
    // setOpenModal(true);
    // setSingleAgent(agent);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSingleAgent(null);
  };
  const handelSendMessage = (chatId) => {
    navigate(`/${user.role}/messages/${chatId}`);
  };

  return (
    <>
      {/* {loading && <Loader />} */}

      {skeletonLoading && (
        <div className="container rounded-xl md:p-6 p-3 bg-white">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
          <div className="grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="shadow-xl rounded-xl overflow-hidden animate-pulse"
              >
                <div className="w-full h-40 bg-gray-300"></div>
                <div className="flex flex-col pt-2 gap-1 justify-center items-center p-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="mt-5 h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!skeletonLoading && (
        <div className="container rounded-2xl bg-white">
          <div className=" px-6 py-4 ">
            <h1 className="text-2xl font-bold text-black">Agent Assistance</h1>
          </div>
          {agents.length > 0 ? (
           <div className="grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5 p-6">
           {agents.map((agent) => (
             <div
               key={agent.agent_unique_id}
               className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] flex flex-col "
             >
               <div className="relative h-48 w-full flex-shrink-0">
                 <img
                   src={agent.agent_profile_image || "/placeholder.svg"}
                   alt={agent.agent_full_name}
                   className="w-full h-full object-cover cursor-pointer"
                   onClick={() => handleAgentClick(agent)}
                 />
                 {agent.isVerified && (
                   <div className="absolute top-2 right-2 bg-blue-500/10 rounded-full p-1">
                     <BadgeCheck className="w-6 h-6 text-blue-500" />
                   </div>
                 )}
               </div>
               
               <div className="flex flex-col items-center p-4 text-center justify-between">
                 <div className="w-full">
                   <div 
                     className="cursor-pointer mb-1"
                     onClick={() => handleAgentClick(agent)}
                   >
                     <h2 className="font-bold text-base text-[#05004E] capitalize truncate">
                       {agent.agent_full_name}
                     </h2>
                   </div>
                   
                   <div className="mb-2 overflow-hidden">
                     <Link 
                       className="text-sm text-gray-500 capitalize line-clamp-2 hover:text-blue-500 transition-colors hover:underline block" 
                       target="_blank" 
                       to={`/${user.role}/projects/${agent.project_unique_id}`}
                     >
                       {agent.title}
                     </Link>
                   </div>
                   
                   <h3 className="text-base text-black mb-4">
                     Asking for: <span className="text-green-600 font-semibold">{agent.agent_del_per}%</span>
                   </h3>
                 </div>
                 
                 <div className="w-full">
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
          ) : (
            <div className="flex justify-center items-center h-48 bg-white rounded-2xl shadow-sm border border-gray-100">
              <span className="text-gray-500 text-lg font-medium">
                No Agent Assistance Available
              </span>
            </div>
          )}
        </div>
      )}

      {openModal && singleAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Add cross button in the top-right corner */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="p-6 border-b">
              <div className="flex items-center gap-4">
                <img
                  src={singleAgent.agent_profile_image || "/placeholder.svg"}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold capitalize">
                      {singleAgent.agent_full_name}
                    </h2>
                    {singleAgent.isVerified && (
                      <BadgeCheck className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {singleAgent.fund_amount && (
                    <p className="text-sm text-gray-500">
                      Asking for {singleAgent.agent_del_per}$ for Deal
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <h3 className="font-semibold mb-3">Message</h3>
              <p className="text-gray-600 text-sm">
                {singleAgent.last_message || "No message available"}
              </p>
            </div>

            {singleAgent.agent_services &&
              singleAgent.agent_services.length > 0 && (
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Agent Service</h3>
                    {singleAgent.agent_services.length > 1 && (
                      <button
                        onClick={() => setShowAllServices(!showAllServices)}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        {showAllServices ? "View Less" : "View More"}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {displayedServices?.map((service) => {
                      // Each service needs its own expanded state

                      return (
                        <div
                          key={service.agent_service_unique_id}
                          className="p-4 rounded-lg border"
                        >
                          <div
                            className="flex items-center justify-between mb-2 cursor-pointer"
                            onClick={() => setExpanded(!expanded)}
                          >
                            <h4 className="font-medium">
                              {service.category.category_name}
                            </h4>
                            {expanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <p
                            className={`text-sm text-gray-600 ${
                              expanded ? "" : "line-clamp-2"
                            }`}
                          >
                            {service.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {singleAgent.project_media &&
              singleAgent.project_media.length > 0 && (
                <div className="p-6 border-b">
                  <h3 className="font-semibold mb-4">Project</h3>
                  <div className="rounded-lg border overflow-hidden">
                    <img
                      src={
                        singleAgent.project_media[0]?.media_link ||
                        "/placeholder.svg"
                      }
                      alt="Project"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-medium mb-1 capitalize">
                        {singleAgent.title}
                      </h4>
                      {singleAgent.fund_amount && singleAgent.equity && (
                        <p className="text-sm text-gray-500">
                          ${singleAgent.fund_amount} for {singleAgent.equity}%
                          equity
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

            <div className="flex justify-end space-x-4 p-4">
              <CustomButton
                label="Reply"
                onClick={() => handelSendMessage(singleAgent.chat_initiate_id)}
              />
              <CustomButton
                onClick={handleCloseModal}
                label="Back"
                cancel={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentForProject;
