import { useState, useEffect } from "react";
import axios from "axios";
import { BadgeCheck, Star, Crown, Zap, X } from "lucide-react";
import { notify } from "../../../Utiles/Notification";
import Loader from "../../../Utiles/Loader";
import { UserState } from "../../../context/UserContext";
import CustomButton from "../../../Utiles/CustomButton";
import { loadStripe } from "@stripe/stripe-js";
import useStripeCredentials from "../../../Utiles/StripePublicKey";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const { user } = UserState();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const navigate = useNavigate();
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
    const sessionId = params.get("session_id");

    const handleInitialLoad = async () => {
      setLoading(true);
      try {
        if (sessionId) {
          await handlePaymentSuccess(sessionId);
        } else {
          navigate(`/${user.role}/subscription`);
        }
      } catch (error) {
        console.error("Error during initial load:", error);
        navigate(`/${user.role}/subscription`);
      } finally {
        setLoading(false);
      }
    };

    handleInitialLoad();
  }, [location.search]);

  const handlePaymentSuccess = async (sessionId) => {
    try {
      const endpoint = `${baseUrl}/subscription_chekout_success_web`;
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
        notify("success", "Payment completed successfully");
        navigate(`/${user.role}/subscription`);
      } else {
        notify("error", response.data.message || "Failed to verify payment");
        navigate(`/${user.role}/subscription`);
      }
    } catch (error) {
      throw error;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const subscriptionPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/getUserSubscription`,
        { customer_unique_id: user?.customer?.customer_unique_id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.data.status) {
        setSubscriptionData(response.data.Subscriptiondata);
      }
    } catch (error) {
      notify("error", "Unauthorized access. Please log in again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    subscriptionPlan();
  }, [baseUrl, user]);

  const getPlanStyles = (planName, isActive) => {
    const styles = {
      Basic: {
        card: isActive
          ? "bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-50 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:via-cyan-50 hover:to-white",
        border: isActive ? "border-blue-400/50" : "border-gray-100",
        icon: <Zap className="w-8 h-8 text-blue-500" />,
        badge: "bg-blue-100 text-blue-700",
        button:
          "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
      },
      Pro: {
        card: isActive
          ? "bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-50 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
          : "bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:via-purple-50 hover:to-white",
        border: isActive ? "border-violet-400/50" : "border-gray-100",
        icon: <Star className="w-8 h-8 text-violet-500" />,
        badge: "bg-violet-100 text-violet-700",
        button:
          "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700",
      },
      Elite: {
        card: isActive
          ? "bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
          : "bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:via-orange-50 hover:to-white",
        border: isActive ? "border-amber-400/50" : "border-gray-100",
        icon: <Crown className="w-8 h-8 text-amber-500" />,
        badge: "bg-amber-100 text-amber-700",
        button:
          "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
      },
    };
    return styles[planName] || styles.Basic;
  };

  const handleBuySubscription = async (subscription_id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/getCheckoutDetails`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          subscription_id: subscription_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        setShowPaymentModal(true);
        setPaymentDetail(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching legal templates:", error);
      notify("error", "Failed to fetch legal templates");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (paymentDetail) => {
    try {
      setLoading(true);

      const paymentPayload = {
        customer_unique_id: user?.customer?.customer_unique_id,
        subscription_id: paymentDetail.subscription_id,
        subscription_rate: paymentDetail.new_subscription.subscription_rate,
        remaining_value: paymentDetail.previous_subscription?.remaining_value,
        total_amount: paymentDetail.new_subscription?.total_amount,
        government_tax:
          paymentDetail.new_subscription.subscription_government_percentage,
        service_amount:
          paymentDetail.new_subscription.subscription_service_percentage,
        payable_amount: paymentDetail.payable_amount,
        payment_method: "card",
        success_url:
          `${window.location.origin}/${user.role}/subscription`.trim(),
        cancel_url:
          `${window.location.origin}/${user.role}/verification/cancel`.trim(),
      };
      const response = await axios.post(
        `${baseUrl}/subscription_checkout_web`,
        paymentPayload,
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
        notify("error", response.data.message || "Payment processing failed");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      notify("error", "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-start mb-16">
            <h2 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Choose Your Plan
            </h2>
            <p className=" mt-3 font-medium text-xl text-gray-500 he">
              Yearly access. Long-term success
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-12">
            {subscriptionData.map((plan) => {
              const styles = getPlanStyles(
                plan.subscription_name,
                plan.is_active
              );
              return (
                <div
                  key={plan.subscription_id}
                  className={`relative transform transition-all duration-500 hover:scale-105 ${styles.card} 
                rounded-3xl border-2 ${styles.border} backdrop-blur-sm 
                hover:shadow-2xl overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-500" />

                  <div className="absolute top-4 right-4 flex space-x-2">
                    {plan.is_active === 1 ? (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${styles.badge}`}
                      >
                        <BadgeCheck className="w-4 h-4 mr-1" />
                        Active Plan
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      {styles.icon}
                      <h3 className="ml-3 text-2xl font-bold text-gray-900">
                        {plan.subscription_name}
                      </h3>
                    </div>

                    <div className="flex items-baseline mb-4">
                      <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        ${plan.subscription_price}
                      </span>
                      <div>
                        <span className="ml-2 text-gray-500">/month </span>
                        <p className="mx-2 text-gray-500">charging apply yearly</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-md text-gray-600">
                        ${plan.subscription_price * 12}
                      </span>
                      <span className="text-sm text-gray-500">(billed annually)</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.subscription_details.map((detail) => (
                        <li
                          key={detail.subcription_detail_id}
                          className="flex items-start group"
                        >
                          <div className="flex-shrink-0 p-1">
                            <BadgeCheck className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                          </div>
                          <div className="ml-3">
                            <p className="text-base text-gray-900 font-medium">
                              {detail.functionality}:{" "}
                              <span className="font-semibold">
                                {detail.limit} {detail.title}
                              </span>
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {detail.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        handleBuySubscription(plan.subscription_id);
                      }}
                      disabled={plan.disable_lower_plan === 1}
                      className={`w-full px-6 py-4 text-lg font-medium rounded-xl transition-all duration-300 
    text-white ${styles.button} transform 
    ${plan.disable_lower_plan === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:-translate-y-1 hover:shadow-lg"
                        }
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white`}
                    >
                      {plan.is_active
                        ? "Current Plan"
                        : plan.disable_lower_plan === 1
                          ? "Not Available"
                          : "Choose Plan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md flex flex-col h-[500px] relative">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Details
                </h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {paymentDetail?.previous_subscription && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    Current Subscription
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Days</span>
                      <span className="font-medium">
                        {paymentDetail.previous_subscription.remaining_days}{" "}
                        days
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Value</span>
                      <span className="font-medium">
                        ${paymentDetail.previous_subscription.remaining_value}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expiry Date</span>
                      <span className="font-medium">
                        {formatDate(
                          paymentDetail.previous_subscription.expiry_date
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  New Subscription Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan Name</span>
                    <span className="font-medium">
                      {paymentDetail?.new_subscription?.subscription_name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subscription Rate</span>
                    <span className="font-medium">
                      ${paymentDetail?.new_subscription?.subscription_rate}
                      /month
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium">
                      ${paymentDetail?.new_subscription?.total_amount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  Calculation Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium">
                      ${paymentDetail?.new_subscription?.total_amount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Service Charge (
                      {
                        paymentDetail?.new_subscription
                          ?.subscription_service_percentage
                      }
                      %)
                    </span>
                    <span className="font-medium">
                      + ${paymentDetail?.new_subscription?.service_amount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Government Tax (
                      {
                        paymentDetail?.new_subscription
                          ?.subscription_government_percentage
                      }
                      %)
                    </span>
                    <span className="font-medium">
                      + ${paymentDetail?.new_subscription?.government_tax}
                    </span>
                  </div>
                  {paymentDetail?.previous_subscription && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Value</span>
                      <span className="font-medium text-green-600">
                        - $
                        {paymentDetail?.previous_subscription?.remaining_value}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center text-md font-semibold">
                      <span>Final Amount</span>
                      <span className="text-[#4A3AFF]">
                        ${parseFloat(paymentDetail?.payable_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-end">
                <CustomButton
                  label="Pay Now"
                  onClick={() => handlePayNow(paymentDetail)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;
