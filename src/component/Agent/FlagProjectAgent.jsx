import React, { useEffect, useState } from 'react'
import { Building2, Eye, Flag, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import Loader from '../../Utiles/Loader';
import { notify } from '../../Utiles/Notification';
import axios from 'axios';


const Flagproject = () => {

    const [project, setProject] = useState([]);
    const { user } = UserState();
    const [loading, setLoading] = useState();

    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    useEffect(() => {
        const postData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/get_agent_project_web `,{
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                if (response.data.status) {
                    setProject(response.data.project_details);
                }else{
                    setProject([])
                    notify('error',response.data.message);
                }
            } catch (error) {
                notify('error','Unauthorized access please login again');
            } finally {
                setLoading(false);
            }
        };

        postData();

    }, [baseUrl, user]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-500';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-500';
            case 'Completed':
                return 'bg-blue-100 text-blue-500';
            default:
                return '';
        }
    };
    const getFlagColor = (color) => {
        return color === 'purple' ? 'text-purple-600' : 'text-orange-500';
      };

    return (
        <>
            {loading && <Loader />}
            <div className=" bg-gray-50 p-6">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Flag Projects</h1>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {project.length} Projects
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {project.map((item) => (
            <div key={item.project_unique_id} className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
              <div className={`absolute right-4 top-4 ${getFlagColor(item.flag_color)}`}>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 24h-2v-24h2v24zm18-21.387s-1.621 1.43-3.754 1.43c-3.361 0-3.436-2.895-7.337-2.895-2.108 0-4.075.98-4.909 1.694v12.085c1.184-.819 2.979-1.681 4.923-1.681 3.684 0 4.201 2.754 7.484 2.754 2.122 0 3.593-1.359 3.593-1.359v-12.028z"/>
                </svg>
              </div>

              <Link to={`details?projectId=${item.project_unique_id}&flagged_by=${item.flaggedBy}`}>
              <div className="aspect-video w-full bg-gray-100 overflow-hidden">
              <img
                      src={item?.projectMedia?.[0]?.media_link}
                      alt={item?.title}
                      className="w-full h-full object-cover"
                    />
              </div>
              </Link>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 capitalize">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1 capitalize">{item.category.category_name}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>{item.company_name}</span>
                  </div>


                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">${item.fund_amount}</p>
                      <p className="text-xs text-gray-500">Fund Amount</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm font-medium text-gray-900">{item.equity}%</p>
                      <p className="text-xs text-gray-500">Equity</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      {item.view}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
        </>
    )
}

export default Flagproject