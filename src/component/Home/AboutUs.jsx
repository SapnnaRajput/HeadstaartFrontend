import React from 'react';
import {
  Trophy,
  Users,
  Target,
  Heart,
  Globe,
  TrendingUp,
  MessageCircle,
  Zap,
  Users2,
  Lightbulb,
  Briefcase,
  Rocket,
  Layers,
  BriefcaseBusiness,
  FileText,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Foooter';
import User from '../../Assets/Images/user.png';

// Mission statement content
const MissionStatement = [
  {
    id: 1,
    text: 'At Headstaart, our mission is to empower entrepreneurs, student innovators, investors, and business agents by providing a seamless, AI-driven ecosystem where businesses can launch, grow, and secure funding with confidence.',
    image: <Users2 className="text-white  w-16 h-16" />,
  },
  {
    id: 2,
    text: 'We believe that every entrepreneur—whether a student with a groundbreaking idea or an experienced founder scaling their venture—deserves access to the right tools, connections, and legal resources to succeed.',
    image: <Lightbulb className="text-white   w-16 h-16" />,
  },
  {
    id: 3,
    text: 'With AI-powered pitch deck creation, standardized business-building tools, and a secure platform for sharing and signing legal documents, we ensure that entrepreneurs present their businesses professionally, investors discover verified opportunities, and business agents facilitate seamless deals with trust and efficiency.',
    image: <Briefcase className="text-white  w-16 h-16" />,
  },
  {
    id: 4,
    text: 'At Headstaart, we’re not just building a marketplace; we’re shaping the future of entrepreneurship by making business growth, investment, and collaboration more accessible, transparent, and efficient. 🚀 Every great business deserves a Headstaart—let’s build the future together.',
    image: <Rocket className="text-white  w-16 h-16" />,
  },
];

const AboutUs = () => {
  // const stats = [
  //   { number: "10K+", label: "Active Users" },
  //   { number: "$50M+", label: "Investments Facilitated" },
  //   { number: "1000+", label: "Successful Matches" },
  //   { number: "95%", label: "Satisfaction Rate" }
  // ];

  // const values = [
  //   {
  //     icon: Heart,
  //     title: "Trust",
  //     description: "Building lasting relationships through transparency and integrity"
  //   },
  //   {
  //     icon: Target,
  //     title: "Innovation",
  //     description: "Continuously evolving to meet the changing needs of our community"
  //   },
  //   {
  //     icon: Users,
  //     title: "Community",
  //     description: "Fostering meaningful connections and collaborations"
  //   },
  //   {
  //     icon: Globe,
  //     title: "Impact",
  //     description: "Making a difference in the entrepreneurial ecosystem"
  //   }
  // ];

  // const team = [
  //   {
  //     name: "Sarah Johnson",
  //     role: "CEO & Founder",
  //     description: "Former VC partner with 15+ years of experience in startup ecosystem",
  //     image:User
  //   },
  //   {
  //     name: "Michael Chen",
  //     role: "Chief Technology Officer",
  //     description: "Tech veteran with experience at leading Silicon Valley companies",
  //     image:User
  //   },
  //   {
  //     name: "Emily Rodriguez",
  //     role: "Head of Operations",
  //     description: "Operations expert specialized in scaling startups",
  //     image:User
  //   },
  //   {
  //     name: "David Kim",
  //     role: "Investment Relations",
  //     description: "Former investment banker with extensive network",
  //     image:User
  //   }
  // ];

  // const milestones = [
  //   {
  //     title: "Company Founded",
  //     description: "Started with a vision to business connections"
  //   },
  //   {
  //     title: "Series A Funding",
  //     description: "Raised $10M to expand our platform capabilities"
  //   },
  //   {
  //     title: "Global Expansion",
  //     description: "Launched operations in 15+ countries"
  //   },
  //   {
  //     title: "Platform Evolution",
  //     description: "Introduced AI-powered matching algorithm"
  //   }
  // ];

  return (
    <>
      <Navbar />
      {/* <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white"> */}
      {/* <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Connecting Dreams</span>
                  <span className="block text-blue-600">Building Future</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  We're on a mission to revolutionize how entrepreneurs, investors, and agents connect, collaborate, and succeed together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stat.number}</div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div> */}

      {/* <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-gray-500">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="inline-block p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Leadership Team</h2>
            <p className="mt-4 text-gray-500">Meet the people driving our vision forward</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 mt-1">{member.role}</p>
                  <p className="text-gray-500 mt-2">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      {/* 
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
            <p className="mt-4 text-gray-500">Key milestones that shaped our growth</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative group">
                <div className="bg-blue-100 rounded-lg p-6 hover:bg-blue-200 transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Join Our Community?</h2>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
            Get Started Today
          </button>
        </div>
      </div> */}
      {/* </div> */}

      <div className="px-7 sm:px-20 space-y-10">
        <div>
        <h1 className="text-5xl my-2 font-semibold text-center text-[#4A3AFF]">
          About Us
        </h1>
        <p className=" text-center text-gray-600 mb-6">
            🚀 Every great business deserves a <strong className='text-[#4A3AFF]'>Headstaart
              </strong>-let's build the future
            together.
          </p>
        </div>
        {/* Mission Statement */}
        <div className="h-auto space-y-4">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Mission Statement
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
  {MissionStatement.map((mission) => (
    <div
      key={mission.id}
      className="group bg-white p-6 rounded-md border transition-transform transform hover:scale-105"
    >
      <div className="mb-4 w-20 h-20 flex justify-center items-center bg-[#4A3AFF] p-4 rounded-full transition-all duration-300 group-hover:bg-[#372EFF]">
        {mission.image}
      </div>
      <p className="text-gray-700 pt-2 leading-relaxed ">
        {mission.text}
      </p>
    </div>
  ))}
</div>

          
        </div>

        {/* Our Story */}
        <div className="h-auto space-y-5">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            Our Story
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <p className="text-gray-800 font-normal leading-relaxed sm:w-1/2">
              The journey of{' '}
              <strong className="text-[#4A3AFF]">Headstaart</strong> began with a
              simple yet powerful vision: to create a platform where
              entrepreneurs—especially student innovators—could connect with the
              right investors and business agents to bring their ideas to life.{' '}
              <br />
              <br />
              We recognized a major challenge in the entrepreneurial world:
              brilliant ideas often struggle to get noticed due to a lack of
              funding, mentorship, and the right connections. Many student
              entrepreneurs, in particular, face barriers when trying to secure
              investment or guidance, despite having groundbreaking concepts.
              Likewise, investors and business agents often find it difficult to
              identify vetted, high-potential startups and businesses in need of
              funding and expertise.
            </p>
            <img
              className="w-full sm:w-1/2 h-auto object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Entrepreneurs collaborating in a meeting"
            />
          </div>
        </div>

        {/* How Headstaart is Changing the Game */}
        <div className="h-auto space-y-7">
          <h1 className="text-4xl mt-5 font-semibold text-center text-gray-800">
            How Headstaart is Changing the Game
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <p className="text-gray-800 font-normal leading-relaxed sm:w-1/2">
              To solve these challenges, we built Headstaart—a dynamic
              ecosystem where entrepreneurs, investors, and agents connect,
              collaborate, and grow together. Our platform is more than just a
              listing site; it provides powerful tools that simplify business
              creation, investment, and partnership building.
            </p>
            <div className="flex gap-10 flex-col sm:w-1/2">
              <div className="flex flex-col space-y-6">
                <div className="space-y-1">
                  <Layers className="h-16 w-16 bg-[#4A3AFF] text-white p-4 rounded-full" />
                  <h1 className="font-semibold ">
                    AI-Powered Pitch Deck Creation
                  </h1>
                  <p className="text-sm text-gray-500">
                    Entrepreneurs can now create compelling pitch decks with the
                    help of AI, ensuring their ideas are presented
                    professionally and effectively to investors.
                  </p>
                </div>
                <div className="space-y-1">
                  <BriefcaseBusiness className="h-16 w-16 bg-[#4A3AFF] text-white p-4 rounded-full" />
                  <h1 className="font-semibold ">
                    Standardized Business Creation Tools 
                  </h1>
                  <p className="text-sm text-gray-500">
                    Whether you're a student launching your first startup or an
                    experienced founder, our business-building resources help
                    you structure and refine your venture.
                  </p>
                </div>
                <div className="space-y-1">
                  <FileText className="h-16 w-16 bg-[#4A3AFF] text-white p-4 rounded-full" />
                  <h1 className="font-semibold ">
                    Legal Document Templates & Digital Signing
                  </h1>
                  <p className="text-sm text-gray-500">
                    We provide ready-to-use legal documents for entrepreneurs,
                    student entrepreneurs, agents, and investors, allowing users
                    to share and sign legally binding contracts directly within
                    the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center">
            👉 From <strong className="text-[#4A3AFF]">student-led</strong>{' '}
            startups to established businesses looking for expansion,
            <strong className="text-[#4A3AFF]"> Headstaart</strong> is a place
            where ambitious minds connect with the right resources to
            grow. Whether you're seeking funding, selling your business, or
            facilitating deals, our platform gives you the headstaart you need.
          </p>
        </div>
        <h3 className='text-center text-2xl text-gray-800'>
        🚀 Your success story begins here—because every great business deserves a <strong className='text-[#4A3AFF]'>
        Headstaart. </strong>
        </h3>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
