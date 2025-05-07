import axios from 'axios';
import { BadgeCheck } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import ChatMessages from '../../Utiles/GetChatMessages';
import CustomButton from '../../Utiles/CustomButton';
import { notify } from '../../Utiles/Notification';
import Loader from '../../Utiles/Loader';

const EnterpreneurDetails = () => {
  const { chat_initiate_id, client_unique_id, project_unique_id } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/entu_client_detail`,
        {
          chat_initiate_id,
          client_unique_id,
          project_unique_id,
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
      notify(
        'error',
        error.response?.data?.message || 'Failed to fetch details'
      );
    } finally {
      setLoading(false);
    }
  }, [chat_initiate_id, client_unique_id, project_unique_id, user]);

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
        if (response.data.isChat) {
          navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`);
        } else {
          setMessageLoading(false);
        }
      } else if (!response.data.status) {
        setMessageLoading(false);
      }
    } catch (error) {
      console.log(error);

      setMessageLoading(false);
      notify('error', 'Unauthorized access please login again');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;
  if (!clientData)
    return (
      <div className="p-6 text-gray-500 text-center">
        No Opportunity data available.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-6 text-[#05004E] pb-3 border-b border-gray-200 ">
        Opportunity Details
      </h1>
      <div className="space-y-6 border-b border-gray-200 pb-4">
        <div className="flex items-start space-x-4">
          <div className="h-16 w-16 flex-shrink-0">
            <img
              src={
                clientData?.customer_profile_image || '/api/placeholder/64/64'
              }
              alt={clientData?.client_name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex gap-5 items-center">
              <h3 className="text-xl font-semibold text-gray-900 capitalize">
                {clientData?.client_name}
              </h3>
              {clientData?.isVerified && (
                <BadgeCheck className="w-8 h-8 text-blue-500" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6 mt-3 border-b border-gray-200 pb-3">
        <h1 className="text-lg font-semibold mb-6 text-[#05004E]">Message</h1>
        {chat_initiate_id && (
          <ChatMessages
            chatId={chat_initiate_id}
            userId={user?.customer?.customer_unique_id}
            onlyLastMessage={true}
          />
        )}
      </div>
      <div className=" pt-4 w-full">
        <h4 className="text-lg font-semibold mb-4">Project</h4>
        <Link
          to={`/agent/projects/${clientData?.project_unique_id}`}
          target="_blank"
        >
          <div className="flex w-full flex-col sm:flex-row bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="aspect-video w-full sm:w-1/2">
              <img
                src={
                  clientData?.projectMedia?.[0]?.media_link ||
                  '/api/placeholder/400/320'
                }
                alt={clientData?.title}
                className="w-full  h-full object-cover"
              />
            </div>
            <div className="p-4 w-full sm:w-1/2">
              <h3 className="text-xl font-medium text-gray-900 mb-1">
                {clientData?.title}
              </h3>
              <div className='my-3 flex flex-row gap-2' >
              <p className="w-1/2 p-3 rounded-md bg-neutral-100 text-gray-800">{clientData?.company_name}</p>
              <p className="w-1/2 p-3 rounded-md bg-neutral-100 text-gray-900">
                ${clientData?.fund_amount} for {clientData?.equity}% equity
              </p>
              </div>
              <p className="text-gray-700 text-sm">{clientData?.description}</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex justify-start space-x-4 pt-4">
        <CustomButton
          onClick={() =>
            handleMessage(
              clientData.client_unique_id,
              clientData.project_unique_id
            )
          }
          label={messageLoading ? 'Processing...' : 'Reply'}
        />
      </div>
    </div>
  );
};

export default EnterpreneurDetails;
