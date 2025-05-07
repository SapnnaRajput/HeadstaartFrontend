import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Edit3, Eye, Edit } from "lucide-react";
import axios from "axios";
import { notify } from "../../../Utiles/Notification";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import CustomButton from "../../../Utiles/CustomButton";

const PrivacyPolicy = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState({});
  const [activeTab, setActiveTab] = useState("entrepreneur");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); 
  const [modalData, setModalData] = useState({
    role: "",
    paragraph: "",
    privacy_policy_id: "",
    privacy_policy_paras_id: ""
  });
  
  const getPrivacyPolicy = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_policy_admin`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.status) {
        setPolicy(response.data.policies);
      }
    } catch (error) {
      console.error("Error fetching privacy policies:", error);
      notify("error", "Failed to fetch Privacy Policy");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getPrivacyPolicy();
  }, [user]);

  const handleAddPolicy = () => {
    setModalType("add");
    setModalData({
      role: activeTab,
      paragraph: "",
      privacy_policy_id: policy[activeTab][0]?.privacy_policy_id || ""
    });
    setShowModal(true);
  };

  const handleEditPolicy = (item) => {
    setModalType("edit");
    setModalData({
      role: activeTab,
      paragraph: item.paragraph,
      privacy_policy_id: item.privacy_policy_id,
      privacy_policy_paras_id: item.privacy_policy_paras_id
    });
    setShowModal(true);
  };

  const handleDeletePolicy = (item) => {
    setModalType("delete");
    setModalData({
      role: activeTab,
      privacy_policy_id: item.privacy_policy_id,
      privacy_policy_paras_id: item.privacy_policy_paras_id
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let endpoint = "";
      let payload = {};
      
      if (modalType === "add") {
        endpoint = `${baseUrl}/add_policy_admin`;
        payload = {
          role: modalData.role,
          paragraph: modalData.paragraph,
          privacy_policy_id: modalData.privacy_policy_id
        };
      } else if (modalType === "edit") {
        endpoint = `${baseUrl}/update_policy_admin`;
        payload = {
          role: modalData.role,
          privacy_policy_paras_id: modalData.privacy_policy_paras_id,
          paragraph: modalData.paragraph
        };
      } else if (modalType === "delete") {
        endpoint = `${baseUrl}/delete_policy_para`;
        payload = {
          privacy_policy_paras_id: modalData.privacy_policy_paras_id
        };
      }
      
      const response = await axios.post(
        endpoint,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      if (response.data.status) {
        notify("success", `Privacy policy ${modalType === "add" ? "added" : modalType === "edit" ? "updated" : "deleted"} successfully`);
        getPrivacyPolicy();
        setShowModal(false);
      } else {
        notify("error", response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error(`Error ${modalType}ing privacy policy:`, error);
      notify("error", `Failed to ${modalType} privacy policy`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <Loader />}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Privacy Policy Management</h1>
          <CustomButton
            onClick={handleAddPolicy}
            label={"Add New Paragraph"}
          />
        </div>

        <div className="mb-6 border-b">
          <div className="flex space-x-4">
            {["entrepreneur", "agent", "investor"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-4 text-sm font-medium capitalize transition-colors duration-150 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {policy && policy[activeTab] && policy[activeTab].length > 0 ? (
            <div className="space-y-6">
              {policy[activeTab][0]?.policy_paras?.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className="text-gray-700">{item.paragraph}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Added on: {new Date(item.inserted_date).toLocaleDateString()} at {item.inserted_time}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPolicy(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No privacy policy found for {activeTab} role.</p>
              <CustomButton
                onClick={handleAddPolicy}
                label={"Add New Paragraph"}
              />
             
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalType === "add" 
                  ? "Add New Policy Paragraph" 
                  : modalType === "edit" 
                  ? "Edit Policy Paragraph" 
                  : "Delete Policy Paragraph"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {modalType !== "delete" ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Role
                    </label>
                    <div className="bg-gray-100 p-2 rounded-md">
                      {modalData.role.charAt(0).toUpperCase() + modalData.role.slice(1)}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Paragraph
                    </label>
                    <textarea
                      value={modalData.paragraph}
                      onChange={(e) => setModalData({...modalData, paragraph: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="5"
                      required
                    ></textarea>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this policy paragraph? This action cannot be undone.
                </p>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white ${
                    modalType === "delete" 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {modalType === "add" 
                    ? "Add" 
                    : modalType === "edit" 
                    ? "Update" 
                    : "Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;