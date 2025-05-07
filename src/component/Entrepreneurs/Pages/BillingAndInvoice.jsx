import React, { useEffect, useState } from 'react';
import { FileText, Share, Presentation, PresentationIcon, Eye, ClipboardCheck, CreditCard, Calendar, Clock, Building2, MapPin, Users, CheckCircle, Receipt, DollarSign, Shield, FileX, Download, ChevronDown } from 'lucide-react';
import Document from './Document';
import SharedDocument from './SharedDocument';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';

const BillingAndInvoice = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState()
  const [loading, setLoading] = useState(false)
  const [varifyBilling, setVarifyBilling] = useState([])
  const [leadBilling, setLeadBilling] = useState([])
  const [leagleBilling, setLeagleBilling] = useState([])
  const [boostBilling, setBoostBilling] = useState([])
  const [subscriptionBilling, setsubscriptionBilling] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(user.role === "investor" ? 'subscription' : 'verify');


  const tabs = [
    ...(user.role !== "investor" ? [{
      id: 'verify',
      label: 'Verify',
    }] : []),
    {
      id: 'subscription',
      label: 'Subscription',
    },
    {
      id: 'legal',
      label: 'Legal',
    },
    {
      id: 'lead',
      label: 'Lead',
    },
    ...(user.role === "entrepreneur" ? [{
      id: 'boost',
      label: 'Boost',
    }] : [])
  ];


  useEffect(() => {
    const varifyBilling = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/get_verify_billing `, {
          customer_unique_id: user?.customer?.customer_unique_id,
        }, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setVarifyBilling(response.data.billingDetails)
        }
      } catch (error) {
        notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    };

    const leadBilling = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/get_lead_billing `, {
          customer_unique_id: user?.customer?.customer_unique_id,
        }, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setLeadBilling(response.data.billingDetails)
        }
      } catch (error) {
        notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    };
    const leagleBilling = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/get_legal_billing `, {
          customer_unique_id: user?.customer?.customer_unique_id,
        }, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setLeagleBilling(response.data.billingDetails)
        }
      } catch (error) {
        notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    };

    const boostBilling = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/get_boost_billing `, {
          customer_unique_id: user?.customer?.customer_unique_id,
        }, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setBoostBilling(response.data.billingDetails)
        }
      } catch (error) {
        notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    };

    const subscriptionBilling = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/get_subscription_billing `, {
          customer_unique_id: user?.customer?.customer_unique_id,
        }, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setsubscriptionBilling(response.data.billingDetails)
        }
      } catch (error) {
        notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    };
    varifyBilling()
    leadBilling()
    leagleBilling()
    boostBilling()
    subscriptionBilling()
  }, [baseUrl, user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsDropdownOpen(false);
  };


  const handleDownloadPDF = async (billing) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/genrate_invoice_subs_web`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          customer_subscription_id: billing.customer_subscription_id
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
    }
  };

  const handleverify = async (billing) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/genrate_invoice_blue_tick`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          blue_tick_verification_id: billing.blue_tick_verification_id
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
    }
  };

  const handleLegal = async (billing) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/genrate_invoice_legal`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          legal_payment_id: billing.legal_payment_id
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
    }
  };

  const handleLead = async (billing) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/genrate_invoice_lead`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          lead_payment_id: billing.lead_payment_id
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
    }
  };

  const handleBoost = async (billing) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/genrate_invoice_boost`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          boosted_project_id: billing.boosted_project_id
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
    }
  };




  const renderContent = () => {
    switch (activeTab) {
      case 'verify':
        return (
          <div className="space-y-4">


            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Verification Details</h3>
              </div>
              {varifyBilling.length > 0 ? (<>
                {varifyBilling.map((billing, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-6 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <ClipboardCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{billing.product_name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${billing.verify_status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                            }`}>
                            {billing.verify_status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <CreditCard className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-600 font-medium">Amount: ${billing.amount}</span>
                        </div>
                        <button
                          onClick={() => handleverify(billing)}
                          className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Download className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Download</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p className="text-sm text-gray-900 truncate">{billing.inserted_date}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <p className="text-sm text-gray-900 truncate">{billing.duration} days</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                        <Building2 className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-500">EIN</p>
                          <p className="text-sm text-gray-900 truncate">{billing.ein}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg col-span-full md:col-span-2">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          <p className="text-sm text-gray-900 truncate">{billing.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">ID Front Image</p>
                        <div className="relative bg-gray-50 rounded-lg overflow-hidden group">
                          <img
                            src={billing.id_front_image}
                            alt="ID Front"
                            className="w-full h-32 sm:h-36 object-contain group-hover:object-cover transition-all duration-300"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">ID Back Image</p>
                        <div className="relative bg-gray-50 rounded-lg overflow-hidden group">
                          <img
                            src={billing.id_back_image}
                            alt="ID Back"
                            className="w-full h-32 sm:h-36 object-contain group-hover:object-cover transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>) : (
                <>
                  <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                      <FileX className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Verification Records</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      There are currently no verification records to display. New records will appear here once they are added to the system.
                    </p>
                  </div>
                </>)}
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Subscription History</h3>
            </div>
            {subscriptionBilling.map((billing) => (
              <div key={billing.customer_subscription_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Shield className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {billing.subscriptionDetail.subscription_name} Plan
                        </h4>
                        <span className="text-sm text-gray-500">ID: {billing.subscription_payment_id.slice(0, 12)}...</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{billing.status}</span>
                      </div>
                      <button
                        onClick={() => handleDownloadPDF(billing)}
                        className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Download</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <DollarSign className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Total Amount</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">${billing.total_amount}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Valid Till</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.end_date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Receipt className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Tax + Service</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">${(Number(billing.government_tax) + Number(billing.service_amount)).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Duration</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.days} Days</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 mt-2 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Payment Method:</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium capitalize">
                        {billing.subscription_payment_method}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Role:</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium capitalize">
                        {billing.subscriptionDetail.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'legal':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Legal Document Purchases</h3>
            </div>

            {leagleBilling.map((billing) => (
              <div key={billing.legal_payment_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{billing.legal_template_details.document_name}</h4>
                        <p className="text-sm text-gray-500">ID: {billing.payment_id.slice(0, 15)}...</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="bg-green-50 px-3 py-1 rounded-full flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-medium text-green-700">Payment Complete</span>
                      </div>
                      <button
                        onClick={() => handleLegal(billing)}
                        className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Download</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Amount</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">${billing.payable_amount}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Receipt className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Service Fee</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">${billing.template_service_fee}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Date</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.inserted_date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Time</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.inserted_time.slice(0, 5)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 mt-2 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Payment Method:</span>
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
            ))}
          </div>
        );
      case 'lead':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Lead Purchase History</h3>
            </div>

            {leadBilling.map((billing) => (
              <div key={billing.lead_payment_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{billing.product_name}</h4>
                        <span className="text-sm text-gray-500">ID: {billing.payment_id.slice(0, 12)}...</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Payment Successful</span>
                      </div>
                      <button
                        onClick={() => handleLead(billing)}
                        className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Download</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Users className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Leads</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.lead}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Price</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">${billing.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Date</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.inserted_date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Time</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.inserted_time.slice(0, 5)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Payment Method:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium capitalize">
                      {billing.payment_method}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ); case 'boost':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Project Boost History</h3>
            </div>

            {boostBilling.map((billing) => (
              <div key={billing.boosted_project_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {billing.projectDetail.title}
                        </h4>
                        <span className="text-sm text-gray-500">ID: {billing.payment_id?.slice(0, 12)}...</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Active Boost</span>
                      </div>
                      <button
                        onClick={() => handleBoost(billing)}
                        className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Download</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Eye className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Views</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.views}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Price</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">${billing.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Date</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.inserted_date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600">Duration</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{billing.days} Days</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 mt-2 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Payment Method:</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium capitalize">
                        {billing.payment_method}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Category:</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium">
                        {billing.projectDetail.category.category_name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <>
      {loading && <Loader />}
      <div className="w-full bg-gray-50">
        <div className="py-6">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="md:hidden border-b border-gray-100">
              <button
                onClick={toggleDropdown}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700"
              >
                <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border-t border-gray-100 shadow-lg">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full text-left px-4 py-3 text-sm font-medium ${activeTab === tab.id
                        ? 'text-[#4A3AFF] bg-[#4A3AFF]/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:block border-b border-gray-100">
              <div className="flex flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-6 text-sm font-medium relative ${activeTab === tab.id
                      ? 'text-[#4A3AFF] bg-[#4A3AFF]/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A3AFF]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2 lg:p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BillingAndInvoice