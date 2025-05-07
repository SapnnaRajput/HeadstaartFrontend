import React, { useEffect, useState } from "react";
import pro2 from "../../Assets/Images/pro2.png";
import pro3 from "../../Assets/Images/pro3.png";
import pro4 from "../../Assets/Images/pro4.png";
import pro5 from "../../Assets/Images/pro5.png";
import home1 from "../../Assets/Images/home.png";
import blob from "../../Assets/Images/blob.png";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Utiles/Loader";
import axios from "axios";

const Hero = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/get_home_project`);
        if (response.data.status) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      setLoading(false);
    };
    getProjects();
  }, []);

  const handleProjectClick = () => {
    navigate(`/sign-up-as`);
  };

  const handleJoinWaitlist = () => {
    navigate(`/getting-started`);
  };

  return (
    <>
      {loading && <Loader />}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-indigo-50 to-white overflow-hidden py-8 sm:py-12">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 items-center gap-6 sm:gap-12">
          <div className="space-y-4 sm:space-y-6 z-10">
            <div className="overflow-hidden">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] tracking-tight">
                Connecting{" "}
                <span className="text-indigo-600 relative inline-block animate-pulse">
                  Entrepreneurs
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></span>
                </span>
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] tracking-tight mt-1 sm:mt-2">
                <span className="text-indigo-600 animate-pulse">Investors</span>{" "}
                and{" "}
                <span className="text-indigo-600 animate-pulse">Agents</span>
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] tracking-tight mt-1 sm:mt-2">
                for Mutual Success
              </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
              Empowering connections that drive innovation, investment, and
              transformative business relationships.
            </p>
            <div className="group">
              <button
                onClick={handleJoinWaitlist}
                className="flex items-center gap-2 sm:gap-3 bg-[#4A3AFF] hover:bg-indigo-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
              >
                Learn More
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="group perspective-1000 hover:scale-105 transition-transform duration-500 ease-out">
              <img
                src={home1}
                alt="Business Connection Illustration"
                className="w-full max-w-sm sm:max-w-md lg:max-w-xl rounded-3xl transform transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>
        </div>
      </section>

      <div
        id="features"
        className="w-full max-w-full px-4 sm:px-6 lg:px-8 mx-auto py-8 sm:py-12 scroll-mt-24"
      >
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover ventures, connect with agents, invest in success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((project) => (
            <div
              key={project.home_project_id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full"
              onClick={handleProjectClick}
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">
                    {project.equity}% Equity Available
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[70%]">
                    {project.name}
                  </h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full whitespace-nowrap">
                    {project.status}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-3">
                  {project.description}
                </p>

                <div className="bg-gray-100 rounded-lg p-2 sm:p-3 mt-auto">
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">
                    Funding: ${parseInt(project.fund_amount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
