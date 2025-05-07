import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import useStripeCredentials from '../../../Utiles/StripePublicKey';

const LeadPurchase = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const { user } = UserState();
  const { publicKey, loading: stripeLoading, error: stripeError } = useStripeCredentials();
  const [stripeInstance, setStripeInstance] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      if (publicKey) {
        try {
          const stripe = await loadStripe(publicKey);
          setStripeInstance(stripe);
        } catch (error) {
          console.error('Error initializing Stripe:', error);
          notify('error', 'Failed to initialize payment system');
        }
      }
    };

    initializeStripe();
    
  }, [publicKey]);

  const getPurchaseDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_lead`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data.status) {
        setLeads(response.data.leads);
      } else {
        notify('error', 'Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      notify('error', error.response?.data?.message || 'Error fetching leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPurchaseDetails();
  }, [baseUrl, user]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${baseUrl}/lead_checkout`,
        {
          payment_method: 'card',
          lead: selectedPlan.lead,
          price: selectedPlan.price,
          customer_unique_id: user?.customer?.customer_unique_id,
          success_url: (`${window.location.origin}/${user.role}/manage_lead`).trim(),
          cancel_url: (`${window.location.origin}/${user.role}/verification/cancel`).trim()
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        const { error } = await stripeInstance.redirectToCheckout({
          sessionId: response.data.id
        });
        
        if (error) {
          notify('error', error.message);
        }
      } else {
        notify('error', response.data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      notify(
        'error',
        error.response?.data?.message || 'Failed to process payment'
      );
    } finally {
      setLoading(false);
    }
  };

  // Role-specific content
  const getRoleContent = () => {
    switch (user?.role) {
      case 'entrepreneur':
        return {
          title: "Purchase Leads to Connect",
          description: "Leads allow you to initiate contact with any agent or respond to a new investor's message or to reply when they reach out to you for the first time. One lead is deducted per new connection. Leads never expire—giving you the flexibility to connect when it matters most.",
          disclaimer: "Purchasing leads grants messaging access only and does not guarantee funding, replies, or successful outcomes. All interactions, agreements, and decisions are made solely between users. Headstaart serves solely as a networking platform and is not responsible for user actions or results."
        };
      case 'investor':
        return {
          title: "Unlock Direct Access with Leads",
          description: "Unlock direct access to entrepreneurs and agents by using leads to initiate the first message, or to reply when they reach out to you for the first time. One lead is deducted per new entrepreneur or agent connection—even if the same entrepreneur has multiple projects, each project message requires a lead. Leads never expire, giving you flexibility to engage when the opportunity is right.",
          disclaimer: "Purchasing leads grants investors the ability to initiate messaging with entrepreneurs and agents. It does not guarantee responses, investment opportunities, or successful outcomes. All decisions, negotiations, and agreements are made solely between users. Headstaart functions strictly as a networking platform and assumes no responsibility for the actions, communications, or results of its users."
        };
      case 'agent':
        return {
          title: "Grow Your Network with Leads",
          description: "Leads allow you to send the first message to any entrepreneur or investor, or to reply when they reach out to you for the first time. Each new entrepreneur project or investor connection will deduct 1 lead from your account. Leads never expire, providing you with the freedom to grow your network at your own pace and seize opportunities whenever they arise.",
          disclaimer: "Purchasing leads grants messaging access only and does not guarantee responses, deals, or financial outcomes. All communications, negotiations, and agreements are solely between users. Headstaart operates strictly as a professional networking platform and is not responsible for user interactions, decisions, or results."
        };
      default:
        return {
          title: "Purchase Leads",
          description: "Leads allow you to connect with other users on the platform.",
          disclaimer: "Purchasing leads grants messaging access only."
        };
    }
  };

  const roleContent = getRoleContent();

  return (
    <>
      {loading && <Loader />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6">
            <h2 className="text-white text-2xl font-bold">{roleContent.title}</h2>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">{roleContent.description}</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Lead Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map((plan) => (
                  <button
                    key={plan.lead_id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`flex items-center justify-between p-5 rounded-xl border ${
                      selectedPlan?.lead_id === plan.lead_id 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                    } transition-all duration-200`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        selectedPlan?.lead_id === plan.lead_id ? 'bg-purple-600' : 'bg-gray-200'
                      }`}></div>
                      <span className="text-gray-800 font-medium text-lg">
                        {plan.lead} Leads
                      </span>
                    </div>
                    <span className="text-green-500 font-semibold text-lg">
                      ${plan.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <button 
                onClick={handlePayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                disabled={!selectedPlan}
              >
                {selectedPlan ? `Purchase ${selectedPlan.lead} Leads for $${selectedPlan.price}` : 'Select a Package to Continue'}
              </button>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h4 className="text-gray-700 font-semibold mb-2">Disclaimer</h4>
              <p className="text-gray-600 text-sm">{roleContent.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadPurchase;