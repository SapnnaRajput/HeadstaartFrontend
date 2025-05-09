import React, { useEffect, useState } from "react";
import { MoreVertical, Filter, RefreshCcw, Eye, Search, MessageCirclePlus } from "lucide-react";
import { notify } from "../../../Utiles/Notification";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import { ToggleSwitch } from "flowbite-react";
import Loader from "../../../Utiles/Loader";
import Pagination from "../../../Utiles/Pagination";
import { useNavigate, Link } from "react-router-dom";

const PriviligedUsers = () => {
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDefaultDates = () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    return {
      start: formatDateToYYYYMMDD(threeMonthsAgo),
      end: formatDateToYYYYMMDD(today),
    };
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [registrationDateStart, setRegistrationDateStart] = useState(
    getDefaultDates().start
  );
  const [registrationDateEnd, setRegistrationDateEnd] = useState(
    getDefaultDates().end
  );
  const [subscriptionType, setSubscriptionType] = useState("");
  const [userActivity, setUserActivity] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()

  const dateFormate = (startDate) => {
    const start = new Date(startDate);
    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      return `${month} ${day}`;
    };
    return `${formatDate(start)} ${start.getFullYear()}`;
  };

  const allData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_all_users`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log(response.data.data);

      setData(response.data.data);
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // const allDatas = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${baseUrl}/get_sub_name`, {
  //       headers: {
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });
  //     setDatas(response.data.data);
  //   } catch (error) {
  //     notify("error", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   allDatas();
  // }, []);

  useEffect(() => {
    allData();
  }, [registrationDateStart, registrationDateEnd]);

  const handleResetFilter = () => {
    const defaultDates = getDefaultDates();
    setRegistrationDateStart(defaultDates.start);
    setRegistrationDateEnd(defaultDates.end);
    setSubscriptionType("");
    setUserActivity("");
    setSearchQuery("");
    setRole("");
  };

  const handleStatusChange = async (eventId, currentStatus) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/user_status_change`,
        {
          customer_unique_id: eventId,
          status: currentStatus === "Active" ? "Inactive" : "Active",
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        notify("success", response.data.message);
        await allData();
      }
    } catch (error) {
      notify("error", error.response?.data?.message || "Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((user) => {
    const isSubscriptionMatch = subscriptionType
      ? user.subscription?.subscription_name === subscriptionType
      : true;
    const isActivityMatch = userActivity
      ? userActivity === "Active"
        ? user.status === "Active"
        : user.status !== "Active"
      : true;
    const isSearchMatch = searchQuery
      ? user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const isRoleMatch = role
      ? user.role === role
      : true;

    return isSubscriptionMatch && isActivityMatch && isSearchMatch && isRoleMatch;
  });

  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentSeries = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / 10);

  const handleShowInfo = (userID, role) => {
    navigate(`${userID}?role=${role}`);
  }

  const handleShowChat = () => {

  }

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 max-w-full bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Employee Management</h1>
          <button onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 text-base font-medium text-white bg-[#4A3AFF] rounded-lg hover:bg-[#3D32CC] shadow-sm transition-all duration-200"
          >
            Add Employee
          </button>
        </div>

        <div className="flex items-center justify-end mb-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 text-nowrap">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creation Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSeries.length > 0 ? (
                currentSeries.map((user) => (
                  <tr key={user.customer_unique_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        {user.customer_profile_image ? (
                          <img
                            src={user.customer_profile_image}
                            alt=""
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            {user.full_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="ml-4">
                        <ToggleSwitch
                          checked={user.status === "Active"}
                          onChange={() =>
                            handleStatusChange(
                              user.customer_unique_id,
                              user.status
                            )
                          }
                        />
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dateFormate(user.inserted_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-row gap-5">
                        <button onClick={() => handleShowInfo(user.customer_unique_id, user.role)}>
                          <Eye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <h1 className="py-2 text-center">User Not Available</h1>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Add Privileged User
                      </h3>
                      <div className="mt-4">
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const fullName = e.target.full_name.value.trim();
                            const email = e.target.email.value.trim();
                            const role = e.target.role.value.trim();
                            const subscription = e.target.subscription.value.trim();
                            const password = e.target.password.value.trim();
                            // const agent_percentage = e.target.agent_percentage.value.trim() || null;
                            // const is_student = e.target.is_student.value.trim() || false;

                            const agent_percentage = e.target.agent_percentage?.value?.trim() || null;
                            const is_student = e.target.is_student?.checked || false;

                            if (!fullName || !email || !role || !subscription || !password) {
                              notify("error", "All fields are required.");
                              return;
                            }

                            if(role == "agent" && !agent_percentage){
                              notify("error", "Agent percentage is required.");
                              return;   
                            }

                            try {
                              setLoading(true);
                              const response = await axios.post(
                                `${baseUrl}/create_privileged_user`,
                                {
                                  full_name: fullName,
                                  email,
                                  role,
                                  subscription_name: subscription,
                                  password,
                                  agent_percentage,
                                  is_student: is_student
                                },
                                {
                                  headers: {
                                    Authorization: `Bearer ${user?.token}`,
                                  },
                                }
                              );

                              if (response.data.status) {
                                notify("success", "User created successfully");
                                await allData();
                                setIsModalOpen(false);
                              }
                            } catch (error) {
                              notify("error", error.response?.data?.message || "Error creating user");
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          <div className="mb-4">
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="full_name"
                              id="full_name"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="Enter full name"
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="Enter email address"
                            />
                          </div>

                          <div className="mb-4">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                              Role
                            </label>
                            <select
                              name="role"
                              id="role"
                              onChange={(e) => setRole(e.target.value)}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            >
                              <option value="">Select role</option>
                              <option value="agent">Agent</option>
                              <option value="investor">Investor</option>
                              <option value="entrepreneur">Entrepreneur</option>
                            </select>
                          </div>

                          {role === 'agent' && (
                            <div className="mb-4">
                              <label htmlFor="agent_percentage" className="block text-sm font-medium text-gray-700 mb-1">
                                Agent Percentage
                              </label>
                              <input
                                type="number"
                                name="agent_percentage"
                                id="agent_percentage"
                                min="0"
                                max="100"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                placeholder="Enter percentage"
                              />
                            </div>
                          )}

                          {role === 'entrepreneur' && (
                            <div className="mb-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="is_student"
                                  id="is_student"
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_student" className="ml-2 block text-sm text-gray-700">
                                  Select if the user is a student.
                                </label>
                              </div>
                            </div>
                          )}

                          <div className="mb-4">
                            <label htmlFor="subscription" className="block text-sm font-medium text-gray-700 mb-1">
                              Subscription Plan
                            </label>
                            <select
                              name="subscription"
                              id="subscription"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            >
                              <option value="">Select subscription</option>
                              <option value="basic">Basic</option>
                              <option value="pro">Pro</option>
                              <option value="elite">Elite</option>
                            </select>
                          </div>

                          <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                              Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="Enter password"
                            />
                          </div>
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Add User
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

        {filteredData.length > 10 && (
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PriviligedUsers;
