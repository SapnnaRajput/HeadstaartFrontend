import React, { useEffect, useState } from 'react';
import { FileText, Share, Presentation, PresentationIcon, Eye } from 'lucide-react';
import Document from './Document';
import SharedDocument from './SharedDocument';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import Loader from '../../../Utiles/Loader';

const DocumentTabs = () => {
  const [activeTab, setActiveTab] = useState('shared');
  const { user } = UserState()
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [pitchFile, setPitchFile] = useState([])

  const tabs = [
    {
      id: 'shared',
      label: 'Shared Documents',
      icon: <Share className="w-4 h-4" />,
    },
    {
      id: 'my',
      label: 'My Documents',
      icon: <FileText className="w-4 h-4" />,
    },
    ...(user.role === "entrepreneur" ? [{
      id: 'pitch',
      label: 'Pitch Deck',
      icon: <Presentation className="w-4 h-4" />,
    }] : [])
  ];
  useEffect(() => {
    const getPitchDeck = async () => {
      
      try {
        const response = await axios.post(`${baseUrl}/get_pitch `, {
          customer_unique_id: user?.customer?.customer_unique_id,
        });
        if (response.data.status) {
          setPitchFile(response.data.data)
        }
      } catch (error) {
        notify('error', 'Unauthorized access please login again');
      } finally {
      }
    };
    getPitchDeck()
  }, [baseUrl, user]);

  const handleOpenDocument = (url) => {
    window.open(url, '_blank');
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'shared':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Shared Documents</h3>
            </div>
            <SharedDocument />
          </div>
        );
      case 'my':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">My Documents</h3>
            </div>
            <Document />
          </div>
        );
      case 'pitch':
        return (
          <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Pitch Deck</h3>
          </div>
          <div className="space-y-4">
            {pitchFile.map((doc, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Presentation className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {doc.doc_name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleOpenDocument(doc.pitch_doc)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Presentation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      
      <div className="w-full  container mx-auto bg-gray-50 min-h-screen">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-100">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-6 text-sm font-medium relative ${activeTab === tab.id
                        ? 'text-[#4A3AFF] bg-[#4A3AFF]/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A3AFF]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentTabs;