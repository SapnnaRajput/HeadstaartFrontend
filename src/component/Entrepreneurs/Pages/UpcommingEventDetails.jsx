import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { UserState } from "../../../context/UserContext";
import { notify } from "../../../Utiles/Notification";
import { useParams } from "react-router-dom";
import CustomButton from "../../../Utiles/CustomButton";
import Loader from "../../../Utiles/Loader";

const UpcommingEventDetails = () => {
  const { event_unique_id } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_single_event`,
        { event_unique_id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data?.status) {
        setData(response.data?.event);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      notify(
        "error",
        error.response?.data?.message || "Failed to fetch details"
      );
    } finally {
      setLoading(false);
    }
  }, [event_unique_id]);

  const handleRegister = async () => {
    setErrors((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
    }));
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Invalid mobile number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const registrationData = {
          event_unique_id: String(selectedEvent.event_unique_id),
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
        };

        if (!selectedEvent.ispaid) {
          const response = await axios.post(
            `${baseUrl}/event_registration`,
            registrationData,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          if (response.data.status) {
            notify("success", "Registration successful!");
            setShowModal(false);
            resetForm();
          }
        } else {
          const response = await axios.post(
            `${baseUrl}/event_register_checkout`,
            {
              ...registrationData,
              payment_method: "card",
              price: selectedEvent.event_price,
              success_url: `${window.location.href}`.trim(),
              cancel_url:
                `${window.location.origin}/${user.role}/verification/cancel`.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          if (response.data.status) {
            const { error } = await stripeInstance.redirectToCheckout({
              sessionId: response.data.id,
            });

            if (error) {
              notify("error", error.message);
            }
          } else {
            notify("error", response.data.message);
          }
        }
      } catch (error) {
        notify("error", error.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;
  if (!data)
    return (
      <div className="p-6 text-gray-500 text-center">
        No Event data available.
      </div>
    );

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-3 border-b-2 border-gray-200 pb-4">
        Event Details
      </h3>
      <div className="w-full">
        <h3 className="text-lg font-semibold my-2">{data?.event_title}</h3>
        <div className="flex w-full flex-col sm:flex-row gap-5 sm:items-center">
          {data?.event_images?.[0]?.event_image && (
            <div className="mb-6 w-full sm:w-1/2 relative">
              <img
                src={data?.event_images[0].event_image || img}
                alt={data?.event_title}
                className="w-full h-80 object-cover rounded-lg"
              />
              {data.event_type && (
                <div className="absolute top-4 right-4 bg-white text-[#a679f6] font-semibold text-base px-2 py-1 rounded">
                  {data.event_type}
                </div>
              )}
            </div>
          )}
          <div className="w-full sm:w-1/2">
            <div>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 ">
                <div className="bg-neutral-100 p-4 rounded-md">
                  <p className="text-gray-600 font-medium mb-1">Date & Time</p>
                  <p className="text-[#25131A]">
                    {formatDate(data?.started_date)} at{" "}
                    {formatTime(data?.started_time)}
                  </p>
                </div>

                <div className="bg-neutral-100 p-4 rounded-md">
                  <p className="text-gray-600 font-medium mb-1">Location</p>
                  <p className="text-[#25131A]">
                    {data?.city?.name_of_city || data?.city_name},
                    {data?.state?.state_subdivision_name || data?.state_name}
                  </p>
                </div>

                <div className="bg-neutral-100 p-4 rounded-md">
                  <p className="text-gray-600 font-medium mb-1">Event Type</p>
                  <p>
                    {data?.event_price > 0 ? (
                      <span className="text-[#00BB20] font-medium">
                        Paid - ${data?.event_price}
                      </span>
                    ) : (
                      <span className="text-green-500 font-medium">Free</span>
                    )}
                  </p>
                  {data?.ispaid}
                </div>

                <div className="bg-neutral-100 p-4 rounded-md">
                  <p className="text-gray-600 font-medium mb-1">Event Range</p>
                  <p className="text-[#25131A]">{data?.event_range}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-gray-600 text-xl font-semibold mb-1">
            Description
          </h3>
          <p>{data?.description}</p>
        </div>
      </div>

      <div className="flex justify-start mt-2">
        <button
          className="bg-[#4A3AFF] text-white text-sm rounded-md px-4 py-3 transition-colors"
          onClick={() => {
            handleRegister(data);
          }}
        >
          Register Now
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="relative bg-white rounded-lg w-full max-w-md mx-4 flex flex-col"
            style={{ maxHeight: "60vh" }}
          >
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Register Now</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div
              className="p-6 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 140px)" }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {data?.event_price > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">Event Price:</p>
                    <p className="text-xl font-semibold text-[#4A3AFF]">
                      ${data.event_price}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-end border-t p-4 mt-auto">
              <CustomButton
                label={
                  data?.event_price > 0 ? "Proceed to Payment" : "Register"
                }
                onClick={handleSubmit}
              />
              <CustomButton
                label="Close"
                cancel={true}
                onClick={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcommingEventDetails;
