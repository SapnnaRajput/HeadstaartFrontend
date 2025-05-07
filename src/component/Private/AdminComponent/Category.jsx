import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import CustomButtom from "../../../Utiles/CustomButton"

const Category = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({});
  const [legalCategories, setLegalCategory] = useState([]);
  const [industrialCategory, setIndustrialCategory] = useState([]);
  const { user } = UserState();
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('industrial');

  async function GetCategory() {
    try {
      const response = await axios.get(`${baseUrl}/get_all_category`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setLegalCategory(response.data.legal_categories);
      setIndustrialCategory(response.data.industrial_categories);
    } catch (error) {
      notify("error", error.message);
    }
  }

  async function AddCategory(category_name, category_code, category_type) {
    try {
      const payload = { category_name, category_code, category_type };
      const response = await axios.post(`${baseUrl}/add_category`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.status) {
        notify("success", response.data.message);
      }
      GetCategory();
    } catch (error) {
      notify("error", error.message);
      console.error("Error adding category:", error);
    }
  }

  const handleToggle = async (categoryId, isActive) => {
    const updatedStatus = isActive === "Active" ? "Inactive" : "Active";
    try {
      const response = await axios.post(
        `${baseUrl}/category_status_update`,
        {
          status: updatedStatus,
          category_id: categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status) {
        notify("success", response.data.message);
        GetCategory();
      }
    } catch (error) {
      console.error("Error updating category status:", error);
    }
  };

  const EditCategory = async (category_id, category_name, category_code, category_type) => {
    try {
      const payload = { category_id, category_name, category_code, category_type };
      const response = await axios.post(`${baseUrl}/update_category`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      notify("success", response.data.message);
      GetCategory();
    } catch (error) {
      notify("error", error.message);
      console.error("Error editing category:", error);
    }
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setEditModal(true);
  };

  useEffect(() => {
    GetCategory();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="py-6 px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                Categories
              </h1>
              <CustomButtom onClick={() => setIsModalOpen(true)} label="New Category" cancel={false} />
            </div>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('industrial')}
                  className={`${activeTab === 'industrial'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Industrial Category ({industrialCategory.length})
                </button>
                <button
                  onClick={() => setActiveTab('legal')}
                  className={`${activeTab === 'legal'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Legal Category ({legalCategories.length})
                </button>
              </nav>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Loading categories...</p>
                </div>
              </div>
            ) : industrialCategory.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new category.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    New Category
                  </button>
                </div>
              </div>
            ) : (activeTab === 'industrial' ? industrialCategory : legalCategories).length != 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Category Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Category Code
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(activeTab === 'industrial' ? industrialCategory : legalCategories).map((cat) => (
                    <tr key={cat.category_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cat.category_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {cat.category_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleToggle(cat.category_id, cat.status)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${cat.status === "Active" ? "bg-indigo-600" : "bg-gray-200"
                              }`}
                            role="switch"
                            aria-checked={cat.status === "Active"}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${cat.status === "Active" ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                          </button>
                          <span className={`ml-3 text-sm ${cat.status === "Active" ? "text-green-600 font-medium" : "text-gray-500"}`}>
                            {cat.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Hello</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add New Category
                    </h3>
                    <div className="mt-4">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const categoryName = e.target.category_name.value.trim();
                          const categoryCode = e.target.category_code.value.trim();
                          const categoryType = e.target.category_type.value.trim();


                          if (!categoryName || !categoryCode || !categoryType) {
                            alert("All fields are required.");
                            return;
                          }

                          AddCategory(categoryName, categoryCode, categoryType);
                          setIsModalOpen(false);
                        }}
                      >
                        <div className="mb-4">
                          <label htmlFor="category_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name
                          </label>
                          <input
                            type="text"
                            name="category_name"
                            id="category_name"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Enter category name"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="category_code" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Code
                          </label>
                          <input
                            type="text"
                            name="category_code"
                            id="category_code"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Enter category code"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="category_type" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Type
                          </label>
                          <select
                            name="category_type"
                            id="category_type"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          >
                            <option value="">Select category type</option>
                            <option value="industrial">Industrial</option>
                            <option value="legal">Legal</option>
                          </select>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Add Category
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setIsModalOpen(false)}
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
      )}

      {editModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setEditModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Edit Category
                    </h3>
                    <div className="mt-4">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          EditCategory(
                            currentCategory.category_id,
                            currentCategory.category_name,
                            currentCategory.category_code,
                            currentCategory.category_type
                          );
                          setEditModal(false);
                        }}
                      >
                        <div className="mb-4">
                          <label htmlFor="edit_category_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name
                          </label>
                          <input
                            type="text"
                            id="edit_category_name"
                            value={currentCategory.category_name}
                            onChange={(e) =>
                              setCurrentCategory({
                                ...currentCategory,
                                category_name: e.target.value,
                              })
                            }
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="edit_category_code" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Code
                          </label>
                          <input
                            type="text"
                            id="edit_category_code"
                            value={currentCategory.category_code}
                            onChange={(e) =>
                              setCurrentCategory({
                                ...currentCategory,
                                category_code: e.target.value,
                              })
                            }
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="edit_category_type" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Type
                          </label>
                          <select
                            id="edit_category_type"
                            value={currentCategory.category_type}
                            onChange={(e) =>
                              setCurrentCategory({
                                ...currentCategory,
                                category_type: e.target.value,
                              })
                            }
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          >
                            <option value="">Select category type</option>
                            <option value="industrial">Industrial</option>
                            <option value="legal">Legal</option>
                          </select>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setEditModal(false)}
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
      )}
    </>
  );
};

export default Category;