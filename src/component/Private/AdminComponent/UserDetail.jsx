import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { notify } from "../../../Utiles/Notification";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import {
  Mail,
  Clock,
  MapPin,
  DollarSign,
  ChevronUp,
  ChevronDown,
  FileText,
  MessageSquare,
  Users,
  Calendar,
  Pencil,
  Download,
  Shield,
  CheckCircle,
  Calendar1,
  Receipt,
  CreditCard,
  Copy,
  User,
  ArrowRightLeft,
  University
} from "lucide-react";
import ChatMessages from "../../../Utiles/GetChat";
import { Modal } from "flowbite-react";
import CustomButton from "../../../Utiles/CustomButton";
import LocationSelector from "../../../Utiles/LocationSelector";
import GroupChatMessages from "../../../Utiles/GetGroupChat";

const maxLength = 300;

export const formatDate = (date) => {
  const d = new Date(date); // Convert string to Date
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

const UserDetail = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const location = useLocation();
  const { user } = UserState();
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState(null)
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const { userID } = useParams()
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedGroupChat, setSelectedGroupChat] = useState(null);
    const [expanded, setExpanded] = useState(false);
  
  
    const toggleExpand = () => {
      setExpanded(!expanded);
    };
  
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  // State for showing expanded content
  const [expandedSections, setExpandedSections] = useState({
    myDocuments: false,
    sharedDocuments: false,
    activeChats: false,
    groupChats: false,
    LegalbillDetails : false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_single_customer_admin`,
        {
          customer_unique_id: userID,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      
      console.log(response.data.customerData)
      

      if (response?.data?.status) {
       
        setUserData(response.data);
        setData(response.data.customerData)
        
        setCountry({
          label: response.data.customerData.customer_country_name,
          value: response.data.customerData.customer_country,
        })
        setState({
          label: response.data.customerData.customer_state_subdivision_name,
          value: response.data.customerData.customer_state,
        })
        setCity({
          label: response.data.customerData.customer_name_of_city,
          value: response.data.customerData.customer_city,
        })
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

  useEffect(() => {
    if (userID) {
      getUserDetails();
    }
  }, [baseUrl, user, userID]);

  if (!userData) return <Loader />;

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };
  const handleGroupChatClick = (groupChat) => {
    setSelectedGroupChat(groupChat);
  };

  const closeChatModal = () => {
    setSelectedChat(null);
    setSelectedGroupChat(null);
  };

  const update = async (e, yes) => {

    if (!data?.customer_full_name) {
      notify("error", 'Please Enter Full Name');
      return;
    }
    if (!data?.customer_zip_code) {
      notify("error", 'Please Enter Zip Code');
      return;
    }
    if (!data?.customer_address) {
      notify("error", 'Please Enter Address');
      return;
    }
    if (!country) {
      notify("error", 'Please Select Country');
      return;
    }
    if (!state) {
      notify("error", 'Please Select State');
      return;
    }
    if (!city) {
      notify("error", 'Please Select City');
      return;
    }

    const formData = new FormData();
    if (yes) {
      const file = e.target.files[0];
      formData.append('customer_profile_image', file);
    } else {
      formData.append('customer_profile_image', data?.customer_profile_image);
    }
    formData.append('customer_unique_id', data?.customer_unique_id);
    formData.append('full_name', data?.customer_full_name);
    formData.append('address', data?.customer_address);
    formData.append('country', country?.value);
    formData.append('state', state?.value);
    formData.append('city', city?.value);
    formData.append('zip_code', data?.customer_zip_code);


    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/admin_edit_customer_profile`, formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        notify("success", `${role[0].toLocaleUpperCase()+role.slice(1)} Profile Updated Successfully`);
        await getUserDetails();
        setOpenModal(false)
      }
    } catch (error) {
      notify("error", error.response?.data?.message || "Error updating status");
    }
    setLoading(false);
  }

    const handleViewDocument = async (doc) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/get_legal_preview_app_news_admin`,
          {
            legal_templates_id: doc.legal_template_id,
            ans_unique_id: doc.answer_unique_id
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            responseType: 'blob'
          }
        );
  
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
  
        window.open(url, '_blank');
  
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error previewing document:', error);
      } finally {
        setLoading(false);
        setOpenMenuId(null)
      }
    };
    const downloadData = async (id , type) => {
    let url;
    let payload;

    if (type === 'subscription') {
      url = 'genrate_invoice_subs_admin';
      payload = {
        customer_subscription_id: id,
      };
    }

    if (type === 'legalDocument') {
      url = 'genrate_invoice_legal_admin';
      payload = {
        legal_payment_id: id,
      };
    }
      setLoading(true);
      try {
          const response = await axios.post(`${baseUrl}/${url}`, {
              ...payload
          }, {
              headers: {
                  Authorization: `Bearer ${user?.token}`,
              },
              responseType: 'blob'
          });
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url2 = window.URL.createObjectURL(blob);

          window.open(url2, '_blank');
          URL.revokeObjectURL(url2);
      } catch (error) {
          notify("error", error.message);
      }
      setLoading(false);
  }



  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      {loading && <Loader />}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
            {userData.customerData.customer_profile_image ? (
              <img
                src={userData.customerData.customer_profile_image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
              />
            ) : (
              <h1 className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md flex justify-center place-items-center text-3xl font-medium capitalize">
                {userData.customerData.customer_full_name.charAt()}
              </h1>
            )}
            <label
              htmlFor="image"
              className="absolute right-0 bottom-1 cursor-pointer text-white bg-[#4A3AFF] flex justify-center place-items-center h-7 w-7 rounded-full"
            >
              <Pencil size={16} />
              <input
                type="file"
                name="customer_prifle"
                accept="image/*"
                id="image"
                onChange={(e) => update(e, true)}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {userData.customerData.customer_full_name}
              </h1>
              <button
                onClick={() => setOpenModal(true)}
                className="text-blue-500 underline"
              >
                Edit
              </button>
            </div>
            <p className="text-gray-600 mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              {userData.customerData.customer_email}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-sm px-4 py-1 rounded-full font-medium">
                {userData.customerData.customer_country_name}
              </span>
              <span className="bg-green-100 text-green-800 text-sm px-4 py-1 rounded-full font-medium">
                {userData.subscription.subscription_name} Subscription
              </span>
              <Link
                to={`/superadmin/managelead/${userData?.customerData?.customer_unique_id}`}
              >
                <span className="bg-purple-100 text-purple-800 text-sm px-4 py-1 rounded-full font-medium">
                  {userData.customerData.lead_count} Leads
                </span>
                </Link>   
            </div>
            {userData?.customerData?.isStudent && (
  <p className="h-7 w-fit flex items-center gap-2 px-4 rounded-sm bg-[#4A3AFF] text-white text-sm font-medium shadow-sm">
    <University className="h-4 w-4 text-white" />
    <span className="mt-[0.20rem]">{userData.customerData?.customer_school_university}</span>
  </p>
)}
            <p className="text-gray-700 bg-gray-50 p-4 mt-2 rounded-lg border border-gray-100">
              {userData.customerData.about_me || 'No bio provided'}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        {role === 'agent' ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Services
                <span className="text-gray-500 text-lg">
                  ({userData.services?.length})
                </span>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {userData.services?.map((service) => (
                <div
                  key={service.agent_service_unique_id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex border-b pb-2 items-center justify-between mb-4">
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium text-center">
                        {service.category.category_name}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <p className="bg-green-200 rounded-full px-4 py-1 border-2 w-24 text-sm flex justify-center items-center border-green-600 text-gray-600  gap-2">
                        {service?.status}
                      </p>
                      <p>
                        {expanded || service.description.length <= maxLength
                          ? service.description
                          : `${service.description.substring(0, maxLength)}...`}
                        {service.description.length > maxLength && (
                          <button
                            className="text-blue-500 text-sm mt-1"
                            onClick={toggleExpand}
                          >
                            {expanded ? 'See Less' : 'See More'}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Projects{' '}
                <span className="text-gray-500 text-lg">
                  ({userData.totalProject})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.projects?.map((project) => (
                <div
                  key={project.project_unique_id}
                  className="bg-white flex flex-col justify-between rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  
                    <div className="p-6">
                   
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {project.title}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium text-center">
                          {project.category.category_name}
                        </span>
                      </div>
                      <div className="space-y-3">
                      <Link
                    to={`/superadmin/content-moderation/${project.project_unique_id}`}
                  >
                        <p className="text-gray-600 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">Stage:</span>{' '}
                          {project.stage?.business_stage_name}
                        </p>

                        <p className="text-gray-600 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Location:</span>{' '}
                          {project.city?.city_name}, {project.state?.state_name}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">Funding:</span> $
                          {project.fund_amount} for {project.equity}% Equity
                        </p>

                        <div className="h-20 overflow-hidden">
                          <p className="text-gray-600 line-clamp-3">
                            {project.description}
                          </p>
                        </div>
                        </Link>

                        <div className="text-gray-600 flex flex-col gap-2 bg-neutral-50 p-2 rounded">
                          <div className="flex gap-3 items-center">
                            <MessageSquare className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-semibold text-green-950">
                              Total Chats
                            </span>{' '}
                            {project?.totalChats || 0}
                          </div>
                          {project?.totalChats > 0 && (
                            <div className="flex flex-col gap-2 ">
                              {project?.ProjectChat.map((chat) => (
                                <div className="border  rounded p-1">

                                <div className="flex w-full  justify-between items-center">
                                  <div className="flex gap-2 bg-blue-100 p-1 rounded items-center">
                                    <User className="h-5 w-5 text-yellow-500" />
                                    <Link
                                      to={`/superadmin/user-manager/${chat?.chatInitiator_id}?role=${chat?.chatInitiator_name}`}
                                      className="text-gray-800 text-[13px] px-2 "
                                    >
                                      <p  className="hover:text-blue-500 hover:underline">{chat?.chatInitiator_name}</p>
                                      <p className="text-[10px]">
                                        {chat?.chatInitiator_role}
                                      </p>
                                    </Link>
                                    
                                  </div>
                                  <ArrowRightLeft className="w-4 h-4 text-green-500" />
                                  <div className="flex gap-2 bg-red-100 p-1 rounded items-center">
                                    <User className="h-5 w-5 text-yellow-500" />
                                    <Link
                                      to={`/superadmin/user-manager/${chat?.chatWith_id}?role=${chat?.chatWith_role}`}
                                      className="text-gray-800 text-[13px] px-2 "
                                    >
                                      <p className="hover:text-blue-500 hover:underline">{chat?.chatWith_name}</p>
                                      <p className="text-[10px]">
                                        {chat?.chatWith_role}
                                      </p>
                                    </Link>
                                  </div>
                                </div>
                                <p className=" font-semibold mt-[4x] text-gray-500 text-[10px]">
                                Chat Initiate Date  {formatDate(chat?.chat_initiate_date)}
                                </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  
                  <div className="bg-gray-50 p-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {project.projectMedia?.map((media) => (
                        <a
                          key={media.project_media_id}
                          href={media.media_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full text-sm"
                        >
                          {media.media_type}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold">
              Shared Documents
              <span className="text-gray-500 ml-2 text-lg">
                ({userData.TotalShareDocument})
              </span>
            </h2>
            <button
              onClick={() => toggleSection('sharedDocuments')}
              className="text-blue-600 hover:text-blue-800"
            >
              {expandedSections.sharedDocuments ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </button>
          </div>
          <div
            className={`${
              expandedSections.sharedDocuments ? 'max-h-96' : 'max-h-64'
            } overflow-y-auto transition-all duration-300`}
          >
            {userData.sharedDocument?.length > 0 ? (
              userData.sharedDocument.map((doc) => (
                <div
                  key={doc.shared_document_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {doc.legal_template_details.document_name}
                        </p>
                        <span
                          className={`text-sm px-2 py-0.5 rounded-full ${
                            doc.status === 'Signed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Expires: {doc.expire_date}
                      </p>
                      <button
                        className="text-blue-600 text-sm hover:underline mt-1"
                        onClick={() => handleViewDocument(doc)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No shared documents found
              </div>
            )}
          </div>
          {userData.sharedDocument?.length > 3 &&
            !expandedSections.sharedDocuments && (
              <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => toggleSection('sharedDocuments')}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Show more
                </button>
              </div>
            )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold">
              My Documents
              <span className="text-gray-500 ml-2 text-lg">
                ({userData.TotalMyDocument})
              </span>
            </h2>
            <button
              onClick={() => toggleSection('myDocuments')}
              className="text-blue-600 hover:text-blue-800"
            >
              {expandedSections.myDocuments ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </button>
          </div>
          <div
            className={`${
              expandedSections.myDocuments ? 'max-h-96' : 'max-h-64'
            } overflow-y-auto transition-all duration-300`}
          >
            {userData.myDocument?.length > 0 ? (
              userData.myDocument.map((doc) => (
                <div
                  key={doc.shared_document_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {doc.legal_template_details.document_name}
                        </p>
                        <span
                          className={`text-sm px-2 py-0.5 rounded-full ${
                            doc.status === 'Signed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Expires: {doc.expire_date}
                      </p>
                      <button
                        className="text-blue-600 text-sm hover:underline mt-1"
                        onClick={() => handleViewDocument(doc)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No documents found
              </div>
            )}
          </div>
          {userData.myDocument?.length > 3 && !expandedSections.myDocuments && (
            <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => toggleSection('myDocuments')}
                className="text-blue-600 hover:underline text-sm"
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold">
              Active Chats
              <span className="text-gray-500 ml-2 text-lg">
                ({userData.chatData?.length || 0})
              </span>
            </h2>
            <button
              onClick={() => toggleSection('activeChats')}
              className="text-blue-600 hover:text-blue-800"
            >
              {expandedSections.activeChats ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </button>
          </div>
          <div
            className={`${
              expandedSections.activeChats ? 'max-h-96' : 'max-h-64'
            } overflow-y-auto transition-all duration-300`}
          >
            {userData.chatData?.length > 0 ? (
              userData.chatData.map((chat) => (
                <div
                  key={chat.chat_initiate_id}
                  onClick={() => handleChatClick(chat)}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={chat.reciver_profile_image}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {chat.receiver_full_name}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {chat.project.category_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No active chats
              </div>
            )}
          </div>
          {userData.chatData?.length > 3 && !expandedSections.activeChats && (
            <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => toggleSection('activeChats')}
                className="text-blue-600 hover:underline text-sm"
              >
                Show more
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold">
              Group Chats
              <span className="text-gray-500 ml-2 text-lg">
                ({userData.groupuserList?.length || 0})
              </span>
            </h2>
            <button
              onClick={() => toggleSection('groupChats')}
              className="text-blue-600 hover:text-blue-800"
            >
              {expandedSections.groupChats ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </button>
          </div>
          <div
            className={`${
              expandedSections.groupChats ? 'max-h-96' : 'max-h-64'
            } overflow-y-auto transition-all duration-300`}
          >
            {userData.groupuserList?.length > 0 ? (
              userData.groupuserList.map((group) => (
                <div
                  key={group.chat_group_initiates_id}
                  onClick={() => handleGroupChatClick(group)}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {group.group_name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.group_people} members
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2 overflow-hidden">
                        {group.chat_reciver?.slice(0, 3).map((user) => (
                          <img
                            key={user.reciver_unique_id}
                            src={user.reciver_profile_image}
                            alt="User"
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                        ))}
                        {group.chat_reciver?.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{group.chat_reciver.length - 3}
                          </div>
                        )}
                      </div>
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition-colors duration-200">
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No group chats
              </div>
            )}
          </div>
          {userData.groupuserList?.length > 1 &&
            !expandedSections.groupChats && (
              <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => toggleSection('groupChats')}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Show more
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="bg-white my-4 w-full rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex w-full justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">
            Pitch Deck
            <span className="text-gray-500 ml-2 text-lg">
              ({userData.pitchDeck?.length || 0})
            </span>
          </h2>
          <button
            onClick={() => toggleSection('pitchDeck')}
            className="text-blue-600 hover:text-blue-800"
          >
            {expandedSections.pitchDeck ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>
        </div>
        <div
          className={`${
            expandedSections.pitchDeck ? 'max-h-96' : 'max-h-64'
          } overflow-y-auto transition-all duration-300`}
        >
          {userData.pitchDeck?.length > 0 ? (
            userData.pitchDeck.map((deck) => (
              <div
                key={deck.pitch_doc_id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-medium text-gray-800">
                      {deck?.doc_name}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      {/* {group.group_people}  */}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      target="_blank"
                      href={deck?.pitch_doc}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition-colors duration-200"
                    >
                      <Download />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No Pitch Desk</div>
          )}
        </div>
        {userData.pitchDeck?.length > 3 && !expandedSections.pitchDeck && (
          <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => toggleSection('pitchDeck')}
              className="text-blue-600 hover:underline text-sm"
            >
              Show more
            </button>
          </div>
        )}
      </div>

      <div className="bg-white my-4 p-3 w-full rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex w-full justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">
            Subscriptions
            <span className="text-gray-500 ml-2 text-lg">
              ({userData.subscriptionBill?.length || 0})
            </span>
          </h2>
          <button
            onClick={() => toggleSection('subscriptionBill')}
            className="text-blue-600 hover:text-blue-800"
          >
            {expandedSections.subscriptionBill ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>
        </div>
        <div
          className={`${
            expandedSections.subscriptionBill ? 'max-h-96' : 'max-h-64'
          } overflow-y-auto transition-all duration-300 space-y-3`}
        >
          {userData.subscriptionBill?.length > 0 ? (
            userData.subscriptionBill.map((billing) => (
              <div
                key={billing?.customer_subscription_id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Shield className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {billing.subscriptionDetail?.subscription_name} Plan
                        </h4>
                        <span className="text-sm text-gray-500">
                          ID: {billing?.subscription_payment_id.slice(0, 12)}...
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {billing?.status}
                        </span>
                      </div>
                      <button
                        onClick={() => downloadData(billing?.customer_subscription_id , 'subscription')}
                        className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          Download
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <DollarSign className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">
                          Total Amount
                        </p>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          ${billing?.total_amount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar1 className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">
                          Valid Till
                        </p>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          {billing?.end_date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Receipt className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">
                          Tax + Service
                        </p>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          $
                          {(
                            Number(billing?.government_tax) +
                            Number(billing?.service_amount)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">
                          Duration
                        </p>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          {billing?.days} Days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 mt-2 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Payment Method:
                      </span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium capitalize">
                        {billing?.subscription_payment_method}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Role:</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium capitalize">
                        {role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No Subscription Billing
            </div>
          )}
        </div>
        {userData.pitchDeck?.length > 3 && !expandedSections.pitchDeck && (
          <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => toggleSection('pitchDeck')}
              className="text-blue-600 hover:underline text-sm"
            >
              Show more
            </button>
          </div>
        )}
      </div>

      <div className="bg-white my-4 w-full p-3 rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex w-full justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">
            Legal Documents
            <span className="text-gray-500 ml-2 text-lg">
              ({userData.LegalbillDetails?.length || 0})
            </span>
          </h2>
          <button
            onClick={() => toggleSection('LegalbillDetails')}
            className="text-blue-600 hover:text-blue-800"
          >
            {expandedSections.LegalbillDetails ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>
        </div>
        <div
          className={`${
            expandedSections.LegalbillDetail ? 'max-h-96' : 'max-h-64'
          } overflow-y-auto transition-all duration-300 space-y-3`}
        >
          {userData.LegalbillDetails?.length > 0 ? (
            userData.LegalbillDetails.map((billing) => (
              <div
                key={billing.legal_payment_id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {billing.legal_template_details.document_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ID: {billing.payment_id.slice(0, 15)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="bg-green-50 px-3 py-1 rounded-full flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-medium text-green-700">
                          Payment Complete
                        </span>
                      </div>
                      <button
                        onClick={()=> downloadData(billing?.legal_payment_id,'legalDocument')}
                        className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          Download
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">
                          Amount
                        </p>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          ${billing.payable_amount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Receipt className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">
                          Service Fee
                        </p>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          ${billing.template_service_fee}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">
                          Date
                        </p>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          {billing.inserted_date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">
                          Time
                        </p>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          {billing.inserted_time.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 mt-2 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Payment Method:
                      </span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium capitalize">
                        {billing.payment_method}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Role:</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium capitalize">
                        {billing.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No Legal Billing
            </div>
          )}
        </div>
      {userData.LegalbillDetails?.length > 3 &&
  !expandedSections.LegalbillDetails && (
    <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
      <button
        onClick={() => toggleSection('LegalbillDetails')} 
        className="text-blue-600 hover:underline text-sm"
      >
 Show More
      </button>
    </div>
  )}

      </div>

      {role === 'entrepreneur' && (
        <div className="bg-white my-4 w-full p-3 ">
          <div className="flex w-full justify-between items-center px-6 py-4  ">
            <h2 className="text-xl font-semibold">
              Boost Projects
              <span className="text-gray-500 ml-2 text-lg">
                ({userData?.ProjectboostCount})
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {userData?.ProjectboostDetails?.map((project) => (
              <div
                key={project.boosted_project_id}
                className="bg-white rounded p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {project?.projectDetail?.title}
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p className="col-span-2 text-gray-500">
                    {project?.product_name}
                  </p>
                  <div className="flex flex-col">
                    <span className="font-medium">Payment Method:</span>
                    <span className="bg-neutral-100 py-1 px-2 rounded  text-center">
                      {project?.payment_method}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Payment ID:</span>
                    <span className="bg-neutral-100 cursor-pointer gap-2 flex py-1 px-2 rounded justify-center text-center truncate">
                      {project['payment_id ']?.slice(0, 10)}...{' '}
                      <Copy
                        className="w-5 h-5 transition-all hover:text-blue-600 hover:scale-125"
                        onClick={() => {
                          navigator.clipboard.writeText(project['payment_id ']);
                        }}
                      />
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Days:</span>
                    <span className="bg-neutral-100 py-1 px-2 rounded  text-center">
                      {project?.days}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Buy Date:</span>
                    <span className="bg-neutral-100 py-1 px-2 rounded  text-center">
                      {project?.inserted_date}
                    </span>
                  </div>
                  <div className="col-span-2 flex flex-col  ">
                    <span className="font-medium">Price:</span>
                    <span className="rounded   text-lg font-bold">
                      ${project?.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Registered Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userData.eventData?.map((event) => (
            <div
              key={event.event_unique_id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <img
                  src={event.event_image}
                  alt="Event"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium">{event.event_title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.started_date)} to{' '}
                    {formatDate(event.ended_date)}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedChat && (
        <ChatMessages
          chatId={selectedChat.chat_initiate_id}
          userId={userID}
          onClose={closeChatModal}
          user={user}
        />
      )}
      {selectedGroupChat && (
        <GroupChatMessages
          onClose={closeChatModal}
          chatId={selectedGroupChat.chat_group_initiates_id}
          currentChatUser={userID}
          user={user}
          groupData={selectedGroupChat}
        />
      )}
      <Modal
        show={openModal}
        className="z-30 pt-40"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div className="flex flex-col gap-1">
              <h1>
                Full Name<span className="text-red-500 text-base">*</span>
              </h1>
              <input
                type="text"
                name="customer_full_name"
                onChange={(e) =>
                  setData({ ...data, customer_full_name: e.target.value })
                }
                id=""
                className="rounded-md"
                placeholder="Enter Full Name"
                value={data?.customer_full_name}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h1>
                Zip Code<span className="text-red-500 text-base">*</span>
              </h1>
              <input
                type="number"
                name="customer_zip_code"
                onChange={(e) =>
                  setData({ ...data, customer_zip_code: e.target.value })
                }
                id=""
                className="rounded-md no-arrows"
                placeholder="Enter Zip Code"
                value={data?.customer_zip_code}
              />
            </div>
          </div>
          <LocationSelector
          data={
            {
              country : {country_id : data?.customer_country},
              city:{city_id : data?.customer_city},
              state:{state_subdivision_id : data?.customer_state}
            }
          }
            selectedCountry={country}
            selectedState={state}
            selectedCity={city}
            onCountryChange={setCountry}
            onStateChange={setState}
            onCityChange={setCity}
            className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full"
            labelClass=""
            inputClass="w-full"
          />
          <div className="flex flex-col gap-1 mt-5">
            <h1>
              Customer Address<span className="text-red-500 text-base">*</span>
            </h1>
            <textarea
              type="text"
              name="customer_address"
              onChange={(e) =>
                setData({ ...data, customer_address: e.target.value })
              }
              id=""
              rows={5}
              className="rounded-md no-arrows"
              placeholder="Enter Zip Code"
              value={data?.customer_address}
            ></textarea>
          </div>
          <div className="flex justify-center flex-row gap-5 mt-5">
            <CustomButton
              label="Cancel"
              cancel={true}
              onClick={() => setOpenModal(false)}
            />
            <CustomButton label="Update" onClick={update} />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserDetail;
