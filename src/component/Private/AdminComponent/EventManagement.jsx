import React, { useEffect, useState } from "react";
import { UserState } from "../../../context/UserContext";
import {
  Modal,
  ToggleSwitch,
  Label,
  TextInput,
  Datepicker,
  Textarea,
} from "flowbite-react";
import { notify } from "../../../Utiles/Notification";
import axios from "axios";
import Loader from "../../../Utiles/Loader";
import { Calendar, Clock, MapPin, Tag, Hash, Pencil } from "lucide-react";
import CustomButton from "../../../Utiles/CustomButton";
import { useNavigate } from "react-router-dom";
import LocationSelector from "../../../Utiles/LocationSelector";

const inputClassName =
"w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-h-[48px] text-base";
const labelClassName = "block text-base text-gray-800 mb-2";

const EventManagement = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [events, setEvents] = useState([]);
  const { user } = UserState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [addressDetail, setAddressDetail] = useState({});

  const [formData, setFormData] = useState({
    started_date: "",
    ended_date: "",
    started_time: "",
    ended_time: "",
    seats: "",
    payment: "",
    description: "",
    event_title: "",
    event_type: "",
    zip_code :"",
    address:""
  });

  const getEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_upcoming_event_admin`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.status) {
        setEvents(response.data.eventDetails);
      } else {
        setEvents([]);
        notify("error", response.data.message);
      }
    } catch (error) {
      //   notify('error','Unauthorized access please login again');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, [baseUrl, user]);

  const handleStatusChange = async (eventId, currentStatus) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/event_status_update`,
        {
          event_unique_id: eventId,
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
        await getEvents();
      } else {
        notify("error", response?.data?.message || "Status update failed");
      }
    } catch (error) {
      console.error("Error:", error);
      notify("error", error.response?.data?.message || "Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddEvent = () => {
    navigate("/superadmin/add-event");
  };

  const handleEdit = async (event) => {
    setShowEditModal(true);
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/get_single_event_admin`,
        {
          event_unique_id: event?.event_unique_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res.data.status) { 

        setAddressDetail({
          city: { cities_id: res.data.eventDetails?.city_id, name_of_city: res.data.eventDetails?.city_name  },
          country: { country_id: res.data.eventDetails?.country_id, country_name: res.data.eventDetails?.country_name },
          state: {
            state_subdivision_id: res.data.eventDetails?.state_id,
            state_subdivision_name: res.data.eventDetails?.state_name
          },
          zip_code: res.data.eventDetails?.zip_code,
        });

        console.log(res.data.eventDetails);
        

        setFormData({
          started_date: res.data.eventDetails.started_date
            ? new Date(res.data.eventDetails.started_date)
            : new Date(),
          ended_date: res.data.eventDetails.ended_date
            ? new Date(res.data.eventDetails.ended_date)
            : new Date(),
          started_time: res.data.eventDetails.started_time || '00:00',
          ended_time: res.data.eventDetails.ended_time || '00:00',
          seats: res.data.eventDetails.seats || '',
          event_title: res.data.eventDetails.event_title || '',
          event_type: res.data.eventDetails.event_type || '',
          description: res.data.eventDetails.description || '',
          event_price: res.data.eventDetails.event_price || 0,
          zip_code : res.data.eventDetails.zip_code          || '',
          address : res.data.eventDetails.address || ''
        });
        setCurrentEvent(res.data.eventDetails)
      }
    } catch (error) {
      console.log(error);
      notify('error' , "Can't fetch Event Details")
    } finally {
      setLoading(false);
    }
  
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };  

  const handleSaveChanges = async () => {

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/update_event_admin`,
        {
          event_unique_id: currentEvent.event_unique_id,
          started_date: formData.started_date.toISOString().split('T')[0],
          ended_date: formData.ended_date.toISOString().split('T')[0],
          started_time: formData.started_time,
          ended_time: formData.ended_time,
          seats: formData.seats,
          country : selectedCountry?.value,
          state: selectedState?.value,
          city : selectedCity?.value,
          event_price : formData.event_price,
          event_title  : formData.event_title,
          event_type : formData.event_type,
          description : formData.description,
          zip_code : formData.zip_code,
          address : formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        notify("success", "Event updated successfully");
        setShowEditModal(false);
        await getEvents();
      } else {
        notify("error", response?.data?.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      notify("error", error.response?.data?.message || "Error updating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Event Management</h1>
          <CustomButton onClick={handleAddEvent} label={'Add Event'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.upcoming_events_id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    event.eventImages[0]?.event_image ||
                    '/api/placeholder/400/300'
                  }
                  alt={event.event_title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      event.ispaid
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {event.ispaid ? `$${event.event_price}` : 'Free'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition duration-200"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {event.event_title}
                  </h2>
                  <span className="ml-4">
                    <ToggleSwitch
                      checked={event.status === 'Active'}
                      onChange={() =>
                        handleStatusChange(event.event_unique_id, event.status)
                      }
                    />
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      {formatDate(event.started_date)} -{' '}
                      {formatDate(event.ended_date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      {formatTime(event.started_time)} -{' '}
                      {formatTime(event.ended_time)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      {event.city_name}, {event.country_name}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-600">
                      <Tag className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Event Type: {event.event_type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Hash className="w-4 h-4 mr-2 text-gray-500" />
                      <span>ID: {event.event_unique_id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!loading && (
        <Modal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          size="xl"
          popup
        >
          <Modal.Header className="border-b border-gray-200 !p-6">
            <h3 className="text-xl font-medium text-gray-900">
              Edit Event: {currentEvent?.event_title}
            </h3>
          </Modal.Header>
          <Modal.Body className="px-6 py-4">
            <div className="grid gap-6 mb-6">
              {/* Event Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Event Information
                </h4>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Event ID</p>
                    <p className="font-medium">
                      {currentEvent?.event_unique_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Event Type</p>
                    <p className="font-medium">{currentEvent?.event_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium">
                      {currentEvent?.city_name}, {currentEvent?.country_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">
                      {currentEvent?.ispaid
                        ? `$${currentEvent?.event_price}`
                        : 'Free'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <Label htmlFor="event_type" className="mb-2 block">
                      Event Type
                    </Label>
                    <TextInput
                      id="event_type"
                      name="event_type"
                      type="text"
                      value={formData.event_type}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="started_date" className="mb-2 block">
                      Start Date
                    </Label>
                    <Datepicker
                      id="started_date"
                      defaultDate={formData.started_date}
                      onSelectedDateChanged={(date) =>
                        handleDateChange(date, 'started_date')
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="ended_date" className="mb-2 block">
                      End Date
                    </Label>
                    <Datepicker
                      id="ended_date"
                      defaultDate={formData.ended_date}
                      onSelectedDateChanged={(date) =>
                        handleDateChange(date, 'ended_date')
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="seats" className="mb-2 block">
                      Available Seats
                    </Label>
                    <TextInput
                      id="seats"
                      name="seats"
                      type="number"
                      value={formData.seats}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="Number of available seats"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code" className="mb-2 mt-1 block">
                     Zip Code
                    </Label>
                    <TextInput
                      id="zip_code"
                      name="zip_code"
                      type="text"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="Enter Zip Code"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <Label htmlFor="event_title" className="mb-2 block">
                      Event Name
                    </Label>
                    <TextInput
                      id="event_title"
                      name="event_title"
                      type="text"
                      value={formData.event_title}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="started_time" className="mb-2 block">
                      Start Time
                    </Label>
                    <TextInput
                      id="started_time"
                      name="started_time"
                      type="time"
                      value={formData.started_time}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="ended_time" className="mb-2 block">
                      End Time
                    </Label>
                    <TextInput
                      id="ended_time"
                      name="ended_time"
                      type="time"
                      value={formData.ended_time}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="ended_time" className="mb-[0.3rem] block">
                      Price/per person{' '}
                      <span className="text-[11px] text-gray-400">
                        0 for Free Event
                      </span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        USD $
                      </span>
                      <input
                        type="text"
                        name="event_price"
                        value={formData?.event_price}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                        className="w-full sm:w-[14.5rem] border border-gray-300 rounded-md bg-gray-100/35 pl-16"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="mb-2 block">
                     Address
                    </Label>
                    <TextInput
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="Address"
                    />
                  </div>
                </div>
              </div>

              <LocationSelector
                data={addressDetail}
                selectedCountry={selectedCountry}
                selectedState={selectedState}
                selectedCity={selectedCity}
                onCountryChange={setSelectedCountry}
                onStateChange={setSelectedState}
                onCityChange={setSelectedCity}
                className=""
                labelClass={labelClassName}
                inputClass="border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <div>
                <Label htmlFor="seats" className="mb-2 block">
                  Available Seats
                </Label>
                <TextInput
                  id="seats"
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Number of available seats"
                />
              </div>

              <div className="w-full mt-4">
                <label className={labelClassName}>
                  Description (0/1000 Words)
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="description"
                  value={formData?.description}
                  className={`${inputClassName} h-24 sm:h-32 resize-y`}
                  placeholder="Enter Description"
                  onChange={handleInputChange}
                  maxLength={1000}
                />
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs sm:text-sm ${
                      formData?.description?.length > 1000
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {formData?.description?.length}/1000 characters
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <CustomButton
                onClick={() => setShowEditModal(false)}
                cancel={true}
                label={'Cancel'}
              />
              <CustomButton
                onClick={handleSaveChanges}
                label={'Save Changes'}
              />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default EventManagement;
