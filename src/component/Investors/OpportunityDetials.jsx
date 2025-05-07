import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import { notify } from '../../Utiles/Notification';
import axios from 'axios';
import { ChevronRight, File } from 'lucide-react';
import ChatMessages from '../../Utiles/GetChatMessages';
import Loader from '../../Utiles/Loader';
import CustomButton from '../../Utiles/CustomButton';

const OpportunityDetials = () => {
  const { chat_initiate_id, project_unique_id } = useParams();
  const { user } = UserState();
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [opportunityDetails, setOpportunityDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [agentDetails,setAgentDetails] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/opportunity_project_detail`,
        {
          chat_initiate_id: chat_initiate_id,
          project_unique_id: project_unique_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setOpportunityDetails(response.data.opportunity_project_detail);
        setAgentDetails(response.data.opportunity_project_detail.client_detail);
      }
    } catch (error) {
      notify(
        'error',
        error.response?.data?.message || 'Failed to fetch details'
      );
    } finally {
      setLoading(false);
    }
  }, [chat_initiate_id, project_unique_id]);

  const handleMessage = async (id, projectId) => {
    setMessageLoading(true);
    try {
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
        setMessageLoading(false);
        if (response.data.isChat) {
          navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`);
        } else {
          setHasLead(response.data.status);
        }
      } else if (!response.data.status) {
        if (response.data.isChat) {
          setHasLead(response.data.status);
        }
      }
    } catch (error) {
      setMessageLoading(false);
      notify('error', 'Unauthorized access please login again');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;
  if (!opportunityDetails)
    return (
      <div className="p-6 text-gray-500 text-center">No Opportunity Data.</div>
    );
    const displayedServices = showAllServices
    ? agentDetails?.agentservice
    : agentDetails?.agentservice?.slice(0, 1);
  return (
    <>
    <div className="p-6">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
        <img
          src={agentDetails?.customer_profile_image || '/placeholder.svg'}
          alt=""
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold capitalize">
              {agentDetails?.full_name}
            </h2>
            {agentDetails?.isVerified && (
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            )}
          </div>
          {(
            <p className="text-sm text-gray-500">
              Asking for
              <span className='font-semibold text-green-400 px-2'>
               {agentDetails?.deal_per}% 
               </span>
               for Deal
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-3 pb-3 border-b">
        <h2 className="font-semibold text-gray-600">About Me</h2>
     { <p className="text-sm text-gray-500">{agentDetails?.about_me}</p>}
     { <p className="text-sm text-gray-500">{agentDetails?.agent_about_me}</p>}
      </div>
      <div>
        {agentDetails?.agentservice &&
          agentDetails?.agentservice.length > 0 && (
            <div className="mt-3 pb-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Agent Service</h3>
                {agentDetails?.agentservice.length > 1 && (
                  <button
                    onClick={() => setShowAllServices(!showAllServices)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    {showAllServices ? 'View Less' : 'View More'}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {displayedServices?.map((service, i) => {
                  return (
                    <div key={i} className="p-4 rounded-lg border">
                      <div
                        className="flex items-center justify-between mb-2 cursor-pointer"
                        onClick={() => setExpanded(!expanded)}
                      >
                        <h4 className="font-medium">
                          {service?.category?.category_name}
                        </h4>
                        {expanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p
                        className={`text-sm text-gray-600 ${
                          expanded ? '' : 'line-clamp-2'
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
      </div>
          </div>

          <div className="p-4 md:p-6 w-full bg-white rounded-lg shadow-sm">
  <div className="flex w-full flex-col lg:flex-row gap-6">
    {/* Left Column */}
    <div className="w-full lg:w-1/2">
      {/* Entrepreneur Profile Card */}
      <div
        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
        onClick={() =>
          navigate(
            `/investor/opportunities/entrepreneur/${opportunityDetails?.customer_unique_id}`
          )
        }
      >
        <img
          src={opportunityDetails?.customer_profile_image}
          alt={opportunityDetails?.customer_full_name}
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
        />
        <div className="flex items-center justify-between flex-1">
          <h5 className="font-medium text-gray-900">
            {opportunityDetails?.customer_full_name}
          </h5>
          <ChevronRight className="w-5 h-5 text-indigo-400" />
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-5 mt-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <h4 className="text-lg font-semibold text-gray-900">
            {opportunityDetails?.project_details.title}
          </h4>
          <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {opportunityDetails?.project_details.category.category_name}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-medium text-gray-500">Business Status</h4>
            <p className="text-base font-medium text-gray-900">
              {opportunityDetails?.project_details.stage.business_stage_name}
            </p>
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-medium text-gray-500">Selling</h4>
            <p className="text-base font-medium text-gray-900">
              {opportunityDetails?.project_details.sell_type.split(' ')[1]}
            </p>
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">Message</h4>
        <div className="bg-white rounded-md p-3 min-h-24 border border-gray-200">
          {chat_initiate_id ? (
            <ChatMessages
              chatId={chat_initiate_id}
              userId={user?.customer?.customer_unique_id}
              onlyLastMessage={true}
            />
          ) : (
            <p className="text-gray-400 text-sm italic">No messages yet</p>
          )}
        </div>
      </div>
    </div>

    {/* Right Column */}
    <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
      {/* Documents Section */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 h-full">
        <h5 className="font-medium text-gray-900 mb-4">Documents</h5>
        <div className="space-y-4">
          {opportunityDetails?.project_details.pitch_deck_file && (
            <a
              href={opportunityDetails?.project_details.pitch_deck_file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-indigo-600 hover:text-indigo-700 bg-white p-3 rounded-md border border-gray-200 transition-all hover:shadow-sm"
            >
              <File className="w-5 h-5" />
              <span className="font-medium">Pitch Deck</span>
            </a>
          )}
          
          {opportunityDetails?.project_details.projectMedia
            .filter((media) => media.media_type === "document")
            .map((doc, index) => (
              <a
                key={index}
                href={doc.media_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-indigo-600 hover:text-indigo-700 bg-white p-3 rounded-md border border-gray-200 transition-all hover:shadow-sm"
              >
                <File className="w-5 h-5" />
                <span className="font-medium">Document {index + 1}</span>
              </a>
            ))}
            
          {!opportunityDetails?.project_details.pitch_deck_file && 
           (!opportunityDetails?.project_details.projectMedia || 
            opportunityDetails?.project_details.projectMedia.filter(m => m.media_type === 'document').length === 0) && (
            <p className="text-gray-400 text-sm italic p-3">No documents available</p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() =>
              handleMessage(
                opportunityDetails?.client_unique_id,
                opportunityDetails?.project_details.project_unique_id
              )
            }
            className="px-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
            disabled={messageLoading}
          >
            {messageLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  );
};

export default OpportunityDetials;
