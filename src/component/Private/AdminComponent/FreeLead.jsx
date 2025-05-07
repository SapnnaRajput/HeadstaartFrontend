import React, { useState } from 'react';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { notify } from '../../../Utiles/Notification';

const FreeLead = ({ userData }) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [formData, setFormData] = useState({
    free_lead_agent: userData?.free_lead_agent || 0,
    free_lead_entrepreneur: userData?.free_lead_entrepreneur || 0,
    free_lead_investor: userData?.free_lead_investor || 0,
    free_lead_student_entrepreneur: userData?.free_lead_student_entrepreneur || 0
  });
  const [loading, setLoading] = useState(false);


  const { user } = UserState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value) || 0;
    const nonNegativeValue = Math.max(0, parsedValue);
    
    setFormData({
      ...formData,
      [name]: nonNegativeValue
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/update_free_lead_admin`, {
        user_id: userData.user_id,
        free_lead_entrepreneur: formData.free_lead_entrepreneur,
        free_lead_student_entrepreneur: formData.free_lead_student_entrepreneur,
        free_lead_investor: formData.free_lead_investor,
        free_lead_agent: formData.free_lead_agent
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.data.status) {
        notify("success", "Free lead settings updated successfully");
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Free Lead Settings</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Free Lead Agent</label>
          <input
            type="number"
            name="free_lead_agent"
            value={formData.free_lead_agent}
            onChange={handleChange}
            min="0"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Free Lead Entrepreneur</label>
          <input
            type="number"
            name="free_lead_entrepreneur"
            value={formData.free_lead_entrepreneur}
            onChange={handleChange}
            min="0"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Free Lead Investor</label>
          <input
            type="number"
            name="free_lead_investor"
            value={formData.free_lead_investor}
            onChange={handleChange}
            min="0"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Free Lead Student Entrepreneur</label>
          <input
            type="number"
            name="free_lead_student_entrepreneur"
            value={formData.free_lead_student_entrepreneur}
            onChange={handleChange}
            min="0"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Updating...' : 'Update Settings'}
        </button>
      </div>
    </div>
  );
};

export default FreeLead;