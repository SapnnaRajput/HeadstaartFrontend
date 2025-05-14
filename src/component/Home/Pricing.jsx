import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Foooter from './Foooter';
import { FiCheck, FiCircle, FiStar, FiAward } from 'react-icons/fi';
import axios from 'axios';
import { BadgeCheck } from "lucide-react";

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
              <BadgeCheck className={`mt-1 flex-shrink-0 text-blue-500`} />
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
  const [subscriptions, setSubscriptions] = useState({
    entrepreneur: [],
    agent: [],
    investor: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_APP_BASEURL;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/getSubscriptions`);

        if (response.data && response.data.Subscriptiondata) {
          // Group subscriptions by role
          const processedData = {
            entrepreneur: [],
            agent: [],
            investor: []
          };

          response.data.Subscriptiondata.forEach(subscription => {
            const role = subscription.role.toLowerCase();
            if (['entrepreneur', 'agent', 'investor'].includes(role)) {
              const plan = {
                title: subscription.subscription_name,
                price: parseFloat(subscription.subscription_price),
                tier: subscription.subscription_name.toLowerCase(),
                features: subscription.subscription_details.map(detail => ({
                  name: detail.functionality,
                  description: detail.description,
                  value: detail.limit,
                  status: detail.status
                }))
              };

              processedData[role].push(plan);
            }
          });

          setSubscriptions(processedData);
        }
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError('Failed to load subscription data. Please try again later.');
        setSubscriptions({
          entrepreneur: getFallbackPlans('entrepreneur'),
          agent: getFallbackPlans('agent'),
          investor: getFallbackPlans('investor')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Helper function to get feature descriptions
  const getFeatureDescription = (featureKey) => {
    const descriptions = {
      project_submission: 'Launch and showcase your business projects/year',
      pitch_deck_builder: 'Build compelling decks with AI',
      profile_updates: 'Keep your profile fresh and active',
      pitch_deck_revision: 'Edit and refine your decks anytime',
      analytics_access: 'Track your reach and visibility',
      legal_templates: 'Access to a curated set of legal templates for deals',
      events_access: 'Access platform-hosted events based on your subscription',
      verification_badge: 'Badge available for purchase after identity review',
      search_access: 'Browse a set number of entrepreneur and investor profiles',
      service_listing: 'List services in the Agent Directory to attract leads',
      document_review: 'Basic access to pitch decks and shared documents',
      profile_update: 'Edit your profile periodically to stay up to date',
      profile_boost: 'Boost your profile visibility for higher engagement',
      project_search: 'Explore startups by region or type',
      investor_dashboard: 'View saved and contacted startups',
      connection_access: 'Contact entrepreneurs and agents yearly',
      flag_projects: 'Request agent help on selected deals',
      fund_verification_badge: 'Verification after fund review',
      pitch_deck_access: 'View decks shared by entrepreneurs',
      lead_access: 'Purchase leads to start conversations',
      entrepreneur_contact_limit: 'Number of entrepreneurs you can contact'
    };

    return descriptions[featureKey] || featureKey.replace(/_/g, ' ');
  };

  // Fallback data in case API fails
  const getFallbackPlans = (type) => {
    if (type === 'entrepreneur') {
      return [
        {
          title: "Basic",
          price: 15,
          tier: "basic",
          features: [
            { name: "Project Submission", description: "Launch and showcase your business projects/year", value: "3" },
            { name: "Pitch Deck Builder", description: "Build compelling decks with AI", value: "3" },
            { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Once a month" },
            { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
          ],
        },
        {
          title: "Pro",
          price: 49,
          tier: "pro",
          features: [
            { name: "Project Submission", description: "Launch and showcase your business projects/year", value: "5" },
            { name: "Pitch Deck Builder", description: "Build compelling decks with AI", value: "5" },
            { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Once a month" },
            { name: "Analytics Access", description: "Track your reach and visibility", value: "365" },
          ],
        },
        {
          title: "Elite",
          price: 199,
          tier: "elite",
          features: [
            { name: "Project Submission", description: "Launch and showcase your business projects/year", value: "10" },
            { name: "Pitch Deck Builder", description: "Build compelling decks with AI", value: "10" },
            { name: "Profile Updates", description: "Keep your profile fresh and active", value: "Twice a month" },
            { name: "Analytics Access", description: "Track your reach and visibility", value: "No limit" },
          ],
        },
      ];
    } else if (type === 'agent') {
      return [
        {
          title: "Basic",
          price: 29,
          tier: "basic",
          features: [
            { name: "Search Access", description: "Browse a set number of entrepreneur and investor profiles", value: "250" },
            { name: "Service Listing", description: "List services in the Agent Directory to attract leads", value: "3" },
            { name: "Document Review", description: "Basic access to pitch decks and shared documents", value: "100" },
          ],
        },
        {
          title: "Pro",
          price: 129,
          tier: "pro",
          features: [
            { name: "Search Access", description: "Browse a set number of entrepreneur and investor profiles", value: "1000" },
            { name: "Service Listing", description: "List services in the Agent Directory to attract leads", value: "5" },
            { name: "Document Review", description: "Basic access to pitch decks and shared documents", value: "500" },
          ],
        },
        {
          title: "Elite",
          price: 299,
          tier: "elite",
          features: [
            { name: "Search Access", description: "Browse a set number of entrepreneur and investor profiles", value: "Unlimited" },
            { name: "Service Listing", description: "List services in the Agent Directory to attract leads", value: "15" },
            { name: "Document Review", description: "Basic access to pitch decks and shared documents", value: "Unlimited" },
          ],
        },
      ];
    } else {
      return [
        {
          title: "Basic",
          price: 15,
          tier: "basic",
          features: [
            { name: "Project Search", description: "Explore startups by region or type", value: "250" },
            { name: "Investor Dashboard", description: "View saved and contacted startups", value: "365 days" },
            { name: "Connection Access", description: "Contact entrepreneurs and agents yearly", value: "100" },
          ],
        },
        {
          title: "Pro",
          price: 49,
          tier: "pro",
          features: [
            { name: "Project Search", description: "Explore startups by region or type", value: "20" },
            { name: "Investor Dashboard", description: "View saved and contacted startups", value: "365 days" },
            { name: "Connection Access", description: "Contact entrepreneurs and agents yearly", value: "No limit" },
          ],
        },
        {
          title: "Elite",
          price: 199,
          tier: "elite",
          features: [
            { name: "Project Search", description: "Explore startups by region or type", value: "30" },
            { name: "Investor Dashboard", description: "View saved and contacted startups", value: "365 days" },
            { name: "Connection Access", description: "Contact entrepreneurs and agents yearly", value: "No limit" },
          ],
        },
      ];
    }
  };

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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading subscription plans...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {subscriptions.entrepreneur && subscriptions.entrepreneur.length > 0 && (
                <>
                  <PlanSection
                    title="Entrepreneur Plans"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>}
                    plans={subscriptions.entrepreneur}
                  />
                  <div className="border-t border-gray-200 my-16"></div>
                </>
              )}

              {subscriptions.agent && subscriptions.agent.length > 0 && (
                <>
                  <PlanSection
                    title="Agent Plans"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>}
                    plans={subscriptions.agent}
                  />
                  <div className="border-t border-gray-200 my-16"></div>
                </>
              )}

              {subscriptions.investor && subscriptions.investor.length > 0 && (
                <PlanSection
                  title="Investor Plans"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>}
                  plans={subscriptions.investor}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Foooter />
    </>
  );
};

export default Pricing;
