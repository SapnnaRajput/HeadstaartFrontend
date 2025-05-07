import { useState, useEffect } from "react";
import {
  BadgeCheck,
  Star,
  Crown,
  Zap,
  Edit,
  Save,
  Trash,
  Plus,
  Users,
  Briefcase,
  LineChart,
  X,
} from "lucide-react";
import axios from "axios";
import { ToggleSwitch } from "flowbite-react";
import { notify } from "../../../Utiles/Notification";
import Loader from "../../../Utiles/Loader";
import { UserState } from "../../../context/UserContext";

const AdminSubscriptionManagement = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState(null);
  const [editedSubscription, setEditedSubscription] = useState({});

  // Group subscriptions by role
  const groupedSubscriptions = subscriptionData.reduce((acc, sub) => {
    if (!acc[sub.role]) {
      acc[sub.role] = [];
    }
    acc[sub.role].push(sub);
    return acc;
  }, {});

  // Rest of the state management and API calls remain the same
  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/getSubscriptions`);
      if (response.data.status) {
        setSubscriptionData(response.data.Subscriptiondata);
      }
    } catch (error) {
      notify("error", "Failed to fetch subscription data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [baseUrl]);

  const handleEdit = (subscription) => {
    setEditingSubscriptionId(subscription.subscription_id);
    setEditedSubscription({ ...subscription });
  };

  const handleSave = async (detail) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/edit_subscription_features`,
        detail,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          }
        }
      );
      if (response.data.status) {
        notify("success", "Subscription updated successfully.");
        setEditingSubscriptionId(null);
        fetchSubscriptionData();
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", "Failed to update subscription.");
    }
    setLoading(false);
  };

  const handleDelete = async (subscriptionId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${baseUrl}/deleteSubscription/${subscriptionId}`
      );
      if (response.data.status) {
        notify("success", "Subscription deleted successfully.");
        fetchSubscriptionData();
      }
    } catch (error) {
      notify("error", "Failed to delete subscription.");
    }
    setLoading(false);
  };

  const handleChange = (e, field) => {
    setEditedSubscription({
      ...editedSubscription,
      [field]: e.target.value,
    });
  };

  const handleDetailChange = (e, detailId, field) => {
    const updatedDetails = editedSubscription.subscription_details.map(
      (detail) =>
        detail.subcription_detail_id === detailId
          ? { ...detail, [field]: e.target.value }
          : detail
    );
    setEditedSubscription({
      ...editedSubscription,
      subscription_details: updatedDetails,
    });
  };

  const handleToggleStatus = (detailId) => {
    const updatedDetails = editedSubscription.subscription_details.map(
      (detail) =>
        detail.subcription_detail_id === detailId
          ? {
            ...detail,
            status: detail.status === "Active" ? "Inactive" : "Active",
          }
          : detail
    );
    setEditedSubscription({
      ...editedSubscription,
      subscription_details: updatedDetails,
    });
  };

  const handleAddFunctionality = () => {
    const newFunctionality = {
      subcription_detail_id: Date.now(),
      functionality: "",
      limit: "",
      description: "",
      status: "Active",
    };
    setEditedSubscription({
      ...editedSubscription,
      subscription_details: [
        ...editedSubscription.subscription_details,
        newFunctionality,
      ],
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "entrepreneur":
        return <Briefcase className="w-8 h-8 text-blue-600" />;
      case "investor":
        return <LineChart className="w-8 h-8 text-green-600" />;
      case "agent":
        return <Users className="w-8 h-8 text-purple-600" />;
      default:
        return null;
    }
  };

  const getTierIcon = (name) => {
    switch (name.toLowerCase()) {
      case "basic":
        return <BadgeCheck className="w-6 h-6 text-blue-500" />;
      case "pro":
        return <Star className="w-6 h-6 text-purple-500" />;
      case "elite":
        return <Crown className="w-6 h-6 text-yellow-500" />;
      default:
        return <Zap className="w-6 h-6 text-gray-500" />;
    }
  };
  const handleCancelEdit = () => {
    setEditingSubscriptionId(null);
    setEditedSubscription({});
  };
  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/edit_subscription_price`,
        {
          subscription_name: editedSubscription.subscription_name,
          subscription_description: editedSubscription.subscription_description,
          subscription_price: editedSubscription.subscription_price,
          subscription_id: editedSubscription.subscription_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          }
        }
      );
      if (response.data.status) {
        fetchSubscriptionData();
        setEditingSubscriptionId(null);
        notify("success", "Subscription updated successfully.");
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", "Failed to update subscription.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Management
          </h1>
          <p className="text-xl text-gray-600">
            Manage and customize subscription plans for your platform
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedSubscriptions).map(([role, plans]) => (
              <div key={role} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-4">
                  {getRoleIcon(role)}
                  <h2 className="text-3xl font-bold capitalize text-gray-800">
                    {role} Plans
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {plans.map((plan) => (
                    <div
                      key={plan.subscription_id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          {getTierIcon(plan.subscription_name)}
                          <h3 className="text-2xl font-bold text-gray-900">
                            {plan.subscription_name}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          {/* <button
                            onClick={() => handleDelete(plan.subscription_id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash className="w-5 h-5" />
                          </button> */}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">
                              ${plan.subscription_price}
                            </span>
                            <span className="text-gray-500">/month</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-md text-gray-600">
                              ${plan.subscription_price * 12}
                            </span>
                            <span className="text-sm text-gray-500">(billed annually)</span>
                          </div>
                        </div>
                        <p className="text-gray-600">
                          {plan.subscription_description}
                        </p>
                        <ul className="space-y-3">
                          {plan.subscription_details.map((detail) => (
                            <li
                              key={detail.subcription_detail_id}
                              className="flex items-start gap-2 text-gray-700"
                            >
                              <div className="w-[10%]">
                                <BadgeCheck className="w-6 h-6 text-[#4A3AFF] mt-1" />
                              </div>

                              <div className="w-[90%]">
                                <span className="font-semibold">
                                  {detail.functionality}
                                </span>
                                <span className="block text-sm text-gray-500">
                                  {detail.description} ({detail.limit})
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {editingSubscriptionId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Edit Subscription
                  </h3>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editedSubscription.subscription_name || ""}
                        onChange={(e) => handleChange(e, "subscription_name")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Price (USD)
                      </label>
                      <input
                        type="text"
                        value={editedSubscription.subscription_price || ""}
                        onChange={(e) => handleChange(e, "subscription_price")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={editedSubscription.subscription_description || ""}
                      onChange={(e) =>
                        handleChange(e, "subscription_description")
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      maxLength={20}
                    />
                    <div className="text-end">
                      {editedSubscription.subscription_description.length}/20
                      characters
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveEdit}
                      className=" px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Features
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {editedSubscription.subscription_details?.map(
                        (detail, i) => (
                          <div
                            key={detail.subcription_detail_id}
                            className="p-4 bg-gray-50 rounded-lg space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Feature Name
                                </label>
                                <input
                                  type="text"
                                  value={detail.functionality}
                                  onChange={(e) =>
                                    handleDetailChange(
                                      e,
                                      detail.subcription_detail_id,
                                      "functionality"
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Limit
                                </label>
                                <input
                                  type="text"
                                  value={detail.limit}
                                  onChange={(e) =>
                                    handleDetailChange(
                                      e,
                                      detail.subcription_detail_id,
                                      "limit"
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                value={detail.description}
                                onChange={(e) =>
                                  handleDetailChange(
                                    e,
                                    detail.subcription_detail_id,
                                    "description"
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="2"
                                maxLength={60}
                              />
                              <div className="text-end">
                                {detail.description.length}/60 characters
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">
                                  Status
                                </span>
                                <ToggleSwitch
                                  checked={detail.status === "Active"}
                                  onChange={() =>
                                    handleToggleStatus(
                                      detail.subcription_detail_id
                                    )
                                  }
                                />
                              </div>
                              <button
                                onClick={() => handleSave(detail)}
                                className="px-4 py-1 bg-blue-500 text-white text-base rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionManagement;
