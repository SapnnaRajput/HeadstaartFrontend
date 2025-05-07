import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../Utiles/Loader";
import { UserState } from "../../../context/UserContext";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  MoreVertical,
  Pencil,
  Share2,
  Trash2,
  Eye,
  X,
  EyeIcon,
} from "lucide-react";

const SharedDocument = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = UserState();
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/get_customer_shared_document`,
          {
            customer_unique_id: user?.customer?.customer_unique_id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setDocuments(response.data.shared_document);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Signed":
        return "text-green-500";
      case "Not-Sign":
        return "text-yellow-500";
      case "Pending":
        return "text-blue-500";
      case "Expired":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handlePreview = async (doc) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_legal_preview_app_news`,
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
      setOpenMenuId(null);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.shared_document_id}
                  className="group bg-white rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-sm">
                        <span className="text-red-500 text-sm font-semibold">
                          PDF
                        </span>
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
                        )} text-sm font-medium px-3 py-1 rounded-full bg-opacity-10 ${
                          doc.status === "Signed"
                            ? "bg-green-100"
                            : doc.status === "Not-Sign"
                            ? "bg-yellow-100"
                            : doc.status === "Pending"
                            ? "bg-blue-100"
                            : "bg-red-100"
                        } transition-all duration-300 group-hover:shadow-sm`}
                      >
                        {doc.status}
                      </span>

                      <div className="relative">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group-hover:bg-blue-100/50"
                        >
                          <EyeIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                        </button>

                        {openMenuId === doc.shared_document_id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-100 overflow-hidden transition-all duration-200">
                            <div className="py-1">{renderMenuOptions(doc)}</div>
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
              <h2 className="text-xl font-medium text-gray-600">
                No Documents Available
              </h2>
              <p className="text-gray-400 text-center max-w-md">
                When you have documents, they will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SharedDocument;
