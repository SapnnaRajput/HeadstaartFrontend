import React from 'react';
import Navbar from './Navbar';
import Footer from './Foooter';
import {
  Users,
  Briefcase,
  Handshake,
  Mic,
  Globe,
  Star,
  Monitor,
  Lightbulb,
  HandshakeIcon,
  ShieldCheck,
  BarChart,
  Megaphone,
  Network,
  CheckCircle,
  Filter,
  List,
  UserCheck,
  Layers,
  RefreshCw,
  Cpu,
  DollarSign,
} from 'lucide-react';

const eventCategories = [
  {
    title: 'Networking Events',
    description:
      'Build powerful connections with investors, entrepreneurs, and agents in structured networking sessions.',
    icon: <Users className="w-6 h-6 text-white" />,
  },
  {
    title: 'Investor-Entrepreneur Forums',
    description:
      'Entrepreneurs showcase their businesses while investors explore high-potential ventures.',
    icon: <Briefcase className="w-6 h-6 text-white" />,
  },
  {
    title: 'Business Agent Roundtables',
    description:
      'A dedicated space for business agents to discuss deals, market trends, and investment matchmaking.',
    icon: <Handshake className="w-6 h-6 text-white" />,
  },
  {
    title: 'Pitch Competitions',
    description:
      'Entrepreneurs get the chance to pitch their ideas to investors, receive feedback, and attract funding.',
    icon: <Mic className="w-6 h-6 text-white" />,
  },
  {
    title: 'Industry-Specific Panels & Webinars',
    description:
      'Gain expert insights from industry leaders and seasoned investors on business growth, fundraising, and deal structuring.',
    icon: <Globe className="w-6 h-6 text-white" />,
  },
  {
    title: 'Exclusive VIP Investor Meetings',
    description:
      'A high-value opportunity for select entrepreneurs to present directly to investors in a closed, high-impact setting.',
    icon: <Star className="w-6 h-6 text-white" />,
  },
  {
    title: 'Virtual & Global Events',
    description:
      'Connect with industry leaders, investors, and entrepreneurs worldwide in online sessions.',
    icon: <Monitor className="w-6 h-6 text-white" />,
  },
];

const whyEvents = [
  {
    title: 'Expand Your Business Network',
    description:
      'Meet verified investors, agents, and entrepreneurs actively looking for opportunities.',
    icon: <Users className="w-6 h-6 text-white" />,
  },
  {
    title: 'Discover Investment-Worthy Projects',
    description:
      'Investors gain early access to high-potential startups and businesses.',
    icon: <Briefcase className="w-6 h-6 text-white" />,
  },
  {
    title: 'Pitch with Confidence',
    description:
      'Entrepreneurs can showcase their ideas in structured pitch events to attract funding and partnerships.',
    icon: <Mic className="w-6 h-6 text-white" />,
  },
  {
    title: 'Learn & Grow',
    description:
      'Get expert insights on fundraising, valuation, business scaling, and deal structuring.',
    icon: <Lightbulb className="w-6 h-6 text-white" />,
  },
  {
    title: 'Find the Right Business Agents',
    description:
      'Entrepreneurs and investors connect with top business agents to streamline negotiations and secure better deals.',
    icon: <HandshakeIcon className="w-6 h-6 text-white" />,
  },
  {
    title: 'Meet Verified Investors & Entrepreneurs',
    description: 'Gain access to serious investors and high-growth startups.',
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
  },
  {
    title: 'Exclusive Investment Insights',
    description:
      'Stay ahead with expert panels, funding trends, and deal analysis.',
    icon: <BarChart className="w-6 h-6 text-white" />,
  },
  {
    title: 'Pitch Your Business & Get Noticed',
    description:
      'Perfect your pitch and attract investor attention in real-time.',
    icon: <Megaphone className="w-6 h-6 text-white" />,
  },
  {
    title: 'Curated Networking',
    description:
      'We ensure high-quality connections that match your business goals.',
    icon: <Network className="w-6 h-6 text-white" />,
  },
];

const approachEvents = [
  {
    title: 'Pre-Screened Participants',
    description:
      'We ensure that only serious entrepreneurs, investors, and business agents participate, minimizing time wasted on unqualified connections.',
    icon: CheckCircle,
  },
  {
    title: 'Curated Matchmaking',
    description:
      'Using AI-driven insights and industry-specific filters, we connect participants with the most relevant investors, startups, and business agents.',
    icon: Filter,
  },
  {
    title: 'Structured Networking Formats',
    description: (
      <>
        <p>
          Instead of random, unorganized interactions, our networking sessions
          include:
        </p>
        <ul className="list-disc pl-5">
          <li>
            Speed Networking – Quick, structured meetings to maximize
            interactions.
          </li>
          <li>
            Roundtable Discussions – Topic-driven sessions to discuss industry
            trends, funding strategies, and partnership opportunities.
          </li>
          <li>
            One-on-One Investor Meetings – Exclusive slots where investors and
            entrepreneurs connect privately.
          </li>
        </ul>
      </>
    ),
    icon: List,
  },
  {
    title: 'Verified Investor & Agent Profiles',
    description:
      'We offer blue tick verification for investors and business agents, ensuring authenticity and credibility in every interaction.',
    icon: UserCheck,
  },
  {
    title: 'Industry-Specific Connections',
    description:
      'Whether you’re in tech, healthcare, fintech, fashion, or any other industry, our platform ensures you network within your niche for highly relevant business opportunities.',
    icon: Layers,
  },
  {
    title: 'Follow-Up & Deal Support',
    description: (
      <>
        <p>Our networking doesn’t stop after the event! We provide:</p>
        <ul className="list-disc pl-5">
          <li>
            Post-event connection tools – Stay in touch and schedule follow-up
            meetings.
          </li>
          <li>
            Access to legal document templates – Simplify investment and
            partnership agreements.
          </li>
          <li>
            Priority access to premium events – Continue engaging with top
            investors and entrepreneurs.
          </li>
        </ul>
      </>
    ),
    icon: RefreshCw,
  },
];

const features = [
  {
    icon: <Briefcase size={32} className="text-blue-500" />,
    title: 'Efficient & Targeted',
    description:
      'No wasted time, just meaningful connections with the right people.',
  },
  {
    icon: <Users size={32} className="text-green-500" />,
    title: 'High-Quality Attendees',
    description:
      'Every participant is serious about business growth and investments.',
  },
  {
    icon: <Cpu size={32} className="text-purple-500" />,
    title: 'Data-Driven Matchmaking',
    description:
      'Our AI-powered system ensures you connect with the most relevant contacts.',
  },
  {
    icon: <DollarSign size={32} className="text-yellow-500" />,
    title: 'Exclusive Investor Access',
    description: 'Meet verified investors actively seeking new opportunities.',
  },
];

const EventPage = () => {
  return (
    <>
      <Navbar />
      <div className="h-auto p-7 sm:px-20 space-y-12">
        <div>
          <h1 className="text-5xl my-2 font-semibold text-center text-[#4A3AFF]">
            Headstaart Events
          </h1>
          <p className="text-center mb-2 text-gray-700">
            Where Connections Turn into Opportunities!
          </p>
          <p className="text-center sm:text-start">
            At <strong className="text-[#4A3AFF]">Headstaart</strong>, we
            believe in the power of meaningful connections. Our exclusive
            events are designed to bring together entrepreneurs, investors, and
            business agents to network, pitch, and collaborate in an engaging
            and result-driven environment. Whether you're looking for funding,
            partnerships, or insights, our events provide the perfect platform
            to accelerate your business success.
          </p>
        </div>
        {/* 🚀 Explore Our Event Categories */}
        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            🚀 Explore Our Event Categories
          </h1>
          <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {eventCategories?.map((category) => (
              <div
                className="flex flex-col gap-1 border border-gray-200 p-3 rounded-md"
                key={category.title}
              >
                <div className="bg-[#4A3AFF] h-14 w-14 flex items-center justify-center rounded-full p-3">
                  {category.icon}
                </div>
                <h2 className="font-semibold">{category.title}</h2>
                <p className="text-sm text-gray-500 ">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* 🔥 Why Attend Headstaart Events? */}
        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            🔥 Why Attend Headstaart Events?
          </h1>
          <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {whyEvents?.map((whyEvent) => (
              <div
                className="flex flex-row justify-start items-center gap-5 border border-gray-200 p-3 rounded-md"
                key={whyEvent.title}
              >
                <div className="bg-[#4A3AFF] flex items-center justify-center rounded-full p-3">
                  {whyEvent.icon}
                </div>
                <div className="flex flex-col gap-1 p-1">
                  <h1 className="font-semibold">{whyEvent.title}</h1>
                  <p className="text-sm">{whyEvent.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            🔗 How Headstaart Ensures Quality Networking
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <p className="text-gray-800 font-normal leading-relaxed sm:w-1/2">
              At Headstaart, we go beyond just organizing events—we
              create high-value networking opportunities that lead to real
              connections and successful deals. Our networking events are
              designed to ensure that entrepreneurs, investors, and business
              agents meet the right people, making every interaction purposeful
              and productive.
            </p>
            <img
              className="w-full sm:w-1/2 h-auto object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>

        <div className="h-auto space-y-1">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            🔍 Our Approach to Quality Networking
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {approachEvents.map((event, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-md flex flex-col items-start space-y-4 border border-gray-200 min-h-[200px]"
            >
              <div className="flex gap-4 items-center">
                <event.icon className="w-14 h-14 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {event.title}
                </h3>
              </div>
              <div className="flex-grow">
                {typeof event.description === 'string' ? (
                  <p className="text-gray-600">{event.description}</p>
                ) : (
                  event.description
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            🔗 How Headstaart Ensures Quality Networking
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            className="w-full sm:w-1/2 h-auto object-cover rounded-lg"
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <div className="w-full sm:w-1/2 h-auto flex flex-col gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-md"
              >
                {feature.icon}
                <div className="p-0">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            🎟️ How to Participate?
          </h1>
          <div className="space-y-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            {[
              {
                icon: '1️⃣',
                title: 'Browse Our Event Calendar',
                description:
                  'Discover upcoming networking events, pitch sessions, and investor forums.',
              },
              {
                icon: '2️⃣',
                title: 'Register for an Event',
                description:
                  'Secure your spot for free or opt for premium access for exclusive opportunities.',
                highlight: 'premium access',
                highlightColor: 'text-blue-600',
              },
              {
                icon: '3️⃣',
                title: 'Connect & Engage',
                description:
                  'Pitch your ideas, ask questions, and expand your business network.',
              },
              {
                icon: '4️⃣',
                title: 'Make Deals Happen!',
                description:
                  'Take advantage of the exclusive connections and investment opportunities at Headstaart events.',
                highlight: 'exclusive connections and investment opportunities',
                highlightColor: 'text-green-600',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex flex-col border border-gray-200 p-4 rounded-xl shadow-md bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{step.icon}</span>
                  <p className="font-semibold text-xl text-gray-700">
                    {step.title}
                  </p>
                </div>
                <p className="text-gray-600 mt-2">
                  {step.description
                    .split(step.highlight || '')
                    .map((part, i) => (
                      <span key={i}>
                        {part}
                        {i <
                          step.description.split(step.highlight || '').length -
                            1 && (
                          <span
                            className=' text-[#4A3AFF] font-medium'
                          >
                            {step.highlight}
                          </span>
                        )}
                      </span>
                    ))}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl text-center">
            <p className="text-xl font-bold mb-2">
              🚀 Don’t miss out on the next big opportunity!
            </p>
            <p className="text-lg mb-4">
              📅 Explore & Register for Upcoming Events Now!
            </p>
            <a
              href="/sign-up-as"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              👉 Register Now
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventPage;
