import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserState } from '../../../../context/UserContext';

const Opportunities = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const navigate = useNavigate();
  const [count, setCount] = useState();
   const getMenuCount = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/menu_count_api`,
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
          setCount(response.data)
        } else {
          
        }
      } catch (error) {}
    };

    useEffect(()=>{
      getMenuCount();
    },[])
  
  const handleAgentClick = () => {
    navigate('/entrepreneur/agent-opportunities');
  };

  const handleInvestorClick = () => {
    navigate('/entrepreneur/investor-opportunities');
  };

  return (
    <div className="p-6">
    <h1 className="text-[#1D214E] text-2xl font-semibold mb-4">Opportunity</h1>
    <div className="flex gap-4">
      <div 
        onClick={handleAgentClick}
        className="bg-[#B1E5FC] rounded-lg p-4 flex-1 cursor-pointer hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Agent</span>
          <span className="text-gray-700 font-medium bg-white px-3 py-1 rounded-full">
            {count?.entrepreneur_opportunity_agent_count || 0}
          </span>
        </div>
      </div>
      <div 
        onClick={handleInvestorClick}
        className="bg-[#FFD69D] rounded-lg p-4 flex-1 cursor-pointer hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Investor</span>
          <span className="text-gray-700 font-medium bg-white px-3 py-1 rounded-full">
            {count?.entrepreneur_opportunity_investor_count || 0}
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Opportunities;

