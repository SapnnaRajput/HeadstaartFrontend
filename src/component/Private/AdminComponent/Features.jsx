import React, { useState, useEffect } from "react";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import axios from "axios";
import { notify } from "../../../Utiles/Notification";
import CustomButton from "../../../Utiles/CustomButton";
import ConfirmationModal from "../../../Utiles/ConfirmationModal";
import { Edit, Plus, Trash } from "lucide-react";

const Features = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Varification Details");
  const tabs = [
    "Varification Details",
    "Agent Percentage",
    "Boost Price Details",
    "Delete Accounts", 
    "Contact Us Details",
  ];
  const [blueTick, setBlueTick] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({
    amount: "",
    duration: "",
    role: "",
    status: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
  });
  const [addModal, setAddModal] = useState(false);
  const [newPlanData, setNewPlanData] = useState({
    amount: "",
    duration: "",
    role: "investor",
    status: "Active",
  });
  const [agentPercentage, setAgentPercentage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newPercentage, setNewPercentage] = useState("");
  const [ads, setAds] = useState([]);
  const [editingAdsRow, setEditingAdsRow] = useState(null);
  const [editAdsData, setEditAdsData] = useState({
    days: "",
    views: "",
    price: "",
    status: "",
  });
  const [deleteAdsModal, setDeleteAdsModal] = useState({
    isOpen: false,
    id: null,
  });
  const [addAdsModal, setAddAdsModal] = useState(false);
  const [newAdsData, setNewAdsData] = useState({
    days: "",
    views: "",
    price: "",
    status: "Active",
  });
  const [deleteAccount, setDeleteAccount] = useState([]);
  const [contact, setContact] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

const toggleMessageExpand = (id) => {
  setExpandedRows(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
};
  const getBlueTickData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_blue_tick_data_admin`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response?.data?.status) {
        setBlueTick(response.data.blue_tick);
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAgentPercentage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_agent_percentage_admin`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        setAgentPercentage(response.data.data);
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const contactUs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_home_contact`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        setContact(response.data.data);
      } else {
       
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAdsAdmin = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_ads_admin`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response?.data?.status) {
        setAds(response.data.ads);
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDeletAccount = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_delete_account`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response?.data?.status) {
        setDeleteAccount(response.data.account_details);
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Varification Details") {
      getBlueTickData();
    } else if (activeTab === "Agent Percentage") {
      getAgentPercentage();
    } else if (activeTab === "Boost Price Details") {
    } else if (activeTab === "Contact Us Details") {
      contactUs();
    }
  }, [activeTab]);

  const handleEdit = (row) => {
    setEditingRow(row.blue_tick_id);
    setEditData({
      amount: row.amount,
      duration: row.duration,
      role: row.role,
      status: row.status,
    });
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/update_blue_tick_data`,

        { ...editData, blue_tick_id: id },

        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        const updatedData = blueTick.map((item) =>
          item.blue_tick_id === id ? { ...item, ...editData } : item
        );
        setBlueTick(updatedData);
        setEditingRow(null);
        notify("success", "Blue tick updated successfully");
      }
    } catch (error) {
      notify("error", error.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };
  const confirmDelete = (id) => {
    setDeleteModal({
      isOpen: true,
      id: id,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/delete_blue_tick_data`,
        {
          blue_tick_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        const filteredData = blueTick.filter(
          (item) => item.blue_tick_id !== id
        );
        setBlueTick(filteredData);
        notify("success", "Blue tick deleted successfully");
        setDeleteModal({
          isOpen: false,
          id: null,
        });
      } else {
        notify("error", response.data.message || "Failed to delete");
      }
    } catch (error) {
      notify("error", error.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewPlanChange = (e) => {
    const { name, value } = e.target;
    setNewPlanData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddPlan = () => {
    setAddModal(true);
  };

  const closeAddModal = () => {
    setAddModal(false);
    setNewPlanData({
      amount: "",
      duration: "",
      role: "investor",
      status: "Active",
    });
  };

  const submitNewPlan = async () => {
    if (!newPlanData.amount || !newPlanData.duration) {
      notify("error", "Please fill all required fields");
      return;
    }

    if (isNaN(newPlanData.amount) || isNaN(newPlanData.duration)) {
      notify("error", "Amount and duration must be numbers");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/add_blue_tick_data`,
        newPlanData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        getBlueTickData();
        notify("success", "New plan added successfully");
        closeAddModal();
      } else {
        notify("error", response.data.message || "Failed to add plan");
      }
    } catch (error) {
      notify("error", error.message || "Failed to add plan");
    } finally {
      setLoading(false);
    }
  };

  const updateAgentPercentage = async () => {
    if (!newPercentage || isNaN(newPercentage)) {
      notify("error", "Please enter a valid percentage");
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.post(
        `${baseUrl}/update_agent_percentage`,
        { percentage: Number(newPercentage) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        notify("success", "Agent percentage updated successfully");
        getAgentPercentage(); // Refresh data after update
      } else {
        notify(
          "error",
          response?.data?.message || "Failed to update percentage"
        );
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleEditAds = (ad) => {
    setEditingAdsRow(ad.ads_id);
    setEditAdsData({
      days: ad.days,
      views: ad.views,
      price: ad.price,
      status: ad.status,
    });
  };

  const handleSaveAds = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/update_ads`,
        { ...editAdsData, ads_id: id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        const updatedData = ads.map((item) =>
          item.ads_id === id ? { ...item, ...editAdsData } : item
        );
        setAds(updatedData);
        setEditingAdsRow(null);
        notify("success", "Boost price updated successfully");
      } else {
        notify(
          "error",
          response.data.message || "Failed to update boost price"
        );
      }
    } catch (error) {
      notify("error", error.message || "Failed to update boost price");
    } finally {
      setLoading(false);
    }
  };

  const handleAdsChange = (e) => {
    const { name, value } = e.target;
    setEditAdsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const confirmDeleteAds = (id) => {
    setDeleteAdsModal({
      isOpen: true,
      id: id,
    });
  };

  const closeDeleteAdsModal = () => {
    setDeleteAdsModal({
      isOpen: false,
      id: null,
    });
  };

  const handleDeleteAds = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/delete_ads`,
        {
          ads_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        const filteredData = ads.filter((item) => item.ads_id !== id);
        setAds(filteredData);
        notify("success", "Boost price deleted successfully");
        setDeleteAdsModal({
          isOpen: false,
          id: null,
        });
      } else {
        notify("error", response.data.message || "Failed to delete");
      }
    } catch (error) {
      notify("error", error.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAds = () => {
    setAddAdsModal(true);
  };

  const closeAddAdsModal = () => {
    setAddAdsModal(false);
    setNewAdsData({
      days: "",
      views: "",
      price: "",
      status: "Active",
    });
  };

  const handleNewAdsChange = (e) => {
    const { name, value } = e.target;
    setNewAdsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitNewAds = async () => {
    if (!newAdsData.days || !newAdsData.views || !newAdsData.price) {
      notify("error", "Please fill all required fields");
      return;
    }

    if (
      isNaN(newAdsData.days) ||
      isNaN(newAdsData.views) ||
      isNaN(newAdsData.price)
    ) {
      notify("error", "Days, views, and price must be numbers");
      return;
    }

    if (
      Number(newAdsData.days) <= 0 ||
      Number(newAdsData.views) <= 0 ||
      Number(newAdsData.price) <= 0
    ) {
      notify("error", "Days, views, and price must be positive numbers");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/add_ads`, newAdsData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data.status) {
        getAdsAdmin();
        notify("success", "New boost price added successfully");
        closeAddAdsModal();
      } else {
        notify("error", response.data.message || "Failed to add boost price");
      }
    } catch (error) {
      notify("error", error.message || "Failed to add boost price");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async(requestId, status) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/approve_unapprove_account`,
        {
          deleted_request_id: requestId,
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        await getDeletAccount()
      } else {
        notify("error", response.data.message || "Failed to delete");
      }
    } catch (error) {
      notify("error", error.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {loading && <Loader />}
      <div className="relative w-full container mx-auto">
        <div className="overflow-x-auto flex py-2 w-full border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-lg whitespace-nowrap flex-shrink-0 transition-all duration-200 font-medium relative ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md transform translate-y-px"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Varification Details" && (
        <div className="container mx-auto bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Blue Tick Verification Plans
            </h2>
            <CustomButton label={"Add New Plan"} onClick={handleAddPlan} />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Sr. No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Amount ($)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Duration (Days)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blueTick.map((row, i) => (
                  <tr
                    key={row.blue_tick_id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingRow === row.blue_tick_id ? (
                        <select
                          name="role"
                          value={editData.role}
                          onChange={handleChange}
                          className="border rounded-md p-1 w-32"
                        >
                          <option value="investor">Investor</option>
                          <option value="agent">Agent</option>
                          <option value="entrepreneur">Entrepreneur</option>
                        </select>
                      ) : (
                        capitalizeFirstLetter(row.role)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingRow === row.blue_tick_id ? (
                        <input
                          type="text"
                          name="amount"
                          value={editData.amount}
                          onChange={handleChange}
                          className="border rounded-md p-1 w-20"
                        />
                      ) : (
                        row.amount
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingRow === row.blue_tick_id ? (
                        <input
                          type="text"
                          name="duration"
                          value={editData.duration}
                          onChange={handleChange}
                          className="border rounded-md p-1 w-20"
                        />
                      ) : (
                        row.duration
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === row.blue_tick_id ? (
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleChange}
                          className="border rounded-md p-1 w-28"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            row.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {row.status}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingRow === row.blue_tick_id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(row.blue_tick_id)}
                            className="text-green-600 hover:text-green-900 mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRow(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => confirmDelete(row.blue_tick_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {blueTick.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No blue tick data available
              </p>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="Delete Blue Tick Plan"
        message="Are you sure you want to delete this blue tick plan? This action cannot be undone."
      />

      {addModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={closeAddModal}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative transform overflow-hidden rounded-lg bg-white px-6 py-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Add New Blue Tick Plan
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the details to create a new verification plan.
                </p>
              </div>

              <div className="mt-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newPlanData.role}
                    onChange={handleNewPlanChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="investor">Investor</option>
                    <option value="agent">Agent</option>
                    <option value="entrepreneur">Entrepreneur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={newPlanData.amount}
                    onChange={handleNewPlanChange}
                    placeholder="Enter amount"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={newPlanData.duration}
                    onChange={handleNewPlanChange}
                    placeholder="Enter duration in days"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newPlanData.status}
                    onChange={handleNewPlanChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitNewPlan}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Agent Percentage" && (
        <div className="container mx-auto bg-white rounded-lg shadow-sm p-4">
          {agentPercentage ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Agent Percentage
                  </h2>
                  <p className="text-sm text-gray-500">
                    Last updated on {agentPercentage.inserted_date} at{" "}
                    {agentPercentage.inserted_time}
                  </p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-gray-600">
                    Current Percentage
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {agentPercentage.percentage}%
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Update Percentage
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newPercentage}
                      onChange={(e) => setNewPercentage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter new percentage"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">
                      %
                    </span>
                  </div>
                  <button
                    onClick={updateAgentPercentage}
                    disabled={updating}
                    className={`px-6 py-2 rounded-lg font-medium text-white ${
                      updating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {updating ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Updating...
                      </span>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
                {agentPercentage.status === "Active" ? (
                  <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Status: Active</span>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>Status: Inactive</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No agent percentage data found
            </div>
          )}
        </div>
      )}

      {activeTab === "Boost Price Details" && (
        <div className="container mx-auto bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Boost Price Details
            </h2>
            <CustomButton label={"Boost Details"} onClick={handleAddAds} />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Sr. No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ads.length > 0 ? (
                  ads.map((ad, i) => (
                    <tr
                      key={ad.ads_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingAdsRow === ad.ads_id ? (
                          <input
                            type="text"
                            name="days"
                            value={editAdsData.days}
                            onChange={handleAdsChange}
                            className="border rounded-md p-1 w-20"
                          />
                        ) : (
                          ad.days
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingAdsRow === ad.ads_id ? (
                          <input
                            type="text"
                            name="views"
                            value={editAdsData.views}
                            onChange={handleAdsChange}
                            className="border rounded-md p-1 w-28"
                          />
                        ) : (
                          ad.views.toLocaleString()
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingAdsRow === ad.ads_id ? (
                          <input
                            type="text"
                            name="price"
                            value={editAdsData.price}
                            onChange={handleAdsChange}
                            className="border rounded-md p-1 w-20"
                          />
                        ) : (
                          `$${ad.price}`
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingAdsRow === ad.ads_id ? (
                          <select
                            name="status"
                            value={editAdsData.status}
                            onChange={handleAdsChange}
                            className="border rounded-md p-1 w-28"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ad.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {ad.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingAdsRow === ad.ads_id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveAds(ad.ads_id)}
                              className="text-green-600 hover:text-green-900 mr-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingAdsRow(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAds(ad)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                              aria-label="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => confirmDeleteAds(ad.ads_id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                              aria-label="Delete"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No ads data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteAdsModal.isOpen}
        onClose={closeDeleteAdsModal}
        onConfirm={() =>
          deleteAdsModal.id && handleDeleteAds(deleteAdsModal.id)
        }
        title="Delete Boost Price"
        message="Are you sure you want to delete this boost price? This action cannot be undone."
      />
      {addAdsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={closeAddAdsModal}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative transform overflow-hidden rounded-lg bg-white px-6 py-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Add New Boost Price
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the details to create a new boost price package.
                </p>
              </div>

              <div className="mt-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="days"
                    value={newAdsData.days}
                    onChange={handleNewAdsChange}
                    placeholder="Number of days"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Views <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="views"
                    value={newAdsData.views}
                    onChange={handleNewAdsChange}
                    placeholder="Number of views"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newAdsData.price}
                    onChange={handleNewAdsChange}
                    placeholder="Price in dollars"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newAdsData.status}
                    onChange={handleNewAdsChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeAddAdsModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitNewAds}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Boost Price
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Delete Accounts" && (
        <div className="container mx-auto bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-start items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Delete Account Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Profile
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Requested
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deleteAccount.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No delete account requests found.
                    </td>
                  </tr>
                ) : (
                  deleteAccount.map((account) => (
                    <tr key={account.deleted_request_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover border border-gray-200"
                              src={account.customer_profile_image}
                              alt={`${account.full_name}'s profile`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  account.full_name
                                )}&background=random`;
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {account.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {account.customer_unique_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {account.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {account.mobile}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {account.role.charAt(0).toUpperCase() +
                            account.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(account.inserted_date)
                            .toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, "-")}
                        </td>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {account.status}
                        </span>
                      </td>
                      
                      <td className=" whitespace-nowrap text-sm font-medium">
                        {account.status === "Pending" && (
                        <>
                        <div className="flex gap-3 justify-start items-center">
                        <button
                          onClick={() => handleApprove(account.deleted_request_id , "Approved")}
                          className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprove(account.deleted_request_id, "Declined")}
                          className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          Declined
                        </button>
                        </div>
                        </>
                        )}
                        {/* {account.status === "Pending" && (
                        <button
                          onClick={() => onApprove(account.deleted_request_id)}
                          className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          Approve
                        </button>
                        )} */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

{activeTab === "Contact Us Details" && (
  <div className="p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Contact Us Inquiries</h2>
      <div className="text-sm text-gray-500">Last 90 days</div>
    </div>
    
    {loading ? (
      <Loader />
    ) : contact.length > 0 ? (
      <div className="w-full overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3">ID</th>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Contact</th>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {contact.map((item) => (
              <tr key={item.contact_us_id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">#{item.contact_us_unique_id}</td>
                <td className="px-4 py-3">{item.first_name} {item.last_name}</td>
                <td className="px-4 py-3">
                  <div>
                    <div>{item.email}</div>
                    <div className="text-xs text-gray-500">{item.mobile}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>{formatDate(item.inserted_date)}</div>
                  <div className="text-xs text-gray-500">{item.inserted_time}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === "Active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  {item.message && item.message.length > 50 ? (
                    <div>
                      <p className="whitespace-pre-wrap break-words">
                        {expandedRows[item.contact_us_id] 
                          ? item.message 
                          : `${item.message.substring(0, 50)}...`}
                      </p>
                      <button 
                        onClick={() => toggleMessageExpand(item.contact_us_id)}
                        className="text-blue-600 text-xs font-medium mt-1 hover:text-blue-800"
                      >
                        {expandedRows[item.contact_us_id] ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">{item.message}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">No contact inquiries found</div>
    )}
  </div>
)}
    </>
  );
};

export default Features;
