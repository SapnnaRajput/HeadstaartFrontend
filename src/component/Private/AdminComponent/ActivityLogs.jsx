import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";

const ActivityLogs = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [employeeLogs, setEmployeeLogs] = useState([]);
    const [customerLogs, setCustomerLogs] = useState([]);
    const { user } = UserState();
    const [isLoading, setIsLoading] = useState(false);

    async function getActivityLogs() {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseUrl}/activity-logs`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            setEmployeeLogs(response.data.user_activity_logs || []);
            setCustomerLogs(response.data.customer_activity_logs || []);
        } catch (error) {
            notify("error", error.response?.data?.message || "Failed to fetch activity logs");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getActivityLogs();
    }, []);

    const ActivityTable = ({ logs, title }) => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="py-6 px-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-black">
                        {title}
                    </h2>
                </div>
            </div>

            <div className="p-4 md:p-6 overflow-x-auto">
                {logs.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No activity logs</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            There are no activity logs available.
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
                                    Activity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    IP Address
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User Agent
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{log.activity}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {title === "Employee Activity Logs" ? (
                                                <>
                                                    <div>{log.user?.full_name}</div>
                                                    <div className="text-xs text-gray-500">{log.user?.email}</div>
                                                </>
                                            ) : (
                                                <>
                                                    <div>{log.customer?.full_name}</div>
                                                    <div className="text-xs text-gray-500">{log.customer?.email}</div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{log.ip_address}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 max-w-xs truncate" title={log.user_agent}>
                                            {log.user_agent}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{log.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                            {log.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(log.created_at).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

    return (
        <>
            {isLoading && <Loader />}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">Activity Logs</h1>
                
                <ActivityTable logs={employeeLogs} title="Employee Activity Logs" />
                <ActivityTable logs={customerLogs} title="Customer Activity Logs" />
            </div>
        </>
    );
};

export default ActivityLogs;