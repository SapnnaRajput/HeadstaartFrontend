import React from 'react';
import Navbar from './Navbar';
import Foooter from './Foooter';
import { FiCheck, FiCircle, FiStar, FiAward } from 'react-icons/fi';

const PricingCard = ({ title, price, features, tier }) => {
  const getTierIcon = () => {
    if (tier === 'elite') {
      return <FiAward className="text-amber-500 text-xl" />;
    } else if (tier === 'pro') {
      return <FiStar className="text-violet-500 text-xl" />;
    } else {
      return <FiCircle className="text-blue-500 text-xl" />;
    }
  };

  const getTierColor = () => {
    if (tier === 'elite') {
      return 'text-amber-500';
    } else if (tier === 'pro') {
      return 'text-violet-500';
    } else {
      return 'text-blue-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        {getTierIcon()}
        <h3 className={`text-xl font-bold ${getTierColor()}`}>{title}</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-gray-500 ml-1">/month</span>
        </div>
      </div>
      
      <div className="mt-2">
        <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <FiCheck className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium">{feature.name}</div>
                <div className="text-gray-500 text-sm">
                  {feature.description} {feature.value && <span>({feature.value})</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PlanSection = ({ title, icon, plans }) => {
  return (
    <div className="py-8">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-8">
        <div className="text-blue-500 text-2xl">{icon}</div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingCard
            key={index}
            title={plan.title}
            price={plan.price}
            features={plan.features}
            tier={plan.tier}
          />
        ))}
      </div>
    </div>
  );
};

const Pricing = () => {
  const entrepreneurPlans = [
    {
      title: "Basic",
      price: 15,
      annualPrice: 180,
      tier: "basic",
      features: [
        { name: "Project Submission", description: "Launch and showcase your business projects/year", value: "3" },
        { name: "Pitch Deck Builder", description: "Build compelling decks with AI", value: "3" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Once a month" },
        { name: "Pitch Deck Revision", description: "Edit and refine your decks anytime", value: "3" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "50" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Verification Badge", description: "Badge available for purchase after identity review", value: "Available" },
      ],
    },
    {
      title: "Pro",
      price: 49,
      annualPrice: 588,
      tier: "pro",
      features: [
        { name: "Project Submission", description: "Launch and showcase your business projects/year", value: "5" },
        { name: "Pitch Deck Builder", description: "Build compelling decks with AI", value: "5" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Once a month" },
        { name: "Pitch Deck Revision", description: "Edit and refine your decks anytime", value: "5" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "150" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Verification Badge", description: "Badge available for purchase after identity review", value: "Available" },
      ],
    },
    {
      title: "Elite",
      price: 199,
      annualPrice: 2388,
      tier: "elite",
      features: [
        { name: "Project Submission", description: "Launch and showcase your business projects/year", value: "10" },
        { name: "Pitch Deck Builder", description: "Build compelling decks with AI", value: "10" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Twice a month" },
        { name: "Pitch Deck Revision", description: "Edit and refine your decks anytime", value: "10" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "No limit" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "No limit" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Verification Badge", description: "Badge available for purchase after identity review", value: "Available" },
      ],
    },
  ];

  const agentPlans = [
    {
      title: "Basic",
      price: 29,
      annualPrice: 348,
      tier: "basic",
      features: [
        { name: "Search Access", description: "Browse a set number of entrepreneur and investor profiles", value: "250" },
        { name: "Service Listing", description: "List services in the Agent Directory to attract leads", value: "3" },
        { name: "Document Review", description: "Basic access to pitch decks and shared documents", value: "100" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "100" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Once a month" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Profile Update", description: "Edit your profile periodically to stay up to date", value: "1" },
        { name: "Verification Badge", description: "Badge available for purchase after identity review", value: "Available" },
        { name: "Profile Boost", description: "Boost your profile visibility for higher engagement", value: "10" },
      ],
    },
    {
      title: "Pro",
      price: 129,
      annualPrice: 1548,
      tier: "pro",
      features: [
        { name: "Search Access", description: "Browse a set number of entrepreneur and investor profiles", value: "1000" },
        { name: "Service Listing", description: "List services in the Agent Directory to attract leads", value: "5" },
        { name: "Document Review", description: "Basic access to pitch decks and shared documents", value: "500" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "250" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Once a month" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Project Update", description: "Edit your profile periodically to stay up to date", value: "2" },
        { name: "Verification Badge", description: "Badge available for purchase after identity review", value: "Available" },
        { name: "Profile Boost", description: "Boost your profile visibility for higher engagement", value: "25" },
        { name: "Priority Access to High-Value Deals", description: "You have access to High-Value Deals", value: "" },
        { name: "Profile Visibility Boost", description: "You have access to Boost Profile Visibility", value: "" },
        { name: "Premium Business Exit Deals", description: "You have access to Premium Business Exit Deals (M&A, Acquisitions)", value: "" },
        { name: "Exclusive Networking Events for Agents", description: "You have access to Exclusive Networking Events for Agents", value: "" },
      ],
    },
    {
      title: "Elite",
      price: 299,
      annualPrice: 3588,
      tier: "elite",
      features: [
        { name: "Search Access", description: "Browse a set number of entrepreneur and investor profiles", value: "Unlimited" },
        { name: "Service Listing", description: "List services in the Agent Directory to attract leads", value: "15" },
        { name: "Document Review", description: "Basic access to pitch decks and shared documents", value: "Unlimited" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "No limit" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Twice a month" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Project Update", description: "Edit your profile periodically to stay up to date", value: "2" },
        { name: "Verification Badge", description: "Badge available for purchase after identity review", value: "Available" },
        { name: "Profile Boost", description: "Boost your profile visibility for higher engagement", value: "No limit" },
        { name: "Priority Access to High-Value Deals", description: "You have access to High-Value Deals", value: "" },
        { name: "Profile Visibility Boost", description: "You have access to Boost Profile Visibility", value: "" },
        { name: "Premium Business Exit Deals", description: "You have access to Premium Business Exit Deals (M&A, Acquisitions)", value: "" },
        { name: "Exclusive Networking Events for Agents", description: "You have access to Exclusive Networking Events for Agents", value: "" },
      ],
    },
  ];

  const investorPlans = [
    {
      title: "Basic",
      price: 15,
      annualPrice: 180,
      tier: "basic",
      features: [
        { name: "Project Search", description: "Explore startups by region or type", value: "250" },
        { name: "Investor Dashboard", description: "View saved and contacted startups", value: "365 days" },
        { name: "Connection Access", description: "Contact entrepreneurs and agents yearly", value: "100" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
        { name: "Flag Projects", description: "Request agent help on selected deals", value: "50" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Once a month" },
        { name: "Fund Verification Badge", description: "Blue tick after fund verification", value: "Available" },
        { name: "Pitch Deck Access", description: "View decks shared by entrepreneurs", value: "Available" },
        { name: "Lead Access", description: "Purchase leads to start conversations", value: "100" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "50" },
        { name: "Entrepreneur Contact Limit", description: "You have access to limited access to chat entrepreneur", value: "5" },
      ],
    },
    {
      title: "Pro",
      price: 49,
      annualPrice: 588,
      tier: "pro",
      features: [
        { name: "Project Search", description: "Explore startups by region or type", value: "20" },
        { name: "Investor Dashboard", description: "View saved and contacted startups", value: "365 days" },
        { name: "Connection Access", description: "Contact entrepreneurs and agents yearly", value: "No limit" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
        { name: "Flag Projects", description: "Request agent help on selected deals", value: "150" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Once a month" },
        { name: "Fund Verification Badge", description: "You have all access to verify your fund", value: "Available" },
        { name: "Pitch Deck Access", description: "View decks shared by entrepreneurs", value: "Available" },
        { name: "Lead Access", description: "Purchase leads to start conversations", value: "250" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "100" },
        { name: "Lead Generation for Custom Business Deals", description: "You have access to Lead Generation for Custom Business Deals", value: "" },
        { name: "Legal & Due Diligence Document Access", description: "You have access to Legal & Due Diligence Document Access", value: "" },
        { name: "Entrepreneur Contact Limit", description: "You have access to limited access to chat entrepreneur", value: "50" },
      ],
    },
    {
      title: "Elite",
      price: 199,
      annualPrice: 2388,
      tier: "elite",
      features: [
        { name: "Project Search", description: "Explore startups by region or type", value: "30" },
        { name: "Investor Dashboard", description: "View saved and contacted startups", value: "365 days" },
        { name: "Connection Access", description: "Contact entrepreneurs and agents yearly", value: "No limit" },
        { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
        { name: "Flag Projects", description: "Request agent help on selected deals", value: "No limit" },
        { name: "Events Access", description: "Access platform-hosted events based on your subscription", value: "No limit" },
        { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Twice a month" },
        { name: "Fund Verification Badge", description: "You have all access to verify your fund", value: "Available" },
        { name: "Pitch Deck Access", description: "View decks shared by entrepreneurs", value: "Available" },
        { name: "Lead Access", description: "Purchase leads to start conversations", value: "No Limit" },
        { name: "Legal Templates", description: "Access to a curated set of legal templates for deals", value: "No limit" },
        { name: "Lead Generation for Custom Business Deals", description: "You have access to Lead Generation for Custom Business Deals", value: "" },
        { name: "Legal & Due Diligence Document Access", description: "You have access to Legal & Due Diligence Document Access", value: "" },
        { name: "Entrepreneur Contact Limit", description: "You have unlimited access to chat entrepreneur", value: "Unlimited" },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Find the perfect plan for your needs
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our flexible subscription options designed for entrepreneurs, agents, and investors
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <PlanSection
            title="Entrepreneur Plans"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>}
            plans={entrepreneurPlans}
          />

          <div className="border-t border-gray-200 my-16"></div>

          <PlanSection
            title="Agent Plans"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>}
            plans={agentPlans}
          />

          <div className="border-t border-gray-200 my-16"></div>

          <PlanSection
            title="Investor Plans"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            plans={investorPlans}
          />
        </div>
      </div>
      <Foooter />
    </>
  );
};

export default Pricing;
