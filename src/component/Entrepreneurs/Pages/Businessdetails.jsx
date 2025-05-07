import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { notify } from "../../../Utiles/Notification";
import Loader from "../../../Utiles/Loader";
import { UserState } from "../../../context/UserContext";
import QuestionChat from "./Fundingrequirement";

const Businessdetails = ({ handleBusinessDetails }) => {
  const baseUrl = import.meta.env.VITE_APP_AI_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showtemplate, setShowTemplate] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/templates`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.data.status) {
          setTemplates(response.data.templates);
        }
      } catch (error) {
        notify("error", "Unauthorized access please login again");
      }
      setLoading(false);
    };
    fetchTemplates();
  }, [baseUrl, user?.token]);

  const onClose = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${baseUrl}/delete-response`, {
        data: {
          customer_unique_id: user?.customer?.customer_unique_id,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    if (!selectedTemplate) {
      notify("error", "Please select a template");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/fetch-questions`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          template_id: selectedTemplate,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setQuestions(response.data.questions);
        setShowTemplate(false);
        await onClose();
      }
    } catch (error) {
      console.log("error", "Unauthorized access please login again");
    }
    setLoading(false);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleThumbnailClick = (filePath) => {
    window.open(filePath, "_blank");
  };

  return (
    <>
      {loading && <Loader />}
   
      {showtemplate && (
        <>
           <div className="sticky top-20 z-10 bg-gray-50 pt-4 px-4 pb-2">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 ">Select Template</h2>
          <div className="flex justify-end">
            <button
              onClick={() => fetchQuestions()}
              absolute
              top-2
              right-2
              xs:top-3
              xs:right-3
              type="button"
              className="inline-flex items-center px-5 py-3 text-base font-medium text-white bg-[#4A3AFF] rounded-lg hover:bg-[#3D32CC] shadow-sm transition-all duration-200"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
        <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.template_id}
                className="relative group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="">
                  <img
                  onClick={() => handleThumbnailClick(template.pdf_path)}
                    src={template.thumbnail_path}
                    alt={template.template_name}
                    className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className="absolute top-2 right-2 xs:top-3 xs:right-3"
                    
                  >
                    <span
                      className={`px-2 py-0.5 xs:px-3 xs:py-1 text-[12px] cursor-pointer xs:text-xs font-medium capitalize rounded-full bg-green-100 text-green-500`}
                    >
                      Preview
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {template.template_name}
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="template"
                        className="h-5 w-5 text-blue-600 border-[#4A3AFF] cursor-pointer focus:ring-blue-500"
                        checked={selectedTemplate === template.template_id}
                        onChange={() =>
                          handleTemplateSelect(template.template_id)
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
      )}

      {!showtemplate && (
        <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <QuestionChat
            questions={questions}
            template={selectedTemplate}
            customer_unique_id={user?.customer?.customer_unique_id}
            onSubmitAnswer={async (payload) => {
              try {
                const response = await axios.post(
                  `${baseUrl}/save-response`,
                  payload,
                  {
                    headers: {
                      Authorization: `Bearer ${user?.token}`,
                    },
                  }
                );
                return response.data;
              } catch (error) {
                notify("error", "Failed to submit answer");
                throw error;
              }
            }}
          />
        </div>
      )}
    </>
  );
};

export default Businessdetails;
