import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";

const SubscriptionCard = ({ title, price, features, isPopular }) => (
  <div
    className={`relative rounded-lg overflow-hidden ${
      isPopular ? "border-blue-500 border-2" : "border border-gray-200"
    } bg-white shadow-lg`}
  >
    <div className="p-6 space-y-2">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="text-4xl font-bold text-blue-500">
        ${price}
        <span className="text-base font-normal text-gray-600">/month</span>
      </div>
    </div>
    <div className="p-6 space-y-4">
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <div className="space-y-2 pt-4">
        <button
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            isPopular
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "border border-blue-500 text-blue-500 hover:bg-blue-50"
          }`}
        >
          Edit
        </button>
        <button className="w-full py-2 px-4 rounded-md text-red-500 hover:bg-red-50 transition-colors">
          Remove
        </button>
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SubscriptionManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    price: "",
    bandwidth: "",
    userConnections: "",
  });

  const plans = [
    {
      title: "Basic",
      price: "14.99",
      features: [
        "Free Setup",
        "Bandwidth Limit 10 GB",
        "20 User Connection",
        "Analytics Report",
        "Public API Access",
        "Plugins Integration",
        "Custom Content Management",
      ],
    },
    {
      title: "Standard",
      price: "49.99",
      features: [
        "Free Setup",
        "Bandwidth Limit 10 GB",
        "20 User Connection",
        "Analytics Report",
        "Public API Access",
        "Plugins Integration",
        "Custom Content Management",
      ],
    },
    {
      title: "Premium",
      price: "89.99",
      features: [
        "Free Setup",
        "Bandwidth Limit 10 GB",
        "20 User Connection",
        "Analytics Report",
        "Public API Access",
        "Plugins Integration",
        "Custom Content Management",
      ],
      isPopular: true,
    },
  ];

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Subscription & Monetization Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <SubscriptionCard key={index} {...plan} />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Subscription Plan"
      >
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Plan Title
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter plan title"
              value={newPlan.title}
              onChange={(e) =>
                setNewPlan({ ...newPlan, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Monthly Price ($)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter price"
              value={newPlan.price}
              onChange={(e) =>
                setNewPlan({ ...newPlan, price: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bandwidth Limit (GB)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter bandwidth limit"
              value={newPlan.bandwidth}
              onChange={(e) =>
                setNewPlan({ ...newPlan, bandwidth: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              User Connections
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter user connections"
              value={newPlan.userConnections}
              onChange={(e) =>
                setNewPlan({ ...newPlan, userConnections: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => {
                // Handle save logic here
                setIsModalOpen(false);
              }}
            >
              Save Plan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionManager;
