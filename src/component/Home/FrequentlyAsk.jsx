import React, { useState, useEffect } from "react";
import axios from "axios";

const FrequentlyAsk = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [FAQs, setFAQs] = useState({});
  const [activeTab, setActiveTab] = useState("agent");
  const [activeQuestion, setActiveQuestion] = useState(null);

  const getFAQs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/get_faq_users`);
      if (response.data.status) {
        setFAQs(response.data.faq);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    getFAQs();
  }, []);

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const tabs = [
    { id: "entrepreneur", label: "For Entrepreneurs" },
    { id: "investor", label: "For Investors" },
    { id: "agent", label: "For Agents" },
  ];

  return (
    <div className="container mx-auto py-16 px-4 md:px-8">
      <h1 className="text-3xl text-center font-semibold text-[#05004E] mb-8">
        Frequently Asked Questions
      </h1>

      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[#4A3AFF] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="container mx-auto">
        {FAQs[activeTab] && FAQs[activeTab].length > 0 ? (
          FAQs[activeTab].map((faq) => (
            <div
              key={faq.faq_id}
              className="mb-4 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1"
            >
              <button
                onClick={() => toggleQuestion(faq.faq_id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors duration-300 hover:bg-gray-50"
              >
                <h3 className="text-lg font-medium text-[#05004E]">
                  {faq.title}
                </h3>
                <svg
                  className={`w-5 h-5 text-[#05004E] transition-transform duration-300 ${
                    activeQuestion === faq.faq_id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeQuestion === faq.faq_id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 py-4 text-gray-600 border-t border-gray-100">
                  {faq.para}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {Object.keys(FAQs).length === 0 ? (
              <p>Loading FAQ items...</p>
            ) : (
              <p>No FAQ items available for this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FrequentlyAsk;