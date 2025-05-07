import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Square, CheckSquare, Upload } from "lucide-react";
import axios from "axios";
import Img3 from "/assets/Img3.jpeg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LocationSelector from "../../Utiles/LocationSelector";
import { notify } from "../../Utiles/Notification";
import { error } from "highcharts";
import Loader from "../../Utiles/Loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Foooter";
import Logo from "../../Assets/Images/logo.png";
const WaitlistForm = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isStudent, setIsStudent] = useState(true);
    const [school_university, setSchoolUniversity] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState("");
    const [agentPercentage, setAgentPercentage] = useState(null);
    const [agentPercentageError, setAgentPercentageError] = useState("");
    const [agentInputPercentage, setAgentInputPercentage] = useState("");
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        otp: "",
        mobile: "",
        about_me: "",
        role: "",
        school_university: "",
    });
    const [showOTP, setShowOTP] = useState(false);
    const [studentIdFile, setStudentIdFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [ipAddress, setIpAddress] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // const capitalizeFirstLetter = (string) => {
    //     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    // };

    const handlePhoneChange = (value) => {
        setPhone(value);

        if (value.length >= 12) {
            setIsValid(true);
            setError("");
        } else {
            setIsValid(false);
            setError("Please enter a valid phone number");
        }
    };

    // useEffect(() => {
    //     const allowedTypes = ["entrepreneur", "investor", "agent"];
    //     if (!type || !allowedTypes.includes(type)) {
    //         navigate("/sign-up-as");
    //     }
    // }, [type, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // useEffect(() => {
    //     const postData = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await axios.get(`${baseUrl}/get_agent_percentage `);
    //             if (response.data.status) {
    //                 setAgentPercentage(response.data.data.percentage);
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     postData();
    // }, [baseUrl]);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "https://ipinfo.io/?token=ccc055af41b120"
                );
                setIpAddress(response.data.ip);
            } catch (error) {
                console.error("Error fetching location:", error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);
    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpTimer]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
            if (!allowedTypes.includes(file.type)) {
                notify("error", "Please upload only JPG, PNG or PDF files");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                notify("error", "File size should be less than 5MB");
                return;
            }
            setStudentIdFile(file);
            setFileName(file.name);
        }
    };

    const apiKey = "d2aeb7990a914d4596d1ca4e3d29975b";

    const getCoordinates = async (addressData) => {
        try {
            const fullAddress = `${addressData.house_no} ${addressData.address}, ${addressData.city}, ${addressData.state}, ${addressData.country}, ${addressData.zip_code}`;
            console.log(fullAddress);

            const encodedAddress = encodeURIComponent(fullAddress);

            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${apiKey}`
            );

            if (response.data.results && response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry;

                setLatitude(lat.toString());
                setLongitude(lng.toString());
                return true;
            } else {
                notify("Could not find coordinates for the given address", "error");
                return false;
            }
        } catch (error) {
            console.error("Error getting coordinates:", error);
            notify("Error getting location coordinates", "error");
            return false;
        }
    };

    const validateForm = () => {
        if (!formData.full_name.trim()) {
            notify("error", "Full name is required");
            return false;
        }

        if (isStudent && formData.role === "entrepreneur") {
            if (school_university.trim() === "") {
                notify("error", "School/University is required");
                return false;
            }
        } else {
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
                notify("error", "Please enter a valid email address");
                return false;
            }
        }

        if (!isEmailVerified) {
            notify("error", "Please verify your email before signing up");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {

        try {
            if (!validateForm()) {
                return;
            }
            if (!isEmailVerified) {
                notify("error", "Please verify your email before signing up");
                return;
            }
            if (!agreeToTerms) {
                notify("error", "Please Accept Our Terms And Condition");
                return;
            }

            setLoading(true);
            const submitData = new FormData();

            submitData.append("full_name", formData.full_name);
            submitData.append("email", formData.email);
            submitData.append("mobile", phone);
            submitData.append("role", formData.role);
            submitData.append("ip", ipAddress);

            if (formData.role === "entrepreneur") {
                if (isStudent && school_university.trim() != "") {
                    submitData.append("school_university", school_university);
                }
                submitData.append("is_student", isStudent);
            }

            const response = await axios.post(
                `${baseUrl}/waitlist`,
                submitData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.status) {
                setLoading(false);
                notify("success", response.data.message);
                navigate("/");
            } else {
                setLoading(false);
                notify("error", response.data.message || "Registration failed");
            }
        } catch (error) {
            setLoading(false);
            notify(
                "error",
                error.response?.data?.message || "An error occurred during registration"
            );
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    const handleVerifyClick = async () => {
        if (!formData.email) {
            notify("error", "Please enter your email address");
            return;
        }

        try {
            setSendingOtp(true);
            const response = await axios.post(`${baseUrl}/send-email-open-otp`, {
                email: formData.email,
            });

            if (response.data.status) {
                setOtpSent(true);
                setShowOTP(true);
                setOtpTimer(120); // 2 minutes timer
                notify("success", response.data.message);
            } else {
                notify("error", response.data.message);
            }
        } catch (err) {
            notify("error", err.response?.data?.message || "Failed to send OTP");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleOTPSubmit = async () => {
        if (!formData.otp) {
            notify("error", "Please enter the OTP");
            return;
        }

        try {
            setVerifyingOtp(true);
            const response = await axios.post(`${baseUrl}/verifyopenEmailOtpweb`, {
                email: formData.email,
                otp: formData.otp,
            });

            if (response.data.status) {
                setIsEmailVerified(true);
                notify("success", response.data.message);
                setFormData((prev) => ({ ...prev, otp: "" }));
                setShowOTP(false);
            } else {
                notify("error", response.data.message);
            }
        } catch (err) {
            notify("error", err.response?.data?.message || "Failed to verify OTP");
        } finally {
            setVerifyingOtp(false);
        }
    };
    const handleAgentPercentageChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAgentInputPercentage(value);

            if (value === "") {
                setAgentPercentageError("");
            } else if (parseFloat(value) > parseFloat(agentPercentage)) {
                setAgentPercentageError(
                    `Cannot exceed maximum allowed percentage of ${agentPercentage}%`
                );
            } else {
                setAgentPercentageError("");
            }
        }
    };

    return (
        <>
            {loading && <Loader />}
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl flex h-[85vh]">
                    <div className="hidden lg:block lg:w-1/2">
                        <img
                            src={Img3}
                            alt="Abstract Design"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="w-full lg:w-1/2 p-6 overflow-auto">
                        <div className="max-w-md mx-auto w-full">
                            <div className="flex justify-center mb-3">
                                <div className="">
                                    <img
                                        src={Logo}
                                        alt="logo"
                                        className="h-12 w-auto max-w-full"
                                    />
                                </div>

                            </div>

                            <div className="text-center mb-3">
                                <div className={`transform transition-all duration-700 ease-out p-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}>
                                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative group">
                                        {/* <span className="text-black">Hello ,</span>  {capitalizeFirstLetter(type)} */}
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-md">
                                    Join our exclusive waitlist to be among the first to experience our platform
                                </p>
                            </div>

                            <div className="space-y-2">
                                {type === "entrepreneur" && (
                                    <div className="mb-2">
                                        <p className="text-md mb-1">
                                            Are You Students Entrepreneur?
                                        </p>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                className="flex items-center gap-1.5"
                                                onClick={() => setIsStudent(false)}
                                            >
                                                {isStudent ? (
                                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Square className="w-4 h-4" />
                                                )}
                                                <span className="text-md">Yes</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="flex items-center gap-1.5"
                                                onClick={() => setIsStudent(true)}
                                            >
                                                {!isStudent ? (
                                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Square className="w-4 h-4" />
                                                )}
                                                <span className="text-md">No</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="col-span-2">
                                        <label className="block text-md mb-1">
                                            Full Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            placeholder="Enter Full Name"
                                            className="w-full px-2.5 py-2 text-md border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="col-span-2 w-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Email Address"
                                                    className={`w-full px-2.5 py-2 text-md border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEmailVerified
                                                        ? "bg-green-50 border-green-500"
                                                        : ""
                                                        }`}
                                                    disabled={isEmailVerified || sendingOtp}
                                                />
                                                {!isEmailVerified && (
                                                    <button
                                                        onClick={handleVerifyClick}
                                                        disabled={
                                                            sendingOtp || otpTimer > 0 || !formData.email
                                                        }
                                                        className={`w-full sm:w-auto whitespace-nowrap px-6 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${sendingOtp || otpTimer > 0
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-blue-500 hover:bg-blue-600"
                                                            }`}
                                                    >
                                                        {sendingOtp
                                                            ? "Sending..."
                                                            : otpTimer > 0
                                                                ? `Resend in ${formatTime(otpTimer)}`
                                                                : otpSent
                                                                    ? "Resend OTP"
                                                                    : "Send OTP"}
                                                    </button>
                                                )}
                                            </div>
                                            {isEmailVerified && (
                                                <p className="text-green-600 text-sm mt-1 flex items-center">
                                                    <CheckSquare className="w-4 h-4 mr-1" />
                                                    Email verified successfully
                                                </p>
                                            )}
                                        </div>

                                        {showOTP && !isEmailVerified && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Enter OTP<span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <input
                                                        type="text"
                                                        name="otp"
                                                        value={formData.otp}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter OTP"
                                                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                        disabled={verifyingOtp}
                                                    />
                                                    <button
                                                        onClick={handleOTPSubmit}
                                                        disabled={verifyingOtp || !formData.otp}
                                                        className={`w-full sm:w-auto whitespace-nowrap px-6 py-2.5 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${verifyingOtp || !formData.otp
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-green-500 hover:bg-green-600"
                                                            }`}
                                                    >
                                                        {verifyingOtp ? "Verifying..." : "Verify OTP"}
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Please check your email for the OTP
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="flex gap-3">
                                            <PhoneInput
                                                country={"us"}
                                                value={phone}
                                                countryCodeEditable={false}
                                                enableSearch={true}
                                                onChange={handlePhoneChange}
                                                placeholder="Enter Mobile Number"
                                                inputClass="input-mobile py-5 mt-1 block border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 focus:ring-gray-400 focus:ring-1"
                                            />
                                        </div>
                                    </div>


                                    <div className="col-span-2">
                                        <label className="block text-md mb-1">
                                            Role <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role || ""}
                                            onChange={(e) => {
                                                const newType = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    role: newType
                                                }));
                                                if (newType !== "entrepreneur") {
                                                    setIsStudent(false);
                                                }
                                            }}
                                            className="w-full px-2.5 py-2 text-md border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">Select role from list</option>
                                            <option value="entrepreneur">Entrepreneur</option>
                                            <option value="investor">Investor</option>
                                            <option value="agent">Agent</option>
                                        </select>
                                    </div>

                                    {formData.role === "entrepreneur" && (
                                        <label htmlFor="isStudent" className="text-md text-gray-700">
                                            Are you a student entrepreneur?
                                            <div className="flex gap-4 mt-2">
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-1.5"
                                                    onClick={() => setIsStudent(true)}
                                                >
                                                    {isStudent ? (
                                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-4 h-4" />
                                                    )}
                                                    <span className="text-md">Yes</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-1.5"
                                                    onClick={() => setIsStudent(false)}
                                                >
                                                    {!isStudent ? (
                                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-4 h-4" />
                                                    )}
                                                    <span className="text-md">No</span>
                                                </button>
                                            </div>
                                        </label>
                                    )}

                                    {isStudent && formData.role === "entrepreneur" ? (
                                        <>
                                            <div>
                                                <label className="block text-md mb-1">
                                                    School/University
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="school_university"
                                                    value={school_university}
                                                    onChange={(e) => {
                                                        setSchoolUniversity(e.target.value);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            school_university: e.target.value
                                                        }));
                                                    }}
                                                    placeholder="Enter your school/university name"
                                                    className="w-full px-2.5 py-2 text-md border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}

                                    <div className="col-span-2 my-3">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                                checked={agreeToTerms}
                                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                            />
                                            <span className="text-md">
                                                I have read and agree to the{" "}
                                                <Link to={`/terms-conditions`} target="_blank" className="text-blue-600">
                                                    Terms of Service
                                                </Link>
                                            </span>
                                            <span className="text-red-500">*</span>
                                        </label>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={handleSubmit}
                                            className="px-4 bg-[#4A3AFF] text-white py-3 text-md rounded-lg transition-colors"
                                        >
                                            Join Waiting List
                                        </button>
                                    </div>

                                    <p className="col-span-2 text-center text-md">
                                        Already have an account?{" "}
                                        <Link
                                            to="/login-as"
                                            className="text-blue-600 font-semibold"
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default WaitlistForm;
