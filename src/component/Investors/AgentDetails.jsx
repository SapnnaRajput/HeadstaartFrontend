import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import axios from 'axios';
import { notify } from '../../Utiles/Notification';
import { BadgeCheck, ChevronDown, ChevronRight, Globe } from 'lucide-react';
import CustomButton from '../../Utiles/CustomButton';
import Loader from '../../Utiles/Loader';

const AgentDetails = () => {
  const { customer_unique_id, chat_initiate_id } = useParams();
  const { user } = UserState();
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [agentDetails, setAgentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isProject = location.pathname.includes('/agent-for-project')
    ? 'no'
    : 'yes';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/entu_get_agent_profile`,
        {
          customer_unique_id,
          chat_initiate_id,
          project: isProject,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setAgentDetails(response.data.chat_user_data[0]);
      }
    } catch (error) {
      console.log(error);

      notify(
        'error',
        error.response?.data?.message || 'Failed to fetch details'
      );
    } finally {
      setLoading(false);
    }
  }, [customer_unique_id]);

  const displayedServices = showAllServices
    ? agentDetails?.agent_services
    : agentDetails?.agent_services?.slice(0, 1);

  const handelSendMessage = () => {
    navigate(`/${user.role}/messages/${chat_initiate_id}`);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
        <img
          src={agentDetails?.agent_profile_image || '/placeholder.svg'}
          alt=""
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold capitalize">
              {agentDetails?.agent_full_name}
            </h2>
            {agentDetails?.isVerified && (
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            )}
          </div>
          {(
            <p className="text-sm text-gray-500">
              Asking for
              <span className='font-semibold text-green-400 px-2'>
               {agentDetails?.agent_del_per}% 
               </span>
               for Deal
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-3 pb-3 border-b">
        <h2 className="font-semibold text-gray-600">About Me</h2>
     {isProject === 'yes'  &&  <p className="text-sm text-gray-500">{agentDetails?.about_me}</p>}
     {isProject === 'no'  &&  <p className="text-sm text-gray-500">{agentDetails?.agent_about_me}</p>}
      </div>
      <div className="p-6 border-b">
        <h3 className="font-semibold mb-3">Message</h3>
        <p className="text-gray-600 text-sm">
          {agentDetails?.last_message || 'No message available'}
        </p>
      </div>
      <div>
        {agentDetails?.agent_services &&
          agentDetails?.agent_services.length > 0 && (
            <div className="mt-3 pb-3 border-b">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Agent Service</h3>
                {agentDetails?.agent_services.length > 1 && (
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
                  // Each service needs its own expanded state
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
      {isProject === 'yes' && (
        <div className="my-2">
          <h1 className="font-medium text-xl text-gray-700">Project</h1>
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white shadow-md rounded-lg">
            {/* Image Section */}
            <div className="w-full sm:w-1/2">
            <Link target='_blank' to={`/investor/projects/${agentDetails?.project_unique_id}`}>
            <img
                className="w-full h-64 object-cover rounded-lg"
                src={agentDetails?.project_media?.[0]?.media_link}
                alt={agentDetails?.title || 'Project Image'}
              />
            </Link>
             
            </div>

            {/* Content Section */}
            <div className="w-full sm:w-1/2 flex flex-col justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {agentDetails?.title}
                </h1>
                <p className="text-gray-700 mt-2">
                  {agentDetails?.description}
                </p>
              </div>
              <h3 className='my-1 text-gray-500 hover:underline hover:text-blue-500'>
                <Link to={`/investor/entrepreneur-profile/${agentDetails?.entrepreneur_unique_id}`}>
                  {agentDetails?.entrepreneur_name}
                </Link>
              </h3>
              {/* Fund & Status Section */}
              <div className="flex gap-4 mt-4">
                {/* Fund Amount */}
                <div className="flex flex-col justify-center items-center w-1/2 bg-gray-100 p-3 rounded-lg">
                  <h2 className="text-sm font-medium text-gray-600">
                    Fund Amount
                  </h2>
                  <p className="text-lg font-semibold text-gray-900">
                    ${agentDetails?.fund_amount}
                  </p>
                </div>

                {/* Status & Website */}
                <div className="flex flex-col items-center w-1/2 bg-gray-100 p-3 rounded-lg">
                 <a className='hover:underline hover:text-blue-500 font-medium' target='_blank' href={agentDetails?.pitch_deck_file}>
                  Pitch Document
                 </a>
                  {agentDetails?.website_name && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://${agentDetails?.website_name}`}
                      className="flex items-center text-blue-500 mt-2 hover:underline"
                    >
                       <Globe className="w-4 h-4 mr-1" />
                        Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1 justify-end space-x-4 p-4">
        <CustomButton label="Reply" onClick={() => handelSendMessage()} />
      </div>
    </div>
  );
};

export default AgentDetails;
