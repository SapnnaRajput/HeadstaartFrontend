import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Filter,
  X,
  ArrowUpDown,
  Share2,
  Heart,
} from "lucide-react";
import FeatureProjectImg from "../../Assets/Images/FeatureProject.png";
import { UserState } from "../../context/UserContext";
import { notify } from "../../Utiles/Notification";
import axios from "axios";
import Loader from "../../Utiles/Loader";
import SelectDropdown from "../../Utiles/SelectDropdown";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../routes/firebaseConfig";

const FilterBox = ({ isOpen, onClose, onFilterApply }) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [loading, setLoading] = useState(false);
  const { user } = UserState();
  const [categories, setCategories] = useState([]);
  const [businessStages, setBusinessStages] = useState([
    {
      business_stage_id: "All",
      business_stage_name: "All",
      label: "All",
      value: "All",
    },
  ]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedStudentType, setSelectedStudentType] = useState();
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [fundingRange, setFundingRange] = useState({
    min: 10000,
    max: 500000,
  });
  const defaultCountryOption = { value: "All", label: "All Countries" };
  const [zipcode, setZipcode] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

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
      setLoading(false);
    };

    const businessStage = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get_business_stage`);
        if (response.data.status) {
          const formattedStages = response.data.business_stages.map(
            (stage) => ({
              value: stage.business_stage_id,
              label: stage.business_stage_name,
              ...stage,
            })
          );
          const updatedStages = [
            {
              business_stage_id: "All",
              business_stage_name: "All",
              label: "All",
              value: "All",
            },
            ...formattedStages,
          ];

          setBusinessStages(updatedStages);
          if (formattedStages.length > 0) {
            setSelectedStage(businessStages[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching business stages:", error);
      }
    };

    const getFilterCountries = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getAllCountries`);
        if (response.data.status) {
          const formattedCountries = response.data.allCountries.map(
            (country) => ({
              value: country.country_id,
              label: country.country_name,
              ...country,
            })
          );
          setCountries([defaultCountryOption, ...formattedCountries]);
          setSelectedCountry(countries[0]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        notify("error", "Failed to fetch countries");
      }
    };

    if (isOpen) {
      getCategory();
      businessStage();
      getFilterCountries();
    }
  }, [isOpen, baseUrl]);

  useEffect(() => {
    const getStates = async () => {
      if (selectedCountry) {
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
          notify("error", "Failed to fetch states");
        }
      } else {
        setStates([]);
        setSelectedState(null);
      }
    };

    getStates();
  }, [selectedCountry]);

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

  if (!isOpen) return null;

  const getStudentValue = (studentType) => {
    switch (studentType) {
      case "Students":
        return 1;
      case "Non-Students":
        return 0;
      case "All":
      default:
        return "All";
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const isMin = e.target.name === "min";

    setFundingRange((prev) => ({
      min: isMin ? Math.min(value, prev.max) : prev.min,
      max: isMin ? prev.max : Math.max(value, prev.min),
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
  };

  const applyFilterChange = async () => {
    setLoading(true);
    try {
      const filterData = {
        category_id: selectedIndustry?.value,
        business_stage_id: selectedStage?.value,
        student: selectedStudentType?.value,
        country: selectedCountry?.value,
        state: selectedState?.value,
        zipcode: zipcode,
        fundamount_min: fundingRange.min.toString(),
        fundamount_max: fundingRange.max.toString(),
      };

      const response = await axios.post(
        `${baseUrl}/filter_project_agent`,
        filterData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        notify("success", response.data.message);
        onFilterApply(response.data.projects);
        onClose();
      } else {
        notify("error", response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      notify(
        "error",
        error.response?.data?.message ||
          "Unauthorized access, please login again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="fixed inset-0 top-16 bg-black bg-opacity-50 z-40 flex items-center justify-center">
        <div className="relative bg-white rounded-lg w-full max-w-md mx-4 h-[70vh] flex flex-col">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Refine Projects to Match Your Interests
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
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
                <label className="text-sm font-medium">
                  Student Or Non-Students
                </label>
                <SelectDropdown
                  value={selectedStudentType}
                  onChange={setSelectedStudentType}
                  options={[
                    { value: "All", label: "All" },
                    { value: 0, label: "Non-Students" },
                    { value: 1, label: "Students" },
                  ]}
                  placeholder="Select Status"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Status</label>
                <SelectDropdown
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={[
                    { value: "All", label: "All" },
                    { value: "false", label: "non Verified" },
                    { value: "true", label: "Verified" },
                  ]}
                  placeholder="Select Status"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Business Stage</label>
                <SelectDropdown
                  value={selectedStage}
                  onChange={setSelectedStage}
                  options={businessStages}
                  placeholder="Select Business Stage"
                  isLoading={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <SelectDropdown
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  options={countries}
                  placeholder="Select Country"
                  isLoading={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <SelectDropdown
                  value={selectedState}
                  onChange={setSelectedState}
                  options={states}
                  placeholder="Select State"
                  isLoading={loading}
                />
              </div>

              <div className="flex-grow">
                <input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter Zipcode"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Funding Amount Range
                </label>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatCurrency(fundingRange.min)}</span>
                    <span>{formatCurrency(fundingRange.max)}</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="absolute h-2 bg-indigo-600 rounded"
                        style={{
                          left: `${(fundingRange.min / 20000000) * 100}%`,
                          right: `${
                            100 - (fundingRange.max / 20000000) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <input
                      type="range"
                      name="min"
                      min="0"
                      max="20000000"
                      value={fundingRange.min}
                      onChange={handleRangeChange}
                      className="absolute w-full h-2 opacity-0 cursor-pointer"
                    />
                    <input
                      type="range"
                      name="max"
                      min="0"
                      max="20000000"
                      value={fundingRange.max}
                      onChange={handleRangeChange}
                      className="absolute w-full h-2 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t">
            <button
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={applyFilterChange}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ShareModal = ({ isOpen, onClose, users, project }) => {
  const { user } = UserState();
  if (!isOpen) return null;
  const navigate = useNavigate();

  const handleShare = async (userShare) => {
    const messageToSend = `Check out this project: ${project.project_unique_id}`;
    const stringChatId = String(userShare.chat_initiate_id);

    try {
      await addDoc(collection(db, "headstaart", stringChatId, "messages"), {
        text: messageToSend,
        status: "sent",
        reciver_unique_id: userShare.receiver_unique_id,
        sender_unique_id: user?.customer?.customer_unique_id,
        timestamp: new Date(),
      });

      navigate(`/agent/messages/${userShare.chat_initiate_id}`);
      onClose();
    } catch (error) {
      console.error("Error sending share message:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Share with</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {users.map((userShare) => (
            <div
              key={userShare.chat_initiate_id}
              className="p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer border-b border-gray-100"
            >
              <div className="flex-shrink-0">
                <img
                  src={userShare.reciver_profile_image}
                  alt={userShare.receiver_full_name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate capitalize">
                  {userShare.receiver_full_name}
                </h4>
                <p className="text-sm text-gray-500 truncate capitalize">
                  {userShare.project?.title}
                </p>
              </div>

              <button
                onClick={() => handleShare(userShare)}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 flex-shrink-0"
              >
                Share
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FeaturedProjects() {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const { user } = UserState();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [chats, setChats] = useState([]);
  const FetchProject = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_agent_browse_projects`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.status) {
        setProjects(response.data.projectDetails);
      }
    } catch (error) {
      notify("error", "Unauthorized access please login again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchProject();
  }, [baseUrl]);

  const handleFilterApply = (filteredProjects) => {
    setProjects(filteredProjects);
    setIsFiltered(true);
  };

  const handleClearFilter = () => {
    FetchProject();
    setIsFiltered(false);
  };

  const handleShare = async (project) => {
    setSelectedProject(project);
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_chat_user_list`,
        { customer_unique_id: user?.customer?.customer_unique_id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.data.status) {
        setChats(response.data.chat_user_data);
        setIsShareModalOpen(true);
      }
    } catch (error) {
      // notify('error', 'Unauthorized access. Please log in again.');
    }
    setLoading(false);
  };

  //   const handleSaveProject = async (project_unique_id , ) => {
  //     setLoading(true);
  //     try {
  //         const response = await axios.post(
  //             `${baseUrl}/save_unsave_projects`,
  //             {
  //                 project_unique_id,
  //                 action: !projectData.isSaved,
  //                 customer_unique_id: user?.customer?.customer_unique_id,
  //             },
  //             {
  //                 headers: {
  //                     Authorization: `Bearer ${user?.token}`,
  //                 },
  //             }
  //         );

  //         if (response.data.status) {
  //             // fetchSingleProject()
  //             notify('success', response.data.message);
  //         } else {
  //             notify('error', response.data.message);
  //         }
  //     } catch (error) {
  //         notify('error', error.message);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  return (
    <>
      {loading && <Loader />}
      <div className="px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">Featured Projects</h2>
          <div className="flex gap-2 sm:gap-3">
            {isFiltered && (
              <button
                onClick={handleClearFilter}
                className="bg-red-100 text-red-600 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md flex items-center gap-1 sm:gap-2 hover:bg-red-200"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                Clear Filter
              </button>
            )}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-indigo-600 text-white px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md flex items-center gap-1 sm:gap-2 hover:bg-indigo-700"
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              Filter By
            </button>
            {/* <button className="bg-white text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 border border-gray-200 hover:bg-gray-50">
        <ArrowUpDown className="h-4 w-4" />
        Sort By
      </button> */}
          </div>
          <FilterBox
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterApply={handleFilterApply}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {projects.map((project) => (
            <div
              key={project.project_id}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              <div className="relative">
                <Link
                  to={`details?projectId=${project.project_unique_id}&flagged_by=${project.flaggedBy}`}
                  className="rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center transition-colors"
                >
                  <img
                    src={
                      project.medias.length > 0
                        ? project.medias[0].media_link
                        : FeatureProjectImg
                    }
                    alt={project.title}
                    className="w-full h-32 sm:h-48 object-cover"
                  />
                </Link>
                {/* <button
            onClick={() => handleSaveProject(project.project_unique_id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                project?.isSaved
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-800'
              }`}
            />
          </button> */}
              </div>
              <div className="p-3 sm:p-6 flex-grow flex flex-col">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-3 flex-grow">
                  {project.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-gray-100">
                  <div className="text-xs sm:text-sm">
                    <span className="font-semibold text-green-500">
                      ${project.fund_amount}
                    </span>{" "}
                    <span className="text-gray-600 truncate">
                      for{" "}
                      {project.sell_type === "Sell Stake" ? (
                        `${project.equity}% equity`
                      ) : (
                        <>
                          Business Sale{" "}
                          <span className="text-green-500 font-semibold">
                            100%
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex gap-1 sm:gap-2 ml-1 sm:ml-2 flex-shrink-0">
                    <button
                      onClick={() => handleShare(project)}
                      className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center transition-colors"
                      aria-label="Share project"
                    >
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                    </button>
                    <Link
                      to={`details?projectId=${project.project_unique_id}&flagged_by=${project.flaggedBy}`}
                      className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center transition-colors"
                    >
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        users={chats}
        project={selectedProject}
      />
    </>
  );
}
