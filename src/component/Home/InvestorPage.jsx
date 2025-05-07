import React from 'react';
import Investor from '../../Assets/Images/investor.png';
import Navbar from './Navbar';
import Footer from './Foooter';
import {
  Search,
  BarChart,
  FileText,
  Briefcase,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    title: 'Discover Investment Opportunities',
    description: [
      'Browse and filter startups and businesses by industry, location, and stage.',
      'Access verified entrepreneurs, including student founders, to discover the next big idea.',
      'View detailed business information and pitch decks to make informed investment decisions.',
    ],
    icon: <Search className="text-white w-8 h-8" />,
  },
  {
    title: 'AI-Powered Pitch Decks & Business Insights',
    description: [
      'Evaluate AI-generated pitch decks that present startups in a structured and investor-friendly format.',
      'Gain insights into business models, market positioning, and growth potential.',
    ],
    icon: <BarChart className="text-white w-8 h-8" />,
  },
  {
    title: 'Legal Document Templates & Digital Signing',
    description: [
      'Access standardized investment agreements, term sheets, NDAs, and other legal documents.',
      'Securely share and sign legal contracts digitally within the platform, making investment deals fast and seamless.',
    ],
    icon: <FileText className="text-white w-8 h-8" />,
  },
  {
    title: 'Connect with Entrepreneurs & Business Agents',
    description: [
      'Directly engage with founders or work with professional business agents who can facilitate negotiations.',
      'Verified investors receive a blue tick, adding credibility and ensuring exclusive access to serious entrepreneurs.',
    ],
    icon: <Briefcase className="text-white w-8 h-8" />,
  },
  {
    title: 'Flexible Investment & Acquisition Options',
    description: [
      'Invest in early-stage startups or buy equity stakes in growing businesses.',
      'Looking for acquisitions? Browse businesses available for full sale and connect with sellers.',
    ],
    icon: <Landmark className="text-white w-8 h-8" />,
  },
  {
    title: 'Verified Investor Benefits',
    description:
      'To enhance credibility and trust, investors must undergo a one-time fund verification process. Verified investors get a blue tick badge, ensuring entrepreneurs recognize them as serious backers.',
    icon: <ShieldCheck className="text-white w-8 h-8" />,
  },
];

// const data = [
const InvestmentJourney = () => {
  //   {
  //     icon: TrendingUp,
  //     title: 'Understanding Markets',
  //     description: 'Learn how financial markets work and what drives their movements',
  //     color: 'text-blue-500'
  //   },
  //   {
  //     icon: Landmark,
  //     title: 'Investment Types',
  //     description: 'Explore different investment vehicles and their characteristics',
  //     color: 'text-blue-500'
  //   },
  //   {
  //     icon: Shield,
  //     title: 'Risk Management',
  //     description: 'Master the principles of managing investment risks effectively',
  //     color: 'text-blue-500'
  //   },
  //   {
  //     icon: BarChart,
  //     title: 'Portfolio Building',
  //     description: 'Create and maintain a well-balanced investment portfolio',
  //     color: 'text-blue-500'
  //   }
  // ];

  // const steps = [
  //   {
  //     number: '01',
  //     icon: Search,
  //     title: 'Research & Learn',
  //     description: 'Study market trends, analyze companies, and understand investment options'
  //   },
  //   {
  //     number: '02',
  //     icon: Scale,
  //     title: 'Choose Your Investment',
  //     description: 'Select investments that align with your goals and risk tolerance'
  //   },
  //   {
  //     number: '03',
  //     icon: BarChart,
  //     title: 'Monitor & Adjust',
  //     description: 'Track performance and rebalance your portfolio when needed'
  //   }
  // ];

  // const investments = [
  //   {
  //     Icon: TrendingUp,
  //     title: 'Stocks',
  //     riskLevel: 'Medium-High',
  //     description: 'Own shares in publicly traded companies'
  //   },
  //   {
  //     Icon: Shield,
  //     title: 'Bonds',
  //     riskLevel: 'Low-Medium',
  //     description: 'Lend money to governments or corporations'
  //   },
  //   {
  //     Icon: BarChart2,
  //     title: 'ETFs',
  //     riskLevel: 'Varies',
  //     description: 'Diversified funds traded like stocks'
  //   },
  //   {
  //     Icon: DollarSign,
  //     title: 'Mutual Funds',
  //     riskLevel: 'Varies',
  //     description: 'Professionally managed investment pools'
  //   },
  //   {
  //     Icon: Building2,
  //     title: 'Real Estate',
  //     riskLevel: 'Medium',
  //     description: 'Property and REIT investments'
  //   },
  //   {
  //     Icon: Bitcoin,
  //     title: 'Cryptocurrency',
  //     riskLevel: 'High',
  //     description: 'Digital currency investments'
  //   }
  // ];

  // const resources = [
  //   {
  //     Icon: PlayCircle,
  //     title: 'Video Tutorials',
  //     description: 'Watch expert-led videos on investment strategies',
  //     action: 'Watch Now',
  //     link: '#'
  //   },
  //   {
  //     Icon: FileText,
  //     title: 'Investment Guides',
  //     description: 'Download comprehensive PDF guides',
  //     action: 'Download',
  //     link: '#'
  //   },
  //   {
  //     Icon: BarChart2,
  //     title: 'Market Analysis',
  //     description: 'Access daily market insights and reports',
  //     action: 'Read More',
  //     link: '#'
  //   }
  // ];

  // const experts = [
  //   {
  //     name: 'David Anderson',
  //     role: 'Investment Strategist',
  //     quote: 'Diversification is key to reducing investment risk.'
  //   },
  //   {
  //     name: 'Sarah Johnson',
  //     role: 'Financial Advisor',
  //     quote: 'Start early and invest regularly for long-term growth.'
  //   },
  //   {
  //     name: 'Michael Chen',
  //     role: 'Market Analyst',
  //     quote: 'Research thoroughly before making investment decisions.'
  //   }
  // ];

  const handleClick = () => {
    navigate('/sign-up-as');
  };

  return (
    <>
      <Navbar />
      {/* <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your Investment Journey Today
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Learn the fundamentals of successful investing and build your financial future with confidence.
          </p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Begin Learning
          </button>
        </div>
        <div className="md:w-1/2">
          <img 
            src={Investor}
            alt="Investment Growth" 
            className="w-full h-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.map((datasingle, index) => (
          <div 
            key={index} 
            className="group flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
          >
            <datasingle.icon 
              className={`${datasingle.color} w-12 h-12 mb-4 group-hover:scale-110 transition-transform`} 
            />
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              {datasingle.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {datasingle.description}
            </p>
          </div>
        ))}
      </div>
    </div> */}
      {/* <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">How Investing Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="group flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
          >
            <div className="relative mb-6">
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-blue-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative z-10 bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                {step.number}
              </div>
            </div>
            <step.icon 
              className="text-blue-500 w-12 h-12 mb-4 group-hover:scale-110 transition-transform" 
            />
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div> */}
      {/* <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-12">Investment Options</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map((investment, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-500 group"
          >
            <div className="flex items-start space-x-4">
              <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <investment.Icon size={32} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{investment.title}</h3>
                <p className="text-sm text-blue-600 mb-2">
                  Risk Level: {investment.riskLevel}
                </p>
                <p className="text-gray-600 text-sm">
                  {investment.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div> */}
      {/* <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-12">Free Learning Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-xl hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-blue-600 mb-4">
              <resource.Icon size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
            <a 
              href={resource.link} 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {resource.action}
              <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        ))}
      </div>
    </div> */}

      {/* <div className="container mx-auto px-4 py-12">
      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-center mb-12">Expert Investment Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <User size={48} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-semibold mb-1">{expert.name}</h3>
                <p className="text-blue-600 text-sm mb-4">{expert.role}</p>
                <p className="text-gray-600 text-sm italic">"{expert.quote}"</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-600 text-white py-16 px-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="mb-8 text-blue-100">
            Join thousands of successful investors and begin your journey today.
          </p>
          <button onClick={handleClick} className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300">
            Create Your Account
          </button>
        </section>
      </div>
    </div> */}
      <div className="px-5 sm:px-20 py-10 space-y-10 ">
        <div className=" mb-10">
          <h1 className="text-4xl text-center sm:text-5xl font-bold text-[#4A3AFF]">
            Services for Investors
          </h1>
          <p className="mt-4 text-center text-gray-700 max-w-2xl mx-auto">
            At Headstaart, we provide investors with exclusive access
            to high-potential startups and businesses, along with AI-driven
            tools and secure legal solutions to streamline the investment
            process. Whether you're looking to invest in early-stage startups,
            student-led ventures, or established businesses, our platform
            ensures trust, transparency, and efficiency in deal-making.
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
            Unlock Exclusive Investment Deals on{' '}
            <strong className="text-[#4A3AFF]">Headstaart</strong>
          </h1>
          <p className="text-gray-700 mt-3">
          Join Headstaart today and discover AI-driven investment opportunities, verified entrepreneurs, and secure digital transactions—all in one place.</p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default InvestmentJourney;
