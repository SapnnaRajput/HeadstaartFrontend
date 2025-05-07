import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';

const Opportunity = () => {
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
        // notify('error', response?.data?.message);
      }
    } catch (error) {}
  };

  useEffect(()=>{
    getMenuCount();
  },[])


  const handleEnterClick = () => {
    navigate("/agent/entrepreneur-opportunities");
  };

  const handleInvestorClick = () => {
    navigate("/agent/investor-opportunities");
  };

  return (
    <div className="p-6">
      <h1 className="text-[#1D214E] text-2xl font-semibold mb-4">
        Opportunity
      </h1>
      <div className="flex gap-4">
        <div
          onClick={handleEnterClick}
          className="bg-[#e2f5e6] rounded-lg p-4 flex-1 cursor-pointer hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Entrepreneur</span>
          <span className="text-gray-700 font-medium bg-white px-3 py-1 rounded-full">
            {count?.opportunity_count.entrepreneur_opportunity || 0}
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
            {count?.opportunity_count.investor_opportunity || 0}
          </span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Opportunity;
