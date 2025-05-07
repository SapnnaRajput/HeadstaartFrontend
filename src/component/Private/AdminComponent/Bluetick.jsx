import React, { useEffect, useRef, useState } from "react";
import { UserState } from "../../../context/UserContext";
import axios from "axios";
import Filter from "../../../Utiles/Filter";
import { notify } from "../../../Utiles/Notification";
import { Link } from "react-router-dom";
import Loader from "../../../Utiles/Loader";
import { Modal, TextInput } from "flowbite-react";
import { Eye } from "lucide-react";
import LocationSelector from "../../../Utiles/LocationSelector";

const Bluetick = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const tabs = ["all", "investor"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [data, setData] = useState([]);
  const [dataInvest, setDatainvest] = useState([]);
  const [userActivity, setUserActivity] = useState("");
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const timerRef = useRef(null);
  const [search, setSerch] = useState("");
  const [to, setTo] = useState();
  const [from, setFrom] = useState();
  const [openModal, setOpenModal] = useState(false);

  const dateFormate2 = (startDate) => {
    const start = new Date(startDate);

    const formatDate = (date) => {
      const day = date.getDate();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${month}-${day}`;
    };

    return `${start.getFullYear()}-${formatDate(start)}`;
  };

  const getAll = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_bluetick_verify_request_admin`,
        {
          min_date: from ? dateFormate2(from) : null,
          max_date: to ? dateFormate2(to) : null,
          status: userActivity,
          country_id: country?.value,
          state_id: state?.value,
          city_city: city?.value,
          zip_code : zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        setData(response.data.BlueTickData);
      } else {
        setData([]);
      }
    } catch (error) {
      notify("error", error.message);
    }
    setLoading(false);
  };

  const getAllinvest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_fund_verify_request_admin`,
        {
          min_date: from ? dateFormate2(from) : null,
          max_date: to ? dateFormate2(to) : null,
          status: userActivity,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        setDatainvest(response.data.FundDetail);
      } else {
        setDatainvest([]);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {   
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      getAllinvest();
      getAll();
    }, 800); 
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [from, to, userActivity, country, state, city, zipCode]);

  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = (activeTab === "investor" ? dataInvest : data)
    .filter((product) => activeTab === "all" || product.role === activeTab)
    .filter(
      (product) =>
        product.customer_unique_id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.full_name.toLowerCase().includes(search.toLowerCase()) ||
        product.email.toLowerCase().includes(search.toLowerCase())
    );

  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentSeries = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProducts.length / 10);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-[#E7F7EF] text-[#00B627]";
      case "decliend":
        return "bg-[#FFF0E6] text-[#FE964A]";
      case "pending":
        return "bg-yellow-100 text-yellow-500";
      default:
        return "text-gray-300";
    }
  };

  const dateFormate = (startDate) => {
    const start = new Date(startDate);

    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      return `${month} ${day}`;
    };

    return `${formatDate(start)}, ${start.getFullYear()}`;
  };

  return (
    <>
      {loading && <Loader />}
      <div className="p-5">
        <div className="flex flex-row gap-5">
          <select
            value={userActivity}
            onChange={(e) => setUserActivity(e.target.value)}
            className="px-3 py-2.5 h-fit border rounded-md w-48 text-sm"
          >
            <option value="">Select</option>
            <option value="Pending">Pending</option>
            <option value="Decliend">Decliend</option>
            <option value="Approved">Approved</option>
          </select>
          <div className="flex">
          <Filter
            search={search}
            setSerch={setSerch}
            to={to}
            setTo={setTo}
            from={from}
            setFrom={setFrom}
            date={true}
          />
          </div>
        
        </div>
        <div className="">
        <LocationSelector
            selectedCountry={country}
            selectedState={state}
            selectedCity={city}
            onCountryChange={setCountry}
            onStateChange={setState}
            onCityChange={setCity}
            className="flex flex-col gap-4 md:flex-row"
            labelClass="hidden"
            inputClass="w-full"
          />
          <input onChange={(e)=> setZipCode(e.target.value)} placeholder="Zip Code" className="rounded border border-gray-300 mt-3" type="text" />
        </div>
       
        <div className="overflow-x-auto flex py-2 w-full border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-lg whitespace-nowrap capitalize border-b-2 flex-shrink-0 transition-all duration-200 font-medium relative ${
                activeTab === tab
                  ? "text-blue-600  border-blue-600"
                  : "text-gray-500 hover:text-gray-800 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto text-nowrap">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  User
                </th>
                {activeTab != "investor" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Amount ($)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Duration (Days)
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentSeries.length > 0 ? (
                currentSeries.map((list, i) => (
                  <tr key={i}>
                    <td className=" px-6 py-4 font-semibold text-base text-black">
                      <Link
                        to={`/${user?.role}/user-manager/${list.customer_unique_id}`}
                        className="flex flex-row gap-5 w-fit group"
                      >
                        {list.customer_profile_image ? (
                          <img
                            src={list.customer_profile_image}
                            alt=""
                            className="h-12 w-12 aspect-square rounded-lg"
                          />
                        ) : (
                          <h1 className="h-12 w-12 text-base  flex justify-center place-items-center  aspect-square rounded-lg bg-gray-300">
                            {list.full_name.charAt()}
                          </h1>
                        )}
                        <div className="flex flex-col">
                          <h1 className="text-sm group-hover:scale-105 transition-all duration-300 ease-out">
                            {list.full_name}
                          </h1>
                          <span className="text-xs text-neutral-500">
                            {list.email}
                          </span>
                        </div>
                      </Link>
                    </td>
                    {activeTab != "investor" && (
                      <>
                        <td className="px-6 py-4 font-semibold text-base text-black">
                          <span className="line-clamp-1 text-nowrap">
                            ${list.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-base text-black">
                          <span className="line-clamp-1 text-nowrap">
                            {list.duration}
                          </span>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 font-semibold ">
                      <span
                        className={`line-clamp-1 text-nowrap text-xs uppercase rounded-lg px-1 py-1 text-center ${getStatusClass(
                          list.verify_status
                        )}`}
                      >
                        {list.verify_status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {dateFormate(list.inserted_date)}
                    </td>
                    {activeTab != "investor" && (
                      <td className="p-4 text-sm">
                        <Link to={`user?all=${list.blue_tick_verification_id}`}>
                          <Eye />
                        </Link>
                      </td>
                    )}
                    {activeTab == "investor" && (
                      <td className="p-4 text-sm">
                        <Link
                          to={`user?investor=${list.investor_fund_verification_id}`}
                        >
                          <Eye />
                        </Link>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Payment Request not Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Bluetick;
