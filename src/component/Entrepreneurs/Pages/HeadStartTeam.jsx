import React, { useState, useEffect } from "react";
import { UserState } from "../../../context/UserContext";
import { notify } from "../../../Utiles/Notification";
import Loader from "../../../Utiles/Loader";
import axios from "axios";
import {
  CircleUserRound,
  FileText,
  BadgeDollarSign,
  HandPlatter,
} from "lucide-react";
import CustomButton from "../../../Utiles/CustomButton";
import { Modal } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import ChatModal from "./ChatModal";

const HeadStartTeam = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [heasstartTeam, setHeasStartTeam] = useState([]);
  const [indexCount, setIndexCount] = useState("");
  const [inboxDetails, setInboxDetails] = useState(true);
  const [headstartService, setHeadStartService] = useState([]);
  const [messageDetails, setMessageDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatDetails, setChatDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("offer");
  const tabs = [
    {
      id: "offer",
      label: "Offer",
      icon: <BadgeDollarSign className="w-4 h-4" />,
    },
    {
      id: "service",
      label: "Service",
      icon: <HandPlatter className="w-4 h-4" />,
    },
  ];
  const ftchTeam = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_headstaart_team`,
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
        notify("success", response.data.message);
        setHeasStartTeam(response.data.headstaart_team_details);
        setIndexCount(response.data.index_count);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const ftchService = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_headstaart_customer_service_web`,
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
        notify("success", response.data.message);
        setHeadStartService(response.data.headstaart_team_details);
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ftchTeam();
    ftchService();
  }, [baseUrl]);

  const handleSendMessage = () => {
    setInboxDetails(false);
    setMessageDetails(true);
  };
  const handleBack = () => {
    setInboxDetails(true);
    setMessageDetails(false);
  };

  const handleShowDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  const handleSendDirectMessage = async (chatId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_all_headstart_inbox_message`,
        {
          headstaart_chat_initiate_id: chatId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        setShowModal(false);
        setShowChatModal(true);
        setChatDetails(response.data.chatDetails);
      } else {
        notify("error", response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "offer":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6"></div>
            {heasstartTeam?.map((item, i) => (
              <div
                key={i}
                className="flex items-center mb-4 py-2 cursor-pointer hover:bg-gray-100 px-6 rounded"
                onClick={() => handleShowDetails(item)}
              >
                <div className="flex-shrink-0 mr-8">
                  {item.user_details.sender_profile_image ? (
                    <img
                      src={item.user_details.sender_profile_image}
                      alt={item.user_details.sender_full_name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      {item.user_details.sender_full_name}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-blue-900 font-medium capitalize">
                    {item.user_details.sender_full_name}
                  </h4>
                  <p className="text-gray-500 capitalize">
                    {item.project_details.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "service":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6"></div>
            {headstartService?.map((item, i) => (
              <div
                key={i}
                className="flex items-center mb-4 py-2 cursor-pointer hover:bg-gray-100 px-6 rounded"
                onClick={() => handleShowDetails(item)}
              >
                <div className="flex-shrink-0 mr-8">
                  {item.user_details.sender_profile_image ? (
                    <img
                      src={item.user_details.sender_profile_image}
                      alt={item.user_details.sender_full_name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      {item.user_details.sender_full_name}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-blue-900 font-medium capitalize">
                    {item.user_details.sender_full_name}
                  </h4>
                  <p className="text-gray-500 capitalize">
                    {item.project_details.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {loading && <Loader />}
      {inboxDetails && (
        <div className="container mx-auto bg-white p-6 mb-5 mx-2 transition-all duration-300">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Headstart Team
          </h1>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-1 rounded-full">
              <CircleUserRound className="w-16 h-16 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Headstart Team
              </h3>
              <p className="text-gray-500 font-medium">Free Lead</p>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-semibold text-gray-700">
                Headstaart Services
              </h4>
              <Link
                to={`/${user.role}/headstaart-services`}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition duration-300 ease-in-out"
              >
                View All
              </Link>
            </div>
            <div
              className="flex items-center justify-between border-b border-gray-200 py-3 cursor-pointer"
              onClick={handleSendMessage}
            >
              <p className="text-xl font-semibold text-gray-700">Inbox</p>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {indexCount > 0 ? indexCount : 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {messageDetails && (
        <>
          <div className="container mx-auto bg-white rounded-lg p-4 m-2">
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">
              Headstart Team
            </h1>
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-100">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-6 text-sm font-medium relative ${
                        activeTab === tab.id
                          ? "text-[#4A3AFF] bg-[#4A3AFF]/5"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {tab.icon}
                      <span>
                        {tab.label} {}
                      </span>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A3AFF]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6">{renderContent()}</div>
            </div>
            <div className="flex justify-end my-4 gap-4">
              <CustomButton label="Back" cancel={true} onClick={handleBack} />
            </div>
          </div>
        </>
      )}

      {selectedItem && (
        <Modal show={showModal} onClose={handleCloseModal} size="lg">
          <Modal.Body className="p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Headstaart Team
              </h2>

              <div className="space-y-4">
                <Link
                  to={`/${user.role}/projects/${selectedItem?.project_details.project_unique_id}`}
                  target="_blank"
                >
                  <img
                    src={selectedItem?.projectMedia[0].media_link}
                    alt="City street view"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </Link>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 capitalize">
                    {selectedItem?.project_details.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedItem.project_details.category.category_name}
                  </p>
                  <p className="mt-2 text-gray-700">
                    ${selectedItem.project_details.fund_amount} for{" "}
                    {selectedItem.project_details.equity}% equity.
                  </p>
                  <div>
                    {selectedItem.headstaartServices &&
                    selectedItem.headstaartServices.length > 0 ? (
                      <div className="space-y-6">
                        <h4 className="font-medium mt-3 text-gray-900">
                          Our Services
                        </h4>
                        {selectedItem.headstaartServices.map(
                          (service, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                            >
                              <div className="p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-lg font-semibold text-gray-900">
                                    {service.title}
                                  </h5>
                                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                                    {service.status}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-600 font-medium">
                                  {service.sub_title}
                                </p>

                                <p className="text-sm text-gray-600">
                                  {service.paragraph}
                                </p>

                                <div className="pt-4 border-t border-gray-100">
                                  <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <span className="font-medium mr-2">
                                        Location:
                                      </span>
                                      {service.city.city_name},{" "}
                                      {service.state.state_name},{" "}
                                      {service.country.country_name}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div>
                        {activeTab === "offer" && (
                          <>
                            <h4 className="font-medium text-gray-900 mt-3">
                              Our Offer
                            </h4>
                            {(user.role === "investor" ||
                              user.role === "agent") && (
                              <p>
                                <span className="text-green-500">
                                  {" "}
                                  {selectedItem.deal_per}%{" "}
                                </span>{" "}
                                of the deal.
                              </p>
                            )}

                            {user.role === "entrepreneur" && (
                              <p className="mt-2 text-gray-700">
                              <span className="text-green-500">${selectedItem.fund_amount}</span>{" "}  for{" "}
                                {selectedItem.equity}% equity.
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {selectedItem.inbox_message &&
                  selectedItem.inbox_message.headstaart_chat_message && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Inbox</h4>
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-600">
                          {selectedItem.inbox_message.headstaart_chat_message}
                        </p>
                      </div>
                    </div>
                  )}
                {selectedItem?.projectMedia?.some(
                  (media) => media.media_type === "document"
                ) && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    {selectedItem.projectMedia
                      .filter((media) => media.media_type === "document")
                      .map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 text-sm text-gray-600"
                        >
                          <FileText className="h-5 w-5 text-red-500" />
                          <a
                            href={doc.media_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {doc.media_title || `Document ${index + 1}`}
                          </a>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="bg-gray-50 flex justify-end gap-3">
            <CustomButton
              label="Reply"
              onClick={() =>
                handleSendDirectMessage(
                  selectedItem.headstaart_chat_initiate_id
                )
              }
            />
            <CustomButton
              label="Close"
              cancel={true}
              onClick={handleCloseModal}
            />
          </Modal.Footer>
        </Modal>
      )}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        chatDetails={chatDetails}
        headstaartChatInitiateId={selectedItem?.headstaart_chat_initiate_id}
        senderUniqueId={user?.customer?.customer_unique_id}
        receiverUniqueId={selectedItem?.user_details.sender_unique_id}
      />
    </>
  );
};

export default HeadStartTeam;
