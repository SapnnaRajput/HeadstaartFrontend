import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';
import { X, FileText, ChevronLeft, ChevronRight, Eye, PenLine } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';


const ProjectModal = ({ project, isOpen, onClose }) => {
  const photos = project?.projectMedia?.filter(media => media.media_type === 'photo') || [];
  const documents = project?.projectMedia?.filter(media => media.media_type === 'document') || [];

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[70vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-black text-2xl font-semibold">{project.title}</h2>
          <button onClick={onClose} className="text-black p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {photos.length > 0 && (
            <div className="h-48 rounded-lg overflow-hidden">
              <img
                src={photos[0].media_link}
                alt="Project main image"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="text-start grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Company</h4>
              <p className="text-gray-600">{project.company_name}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Website</h4>
              <p className="text-gray-600">{project.website_name}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Category</h4>
              <p className="text-gray-600">{project.category.category_name}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Stage</h4>
              <p className="text-gray-600">{project.stage.business_stage_name}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Investment Required</h4>
              <p className="text-gray-600">${project.fund_amount}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Equity Offered</h4>
              <p className="text-gray-600">{project.equity}%</p>
            </div>
          </div>

          <div>
            <h3 className=" text-xl font-semibold mb-2">About the Project</h3>
            <p className="text-start text-gray-700">{project.description}</p>
          </div>

          {project.additional_info?.length > 0 && (
            <div className='text-start'>
              <h3 className="text-xl font-semibold mb-2">Additional Information</h3>
              <div className="space-y-4">
                {project.additional_info.map((info) => (
                  <div key={info.additional_info_id}>
                    <h4 className="font-medium text-gray-900">{info.heading}</h4>
                    <p className="text-gray-600">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {documents.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Documents</h3>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <a
                    key={doc.project_media_id}
                    href={doc.media_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-blue-600">View Document</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const MessageContent = ({ message, isCurrentUser, list, activeTab }) => {
  
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [loader, setLoader] = useState(false);
  const [senderName, setSenderName] = useState(null);
  const navigate = useNavigate();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (message.startsWith('Check out this project:')) {
      const projectId = message.split('Check out this project:')[1].trim();
      fetchProjectDetails(projectId);
    }
    
    if (activeTab === "groups" && !isCurrentUser && list.sender_unique_id) {
      fetchSenderName(list.sender_unique_id);
    }
  }, [message, activeTab, isCurrentUser, list.sender_unique_id]);

  const fetchSenderName = async (senderUniqueId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/get_user_details`,
        {
          customer_unique_id: senderUniqueId
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setSenderName(response.data.user_details?.full_name || "Unknown User");
      }
    } catch (error) {
      console.error('Error fetching sender name:', error);
      setSenderName("Unknown User");
    }
  };

  const fetchProjectDetails = async (projectId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_single_project_shared`,
        {
          project_unique_id: projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setProjectData(response.data.projectDetail);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async(documentId, templateId) => {
    setLoader(true)
    try {
      const response = await axios.post(
        `${baseUrl}/get_legal_preview_app_news`,
        {
          legal_templates_id: templateId,
          ans_unique_id: documentId
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      window.open(url, '_blank');

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error previewing document:', error);
    } finally {
      setLoader(false)
      setShowOptions(null);
    }
  };

 
  const handleNavigateEsign = (documentId) => {
    navigate(`/${user.role}/e-sign-document?eSignDocument=${documentId}`)
  }

  const renderMessageContent = (text) => {
    if (text.startsWith('Check out this project:')) {
      return null;
    }

    if (text.startsWith('Check Shared Document:')) {
      const parts = text.split('Check Shared Document:')[1]?.trim().split(',') || [];
      const documentId = parts[0]?.trim() || "";
      const templateId = parts[1]?.trim() || "";
      return (
        <div
          className="relative cursor-pointer"
          onClick={() => {
            setShowOptions(!showOptions);
          }}
        >
          <div className="flex items-center space-x-2">
            <FileText
              className={`w-5 h-5 ${isCurrentUser ? 'text-white' : 'text-blue-600'}`}
            />
            <span className="text-sm">Shared Document</span>
          </div>

          {showOptions && (
            <div className="absolute z-10 top-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden min-w-[120px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(documentId, templateId);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateEsign(documentId);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <PenLine className="w-4 h-4" />
                <span>Sign</span>
              </button>
            </div>
          )}
        </div>
      );
    }
    if (text.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return (
        <img 
          src={text} 
          alt="Shared image" 
          className="max-w-[250px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(text, '_blank')}
        />
      );
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${isCurrentUser ? 'text-white' : 'text-blue-600'} hover:opacity-80`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderProjectPreview = () => {
    if (!projectData) return null;

    const photos = projectData.projectMedia.filter(
      (media) => media.media_type === 'photo'
    );

    const handleShowDetails = (projectData) => {
      setIsModalOpen(true);
    };

    return (
      <div className="mt-2 flex flex-col rounded-lg overflow-hidden border border-gray-200 bg-white">
        <div onClick={() => handleShowDetails(projectData)} className="flex items-center space-x-2 p-3 cursor-pointer">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {photos[0] && (
              <img
                src={photos[0].media_link}
                alt={projectData.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-sm text-gray-900">
              {projectData.title}
            </h3>
            <p className="text-xs text-gray-600">
              {projectData.category.category_name}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {loader && <Loader />}
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div 
          className={`px-3 py-2 max-w-[75%] rounded-lg shadow-sm ${
            isCurrentUser 
              ? 'bg-[#4A3AFF] text-white rounded-tr-none' 
              : 'bg-[#F1F1F1] text-black rounded-tl-none'
          }`}
        >
          {/* Sender name for group messages */}
          {activeTab === "groups" && !isCurrentUser && senderName && (
            <div className="text-xs font-semibold mb-1 text-blue-600">
              {senderName}
            </div>
          )}
          
          <div className="break-words">
            {renderMessageContent(message)}
          </div>
          
          {loading && (
            <div className="mt-1 text-xs opacity-70">
              Loading project details...
            </div>
          )}
          
          {projectData && renderProjectPreview()}
          <div className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-gray-300' : 'text-gray-500'}`}>
            {formatTimestamp(list.timestamp)}
          </div>
        </div>
      </div>
      
      {projectData && (
        <ProjectModal
          project={projectData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default MessageContent;

