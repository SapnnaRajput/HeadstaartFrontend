import React, { useState } from "react";
import axios from "axios";
import { notify } from "../../Utiles/Notification";
import { UserState } from "../../context/UserContext";
import CustomButton from "../../Utiles/CustomButton";
import Loader from "../../Utiles/Loader";
import { Info } from "lucide-react";
import { Tooltip } from "flowbite-react";

const VerificationModal = ({ isOpen, onClose }) => {
  const { user } = UserState();
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_number: "",
    id_front_image: null,
    id_back_image: null,
    net_worth: "",
    document: null,
    credit: null,
    bank_letter: null,
  });

  const netWorthRanges = [
    { value: "$100,000 - $500,000", label: "$100,000 - $500,000" },
    { value: "$500,000 - $1 Million", label: "$500,000 - $1 Million" },
    { value: "$1 Million - $5 Million", label: "$1 Million - $5 Million" },
    { value: "Over $10 Million", label: "Over $10 Million" },
  ];

  const [previews, setPreviews] = useState({
    id_front_image: null,
    id_back_image: null,
  });

  const [errors, setErrors] = useState({});

  const validateImageFile = (file) => {
    if (!file) return "File is required";
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type))
      return "Only JPG, JPEG or PNG files are accepted";
    if (file.size > 2 * 1024 * 1024) return "File size must be less than 2MB";
    return null;
  };

  const validatePdfFile = (file) => {
    if (!file) return "File is required";
    if (file.type !== "application/pdf") return "Only PDF files are accepted";
    if (file.size > 2 * 1024 * 1024) return "File size must be less than 2MB";
    return null;
  };

  const validateNetWorth = (value) => {
    if (!value) return "Net worth range is required";
    return null;
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  
    if (["id_front_image", "id_back_image"].includes(fieldName)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [fieldName]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id_number.trim()) {
      newErrors.id_number = "ID number is required";
    }

    const netWorthError = validateNetWorth(formData.net_worth);
    if (netWorthError) {
      newErrors.net_worth = netWorthError;
    }

    ["id_front_image", "id_back_image"].forEach((field) => {
      const fileError = validateImageFile(formData[field]);
      if (fileError) newErrors[field] = fileError;
    });

    ["document", "credit", "bank_letter"].forEach((field) => {
      const fileError = validatePdfFile(formData[field]);
      if (fileError) newErrors[field] = fileError;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    submitData.append("customer_unique_id", user?.customer?.customer_unique_id);

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/investor_fund_verification`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status) {
        onClose();
        setLoading(false);
        notify("success", "Verification submitted successfully");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      notify("error", "Verification failed. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData({
      id_number: '',
      id_front_image: null,
      id_back_image: null,
      net_worth: '',
      document: null,
      credit: null,
      bank_letter: null
    });
    setPreviews({
      id_front_image: null,
      id_back_image: null
    });
    setErrors({});
    onClose();
  };

  return (
    <>
      {loading && <Loader />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Fund Verification</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.id_number}
                  onChange={(e) => {
                    setFormData({ ...formData, id_number: e.target.value });
                    if (errors.id_number) {
                      setErrors({ ...errors, id_number: null });
                    }
                  }}
                />
                {errors.id_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.id_number}
                  </p>
                )}
              </div>

              {[
                { field: "id_front_image", label: "ID Front Side Photo" },
                { field: "id_back_image", label: "ID Back Side Photo" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex flex-col items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-4 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
                      {previews[field] ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={previews[field]}
                            alt={`${field} Preview`}
                            className="w-20 h-20 object-cover mb-2"
                          />
                          <span className="text-sm text-gray-500">
                            {formData[field]?.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Upload Here
                        </span>
                      )}
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, field)}
                        accept="image/png,image/jpeg,image/jpg"
                        className="hidden"
                      />
                    </label>
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {[
                { field: "document", label: "Utility Bill" },
                {
                  field: "credit",
                  label: "Letter of Credit",
                  tooltip:
                    "A certified letter from the investor’s bank or financial institution confirming their available funds.",
                },
                {
                  field: "bank_letter",
                  label: "Bank Letter",
                  tooltip:
                    "Recent bank statements (last 2-3 months) showing account balance.",
                },
              ].map(({ field, label, tooltip }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 flex">
                    {label}
                    {tooltip && (
                      <Tooltip
                        content={tooltip}
                        className="w-64 text-sm bg-gray-700"
                      >
                        <Info className="h-4 w-4 mx-2" />
                      </Tooltip>
                    )}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex flex-col items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-4 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
                      <span className="text-sm text-gray-500">
                        {formData[field] ? formData[field].name : "Upload Here"}
                      </span>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, field)}
                        accept=".pdf"
                        className="hidden"
                      />
                    </label>
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Net Worth Range<span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.net_worth}
                  onChange={(e) => {
                    setFormData({ ...formData, net_worth: e.target.value });
                    if (errors.net_worth) {
                      setErrors({ ...errors, net_worth: null });
                    }
                  }}Entrepreneur
                >
                  <option value="">Select Net Worth Range</option>
                  {netWorthRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                {errors.net_worth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.net_worth}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <CustomButton label={"Cancel"} cancel={true} onClick={handleClose} />
            <CustomButton label={"Verify"} onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationModal;
