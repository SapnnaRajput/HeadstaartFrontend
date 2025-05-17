import {
  Calendar,
  Calendar1,
  Calendar1Icon,
  ChartNoAxesColumnIncreasing,
  CheckCircle,
  Clock,
  Clock1,
  Crown,
  Files,
  FileText,
  Heart,
  Hourglass,
  Plus,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import img from "../../../Assets/Images/event.png";
import CustomButton from "../../../Utiles/CustomButton";
import { UserState } from "../../../context/UserContext";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d";
import { Link } from "react-router-dom";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SelectDropdown from "../../../Utiles/SelectDropdown";
import ProfileBoost from './ProfileBoost';

Highcharts3D(Highcharts);

const Dashboard = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;

  const [loading, setLoading] = useState(false);
  const { user, logout } = UserState();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [agents, setAgents] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [project, setProject] = useState([]);
  const [events, setEvents] = useState([]);
  const [countStatus, setCountStatus] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const postData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/get_saved_projects `,
          {
            customer_unique_id: user?.customer?.customer_unique_id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setProject(response.data.projectDetails);
        } else {
          setProject([]);
        }
      } catch (error) {
        notify("error", "Unauthorized access please login again");
      } finally {
        setLoading(false);
      }
    };

    const getRegisterEvent = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/get_event_data `,
          {
            customer_unique_id: user?.customer?.customer_unique_id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setEvents(response.data.eventdata);
        } else {
          setEvents([]);
        }
      } catch (error) {
        notify("error", "Unauthorized access please login again");
      } finally {
        setLoading(false);
      }
    };

    const dashboardCount = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/dashboard `,
          {
            customer_unique_id: user?.customer?.customer_unique_id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setCountStatus(response.data.data);
        }
      } catch (error) {
        notify("error", "Unauthorized access please login again");
      } finally {
        setLoading(false);
      }
    };
    dashboardCount();
    getRegisterEvent();

    if (user.role == "investor") {
      postData();
    }
  }, [baseUrl, user]);

  useEffect(() => {
    const getCategory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/get_category`);
        if (response.data.status) {
          const formattedCategories = response.data.category.map((cat) => ({
            value: cat.category_id,
            label: cat.category_name,
            ...cat,
          }));
          setCategories(formattedCategories);
          if (formattedCategories.length > 0) {
            setSelectedIndustry(formattedCategories[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const getFilterCountries = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getAllCountries`);
        if (response.data.status) {
          const formattedCountries = [
            { value: "all", label: "All Countries" },
            ...response.data.allCountries.map((country) => ({
              value: country.country_id,
              label: country.country_name,
              ...country,
            })),
          ];
          setCountries(formattedCountries);
          setSelectedCountry(formattedCountries[0]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      getCategory();
      getFilterCountries();
    }
  }, [isOpen, baseUrl]);

  useEffect(() => {
    const getStates = async () => {
      if (selectedCountry && selectedCountry.value !== "all") {
        setLoadingStates(true);
        try {
          const response = await axios.get(
            `${baseUrl}/getState/${selectedCountry.value}`
          );
          if (response.data.status) {
            const formattedStates = response.data.states.map((state) => ({
              value: state.state_subdivision_id,
              label: state.state_subdivision_name,
              ...state,
            }));
            setStates(formattedStates);
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        } finally {
          setLoadingStates(false);
        }
      } else {
        setStates([]);
        setSelectedState(null);
      }
    };

    getStates();
  }, [selectedCountry, baseUrl]);

  const handleApplyFilter = async () => {
    try {
      setLoading(true);

      let verificationStatus;
      if (selectedStatus === "All") {
        verificationStatus = "All";
      } else if (selectedStatus === "true") {
        verificationStatus = true;
      } else {
        verificationStatus = false;
      }

      const filterData = {
        category_id: selectedIndustry?.value || null,
        is_verified: verificationStatus,
        country_id: selectedCountry?.value || null,
        state_id: selectedState?.value || null,
        zipcode: selectedCountry?.value === "all" ? zipcode : null,
      };

      const response = await axios.post(`${baseUrl}/filter_agent`, filterData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        setAgents(response.data.filter_agent);
        navigate(`/${user.role}/map/filter_agent`, {
          state: { agents: response.data.filter_agent },
        });
      } else if (!response.data.status) {
        notify("error", response.data.message);
      }
    } catch (error) {
      console.error("Error filtering agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const percentageRemaining = (countStatus.remainingDays / 365) * 100;

  // CORRECTED DATE CALCULATION
  const expiryDate = new Date();
  expiryDate.setTime(Date.now() + countStatus.remainingDays * 86400000);

  const formattedDate = expiryDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {loading && <Loader />}
      <div className="container mx-auto p-3 sm:p-4 md:p-6 bg-white rounded-xl">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center mb-6">
          <h1 className="text-xl font-semibold text-[#05004E]">Overview</h1>

          {user.role === "entrepreneur" && (
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/${user.role}/map/filter_agent`}
                className="whitespace-nowrap px-4 py-2.5 text-base font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                Find agent
              </Link>
              <Link
                to={`/${user.role}/manage_lead`}
                onClick={() => setIsOpen(true)}
                className="whitespace-nowrap px-4 py-2.5 text-base font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                Manage Lead
              </Link>
              <Link
                to={`/${user.role}/boost-profile`}
                onClick={() => setIsOpen(true)}
                className="whitespace-nowrap px-4 py-2.5 text-base font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                Boost Profile
              </Link>
            </div>
          )}

          {user.role === "investor" && (
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/${user.role}/manage_lead`}
                onClick={() => setIsOpen(true)}
                className="whitespace-nowrap px-4 py-2.5 text-base font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                Manage Lead
              </Link>
              <Link
                to={`/${user.role}/map/filter_agent`}
                className="whitespace-nowrap px-4 py-2.5 text-base font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                Find agent
              </Link>
              <Link
                to="/investor/feature-projects"
                className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-[#4A3AFF] text-white text-base capitalize flex items-center gap-2"
              >
                Browse Projects
              </Link>
            </div>
          )}

          {user.role === "agent" && (
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/${user.role}/manage_lead`}
                onClick={() => setIsOpen(true)}
                className="whitespace-nowrap px-4 py-2.5 text-base font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                Manage Lead
              </Link>
              <Link
                to={`/${user.role}/boost-profile`}
                onClick={() => setIsOpen(true)}
                className="whitespace-nowrap px-4 py-2.5 text-base font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                Boost Profile
              </Link>
              <Link
                to="/agent/feature-projects"
                className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-[#4A3AFF] text-white text-base capitalize flex items-center gap-2"
              >
                Browse Projects
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link>
            <div className="rounded-xl bg-[#FFE2E5] flex flex-col p-4 gap-4">

              <div className="bg-[#FA5A7D] rounded-full p-2 text-white w-fit">
                <ChartNoAxesColumnIncreasing size={24} />
              </div>
              <h1 className="font-semibold text-xl md:text-2xl text-[#151D48]">
                {countStatus.activeProject}
              </h1>
              <span className="text-base md:text-lg font-medium text-[#425166]">
                Active Project
              </span>
            </div>
          </Link>
          <div className="rounded-xl bg-[#FFF4DE] flex flex-col p-4 gap-4">
            <div className="bg-[#FF947A] rounded-full p-2 text-white w-fit">
              <Hourglass size={24} />
            </div>
            <h1 className="font-semibold text-xl md:text-2xl text-[#151D48]">
              {countStatus.leadProgress}
            </h1>
            <span className="text-base md:text-lg font-medium text-[#425166]">
              Lead progress
            </span>
          </div>

          <div className="rounded-xl bg-[#DCFCE7] flex flex-col p-4 gap-4">
            <div className="bg-[#3CD856] rounded-full p-2 text-white w-fit">
              <FileText size={24} />
            </div>
            <h1 className="font-semibold text-xl md:text-2xl text-[#151D48]">
              {countStatus.leadconversion}
            </h1>
            <span className="text-base md:text-lg font-medium text-[#425166]">
              Lead Conversion
            </span>
          </div>
          <Link to={`/${user?.role}/documents`}>
            <div className="rounded-xl bg-[#E0F2FE] p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base md:text-lg font-medium text-[#425166]">
                  Documents
                </span>
                <div className="bg-[#3B82F6] rounded-full p-2 text-white">
                  <Files size={20} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-2 md:p-3">
                  <div className="flex items-center gap-1 md:gap-2 mb-2">
                    <Clock1 className="text-[#3B82F6] w-4 h-4" />
                    <span className="text-xs md:text-sm font-medium text-[#425166]">
                      Pending
                    </span>
                  </div>
                  <span className="text-lg md:text-xl font-semibold text-[#151D48]">
                    {countStatus.documentPending}
                  </span>
                </div>

                <div className="bg-white rounded-lg p-2 md:p-3">
                  <div className="flex items-center gap-1 md:gap-2 mb-2">
                    <CheckCircle className="text-green-500 w-4 h-4" />
                    <span className="text-xs md:text-sm font-medium text-[#425166]">
                      Signed
                    </span>
                  </div>
                  <span className="text-lg md:text-xl font-semibold text-[#151D48]">
                    {countStatus.documentSigned}
                  </span>
                </div>
              </div>
            </div>
          </Link>
          {countStatus.remainingDays > 0 && (
            <Link to={`/${user?.role}/subscription`}>
              <div className="rounded-xl bg-[#F3E8FF] p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#9333EA] rounded-full p-2 text-white">
                      <Crown size={20} />
                    </div>
                    <span className="text-base md:text-lg font-medium text-[#425166]">
                      {countStatus.subscription.subscription_name}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm bg-[#9333EA] text-white px-2 md:px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs md:text-sm font-medium text-[#425166]">
                        Subscription ends in
                      </span>
                      <span className="text-xs md:text-sm font-semibold text-[#151D48]">
                        {formattedDate}
                      </span>
                    </div>
                    <div className="w-full bg-[#E9D5FF] rounded-full h-2">
                      <div
                        className="bg-[#9333EA] h-2 rounded-full"
                        style={{ width: `${percentageRemaining}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar1 className="text-[#9333EA] w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm font-medium text-[#425166]">
                        Days Remaining
                      </span>
                    </div>
                    <span className="text-lg md:text-xl font-semibold text-[#151D48]">
                      {countStatus.remainingDays}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {events.length > 0 && (
        <div className="p-4 sm:p-6  container mx-auto md:p-8 bg-gray-50">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 md:mb-8 text-gray-800">
            Registered Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {events.map((event) => (
              <div
                key={event.registration_code}
                className="group bg-white rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full flex flex-col"
              >
                <div className="p-4 sm:p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start sm:items-center mb-4">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors pr-2 line-clamp-1">
                      {event.event_title}
                    </h3>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${event.event_price === "0"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {event.event_price === "0"
                        ? "Free"
                        : `$${event.event_price}`}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">
                        Start: {formatDate(event.started_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">
                        End: {formatDate(event.ended_date)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full mr-1"></span>
                      <span className="truncate pr-2">{event.event_type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                      <span className="truncate pl-2">{event.event_range}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.role === "investor" && project.length > 0 && (
        <div className="container rounded-xl p-6 bg-white mt-5">
          <h1 className="text-xl font-semibold mb-6 text-[#05004E]">
            Saved Projects
          </h1>
          <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
            {project?.map((project) => (
              <div
                key={project.project_unique_id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer h-full flex flex-col"
                onClick={() =>
                  navigate(`/investor/projects/${project.project_unique_id}`)
                }
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="relative">
                    <img
                      src={
                        project.projectMedia?.find(
                          (media) => media.media_type === "photo"
                        )?.media_link || "/fallback-image.jpg"
                      }
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-xl mb-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-image.jpg";
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-medium text-gray-900 line-clamp-1">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="line-clamp-1">{project.company_name}</span>
                    <span className="font-medium">${project.fund_amount}</span>
                  </div>

                  <div className="mt-auto pt-3 flex justify-between text-sm text-gray-500 border-t border-gray-100 mt-2">
                    <span className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Equity {project.equity}%
                    </span>
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {project.view_count} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Find Agent</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <SelectDropdown
                  value={selectedIndustry}
                  onChange={setSelectedIndustry}
                  options={categories}
                  placeholder="Select Industry"
                  isLoading={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Verified Or not</label>
                <SelectDropdown
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={[
                    { value: "All", label: "All" },
                    { value: "true", label: "Verified" },
                    { value: "false", label: "Unverified" },
                  ]}
                  placeholder="Select Status"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <SelectDropdown
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  options={countries}
                  placeholder="Select Country"
                  isLoading={loading}
                />
              </div>
              {selectedCountry && selectedCountry.value !== "all" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <SelectDropdown
                    value={selectedState}
                    onChange={setSelectedState}
                    options={states}
                    placeholder="Select State"
                    isLoading={loadingStates}
                  />
                </div>
              )}
              {selectedCountry && selectedCountry.value === "all" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Zipcode</label>
                  <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter Zipcode"
                  />
                </div>
              )}

              <button
                onClick={handleApplyFilter}
                className="w-full bg-[#4A3AFF] text-white py-3 rounded-xl mt-4"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
