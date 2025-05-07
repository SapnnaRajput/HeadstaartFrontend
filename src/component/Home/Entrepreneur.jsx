import React from 'react';
import { BriefcaseBusinessIcon, Check, GraduationCap, X } from 'lucide-react';
import Footer from './Foooter';
import Navbar from './Navbar';
import Img1 from '../../Assets/Images/entrepreneur1.jpg';
import img2 from '../../Assets/Images/ent-3.jpg';
import img3 from '../../Assets/Images/ent-5.png';
import img4 from '../../Assets/Images/Blog-1.jpg';

import {
  Rocket,
  BarChart,
  FileText,
  Briefcase,
  DollarSign,
} from 'lucide-react';

const features = [
  {
    title: 'AI-Powered Pitch Deck Creation',
    description:
      'Craft a professional and investor-ready pitch deck in minutes with our AI-powered tool. Simply answer key business questions, and our AI will generate a structured, compelling presentation to showcase your startup effectively.',
    icon: <Rocket className="text-white" />,
  },
  {
    title: 'Standardized Business Creation Tools',
    description:
      'Struggling with structuring your business? We offer step-by-step business creation tools to help entrepreneurs define their vision, financials, and market strategy, ensuring a solid foundation for success.',
    icon: <BarChart className="text-white" />,
  },
  {
    title: 'Legal Document Templates & Digital Signing',
    description:
      'Access a library of ready-to-use legal documents essential for startups, including NDAs, investment agreements, partnership contracts, and more. Entrepreneurs can share and sign these documents digitally within the platform, ensuring secure and efficient business transactions.',
    icon: <FileText className="text-white" />,
  },
  {
    title: 'Connect with Investors & Agents',
    description: [
      'Entrepreneurs can list their startups and showcase them to verified investors actively seeking new opportunities.',
      'Business agents are available to help facilitate deals, negotiate contracts, and connect you with the right investors for growth.',
    ],
    icon: <Briefcase className="text-white" />,
  },
  {
    title: 'Funding & Business Sale Opportunities',
    description: [
      'Choose to sell equity in your startup or secure investments from interested backers.',
      'Looking for an exit? Entrepreneurs can list their businesses for sale, connecting with serious buyers or investment groups.',
    ],
    icon: <DollarSign className="text-white" />,
  },
  {
    title: 'Student Entrepreneurs’ Special Access',
    description:
      'We understand that student entrepreneurs often face additional barriers. Headstaart offers a dedicated space for student-led startups, ensuring visibility and tailored support for young innovators.',
    icon: <GraduationCap className="text-white" />,
  },
];

// const blogData = [
//     {
//       id: 1,
//       title: "Who is the best singer on chart? Know him?",
//       category: "Travel",
//       date: "13 March 2023",
//       description: "chart by Billboard which ranks the all-time greatest artists based on their performance on the weekly Billboard Hot 100 and",
//       image: "/api/placeholder/400/300",
//     },
//     {
//       id: 2,
//       title: "How to start export import business from home?",
//       category: "DEVELOPMENT",
//       date: "11 March 2023",
//       description: "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs",
//       image: "/api/placeholder/400/300",
//     },
//     {
//       id: 3,
//       title: "Make some drinks with chocolates chocolates and milk",
//       category: "",
//       date: "10 March 2023",
//       description: "Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment survival strategies to ensure proactive",
//       image: "/api/placeholder/400/300",
//     }
//   ];

const LearningPlatform = () => {
  return (
    <>
      <Navbar />
      {/* <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">How Entrepreneurs Work</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          LearnEase is an innovative online learning platform designed to make education accessible, engaging,
          and adaptable to your lifestyle. It offers a diverse range of courses taught by experts in various fields.
          With LearnEase, you can learn at your own pace, interact with fellow learners, and gain valuable skills
          through practical and interactive lessons.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Everything you can do in a physical, you can do with{' '}
            <span className="text-indigo-600 hover:text-indigo-700 transition-colors">
              HeadStaart
            </span>
          </h2>
          <p className="text-gray-600">
            With LearnEase, the virtual classroom experience is elevated to match every aspect of a physical classroom.
            From engaging interactions with expert instructors and collaborative discussions with peers to hands-on projects
            and personalized learning paths.
          </p>
        </div>
        <div className="relative group">
          <div className="overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
            <img 
              src={Img1} 
              alt="Classroom Setting" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-indigo-100 rounded-full p-2">
                <span className="text-sm text-indigo-600 font-medium">Question 1</span>
              </div>
              <div className="flex space-x-2">
                <div className="p-1 rounded-full bg-red-100">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <div className="p-1 rounded-full bg-green-100">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">True or false? This play takes place in London</h3>
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={Img1} 
                alt="London Bridge" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 transform transition-transform hover:scale-105">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">Your answer was sent successfully</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-indigo-600">Project Creation</h3>
          <p className="text-gray-600">
            Easily launch live assignments, quizzes, and tests. Student results are automatically entered in the
            online gradebook.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
          Tools  {' '}
            <span className="text-indigo-600 hover:text-indigo-700 transition-colors">
            For Entrepreneur
            </span>
          </h2>
          <p className="text-gray-600">
            With LearnEase, the virtual classroom experience is elevated to match every aspect of a physical classroom.
            From engaging interactions with expert instructors and collaborative discussions with peers to hands-on projects
            and personalized learning paths.
          </p>
        </div>
        <div className="relative group">
          <div className="overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
            <img 
              src={img2} 
              alt="Classroom Setting" 
              className="w-full h-1/2 object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="relative group">
          <div className="overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]">
            <img 
              src={img3} 
              alt="Classroom Setting" 
              className="w-full h-1/2 object-cover"
            />
          </div>
        </div>
        

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
          AI Assisted Pitch Deck  {' '}
            <span className="text-indigo-600 hover:text-indigo-700 transition-colors">
            Tools for Entrepruner
            </span>
          </h2>
          <p className="text-gray-600">
          Class provides tools to help run and manage the class such as Class Roster, Attendance, and more. With the Gradebook, teachers can review and grade tests and quizzes in real-time.
          </p>
        </div>
        
      </div>
      
    </div> */}

      {/* <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Popular Blog</h2> */}
      {/* <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
          View All
        </button> */}
      {/* </div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      {/* {blogData.map((blog) => ( */}
      {/* <div  */}
      {/* key={blog.id} 
            className="group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-56 overflow-hidden"> */}
      {/* <img
                src={img4}
                alt={blog.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div> */}
      {/*             
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4 text-sm">
                {blog.category && (
                  <span className="text-gray-600">{blog.category}</span>
                )}
                <span className="text-gray-400">{blog.date}</span>
              </div>
               */}
      {/* <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                {blog.title}
              </h3> */}

      {/* <p className="text-gray-600 line-clamp-2">
                {blog.description}
              </p> */}

      {/* <button className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors duration-200">
                Read More...
              </button> */}
      {/* </div>
          </div>
        ))} */}
      {/* </div>
    </div> */}

      <div className="px-5 sm:px-20 py-10 space-y-10 ">
        <div className=" mb-10">
          <h1 className="text-4xl text-center sm:text-5xl font-bold text-[#4A3AFF]">
            Services for Entrepreneurs
          </h1>
          <p className="mt-4 text-center text-gray-700 max-w-2xl mx-auto">
            At Headstaart, we provide entrepreneurs—whether student innovators
            or experienced founders—with the tools, connections, and
            resources needed to launch, grow, and secure funding for their
            businesses.
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
            Your Vision, Your Business—We Provide the{' '}
            <strong className="text-[#4A3AFF]">Headstaart</strong>
          </h1>
          <p className="text-gray-700 mt-3">
            Join Headstaart and gain access to AI-driven tools, investor
            networks, and digital legal solutions to take your startup to the
            next level!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LearningPlatform;
