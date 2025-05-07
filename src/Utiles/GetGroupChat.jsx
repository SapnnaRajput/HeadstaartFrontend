import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../routes/firebaseConfig";
import { Clock, X, Users, FileText, Eye } from "lucide-react";
import Loader from "./Loader";
import axios from "axios";

const GroupChatMessages = ({ chatId, onClose, groupData, currentChatUser, user }) => {
  console.log(groupData)
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [showOptions, setShowOptions] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);

  const groupMembers = groupData?.chat_reciver || [];

  useEffect(() => {
    if (!chatId) return;
    
    setLoader(true);
    const stringChatId = String(chatId);
    const messagesRef = collection(db, "groups", stringChatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));
      console.log(fetchedMessages);
      setMessages(fetchedMessages);
      setLoader(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  const getSenderInfo = (senderId) => {
    // Check if the sender is the current user
    if (String(senderId) === String(currentChatUser)) {
      return {
        reciver_name: "You",
        reciver_profile_image: user?.profile_image || "",
        isCurrentUser: true
      };
    }
    
    for (const member of groupMembers) {
      if (String(member.reciver_unique_id) === String(senderId)) {
        return {
          reciver_name: member.reciver_name,
          reciver_profile_image: member.reciver_profile_image,
          isCurrentUser: false
        };
      }
    }
    
    if (groupMembers.length > 0) {
      return {
        reciver_name: groupMembers[0].reciver_name,
        reciver_profile_image: groupMembers[0].reciver_profile_image,
        isCurrentUser: false
      };
    }
    
    return {
      reciver_name: "Group Member",
      reciver_profile_image: "",
      isCurrentUser: false
    };
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

  const renderMessageContent = (text, isCurrentUser) => {
    if (text.startsWith("Check out this project:")) {
      return null;
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
            setShowOptions(documentId);
          }}
        >
          <div className="flex items-center space-x-2">
            <FileText
              className={`w-5 h-5 ${isCurrentUser ? "text-white" : "text-blue-600"}`}
            />
            <span className={`text-sm ${isCurrentUser ? "text-white" : ""}`}>Shared Document</span>
          </div>

          {showOptions === documentId && (
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
              isCurrentUser ? "text-white" : "text-blue-600"
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

  return (
    <>
      {loader && <Loader />}
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-xl h-[80vh] max-h-[600px] flex flex-col shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-3">
              {groupData && (
                <>
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-semibold">
                      {groupData.group_name?.charAt(0) || "G"}
                    </div>
                    
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                      <Users size={14} className="text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {groupData.group_name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">{groupMembers.length} members</span>
                      <div className="flex -space-x-2">
                        {groupMembers.slice(0, 3).map((member) => (
                          <div 
                            key={member.reciver_unique_id} 
                            className="w-4 h-4 rounded-full border border-white overflow-hidden"
                          >
                            <img 
                              src={member.reciver_profile_image} 
                              alt={member.reciver_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.reciver_name)}&background=random`;
                              }}
                            />
                          </div>
                        ))}
                        {groupMembers.length > 3 && (
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border border-white">
                            +{groupMembers.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No messages yet
              </div>
            ) : (
              messages.map((message, index) => {
                const senderInfo = getSenderInfo(message.sender_unique_id);
                const isCurrentUser = senderInfo.isCurrentUser;
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showSenderInfo = !prevMessage || 
                  prevMessage.sender_unique_id !== message.sender_unique_id;
                
                return (
                  <div key={message.id} className={`w-full ${showSenderInfo ? 'mt-4' : 'mt-1'}`}>
                    <div className={`flex ${isCurrentUser ? 'justify-end' : ''}`}>
                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : ''}`}>
                        {(!isCurrentUser && showSenderInfo) && (
                          <div className="flex items-center mb-1">
                            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                              <img 
                                src={senderInfo.reciver_profile_image} 
                                alt={senderInfo.reciver_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(senderInfo.reciver_name)}&background=random`;
                                }}
                              />
                            </div>
                            <div className="text-xs font-medium text-blue-600">
                              {senderInfo.reciver_name}
                            </div>
                          </div>
                        )}
                        
                        <div className={`
                          ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} 
                          rounded-lg 
                          ${isCurrentUser ? 'border-blue-500' : 'border border-gray-200'} 
                          shadow-sm px-3 py-2 
                          max-w-[85%] text-sm break-words
                          ${isCurrentUser ? 'ml-auto' : isCurrentUser ? '' : 'ml-8'}
                        `}>
                          <div>
                            {renderMessageContent(message.message, isCurrentUser)}
                          </div>
                          <div className="text-xs flex items-center space-x-1 mt-1 justify-end">
                            <Clock size={10} className={`${isCurrentUser ? 'text-white opacity-70' : 'text-gray-500 opacity-70'}`} />
                            <span className={`${isCurrentUser ? 'text-white opacity-70' : 'text-gray-500'}`}>
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupChatMessages;