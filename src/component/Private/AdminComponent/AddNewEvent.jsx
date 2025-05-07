import React, { useState } from "react";
import axios from "axios";
import Loader from "../../../Utiles/Loader";
import { UserState } from "../../../context/UserContext";
import { notify } from "../../../Utiles/Notification";
import LocationSelector from "../../../Utiles/LocationSelector";
import CustomButton from "../../../Utiles/CustomButton";
import { X, Upload } from "lucide-react";
import { Datepicker } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

const AddNewEvent = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [formData, setFormData] = useState({
    eventType: "",
    eventRange: "",
    eventName: "",
    address: "",
    eventCity: "",
    zipCode: "",
    eventState: "",
    eventCountry: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    payment: "",
    description: "",
    seats: "",
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  const [addDetails, setAddDetails] = useState(true);
  const { user } = UserState();
  const [roles] = useState(["Entrepreneur", "Investor", "Agent"]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [images, setImages] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);
  const [startDateCalendarOpen, setStartDateCalendarOpen] = useState(false);
  const [endDateCalendarOpen, setEndDateCalendarOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const inputClassName =
    "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-h-[48px] text-base";
  const labelClassName = "block text-base text-gray-800 mb-2";

  const handleNext = () => {
    setAddDetails(false);
    setUploadImage(true);
  };
  const fetchSubscriptionData = async (role) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_subscription_data/${role}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setSubscriptionData(response.data.subscription);
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    if (selectedRole) {
      fetchSubscriptionData(selectedRole.toLowerCase());
    } else {
      setSubscriptionData([]);
    }
  };

  const handleDateChange = (date, dateType) => {
    // Convert dayjs to Date object
    const dateObj = date.toDate();

    // Format for display (mm-dd-yyyy)
    const formattedDisplayDate = formatDateToMMDDYYYY(dateObj);

    // Format for API (yyyy-mm-dd)
    const formattedApiDate = formatDateToYYYYMMDD(dateObj);

    // For validation, use the date objects directly
    if (dateType === "endDate" && formData.startDate) {
      const startDate = new Date(formData.startDate);
      startDate.setHours(12, 0, 0, 0);
      dateObj.setHours(12, 0, 0, 0);

      if (dateObj < startDate) {
        notify("error", "End date cannot be before start date");
        return;
      }
    }

    if (dateType === "startDate" && formData.endDate) {
      const endDate = new Date(formData.endDate);
      endDate.setHours(12, 0, 0, 0);
      dateObj.setHours(12, 0, 0, 0);

      if (dateObj > endDate) {
        notify("error", "Start date cannot be after end date");
        setFormData((prevState) => ({
          ...prevState,
          endDate: "",
        }));
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [dateType]: formattedApiDate,
      [`${dateType}Display`]: formattedDisplayDate, // Store display format separately
    }));

    // Close the calendar after selection
    if (dateType === "startDate") {
      setStartDateCalendarOpen(false);
    } else {
      setEndDateCalendarOpen(false);
    }
  };

  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const handleRoleSubscriptionAdd = () => {
    const roleSelect = document.getElementById("roleSelect");
    const subscriptionSelect = document.getElementById("subscriptionSelect");

    if (roleSelect.value && subscriptionSelect.value) {
      const selectedSubscription = subscriptionData.find(
        (sub) => sub.subscription_id.toString() === subscriptionSelect.value
      );

      setSelectedRoles([
        ...selectedRoles,
        {
          role: roleSelect.value,
          subscription: selectedSubscription.subscription_name,
          subscription_id: selectedSubscription.subscription_id,
        },
      ]);

      roleSelect.value = "";
      subscriptionSelect.value = "";
      setSubscriptionData([]);
    }
  };

  const handleRemoveRole = (index) => {
    const newRoles = selectedRoles.filter((_, i) => i !== index);
    setSelectedRoles(newRoles);
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        const newImages = [...images];
        newPreviews[index] = reader.result;
        newImages[index] = file;
        setPreviews(newPreviews);
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    const newPreviews = [...previews];
    const newImages = [...images];
    newPreviews[index] = null;
    newImages[index] = null;
    setPreviews(newPreviews);
    setImages(newImages);
  };

  const handleBack = () => {
    setAddDetails(true);
    setUploadImage(false);
  };
  const validateForm = () => {
    if (!formData.eventType.trim()) {
      notify("error", "Event type is required");
      return false;
    }
    if (!formData.eventRange) {
      notify("error", "Event range is required");
      return false;
    }
    if (!formData.eventName.trim()) {
      notify("error", "Event name is required");
      return false;
    }
    if (!formData.address.trim()) {
      notify("error", "Address is required");
      return false;
    }
    if (!formData.zipCode.trim()) {
      notify("error", "Zip code is required");
      return false;
    }
    if (!formData.startDate) {
      notify("error", "Start date is required");
      return false;
    }
    if (!formData.endDate) {
      notify("error", "End date is required");
      return false;
    }
    if (!formData.startTime) {
      notify("error", "Start time is required");
      return false;
    }
    if (!formData.endTime) {
      notify("error", "End time is required");
      return false;
    }
    if (!formData.seats) {
      notify("error", "Seats is required");
      return false;
    }
    if (!formData.payment) {
      notify("error", "Payment is required");
      return false;
    }
    if (!formData.description.trim()) {
      notify("error", "Description is required");
      return false;
    }

    if (formData.eventRange === "") {
      notify("error", "Event range is required");
      return false;
    }
    if (!selectedCountry) {
      notify("error", "Country is required for regional events");
      return false;
    }
    if (!selectedState) {
      notify("error", "State is required for regional events");
      return false;
    }
    if (!selectedCity) {
      notify("error", "City is required for regional events");
      return false;
    }

    if (selectedRoles.length === 0) {
      notify("error", "At least one role and subscription must be selected");
      return false;
    }

    if (!images[0]) {
      notify("error", "Banner image (first image) is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("event_type", formData.eventType);
      formDataToSend.append("event_range", formData.eventRange);
      formDataToSend.append("event_title", formData.eventName);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("zip_code", formData.zipCode);
      formDataToSend.append("started_date", formData.startDate);
      formDataToSend.append("ended_date", formData.endDate);
      formDataToSend.append("started_time", formData.startTime);
      formDataToSend.append("ended_time", formData.endTime);
      formDataToSend.append("event_price", formData.payment);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("seats", formData.seats);
      formDataToSend.append("user_id", user.user_id);
      formDataToSend.append("country", selectedCountry.value);
      formDataToSend.append("state", selectedState.value);
      formDataToSend.append("city", selectedCity.value);
      selectedRoles.forEach((role, index) => {
        formDataToSend.append(
          `subscription_id[${index}]`,
          role.subscription_id
        );
        formDataToSend.append(`role[${index}]`, role.role);
      });

      images.forEach((image, index) => {
        if (image) {
          formDataToSend.append(`event_images[${index}]`, image);
        }
      });

      const response = await axios.post(
        `${baseUrl}/add_event`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        notify("success", "Event added successfully");
        navigate("/superadmin/event-management");
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      notify("error", "Failed to add event. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  function formatDateToMMDDYYYY(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
  return (
    <>
      {loading && <Loader />}
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
        Add New Event
      </h1>
      {addDetails && (
        <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 bg-white rounded-lg shadow-sm">
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              <div className="w-full">
                <label className={labelClassName}>
                  Event Type<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Text"
                />
              </div>

              <div className="w-full">
                <label className={labelClassName}>
                  Event Range<span className="text-red-500">*</span>
                </label>
                <select
                  name="eventRange"
                  value={formData.eventRange}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">Select</option>
                  <option value="worldwide">WorldWide</option>
                  <option value="regional">Regional</option>
                </select>
              </div>

              <div className="w-full">
                <label className={labelClassName}>
                  Event Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Enter event name"
                />
              </div>

              <LocationSelector
                selectedCountry={selectedCountry}
                selectedState={selectedState}
                selectedCity={selectedCity}
                onCountryChange={setSelectedCountry}
                onStateChange={setSelectedState}
                onCityChange={setSelectedCity}
                className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6"
                labelClass={labelClassName}
                inputClass="border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <div className="w-full">
                <label className={labelClassName}>
                  Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Address"
                />
              </div>

              <div className="w-full">
                <label className={labelClassName}>
                  Zip code<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Enter zip code"
                />
              </div>

              {/* <div className="w-full">
                <label className={labelClassName}>
                  Event Start Date<span className="text-red-500">*</span>
                </label>
                <Datepicker
                  weekStart={1}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  value={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : undefined
                  }
                  className="w-full"
                  placeholder="Select start date"
                  minDate={new Date()}
                />
            
              </div> */}

              <div className="w-full">
                <label className={labelClassName}>
                  Event Start Date<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="startDateDisplay"
                    value={formData.startDateDisplay || ""}
                    readOnly
                    className={inputClassName}
                    placeholder="MM-DD-YYYY"
                    onClick={() => setStartDateCalendarOpen(true)}
                  />
                  {startDateCalendarOpen && (
                    <div className="absolute z-10 bg-white shadow-lg rounded-lg border mt-1">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                          value={
                            formData.startDate
                              ? dayjs(formData.startDate)
                              : null
                          }
                          onChange={(date) =>
                            handleDateChange(date, "startDate")
                          }
                          minDate={dayjs(new Date())}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label className={labelClassName}>
                  Event End Date<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="endDateDisplay"
                    value={formData.endDateDisplay || ""}
                    readOnly
                    className={inputClassName}
                    placeholder="MM-DD-YYYY"
                    onClick={() => setEndDateCalendarOpen(true)}
                  />
                  {endDateCalendarOpen && (
                    <div className="absolute z-10 bg-white shadow-lg rounded-lg border mt-1">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                          value={
                            formData.endDate ? dayjs(formData.endDate) : null
                          }
                          onChange={(date) => handleDateChange(date, "endDate")}
                          minDate={
                            formData.startDate
                              ? dayjs(formData.startDate)
                              : dayjs(new Date())
                          }
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label className={labelClassName}>
                  Event Start Time<span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="w-full">
                <label className={labelClassName}>
                  Event End Time<span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="w-full">
                <label className={labelClassName}>
                  Seats<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="seats"
                  value={formData.seats}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  className={inputClassName}
                  placeholder="Seats"
                />
              </div>

              <div className="w-full md:col-span-1">
                <label className={labelClassName}>
                  Add payments/per person (For free enter 0)
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    USD $
                  </span>
                  <input
                    type="text"
                    name="payment"
                    value={formData.payment}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    className={`${inputClassName} pl-16`}
                  />
                </div>
              </div>
            </div>

            <div className="w-full mt-4">
              <label className={labelClassName}>
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${inputClassName} h-24 sm:h-32 resize-y`}
                placeholder="Enter Description"
                maxLength={1000}
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs sm:text-sm ${
                    formData.description.length > 1000
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {formData.description.length}/1000 characters
                </span>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end mt-4">
              <CustomButton label={"Next"} onClick={handleNext} />
            </div>
          </div>
        </div>
      )}

      {uploadImage && (
        <>
          <div className="mx-auto max-w-7xl p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <div className="w-full sm:flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Role
                  </label>
                  <select
                    id="roleSelect"
                    onChange={handleRoleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Subscription
                  </label>
                  <select
                    id="subscriptionSelect"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    disabled={subscriptionData.length === 0}
                  >
                    <option value="">Select</option>
                    {subscriptionData.map((sub) => (
                      <option
                        key={sub.subscription_id}
                        value={sub.subscription_id}
                      >
                        {sub.subscription_name} (${sub.subscription_price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center sm:justify-start">
                <CustomButton
                  onClick={handleRoleSubscriptionAdd}
                  label={"Add More"}
                />
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 sm:px-4">Role</th>
                      <th className="text-left py-2 px-2 sm:px-4">
                        Subscription
                      </th>
                      <th className="text-right py-2 px-2 sm:px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRoles.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base">
                          {item.role}
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base">
                          {item.subscription}
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-right">
                          <button
                            onClick={() => handleRemoveRole(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X
                              size={16}
                              className="sm:w-5 sm:h-5 md:w-5 md:h-5"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                Upload
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Upload 3 Photo ( First Photo should be banner )
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    {preview ? (
                      <div className="relative h-36 sm:h-40 md:h-48 rounded-lg overflow-hidden">
                        <img
                          src={preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-36 sm:h-40 md:h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        <span className="mt-2 text-xs sm:text-sm text-gray-500 text-center px-2">
                          Click to browse
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-4">
              <CustomButton onClick={handleBack} cancel={true} label={"Back"} />
              <CustomButton onClick={handleSubmit} label={"Submit"} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddNewEvent;
