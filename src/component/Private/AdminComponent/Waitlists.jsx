import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import CustomButtom from "../../../Utiles/CustomButton"

const Waitlists = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({});
    const [waitlists, setWaitlist] = useState([]);
    const { user } = UserState();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(waitlists.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleApproveSelected = async () => {
        if (selectedUsers.length === 0) {
            notify("warning", "Please select users to approve");
            return;
        }

        try {
            setIsProcessing(true);
            const response = await axios.post(`${baseUrl}/waitlist-update-status`, {
                userIds: selectedUsers
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            notify("success", "Successfully approved selected users");
            GetWaitlists(); // Refresh the list
            setSelectedUsers([]); // Clear selection
        } catch (error) {
            notify("error", error.response?.data?.message || "Failed to approve users");
        } finally {
            setIsProcessing(false);
        }
    };

    // Add this in the JSX where the table header starts

    async function GetWaitlists() {
        try {
            const response = await axios.get(`${baseUrl}/waitlist`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            //   console.log(response.data);
            setWaitlist(response.data.waitlists);
        } catch (error) {
            notify("error", error.message);
        }
    }


    useEffect(() => {
        GetWaitlists();
    }, []);

    return (
        <>
            {isLoading && <Loader />}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="py-6 px-8">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-black">
                                Waitlist
                            </h1>
                            {selectedUsers.length > 0 && (
                                <button
                                    onClick={handleApproveSelected}
                                    disabled={isProcessing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {isProcessing ? 'Processing...' : `Approve Selected (${selectedUsers.length})`}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-4 md:p-6 overflow-x-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                                    <p className="mt-2 text-gray-600">Loading waitlist...</p>
                                </div>
                            </div>
                        ) : waitlists.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No waitlist entries</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    There are no users in the waitlist yet.
                                </p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 rounded"
                                                checked={selectedUsers.length === waitlists.length}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        {/* Sl.No */}
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Sl.No
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Queue No
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {waitlists.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{index + 1}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">#{user.id + 400}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{user.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                                    {user.role === 'investor' ? 'IV' :
                                                        user.role === 'agent' ? 'AG' :
                                                            user.role === 'student_entrepreneur' ? 'SE' :
                                                                user.role === 'entrepreneur' ? 'EN' : user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {(user.status || 'pending').charAt(0).toUpperCase() + (user.status || 'pending').slice(1)}
                                                </span>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleApproveSelected([user.id])}
                                                    disabled={user.status === 'approved'}
                                                    className={`px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all duration-200 ${user.status === 'approved'
                                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                                                        }`}
                                                >
                                                    {user.status === 'approved' ? 'Approved' : 'Approve'}
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Waitlists;