import React, { useState, useEffect } from "react";
import CustomButton from "../../../../Utiles/CustomButton";
import { Modal } from "flowbite-react";
import { UserState } from "../../../../context/UserContext";
import Loader from "../../../../Utiles/Loader";
import { notify } from "../../../../Utiles/Notification";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { BadgeCheck, UserX, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ChatMessages from "../../../../Utiles/GetChatMessages";

const AgentOpportunity = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [openModal, setOpenModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agent, setAgent] = useState([]);
  const { user } = UserState();
  const [loading, setLoading] = useState();
  const [clientData, setClientData] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasLead, setHasLead] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentClientId, setCurrentClientId] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [chatInitiateId, setChatInitiateId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const postData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/entu_opprotunity`,
          {
            role: "agent",
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setAgent(response.data.client_with_project);
        } else {
          setAgent([]);
          notify("error", response.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    postData();
  }, [baseUrl, user]);

  const handleOpenModal = async (
    chat_initiate_id,
    project_unique_id,
    client_unique_id
  ) => {
    setLoading(true);
    setModalLoading(true);
    setOpenModal(true);
    setChatInitiateId(chat_initiate_id);
    try {
      const response = await axios.post(
        `${baseUrl}/entu_client_detail`,
        {
          chat_initiate_id: chat_initiate_id,
          client_unique_id: client_unique_id,
          project_unique_id: project_unique_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setClientData(response.data.projectList);
        setOpenModal(true);
      }
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message || "Failed to fetch details"
      );
    } finally {
      setLoading(false);
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setClientData(null);
    // setShowAllServices(false);
  };

  const displayedServices = showAllServices
    ? clientData?.agent_service
    : clientData?.agent_service?.slice(0, 2);

  const handleMessage = async (id, projectId) => {
    setLoading(true);
    try {
      setCurrentClientId(id);
      setCurrentProjectId(projectId);
      const response = await axios.post(
        `${baseUrl}/lead_detail_web`,
        {
          customer_unique_id: id,
          project_unique_id: projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        if (response.data.isChat) {
          navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`);
        } else {
          setHasLead(response.data.status);
          setModalMessage(response.data.message);
          setOpenModal(false);
          setShowModal(true);
        }
      } else if (!response.data.status) {
        if (response.data.isChat) {
          setHasLead(response.data.status);
          setModalMessage(response.data.message);
          setOpenModal(false);
          setShowModal(true);
        }
      }
    } catch (error) {
      notify("error", "Unauthorized access please login again");
    }
    setLoading(false);
  };

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/opportunity_lead_cut`,
        {
          customer_unique_id: currentClientId,
          project_unique_id: currentProjectId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setShowModal(false);
        navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`);
      } else {
        navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleBuyLead = () => {
    navigate(`/${user.role}/purchase-lead`);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="p-6">
        <h1 className="text-[#1D214E] text-2xl font-semibold mb-6">Agent</h1>
        {agent.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <UserX className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Agent Available
            </h2>
            <p className="text-gray-500 max-w-md">
              There are currently no Agent in the system. New Agent will appear
              here when they join.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {agent.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full"
            >
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={item.customer_profile_image}
                  alt={item.client_name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800 capitalize truncate mr-2">
                      {item.client_name}
                    </span>
                    <div className="flex items-center flex-shrink-0">
                      <span className="text-sm text-gray-600 mr-1">
                        Asking for
                      </span>
                      <span className="text-green-500 font-medium">
                        {item.deal_per}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1 line-clamp-1">{item.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {item.category.category_name}
                  </p>
                </div>
                <button
                  onClick={() =>
                      navigate(`/entrepreneur/agent-opportunities/${item.chat_initiate_id}/${item.client_unique_id}/${item.project_unique_id}`)
                    // handleOpenModal(
                    //   item.chat_initiate_id,
                    //   item.project_unique_id,
                    //   item.client_unique_id
                    // )
                  }
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 mt-4"
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
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
};

export default AgentOpportunity;
