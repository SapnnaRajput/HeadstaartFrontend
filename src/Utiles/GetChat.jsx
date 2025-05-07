import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../routes/firebaseConfig";
import { Clock, Eye, FileText, PenLine, X } from "lucide-react";
import Loader from "./Loader";
import axios from "axios";

const ChatMessages = ({ chatId, userId, onClose, user }) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [loader, setLoader] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    const stringChatId = String(chatId);
    const messagesRef = collection(db, "headstaart", stringChatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));
      // console.log(fetchedMessages);
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  useEffect(() => {
  //     if (message.startsWith('Check out this project:')) {
  //       const projectId = message.split('Check out this project:')[1].trim();
  //       fetchProjectDetails(projectId);
  //     }
  //   }, [message]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchProjectDetails = async (projectId) => {
    // setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_single_project_admin`,
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
      // setLoading(false);
    }
  };

 

  const handlePreview = async (documentId, templateId) => {
    setLoader(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_legal_preview_app_news`,
        {
          legal_templates_id: templateId,
          ans_unique_id: documentId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error previewing document:", error);
    } finally {
      setLoader(false);
      setShowOptions(null);
    }
  };

  const renderMessageContent = (text) => {
    if (text.startsWith("Check out this project:")) {
      const projectId = text.split("Check out this project:")[1].trim();
      const link = `${window.location.origin}/superadmin/content-moderation/${projectId}`;
  
      return (
        <div
          className="text-blue-600 underline cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            window.open(link, "_blank");
          }}
        >
          {link}
        </div>
      );
    }

    if (text.startsWith("Check Shared Document:")) {
      const parts =
        text.split("Check Shared Document:")[1]?.trim().split(",") || [];
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
              className={`w-5 h-5 ${userId ? "text-white" : "text-blue-600"}`}
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
          onClick={() => window.open(text, "_blank")}
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
            className={`underline ${
              userId ? "text-white" : "text-blue-600"
            } hover:opacity-80`}
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
      (media) => media.media_type === "photo"
    );

    const handleShowDetails = (projectData) => {
    };

    return (
      <div className="mt-2 flex flex-col rounded-lg overflow-hidden border border-gray-200 bg-white">
        <div
          onClick={() => handleShowDetails(projectData)}
          className="flex items-center space-x-2 p-3 cursor-pointer"
        >
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
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-xl h-[80vh] max-h-[600px] flex flex-col shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Chat Messages
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No messages yet
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_unique_id === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                  max-w-[80%] p-3 rounded-2xl 
                  ${
                    message.sender_unique_id === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }
                  relative group
                `}
                  >
                    <div className="break-words text-sm">
                      {renderMessageContent(message.text)}
                    </div>
                    {projectData && renderProjectPreview()}
                    <div
                      className={`
                    text-xs mt-1 flex items-center  space-x-1
                    ${
                      message.sender_unique_id === userId
                        ? "text-blue-100 justify-end"
                        : "text-gray-500 justify-start"
                    }
                  `}
                    >
                      <Clock size={12} className="opacity-70" />
                      <span>{formatTimestamp(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
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

export default ChatMessages;
