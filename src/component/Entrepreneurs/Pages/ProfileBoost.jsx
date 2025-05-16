import React, { useState, useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';
import { notify } from '../../../Utiles/Notification';

const BoostCard = ({ id, title, price, duration, features, user, currentPlan }) => {

    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    const handleBoostClick = async () => {
        try {
            const response = await axios.post(`${baseUrl}/profile-boosts`, {
                subscription_id: id,
                customer_unique_id: user?.customer.customer_id,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

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
            {currentPlan.plan_id === id ? (
                <button
                    disabled
                    className="mt-8 w-full bg-gray-400 text-gray-100 py-2 px-4 rounded-lg cursor-not-allowed opacity-75"
                >
                    Current Plan
                </button>
            ) : currentPlan.plan_id && id < currentPlan.plan_id ? (
                <button onClick={handleBoostClick} className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Downgrade Plan
                </button>
            ) : (
                <button onClick={handleBoostClick} className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Boost Now
                </button>
            )}
        </div>
    );
};

const ProfileBoost = () => {
    const [boostPlans, setBoostPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPlan, setCurrentPlan] = useState('');
    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    const { user, logout, setUser } = UserState();

    useEffect(() => {
        const fetchBoostPlans = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseUrl}/profile-boost-plans/user/${user?.role}`);

                if (response.data.success) {
                    const processedPlans = response.data.plans.map(plan => ({
                        id: plan.id,
                        title: plan.title,
                        price: parseFloat(plan.price),
                        duration: plan.duration_days === 7 ? 'week' :
                            plan.duration_days === 14 ? '2 weeks' :
                                plan.duration_days === 30 ? 'month' :
                                    `${plan.duration_days} days`,
                        features: JSON.parse(plan.features)
                    }));

                    setBoostPlans(processedPlans);
                }
            } catch (err) {
                console.error('Error fetching boost plans:', err);
                setError('Failed to load boost plans. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const getCurrentPlan = async () => {
            try {
                const response = await axios.get(`${baseUrl}/profile-boosts/${user?.customer.customer_id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.status) {
                    const currentPlan = response.data.data;
                    setCurrentPlan(currentPlan);
                }
            } catch (err) {
                console.error('Error fetching current plan:', err);
            }
        }

        getCurrentPlan();

        fetchBoostPlans();
    }, []);



    if (loading) return <div className="text-center py-8">Loading plans...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {user?.role === 'agent' ? 'Boost Your Agent Profile' : 'Boost Your Entrepreneur Profile'}
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    {user?.role === 'agent' 
                        ? 'Increase your visibility to entrepreneurs and startups. Choose the boost plan that best fits your expertise and get connected with promising ventures.'
                        : 'Increase your visibility to investors and partners. Choose the boost plan that best fits your goals and get discovered by the right people.'
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {boostPlans.map((plan, index) => (
                    <BoostCard key={index} {...plan} currentPlan={currentPlan} user={user} />
                ))}
            </div>

            <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Why Boost Your Profile?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Increased Visibility</h3>
                        <p className="text-gray-600">
                            {user?.role === 'agent' 
                                ? 'Get more exposure to entrepreneurs seeking expert guidance and support.'
                                : 'Get more exposure to active investors and potential partners in your industry.'
                            }
                        </p>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Better Engagement</h3>
                        <p className="text-gray-600">
                            {user?.role === 'agent'
                                ? 'Receive more consultation requests and connect with innovative startups.'
                                : 'Receive more profile views, connection requests, and business opportunities.'
                            }
                        </p>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Professional Growth</h3>
                        <p className="text-gray-600">
                            {user?.role === 'agent'
                                ? 'Expand your portfolio and establish yourself as a leading industry expert.'
                                : 'Build your network and establish your presence in the entrepreneurial community.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileBoost;