import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import CustomButtom from "../../../Utiles/CustomButton"
import { ContactSupportOutlined } from "@mui/icons-material";

const ProfileBoostPlans = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({});
    const [plans, setPlans] = useState([]);
    const { user } = UserState();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Add this in the JSX where the table header starts

    async function GetPlans() {
        try {
            const response = await axios.get(`${baseUrl}/profile-boost-plans`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            //   console.log(response.data);
            setPlans(response.data.plans);
        } catch (error) {
            notify("error", error.message);
        }
    }


    useEffect(() => {
        GetPlans();
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        duration_days: '',
        price: '',
        features: [''],
        user_type: 'entrepreneur'
    });

    const handleAddFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const response = await axios.post(`${baseUrl}/profile-boost-plans`, {
                ...formData,
                features: JSON.stringify(formData.features)
            }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            if (response.data.status) {
                notify('success', 'Plan created successfully');
                setIsModalOpen(false);
                GetPlans();
                setFormData({
                    title: '',
                    duration_days: '',
                    price: '',
                    features: [''],
                    user_type: 'entrepreneur'
                });
            }
        } catch (error) {
            notify('error', error.response?.data?.message || 'Failed to create plan');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const response = await axios.patch(`${baseUrl}/profile-boost-plans/${currentCategory.id}`, {
                ...currentCategory,
                features: JSON.stringify(currentCategory.features)
            }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            if (response.data.status) {
                notify('success', 'Plan updated successfully');
                setEditModal(false);
                GetPlans();
            }
        } catch (error) {
            notify('error', error.response?.data?.message || 'Failed to update plan');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                const response = await axios.delete(`${baseUrl}/profile-boost-plans/${id}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });

                if (response.data.status) {
                    notify('success', 'Plan deleted successfully');
                    GetPlans();
                }
            } catch (error) {
                notify('error', error.response?.data?.message || 'Failed to delete plan');
            }
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="py-6 px-8">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-black">
                                Profile Boost Plans
                            </h1>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add New Plan
                            </button>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 overflow-x-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                                    <p className="mt-2 text-gray-600">Loading plans...</p>
                                </div>
                            </div>
                        ) : plans.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No plans available</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Start by creating a new boost plan.
                                </p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Duration
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Features
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            User Type
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {plans.map((plan, index) => (
                                        <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">#{index + 1}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{plan.duration_days} days</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">${plan.price}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500">
                                                    <ul className="list-disc pl-4">
                                                        {JSON.parse(plan.features).map((feature, index) => (
                                                            <li key={index}>{feature}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                                    {plan.user_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(plan.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        setCurrentCategory({
                                                            ...plan,
                                                            features: JSON.parse(plan.features)
                                                        });
                                                        setEditModal(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(plan.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold mb-6">Add New Boost Plan</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                                    <input
                                        type="number"
                                        value={formData.duration_days}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration_days: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Features</label>
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="mt-2 text-indigo-600 hover:text-indigo-800"
                                    >
                                        Add Feature
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User Type</label>
                                    <select
                                        value={formData.user_type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, user_type: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="entrepreneur">Entrepreneur</option>
                                        <option value="agent">Agent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Creating...' : 'Create Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold mb-6">Edit Boost Plan</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        value={currentCategory.title}
                                        onChange={(e) => setCurrentCategory(prev => ({ ...prev, title: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                                    <input
                                        type="number"
                                        value={currentCategory.duration_days}
                                        onChange={(e) => setCurrentCategory(prev => ({ ...prev, duration_days: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={currentCategory.price}
                                        onChange={(e) => setCurrentCategory(prev => ({ ...prev, price: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700">Features</label>
                                    {Array.isArray(JSON.parse(currentCategory.features)) ? JSON.parse(currentCategory.features).map((feature, index) => (
                                        <div key={index} className="flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => {
                                                    const newFeatures = [...currentCategory.features];
                                                    newFeatures[index] = e.target.value;
                                                    setCurrentCategory(prev => ({ ...prev, features: newFeatures }));
                                                }}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCurrentCategory(prev => ({
                                                        ...prev,
                                                        features: prev.features.filter((_, i) => i !== index)
                                                    }));
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )) : null}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCurrentCategory(prev => ({
                                                ...prev,
                                                features: [...(Array.isArray(prev.features) ? prev.features : []), '']
                                            }));
                                        }}
                                        className="mt-2 text-indigo-600 hover:text-indigo-800"
                                    >
                                        Add Feature
                                    </button>
                                </div> */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Features</label>
                                    {currentCategory.features && currentCategory.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => {
                                                    const newFeatures = [...currentCategory.features];
                                                    newFeatures[index] = e.target.value;
                                                    setCurrentCategory(prev => ({ ...prev, features: newFeatures }));
                                                }}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCurrentCategory(prev => ({
                                                        ...prev,
                                                        features: prev.features.filter((_, i) => i !== index)
                                                    }));
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User Type</label>
                                    <select
                                        value={currentCategory.user_type}
                                        onChange={(e) => setCurrentCategory(prev => ({ ...prev, user_type: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="entrepreneur">Entrepreneur</option>
                                        <option value="agent">Agent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Updating...' : 'Update Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileBoostPlans;