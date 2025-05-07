import {
  CheckCircle,
  Circle,
  CircleCheck,
  Eye,
  FolderOpen,
  LockIcon,
  MessageCircleHeart,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "flowbite-react";
import CustomButton from "../../../Utiles/CustomButton";
import axios from "axios";
import { notify } from "../../../Utiles/Notification";
import Loader from "../../../Utiles/Loader";
import { UserState } from "../../../context/UserContext";
import img from "../../../Assets/Images/pr-1.png";
import { loadStripe } from "@stripe/stripe-js";
import useStripeCredentials from "../../../Utiles/StripePublicKey";

const PromoteProjects = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const navigate = useNavigate();
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [promoteModal, setPromoteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [ads, setAds] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [project, setProject] = useState([]);
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
        const endpoint = `${baseUrl}/boost_project_checkout_success`;
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
          navigate(`/${user.role}/promote-project`);
          notify("success", "Payment completed successfully");
          window.location.reload();
        } else {
          notify("error", response.data.message || "Failed to verify payment");
          navigate(`/${user.role}/promote-project`);
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        notify(
          "error",
          error.response?.data?.message || "Error updating payment status"
        );
        navigate(`/${user.role}/promote-project`);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      updatePaymentStatus();
    } else {
      setLoading(false);
      navigate(`/${user.role}/promote-project`);
    }
  }, []);

  useEffect(() => {
    const postData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/get_customer_projects`,
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
          setProject(response.data.projectDetail);
        } else {
          setProject([]);
        }
      } catch (error) {
        notify("error", "Unauthorized access please login again");
      } finally {
        setLoading(false);
      }
    };
    postData();
  }, [baseUrl, user]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-500";
      case "Pending":
        return "bg-yellow-100 text-yellow-500";
      case "Completed":
        return "bg-blue-100 text-blue-500";
      default:
        return "";
    }
  };

  const getPurchaseDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_ads`);
      if (response.data.status) {
        setAds(response.data.ads);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
      notify("error", error.response?.data?.message || "Error fetching ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPurchaseDetails();
  }, [baseUrl]);

  const handlePromote = (project) => {
    setSelectedProject(project);
    setPromoteModal(true);
  };

  const handlePayNow = async () => {
    if (!selectedPlan) {
      notify("error", "Please select a plan first");
      return;
    }

    if (!selectedProject) {
      notify("error", "No project selected for promotion");
      return;
    }

    setLoading(true);

    try {
      const selectedAdPlan = ads.find((ad) => ad.ads_id === selectedPlan);

      if (!selectedAdPlan) {
        notify("error", "Invalid plan selected");
        return;
      }

      const checkoutData = {
        payment_method: "card",
        days: selectedAdPlan.days,
        views: selectedAdPlan.views,
        price: selectedAdPlan.price,
        project_unique_id: selectedProject.project_unique_id,
        customer_unique_id: user?.customer?.customer_unique_id,
        success_url: `${window.location.href}`.trim(),
        cancel_url:
          `${window.location.origin}/${user.role}/verification/cancel`.trim(),
      };

      const response = await axios.post(
        `${baseUrl}/boost_project_checkout`,
        checkoutData,
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
        notify(
          "error",
          response.data.message || "Failed to create checkout session"
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      notify(
        "error",
        error.response?.data?.message || "Payment process failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container mx-auto rounded-3xl md:p-8 p-4 bg-white ">
        <div className="flex md:flex-row flex-col justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-0 text-[#05004E]">
            Promote Projects
          </h1>
        </div>
        {project.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="bg-gray-50 rounded-full p-8 mb-6">
              <FolderOpen className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              No Projects Available
            </h2>
            <p className="text-gray-500 max-w-md">
              Start your journey by creating your first project. Your projects
              will appear here.
            </p>
          </div>
        ) : (
          <div className="container mx-auto grid md:grid-cols-3 lg:grid-cols-3 grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
            {project.map((list, index) => (
              <div
                className="bg-white rounded-3xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full border border-gray-100"
                key={index}
              >
                <Link to={`/${user.role}/projects/${list.project_unique_id}`}>
                  <div className="relative w-full">
                    <img
                      src={list.projectMedia?.[0]?.media_link || img}
                      alt={list.title}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-md"
                    />
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 sm:px-4 sm:py-2">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <span className="text-white text-xs sm:text-sm">
                        {list.view?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-3 lg:p-6 flex flex-col flex-grow">
                  <div className="mb-4 flex-grow">
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-2 capitalize mb-2">
                      {list.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-500 capitalize">
                        {list.category?.category_name}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500 capitalize">
                        {list.stage?.business_stage_name}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="bg-gray-50 rounded-2xl p-2 text-center">
                      <p className="text-base font-bold text-gray-900 mb-1">
                        ${list.fund_amount}M
                      </p>
                      <span className="text-xs text-gray-500">Fund Amount</span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-2 text-center">
                      <p className="text-base font-bold text-gray-900 mb-1">
                        {list.equity}%
                      </p>
                      <span className="text-xs text-gray-500">Equity</span>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-2 text-gray-500 mb-6">
<MessageCircleHeart className="w-5 h-5" />
<span className="text-sm">{list.investor_interest} Interested</span>
</div> */}

                  <div className="flex items-center lg:flex-row gap-2 flex-col justify-between mt-auto">
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {list.country?.country_name}
                    </div>

                    {list.is_boost ? (
                      <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Promoted
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePromote(list)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Promote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
  show={promoteModal}
  onClose={() => setPromoteModal(false)}
  size="md"
>
  <div className="flex flex-col max-h-[600px] rounded-lg overflow-hidden">
    {/* Header */}
    <div className="flex justify-between items-center p-5 bg-white border-b">
      <h2 className="text-xl font-semibold text-gray-800">Promote Your Project</h2>
      <button
        onClick={() => setPromoteModal(false)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>

    {/* Info Banner */}
    <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-indigo-100 rounded-full">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-medium text-lg text-gray-800">Stand out to investors and agents</h3>
          <p className="text-gray-600 mt-1">
            Boost your project's visibility in search results and featured sections.
          </p>
          <p className="text-sm text-gray-500 mt-3 italic">
            Disclaimer: Promotion increases visibility but does not guarantee funding.
          </p>
        </div>
      </div>
    </div>

    {/* Plan Selection */}
    <div className="flex-1 overflow-y-auto p-5 bg-white">
      <p className="text-sm text-gray-500 mb-4">Select a promotion package:</p>
      <div className="space-y-3">
        {ads.map((ad) => (
          <div
            key={ad.ads_id}
            onClick={() => setSelectedPlan(ad.ads_id)}
            className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all ${
              selectedPlan === ad.ads_id
                ? "border-2 border-indigo-500 bg-indigo-50"
                : "border border-gray-200 hover:border-gray-300 hover:shadow"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedPlan === ad.ads_id
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {selectedPlan === ad.ads_id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{ad.days} Days</h3>
                <p className="text-sm text-gray-500">~{ad.views} Estimated Views</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-green-600 font-semibold">${ad.price}</span>
              <span className="text-xs text-gray-400">${(ad.price/ad.days).toFixed(2)}/day</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Action Footer */}
    <div className="p-5 border-t bg-gray-50 flex justify-between items-center">
      <div className="text-sm text-gray-500 flex items-center">
        <LockIcon className="w-4 h-4 mr-1" />
        <span>Secure payment</span>
      </div>
      <button
        onClick={handlePayNow}
        disabled={!selectedPlan}
        className={`py-2.5 px-6 rounded-lg font-medium transition-colors ${
          selectedPlan 
            ? "bg-indigo-600 text-white hover:bg-indigo-700" 
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Pay Now
      </button>
    </div>
  </div>
</Modal>
    </>
  );
};

export default PromoteProjects;
