import React from 'react';

import Navbar from './Navbar';
import Footer from './Foooter';

// const services = [
//   {
//     icon: Users,
//     title: 'Network Building',
//     description: 'Connect with top entrepreneurs and investors in your industry',
//     color: 'text-[#4A3AFF]'
//   },
//   {
//     icon: Target,
//     title: 'Deal Sourcing',
//     description: 'Access exclusive investment opportunities and business deals',
//     color: 'text-[#4A3AFF]'
//   },
//   {
//     icon: ChartBar,
//     title: 'Market Analysis',
//     description: 'Get insights into market trends and investment patterns',
//     color: 'text-[#4A3AFF]'
//   },
//   {
//     icon: MessageSquare,
//     title: 'Communication Hub',
//     description: 'Streamlined communication between all parties',
//     color: 'text-[#4A3AFF]'
//   }
// ];

// const opportunities = [
//   {
//     Icon: Building2,
//     title: 'Real Estate',
//     focus: 'Commercial Properties',
//     description: 'Connect property developers with potential investors'
//   },
//   {
//     Icon: TrendingUp,
//     title: 'Tech Startups',
//     focus: 'Series A-C Funding',
//     description: 'Bridge innovative startups with venture capital'
//   },
//   {
//     Icon: Shield,
//     title: 'Private Equity',
//     focus: 'Growth Capital',
//     description: 'Facilitate large-scale investment deals'
//   },
//   {
//     Icon: DollarSign,
//     title: 'Angel Investment',
//     focus: 'Early Stage',
//     description: 'Connect angel investors with promising startups'
//   }
// ];

// const testimonials = [
//   {
//     name: 'Robert Chen',
//     role: 'Investment Agent',
//     quote: 'This platform has transformed how I connect entrepreneurs with investors.',
//     deals: '50+ Deals Closed'
//   },
//   {
//     name: 'Sarah Williams',
//     role: 'Business Agent',
//     quote: 'The tools provided make deal sourcing and management effortless.',
//     deals: '30+ Deals Closed'
//   },
//   {
//     name: 'Mark Thompson',
//     role: 'Real Estate Agent',
//     quote: 'Found amazing opportunities and closed deals faster than ever.',
//     deals: '45+ Deals Closed'
//   }
// ];

import { Briefcase, FileText, Search, CreditCard, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Connect with Entrepreneurs & Investors",
    description: [
      "Discover and engage with startups and businesses looking for funding or buyers.",
      "Find and assist investors who need guidance in securing the right deals.",
      "Expand your client base by connecting with entrepreneurs who need expert help in pitching to investors.",
    ],
    icon: <Briefcase className="text-white w-8 h-8" />,
  },
  {
    title: "Legal Document Templates & Digital Signing",
    description: [
      "Access ready-to-use legal contracts, NDAs, commission agreements, and investment documents.",
      "Digitally share and sign legal documents securely within the platform to facilitate deals efficiently.",
    ],
    icon: <FileText className="text-white w-8 h-8" />,
  },
  {
    title: "Find High-Value Investment & Business Deals",
    description: [
      "Work with entrepreneurs selling equity or full ownership of their businesses.",
      "Assist investors in identifying the right startups to fund based on their interests.",
      "Position yourself as a key player in mergers, acquisitions, and funding negotiations.",
    ],
    icon: <Search className="text-white w-8 h-8" />,
  },
  {
    title: "Premium Lead Access & Membership Benefits",
    description: [
      "Get premium access to exclusive leads by subscribing to Headstaart’s yearly membership for agents.",
      "Agents can pay for high-quality leads on businesses and investors seeking partnerships.",
      "Verified blue tick available only through paid upgrade, enhancing trust and credibility.",
    ],
    icon: <CreditCard className="text-white w-8 h-8" />,
  },
  {
    title: "Verified Agent Status",
    description:
      "To enhance credibility, verified business agents receive a blue tick badge, ensuring entrepreneurs and investors recognize them as trusted professionals.",
    icon: <ShieldCheck className="text-white w-8 h-8" />,
  },
];

const AgentPlatform = () => {

  return (
    <>
    <Navbar/>
    {/* <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Connect, Facilitate, Succeed
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Join our network of professional agents and become the bridge between visionary entrepreneurs and strategic investors.
          </p>
          <button className="bg-[#4A3AFF] text-white px-8 py-4 rounded-lg text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Connecting Today
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <service.icon className={`${service.color} w-12 h-12 mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="text-xl font-semibold mb-2  transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Investment Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <opportunity.Icon className="text-[#4A3AFF] w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                <p className="text-[#4A3AFF] text-sm mb-2">{opportunity.focus}</p>
                <p className="text-gray-600">{opportunity.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex justify-center mb-6">
                  <User className="w-16 h-16 text-[#4A3AFF] group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-1">{testimonial.name}</h4>
                  <p className="text-[#4A3AFF] text-sm mb-2">{testimonial.role}</p>
                  <p className="text-gray-500 text-sm">{testimonial.deals}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#4A3AFF] text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Network?</h2>
          <p className="text-lg mb-8 text-purple-100">
            Join our community of successful agents and start facilitating meaningful connections today.
          </p>
          <button className="bg-white text-[#4A3AFF] px-8 py-4 rounded-lg font-medium hover:bg-purple-50 transition-all duration-300 transform hover:scale-105">
            Create Your Agent Profile
          </button>
        </div>
      </div>
    </div> */}

<div className="px-5 sm:px-20 py-10 space-y-10 ">
        <div className=" mb-10">
          <h1 className="text-4xl text-center sm:text-5xl font-bold text-[#4A3AFF]">
          Services for Business Agents
          </h1>
          <p className="mt-4 text-center text-gray-700 max-w-2xl mx-auto">
          At Headstaart, we empower business agents by providing access to a dynamic marketplace where they can connect with entrepreneurs and investors, facilitate business deals, and grow their network. Our platform streamlines the deal-making process with AI-powered tools, legal document templates, and verified business opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              className="flex flex-col gap-4 border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              key={feature.title}
            >
              <div className="bg-[#4A3AFF] h-16 w-16 flex items-center justify-center rounded-xl">
                {feature.icon}
              </div>
              <h2 className="font-semibold text-lg">{feature.title}</h2>
              {Array.isArray(feature.description) ? (
                <ul className="text-gray-700 list-disc list-inside space-y-1">
                  {feature.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
        <div className="h-auto text-center">
          <h1 className="text-4xl font-semibold">
          Empower Your Deal-Making with {' '}
            <strong className="text-[#4A3AFF]">Headstaart</strong>
          </h1>
          <p className="text-gray-700 mt-3">
          Join Headstaart today and leverage AI-driven tools, a network of entrepreneurs and investors, and secure digital contract solutions to grow your business as an agent.</p>
        </div>
      </div>

    <Footer/>
    </>
  );
};

export default AgentPlatform;