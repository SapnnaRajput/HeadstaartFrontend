import React, { useEffect, useState } from 'react';
import { Mail, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';

const Investor = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentProject, setCurrentProject] = useState(null);
  const [hasLead, setHasLead] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/get_entrepreneur_client_overview`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setProjects(response.data.project_details || []);
        } else {
          notify('error', response.data.message);
        }
      } catch (error) {
        notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [baseUrl, user?.token]);

  const handleStartChat = () => {
    setShowModal(false);
  };

  const handleBuyLead = () => {
    setShowModal(false);
  };

  const handleMessage = async (isLead, projectId) => {
    setCurrentProject(projectId);
    
    if (!isLead) {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/lead_detail`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        
        setHasLead(response.data.status);
        setModalMessage(response.data.message);
        setShowModal(true);
        
      } catch (error) {
        notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    } else if(isLead){
      
    }
  };


  return (
    <>
      {loading && <Loader />}
      <div className="container mx-auto rounded-xl md:p-6 p-3 bg-white">
        <h1 className="text-2xl font-semibold mb-6 text-[#05004E]">Opportunity</h1>
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No investors found</div>
        ) : (
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
            {projects.map((project) => (
              <div
                key={project.project_unique_id}
                className="shadow-xl rounded-xl overflow-hidden"
              >
                <img
                  src={project.projectMedia?.find(media => media.media_type === 'photo')?.media_link || '/default-project.png'}
                  alt={project.title}
                  className="w-full h-40 object-cover"
                />
                <div className="flex flex-col pt-2 gap-1 justify-center place-items-center p-3">
                  <h1 className="font-bold text-sm text-center">{project.title}</h1>
                  <span className="text-xs text-[#767676]">{project.company_name}</span>
                  <div className="text-xs text-[#767676] mt-1">
                    {project.city.city_name}, {project.state.state_name}
                  </div>
                  <div className="text-xs font-semibold text-[#05004E] mt-1">
                    Fund Amount: ${project.fund_amount}
                  </div>
                  <div className="text-xs text-[#767676]">
                    Equity: {project.equity}%
                  </div>
                  <button
                    className="mt-5 text-[#767676] border-[#767676] px-3 mb-3 py-1 flex flex-row place-items-center gap-3 rounded-md border hover:bg-gray-100 transition-colors"
                    onClick={() => handleMessage(project.isLead, project.project_unique_id)}
                  >
                    <Mail />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Lead Information</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6">
              <p className="text-center mb-6">{modalMessage}</p>
              {hasLead ? (
                <button
                  onClick={handleStartChat}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Start Chat
                </button>
              ) : (
                <button
                  onClick={handleBuyLead}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Buy Lead
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Investor;