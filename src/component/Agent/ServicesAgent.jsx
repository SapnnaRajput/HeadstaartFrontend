import React, { useState, useEffect } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { Modal, ToggleSwitch } from 'flowbite-react';
import CustomButton from '../../Utiles/CustomButton';
import { notify } from '../../Utiles/Notification';
import { UserState } from '../../context/UserContext';
import axios from 'axios';
import Loader from '../../Utiles/Loader';
import SelectDropdown from '../../Utiles/SelectDropdown';

const ServicesAgent = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [pricePerLead, setPricePerLead] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getServices = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_agent_service`,
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
        setServices(response.data.services);
        notify('success', response.data.message);
      } else {
        notify('error', response?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      notify(
        'error',
        error.response?.data?.message ||
          'Unauthorized access, please login again'
      );
    } finally {
      setLoading(false);
    }
  };
  const getCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_category`);
      if (response.data.status) {
        const formattedCategories = response.data.category.map((cat) => ({
          value: cat.category_id,
          label: cat.category_name,
          ...cat,
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategory();
    getServices();
  }, [baseUrl, user]);

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const handleAddClick = () => {
    setIsEditing(false);
    resetForm();
    setOpenModal(true);
  };

  const handleEditClick = (service) => {
    setIsEditing(true);
    setEditingServiceId(service.agent_service_unique_id);
    setSelectedCategoryId(service.category.category_id);
    setPricePerLead(service.price_per_lead);
    setDescription(service.description);
    setOpenModal(true);
    setActiveMenu(null);
  };

  // const categories = services.reduce((acc, service) => {
  //   const exists = acc.find(cat => cat.category_id === service.category.category_id);
  //   if (!exists) {
  //     acc.push(service.category);
  //   }
  //   return acc;
  // }, []);

  const resetForm = () => {
    setSelectedCategoryId('');
    setPricePerLead('');
    setDescription('');
    setOpenModal(false);
    setIsEditing(false);
    setEditingServiceId(null);
  };

  const handleAddService = async () => {
    if (!selectedCategoryId || !description) {
      notify('error', 'Please fill all the fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/add_agent_service`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          category_id: selectedCategoryId.value,
          price_per_lead: pricePerLead,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        notify('success', response.data.message);
        resetForm();
        getServices();
      } else {
        notify('error', response?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      notify('error', error.response?.data?.message || 'Error adding service');
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = async () => {
    if (!selectedCategoryId || !description) {
      notify('error', 'Please fill all the fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/edit_agent_service`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          agent_service_unique_id: editingServiceId,
          category_id: selectedCategoryId.value,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        notify('success', response.data.message);
        resetForm();
        getServices();
      } else {
        notify('error', response?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      notify(
        'error',
        error.response?.data?.message || 'Error updating service'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (serviceId, currentStatus) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/agent_status_update`,
        {
          agent_service_unique_id: serviceId,
          status: currentStatus === 'Active' ? 'Inactive' : 'Active',
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        notify('success', response.data.message);
        getServices();
      } else {
        notify('error', response?.data?.message || 'Status update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      notify('error', error.response?.data?.message || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 bg-white rounded-b-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Service</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#4A3AFF] text-white rounded-lg shadow-md"
          >
            <span className="text-lg font-medium">+</span> Add New Service
          </button>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={service.agent_service_unique_id}
              className="bg-white p-4 border rounded flex justify-between  relative"
            >
              <div className="w-full">
                <div className="flex justify-between items-center my-1">
                  <h2 className="text-lg font-semibold text-black">
                    {service.category.category_name}
                  </h2>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-4 h-8 flex justify-center items-center py-1 text-sm font-semibold rounded-full ${
                        service.status === 'Active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {service.status}
                    </span>
                    <span className="ml-4">
                      <ToggleSwitch
                        checked={service.status === 'Active'}
                        onChange={() =>
                          handleStatusUpdate(
                            service.agent_service_unique_id,
                            service.status
                          )
                        }
                        color="success"
                      />
                    </span>

                    <div className="flex flex-col items-end gap-4">
                      <button
                        className="text-gray-500 hover:text-black"
                        onClick={() => toggleMenu(index)}
                      >
                        <EllipsisVertical size={24} />
                      </button>
                      {activeMenu === index && (
                        <div className="absolute top-10 right-0 mt-2 w-40 bg-white rounded-lg shadow-md z-10">
                          <ul className="text-md text-gray-700">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleEditClick(service)}
                            >
                              Edit
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">
        {expanded || service.description.length <= maxLength
          ? service.description
          : `${service.description.substring(0, maxLength)}...`}
      </p>
      {service.description.length > maxLength && (
        <button className="text-blue-500 text-sm mt-1" onClick={toggleExpand}>
          {expanded ? "See Less" : "See More"}
        </button>
      )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={openModal} onClose={resetForm}>
        <Modal.Header>
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <label htmlFor="serviceName" className="block font-medium mb-1">
              Service Name
            </label>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <SelectDropdown
                  value={selectedCategoryId}
                  onChange={setSelectedCategoryId}
                  options={categories.map((category) => ({
                    value: category.category_id,
                    label: category.category_name,
                  }))}
                  placeholder="Select Industry"
                  isLoading={loading}
                />
              </div>
            </div>
            {/* <div>
              <label htmlFor="pricePerLead" className="block font-medium mb-1">
                Price Per Lead
              </label>
              <input
                id="pricePerLead"
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={pricePerLead}
                onChange={(e) => setPricePerLead(e.target.value)}
              />
            </div> */}
            <div>
              <label htmlFor="description" className="block font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <CustomButton
            label="Done"
            onClick={isEditing ? handleEditService : handleAddService}
          />
          <CustomButton label="Cancel" cancel={true} onClick={resetForm} />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ServicesAgent;
