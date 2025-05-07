import React, { useEffect, useRef, useState } from "react";
import {
  Filter,
  RotateCcw,
  Building2,
  MapPin,
  Gauge,
  DollarSign,
  Globe,
  User,
} from "lucide-react";
import Content from "../../../Assets/Images/content1.png";
import { UserState } from "../../../context/UserContext";
import axios from "axios";
import LocationSelector from "../../../Utiles/LocationSelector";
import Pagination from "../../../Utiles/Pagination";
import Loader from "../../../Utiles/Loader";
import { Link } from "react-router-dom";
import SelectDropdown from "../../../Utiles/SelectDropdown";

function ContentModeration() {
  const tabs = [
    { id: "all", label: "All Projects" },
    { id: "entrepreneur", label: "Entrepreneur Flag Projects" },
    { id: "investor", label: "Investor Flag Projects" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [loading, setLoading] = useState(false);
  const { user } = UserState();

  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [ctg, setCtg] = useState(null);
  const [status, setStatus] = useState(null);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [selectedStudentType, setSelectedStudentType] = useState();
  const [zipCode, setZipCode] = useState("");
  const timerRef = useRef(null);
  const [data, setData] = useState([]);

  const fetchSingleProject = async () => {
    console.log(selectedStudentType?.value);

    try {
      const response = await axios.post(
        `${baseUrl}/get_all_project_admin`,
        {
          type: activeTab,
          min_date: min,
          max_date: max,
          category_id: ctg?.value,
          country_id: country?.value,
          state_id: state?.value,
          city_city: city?.value,
          status: status?.value,
          student_type: selectedStudentType?.value,
          zipcode: zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setData(response.data.projectDetails);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      fetchSingleProject();
    }, 800);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    activeTab,
    ctg,
    country,
    state,
    city,
    status,
    min,
    max,
    selectedStudentType,
    zipCode,
  ]);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentSeries = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / 10);

  const handleResetFilter = () => {
    setCountry(null);
    setState(null);
    setCity(null);
    setMin(null);
    setMax(null);
    setCtg(null);
    setStatus(null);
    setSelectedStudentType(null);
    setZipCode("");
  };

  const getType = (image) => {
    if (image == null) {
      return "";
    } else {
      return image.split(".").pop();
    }
  };

  return (
    <>
      {loading && <Loader />}
      <h1 className="container mx-auto my-3 font-semibold text-2xl">
        Content Moderation and Approval
      </h1>

      <div className="container mx-auto p-4">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-2 py-2 text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-all duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-4 bg-white gap-4 p-4  border border-gray-200 rounded-lg">
        <div className="">
          <LocationSelector
            date={true}
            ctg={true}
            status={true}
            onMinChange={setMin}
            selectedMin={min}
            onMaxChange={setMax}
            selectedMax={max}
            onCategoryChange={setCtg}
            selectedCategory={ctg}
            onStatusChange={setStatus}
            selectedStatus={status}
            selectedCountry={country}
            selectedState={state}
            selectedCity={city}
            onCountryChange={setCountry}
            onStateChange={setState}
            onCityChange={setCity}
            className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-2 gap-5 w-full"
            labelClass="hidden"
            inputClass="w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 mt-3 gap-4">
          {activeTab != "investor" && (
            <SelectDropdown
              value={selectedStudentType}
              onChange={setSelectedStudentType}
              options={[
                { value: "All", label: "All" },
                { value: 0, label: "Non-Students" },
                { value: 1, label: "Students" },
              ]}
              placeholder="Select Student Type"
            />
          )}
          <input
            name="fundingAmount"
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value);
            }}
            type="text"
            placeholder="Zip Code"
            className="w-full px-4 h-10 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleResetFilter}
            className="flex gap-2  text-red-600 hover:text-red-700 text-nowrap "
          >
            <RotateCcw size={20} />
            <span>Reset Filter</span>
          </button>
        </div>
      </div>
      <div className="p-6 container mx-auto bg-white border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentSeries.map((company, index) => (
            <div
              key={index}
              className="bg-white flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <Link
                to={`${company.project_unique_id}`}
                className="relative line-clamp-1"
              >
                <img
                  src={company.image}
                  alt={company.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {company.status}
                  </span>
                </div>
              </Link>

              <div className="p-4 flex flex-col flex-grow gap-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-3">
                  {company.title}
                </h3>

                <Link
                  to={`${company.project_unique_id}`}
                  className="flex flex-col gap-3"
                >
                  <div className="flex  items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{company.category?.category_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {company.city?.city_name}, {company.state?.state_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Gauge className="w-4 h-4" />
                    <span>{company.stage?.business_stage_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {company.fund_amount} for {company.equity}% Equity
                    </span>
                  </div>
                  <Link
                    to={`/superadmin/user-manager/${company.customer_unique_id}`}
                  >
                    <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                      <User className="w-4 h-4" />
                      <span className="cursor-pointer hover:text-blue-600 hover:underline">
                        {company.customer_name}
                      </span>
                    </div>
                  </Link>
                </Link>
                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-start gap-2 text-gray-600">
                    <Globe className="w-4 h-4 mt-1 flex-shrink-0" />
                    <a
                      href={company.website_name}
                      target="_blank"
                      className="text-sm"
                    >
                      {company.website_name}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {currentSeries.length == 0 && (
          <div className="flex justify-center">
            <h1>Project Not Available</h1>
          </div>
        )}
        {data.length > 10 && (
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
}

export default ContentModeration;
