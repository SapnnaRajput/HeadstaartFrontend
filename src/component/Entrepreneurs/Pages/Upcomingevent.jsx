import React, { useEffect, useState } from "react";
import img from "../../../Assets/Images/event.png";
import profile from "../../../Assets/Images/agent-1.png";
import { Avatar } from "flowbite-react";
import { Heart, Eye } from "lucide-react";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import { UserState } from "../../../context/UserContext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../Utiles/CustomButton";
import useStripeCredentials from "../../../Utiles/StripePublicKey";

const Upcomingevent = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const navigate = useNavigate();
  const { user } = UserState();
  const [loading, setLoading] = useState(true);
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const {
    publicKey,
    loading: stripeLoading,
    error: stripeError,
  } = useStripeCredentials();
  const [stripeInstance, setStripeInstance] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      if (publicKey) {
        try {
          const stripe = await loadStripe(publicKey);
          setStripeInstance(stripe);
        } catch (error) {
          console.error("Error initializing Stripe:", error);
          notify("error", "Failed to initialize payment system");
        }
      }
    };

    initializeStripe();
  }, [publicKey]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.getAll("session_id").pop();

    const updatePaymentStatus = async () => {
      try {
        const endpoint = `${baseUrl}/event_register_checkout_success`;
        const response = await axios.post(
          endpoint,
          {
            payment_id: sessionId,
            status: true,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          navigate(`/${user.role}/upcoming-events`);
          window.location.reload();
          notify("success", "Payment completed successfully");
        } else {
          notify("error", response.data.message || "Failed to verify payment");
          navigate(`/${user.role}/upcoming-events`);
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        navigate(`/${user.role}/upcoming-events`);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      updatePaymentStatus();
    } else {
      setLoading(false);
      navigate(`/${user.role}/upcoming-events`);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingSkeleton(true);
      try {
        const response = await axios.get(`${baseUrl}/get_upcoming_event`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setEvents(response.data.eventDetails || []);
        }
      } catch (error) {
        notify("error", "Unauthorized access please login again");
      } finally {
        setLoadingSkeleton(false);
      }
    };
    fetchEvents();
  }, [baseUrl]);

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

  const handleRegister = async (event) => {
    setErrors((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
    }));
    setSelectedEvent(event);
    setShowModal(true);
  };
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
    });
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

  const handleViewDetails = async (eventId) => {
    navigate(`/${user.role}/upcoming-events/${eventId}`);
    // setLoading(true);
    // try {
    //   const response = await axios.post(
    //     `${baseUrl}/get_single_event`,
    //     { event_unique_id: eventId },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${user?.token}`,
    //       },
    //     }
    //   );
    //   if (response.data.status) {
    //     setEventDetails(response.data.event);
    //     setLoading(false);

    //     setShowDetailsModal(true);
    //   }
    // } catch (error) {
    //   notify(
    //     "error",
    //     error.response?.data?.message || "Failed to fetch event details"
    //   );
    //   setLoading(false);
    // }
  };

  return (
    <>
      {loading && <Loader />}
      {loadingSkeleton && (
        <div className="rounded-xl container mx-auto md:p-6 p-3 bg-white">
          <div className="h-7 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="grid md:grid-cols-3 grid-cols-1 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden bg-white shadow-xl animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 my-3"></div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="flex flex-row place-items-center justify-between mt-3">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl  container mx-auto md:p-6 p-3 bg-white">
        <h1 className="text-xl font-semibold mb-6 text-[#05004E]">
          Upcoming Events
        </h1>
        {events.length > 0 ? (
          <div className="grid md:grid-cols-3 grid-cols-1 xl:grid-cols-4 gap-5">
            {events.map((event) => (
              <div
                key={event.upcoming_events_id}
                className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-full h-48 overflow-hidden relative">
                  <img
                    src={event.eventImages?.[0]?.event_image || img}
                    alt={event.event_title}
                    className="w-full h-full object-cover object-center cursor-pointer"
                    onClick={() => handleViewDetails(event.event_unique_id)}
                  />
                  {event.event_type && (
                    <div className="absolute top-2 right-2 bg-white text-[#a679f6] font-semibold text-xs px-2 py-1 rounded">
                      {event.event_type}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h1 className="text-base font-bold text-gray-800 mb-2 line-clamp-1 capitalize">
                      {event.event_title}
                    </h1>
                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span>{formatDate(event.started_date)}</span>
                        <span>{formatTime(event.started_time)}</span>
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-1">
                        {event.city_name}, {event.state_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      {event.ispaid ? (
                        <span className="text-[#00BB20] font-medium">
                          ${event.event_price}
                        </span>
                      ) : (
                        <span className="text-green-500 font-medium">Free</span>
                      )}
                    </div>
                    <button
                      className="bg-[#4A3AFF] text-white text-xs rounded-md px-4 py-2 transition-colors"
                      onClick={() => {
                        handleRegister(event);
                      }}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[200px]">
            <h2 className="text-2xl text-gray-400">
              No upcoming events available
            </h2>
          </div>
        )}
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

                {selectedEvent?.event_price > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">Event Price:</p>
                    <p className="text-xl font-semibold text-[#4A3AFF]">
                      ${selectedEvent.event_price}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-end border-t p-4 mt-auto">
              <CustomButton
                label={
                  selectedEvent?.event_price > 0
                    ? "Proceed to Payment"
                    : "Register"
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

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-lg w-full max-w-2xl flex flex-col"
            style={{ maxHeight: "70vh" }}
          >
            {/* Fixed Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Event Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div
              className="p-6 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 140px)" }}
            >
              <h1 className="text-lg font-bold text-[#25131A] mb-6 capitalize">
                {eventDetails.event_title}
              </h1>

              {eventDetails.event_images?.[0]?.event_image && (
                <div className="mb-6">
                  <img
                    src={eventDetails.event_images[0].event_image || img}
                    alt={eventDetails.event_title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-gray-600 font-medium mb-1">Date & Time</p>
                  <p className="text-[#25131A]">
                    {formatDate(eventDetails.started_date)} at{" "}
                    {formatTime(eventDetails.started_time)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 font-medium mb-1">Location</p>
                  <p className="text-[#25131A]">
                    {eventDetails.city?.name_of_city || eventDetails.city_name},
                    {eventDetails.state?.state_subdivision_name ||
                      eventDetails.state_name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 font-medium mb-1">Event Type</p>
                  <p>
                    {eventDetails.event_price > 0 ? (
                      <span className="text-[#4A3AFF] font-medium">
                        Paid - ${eventDetails.event_price}
                      </span>
                    ) : (
                      <span className="text-green-500 font-medium">Free</span>
                    )}
                  </p>
                  {eventDetails.ispaid}
                </div>

                <div>
                  <p className="text-gray-600 font-medium mb-1">Event Range</p>
                  <p className="text-[#25131A]">{eventDetails.event_range}</p>
                </div>
              </div>

              {eventDetails.description && (
                <div className="mb-6">
                  <p className="text-gray-600 font-medium mb-2">Description</p>
                  <p className="text-[#25131A] whitespace-pre-wrap">
                    {eventDetails.description}
                  </p>
                </div>
              )}

              {eventDetails.event_schedule && (
                <div className="mb-2">
                  <p className="text-gray-600 font-medium mb-2">
                    Event Schedule
                  </p>
                  <p className="text-[#25131A] whitespace-pre-wrap">
                    {eventDetails.event_schedule}
                  </p>
                </div>
              )}
            </div>

            {/* Fixed Footer */}
            <div className="flex gap-4 justify-end border-t p-4 mt-auto">
              <CustomButton
                label="Register Now"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleRegister(eventDetails);
                }}
              />
              <CustomButton
                label="Close"
                cancel={true}
                onClick={() => setShowDetailsModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Upcomingevent;
