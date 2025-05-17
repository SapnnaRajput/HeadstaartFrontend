import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";

const ProfileBoostedUsers = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [boostedUsers, setBoostedUsers] = useState([]);
    const { user } = UserState();
    const [isLoading, setIsLoading] = useState(false);

    async function GetBoostedUsers() {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/profile-boosts`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            setBoostedUsers(response.data.data);
        } catch (error) {
            notify("error", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        GetBoostedUsers();
    }, []);

    return (
        <>
            {isLoading && <Loader />}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="py-6 px-8">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-black">
                                Profile Boosted Users
                            </h1>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 overflow-x-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                                    <p className="mt-2 text-gray-600">Loading users...</p>
                                </div>
                            </div>
                        ) : boostedUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No boosted users</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    There are no users with active boost plans.
                                </p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Duration
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Payment Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {boostedUsers.map((boost, index) => (
                                        <tr key={boost.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {boost.user.full_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {boost.user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {boost.boost_plan.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    ${boost.boost_plan.price}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(boost.start_date).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })} - {new Date(boost.end_date).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${boost.payment_status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {boost.payment_status.charAt(0).toUpperCase() + boost.payment_status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${boost.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {boost.status.charAt(0).toUpperCase() + boost.status.slice(1)}
                                                </span>
                                            </td>
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

export default ProfileBoostedUsers;