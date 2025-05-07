import React, { useEffect, useState } from "react";
import { UserState } from "../../context/UserContext";
import axios from "axios";
import Loader from "../../Utiles/Loader";
import { notify } from "../../Utiles/Notification";
import { Link, useNavigate } from "react-router-dom";
import { Mail, X, Globe, FileText, Tag, Building, DollarSign, Percent, MapPin, Award, Check } from "lucide-react";

const ContactEntrepreneur = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [skeletonLoading, setSkeletonLoading] = useState(false);
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchEntrepreneur = async () => {
    setSkeletonLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/investor_contacted_entrepreneur`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        setEntrepreneurs(response?.data?.chat_user_data);
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.message || "Something went wrong");
    } finally {
      setSkeletonLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrepreneur();
  }, [baseUrl]);

  const handelSendMessage = (chatId) => {
    navigate(`/${user.role}/messages/${chatId}`);
  };

  const openModal = (entrepreneur) => {
    setSelectedEntrepreneur(entrepreneur);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {skeletonLoading && <Loader />}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Entrepreneur</h1>

        {entrepreneurs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {entrepreneurs.map((entrepreneur) => (
              <div
                key={entrepreneur.chat_initiate_id}
                className="bg-white rounded-2xl shadow-sm flex flex-col h-full"
              >
                <div className="p-4 flex flex-col h-full">
                  <div 
                    className="cursor-pointer"
                    onClick={() => 
                      navigate(`/investor/contacted_entrepreneur_details` ,{
                        state : entrepreneur
                      })
                      // openModal(entrepreneur)
                    }
                  >
                    <img
                      src={entrepreneur.reciver_profile_image}
                      alt={entrepreneur.reciver_full_name}
                      className="w-full h-48 object-cover rounded-xl mb-3"
                    />
                  </div>

                  <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => openModal(entrepreneur)} >
                    <span className="text-base font-medium text-gray-900 hover:text-blue-500 "
                     onClick={() => 
                      navigate(`/investor/contacted_entrepreneur_details` ,{
                        state : entrepreneur
                      })
                     }
                    >
                      {entrepreneur.reciver_full_name}
                    </span>
                  </div>

                  <div className="text-base text-gray-500 mb-3 flex-grow">
                    <Link className="cursor-pointer hover:text-blue-500 transition-colors hover:underline" target="_blank" to={`/${user.role}/projects/${entrepreneur.project_unique_id}`}>
                    <div>{entrepreneur.title}</div>
                    </Link>
                    <div>
                      {entrepreneur.city?.city_name || ""},
                      {entrepreneur.state?.state_name || ""}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handelSendMessage(entrepreneur.chat_initiate_id)
                    }
                    className="w-full py-2 px-4 bg-[#4A3AFF] text-white rounded-lg hover:bg-[#3D32CC] transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <Mail className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-48 bg-white rounded-2xl shadow-sm border border-gray-100">
            <span className="text-gray-500 text-lg font-medium">
              No Entrepreneurs Available
            </span>
          </div>
        )}
      </div>

      {/* {isModalOpen && selectedEntrepreneur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="relative">
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="text-xl font-bold text-gray-900">Entrepreneur Details</h2>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img
                      src={selectedEntrepreneur.reciver_profile_image}
                      alt={selectedEntrepreneur.reciver_full_name}
                      className="w-full h-48 md:h-64 object-cover rounded-xl mb-4"
                    />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{selectedEntrepreneur.reciver_full_name}</h3>
                      
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedEntrepreneur.city?.city_name || ""}, 
                        {selectedEntrepreneur.state?.state_name || ""}, 
                        {selectedEntrepreneur.country?.country_name || ""}
                      </p>
                      {selectedEntrepreneur.isVerified && (
                        <div className="flex items-center text-green-600 text-sm">
                          <Check className="w-4 h-4 mr-1" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedEntrepreneur.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
                          <Building className="w-4 h-4" />
                          {selectedEntrepreneur.company_name || ""}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Category</div>
                          <div className="font-medium flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            {selectedEntrepreneur.category?.category_name || "N/A"}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Stage</div>
                          <div className="font-medium flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {selectedEntrepreneur.stage?.business_stage_name || "N/A"}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Funding Amount</div>
                          <div className="font-medium flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {selectedEntrepreneur.fund_amount ? `$${selectedEntrepreneur.fund_amount}M` : "N/A"}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Equity Offered</div>
                          <div className="font-medium flex items-center gap-1">
                            <Percent className="w-4 h-4" />
                            {selectedEntrepreneur.equity ? `${selectedEntrepreneur.equity}%` : "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-gray-700 text-sm">{selectedEntrepreneur.description || "No description available."}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {selectedEntrepreneur.website_name && (
                          <a 
                            href={selectedEntrepreneur.website_name.startsWith("http") ? selectedEntrepreneur.website_name : `https://${selectedEntrepreneur.website_name}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                        {selectedEntrepreneur.pitch_deck_file && (
                          <a 
                            href={selectedEntrepreneur.pitch_deck_file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            Pitch Deck
                          </a>
                        )}
                        <button
                          onClick={() => handelSendMessage(selectedEntrepreneur.chat_initiate_id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-[#4A3AFF] text-white hover:bg-[#3D32CC] rounded-lg transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default ContactEntrepreneur;