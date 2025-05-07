import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserState } from "../../../context/UserContext";
import { notify } from "../../../Utiles/Notification";
import { BadgeCheck } from "lucide-react";
import ChatMessages from "../../../Utiles/GetChatMessages";
import CustomButton from "../../../Utiles/CustomButton";
import Loader from "../../../Utiles/Loader";

const AgentDetails = () => {
  const { chat_initiate_id, client_unique_id, project_unique_id } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const navigate = useNavigate();

  const [clientData, setClientData] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);

  const fetchAgentDetails = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${baseUrl}/entu_client_detail`,
        { chat_initiate_id, client_unique_id, project_unique_id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (data.status) setClientData(data.projectList);
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message || "Failed to fetch details"
      );
    } finally {
      setLoading(false);
    }
  }, [
    chat_initiate_id,
    client_unique_id,
    project_unique_id,
    user?.token,
    baseUrl,
  ]);

  useEffect(() => {
    fetchAgentDetails();
  }, [fetchAgentDetails]);

  const handleMessage = async () => {
    setMessageLoading(true);
    try {
      const { data } = await axios.post(
        `${baseUrl}/lead_detail_web`,
        { customer_unique_id: client_unique_id, project_unique_id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (data.status && data.isChat) {
        navigate(`/${user.role}/messages/${data.chat_initiate_id}`);
      }
    } catch (error) {
      notify("error", "Unauthorized access, please login again");
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!clientData)
    return (
      <div className="p-6 text-gray-500 text-center">
        No agent data available.
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-6 pb-5 border-b border-gray-200">
        <img
          src={clientData.customer_profile_image || "/api/placeholder/64/64"}
          alt={clientData.client_name || "Client"}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex gap-2">
            {clientData.client_name}
            {clientData.isVerified && (
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            )}
          </h3>
          <span className="text-sm text-gray-500">
            Asking for <span className="font-semibold px-1 text-green-600">{clientData.deal_per}%</span>
          </span>
          <p>{clientData.about_me}</p>
        </div>
      </header>

      {chat_initiate_id && (
        <section className="border-b border-gray-200 pb-5">
          <h3 className="text-lg font-semibold">Messages</h3>
          <ChatMessages
            chatId={chat_initiate_id}
            userId={user?.customer?.customer_unique_id}
            onlyLastMessage
          />
        </section>
      )}

      <section className="border-b border-gray-200 pb-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Agent Services</h3>
          {clientData.agent_service?.length > 2 && (
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              {showAllServices ? "Show Less" : "View More"}
            </button>
          )}
        </div>
        <div className="space-y-4">
          {(showAllServices
            ? clientData.agent_service
            : clientData.agent_service.slice(0, 2)
          )?.map((service) => (
            <div
              key={service.agent_service_unique_id}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900">
                  {service.category.category_name}
                </h5>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    service.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-lg font-semibold mb-4">Project</h4>
        <Link
          to={`/entrepreneur/projects/${clientData.project_unique_id}`}
          target="_blank"
          className="block bg-white"
        >
          <div className="relative flex w-full flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-1/2">
              {clientData?.isStudent && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-base px-2 py-1 rounded-md">
                  {clientData?.school_university}
                </span>
              )}

              <img
                src={
                  clientData.projectMedia?.[0]?.media_link ||
                  "/api/placeholder/400/320"
                }
                alt={clientData.title || "Project Image"}
                className="w-full rounded-md aspect-video object-cover"
              />
            </div>

            <div className="w-full sm:w-1/2 space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {clientData.title}
              </h3>
              <p className="text-gray-800">{clientData.company_name}</p>
              <p className="font-medium text-gray-900">
                ${clientData?.fund_amount} for {clientData?.equity}% equity
              </p>
              <p>{clientData?.description}</p>
            </div>
          </div>
        </Link>
      </section>

      <div className="pt-4">
        <CustomButton
          onClick={handleMessage}
          label={messageLoading ? "Processing..." : "Reply"}
          disabled={messageLoading}
        />
      </div>
    </div>
  );
};

export default AgentDetails;
