import Navbar from './Navbar';
import Footer from './Foooter';
import {
  UserPlus,
  Briefcase,
  Search,
  TrendingUp,
  FileText,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={24} className="h-14 w-14 text-[#4A3AFF]" />,
    title: 'Sign Up & Create Your Profile',
    details: [
      'Choose your role: Entrepreneur, Investor, or Business Agent.',
      'Provide basic details and verify your account for added credibility.',
      'Investors and Agents can opt for verification (blue tick) through a paid upgrade for increased trust.',
    ],
  },
  {
    icon: <Briefcase size={24} className="h-14 w-14 text-[#4A3AFF]" />,
    title: 'Entrepreneurs – List Your Business or Startup',
    details: [
      'Use AI-powered pitch deck creation to present your startup professionally.',
      'Upload business details, choose whether you are seeking investment, selling equity, or listing for a full sale.',
      'Student entrepreneurs receive a dedicated space for visibility.',
    ],
  },
  {
    icon: <Search size={24} className="h-14 w-14 text-[#4A3AFF]" />,
    title: 'Investors – Discover & Connect with Businesses',
    details: [
      'Browse verified startup listings based on industry, location, and funding needs.',
      'Access AI-generated pitch decks and business details for informed decision-making.',
      'Investors can initiate direct contact or work with business agents for deal facilitation.',
    ],
  },
  {
    icon: <TrendingUp size={24} className="h-14 w-14 text-[#4A3AFF]" />,
    title: 'Business Agents – Find Clients & Close Deals',
    details: [
      'Explore entrepreneur and investor listings to match potential deals.',
      'Offer your expertise in structuring agreements, negotiations, and business matchmaking.',
      'Get premium leads and a verified blue tick through a paid upgrade for increased credibility.',
    ],
  },
  {
    icon: <FileText size={24} className="h-14 w-14 text-[#4A3AFF]" />,
    title: 'Secure Deals with Legal Document Sharing & Digital Signing',
    details: [
      'Use ready-to-use legal document templates for contracts, NDAs, and investment agreements.',
      'Share and sign documents digitally within the platform for a smooth and secure process.',
    ],
  },
  {
    icon: <MessageCircle size={24} className="h-14 w-14 text-[#4A3AFF]" />,
    title: 'Communication & Deal Negotiation',
    details: [
      'Entrepreneurs, investors, and agents can initiate secure conversations within the platform.',
      'Investors and agents can request additional details or schedule meetings with entrepreneurs.',
      'Business agents can negotiate deals on behalf of clients, ensuring smooth transactions.',
    ],
  },
  {
    icon: <ShieldCheck size={24} className="h-14 w-14 text-[#4A3AFF]" />,
    title: 'Paid Verification for Entrepreneurs, Investors & Agents',
    details: [
      'Entrepreneurs, investors, and business agents can pay for a verified blue tick, adding trust and credibility to their profiles.',
      'A verified status increases visibility, attracting more serious connections and opportunities.',
    ],
  },
];

const GettingStart = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 sm:px-20 py-10 ">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4A3AFF]">
            How It Works: Step-by-Step Guide
          </h1>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Joining Headstaart is simple and designed to help entrepreneurs,
            investors, and business agents connect, collaborate, and close deals
            efficiently.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col  items-start border border-gray-200 p-4 rounded-md 
              transition-transform hover:scale-105
              "
            >
              <div className=" w-full flex-col sm:flex-row flex gap-6 justify-start sm:items-center ">
                <div className="flex items-center justify-center w-[67px] h-[67px] rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-2xl w-auto font-semibold text-gray-900">
                  Step {index + 1}: {step.title}
                </h3>
              </div>
              <div className="px-4">
                <ul className="mt-3 space-y-2 list-disc text-gray-700 ">
                  {step.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GettingStart;
