import React, { useState, useEffect } from 'react';
import CustomButton from '../../../Utiles/CustomButton';
import { Modal } from 'flowbite-react';
import { UserState } from '../../../context/UserContext';
import Loader from '../../..//Utiles/Loader';
import { notify } from '../../../Utiles/Notification';
import axios from 'axios';
import { BadgeCheck, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatMessages from '../../../Utiles/GetChatMessages';

const InvestorOpportunity = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [openModal, setOpenModal] = useState(false);
  const [investor, setInvestor] = useState([]);
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasLead, setHasLead] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentClientId, setCurrentClientId] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [chatInitiateId, setChatInitiateId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const postData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/entu_opprotunity`, {
          role: 'investor',
        }, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setInvestor(response.data.client_with_project);
        } else {
          setInvestor([]);
          // notify('error', response.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    postData();
  }, [baseUrl, user]);

  const handleOpenModal = async (chat_initiate_id, project_unique_id, client_unique_id) => {
    setLoading(true);
    try {
      setModalLoading(true);
      setOpenModal(true);
      setChatInitiateId(chat_initiate_id);
      const response = await axios.post(
        `${baseUrl}/entu_client_detail`,
        {
          chat_initiate_id: chat_initiate_id,
          client_unique_id: client_unique_id,
          project_unique_id: project_unique_id
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setClientData(response.data.projectList);
      }
    } catch (error) {
      notify('error', error.response?.data?.message || 'Failed to fetch details');
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
      const response = await axios.post(`${baseUrl}/lead_detail_web`, {
        customer_unique_id: id,
        project_unique_id: projectId,
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
        customer_unique_id: currentClientId,
        project_unique_id: currentProjectId,
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
      <div className="p-6">
        <h1 className="text-[#1D214E] text-2xl font-semibold mb-6">Investor</h1>
        {investor.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {investor.map((item) => (
              <div
                key={item.project_unique_id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full"
              >
                <div className="w-full">
                  <img
                    src={item.customer_profile_image || '/api/placeholder/400/320'}
                    alt={item.client_name}
                    className="w-full aspect-square object-cover"

                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800 line-clamp-1">
                      {item.client_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                    {item.category?.category_name}
                  </p>
                  <button
                    onClick={() => 
                      navigate(`/agent/entrepreneur-opportunities/invest/${item.chat_initiate_id}/${item.client_unique_id}/${item.project_unique_id}`)
                      // handleOpenModal(item.chat_initiate_id, item.project_unique_id, item.client_unique_id)
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
            <Users className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-gray-500 text-lg font-medium">No Investor Opportunity</span>
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
              inner: "relative rounded-lg bg-white shadow flex flex-col max-h-[90vh] max-w-xl mx-auto"
            }
          }}
        >
          <Modal.Header className="p-4 border-b">
            <p>Opportunity Details</p>
          </Modal.Header>
          <Modal.Body className="p-6">
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : clientData ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src={clientData?.customer_profile_image || "/api/placeholder/48/48"}
                    alt={clientData?.client_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {clientData?.client_name}
                      </h3>
                    </div>
                    <div>
                      {clientData?.isVerified ? (
                        <BadgeCheck className="w-8 h-8 text-blue-500" />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-600">
                    {chatInitiateId && (
                      <ChatMessages
                        chatId={chatInitiateId}
                        userId={user?.customer?.customer_unique_id}
                        onlyLastMessage={true}
                      />
                    )}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Project</h4>
                  {clientData?.projectMedia?.length > 0 ? (
                    <img
                      src={clientData.projectMedia[0]?.media_link}
                      alt="Project"
                      className="w-full h-48 rounded-lg object-cover mb-3"
                    />
                  ) : (
                    <img
                      src={"/api/placeholder/400/320"}
                      alt="Project placeholder"
                      className="w-full h-48 rounded-lg object-cover mb-3"
                    />
                  )}
                  <div className="space-y-2">
                    <h5 className="font-medium">{clientData?.title}</h5>
                    <p className="text-sm text-gray-600">
                      {clientData?.company_name} • {clientData?.city?.city_name}, {clientData?.state?.state_name}
                    </p>
                    <p className="text-sm text-gray-600">{clientData?.description}</p>
                    {clientData?.pitch_deck_file && (
                      <a
                        href={clientData.pitch_deck_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium inline-block mt-2"
                      >
                        View Pitch Deck
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <CustomButton onClick={handleCloseModal} label="Back" cancel={true} />
                  <CustomButton onClick={() => handleMessage(clientData.client_unique_id, clientData.project_unique_id)} label="Reply" />
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

export default InvestorOpportunity;