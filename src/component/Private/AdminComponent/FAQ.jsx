import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Edit3, Eye, Edit } from "lucide-react";
import axios from "axios";
import { notify } from "../../../Utiles/Notification";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import CustomButton from "../../../Utiles/CustomButton";

const FAQ = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [FAQs, setFAQs] = useState({});
  const [activeTab, setActiveTab] = useState("agent");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [currentFAQ, setCurrentFAQ] = useState({ 
    title: "", 
    para: "", 
    role: "agent" 
  });
  const [currentFAQId, setCurrentFAQId] = useState(null);

  const getFAQs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_faq_admin`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.status) {
        setFAQs(response.data.faq);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      notify("error", "Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFAQs();
  }, [user]);

  const handleAddFAQ = () => {
    setCurrentFAQ({ 
      title: "", 
      para: "", 
      role: activeTab  // Set default role to current active tab
    });
    setModalMode("add");
    setShowModal(true);
  };

  const handleEditFAQ = (faq) => {
    setCurrentFAQ({ 
      title: faq.title, 
      para: faq.para, 
      status: faq.status, 
      role: activeTab 
    });
    setCurrentFAQId(faq.faq_id);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleViewFAQ = (faq) => {
    setCurrentFAQ({ 
      title: faq.title, 
      para: faq.para, 
      status: faq.status, 
      role: activeTab 
    });
    setCurrentFAQId(faq.faq_id);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDeleteFAQ = async (faqId) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/delete_faq`,
        { faq_id: faqId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      if (response.data.status) {
        notify("success", "FAQ deleted successfully");
        getFAQs();
      } else {
        notify("error", response.data.message || "Failed to delete FAQ");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      notify("error", "Failed to delete FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentFAQ.title.trim() || !currentFAQ.para.trim()) {
      notify("error", "Title and paragraph are required");
      return;
    }
    
    setLoading(true);
    try {
      let endpoint = modalMode === "add" ? "add_faq" : "update_faq";
      let payload = modalMode === "add" 
        ? { 
            title: currentFAQ.title, 
            para: currentFAQ.para, 
             
            role: currentFAQ.role 
          }
        : { 
            faq_id: currentFAQId, 
            title: currentFAQ.title, 
            para: currentFAQ.para, 
            
          };
      
      const response = await axios.post(
        `${baseUrl}/${endpoint}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      if (response.data.status) {
        notify("success", `FAQ ${modalMode === "add" ? "added" : "updated"} successfully`);
        setShowModal(false);
        getFAQs();
        if (modalMode === "add" && currentFAQ.role !== activeTab) {
          setActiveTab(currentFAQ.role);
        }
      } else {
        notify("error", response.data.message || `Failed to ${modalMode} FAQ`);
      }
    } catch (error) {
      console.error(`Error ${modalMode === "add" ? "adding" : "updating"} FAQ:`, error);
      notify("error", `Failed to ${modalMode} FAQ`);
    } finally {
      setLoading(false);
    }
  };

  const renderFAQsList = () => {
    const currentFAQs = FAQs[activeTab] || [];
    
    if (currentFAQs.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No FAQs found in this role. Add your first FAQ!
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentFAQs.map((faq) => (
          <div key={faq.faq_id} className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{faq.title}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewFAQ(faq)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Eye size={18} className="text-blue-500" />
                </button>
                <button 
                  onClick={() => handleEditFAQ(faq)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Edit size={18} className="text-green-500" />
                </button>
                <button 
                  onClick={() => handleDeleteFAQ(faq.faq_id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3">{faq.para}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${faq.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                {faq.status}
              </span>
              <span className="text-xs text-gray-500">ID: {faq.faq_id}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {loading && <Loader />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">FAQ Management</h1>
        <CustomButton
          onClick={handleAddFAQ}
          label={"Add New FAQ"}
        />        
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {["agent", "investor", "entrepreneur"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-center capitalize font-medium text-sm transition-all whitespace-nowrap
                ${activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab} FAQs
              {FAQs[tab] && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                  {FAQs[tab].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* FAQ Cards */}
      <div className="mb-6">
        {renderFAQsList()}
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {modalMode === "add" ? "Add New FAQ" : 
                       modalMode === "edit" ? "Edit FAQ" : "View FAQ"}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Role Selection (only for Add mode) */}
                    {modalMode === "add" && (
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select
                          id="role"
                          value={currentFAQ.role}
                          onChange={(e) => setCurrentFAQ({...currentFAQ, role: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="agent">Agent</option>
                          <option value="investor">Investor</option>
                          <option value="entrepreneur">Entrepreneur</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={currentFAQ.title}
                        onChange={(e) => setCurrentFAQ({...currentFAQ, title: e.target.value})}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter FAQ title"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="para" className="block text-sm font-medium text-gray-700">
                        Answer
                      </label>
                      <textarea
                        id="para"
                        rows="4"
                        value={currentFAQ.para}
                        onChange={(e) => setCurrentFAQ({...currentFAQ, para: e.target.value})}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter FAQ answer"
                      ></textarea>
                    </div>
                    
                    
                    
                    {modalMode === "edit" && (
                      <div className="text-sm text-gray-500">
                        FAQ ID: {currentFAQId}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {modalMode === "add" ? "Add FAQ" : "Update FAQ"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {modalMode === "view" ? "Close" : "Cancel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;