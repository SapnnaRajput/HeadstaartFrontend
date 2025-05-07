import React, { useEffect, useState } from 'react';
import { UserState } from '../../../context/UserContext';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';
import axios from 'axios';
import CustomButton from '../../../Utiles/CustomButton';


const Modal = ({ 
    isModalOpen, 
    setIsModalOpen, 
    modalMode, 
    activeTab, 
    formData, 
    handleInputChange, 
    handleSubmit, 
    errors, 
    handleOutsideClick 
  }) => {
    if (!isModalOpen) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
        onClick={handleOutsideClick}
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-white px-6 py-4">
            <h3 className="text-xl font-semibold text-black">
              {modalMode === 'add' ? 'Add New' : 'Edit'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Lead
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lead">
                Lead Count*
              </label>
              <input
                type="number"
                id="lead"
                name="lead"
                value={formData.lead}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.lead ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter number of leads"
              />
              {errors.lead && <p className="text-red-500 text-xs mt-1">{errors.lead}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price ($)*
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter price"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {modalMode === 'add' ? 'Add' : 'Update'} Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

const LeadManage = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState({
    agent: [],
    investor: [],
    entrepreneur: []
  });
  const [activeTab, setActiveTab] = useState('agent');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    lead: '',
    price: '',
    lead_id: null
  });
  const [errors, setErrors] = useState({});

  const leadManage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_lead_admin`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        setLeads(response.data.leads);
      } else {
        notify("error", "Failed to fetch leads");
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leadId) => {
    {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${baseUrl}/delete_lead/${leadId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response?.data?.status) {
          notify("success", "Lead deleted successfully");
          leadManage();
        } else {
          notify("error", response?.data?.message || "Failed to delete lead");
        }
      } catch (error) {
        notify("error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddLead = () => {
    setModalMode('add');
    setFormData({
      lead: '',
      price: '',
      lead_id: null
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setModalMode('edit');
    setFormData({
      lead: lead.lead.toString(),
      price: lead.price.toString(),
      lead_id: lead.lead_id
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.lead.trim()) {
      newErrors.lead = "Lead count is required";
    } else if (isNaN(Number(formData.lead)) || Number(formData.lead) <= 0) {
      newErrors.lead = "Lead count must be a positive number";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      let response;
      
      if (modalMode === 'add') {
        response = await axios.post(
          `${baseUrl}/add_lead`,
          {
            lead: parseInt(formData.lead),
            price: parseInt(formData.price),
            role: activeTab
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${baseUrl}/edit_lead`,
          {
            lead: parseInt(formData.lead),
            price: parseInt(formData.price),
            lead_id: formData.lead_id
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      }
      
      if (response?.data?.status) {
        notify("success", `Lead ${modalMode === 'add' ? 'added' : 'updated'} successfully`);
        setIsModalOpen(false);
        leadManage();
      } else {
        notify("error", response?.data?.message || `Failed to ${modalMode} lead`);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    leadManage();
  }, [baseUrl]);

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      setIsModalOpen(false);
    }
  };

   const handleSubmitWithCountry = async() => {
    setLoading(true);
    const countryIds = selectedCountries.map(country => country.value);
    try {
      const submissionData = {
        country_ids: countryIds,
        legal_templates_id: newTemplateData.legal_templates_id
      };

      const response = await axios.post(
        `${baseUrl}/add_template_country`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        notify("success", response.data.message);
        navigate(`/${user.role}/create-legal-template?legal_templates_id=${response.data.legal_templates_id}`);
        setNewTemplateData(null);
      } else {
        notify("error", response.data.message || "Failed to add template");
      }
    } catch (error) {
      console.error("Error submitting template:", error);
      notify(
        "error",
        error.response?.data?.message || "Failed to submit template"
      );
    } finally {
      setLoading(false);
    }

  };



  return (
    <div className="container mx-auto px-4 py-6">
      {loading && <Loader />}
      <Modal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        activeTab={activeTab}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        errors={errors}
        handleOutsideClick={handleOutsideClick}
      />

      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Lead Management</h1>
        <CustomButton 
          onClick={handleAddLead}
         
          label={` Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Lead`}
        >
         
        </CustomButton>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex flex-nowrap -mb-px">
          {['agent', 'investor', 'entrepreneur'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`mr-2 whitespace-nowrap inline-block p-4 rounded-t-lg ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Leads
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {leads[tab]?.length || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Leads</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Time</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads[activeTab] && leads[activeTab].length > 0 ? (
              leads[activeTab].map((lead) => (
                <tr key={lead.lead_id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{lead.lead_id}</td>
                  <td className="px-6 py-4">{lead.lead}</td>
                  <td className="px-6 py-4">${lead.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{lead.inserted_date}</td>
                  <td className="px-6 py-4">{lead.inserted_time}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEditLead(lead)}
                      className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-3 py-1.5 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lead.lead_id)}
                      className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-3 py-1.5"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan="7" className="px-6 py-4 text-center">
                  No leads found for this category
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadManage;