import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader,
  Bot,
  MessageCircle,
  FileCheck,
  Plus,
  User,
} from "lucide-react";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";

const QuestionChat = ({
  questions = [],
  customer_unique_id,
  onSubmitAnswer,
  template,
}) => {
  const baseUrlAI = import.meta.env.VITE_APP_AI_BASEURL;
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPresentation, setIsGeneratingPresentation] =
    useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [url, setURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = UserState();
  const [answered, setAnswered] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (questions && questions.length > 0) {
      setMessages([
        {
          type: "question",
          content: questions[0].question,
          questionId: questions[0].question_id,
        },
      ]);
    }
  }, [questions]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generatePresentation = async () => {
    setIsGeneratingPresentation(true);
    try {
      const response = await axios.post(`${baseUrlAI}/generate-presentation`, {
        customer_unique_id: customer_unique_id,
        template_id: template,
      });
      if (response.data.status) {
        setURL(response.data.ppt_url);
        setOpenModal(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsGeneratingPresentation(false);
    }
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.match("image/(jpeg|jpg|png)")) {
        setSelectedFile(file);
        setInputValue(file.name); // Show filename in input
      } else {
        alert("Please upload only JPG, JPEG, or PNG images");
        setSelectedFile(null);
        setInputValue("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!inputValue.trim() && !selectedFile) || !questions?.length) return;

    setIsLoading(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const formData = new FormData();
      formData.append("customer_unique_id", customer_unique_id);
      formData.append("question_id", currentQuestion.question_id);

      if (currentQuestion.types === "file" && selectedFile) {
        formData.append("image", selectedFile);
      } else {
        formData.append("answer", inputValue);
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          content:
            currentQuestion.types === "file"
              ? "File uploaded: " + selectedFile.name
              : inputValue,
        },
      ]);

      await onSubmitAnswer(formData);
      setAnswered((prev) => prev + 1);

      if (currentQuestionIndex < questions.length - 1) {
        const nextQuestion = questions[currentQuestionIndex + 1];
        setCurrentQuestionIndex((prev) => prev + 1);
        setMessages((prev) => [
          ...prev,
          {
            type: "question",
            content: nextQuestion.question,
            questionId: nextQuestion.question_id,
            questionType: nextQuestion.types,
          },
        ]);
      } else {
        await generatePresentation();
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setInputValue("");
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const handleInputClick = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.types === "file") {
      fileInputRef.current?.click();
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <Loader className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading questions...</p>
      </div>
    );
  }

  const onDownload = async () => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = `presentation_${customer_unique_id}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading presentation:", error);
    }
  };

  const savepitch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/save_pitch `,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
          url: url,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        console.log(response.data.status);
      }
    } catch (error) {
      notify("error", "Unauthorized access please login again");
    } finally {
      setLoading(false);
    }
  };

  const onClose = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${baseUrlAI}/delete-response`, {
        data: {
          customer_unique_id: customer_unique_id,
        },
      });

      if (response.data.status) {
        setOpenModal(false);
        await savepitch();
        navigate("/entrepreneur/new-project?project_creation=AI-Assisted");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="flex flex-col h-[calc(100vh-130px)] bg-gray-100 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-full">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              AI Assistant ({answered + "/" + questions.length})
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "answer" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "question" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.type === "answer"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="text-lg">{message.content}</p>
              </div>
              {message.type === "answer" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
                  {!user?.customer?.customer_profile_image ? (
                    <img
                      src={user?.customer?.customer_profile_image}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8text-gray-500" />
                  )}
                </div>
              )}
            </div>
          ))}
          {isGeneratingPresentation && (
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 text-blue-500 animate-spin mr-2" />
              <p className="text-sm text-gray-600">
                Generating your presentation...
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t border-gray-200"
        >
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onClick={handleInputClick}
                placeholder={
                  questions[currentQuestionIndex]?.types === "file"
                    ? "Click to upload image (JPG, JPEG, PNG only)"
                    : "Type your answer here..."
                }
                className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                readOnly={questions[currentQuestionIndex]?.types === "file"}
              />
              {questions[currentQuestionIndex]?.types === "file" && (
                <Plus
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                  onClick={handleInputClick}
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
              />
            </div>
            <button
              type="submit"
              disabled={
                isLoading ||
                isGeneratingPresentation ||
                (!inputValue.trim() && !selectedFile) ||
                currentQuestionIndex >= questions.length
              }
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading || isGeneratingPresentation ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Share or Download Your Deck
                </h3>
                <p className="text-gray-600 text-sm">
                  You can now review and customize your deck
                </p>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    presentation Pitch Deck.PPT
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={onDownload}
                  className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Download as PPT
                </button>

                {/* <button
                                    onClick={onRegenerate}
                                    className="w-full py-3 border border-indigo-600 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <span>Re-Generate</span>
                                    <svg className="w-4 h-4 rotate-90" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button> */}

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  AI-Assisted Creation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionChat;
