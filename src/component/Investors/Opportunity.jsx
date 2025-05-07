import React, { useEffect, useState } from "react";
import { UserState } from "../../context/UserContext";
import { Modal } from "flowbite-react";
import axios from "axios";
import { notify } from "../../Utiles/Notification";
import Loader from "../../Utiles/Loader";
import {
  X,
  File,
  Download,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ChatMessages from "../../Utiles/GetChatMessages";

const Investor = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [opportunityDetails, setOpportunityDetails] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasLead, setHasLead] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentClientId, setCurrentClientId] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [chatInitiateId, setChatInitiateId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/investor_opportunity`,
          {
            customer_unique_id: user?.customer?.customer_unique_id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setProjects(response.data.investor_opportunity || []);
        } else {
          notify("error", response.data.message);
        }
      } catch (error) {
        // notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [baseUrl, user?.token]);

  // const handleOpenModal = async (chat_initiate_id, project_unique_id) => {
  //   setLoading(true);
  //   setModalLoading(true);
  //   setOpenModal(true);
  //   setChatInitiateId(chat_initiate_id);
  //   try {
  //     const response = await axios.post(
  //       `${baseUrl}/opportunity_project_detail`,
  //       {
  //         chat_initiate_id: chat_initiate_id,
  //         project_unique_id: project_unique_id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user?.token}`,
  //         },
  //       }
  //     );
  //     if (response.data.status) {
  //       setOpportunityDetails(response.data.opportunity_project_detail);
  //       setOpenModal(true);
  //     }
  //   } catch (error) {
  //     notify(
  //       "error",
  //       error.response?.data?.message || "Failed to fetch details"
  //     );
  //   } finally {
  //     setLoading(false);
  //     setModalLoading(false);
  //   }
  // };
  // const handleCloseModal = () => {
  //   setOpenModal(false);
  //   setOpportunityDetails(null);
  //   setShowAllServices(false);
  // };

  const handleCustomerClick = async (customer_unique_id) => {
    // navigate(`/investors/single-entrepreneur?entrepreneur_id=${customer_unique_id}`)
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_single_entrepreneur`,
        { customer_unique_id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setCustomerData(response.data.customer_data);
      }
    } catch (error) {
      notify("error", "Failed to fetch customer details");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-[#1D214E] text-2xl font-semibold mb-6">
          Opportunity
        </h1>

        {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {projects.map((item) => (
            <div
              key={item.project_details.project_unique_id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full"
            >
              <div className="w-full">
                <img
                  src={
                    item.project_details.projectMedia.find(
                      (media) => media.media_type === "photo"
                    )?.media_link || "/api/placeholder/400/320"
                  }
                  alt={item.project_details.title}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="text-center mb-1 flex-1">
                  <span className="font-medium text-gray-800 capitalize">
                    <Link
                      className="cursor-pointer hover:text-blue-500 transition-colors hover:underline"
                      target="_blank"
                      to={`/${user.role}/projects/${item.project_details.project_unique_id}`}
                    >
                      {item.project_details.title}
                    </Link>
                  </span>
                  <p className="text-sm text-gray-500 mb-3 capitalize text-center">
                    {item.project_details.category.category_name}
                  </p>
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 font-medium">
                      {item.project_details.fund_amount
                        ? `$${item.project_details.fund_amount} for ${item.project_details.equity}% equity`
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() =>
                      navigate(`/investor/opportunities/${item?.chat_initiate_id}/${item?.project_details.project_unique_id}`)
                      // handleOpenModal(
                      //   item.chat_initiate_id,
                      //   item.project_details.project_unique_id
                      // )
                    }
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-sm border border-gray-100">
          <span className="text-gray-500 text-lg font-medium">
            No Opportunities Available
          </span>
        </div>
      )}
      </div>

      {opportunityDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4 my-6">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">Lead Information</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : opportunityDetails ? (
              <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
                <div
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() =>
                    handleCustomerClick(opportunityDetails.customer_unique_id)
                  }
                >
                  <img
                    src={opportunityDetails.customer_profile_image}
                    alt={opportunityDetails.customer_full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <h5 className="font-medium">
                      {opportunityDetails.customer_full_name}
                    </h5>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {opportunityDetails.project_details.title}
                    </h4>
                    <p className="text-base font-medium text-gray-500">
                      {
                        opportunityDetails.project_details.category
                          .category_name
                      }
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Business Status
                    </h4>
                    <p className="text-base text-gray-500">
                      {
                        opportunityDetails.project_details.stage
                          .business_stage_name
                      }
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Selling
                    </h4>
                    <p className="text-base text-gray-500">
                      {
                        opportunityDetails.project_details.sell_type.split(
                          " "
                        )[1]
                      }
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Message
                    </h4>
                    {chatInitiateId && (
                      <ChatMessages
                        chatId={chatInitiateId}
                        userId={user?.customer?.customer_unique_id}
                        onlyLastMessage={true}
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium">Documents</h5>
                    <div className="space-y-2">
                      {opportunityDetails.project_details.pitch_deck_file && (
                        <a
                          href={
                            opportunityDetails.project_details.pitch_deck_file
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                        >
                          <File className="w-4 h-4" />
                          <span>View Pitch Deck</span>
                        </a>
                      )}
                      {opportunityDetails.project_details.projectMedia
                        .filter((media) => media.media_type === "document")
                        .map((doc, index) => (
                          <a
                            key={index}
                            href={doc.media_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                          >
                            <File className="w-4 h-4" />
                            <span>View Document {index + 1}</span>
                          </a>
                        ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        handleMessage(
                          opportunityDetails.client_unique_id,
                          opportunityDetails.project_details.project_unique_id
                        )
                      }
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Failed to load client details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {customerData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCustomerData(null)}
          />

          <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 my-6">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">Entrepreneur Profile</h2>
              <button
                onClick={() => setCustomerData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
              <div className="flex items-center space-x-4">
                <img
                  src={customerData.customer_profile_image}
                  alt={customerData.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between space-x-2">
                    <h3 className="text-xl font-semibold capitalize">
                      {customerData.full_name}
                    </h3>
                    {customerData.is_verified === 1 && (
                      <BadgeCheck className="w-8 h-8 text-[#4A3AFF]" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-gray-600">{customerData.about_me}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Projects</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {customerData.project.map((project) => (
                    <Link
                      to={`/investor/projects/${project.project_unique_id}`}
                      target="_blank"
                    >
                      <div
                        key={project.project_id}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <div className="w-full">
                          <img
                            src={
                              project.medias.find(
                                (media) => media.media_type === "photo"
                              )?.media_link || "/api/placeholder/400/320"
                            }
                            alt={project.title}
                            className="w-full aspect-square object-cover"
                            // onClick={() => handleNewProjectClick(customerData)}
                          />
                        </div>
                        <div className="p-4">
                          <div className="text-center mb-1">
                            <span className="font-medium text-gray-800 capitalize">
                              {project.title}
                            </span>
                            <p className="text-sm text-gray-500 mb-3 capitalize text-center">
                              {project.category.category_name}
                            </p>
                            <div className="flex items-center justify-center">
                              <span className="text-green-500 font-medium">
                                {project.fund_amount
                                  ? `$${project.fund_amount} for ${project.equity}% equity`
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
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
  );
};

export default Investor;
