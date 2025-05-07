import React, { useState, useEffect } from "react";
import CustomButton from "../../../Utiles/CustomButton";
import { Modal } from "flowbite-react";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { BadgeCheck, UserX, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ChatMessages from '../../../Utiles/GetChatMessages'

const EnterOpportunity = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [openModal, setOpenModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [entrepreneur, setEntrepreneur] = useState([]);
  const { user } = UserState();
  const [loading, setLoading] = useState();
  const [clientData, setClientData] = useState(null);
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
            role: "entrepreneur",
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          console.log(response.data);
          setEntrepreneur(response.data.client_with_project);
        } else {
          setEntrepreneur([]);
          // notify("error", response.data.message);
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
    setModalLoading(true);
    setOpenModal(true);
    setChatInitiateId(chat_initiate_id);
    setLoading(true);
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
        console.log(response.data);
        setClientData(response.data.projectList);
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

  };


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
      }
      else if (!response.data.status) {
        setHasLead(response.data.status);
        setModalMessage(response.data.message);
        setOpenModal(false);
        setShowModal(true);
      }
    } catch (error) {
      // notify("error", "Unauthorized access please login again");
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
        <h1 className="text-[#1D214E] text-2xl font-semibold mb-6">
          Entrepreneur
        </h1>
        {entrepreneur.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {entrepreneur.map((item) => (
              <div
                key={item.client_unique_id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full"
              >
                <div className="w-full">
                <Link to={`/agent/entrepreneur-profile/${item.client_unique_id}`}>   
                  <img
                    src={item.customer_profile_image || "/api/placeholder/400/320"}
                    alt={item.client_name}
                    className="w-full aspect-square object-cover"
                  />
                  </Link>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-800 line-clamp-1 hover:text-blue-500">
                     <Link to={`/agent/entrepreneur-profile/${item.client_unique_id}`}>
                       {item.client_name}
                     </Link> 
                    </span>
                    {/* <div className="flex items-center flex-shrink-0 ml-2">
                      <span className="text-sm text-gray-600 mr-1">
                        Asking for
                      </span>
                      <span className="text-green-500 font-medium">
                        {item.deal_per}%
                      </span>
                    </div> */}
                  </div>
                  <p className="text-sm text-gray-500 mb-1 line-clamp-1">{item.title}</p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                    {item.category.category_name}
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/agent/entrepreneur-opportunities/entr/${item.chat_initiate_id}/${item.client_unique_id}/${item.project_unique_id}`)
                      // handleOpenModal(
                      //   item.chat_initiate_id,
                      //   item.project_unique_id,
                      //   item.client_unique_id
                      // )
                    }
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 mt-auto"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 bg-white rounded-2xl shadow-sm border border-gray-100">
            <UserX className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-gray-500 text-lg font-medium">No Entrepreneur Opportunity</span>
          </div>
        )}



        <Modal
          show={openModal}
          onClose={handleCloseModal}
          position="center"
          popup
          theme={{
            content: {
              base: "relative h-full w-full p-4 md:h-auto",
              inner:
                "relative rounded-lg bg-white shadow flex flex-col max-h-[90vh] max-w-2xl mx-auto",
            },
            overlay: {
              base: "fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex min-h-screen items-center justify-center overflow-y-auto overflow-x-hidden md:p-6",
              wrapper:
                "fixed inset-0 z-40 min-h-screen overflow-y-auto overflow-x-hidden md:p-6",
            },
          }}
        >
          <Modal.Header className="p-4 border-b">
            <p>Opportunity Details</p>
          </Modal.Header>
          <Modal.Body className="p-6 overflow-y-auto max-h- max-h-[70vh]">
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : clientData ? (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 flex-shrink-0">
                    <img
                      src={clientData?.customer_profile_image || "/api/placeholder/64/64"}
                      alt={clientData?.client_name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900 capitalize">
                        {clientData?.client_name}
                      </h3>
                      {clientData?.isVerified && (
                        <BadgeCheck className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-semibold mb-4">Message</h4>
                  {chatInitiateId && (
                    <ChatMessages
                      chatId={chatInitiateId}
                      userId={user?.customer?.customer_unique_id}
                      onlyLastMessage={true}
                    />
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-semibold mb-4">Project</h4>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="aspect-video w-full">
                      <img
                        src={clientData?.projectMedia?.[0]?.media_link || "/api/placeholder/400/320"}
                        alt={clientData?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{clientData?.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{clientData?.company_name}</p>
                      <p className="text-sm text-gray-900">
                        ${clientData?.fund_amount} for {clientData?.equity}% equity
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                  <CustomButton onClick={handleCloseModal} label="Back" cancel={true} />
                  <CustomButton
                    onClick={() => handleMessage(clientData.client_unique_id, clientData.project_unique_id)}
                    label="Reply"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Failed to load client details</p>
              </div>
            )}
          </Modal.Body>
        </Modal>

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

export default EnterOpportunity;
