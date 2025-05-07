import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Edit3, Eye, Edit } from "lucide-react";
import axios from "axios";
import { notify } from "../../../Utiles/Notification";
import { UserState } from "../../../context/UserContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../Utiles/Loader";
import CustomButton from "../../../Utiles/CustomButton";

const AdminDocumentCreator = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({
    qus_type: "input",
    question: "",
    options: { option1: "", option2: "", option3: "", option4: "" },
    placeholder: "",
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [editingContentId, setEditingContentId] = useState(null);
  const [templateContents, setTemplateContents] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const legal_templates_id = params.get("legal_templates_id");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };
  const navigate = useNavigate();

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "color",
    "background",
  ];

  const convertQuillToStandardHTML = (html) => {
    if (!html) return html;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const alignElements = tempDiv.querySelectorAll(
      ".ql-align-center, .ql-align-right, .ql-align-justify, .ql-align-left"
    );
    alignElements.forEach((el) => {
      if (el.classList.contains("ql-align-center")) {
        el.style.textAlign = "center";
      } else if (el.classList.contains("ql-align-right")) {
        el.style.textAlign = "right";
      } else if (el.classList.contains("ql-align-justify")) {
        el.style.textAlign = "justify";
      } else if (el.classList.contains("ql-align-left")) {
        el.style.textAlign = "left";
      }

      el.classList.remove(
        "ql-align-center",
        "ql-align-right",
        "ql-align-justify",
        "ql-align-left"
      );
    });

    const sizeElements = tempDiv.querySelectorAll('[class*="ql-size-"]');
    sizeElements.forEach((el) => {
      const sizeClass = Array.from(el.classList).find((cls) =>
        cls.startsWith("ql-size-")
      );
      if (sizeClass) {
        const sizeMap = {
          "ql-size-small": "10px",
          "ql-size-large": "18px",
          "ql-size-huge": "24px",
        };

        if (sizeMap[sizeClass]) {
          el.style.fontSize = sizeMap[sizeClass];
        }

        el.classList.remove(sizeClass);
      }
    });

    const colorElements = tempDiv.querySelectorAll('[class*="ql-color-"]');
    colorElements.forEach((el) => {
      const colorClass = Array.from(el.classList).find((cls) =>
        cls.startsWith("ql-color-")
      );
      if (colorClass) {
        const colorValue = colorClass.replace("ql-color-", "#");
        if (colorValue.length === 7) {
          el.style.color = colorValue;
        }

        el.classList.remove(colorClass);
      }
    });

    const bgElements = tempDiv.querySelectorAll('[class*="ql-bg-"]');
    bgElements.forEach((el) => {
      const bgClass = Array.from(el.classList).find((cls) =>
        cls.startsWith("ql-bg-")
      );
      if (bgClass) {
        const colorValue = bgClass.replace("ql-bg-", "#");
        if (colorValue.length === 7) {
          el.style.backgroundColor = colorValue;
        }

        el.classList.remove(bgClass);
      }
    });

    const indentElements = tempDiv.querySelectorAll('[class*="ql-indent-"]');
    indentElements.forEach((el) => {
      const indentClass = Array.from(el.classList).find((cls) =>
        cls.startsWith("ql-indent-")
      );
      if (indentClass) {
        const indentLevel = parseInt(indentClass.replace("ql-indent-", ""));
        if (!isNaN(indentLevel)) {
          el.style.paddingLeft = `${indentLevel * 3}em`;
        }

        el.classList.remove(indentClass);
      }
    });

    const headerElements = tempDiv.querySelectorAll(
      ".ql-header-1, .ql-header-2, .ql-header-3, .ql-header-4, .ql-header-5, .ql-header-6"
    );
    headerElements.forEach((el) => {
      const headerClass = Array.from(el.classList).find((cls) =>
        cls.startsWith("ql-header-")
      );
      if (headerClass) {
        const level = headerClass.replace("ql-header-", "");
        const newHeader = document.createElement(`h${level}`);
        newHeader.innerHTML = el.innerHTML;
        newHeader.style = el.style.cssText;
        el.parentNode.replaceChild(newHeader, el);
      }
    });

    const allElements = tempDiv.querySelectorAll("*");
    allElements.forEach((el) => {
      const qlClasses = Array.from(el.classList).filter((cls) =>
        cls.startsWith("ql-")
      );
      qlClasses.forEach((cls) => el.classList.remove(cls));
    });

    const cursorElements = tempDiv.querySelectorAll(".ql-cursor");
    cursorElements.forEach((el) => {
      el.remove();
    });

    const elementsWithEmptyClass = tempDiv.querySelectorAll('[class=""]');
    elementsWithEmptyClass.forEach((el) => {
      el.removeAttribute("class");
    });

    return tempDiv.innerHTML;
  };

  const fetchTemplateContents = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/GetLegalTempContent`,
        {
          legal_templates_id: legal_templates_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.status) {
        setTemplateContents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching template contents:", error);
    }
  };

  useEffect(() => {
    fetchTemplateContents();
  }, [user]);

  const resetQuestionForm = () => {
    setCurrentQuestion({
      qus_type: "input",
      question: "",
      options: { option1: "", option2: "", option3: "", option4: "" },
      placeholder: "",
    });
    setEditingQuestionIndex(null);
  };

  const resetContentForm = () => {
    setDocumentContent("");
    setEditingContentId(null);
  };

  const handleSaveQuestionContent = async (type) => {
    let payload;
    let isEditing = false;
    let editId = null;

    if (type === "question") {
      isEditing = editingQuestionIndex !== null;
      editId = editingQuestionIndex;

      if (!currentQuestion.question.trim()) {
        notify("error", "Question text is required");
        return;
      }

      if (currentQuestion.qus_type !== "input") {
        const hasOptions = Object.values(currentQuestion.options).some((opt) =>
          opt.trim()
        );
        if (!hasOptions) {
          notify("error", "At least one option is required");
          return;
        }
      }

      payload = {
        legal_templates_id: legal_templates_id,
        qus_type: currentQuestion.qus_type,
        question: currentQuestion.question,
        option1: currentQuestion.options.option1 || "",
        option2: currentQuestion.options.option2 || "",
        option3: currentQuestion.options.option3 || "",
        option4: currentQuestion.options.option4 || "",
        content: null,
        placeholder: currentQuestion.placeholder || "",
      };

      if (isEditing) {
        payload.legal_temp_content_id = editId;
      }
    } else if (type === "content") {
      isEditing = editingContentId !== null;
      editId = editingContentId;

      if (!documentContent.trim()) {
        notify("error", "Document content is required");
        return;
      }

      const processedContent = convertQuillToStandardHTML(documentContent);

      payload = {
        legal_templates_id: legal_templates_id,
        qus_type: null,
        question: null,
        option1: null,
        option2: null,
        option3: null,
        option4: null,
        content: processedContent,
        placeholder: null,
      };

      if (isEditing) {
        payload.legal_temp_content_id = editId;
      }
    }

    setLoader(true);
    try {
      const endpoint = isEditing
        ? `${baseUrl}/update-legal-temp-content`
        : `${baseUrl}/addLegalTempContent`;

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data.status) {
        if (isEditing) {
          setTemplateContents((prevContents) =>
            prevContents.map((item) =>
              item.legal_temp_content_id === editId ? response.data.data : item
            )
          );
          notify("success", "Content updated successfully");
        } else {
          setTemplateContents(response.data.data || []);
          notify("success", "Content added successfully");
        }

        await fetchTemplateContents();

        if (type === "question") {
          resetQuestionForm();
        } else {
          resetContentForm();
        }
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      console.error(
        isEditing ? "Error updating data:" : "Error submitting data:",
        error
      );
      notify(
        "error",
        error.response?.data?.message ||
          (isEditing
            ? "Failed to update template"
            : "Failed to submit template")
      );
    } finally {
      setLoader(false);
    }
  };

  const handleEdit = (item) => {
    if (item.content) {
      setDocumentContent(item.content);
      setEditingContentId(item.legal_temp_content_id);
      setEditingQuestionIndex(null);
      setPreviewMode(false);
    } else if (item.qus_type) {
      const editItem = {
        qus_type: item.qus_type,
        question: item.question,
        options: {
          option1: item.option1 || "",
          option2: item.option2 || "",
          option3: item.option3 || "",
          option4: item.option4 || "",
        },
        placeholder: item.placeholder || "",
        legal_temp_content_id: item.legal_temp_content_id,
      };

      setCurrentQuestion(editItem);
      setEditingQuestionIndex(item.legal_temp_content_id);
      setEditingContentId(null);
      setPreviewMode(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    if (!item.legal_temp_content_id) {
      notify("error", "Invalid item to delete");
      return;
    }

    setLoader(true);
    try {
      const response = await axios.post(
        `${baseUrl}/DeleteLegalTempContent`,
        {
          legal_temp_content_id: item.legal_temp_content_id,
          legal_templates_id: legal_templates_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        setTemplateContents((prevContents) =>
          prevContents.filter(
            (content) =>
              content.legal_temp_content_id !== item.legal_temp_content_id
          )
        );
        await fetchTemplateContents();
        notify("success", "Item deleted successfully");
      } else {
        notify("error", response.data.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      notify("error", error.response?.data?.message || "Failed to delete item");
    } finally {
      setLoader(false);
    }
  };

  const handlePreviewInputChange = (legal_temp_content_id, value) => {
    setPreviewAnswers((prev) => ({
      ...prev,
      [legal_temp_content_id]: value,
    }));
  };

  const getOptionsObj = (item) => {
    return {
      option1: item.option1 || "",
      option2: item.option2 || "",
      option3: item.option3 || "",
      option4: item.option4 || "",
    };
  };

  const handleDownloadPDF = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_legal_temp_ques_admin`,
        {
          legal_templates_id: legal_templates_id,
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
    }
  };

  const renderQuestionPreview = (item) => {
    const { legal_temp_content_id, qus_type, question, placeholder } = item;

    if (!qus_type) return null;

    const options = getOptionsObj(item);
    const placeholderText = placeholder || "Type your answer here...";

    switch (qus_type) {
      case "input":
        return (
          <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <label className="block text-gray-700 text-base font-medium mb-2">
              {question}
            </label>
            <input
              type="text"
              value={previewAnswers[legal_temp_content_id] || ""}
              onChange={(e) =>
                handlePreviewInputChange(legal_temp_content_id, e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
              placeholder={placeholderText}
            />
          </div>
        );

      case "radio":
        return (
          <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <label className="block text-gray-700 text-base font-medium mb-2">
              {question}
            </label>
            <div className="space-y-2">
              {Object.entries(options).map(([key, value]) => {
                if (!value) return null;
                return (
                  <label
                    key={key}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${legal_temp_content_id}`}
                      value={value}
                      checked={previewAnswers[legal_temp_content_id] === value}
                      onChange={(e) =>
                        handlePreviewInputChange(
                          legal_temp_content_id,
                          e.target.value
                        )
                      }
                      className="h-4 w-4 text-[#4A3AFF] focus:ring-[#4A3AFF]"
                    />
                    <span className="text-gray-700 capitalize">{value}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "checkbox":
        const checkboxOptions = Object.values(options).filter(Boolean);
        return (
          <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <label className="block text-gray-700 text-base font-medium mb-2">
              {question}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {checkboxOptions.map((option) => {
                const isChecked = (previewAnswers[legal_temp_content_id] || "")
                  .split(",")
                  .includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={isChecked}
                      onChange={(e) => {
                        const currentValues = previewAnswers[
                          legal_temp_content_id
                        ]
                          ? previewAnswers[legal_temp_content_id].split(",")
                          : [];

                        let newValues;
                        if (e.target.checked) {
                          newValues = [...currentValues, option].filter(
                            Boolean
                          );
                        } else {
                          newValues = currentValues.filter((v) => v !== option);
                        }

                        handlePreviewInputChange(
                          legal_temp_content_id,
                          newValues.join(",")
                        );
                      }}
                      className="h-4 w-4 text-[#4A3AFF] focus:ring-[#4A3AFF] rounded"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const processDocumentPreview = () => {
    if (!templateContents || templateContents.length === 0) {
      return <div className="text-gray-500">No content added yet.</div>;
    }

    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        {templateContents.map((item, index) => {
          if (item.content) {
            return (
              <div
                key={`content-${index}`}
                className="my-4 p-4 bg-amber-50 rounded-lg shadow-sm relative"
              >
                <div className="absolute top-2 right-2 flex space-x-2 p-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            );
          } else if (item.qus_type) {
            const options = [
              item.option1,
              item.option2,
              item.option3,
              item.option4,
            ].filter(Boolean);

            return (
              <div
                key={`question-${index}`}
                className="my-4 p-4 rounded-lg bg-blue-50 shadow-sm relative"
              >
                <div className="absolute top-2 right-2 flex space-x-2 p-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="text-sm text-gray-500 font-medium mb-2">
                  Question
                </div>
                <div className="font-medium text-gray-700 mb-2">
                  {item.question}
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  Type: {item.qus_type}
                </div>

                {item.placeholder && (
                  <div className="text-sm text-gray-500 mb-1">
                    Placeholder: {item.placeholder}
                  </div>
                )}

                {options.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-500 mb-1">Options:</div>
                    <ul className="pl-5 list-disc">
                      {options.map((option, i) => (
                        <li key={i} className="text-gray-600">
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const saveDocumet = async() => {
    if (!templateContents || templateContents.length === 0) {
      notify("error", "No content added yet. Please add some content first.");
      return;
    }
    
    setLoader(true);
    try {
      const response = await axios.post(
        `${baseUrl}/submit_template`,
        {
          status:"Active",
          legal_templates_id: legal_templates_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        notify("success", response.data.message || "Item saved successfully");
        navigate("/superadmin/document-management")
      } else {
        notify("error", response.data.message || "Failed to save item");
      }
    } catch (error) {
      console.error("Error save item:", error);
      notify("error", error.response?.data?.message || "Failed to save item");
    } finally {
      setLoader(false);
    }
  }
  return (
    <>
      {loader && <Loader />}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Document Creator</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </button>
            <button
              onClick={saveDocumet}
              className="flex items-center px-4 py-2 bg-[#4A3AFF] text-white rounded-lg"
            >
           Submit
            </button>
          </div>
        </div>

        {!previewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6 shadow-sm h-[calc(100vh-200px)] overflow-hidden flex flex-col">
              <label className="block text-gray-700 text-lg font-medium mb-2">
                Document Content {editingContentId ? "(Editing)" : ""}
              </label>

              <div className="flex-grow overflow-hidden">
                <div className="h-full overflow-auto">
                  <ReactQuill
                    theme="snow"
                    value={documentContent}
                    onChange={setDocumentContent}
                    modules={modules}
                    formats={formats}
                    className="h-[85%] sm:h-[90%]"
                    placeholder="Enter document content here..."
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleSaveQuestionContent("content")}
                  className="px-4 py-2 bg-[#4A3AFF] text-white rounded-lg hover:bg-[#3D32CC] flex-grow"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingContentId
                    ? "Update Content"
                    : "Save Content"}
                </button>

                {editingContentId && (
                  <button
                    onClick={resetContentForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm h-[calc(100vh-200px)] overflow-auto">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Add Question {editingQuestionIndex ? "(Editing)" : ""}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Question Type
                    </label>
                    <select
                      value={currentQuestion.qus_type}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          qus_type: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                    >
                      <option value="input">Text Input</option>
                      <option value="radio">Single Choice (Radio)</option>
                      <option value="checkbox">
                        Multiple Choice (Checkbox)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Question Text
                    </label>
                    <textarea
                      value={currentQuestion.question}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          question: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                      placeholder="Enter your question here..."
                      rows={3}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Placeholder Text
                    </label>
                    <input
                      type="text"
                      value={currentQuestion.placeholder || ""}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          placeholder: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                      placeholder="Enter placeholder text for this question..."
                    />
                  </div>

                  {currentQuestion.qus_type !== "input" && (
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Options
                      </label>
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="mb-2">
                          <input
                            type="text"
                            value={
                              currentQuestion.options[`option${num}`] || ""
                            }
                            onChange={(e) =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                options: {
                                  ...currentQuestion.options,
                                  [`option${num}`]: e.target.value,
                                },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                            placeholder={`Option ${num}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveQuestionContent("question")}
                      className="px-4 py-2 bg-[#4A3AFF] text-white rounded-lg hover:bg-[#3D32CC] flex-grow"
                    >
                      {editingQuestionIndex !== null
                        ? "Update Question"
                        : "Add Question"}
                    </button>

                    {editingQuestionIndex !== null && (
                      <button
                        onClick={resetQuestionForm}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* {templateContents.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Added Questions
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {templateContents
                      .filter((item) => item.qus_type)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <span className="text-blue-600 font-medium mr-2">{`{${item.legal_temp_content_id}}`}</span>
                            <span className="text-sm truncate max-w-[150px]">
                              {item.question}
                            </span>
                          </div>
                          <div className="text-xs py-1 px-2 bg-blue-100 text-blue-700 rounded-full">
                            {item.qus_type}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="bg-white max-w-5xl mt-6 mx-auto rounded-xl border p-6 shadow-sm h-[calc(100vh-200px)] overflow-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Content List</h2>
            <CustomButton label={"Download PDF"} onClick={handleDownloadPDF} />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-[calc(100%-60px)] overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Loading preview...</p>
              </div>
            ) : (
              processDocumentPreview()
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDocumentCreator;
