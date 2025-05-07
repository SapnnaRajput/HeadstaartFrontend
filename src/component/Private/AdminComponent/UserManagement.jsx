import React, { useEffect, useState } from "react";
import { MoreVertical, Filter, RefreshCcw, Eye, Search, MessageCirclePlus } from "lucide-react";
import { notify } from "../../../Utiles/Notification";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import { ToggleSwitch } from "flowbite-react";
import Loader from "../../../Utiles/Loader";
import Pagination from "../../../Utiles/Pagination";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
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
      const response = await axios.post(
        `${baseUrl}/get_all_customer`,
        {
          min_date: registrationDateStart,
          max_date: registrationDateEnd,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setData(response.data.customers);
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const allDatas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_sub_name`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDatas(response.data.data);
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allDatas();
  }, []);

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
        `${baseUrl}/customer_status_change`,
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

  const handleShowInfo = (userID , role) =>{
    navigate(`${userID}?role=${role}`);
  } 

  const handleShowChat = () => {

  }

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 max-w-full bg-gray-50">
        <h1 className="text-xl font-semibold mb-6">User Management</h1>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="p-2 bg-gray-50 rounded-full">
              <Filter className="w-5 h-5" />
            </button>

            <input
              type="date"
              value={registrationDateStart}
              onChange={(e) => setRegistrationDateStart(e.target.value)}
              className="px-3 py-2 border rounded-md w-48 text-sm"
            />
            <input
              type="date"
              value={registrationDateEnd}
              onChange={(e) => setRegistrationDateEnd(e.target.value)}
              className="px-3 py-2 border rounded-md w-48 text-sm"
            />

            <select
              value={subscriptionType}
              onChange={(e) => setSubscriptionType(e.target.value)}
              className="px-3 py-2 border rounded-md w-48 text-sm"
            >
              <option value="">Subscription Type</option>
              {datas.map((list, i) => (
                <option key={i} value={list.subscription_name}>
                  {list.subscription_name}
                </option>
              ))}
            </select>

            <select
              value={userActivity}
              onChange={(e) => setUserActivity(e.target.value)}
              className="px-3 py-2 border rounded-md w-48 text-sm"
            >
              <option value="">User Activity</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 border rounded-md w-48 text-sm"
            >
              <option value="">Role</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="investor">Investor</option>
              <option value="agent">Agent</option>
            </select>
            

            <button
              onClick={handleResetFilter}
              className="flex items-center gap-2 text-red-600 px-4 py-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset Filter
            </button>
          </div>
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
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.subscription?.subscription_name}
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
                        <button onClick={() => handleShowInfo(user.customer_unique_id , user.role)}>
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

export default UserManagement;
