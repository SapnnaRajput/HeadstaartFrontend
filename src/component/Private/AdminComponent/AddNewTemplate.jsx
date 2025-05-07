import React, { useState, useEffect } from "react";
import SelectDropdown from "../../../Utiles/SelectDropdown";
import { UserState } from "../../../context/UserContext";
import axios from "axios";
import Loader from "../../../Utiles/Loader";
import CustomButton from "../../../Utiles/CustomButton";
import { notify } from "../../../Utiles/Notification";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const AddNewTemplate = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [formData, setFormData] = useState({
    documentName: "",
    numberOfSignature: "",
    price: "",
    description: "",
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [addNewTemplate, setAddNewTemplate] = useState(true);
  const [selectCountryTemplate, setSelectCountryTemplate] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [newTemplateData, setNewTemplateData] = useState(null);
  const [selectedCategoryForTemplate, setSelectedCategoryForTemplate] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const navigate = useNavigate()

  const getCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_category`);
      if (response.data.status) {
        const formattedCategories = response.data.category.map((cat) => ({
          value: cat.category_id,
          label: cat.category_name,
          ...cat,
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      notify("error", "Failed to fetch categories");
    }
    setLoading(false);
  };

  const getFilterCountries = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getAllCountries`);
      if (response.data.status) {
        const formattedCountries = [
          ...response.data.allCountries.map((country) => ({
            value: country.country_id,
            label: country.country_name,
            ...country,
          })),
        ];
        setCountries(formattedCountries);
        setSelectedCountry(formattedCountries[0]);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
    getFilterCountries();
  }, [baseUrl, user]);

  useEffect(() => {
    if (newTemplateData && categories.length > 0) {
      const categoryMatch = categories.find(
        (cat) => cat.value === newTemplateData?.category_id
      );

      if (categoryMatch) {
        setSelectedCategoryForTemplate(categoryMatch);
      }
    }
  }, [newTemplateData, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numericValue = value.replace(/[^\d.]/g, "");

      const parts = numericValue.split(".");
      const formattedValue =
        parts.length > 1
          ? `${parts[0]}.${parts.slice(1).join("")}`
          : numericValue;

      setFormData({
        ...formData,
        [name]: formattedValue,
      });

      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null,
        });
      }
    } else if (name === "numberOfSignature") {
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData({
        ...formData,
        [name]: numericValue,
      });

      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null,
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.documentName.trim()) {
      newErrors.documentName = "Document name is required";
    } else if (formData.documentName.trim().length < 3) {
      newErrors.documentName = "Document name must be at least 3 characters";
    }

    if (!selectedCategoryId) {
      newErrors.industry = "Industry selection is required";
    }

    if (!formData.numberOfSignature) {
      newErrors.numberOfSignature = "Number of signatures is required";
    } else if (parseInt(formData.numberOfSignature) <= 0) {
      newErrors.numberOfSignature =
        "Number of signatures must be greater than 0";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      notify("error", firstError);
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        document_name: formData.documentName,
        category_id: selectedCategoryId.value,
        signature: formData.numberOfSignature,
        price: formData.price,
        description: formData.description.trim(),
      };

      const response = await axios.post(
        `${baseUrl}/add_template`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        setNewTemplateData(response.data.data);
        setAddNewTemplate(false);
        setSelectCountryTemplate(true);
        notify("success", response.data.message);
      } else {
        notify("error", response.data.message || "Failed to add template");
      }
      setFormData({
        documentName: "",
        numberOfSignature: "",
        price: "",
        description: "",
      });
      setSelectedCategoryId("");
    } catch (error) {
      console.error("Error submitting template:", error);
      notify(
        "error",
        error.response?.data?.message || "Failed to submit template"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      documentName: "",
      numberOfSignature: "",
      price: "",
      description: "",
    });
    setSelectedCategoryId("");
    setErrors({});
    navigate(`/${user.role}/document-management`)
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#e5e7eb',
      '&:hover': {
        borderColor: '#3b82f6'
      },
      boxShadow: 'none',
      padding: '1px'
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e5e7eb'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#374151'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      ':hover': {
        backgroundColor: '#ef4444',
        color: 'white'
      }
    })
  };


  const handleSubmitWithCountry = async() => {
    setLoading(true);
    const countryIds = selectedCountries.map(country => country.value);
    try {
      const submissionData = {
        country_ids: countryIds,
        legal_templates_id: newTemplateData.legal_templates_id
      };

      const response = await axios.post(
        `${baseUrl}/add_template_country`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        notify("success", response.data.message);
        navigate(`/${user.role}/create-legal-template?legal_templates_id=${response.data.legal_templates_id}`);
        setNewTemplateData(null);
      } else {
        notify("error", response.data.message || "Failed to add template");
      }
    } catch (error) {
      console.error("Error submitting template:", error);
      notify(
        "error",
        error.response?.data?.message || "Failed to submit template"
      );
    } finally {
      setLoading(false);
    }

  };
  const handleBack = () => {
    setAddNewTemplate(true);
    setSelectCountryTemplate(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded">
        {addNewTemplate && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="documentName"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Documents Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="documentName"
                name="documentName"
                placeholder="Enter a document name"
                value={formData.documentName}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.documentName ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              />
              {errors.documentName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.documentName}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="industry"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <SelectDropdown
                      value={selectedCategoryId}
                      onChange={(value) => {
                        setSelectedCategoryId(value);
                        if (errors.industry) {
                          setErrors({
                            ...errors,
                            industry: null,
                          });
                        }
                      }}
                      options={categories.map((category) => ({
                        value: category.category_id,
                        label: category.category_name,
                      }))}
                      placeholder="Select Industry"
                      isLoading={loading}
                    />
                    {errors.industry && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.industry}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="numberOfSignature"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Number of Signature <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="numberOfSignature"
                name="numberOfSignature"
                placeholder="Enter a number of signature"
                value={formData.numberOfSignature}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.numberOfSignature
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              />
              {errors.numberOfSignature && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberOfSignature}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  USD $
                </span>
                <input
                  type="text"
                  id="price"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-16 p-2 border ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  required
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter a description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full p-2 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex flex-row items-center justify-end gap-4">
              <CustomButton onClick={handleSubmit} label="Next" />
              <CustomButton
                onClick={handleCancel}
                label="Cancel"
                cancel={true}
              />
            </div>
          </form>
        )}

        {selectCountryTemplate && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-md font-medium mb-1">
                Countries <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                name="countries"
                options={countries}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedCountries}
                onChange={setSelectedCountries}
                placeholder="Select Countries"
                isLoading={loading}
                styles={customStyles}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can select multiple countries
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="documentName"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Documents Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="documentName"
                name="documentName"
                placeholder="Enter a document name"
                value={newTemplateData?.document_name}
                className={`w-full p-2 border rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                disabled
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="industry"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <SelectDropdown
                      value={selectedCategoryForTemplate}
                      onChange={(value) => {
                        setSelectedCategoryForTemplate(value);
                      }}
                      options={categories.map((category) => ({
                        value: category.category_id,
                        label: category.category_name,
                      }))}
                      placeholder="Select Industry"
                      isLoading={loading}
                      isDisabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="numberOfSignature"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Number of Signature <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="numberOfSignature"
                name="numberOfSignature"
                placeholder="Enter a number of signature"
                value={newTemplateData?.signature}
                className={`w-full p-2 border bg-gray-100  rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                disabled
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  USD $
                </span>
                <input
                  type="text"
                  id="price"
                  name="price"
                  placeholder="0.00"
                  value={newTemplateData?.price}
                  className={`w-full pl-16 p-2 bg-gray-100 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  disabled
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter a description"
                value={newTemplateData?.description}
                rows="4"
                className={`w-full p-2 border bg-gray-100  rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
                disabled
              />
            </div>

            <div className="flex flex-row items-center justify-end gap-4 space-y-2">
              <CustomButton onClick={handleSubmitWithCountry} label="Submit" />
              <CustomButton onClick={handleBack} label="Back" cancel={true} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddNewTemplate;
