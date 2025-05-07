import { useState, useEffect, useRef } from 'react';
import CustomButton from '../../../Utiles/CustomButton';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../Utiles/Loader';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';
import { notify } from '../../../Utiles/Notification';
import { Datepicker } from "flowbite-react";
import SignatureCanvas from "react-signature-canvas";
import { RotateCcw } from 'lucide-react';

const ESignComponent = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [formData, setFormData] = useState({
    company_name: '',
    company_logo: null,
    current_time: '',
    expiration_date: '',
    signature: null,
  });
  const [previews, setPreviews] = useState({
    company_logo: null,
    signature: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = UserState();
  const [documentId, setDocumentId] = useState(null);
  const [sigCanvas, setSigCanvas] = useState();
  

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    const eSignDocument = params.get('eSignDocument');
    if (eSignDocument) {
      setDocumentId(eSignDocument);
    } else {
      const localStorageId = localStorage.getItem('ans_unique_id');
      if (localStorageId) {
        setDocumentId(localStorageId);
      }
    }

    const handleInitialLoad = async () => {
      setLoading(true);
      try {
        if (sessionId) {
          await handlePaymentSuccess(sessionId);
        } else if (eSignDocument) {
          await loadDocumentData(eSignDocument);
        } else {
          navigate(`/${user.role}/e-sign-document`);
        }
      } catch (error) {
        console.error('Error during initial load:', error);
        notify(
          'error',
          error.response?.data?.message || 'Failed to load document'
        );
        navigate(`/${user.role}/e-sign-document`);
      } finally {
        setLoading(false);
      }
    };

    handleInitialLoad();
  }, [location.search]);

  // Clear the signature
  const clear = () => {
    sigCanvas.clear();
    setSignInImage(null);
  };


  const loadDocumentData = async (documentId) => {
    console.log(documentId);
  };

  const handlePaymentSuccess = async (sessionId) => {
    try {
      const endpoint = `${baseUrl}/legal_checkout_success`;
      const response = await axios.post(
        endpoint,
        {
          payment_id: sessionId,
          status: true,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status) {
        notify('success', 'Payment completed successfully');
        navigate(`/${user.role}/e-sign-document`);
      } else {
        notify('error', response.data.message || 'Failed to verify payment');
        navigate(`/${user.role}/e-sign-document`);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
      setFormData((prev) => ({ ...prev, current_time: timeString }));
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  // const getMinMaxDates = () => {
  //   const today = new Date();
  //   const maxDate = new Date();
  //   maxDate.setDate(today.getDate() + 30);

  //   return {
  //     min: formatDateToMMDDYYYY(today),
  //     max: formatDateToMMDDYYYY(maxDate)
  //   };
  // };

  const formatDateToMMDDYYYY = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Keep YYYY-MM-DD for input value
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    if (!formData.expiration_date) {
      newErrors.expiration_date = 'Expiration date is required';
    }
    if (sigCanvas.isEmpty()) {
      newErrors.signature = 'Signature is required';
    }
    // if (!formData.signature) {
    //   newErrors.signature = 'Signature is required';
    // }
    return newErrors;
  };

  const validateFile = (file, type) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return `Only PNG, JPEG, and JPG files are allowed`;
    }

    const maxSize = type === 'signature' ? 100 * 1024 : 1024 * 1024;
    if (file.size > maxSize) {
      return `File size must be less than ${
        type === 'signature' ? '100KB' : '1MB'
      }`;
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file, type);
      if (error) {
        setErrors((prev) => ({ ...prev, [type]: error }));
        setPreviews((prev) => ({ ...prev, [type]: null }));
        e.target.value = '';
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [type]: previewUrl }));
      setFormData((prev) => ({ ...prev, [type]: file }));
      setErrors((prev) => ({ ...prev, [type]: '' }));
    }
  };

  // Helper function to convert Base64 to Blob
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const newErrors = validateForm();

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('ans_unique_id', documentId);
      formDataToSend.append('company_name', formData.company_name);
      formDataToSend.append('company_logo', formData.company_logo);
      formDataToSend.append('time', formData.current_time);

      const [year, month, day] = formData.expiration_date.split('-');
      const formattedDate = `${month}-${day}-${year}`;
      formDataToSend.append('expired_date', formData.expiration_date);

      const blob = dataURLtoBlob(sigCanvas.toDataURL('image/jpeg'));
      formDataToSend.append('signature', blob, 'signature.jpg');
      // formDataToSend.append('signature', formData.signature);

      const response = await axios.post(
        `${baseUrl}/add_signature`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status) {
        localStorage.removeItem('ans_unique_id');
        notify('success', 'Document Sign Successfully');
        navigate(`/${user.role}/documents`);
      } else {
        notify('error', response.data.message);
      }
    } catch (error) {
      console.log(error);

      notify('error', error.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  // const { min: minDate, max: maxDate } = getMinMaxDates();

  const getMinMaxDates = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    return { minDate: today, maxDate };
  };

  const { minDate, maxDate } = getMinMaxDates();

  const handleDateChange = (selectedDate) => {
    // alert(selectedDate)
    // Format the date as MM-DD-YYYY
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;

    setFormData((prev) => ({
      ...prev,
      expiration_date: formattedDate,
    }));

    // Clear any existing date-related errors
    if (errors.expiration_date) {
      setErrors((prev) => ({ ...prev, expiration_date: '' }));
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="max-w-xl mx-auto mt-4 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">e-Sign</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              Company Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name"
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>

            <div className="relative w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition">
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'company_logo')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <p className="text-gray-600 text-sm">
                  Click to upload Company logo
                </p>
                <p className="text-gray-400 text-xs">PNG, JPG (Max: 2MB)</p>
              </div>
            </div>

            {previews.company_logo && (
              <div className="mt-3 relative w-full max-w-xs rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={previews.company_logo}
                  alt="Company logo preview"
                  className="w-full h-32 object-contain transition-transform duration-300 hover:scale-105"
                />
                <button
                  onClick={() =>
                    setPreviews((prev) => ({ ...prev, company_logo: null }))
                  }
                  className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-7 h-7 text-xs hover:bg-red-500 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {errors.company_logo && (
              <p className="text-red-500 text-sm mt-2">{errors.company_logo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Current Time<span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.current_time}
              className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Expiration Date<span className="text-red-500">*</span>
            </label>
            <Datepicker
              weekStart={1}
              minDate={minDate}
              maxDate={maxDate}
              onChange={handleDateChange}
              defaultDate={
                formData.expiration_date
                  ? new Date(formData.expiration_date)
                  : undefined
              }
              className="w-full"
              placeholder="Select expiration date"
              formatDate={(date) => {
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${month}-${day}-${year}`;
              }}
            />
            {errors.expiration_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.expiration_date}
              </p>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature <span className="text-red-500">*</span>
            </label>

            {/* <div className="relative w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition">
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'signature')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <p className="text-gray-600 text-sm">Click to upload Signature</p>
                <p className="text-gray-400 text-xs">PNG, JPG (Max: 100KB)</p>
              </div>
            </div> */}

            <div className='border-2 border-gray-300 border-dashed rounded'>
              <SignatureCanvas
                ref={(ref) => setSigCanvas(ref)}
                penColor="black"
                backgroundColor="rgba(255,255,255,1)"
                canvasProps={{
                  width: 400,
                  height: 200,
                }}
              />
            </div>
            <div className="flex gap-3 mt-3 w-full items-center justify-center">
              <button className="bg-neutral-200 p-2 rounded" onClick={clear}>
                <RotateCcw />
              </button>
            </div>
            {previews.signature && (
              <div className="mt-3 relative w-full max-w-xs rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={previews.signature}
                  alt="Signature preview"
                  className="w-full h-32 object-contain transition-transform duration-300 hover:scale-105"
                />
                <button
                  onClick={() =>
                    setPreviews((prev) => ({ ...prev, signature: null }))
                  }
                  className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 h-6 w-6 text-xs hover:bg-red-500 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {errors.signature && (
              <p className="text-red-500 text-sm mt-2">{errors.signature}</p>
            )}
          </div>

          <div className="flex justify-end">
            <CustomButton onClick={handleSubmit} label="Save" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ESignComponent;