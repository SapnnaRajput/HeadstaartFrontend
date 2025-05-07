import React, { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Search,
  FileText,
  MoreVertical,
  Trash2,
  Upload,
  EyeIcon,
  Pencil,
} from "lucide-react";
import UploadModal from "./UploadModal";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import axios from "axios";
import { notify } from "../../../Utiles/Notification";
import CustomButton from "../../../Utiles/CustomButton";
import ConfirmationModal from "../../../Utiles/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const DocumentManagement = () => {
  const [activeTab, setActiveTab] = useState("shared");
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sharedDocument, setSharedDocument] = useState([]);
  const [legalTemplate, setLegalTemplate] = useState([]);
  const navigate = useNavigate();
  const handleCloseModal = () => setIsModalOpen(false);

  const getSharedDocument = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_all_shared_document_admin`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        setSharedDocument(response.data.shared_document);
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getLegalTemplate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/get_legal_template`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.status) {
        setLegalTemplate(response.data.LegalTemplates);
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSharedDocument()
    getLegalTemplate();
  }, [baseUrl]);

 

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "signatures":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePreviewLegal  = async (doc) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_legal_temp_ques_admin`,
        {
          legal_templates_id: doc.legal_templates_id,
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
      setLoading(false);
    }
  };
  const handlePreview = async (doc) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_legal_preview_app_news_admin`,
        {
          legal_templates_id: doc.legal_template_id,
          ans_unique_id: doc.answer_unique_id,
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
      setLoading(false);
    }
  };

  const handleAddNewTemplate = () => {
    navigate(`/superadmin/add-new-template`);
  };

  const handleEdit = (item) => {
    navigate(`/superadmin/edit-legal-template?legal_templates_id=${item.legal_templates_id}`);
  };

  

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 container mx-auto my-3 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Management</h1>
          {activeTab === "legal" && (
            <button
              onClick={handleAddNewTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Generate Legal Templates
            </button>
          )}
          {/* <UploadModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("shared")}
              className={`pb-4 px-2 relative ${
                activeTab === "shared"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Shared Documents
              {activeTab === "shared" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("legal")}
              className={`pb-4 px-2 relative ${
                activeTab === "legal"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Legal Templates
              {activeTab === "legal" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "shared" ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sign Minimum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date and Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sharedDocument.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {doc.legal_template_details.document_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {doc.customer_role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.sign_min}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`
                      ${
                        doc.legal_template_details.inserted_date.split("-")[1]
                      }-${
                        doc.legal_template_details.inserted_date.split("-")[2]
                      }-${
                        doc.legal_template_details.inserted_date.split("-")[0]
                      } , ${doc.legal_template_details.inserted_time}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group-hover:bg-blue-100/50"
                        >
                          <EyeIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Legal Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Purchase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {legalTemplate.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded">
                          <FileText className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {doc.document_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {doc.category.category_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {doc.total_purchase}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      $ {doc.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        <div className="absolute right-0 mt-2 top-4 w-48 bg-white rounded-lg shadow-lg border border-gray-100 invisible group-hover:visible z-10">
                          <div className="py-1">
                            <button onClick={() => handlePreviewLegal(doc)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                              <EyeIcon className="w-4 h-4" />
                              View
                            </button>
                            {/* <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button> */}
                            <button onClick={() => handleEdit(doc)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentManagement;
