import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Img6 from "/assets/Img6.jpeg";
import axios from "axios";
import { notify } from "../../Utiles/Notification";
import Loader from "../../Utiles/Loader";
import { UserState } from "../../context/UserContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../routes/firebaseConfig";
import { getMessaging, getToken } from "firebase/messaging";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Foooter";
import Logo from "../../Assets/Images/logo.png";

const LoginComponent = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const vapidKey = import.meta.env.VITE_APP_VAPID_KEY;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = UserState();
  const [showPassword, setShowPassword] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    if (forgotModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [forgotModalOpen]);

  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const messaging = getMessaging();
        const currentToken = await getToken(messaging, {
          vapidKey: vapidKey,
        });

        if (currentToken) {
          setFcmToken(currentToken);
          console.log("FCM Token obtained successfully");
        } else {
          console.log("No registration token available");
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };

    if (
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost"
    ) {
      getFCMToken();
    }
  }, [vapidKey]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const storeFCMToken = async (userId) => {
    if (!fcmToken) {
      console.log("No FCM token available to store");
      return;
    }

    try {
      const fcmRef = doc(db, "fcm_tokens", userId);
      await setDoc(
        fcmRef,
        {
          token: fcmToken,
          lastUpdated: new Date().toISOString(),
          platform: "web",
          isActive: true,
          userId: userId,
          email: email,
        },
        { merge: true }
      );

      console.log("FCM token stored successfully");
    } catch (error) {
      console.error("Error storing FCM token:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      notify("error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/login_customer`, {
        email,
        password,
        fcm_token: fcmToken,
        role: type,
      });
      if (response.data.status) {
        const { customer, role, token } = response.data;
        const userData = { customer, role, token };

        await storeFCMToken(customer.customer_unique_id);

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(response.data);
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handlers
  const openForgotPasswordModal = () => {
    setForgotModalOpen(true);
    setForgotPasswordStep(1);
    setForgotEmail("");
    setForgotPasswordOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const closeForgotPasswordModal = () => {
    setForgotModalOpen(false);
  };

  const handleSendOtp = async () => {
    if (!forgotEmail) {
      notify("error", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      notify("error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/sendForgetPasswordOtpemail`,
        {
          email: forgotEmail,
        }
      );

      if (response.data.status) {
        notify("success", "OTP sent to your email");
        setForgotPasswordStep(2);
      } else {
        notify("error", response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      notify("error", error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (
      !forgotPasswordOtp ||
      forgotPasswordOtp.length !== 4 ||
      !/^\d+$/.test(forgotPasswordOtp)
    ) {
      notify("error", "Please enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/verifyForgetPasswordemailOtp`,
        {
          email: forgotEmail,
          otp: forgotPasswordOtp,
        }
      );

      if (response.data.status) {
        notify("success", "OTP verified successfully");
        setForgotPasswordStep(3);
      } else {
        notify("error", response.data.message || "Invalid OTP");
      }
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      notify("error", "Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      notify("error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      notify("error", "Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/updatePassword`, {
        email: forgotEmail,
        password: newPassword,
        type: "customer",
      });

      if (response.data.status) {
        notify("success", "Password updated successfully");
        closeForgotPasswordModal();
        setEmail(forgotEmail);
      } else {
        notify("error", response.data.message || "Failed to update password");
      }
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message || "Password update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderForgotPasswordContent = () => {
    switch (forgotPasswordStep) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Forgot Password
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your email address to receive a verification code
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                className="w-full bg-[#4A3AFF] text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                onClick={handleSendOtp}
              >
                Send Verification Code
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Verify OTP
            </h2>
            <p className="text-gray-600 mb-6">
              Enter the 4-digit verification code sent to {forgotEmail}
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={forgotPasswordOtp}
                  onChange={(e) => setForgotPasswordOtp(e.target.value)}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  className="w-1/2 bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-gray-300"
                  onClick={() => setForgotPasswordStep(1)}
                >
                  Back
                </button>
                <button
                  className="w-1/2 bg-[#4A3AFF] text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                  onClick={handleVerifyOtp}
                >
                  Verify Code
                </button>
              </div>

              <p className="text-sm text-center">
                Didn't receive the code?{" "}
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  onClick={handleSendOtp}
                >
                  Resend
                </button>
              </p>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Reset Password
            </h2>
            <p className="text-gray-600 mb-6">
              Create a new password for your account
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Eye
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600"
                    onClick={toggleNewPasswordVisibility}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Eye
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600"
                    onClick={toggleConfirmPasswordVisibility}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="w-1/2 bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-gray-300"
                  onClick={() => setForgotPasswordStep(2)}
                >
                  Back
                </button>
                <button
                  className="w-1/2 bg-[#4A3AFF] text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                  onClick={handleUpdatePassword}
                >
                  Update Password
                </button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <div className="hidden md:block w-full md:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 z-10" />
            <img
              src={Img6}
              alt="Abstract Design"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12">
            <div className="mb-4 md:mb-10">
              <div className="flex items-center gap-3 mb-6 md:mb-8 group cursor-pointer">
                <img
                  src={Logo}
                  alt="logo"
                  className="h-8 md:h-10 w-auto max-w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-gray-800">
                Welcome Back
              </h1>
              <h1 className="text-2xl capitalize text-[#4A3AFF] md:text-3xl font-bold mb-2 md:mb-3">
                {type}
              </h1>
            </div>
            <p className="text-gray-600 mb-3">
              Please enter your details to Login
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    onClick={openForgotPasswordModal}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
                  />
                  <Eye
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                    onClick={togglePasswordVisibility}
                  />
                </div>
              </div>

              <button
                className="w-full bg-[#4A3AFF] text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                onClick={handleLogin}
              >
                Sign In
              </button>
            </div>

            {/* <p className="mt-6 md:mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/sign-up-as"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
              >
                Sign Up
              </Link>
            </p> */}
          </div>
        </div>
      </div>

      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={closeForgotPasswordModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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

            {renderForgotPasswordContent()}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default LoginComponent;
