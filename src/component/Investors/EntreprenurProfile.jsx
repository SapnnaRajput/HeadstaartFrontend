import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import { notify } from '../../Utiles/Notification';
import { BadgeCheck } from 'lucide-react';
import axios from 'axios';
import Loader from '../../Utiles/Loader';

const EntreprenurProfile = () => {
  const { customer_unique_id } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();

  const fetchData = useCallback(async () => {
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
      console.log(error);

      notify('error', 'Failed to fetch customer details');
    } finally {
      setLoading(false);
    }
  }, [customer_unique_id, baseUrl, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if(loading) return <Loader />

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-3 border-b-2 border-gray-200 pb-3">Entrepreneur Profile</h3>
      <div className="w-full sm:w-[70%]">
        <div className="flex items-center space-x-4">
          <img
            src={customerData?.customer_profile_image}
            alt={customerData?.full_name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1 mt-3">
            <div className="flex items-center gap-5 space-x-2">
              <h3 className="text-xl font-semibold capitalize">
                {customerData?.full_name}
              </h3>
              {customerData?.is_verified === 1 && (
                <BadgeCheck className="w-8 h-8 text-[#4A3AFF]" />
              )}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 mt-6 rounded-lg">
          <h4 className="font-semibold mb-2">About</h4>
          <p className="text-gray-600">{customerData?.about_me}</p>
        </div>
      </div>
      <div>
        <div>
          <h4 className="font-semibold mb-4 mt-4">Projects</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customerData?.project.map((project) => (
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
                          (media) => media.media_type === 'photo'
                        )?.media_link || '/api/placeholder/400/320'
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
                            : ''}
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
  );
};

export default EntreprenurProfile;
