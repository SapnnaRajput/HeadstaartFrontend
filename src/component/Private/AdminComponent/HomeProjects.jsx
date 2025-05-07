import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';

const HomeProjects = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = UserState();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentProject, setCurrentProject] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fund_amount: '',
    equity: '',
    image: null,
    status: 'Active'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_home_project_admin`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (response.data.status) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      notify("Failed to fetch projects", "error");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (formErrors.image) {
      setFormErrors({ ...formErrors, image: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Project name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.fund_amount) errors.fund_amount = 'Fund amount is required';
    if (isNaN(formData.fund_amount)) errors.fund_amount = 'Fund amount must be a number';
    if (!formData.equity) errors.equity = 'Equity percentage is required';
    if (isNaN(formData.equity) || formData.equity < 0 || formData.equity > 100) 
      errors.equity = 'Equity must be a number between 0 and 100';
    if (modalType === 'add' && !formData.image) errors.image = 'Project image is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      fund_amount: '',
      equity: '',
      image: null,
      status: 'Active'
    });
    setFormErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setModalType('add');
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      fund_amount: project.fund_amount,
      equity: project.equity,
      status: project.status,
      image: null // Keep null as we don't want to force image upload on edit
    });
    setModalType('edit');
    setShowModal(true);
  };

  const openDeleteModal = (project) => {
    setCurrentProject(project);
    setModalType('delete');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('fund_amount', formData.fund_amount);
    data.append('equity', formData.equity);
    data.append('status', formData.status);
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      let response;
      
      if (modalType === 'add') {
        response = await axios.post(`${baseUrl}/add_home_project`, data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.status) {
          notify("success","Project added successfully");
          closeModal();
          fetchProjects();
        } else {
          notify(response.data.message || "Failed to add project", "error");
        }
      } else if (modalType === 'edit') {
        data.append('home_project_id', currentProject.home_project_id);
        
        response = await axios.post(`${baseUrl}/update_home_project`, data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.status) {
          notify("success","Project updated successfully");
          closeModal();
          fetchProjects();
        } else {
          notify(response.data.message || "Failed to update project", "error");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      notify( "error","An error occurred. Please try again.");
    }
    
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('home_project_id', currentProject.home_project_id);
      
      const response = await axios.post(`${baseUrl}/delete_home_project`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.status) {
        notify( "success","Project deleted successfully");
        closeModal();
        fetchProjects();
      } else {
        notify("error",response.data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      notify("error","An error occurred while deleting. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Home Projects</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Add New Project
        </button>
      </div>

      {loading && <Loader />}

      {/* Projects List */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fund & Equity
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
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.home_project_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={project.image} 
                      alt={project.name} 
                      className="h-16 w-24 object-cover rounded-md" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{project.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Fund: ${parseInt(project.fund_amount).toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Equity: {project.equity}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(project)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(project)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'add' ? 'Add New Project' : 
                 modalType === 'edit' ? 'Edit Project' : 'Delete Project'}
              </h3>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {modalType === 'delete' ? (
                <div className="text-center">
                  <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-2">Are you sure you want to delete this project?</p>
                  <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full p-2 border rounded-md ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                      ></textarea>
                      {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fund Amount ($)</label>
                        <input
                          type="text"
                          name="fund_amount"
                          value={formData.fund_amount}
                          onChange={handleInputChange}
                          className={`w-full p-2 border rounded-md ${formErrors.fund_amount ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formErrors.fund_amount && <p className="mt-1 text-sm text-red-500">{formErrors.fund_amount}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equity (%)</label>
                        <input
                          type="text"
                          name="equity"
                          value={formData.equity}
                          onChange={handleInputChange}
                          className={`w-full p-2 border rounded-md ${formErrors.equity ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formErrors.equity && <p className="mt-1 text-sm text-red-500">{formErrors.equity}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Image {modalType === 'edit' && '(Leave empty to keep current image)'}
                      </label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/*"
                        className={`w-full p-2 border rounded-md ${formErrors.image ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.image && <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>}
                      
                      {modalType === 'edit' && currentProject && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                          <img 
                            src={currentProject.image} 
                            alt="Current project" 
                            className="h-16 w-24 object-cover rounded-md" 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : modalType === 'add' ? "Add Project" : "Update Project"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeProjects;