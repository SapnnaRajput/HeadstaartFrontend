import { BadgeCheck } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';
import ChatMessages from '../../../Utiles/GetChatMessages';
import CustomButton from '../../../Utiles/CustomButton';

const InvestorDetails = () => {
  const { chat_initiate_id, client_unique_id, project_unique_id } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();

  const [loading, setLoading] = useState(true); // For fetching investor details
  const [messageLoading, setMessageLoading] = useState(false); // Separate loader for messaging
  const [clientData, setClientData] = useState(null);
  const [hasLead, setHasLead] = useState(false);
  const navigate = useNavigate();

  const fetchInvestorDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/entu_client_detail`,
        { chat_initiate_id, client_unique_id, project_unique_id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (response.data.status) {
        console.log(response.data.projectList);
        
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
  }, [
    chat_initiate_id,
    client_unique_id,
    project_unique_id,
    user?.token,
    baseUrl,
  ]);

  const handleMessage = async (id, projectId) => {
    setMessageLoading(true); // Show loading for the button
    try {
      const response = await axios.post(
        `${baseUrl}/lead_detail_web`,
        {
          customer_unique_id: id,
          project_unique_id,
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
        }
      } else if (!response.data.status) {
        if (response.data.isChat) {
          setHasLead(response.data.status);
        }
      }
    } catch (error) {
      console.log(error);
      notify('error', 'Unauthorized access please login again');
    } finally {
      setMessageLoading(false); // Hide loader after request is done
    }
  };

  useEffect(() => {
    fetchInvestorDetails();
  }, [fetchInvestorDetails]);

  if (loading) return <Loader />;
  if (!clientData)
    return (
      <div className="p-6 text-gray-500 text-center">
        No investor data available.
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center">
        <img
          src={clientData.customer_profile_image || '/api/placeholder/64/64'}
          alt={clientData.client_name || 'Investor'}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 capitalize flex items-center gap-2">
            {clientData.client_name}
            {clientData.isVerified && (
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            )}
          </h3>
          <p>{clientData.about_me}</p>
        </div>
      </div>
      <div className="mt-3 pb-5">
        <h3 className="text-lg font-semibold mb-3">Messages</h3>
        {chat_initiate_id && (
          <ChatMessages
            chatId={chat_initiate_id}
            userId={user?.customer?.customer_unique_id}
            onlyLastMessage={true}
          />
        )}
      </div>
      <div className="mt-3 pb-5">
        <h3 className="text-lg font-semibold mb-3">Project</h3>
        <Link
            to={`/entrepreneur/projects/${clientData?.project_unique_id}`}
            target="_blank"
          >
        <div className="w-full flex flex-col sm:flex-row gap-5 ite">
          <div className='w-full sm:w-1/2'>
            {clientData?.projectMedia?.length > 0 ? (
              <img
                src={clientData.projectMedia[0]?.media_link}
                alt="Project"
                className="w-full h-72 rounded-md object-cover mb-3"
              />
            ) : (
              <img
                src={'/api/placeholder/400/320'}
                alt="Project placeholder"
                className="w-full h-72 rounded-lg object-cover mb-3"
              />
            )}
             </div>
            <div className="space-y-2 w-full sm:w-1/2">
              <h5 className="font-semibold text-2xl">{clientData?.title}</h5>
              <p className="text-gray-600">
                {clientData?.company_name} • {clientData?.city?.city_name},{' '}
                {clientData?.state?.state_name}
              </p>
              <p className=" text-gray-600">{clientData?.description}</p>
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
        </Link>
      </div>
      <div className="flex justify-start gap-4">
        <CustomButton
          onClick={() =>
            handleMessage(
              clientData.client_unique_id,
              clientData.project_unique_id
            )
          }
          label={messageLoading ? 'Processing...' : 'Reply'} // Show different text when loading
          disabled={messageLoading} // Disable button while loading
        />
      </div>
    </div>
  );
};

export default InvestorDetails;
