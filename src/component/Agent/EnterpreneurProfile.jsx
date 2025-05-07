import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import axios from 'axios';
import { notify } from '../../Utiles/Notification';
import { BadgeCheck, Building, Eye, View } from 'lucide-react';
import Loader from '../../Utiles/Loader';

const EnterpreneurProfile = () => {
  const { client_unique_id } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [enterpreneurData, setEntrepreneurData] = useState();

  const getEnterpreneurData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_entu_profile`,
        {
          customer_unique_id: client_unique_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log(response?.data);
      setEntrepreneurData(response?.data);
    } catch (error) {
      console.log(error);
      notify('error', 'failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [client_unique_id, baseUrl]);

  useEffect(() => {
    getEnterpreneurData();
  }, [getEnterpreneurData]);

  return (
    <div className="p-6">
      <h1 className="font-semibold text-3xl text-gray-700">
        Enterpreneur Profile
      </h1>

      {
        loading ? <Loader /> : <>
          <div className="flex gap-2 mt-5 items-center">
            
        <img
          className="w-24 h-24 rounded-full"
          src={enterpreneurData?.customers?.customer_profile_image}
          alt="Profile Image"
        />
       
        <div className="flex justify-center items-center gap-2">
          <p className="font-medium text-gray-700 text-xl">
            {enterpreneurData?.customers?.full_name}
          </p>
          {enterpreneurData?.customers?.isVerified && (
            <div className=" w-9 h-9 flex justify-center items-center bg-blue-500/10 rounded-full p-1">
              <BadgeCheck className="w-6 h-6 text-blue-500" />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col my-3">
        <h1 className="text-gray-700 text-xl font-medium">About Me</h1>
        <p className=" text-gray-700">
          {enterpreneurData?.customers?.about_me}
        </p>
      </div>
      <div>
        <h1 className="text-gray-700 text-xl font-medium">Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
          {enterpreneurData?.projectDetail.map((project) => (
            <>
            <div
              key={project?.project_unique_id}
              className="rounded bg-neutral-50 shadow"
            >
              <Link  to={`/agent/feature-projects/details?projectId=${project.project_unique_id}&flagged_by=${project.flaggedBy}`}>
              <img
                className="w-full h-52"
                src={project?.projectMedia[0]?.media_link}
                alt="project Image"
              />
              </Link>
              <div className=" p-2 border-b pb-2 flex flex-col gap-1 mt-2 text-gray-900">
                <p className="font-medium">{project?.title}</p>
                <p className="text-sm">{project?.category?.category_name}</p>
                <div className="flex my-2 gap-3">
                  <Building />
                  <p>{project?.company_name}</p>
                </div>
              </div>
              <div className="p-2 border-b flex justify-between items-center mt-2">
                <div className="flex flex-col">
                  <h2>${project?.fund_amount}</h2>
                  <p className='text-sm'>Fund Amount</p>
                </div>
                <div className="flex flex-col">
                <h2>${project?.equity}%</h2>
                <p className='text-sm'>Equity</p>
                </div>
              </div>
              <div className=' p-3 flex justify-between items-center'>
               
                <p className='flex gap-1'>
                   <Eye /> {project?.view}
                </p>
              </div>
            </div>
            </>
          ))}
        </div>
      </div>
        </>
      }
    
    </div>
  );
};

export default EnterpreneurProfile;
