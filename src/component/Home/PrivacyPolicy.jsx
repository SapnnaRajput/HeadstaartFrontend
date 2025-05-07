import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Foooter';

const PrivacyPolicy = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [policy, setPolicy] = useState([]);
  const [activeTab, setActiveTab] = useState('entrepreneur');
  const [loading, setLoading] = useState(false);
  const [slice, setSlice] = useState(1);
  const getPrivacyPolicy = useCallback(
    async (role = 'entrepreneur') => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/get_policy_content`, {
          role,
        });
        if (response.data.status) {
          console.log(response.data?.policy);
          setPolicy(response.data?.policy?.policy_paras || []);
        }
      } catch (error) {
        console.error('Error fetching Policy:', error);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  useEffect(() => {
    getPrivacyPolicy();
  }, [getPrivacyPolicy]);

  const handleTabClick = (tab) => {
    if (tab === 'investor') setSlice(3);
    if (tab === 'agent') setSlice(1);
    if (tab === 'entreprenur') setSlice(1);
    getPrivacyPolicy(tab);
    setActiveTab(tab);
  };

  const policyRoles = {
    entrepreneur: 'entrepreneur',
    investor: 'investor',
    agent: 'agent',
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center my-5">
            <h1 className="font-semibold text-3xl">
              Privacy Policy - {activeTab}
            </h1>
            <p className="my-3">
              Welcome to Headstaart! Your privacy is important to us. This
              Privacy Policy explains how we collect, use, store, and protect
              your personal and investment-related data as an{' '}
              <strong> {activeTab}</strong> using our platform. By signing up
              and using Headstaart, you consent to the practices described
              below.
            </p>
          </div>
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {Object.keys(policyRoles).map((role) => (
              <button
                key={role}
                onClick={() => handleTabClick(role)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === role
                    ? 'bg-[#4A3AFF] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl p-6">
            {loading ? (
              <div className="w-full flex flex-col gap-5">
                <div className="w-full h-20 p-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-20 p-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-20 p-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-20 p-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-20 p-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-20 p-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ) : policy.length > 0 ? (
              policy.slice(slice).map((section, index) => (
                <div key={index} className="mb-2 border p-6 rounded">
                  <p className="text-gray-700 leading-relaxed">
                    {section.paragraph}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No privacy policy available for this role.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
