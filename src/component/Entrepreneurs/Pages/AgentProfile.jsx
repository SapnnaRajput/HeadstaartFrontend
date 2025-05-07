import { BadgeCheck } from 'lucide-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

const AgentProfile = () => {
  const location = useLocation();
  const data = location.state;

  return (
    <div className="p-6  mx-auto bg-white ">
      <h1 className="text-3xl font-bold pb-4 border-b border-gray-300">
        Agent Profile
      </h1>
      <div className="flex flex-col sm:flex-row items-center gap-6 py-6 border-b border-gray-300">
        <div className="flex items-center gap-6">
          {data?.agent_profile_image ? (
            <img
              src={data?.agent_profile_image}
              alt="Agent Profile"
              className="h-32 w-32 rounded-full border-4 border-gray-200 object-cover"
            />
          ) : (
            <div className="h-32 w-32 flex justify-center items-center bg-gray-200 rounded-full text-xl font-semibold capitalize">
              {data?.agent_full_name?.charAt()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold capitalize">
              {data?.agent_full_name}
            </h1>
            <p className="text-gray-600">{data?.agent_email}</p>
            {data?.isVerified && (
              <div className="flex items-center gap-2 mt-2 bg-green-100 text-green-600 px-4 py-1 rounded-full w-max">
                <BadgeCheck className="w-5 h-5 text-green-600" />
                <span className="font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 pb-5 border-b border-gray-300">
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-gray-700 font-medium">City</h2>
          <p className="text-lg font-semibold">
            {data?.city?.city_name || 'N/A'}
          </p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-gray-700 font-medium">State</h2>
          <p className="text-lg font-semibold">
            {data?.state?.state_name || 'N/A'}
          </p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-gray-700 font-medium">Country</h2>
          <p className="text-lg font-semibold">
            {data?.country?.country_name || 'N/A'}
          </p>
        </div>
      </div>
      <div className="h-auto mt-3">
        <h1 className="text-2xl font-bold pb-4 ">About Me</h1>
        <p>{data?.about_me}</p>
      </div>
    </div>
  );
};

export default AgentProfile;
