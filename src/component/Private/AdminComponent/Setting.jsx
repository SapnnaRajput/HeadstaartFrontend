import React, { useEffect, useState } from "react";
import { Camera, Eye, Pencil, EyeOff } from "lucide-react";
import FAQs from "./FAQ";
import PrivacyPolicy from "./PrivacyPolicy";
// import Credentials from "./Credentials";
import Tax from "./Tax";
import { UserState } from "../../../context/UserContext";
import { data } from "autoprefixer";
import axios from 'axios';
import { notify } from "../../../Utiles/Notification";
import LocationSelector from "../../../Utiles/LocationSelector";
import PhoneInput from "react-phone-input-2";
import CustomButton from "../../../Utiles/CustomButton";
import Loader from "../../../Utiles/Loader";
import { Modal } from "flowbite-react";
import HomeProjects from "./HomeProjects";
import AddReview from "./AddReview";
import FreeLead from "./FreeLead";

const Setting = () => {

  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [country, setCountry] = useState(null)
  const [state, setState] = useState(null)
  const [city, setCity] = useState(null)
  const [activeTab, setActiveTab] = useState("General");
  const [activeSubTab, setActiveSubTab] = useState("Investor");
  const [openModal, setOpenmodal] = useState(false);
  const [imageFile, setImageFile] = useState({
    img: '', new_img: '',
  });
  const [Data, setData] = useState()
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false
  });

  const getCustdata = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/user_data`, {
        user_id: user?.user_id
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response?.data?.status) {
        setData(response.data.user_data);
        setPhone(response.data.user_data.mobile ?? '')
        setCountry({ label: response.data.user_data?.country?.country_name, value: response.data.user_data?.country?.country_id })
        setState({ label: response.data.user_data?.state?.state_subdivision_name, value: response.data.user_data?.state?.state_subdivision_id })
        setCity({ label: response.data.user_data?.city?.name_of_city, value: response.data.user_data?.city?.cities_id })
        setImageFile({ new_img: response.data.user_data.user_image, img: response.data.user_data.user_image })
      }
    } catch (error) {
      notify("error", error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      getCustdata();
    }
  }, [user])

  const tabs = ["General", "FAQ", "Privacy Policy", "Credentials", 'Tax & Charges', "Home Projects", "Add Review", "Free Lead"];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        notify('error', 'Please upload a PNG, JPEG, or JPG file.');
        return;
      }
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        notify('error', 'File size should not exceed 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile({
          img: file,
          new_img: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleaddInfoChange = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneChange = (value, countryData) => {
    setPhone(value);
    setCountryCode(countryData.dialCode);
    setPhoneNumber(value.replace(countryData.dialCode, ''));
  };

  const Edit = async () => {
    if (!Data.full_name) {
      notify('danger', 'Please Enter Your Full Name');
      return;
    }
    if (!country) {
      notify('danger', 'Please Select Your Country');
      return;
    }
    if (!state) {
      notify('danger', 'Please Select Your State');
      return;
    }
    if (!city) {
      notify('danger', 'Please Select Your City');
      return;
    }
    if (!Data?.mobile) {
      notify('danger', 'Please Enter Your Mobile No.');
      return;
    }
    if (!Data.address) {
      notify('danger', 'Please Enter Your Address');
      return;
    }
    if (!Data.zip_code) {
      notify('danger', 'Please Enter Your Area Zip Code');
      return;
    }
    if (!Data.admin_mail) {
      notify('danger', 'Please Enter Reply by Mail');
      return;
    }

    const formData = new FormData();


    formData.append("user_profile", imageFile.img);
    formData.append("email", Data?.email);
    formData.append("full_name", Data.full_name);
    formData.append("mobile", '+' + countryCode + phone);
    formData.append("admin_mail", Data.admin_mail);
    formData.append("zip_code", Data.zip_code);
    formData.append("address", Data.address);
    formData.append("country", country.value);
    formData.append("state", state.value);
    formData.append("city", city.value);
    formData.append("user_id", Data?.user_id);

    setLoading(true)
    try {
      const response = await axios.post(`${baseUrl}/edit_user_profile`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        notify('success', 'Profile Update Successfully');
        getCustdata()
      } else {
        notify('success', response.data.message);
      }
    } catch (err) {
      console.log(err.response.data.message)
    }
    setLoading(false)
  }
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });

    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: "" });
    }
  };
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    });
  };

  const handleOpenModal = () => {
    setOpenmodal(true);
  };

  const changePassword = async () => {
    let errors = {
      current_password: "",
      new_password: "",
      confirm_password: "",
    };
    let hasError = false;

    if (!passwords.current_password) {
      errors.current_password = "Current password is required";
      hasError = true;
    }

    if (!passwords.new_password) {
      errors.new_password = "New password is required";
      hasError = true;
    } else if (passwords.new_password.length < 8) {
      errors.new_password = "Password must be at least 8 characters";
      hasError = true;
    }

    if (!passwords.confirm_password) {
      errors.confirm_password = "Please confirm your new password";
      hasError = true;
    } else if (passwords.new_password !== passwords.confirm_password) {
      errors.confirm_password = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/updatePasswordAdmin`,
        {
          current_password: passwords.current_password,
          new_password: passwords.new_password
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        setOpenmodal(false);
        setPasswords({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        notify("success", "Password changed successfully");
      } else {
        notify(
          "error",
          response.data.message || "Failed to change password"
        );
      }
    } catch (err) {
      notify(
        "error",
        err.response?.data?.message || "An error occurred"
      );
      console.log(err.response?.data?.message || err);
    }
    setLoading(false);
  };
  return (
    <>
      {loading && <Loader />}
      <div className="w-full bg-gray-50">
        <div className="w-full">
          {/* <div className="flex gap-8 mb-12 border-b px-4 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-lg ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div> */}

          <div className="flex gap-8 mb-12 border-b px-4 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === "Credentials") {
                    window.open("/superadmin/credentials", "_blank");
                  } else {
                    setActiveTab(tab);
                  }
                }}
                className={`pb-4 px-2 text-lg ${activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "General" && (
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-3 md:p-4">
              <div className="flex justify-end mb-2">
                <CustomButton
                  label="Change Password"
                  onClick={handleOpenModal}
                />
              </div>

              <div className="flex justify-center mb-8 md:mb-16">
                <div className="relative w-fit">
                  {imageFile.new_img ? (
                    <img
                      src={imageFile.new_img}
                      className="rounded-full h-16 w-16 md:h-24 md:w-24 object-cover aspect-square"
                      alt="Profile"
                    />
                  ) : (
                    <h1 className="rounded-full h-16 w-16 md:h-24 md:w-24 object-cover uppercase aspect-square text-xl md:text-2xl font-medium flex justify-center items-center bg-gray-200">
                      {Data?.name?.charAt()}
                    </h1>
                  )}
                  <label
                    htmlFor="image"
                    className="absolute right-0 bottom-1 cursor-pointer text-white bg-black flex justify-center items-center h-5 w-5 md:h-7 md:w-7 rounded-full"
                  >
                    <Pencil size={12} className="md:hidden" />
                    <Pencil size={16} className="hidden md:block" />
                    <input
                      type="file"
                      name="customer_profile"
                      accept="image/*"
                      id="image"
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-4 md:mb-5">
                <div className="flex flex-col">
                  <span className="text-sm md:text-base">Full Name</span>
                  <input
                    type="text"
                    className="rounded-md border-neutral-300 text-sm md:text-base"
                    onChange={handleaddInfoChange}
                    value={Data?.full_name}
                    name="full_name"
                    placeholder="Enter Full Name"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm md:text-base">Email</span>
                  <input
                    type="email"
                    className="rounded-md border-neutral-300 text-sm md:text-base"
                    onChange={handleaddInfoChange}
                    value={Data?.email}
                    name="email"
                    placeholder="Enter Email"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm md:text-base">Phone Number</span>
                  <PhoneInput
                    country={"us"}
                    value={phone}
                    countryCodeEditable={false}
                    enableSearch={true}
                    placeholder="Enter Mobile Number"
                    inputClass="input-mobile py-2 md:py-5 mt-1 block border border-gray-300 rounded-lg overflow-hidden shadow-sm focus:outline-none focus:border-gray-300 focus:ring-gray-400 focus:ring-1 text-sm md:text-base"
                    onChange={handlePhoneChange}
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm md:text-base">Admin Mail</span>
                  <input
                    type="email"
                    className="rounded-md border-neutral-300 text-sm md:text-base"
                    onChange={handleaddInfoChange}
                    value={Data?.admin_mail}
                    name="admin_mail"
                    placeholder="Enter Admin Email"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm md:text-base">Address</span>
                  <input
                    type="text"
                    className="rounded-md border-neutral-300 text-sm md:text-base"
                    onChange={handleaddInfoChange}
                    value={Data?.address}
                    name="address"
                    placeholder="Enter Address"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm md:text-base">Zip Code</span>
                  <input
                    type="number"
                    className="rounded-md border-neutral-300 no-arrows text-sm md:text-base"
                    onChange={handleaddInfoChange}
                    value={Data?.zip_code}
                    name="zip_code"
                    placeholder="Enter Zip Code"
                  />
                </div>
              </div>

              <LocationSelector
                selectedCountry={country}
                selectedState={state}
                selectedCity={city}
                onCountryChange={setCountry}
                onStateChange={setState}
                onCityChange={setCity}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 w-full"
                labelClass="text-sm md:text-base"
                inputClass="w-full text-sm md:text-base"
              />

              <div className="flex justify-center flex-row gap-3 md:gap-5 mt-4 md:mt-5">
                <CustomButton
                  onClick={getCustdata}
                  cancel={true}
                  label={"Cancel"}
                />
                <CustomButton onClick={Edit} label={"Update"} />
              </div>
            </div>
          )}

          {activeTab === "FAQ" && (
            <>
              <FAQs />
            </>
          )}

          {activeTab === "Privacy Policy" && (
            <>
              <PrivacyPolicy />
            </>
          )}
          {/* {activeTab === "Credentials" && (
            <>
              <Credentials />
            </>
          )} */}
          {activeTab === "Tax & Charges" && (
            <>
              <Tax />
            </>
          )}
          {activeTab === "Home Projects" && (
            <>
              <HomeProjects />
            </>
          )}
          {activeTab === "Add Review" && (
            <>
              <AddReview />
            </>
          )}
          {activeTab === "Free Lead" && (
            <>
              <FreeLead userData={Data} />
            </>
          )}

        </div>
      </div>
      <Modal
        show={openModal}
        onClose={() => {
          setOpenmodal(false);
          setPasswords({
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
          setPasswordErrors({
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
        }}
        size="md"
      >
        <Modal.Header>Change Password</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password<span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type={
                    passwordVisibility.current_password ? "text" : "password"
                  }
                  name="current_password"
                  value={passwords.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("current_password")}
                >
                  {passwordVisibility.current_password ? (
                    <Eye className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {passwordErrors.current_password && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.current_password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password<span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type={passwordVisibility.new_password ? "text" : "password"}
                  name="new_password"
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("new_password")}
                >
                  {passwordVisibility.new_password ? (
                    <Eye className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {passwordErrors.new_password && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.new_password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type={
                    passwordVisibility.confirm_password ? "text" : "password"
                  }
                  name="confirm_password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Confirm Password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("confirm_password")}
                >
                  {passwordVisibility.confirm_password ? (
                    <Eye className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {passwordErrors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.confirm_password}
                </p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setOpenmodal(false);
                setPasswords({
                  current_password: "",
                  new_password: "",
                  confirm_password: "",
                });
                setPasswordErrors({
                  current_password: "",
                  new_password: "",
                  confirm_password: "",
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={changePassword}
              disabled={loading}
              className="px-4 py-2 text-sm bg-[#4A3AFF] text-white rounded-lg hover:scale-105 transition-all duration-300 ease-out"
            >
              {loading ? "Processing..." : "Change Password"}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Setting;
