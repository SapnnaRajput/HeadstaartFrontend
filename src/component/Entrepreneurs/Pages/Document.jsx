import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronRight, Search, MoreVertical, Pencil, Share2, Trash2, Eye, X  } from 'lucide-react';
import axios from 'axios';
import Loader from '../../../Utiles/Loader';
import { UserState } from '../../../context/UserContext';
import ConfirmationModal from '../../../Utiles/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../routes/firebaseConfig';
import { notify } from '../../../Utiles/Notification';

const ShareModal = ({ isOpen, onClose, users, documentShare }) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [loading, setLoading] = useState(false);
  const { user } = UserState();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroupUser, setSelectedGroupUser] = useState(null);
  const isGroupShare = documentShare?.chat === 1;

  useEffect(() => {
    setSelectedUser(null);
  }, [isOpen]);


  const handleSign = async (documentId, chatInitiateId, chatGroupInitiatesId) => {
    try {
      let requestBody = {
        ans_unique_id: documentId
      };

      if (chatInitiateId) {
        requestBody.chat_initiate_id = chatInitiateId;
      } else if (chatGroupInitiatesId) {
        requestBody.chat_group_initiates_id = chatGroupInitiatesId;
      } else {
        notify('error', 'Please try to reshare the document');
        return;
      }

      const response = await axios.post(
        `${baseUrl}/esign_shared_document`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        console.log(response);
      } else {
        notify('error', response.data.message);
      }
    } catch (error) {
      console.error('Error signing document:', error);
      alert(error.message || 'Error signing document. Please try to reshare.');
    } finally {
      setLoading(false);
    }
  };


  const handleShareDocument = async () => {
    if (!selectedUser) {
      notify('error', 'Please select a user or group');
      return;
    }
    setLoading(true);

    try {
      const isGroupChat = !selectedUser.chat_initiate_id;
      if (isGroupChat) {
        const ids = selectedUser.chat_reciver.map(item => item.reciver_unique_id);
        setSelectedGroupUser(ids);
      }

      const response = await axios.post(
        `${baseUrl}/shared_document_check`,
        {
          ans_unique_id: documentShare.answer_unique_id,
          [isGroupChat ? 'chat_group_initiates_id' : 'chat_initiate_id']:
            selectedUser.chat_group_initiates_id || selectedUser.chat_initiate_id
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {

        await handleSign(
          response.data.ans_unique_id,
          response.data.chat_initiate_id,
          response.data.chat_group_initiates_id
        );
      } else if (!response.data.status) {
        notify('error', response.data.message || 'Failed to share document');
        return;
      }

      const messageToSend = `Check Shared Document: ${response.data.ans_unique_id}, ${response.data.legal_templates_id}`;
      const chatId = isGroupChat ? response.data.chat_group_initiates_id : response.data.chat_initiate_id;
      const stringChatId = String(chatId);

      const messageData = {
        ...(isGroupChat ? { message: messageToSend } : { text: messageToSend }),
        status: 'sent',
        sender_unique_id: user?.customer?.customer_unique_id,
        timestamp: serverTimestamp(),
        ...(isGroupChat
          ? {
            // chat_group_initiates_id: stringChatId,
            // receiver_unique_id: selectedGroupUser
          }
          : {
            receiver_unique_id: selectedUser.receiver_unique_id
          }
        )
      };

      const collectionPath = isGroupChat
        ? collection(db, "groups", stringChatId, "messages")
        : collection(db, "headstaart", stringChatId, "messages");

      await addDoc(collectionPath, messageData);

      const navigationPath = isGroupChat
        ? `/${user.role}/messages?groupshare=${selectedUser.chat_group_initiates_id}`
        : `/${user.role}/messages/${chatId}`;

      navigate(navigationPath);
      onClose();

    } catch (error) {
      console.error('Error sharing document:', error);
      notify('error', 'Error sharing document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGroupInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <>
      {loading && <Loader />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md relative flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isGroupShare ? 'Share with Group' : 'Share with'}
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="max-h-[50vh] overflow-y-auto">
            {users.map((item) => {
              const itemId = isGroupShare ? item.chat_group_initiates_id : item.chat_initiate_id;
              return (
                <div
                  key={itemId}
                  className="p-4 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
                >
                  {isGroupShare ? (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">
                        {getGroupInitials(item.group_name)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      <img
                        src={item.reciver_profile_image}
                        alt={item.receiver_full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate capitalize">
                      {isGroupShare ? item.group_name : item.receiver_full_name}
                    </h4>
                    {!isGroupShare && (
                      <p className="text-sm text-gray-500 truncate capitalize">
                        {item.project?.title}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name="userSelect"
                      id={itemId}
                      checked={selectedUser ? (
                        isGroupShare ?
                          selectedUser.chat_group_initiates_id === itemId :
                          selectedUser.chat_initiate_id === itemId
                      ) : false}
                      onChange={() => setSelectedUser(item)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="flex justify-end">
              <button
                onClick={handleShareDocument}
                disabled={!selectedUser}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};




const Document = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = UserState();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate()
  const statusOptions = ['All', 'Pending', 'Signed', 'Not-Signed', 'Expired'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${baseUrl}/shared_document_web`,
          {
            customer_unique_id: user?.customer?.customer_unique_id
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });
        if (response.data.status) {
          setDocuments(response.data.shared_document);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...documents];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.legal_template_details.document_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, statusFilter, documents]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Signed':
        return 'text-green-500';
      case 'Not-Sign':
        return 'text-yellow-500';
      case 'Pending':
        return 'text-blue-500';
      case 'Expired':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handlePreview = async (doc) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_legal_preview_app_news`,
        {
          legal_templates_id: doc.legal_template_id,
          ans_unique_id: doc.answer_unique_id
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
      setLoading(false);
      setOpenMenuId(null)
    }
  };

  const handlePreviewNotSigned = async (doc) => {

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_legal_preview_app`,
        {
          legal_templates_id: doc.legal_template_id,
          ans_unique_id: doc.answer_unique_id
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
      setLoading(false);
      setOpenMenuId(null)
    }
  };

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/shared_document_status`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          shared_document_id: documentToDelete.shared_document_id,
          ans_unique_id: documentToDelete.answer_unique_id
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        setDocuments(documents.filter(
          doc => doc.shared_document_id !== documentToDelete.shared_document_id
        ));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
      setOpenMenuId(null)

    }
  };

  const renderMenuOptions = (doc) => {
    const isExpired = doc.expire_date && new Date(doc.expire_date.split('-').reverse().join('-')) < new Date();

    const handleShare = async (doc) => {
      setSelectedDoc(doc);
      setLoading(true);
      try {
        let response;
        if (doc.chat === 0) {
          response = await axios.post(
            `${baseUrl}/get_chat_user_list`,
            { customer_unique_id: user?.customer?.customer_unique_id },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );
          if (response?.data.status) {
            setChats(response.data.chat_user_data);
            setIsShareModalOpen(true);
          }
        } else if (doc.chat === 1) {
          response = await axios.post(
            `${baseUrl}/get_chat_group_list_web`,
            { customer_unique_id: user?.customer?.customer_unique_id },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );
          if (response?.data.status) {
            setChats(response.data.chat_group_data);
            setIsShareModalOpen(true);
          }
        }

        if (!response?.data.status) {
          notify('error', response.data.message);
        }
      } catch (error) {
        notify('error', 'Unauthorized access. Please log in again.');
      }
      setOpenMenuId(null)
      setLoading(false);
    };

    if (isExpired || doc.status === 'Expired') {
      return (
        <>
          <button onClick={() => handleDeleteClick(doc)} className="w-full px-4 py-2 text-left text-base text-red-600 hover:bg-gray-50 flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </>
      );
    }

    switch (doc.status) {
      case 'Pending':
        return (
          <>
            {doc.show === 1 && (
              <button className="w-full px-4 py-2 text-left text-base text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Pencil className="w-4 h-4" />
                <span>Sign</span>
              </button>
            )}
            <button onClick={() => handleShare(doc)} className="w-full px-4 py-2 text-left text-base text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => handlePreview(doc)}
              className="w-full px-4 py-2 text-left text-base text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </>
        );
      case 'Signed':
        return (
          <button
            onClick={() => handlePreview(doc)}
            className="w-full px-4 py-2 text-left text-base text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        );
      case 'Not-Signed':
        return (
          <>
            {doc.show === 1 && (
              <button onClick={() => navigate(`/${user.role}/e-sign-document?eSignDocument=${doc.answer_unique_id}`)} className="w-full px-4 py-2 text-left text-base text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Pencil className="w-4 h-4" />
                <span>Sign</span>
              </button>
            )}
            <button
              onClick={() => handlePreviewNotSigned(doc)}
              className="w-full px-4 py-2 text-left text-base text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </>
        );
      default:
        return null;
    }
  };



  return (
    <>
      {loading && <Loader />}
      <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-40 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.shared_document_id}
                  className="group bg-white rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-sm">
                        <span className="text-red-500 text-sm font-semibold">PDF</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200">
                          {doc.legal_template_details.document_name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>
                            Signed{" "}
                            {`${
                              doc.legal_template_details.inserted_date.split(
                                "-"
                              )[1]
                            }-${
                              doc.legal_template_details.inserted_date.split(
                                "-"
                              )[2]
                            }-${
                              doc.legal_template_details.inserted_date.split(
                                "-"
                              )[0]
                            } ${doc.legal_template_details.inserted_time}`}{" "}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <span
                        className={`${getStatusColor(
                          doc.status
                        )} text-sm font-medium px-3 py-1 rounded-full bg-opacity-10 ${doc.status === "Signed" ? "bg-green-100" :
                          doc.status === "Not-Signed" ? "bg-yellow-100" :
                            doc.status === "Pending" ? "bg-blue-100" : "bg-red-100"
                          } transition-all duration-300 group-hover:shadow-sm`}
                      >
                        {doc.status}
                      </span>

                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(doc.shared_document_id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group-hover:bg-blue-100/50"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                        </button>

                        {openMenuId === doc.shared_document_id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-100 overflow-hidden transition-all duration-200">
                            <div className="py-1">
                              {renderMenuOptions(doc)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-600">No Documents Found</h2>
            <p className="text-gray-400 text-center max-w-md">
              {searchQuery || statusFilter !== 'All'
                ? "No documents match your search criteria"
                : "When you have documents, they will appear here"}
            </p>
          </div>
          )}
          </div>

      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        users={chats}
        documentShare={selectedDoc}
      />


    </>
  );
};

export default Document;