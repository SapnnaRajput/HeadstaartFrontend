import { useState, useEffect } from "react";
import { ArrowUpRight, Filter, X, ArrowUpDown, Flag } from "lucide-react";
import FeatureProjectImg from "../../../Assets/Images/FeatureProject.png";
import { UserState } from "../../../context/UserContext";
import { notify } from "../../../Utiles/Notification";
import axios from "axios";
import Loader from "../../../Utiles/Loader";
import SelectDropdown from "../../../Utiles/SelectDropdown";
import { Link } from "react-router-dom";

const baseUrl = import.meta.env.VITE_APP_BASEURL;

const FilterBox = ({ isOpen, onClose, onFilterApply }) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [loading, setLoading] = useState(false);
  const { user } = UserState();
  const [categories, setCategories] = useState([]);
  const [businessStages, setBusinessStages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedStudentType, setSelectedStudentType] = useState("All");
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
          setBusinessStages(formattedStages);
          if (formattedStages.length > 0) {
            setSelectedStage(formattedStages[0]);
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
        student: selectedStatus.value,
        country: selectedCountry?.value,
        state: selectedState?.value,
        zipcode: zipcode,
        fundamount_min: fundingRange.min.toString(),
        fundamount_max: fundingRange.max.toString(),
      };

      const response = await axios.post(
        `${baseUrl}/filter_project_investor`,
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
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={[
                    { value: "All", label: "All" },
                    { value: 0, label: "Non-Students" },
                    { value: 1, label: "Students" },
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

export default function FeaturedProjects() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const { user } = UserState();

  const FetchProject = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_investor_projects`, {
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

  const handleFlagUnflag = (isFlag, projectId) => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/flag_or_unflag_project`,
        {
          project_unique_id: projectId,
          type: isFlag ? "false" : "true",
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        await FetchProject();

        notify(
          "success",
          isFlag
            ? "Project unflagged successfully"
            : "Project flagged successfully"
        );
        window.location.reload();
      } else {
        notify(
          "error",
          response.data.message || "Failed to update flag status"
        );
      }
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message ||
          "An error occurred while updating flag status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <div className="flex gap-3">
            {isFiltered && (
              <button
                onClick={handleClearFilter}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-200"
              >
                <X className="h-4 w-4" />
                Clear Filter
              </button>
            )}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
            >
              <Filter className="h-4 w-4" />
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

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.project_id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div
                      onClick={handleFlagUnflag(
                        project.isFlag,
                        project.project_unique_id
                      )}
                      className="cursor-pointer bg-white/90 p-2 rounded-full"
                      role="button"
                      tabIndex={0}
                    >
                      <Flag
                        className="h-6 w-6 text-gray-500"
                        fill={project.isFlag ? "#4A3AFF" : "none"}
                        color={project.isFlag ? "#4A3AFF" : "currentColor"}
                      />
                    </div>
                  </div>
                  <img
                    src={
                      project.medias.length > 0
                        ? project.medias[0].media_link
                        : FeatureProjectImg
                    }
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-3 capitalize">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="text-base">
                    <span className="font-semibold text-green-500">
                      ${project.fund_amount}
                    </span>{" "}
                      <span className="text-gray-600">
                        {project.sell_type === "Sell Stake"
                          ? `for ${project.equity}% equity`
                          : ""}
                      </span>
                    </div>
                    <Link
                      to={`/investor/projects/${project.project_unique_id}`}
                      className="bg-white/90 rounded-full hover:bg-white"
                    >
                      <ArrowUpRight className="h-8 w-8 text-indigo-600" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
