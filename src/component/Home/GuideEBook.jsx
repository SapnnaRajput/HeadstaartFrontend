import Footer from './Foooter';
import Navbar from './Navbar';
import { Presentation, DollarSign,  Briefcase , Search, Handshake, TrendingUp , FileSignature, FileText  } from 'lucide-react';

const topics = [
  {
    title: 'How to Build a Winning Pitch Deck',
    description:
      'A step-by-step guide to using AI-powered pitch deck creation for maximum impact.',
    icon: <Presentation size={32} className="text-white" />,
  },
  {
    title: 'Startup Funding 101',
    description:
      'Learn the different types of funding, from angel investments to venture capital.',
    icon: <DollarSign size={32} className="text-white" />,
  },
  {
    title: 'Legal Essentials for Entrepreneurs',
    description:
      'Understand the key legal documents every business needs and how to use Headstaart’s digital signing feature.',
    icon: <FileText size={32} className="text-white" />,
  },
  {
    title: 'How to Sell Your Business Successfully',
    description:
      'A complete guide to structuring your business for sale and attracting buyers.',
    icon: <Briefcase size={32} className="text-white" />,
  },
];

const insights = [
  {
    title: "Investor’s Guide to Finding the Next Big Startup",
    description:
      "Learn how to evaluate startups, manage risks, and make profitable investments.",
    icon: <Search size={32} className='text-white' />,
  },
  {
    title: "Becoming a Successful Business Agent",
    description:
      "A guide to facilitating deals, negotiating agreements, and leveraging Headstaart’s verified blue tick for credibility.",
    icon: <Handshake size={32} className='text-white' />,
  },
  {
    title: "The Future of Entrepreneurship: Trends & Insights",
    description:
      "Stay ahead with expert insights on market trends and innovative business strategies.",
    icon: <TrendingUp size={32} className='text-white' />,
  },
];

const documents = [
  {
    title: "Understanding NDAs, Term Sheets & Investment Agreements",
    description:
      "Learn how to use Headstaart’s legal document templates and digital signing features.",
    icon: <FileSignature size={32} className='text-white' />,
  },
  {
    title: "Commission Agreements for Business Agents",
    description:
      "A guide to structuring fair and secure agent commissions.",
    icon: <FileText size={32} className='text-white' />,
  },
];

const GuideEBook = () => {
  return (
    <>
      <Navbar />
      <div className="h-auto p-7 sm:px-20 space-y-20">
        <div className="h-auto">
          <h1 className="text-5xl my-2 font-semibold text-center text-[#4A3AFF]">
            Guides & E-Books
          </h1>
          <p className="text-center mb-2 text-gray-700">
            At Headstaart, we equip entrepreneurs, investors, and business
            agents with expertly crafted guides and e-books to navigate the
            world of startups, investments, and deal-making with confidence.
          </p>
        </div>

        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            📖 Startup & Business Guides
          </h1>
          <div className="flex mt-4 flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              {topics.map((topic) => (
                <div
                  key={topic.title}
                  className="flex  gap-2 flex-col border p-3 rounded-md"
                >
                  <div className='flex items-center gap-2'>
                    <div className="bg-[#4A3AFF] flex justify-center items-center w-14 h-14 p-2 rounded-full">
                      {topic.icon}
                    </div>
                    <h2 className="font-semibold">{topic.title}</h2>
                  </div>
                  <p className='text-gray-700 text-sm'>{topic.description}</p>
                </div>
              ))}
            </div>
            <img
              className="w-full sm:w-1/2 h-auto object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>

        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
          💡 Investment & Business Agent E-Books
          </h1>
          <div className="flex  mt-4 flex-col sm:flex-row items-center gap-6">
          <img
              className="w-full sm:w-1/2 h-auto object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              {insights.map((insight) => (
                <div
                  key={insight.title}
                  className="flex  gap-2 flex-col border p-3 rounded-md"
                >
                  <div className='flex items-center gap-2'>
                    <div className="bg-[#4A3AFF] flex justify-center items-center w-14 h-14 p-2 rounded-full">
                      {insight.icon}
                    </div>
                    <h2 className="font-semibold">{insight.title}</h2>
                  </div>
                  <p className='text-gray-700 text-sm'>{insight.description}</p>
                </div>
              ))}
            </div>
          
          </div>
        </div>

        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
          📜 Legal Document Walkthroughs
          </h1>
          <div className="flex  mt-4 flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              {documents.map((insight) => (
                <div
                  key={insight.title}
                  className="flex  gap-2 flex-col border p-3 rounded-md"
                >
                  <div className='flex items-center gap-2'>
                    <div className="bg-[#4A3AFF] flex justify-center items-center w-14 h-14 p-2 rounded-full">
                      {insight.icon}
                    </div>
                    <h2 className="font-semibold">{insight.title}</h2>
                  </div>
                  <p className='text-gray-700 text-sm'>{insight.description}</p>
                </div>
              ))}
            </div>
            <img
              className="w-full sm:w-1/2 h-auto object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1603796846097-bee99e4a601f?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default GuideEBook;
