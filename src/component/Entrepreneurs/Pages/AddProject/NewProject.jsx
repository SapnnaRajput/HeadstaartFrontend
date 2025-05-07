import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../../Utiles/Loader";
import { ChevronDown, Upload, Check, Plus } from "lucide-react";
import CustomButton from "../../../../Utiles/CustomButton";
import { notify } from "../../../../Utiles/Notification";
import LocationSelector from "../../../../Utiles/LocationSelector";
import Select from "react-select";
import SelectDropdown from "../../../../Utiles/SelectDropdown";
import { UserState } from "../../../../context/UserContext";
import { Modal } from "flowbite-react";
import { useNavigate, useSearchParams } from "react-router-dom";
const NewProject = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;

  const { user } = UserState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sell Stake");
  const [checkedItems, setCheckedItems] = useState({
    contactAgents: false,
    contactInvestors: true,
    flagProjects: true,
  });
  const [newProjectForm, setNewProjectForm] = useState(true);
  const [upload, setUpload] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stage, setStages] = useState([]);
  const [info, setInfo] = useState([
    {
      heading: "",
      value: "",
    },
  ]);
  const [formDataName, setFormData] = useState({
    title: "",
    businessDescription: "",
    companyName: "",
    zipCode: "",
    website: "",
    equity: "",
    fundingAmount: "",
  });
  const [pitchDeckFile, setPitchDeckFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [pitchDeckTemplates, setPitchDeckTemplates] = useState([]);
  const [selectedPitchDeckTemplate, setSelectedPitchDeckTemplate] =
  useState(null);
  const [searchParams] = useSearchParams();
  const creation = searchParams.get("project_creation");
  const [pitchDeckOption, setPitchDeckOption] = useState(creation ? "ai" : "upload");


  useEffect(() => {
    console.log(formDataName);

    
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/get_category`);
        if (response.data.status) {
          const options = response.data.category.map((cat) => ({
            value: {
              category_id: cat.category_id,
              category_code: cat.category_code,
            },
            label: cat.category_name,
          }));
          setCategories(options);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const getPitchDeck = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/get_pitch`, {
          customer_unique_id: user?.customer?.customer_unique_id,
        });
        if (response.data.status && response.data.data) {
          const options = [
            { value: "", label: "Select Pitch Deck" },
            ...response.data.data.map((item) => ({
              value: item.pitch_doc,
              label: item.doc_name,
            })),
          ];
          setPitchDeckTemplates(options);
        }
      } catch (error) {
        notify("error", "Unauthorized access please login again");
      } finally {
        setLoading(false);
      }
    };
    getPitchDeck();

    fetchCategories();
  }, []);

  useEffect(() => {
    const businessStage = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/get_business_stage`);
        if (response.data.status) {
          const options = response.data.business_stages.map((stage) => ({
            value: {
              stage_id: stage.business_stage_id,
              stage_name: stage.business_stage_name,
            },
            label: stage.business_stage_name,
          }));
          setStages(options);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    businessStage();
  }, []);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const handleStageChange = (selectedOption) => {
    setSelectedStage(selectedOption);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const RequiredLabel = ({ text }) => (
    <div className="block text-base text-gray-800 mb-2">
      {text}
      <span className="text-red-500 ml-0.5">*</span>
    </div>
  );
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e, fileType) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    switch (fileType) {
      case "photo":
        const validImageFiles = files.filter((file) => {
          if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
            notify(
              "error",
              "Only JPG, JPEG, and PNG files are allowed for images"
            );
            return false;
          }
          if (file.size > MAX_FILE_SIZE) {
            notify("error", `Image ${file.name} exceeds 2MB size limit`);
            return false;
          }
          return true;
        });
        setPhotoFiles((prev) => [...prev, ...validImageFiles]);
        break;

      case "video":
        const validVideoFiles = files.filter((file) => {
          if (!file.type.startsWith("video/")) {
            notify("error", "Only video files are allowed");
            return false;
          }
          if (file.size > MAX_FILE_SIZE) {
            notify("error", `Video ${file.name} exceeds 2MB size limit`);
            return false;
          }
          return true;
        });
        setVideoFiles((prev) => [...prev, ...validVideoFiles]);
        break;

      case "document":
        const validDocFiles = files.filter((file) => {
          if (file.type !== "application/pdf") {
            notify("error", "Only PDF files are allowed");
            return false;
          }
          if (file.size > MAX_FILE_SIZE) {
            notify("error", `Document ${file.name} exceeds 2MB size limit`);
            return false;
          }
          return true;
        });
        setDocumentFiles((prev) => [...prev, ...validDocFiles]);
        break;

      case "pitchDeck":
        if (files[0].size > MAX_FILE_SIZE) {
          notify("error", `Pitch deck exceeds 2MB size limit`);
          return;
        }
        setPitchDeckFile(files[0]);
        break;
    }
  };
  const validateForm = () => {
    const requiredFields = [
      "title",
      "businessDescription",
      "zipCode",
      "equity",
      "fundingAmount",
    ];
    for (const field of requiredFields) {
      if (!formDataName[field]) {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        notify("error", `${formattedField} is required.`);
        return false;
      }
    }
    if (!selectedCountry) {
      notify("error", "Please complete the location selection.");
      return false;
    }
    if (!selectedCategory) {
      notify("error", "Please select Industry.");
      return false;
    }
    if (pitchDeckOption === "upload" && !pitchDeckFile) {
      notify("error", "Please upload a pitch deck file.");
      return false;
    } else if (pitchDeckOption === "ai" && !selectedPitchDeckTemplate) {
      notify("error", "Please select a pitch deck template.");
      return false;
    }
    return true;
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, fileType) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    switch (fileType) {
      case "photo":
        const validImageFiles = files.filter((file) => {
          if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
            notify(
              "error",
              "Only JPG, JPEG, and PNG files are allowed for images"
            );
            return false;
          }
          if (file.size > MAX_FILE_SIZE) {
            notify("error", `Image ${file.name} exceeds 2MB size limit`);
            return false;
          }
          return true;
        });
        setPhotoFiles((prev) => [...prev, ...validImageFiles]);
        break;

      case "video":
        const validVideoFiles = files.filter((file) => {
          if (!file.type.startsWith("video/")) {
            notify("error", "Only video files are allowed");
            return false;
          }
          if (file.size > MAX_FILE_SIZE) {
            notify("error", `Video ${file.name} exceeds 2MB size limit`);
            return false;
          }
          return true;
        });
        setVideoFiles((prev) => [...prev, ...validVideoFiles]);
        break;

      case "document":
        const validDocFiles = files.filter((file) => {
          if (file.type !== "application/pdf") {
            notify("error", "Only PDF files are allowed");
            return false;
          }
          if (file.size > MAX_FILE_SIZE) {
            notify("error", `Document ${file.name} exceeds 2MB size limit`);
            return false;
          }
          return true;
        });
        setDocumentFiles((prev) => [...prev, ...validDocFiles]);
        break;
    }
  };
  const removeFile = (index, fileType) => {
    switch (fileType) {
      case "photo":
        setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
        break;
      case "video":
        setVideoFiles((prev) => prev.filter((_, i) => i !== index));
        break;
      case "document":
        setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const handelNextClick = () => {
    setNewProjectForm(false);
    setUpload(true);
  };
  const handelDocumentBackClick = () => {
    setUpload(false);
    setNewProjectForm(true);
  };

  const handleAddNew = () => {
    setInfo([...info, { heading: "", value: "" }]);
  };

  const handleDelete = (index) => {
    if (info.length > 1) {
      const updatedInfo = info.filter((_, i) => i !== index);
      setInfo(updatedInfo);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedInfo = [...info];
    updatedInfo[index][field] = value;
    setInfo(updatedInfo);
  };

  const handelDocumentNextClick = async () => {
    if (validateForm()) {
      const formData = new FormData();

      formData.append("customer_unique_id", user.customer.customer_unique_id);
      formData.append("title", formDataName.title);
      formData.append("zip_code", formDataName.zipCode);
      formData.append("category_id", selectedCategory?.value?.category_id);
      const selectedProjectTypes = Object.keys(checkedItems).filter(
        (key) => checkedItems[key]
      );

      if (selectedProjectTypes.length > 0) {
        selectedProjectTypes.forEach((type, index) => {
          formData.append(`project_type[${index}]`, type);
        });
      }
      formData.append("sell_type", selectedOption);
      formData.append("country", selectedCountry.value);
      formData.append("state", selectedState.value);
      formData.append("city", selectedCity.value);
      formData.append("company_name", formDataName.companyName);
      formData.append("website_name", formDataName.website);
      formData.append("fund_amount", formDataName.fundingAmount);
      formData.append("equity", formDataName.equity);
      formData.append("description", formDataName.businessDescription);
      formData.append("business_stage_id", selectedStage?.value?.stage_id);

      const validInfo = info.filter(
        (item) => item.heading.trim() !== "" || item.value.trim() !== ""
      );

      if (validInfo.length > 0) {
        validInfo.forEach((item, index) => {
          formData.append(
            `additional_info[${index}][heading]`,
            item.heading.trim()
          );
          formData.append(
            `additional_info[${index}][value]`,
            item.value.trim()
          );
        });
      }
      if (photoFiles.length > 0) {
        photoFiles.forEach((file, index) => {
          formData.append("photo[]", file);
        });
      }

      if (videoFiles.length > 0) {
        videoFiles.forEach((file, index) => {
          formData.append("video[]", file);
        });
      }

      if (documentFiles.length > 0) {
        documentFiles.forEach((file, index) => {
          formData.append("document[]", file);
        });
      }

      if (pitchDeckOption === "upload" && pitchDeckFile) {
        formData.append("pitch_deck_file", pitchDeckFile);
      } else if (pitchDeckOption === "ai" && selectedPitchDeckTemplate?.value) {
        formData.append("pitch_deck_file", selectedPitchDeckTemplate.value);
      }
      try {
        setLoading(true);
        const response = await axios.post(`${baseUrl}/add_new_project_web`, formData, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status) {
          setFormData({
            title: "",
            category: "",
            businessDescription: "",
            companyName: "",
            zipCode: "",
            website: "",
            equity: "",
            fundingAmount: "",
          });
          setSelectedOption("Sell Stake");
          setCheckedItems({
            contactAgents: false,
            contactInvestors: true,
            flagProjects: true,
          });
          setSelectedCategory(null);
          setSelectedCountry("");
          setSelectedState("");
          setSelectedCity("");
          setPitchDeckFile(null);
          setPhotoFile(null);
          setVideoFile(null);
          setDocumentFile(null);
          setNewProjectForm(true);
          setInfo([{ heading: "", value: "" }]);
          setUpload(false);
          setPhotoFiles([]);
          setVideoFiles([]);
          setDocumentFiles([]);
          navigate(`/${user.role}/projects`);
          notify("success", "Project created successfully!");
        } else {
          notify("error", response.data.message);
        }
      } catch (error) {
        console.error("Error creating project:", error);
        notify("error", response.data.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePitchDeckTemplateChange = (selectedOption) => {
    setSelectedPitchDeckTemplate(selectedOption);
  };
  const removePitchDeckFile = () => {
    setPitchDeckFile(null);
  };
  

  return (
    <>
      {loading && <Loader />}
      <div className="container mx-auto rounded-xl p-6 bg-white">
        {newProjectForm && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold mb-6">
              {creation ? 'AI Assisted Creation' : 'Standard Creation'}
            </h1>
            <div>
              <RequiredLabel text="Choose Option" />
              <div className="flex gap-4">
                <label
                  className={`flex-1 relative border rounded px-4 py-2.5 cursor-pointer group ${
                    selectedOption === 'Sell Stake'
                      ? 'border-indigo-600'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedOption('Sell Stake')}
                >
                  <input
                    type="radio"
                    name="option"
                    checked={selectedOption === 'Sell Stake'}
                    onChange={() => setSelectedOption('Sell Stake')}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Sell Stake</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedOption === 'Sell Stake'
                          ? 'border-2 border-indigo-600'
                          : 'border-2 border-gray-300'
                      } group-hover:border-indigo-700`}
                    >
                      {selectedOption === 'Sell Stake' && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600 group-hover:bg-indigo-700"></div>
                      )}
                    </div>
                  </div>
                </label>

                <label
                  className={`flex-1 relative border rounded px-4 py-2.5 cursor-pointer group ${
                    selectedOption === 'Sell Business'
                      ? 'border-indigo-600'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedOption('Sell Business')}
                >
                  <input
                    type="radio"
                    name="option"
                    checked={selectedOption === 'Sell Business'}
                    onChange={() => setSelectedOption('Sell Business')}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Sell Business</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedOption === 'Sell Business'
                          ? 'border-2 border-indigo-600'
                          : 'border-2 border-gray-300'
                      } group-hover:border-indigo-700`}
                    >
                      {selectedOption === 'Sell Business' && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600 group-hover:bg-indigo-700"></div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2">
                  <RequiredLabel text="Title" />
                  <input
                    name="title"
                    value={formDataName.title}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Type Here..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <RequiredLabel text="Industry" />
                  <SelectDropdown
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    options={categories}
                    placeholder="Select Industry"
                  />
                </div>
              </div>
              <div>
                <RequiredLabel text="Business description" />
                <textarea
                  name="businessDescription"
                  value={formDataName.businessDescription}
                  onChange={handleInputChange}
                  placeholder="Type Here..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-sm ${
                      formDataName.businessDescription.length > 1000
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {formDataName.businessDescription.length}/1000 characters
                  </span>
                </div>
              </div>
            </div>

            <LocationSelector
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              selectedCity={selectedCity}
              onCountryChange={setSelectedCountry}
              onStateChange={setSelectedState}
              onCityChange={setSelectedCity}
              className="col-span-2 grid grid-cols-3 gap-2"
              labelClass="block text-base text-gray-800 mb-2"
              inputClass=" border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <div className="grid grid-cols-3 gap-2">
              <div>
                <RequiredLabel text="Business Stage" />
                <SelectDropdown
                  value={selectedStage}
                  onChange={handleStageChange}
                  options={stage}
                  placeholder="Select Industry"
                />
              </div>
              <div>
                <RequiredLabel text="Company Name" />
                <input
                  name="companyName"
                  value={formDataName.companyName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type Here..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <RequiredLabel text="Zip Code" />
                <input
                  name="zipCode"
                  value={formDataName.zipCode}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type Here..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base text-gray-800 mb-2">
                  Website
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  name="website"
                  value={formDataName.website}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type Here..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <div className="space-y-[7px]">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative w-5 h-5">
                        <input
                          type="radio"
                          name="pitchDeckOption"
                          value="upload"
                          checked={pitchDeckOption === 'upload'}
                          onChange={(e) => setPitchDeckOption(e.target.value)}
                          className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-indigo-600 peer-hover:border-indigo-400 transition-colors flex items-center justify-center">
                          {pitchDeckOption === 'upload' && (
                            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        Upload Pitch Deck
                      </span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative w-5 h-5">
                        <input
                          type="radio"
                          name="pitchDeckOption"
                          value="ai"
                          checked={pitchDeckOption === 'ai'}
                          onChange={(e) => setPitchDeckOption(e.target.value)}
                          className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-indigo-600 peer-hover:border-indigo-400 transition-colors flex items-center justify-center">
                          {pitchDeckOption === 'ai' && (
                            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        AI Pitch Deck
                      </span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                  </div>

                  {pitchDeckOption === 'upload' ? (
                    <>
                      <div className="border border-gray-300  rounded flex items-center  text-gray-600 cursor-pointer hover:bg-gray-50 relative w-full">
                        {/* Hidden File Input */}
                        <input
                          name="pitchDeck"
                          type="file"
                          accept="application/pdf"
                          className="absolute left-0  top-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleFileChange(e, 'pitchDeck')}
                        />

                        {/* Custom Button */}
                        <span className="bg-gray-700 h-[45px] flex justify-center items-center text-white px-3 py-1">
                          Choose File
                        </span>

                        {/* File Name Display */}
                        <span className="truncate pl-2 text-gray-500">
                          {pitchDeckFile?.name || 'No file chosen'}
                        </span>
                      </div>

                      {/* {pitchDeckFile && (
                        <div className="w-full mt-0">
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{pitchDeckFile.name}</span>
                            <button
                              onClick={removePitchDeckFile}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )} */}
                    </>
                  ) : (
                    <SelectDropdown
                      value={selectedPitchDeckTemplate}
                      onChange={handlePitchDeckTemplateChange}
                      options={pitchDeckTemplates}
                      placeholder="Select Pitch Deck"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <RequiredLabel text="For Equity" />
                <input
                  name="equity"
                  value={formDataName.equity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  type="text"
                  placeholder="Ex: 12%"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <RequiredLabel text="Funding Amount" />
                <input
                  name="fundingAmount"
                  value={formDataName.fundingAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  type="text"
                  placeholder="Ex: $10 M"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    name="contactAgents"
                    checked={checkedItems.contactAgents}
                    onChange={handleCheckboxChange}
                    className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-indigo-600 peer-hover:border-indigo-400 transition-colors flex items-center justify-center">
                    {checkedItems.contactAgents && (
                      <Check className="w-3 h-3 text-indigo-600" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">Contact Agents</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    name="contactInvestors"
                    checked={checkedItems.contactInvestors}
                    onChange={handleCheckboxChange}
                    className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-indigo-600 peer-hover:border-indigo-400 transition-colors flex items-center justify-center">
                    {checkedItems.contactInvestors && (
                      <Check className="w-3 h-3 text-indigo-600" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  Directly Contact Investors
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    name="flagProjects"
                    checked={checkedItems.flagProjects}
                    onChange={handleCheckboxChange}
                    className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-indigo-600 peer-hover:border-indigo-400 transition-colors flex items-center justify-center">
                    {checkedItems.flagProjects && (
                      <Check className="w-3 h-3 text-indigo-600" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  Flag Your Projects
                </span>
              </label>
            </div>
            <div className="">
              <button
                onClick={() => setOpenModal(true)}
                className="flex flex-row place-items-center gap-5"
              >
                <Plus />
                Add Financials & Key Milestones
              </button>
            </div>
            <CustomButton onClick={handelNextClick} label="Next" />
          </div>
        )}
        {upload && (
          <div>
            <div className="p-6 bg-white rounded">
              <h1 className="text-2xl font-semibold mb-6">Upload</h1>

              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Upload Photos related to project (JPG, JPEG, PNG only)
                  <span className="text-red-500 ml-0.5">*</span>
                </p>
                <label
                  className="relative border-2 border-dashed border-gray-200 rounded p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-600 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'photo')}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png"
                    multiple
                    onChange={(e) => handleFileChange(e, 'photo')}
                  />
                  <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Upload your photos here or select{' '}
                    <span className="text-indigo-600">click to browse</span>
                  </p>
                  {photoFiles.length > 0 && (
                    <div className="mt-4 w-full">
                      {/* {photoFiles.map((file, index) => (
                        <div key={index} className="flex justify-between items-center text-sm text-gray-500 mt-2">
                          <span>{file.name}</span>
                          <button
                            onClick={() => removeFile(index, "photo")}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))} */}
                      <div className="mt-4 w-full grid grid-cols-10 gap-4">
                        {photoFiles.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-2">
                              <div className="text-white text-sm truncate">
                                {file.name}
                              </div>
                              <button
                                onClick={() => removeFile(index, 'photo')}
                                className="text-white bg-red-500 px-1 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Upload Videos related to project
                  <span className="text-red-500 ml-0.5">*</span>
                </p>
                <label
                  className="relative border-2 border-dashed border-gray-200 rounded p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-600 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'video')}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileChange(e, 'video')}
                  />
                  <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Upload your videos here or select{' '}
                    <span className="text-indigo-600">click to browse</span>
                  </p>
                  {videoFiles.length > 0 && (
                    <div className="mt-4 w-full">
                      {videoFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm text-gray-500 mt-2"
                        >
                          <span>{file.name}</span>
                          <button
                            onClick={() => removeFile(index, 'video')}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>
              </div>

              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Upload Documents related to project (PDF only)
                  <span className="text-red-500 ml-0.5">*</span>
                </p>
                <label
                  className="relative border-2 border-dashed border-gray-200 rounded p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-600 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'document')}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleFileChange(e, 'document')}
                  />
                  <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Upload your documents here or select{' '}
                    <span className="text-indigo-600">click to browse</span>
                  </p>
                  {documentFiles.length > 0 && (
                    <div className="mt-4 w-full">
                      {documentFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm text-gray-500 mt-2"
                        >
                          <span>{file.name}</span>
                          <button
                            onClick={() => removeFile(index, 'document')}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>
              </div>

              <div className="flex gap-5">
                <CustomButton
                  onClick={handelDocumentBackClick}
                  label="Back"
                  cancel={true}
                />
                <CustomButton
                  onClick={handelDocumentNextClick}
                  label="Create Project"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal size="5xl" show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Body>
          <div className="flex justify-center place-items-center">
            <h1 className="text-2xl font-semibold">
              Add Financials & Key Milestones
            </h1>
          </div>
          <div className="flex justify-end mt-5">
            <button
              className="text-[#4A3AFF] font-medium rounded-lg"
              onClick={handleAddNew}
            >
              Add More
            </button>
          </div>
          <div className="mt-5 space-y-6">
            {info.map((list, i) => (
              <div
                className="flex flex-row place-items-start gap-5 w-full"
                key={i}
              >
                <div className="w-full">
                  <label className="block font-medium">Heading</label>
                  <input
                    name="heading"
                    value={list.heading}
                    onChange={(e) => handleChange(i, 'heading', e.target.value)}
                    type="text"
                    placeholder="Type Here..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="w-full">
                  <label className="block font-medium">Description</label>
                  <textarea
                    name="value"
                    value={list.value}
                    onChange={(e) => handleChange(i, 'value', e.target.value)}
                    rows={3}
                    placeholder="Type Here..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div className="flex justify-between items-center mt-5">
                  <button
                    onClick={() => handleDelete(i)}
                    className={`text-red-500 font-medium rounded-lg ${
                      info.length === 1 ? 'hidden' : ''
                    }`}
                    disabled={info.length === 1}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-5">
              <CustomButton label="Save" onClick={() => setOpenModal(false)} />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewProject;
