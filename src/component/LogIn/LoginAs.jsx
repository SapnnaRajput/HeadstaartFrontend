import { useState } from "react"
import SignInImg from "/assets/signInImg.jpg"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../Home/Navbar"
import Footer from "../Home/Foooter"
import Logo from '../../Assets/Images/logo.png'

function SignIn() {
    const [selectedOption, setSelectedOption] = useState("entrepreneur")
    const navigate = useNavigate()

    const handleOptionClick = (option) => {
        setSelectedOption(option)
    }

    const handleNextButtonClick = () => {
        navigate(`/login?type=${selectedOption}`)
    }

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
                <div className="flex shadow-2xl rounded-3xl overflow-hidden bg-white w-full max-w-4xl">
                    <div className="hidden md:block w-1/2 relative overflow-hidden">
                        <img
                            src={SignInImg || "/placeholder.svg"}
                            className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500"
                            alt="Sign-in background"
                        />
                    </div>

                    <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
                        <div className="w-full max-w-md">
                            <div className="flex items-center mb-8">
                                <img
                                    src={Logo}
                                    alt="logo"
                                    className="h-12 w-auto max-w-full"
                                />
                            </div>

                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Login As</h2>
                            <p className="text-gray-600 mb-8">Choose your role to get Login</p>

                            <div className="space-y-4">
                                {["entrepreneur", "investor", "agent"].map((option) => (
                                    <button
                                        key={option}
                                        className={`w-full p-4 rounded-xl flex justify-between items-center transition-all duration-300 ${selectedOption === option
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <span className="text-lg font-medium capitalize">{option}</span>
                                        <span
                                            className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${selectedOption === option ? "bg-white border-white" : "bg-white border-gray-300"
                                                }`}
                                        >
                                            {selectedOption === option && (
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNextButtonClick}
                                className="w-full py-3 mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Next
                            </button>

                            <p className="text-center text-gray-600 mt-6">
                                Don't have an account?{' '}
                                <Link to="/sign-up-as" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    )
}

export default SignIn

