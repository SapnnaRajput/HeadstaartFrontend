import React from 'react';
import { FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';
import { notify } from '../../../Utiles/Notification';

const BoostCard = ({ id, title, price, duration, features }) => {

    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    const { user, logout, setUser } = UserState();

    const handleBoostClick = async () => {
        try {
            const response = await axios.post(`${baseUrl}/profile-boosts`, {
                subscription_id: id,
                customer_unique_id: user?.customer.customer_unique_id,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            console.log(user);

            if (response.data.status) {
                notify('success', 'Profile boost purchased successfully');
            } else {
                notify('error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            notify('error', error.response?.data?.message || 'Failed to purchase boost');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">${price}</span>
                <span className="ml-2 text-gray-500">/{duration}</span>
            </div>
            <ul className="mt-6 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                    </li>
                ))}
            </ul>
            <button onClick={handleBoostClick} className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Boost Now
            </button>
        </div>
    );
};

const ProfileBoost = () => {
    const boostPlans = [
        {
            id: 1,
            title: "7-Day Spotlight",
            price: 29,
            duration: "week",
            features: [
                "Featured in Entrepreneur Directory",
                "Priority in search results",
                "Highlighted profile badge",
                "Enhanced visibility to investors",
                "Daily profile analytics"
            ]
        },
        {
            id: 2,
            title: "30-Day Growth",
            price: 79,
            duration: "month",
            features: [
                "All Spotlight features",
                "Featured in weekly newsletter",
                "Social media promotion",
                "2x visibility boost",
                "Detailed engagement metrics",
                "Premium profile badge"
            ]
        },
        {
            id: 3,
            title: "90-Day Premium",
            price: 199,
            duration: "3 months",
            features: [
                "All Growth features",
                "Featured success story",
                "3x visibility boost",
                "Direct investor introductions",
                "Personalized profile optimization",
                "Priority support",
                "Extended analytics history"
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Boost Your Entrepreneur Profile
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Increase your visibility to investors and partners. Choose the boost plan that best fits your goals and get discovered by the right people.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {boostPlans.map((plan, index) => (
                    <BoostCard key={index} {...plan} />
                ))}
            </div>

            <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Why Boost Your Profile?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Increased Visibility</h3>
                        <p className="text-gray-600">Get more exposure to active investors and potential partners in your industry.</p>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Better Engagement</h3>
                        <p className="text-gray-600">Receive more profile views, connection requests, and business opportunities.</p>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Professional Growth</h3>
                        <p className="text-gray-600">Build your network and establish your presence in the entrepreneurial community.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileBoost;