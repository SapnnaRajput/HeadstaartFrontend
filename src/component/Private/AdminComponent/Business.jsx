import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import { UserState } from "../../../context/UserContext";
import { Plus, Edit, Briefcase, ChevronDown } from "lucide-react";
import CustomButtom from "../../../Utiles/CustomButton"

const Business = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const { user } = UserState();

  const getBusiness = async () => {
    try {
      const response = await axios.get(`${baseUrl}/get_all_business_stage`);
      setBusinesses(response.data.business_stages);
    } catch (error) {
      notify("error", "Error fetching business data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const AddBusiness = async (business_stage_name) => {
    try {
      const response = await axios.post(
        `${baseUrl}/add_business_stage`,
        { business_stage_name },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      notify("success", response.data.message);
      getBusiness();
    } catch (error) {
      notify("error", error.response?.data?.message || "Something went wrong");
    }
  };

  const updateBusiness = async (business_stage_id, business_stage_name) => {
    try {
      const response = await axios.post(
        `${baseUrl}/update_business_stage`,
        { business_stage_id, business_stage_name },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      
      if (response.data.status) {
        notify("success", response.data.message);
        getBusiness();
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", error.response?.data?.message || "Something went wrong");
      console.error("Error updating business stage:", error);
    }
  };

  const handleToggle = async (business_stage_id, currentStatus) => {
    try {
      const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";
  
      const payload = { business_stage_id, status: updatedStatus };
      const response = await axios.post(
        `${baseUrl}/business_stage_status_update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
  
      if (response.data.status) {
        notify("success", response.data.message);
        getBusiness(); 
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", "Error updating business status: " + error.message);
      console.error("Error updating business status:", error);
    }
  };

  const openEditModal = (business) => {
    setSelectedBusiness(business);
    setIsEditModalOpen(true);
  };
  
  useEffect(() => {
    getBusiness();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className=" py-6 px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-white" />
                <h1 className="text-2xl md:text-3xl font-bold text-black">
                  Business Stages
                </h1>
              </div>
              <CustomButtom onClick={() => setIsAddModalOpen(true)} label="Add Business" cancel={false} />
            </div>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading business stages...</p>
                </div>
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No business stages</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new business stage.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    New Business Stage
                  </button>
                  
                </div>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Stage Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {businesses.map((item) => (
                      <tr key={item.business_stage_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Briefcase className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.business_stage_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleToggle(item.business_stage_id, item.status)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                item.status === "Active" ? "bg-blue-600" : "bg-gray-200"
                              }`}
                              role="switch"
                              aria-checked={item.status === "Active"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  item.status === "Active" ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span className={`ml-3 text-sm ${item.status === "Active" ? "text-green-600 font-medium" : "text-gray-500"}`}>
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddNewBusinessModal
          setIsAddModalOpen={setIsAddModalOpen}
          AddBusiness={AddBusiness}
        />
      )}

      {isEditModalOpen && (
        <EditBusinessModal
          setIsEditModalOpen={setIsEditModalOpen}
          updateBusiness={updateBusiness}
          business={selectedBusiness}
        />
      )}
    </>
  );
};

const AddNewBusinessModal = ({ setIsAddModalOpen, AddBusiness }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsAddModalOpen(false)}></div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Add New Business Stage
              </h3>
              <div className="mt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const business_stage_name = e.target.business_stage_name.value.trim();
                    if (!business_stage_name) {
                      notify("error", "Business name is required");
                      return;
                    }
                    AddBusiness(business_stage_name);
                    setIsAddModalOpen(false);
                  }}
                >
                  <div className="mb-4">
                    <label htmlFor="business_stage_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Stage Name
                    </label>
                    <input
                      type="text"
                      name="business_stage_name"
                      id="business_stage_name"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="Enter business stage name"
                    />
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Add Business Stage
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EditBusinessModal = ({ setIsEditModalOpen, updateBusiness, business }) => {
  const [businessName, setBusinessName] = useState(business.business_stage_name);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = businessName.trim();
    if (!trimmedName) {
      notify("error", "Business name is required");
      return;
    }
    updateBusiness(business.business_stage_id, trimmedName);
    setIsEditModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsEditModalOpen(false)}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Edit Business Stage
                </h3>
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="edit_business_stage_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Stage Name
                      </label>
                      <input
                        type="text"
                        name="edit_business_stage_name"
                        id="edit_business_stage_name"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="Enter business stage name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Update Business Stage
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;