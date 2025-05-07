import React, { useEffect, useState } from 'react';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ManageLead = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const navigate = useNavigate();
    const { user } = UserState();
    const [loading, setLoading] = useState(false);
    const [leadData, setLeadData] = useState({
        totalLeads: 0,
        usedLeads: [],
        purchasedLeads: []
    });

    // Existing useEffect blocks remain the same...
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sessionId = params.getAll('session_id').pop();
    
        const updatePaymentStatus = async () => {
          try {
            const endpoint = `${baseUrl}/lead_checkout_success`
            const response = await axios.post(
              endpoint,
              {
                payment_id: sessionId,
                status: true
              },
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
    
            if (response.data.status) {
                navigate(`/${user.role}/manage_lead`);
                window.location.reload();
                notify('success', 'Payment completed successfully');
            } else {
              notify('error', response.data.message || 'Failed to verify payment');
              navigate(`/${user.role}/manage_lead`);
            }
          } catch (error) {
            console.error('Error updating payment status:', error);
            navigate(`/${user.role}/manage_lead`);
          } finally {
            setLoading(false);
          }
        };
    
        if (sessionId) {
          updatePaymentStatus();
        } else {
          setLoading(false);
        }
    }, []);

    useEffect(() => {
        const leadInfo = async () => {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${baseUrl}/manage_lead`,
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
                    setLeadData({
                        totalLeads: response.data.total_lead,
                        usedLeads: response.data.used_leads,
                        purchasedLeads: response.data.purchased_lead
                    });
                    notify('success', response.data.message);
                } else {
                    notify('error', response?.data?.message || 'Something went wrong');
                }
            } catch (error) {
                console.error('Error:', error);
                notify(
                    'error',
                    error.response?.data?.message || 'Unauthorized access, please login again'
                );
            } finally {
                setLoading(false);
            }
        };

        leadInfo();
    }, [baseUrl, user]);

    const EmptyState = ({ message }) => (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Data Available</h3>
                <p className="text-gray-500">{message}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen container mx-auto bg-gradient-to-b from-gray-50 to-white p-6">
            <div className="mx-auto">
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Lead Management Dashboard
                            </h1>
                            <p className="text-gray-600 max-w-2xl">
                                Transform your business growth with our lead management system. Each lead represents a valuable opportunity to connect with potential clients interested in your services.
                            </p>
                        </div>
                        <Link 
                            to={`/${user.role}/purchase-lead`} 
                            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl"
                        >
                            Purchase More Leads
                        </Link>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Available Leads</h2>
                            <div className="text-4xl font-bold text-indigo-600">
                                {leadData.totalLeads || 0}
                            </div>
                            <p className="text-gray-500 mt-2">Active leads in your account</p>
                        </div>
                        <div className="h-24 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead Value</h2>
                            <p className="text-gray-600">
                                Each lead is carefully verified and qualified to ensure high conversion potential for your business.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Used Leads Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Active Leads</h2>
                        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                            In Progress
                        </span>
                    </div>
                    {leadData.usedLeads && leadData.usedLeads.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {leadData.usedLeads.map((lead) => (
                                <div key={lead.lead_manage_id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-200">
                                    <img
                                        src={lead.projectMedia?.[0]?.media_link || "/api/placeholder/400/250"}
                                        alt={lead.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                                            {lead.category?.category_name || "Real Estate"}
                                        </span>
                                        <h3 className="font-semibold text-gray-900 text-lg mt-3 mb-2">
                                            {lead.title || "Lorem ipsum dolor"}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            High-quality lead with verified contact information
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Start your journey by exploring our qualified leads. Each lead is an opportunity waiting to be converted!" />
                    )}
                </div>

                {/* Purchase History Section */}
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            Transaction Log
                        </span>
                    </div>
                    {leadData.purchasedLeads && leadData.purchasedLeads.length > 0 ? (
                        <div className="space-y-4">
                            {leadData.purchasedLeads.map((purchase) => (
                                <div
                                    key={purchase.lead_payment_id}
                                    className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <span className="text-indigo-600 font-semibold text-lg">
                                                {purchase.lead}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-900 font-medium">Premium Leads</span>
                                            <p className="text-sm text-gray-500">High-quality verified contacts</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${purchase.price}
                                            </span>
                                            <p className="text-sm text-gray-500">Successful Purchase</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Invest in your business growth by purchasing high-quality leads. Each lead is carefully verified and ready for conversion!" />
                    )}
                </div>
            </div>
            {loading && <Loader />}
        </div>
    );
};

export default ManageLead;