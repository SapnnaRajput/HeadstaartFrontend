import React, { useEffect, useState } from 'react'
import profile from '../../../Assets/Images/agent-1.png'
import { BadgeCheck, Box, Download, Pencil, Plus, Users, AlertTriangle, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomButton from '../../../Utiles/CustomButton';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import Loader from '../../../Utiles/Loader';
import LocationSelector from '../../../Utiles/LocationSelector'
import Cardsdesign from '../../../Utiles/Cardsdesign';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import ReactCreditCards from 'react-credit-cards-2';
import SelectDropdown from '../../../Utiles/SelectDropdown';
import { notify } from '../../../Utiles/Notification';
import { Carousel, Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../../Investors/VarifyInvestor';
import { loadStripe } from '@stripe/stripe-js';
import useStripeCredentials from '../../../Utiles/StripePublicKey'
import BillingAndInvoice from './BillingAndInvoice';
import ProfileBoost from './ProfileBoost';

const Settings = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const navigate = useNavigate();
    const { user, logout, setUser } = UserState();
    const [loading, setLoading] = useState(true);
    const tabs = ['Edit Profile', 'Billing & Invoices', 'Boost Profile']
    const [data, setData] = useState({});
    const [active, setActive] = useState(tabs[0])
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [card, setCard] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [cardEdit, setCardEdit] = useState(false);
    const [refrash, setRefrash] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [addressDetail, setAddressDetail] = useState({});
    const [profile, setProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [plans, setPlans] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenInvestor, setIsModalOpenInvestor] = useState(false);
    const { publicKey, loading: stripeLoading, error: stripeError } = useStripeCredentials();
    const [stripeInstance, setStripeInstance] = useState(null);
    const [formData, setFormData] = useState({
        idNumber: '',
        frontImage: null,
        backImage: null,
        ein: '',
        address: '',
        license: null,
        resume: null,
        website: '',
        experience: '',
        plan: ''
    });
    const [previews, setPreviews] = useState({
        frontImage: '',
        backImage: ''
    });

    const [errors, setErrors] = useState({
        idNumber: '',
        frontImage: '',
        backImage: '',
        ein: '',
        address: ''
    });
    const card_types = [
        {
            label: 'debit',
        },
        {
            label: 'cradit',
        },
    ]

    useEffect(() => {
        const initializeStripe = async () => {
            if (publicKey) {
                try {
                    const stripe = await loadStripe(publicKey);
                    setStripeInstance(stripe);
                } catch (error) {
                    console.error('Error initializing Stripe:', error);
                    notify('error', 'Failed to initialize payment system');
                }
            }
        };

        initializeStripe();
    }, [publicKey]);
    const RequiredLabel = ({ text }) => (
        <div className="block text-base text-black mb-2">
            {text}
        </div>
    );

    useEffect(() => {
        if (addressDetail?.country) {
            setSelectedCountry({
                label: addressDetail.country.country_name,
                value: addressDetail.country.country_id
            });

            if (addressDetail?.state) {
                setSelectedState({
                    label: addressDetail.state.state_subdivision_name,
                    value: addressDetail.state.state_subdivision_id
                });

                if (addressDetail?.city) {
                    setSelectedCity({
                        label: addressDetail.city.name_of_city,
                        value: addressDetail.city.cities_id
                    });
                }
            }
        }
    }, [addressDetail]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sessionId = params.getAll('session_id').pop();

        const updatePaymentStatus = async () => {
            try {
                const endpoint =
                    user?.role === 'agent'
                        ? `${baseUrl}/agent_blue_tick_checkout_success`
                        : `${baseUrl}/entrepreneur_blue_tick_checkout_success`;

                const response = await axios.post(
                    endpoint,
                    {
                        payment_id: sessionId,
                        status: true
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.status) {
                    setFormData({
                        idNumber: '',
                        frontImage: null,
                        backImage: null,
                        ein: '',
                        address: '',
                        plan: '',
                        payment_method: 'card'
                    });

                    setPreviews({
                        frontImage: null,
                        backImage: null
                    });
                    navigate(`/${user.role}/settings`);
                    window.location.reload();
                    notify('success', 'Payment completed successfully');
                } else {
                    notify('error', response.data.message || 'Failed to verify payment');
                    navigate(`/${user.role}/settings`);
                }
            } catch (error) {
                console.error('Error updating payment status:', error);
                notify('error', error.response?.data?.message || 'Error updating payment status');
                navigate(`/${user.role}/settings`);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            updatePaymentStatus();
        } else {
            setLoading(false);
            navigate(`/${user.role}/settings`);
        }
    }, []);



    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseUrl}/customer_data`,
                    { customer_unique_id: user?.customer?.customer_unique_id },
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
                if (response.data.status) {
                    setData(response.data.customer_data)
                    setAddressDetail(response.data.customer_data?.address_detail)
                    setCard(response.data.customer_data?.customer_card.length > 0 ? response.data.customer_data?.customer_card : null)
                }
            } catch (error) {
                notify('error', 'Unauthorized access please login again');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user, refrash]);

    const [formdata, setFormdata] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        zip_code: '',
        deal_per: '',
        about_me: ''
    });

    useEffect(() => {
        setFormdata({
            name: data.full_name || '',
            email: data.email || '',
            mobile: data.mobile || '',
            address: data?.address_detail?.address || '',
            zip_code: data?.address_detail?.zip_code || '',
            country: data?.address_detail?.country?.country_id || '',
            state: data?.address_detail?.state?.state_subdivision_id || '',
            city: data?.address_detail?.city?.cities_id || '',
            deal_per: data?.deal_per || '',
            about_me: data?.about_me || '',
        });
        setProfile(data.customer_profile_image)
    }, [data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormdata(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.match('image/(jpeg|png)')) {
            notify('error', 'Please select only PNG or JPEG images');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setProfile(imageUrl);
        setProfileImage(file);
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            formData.append('customer_unique_id', user?.customer?.customer_unique_id);
            formData.append('full_name', formdata.name);
            formData.append('address', formdata.address);
            formData.append('zip_code', formdata.zip_code);
            formData.append('country', selectedCountry.value);
            formData.append('state', selectedState.value);
            formData.append('city', selectedCity.value);
            formData.append('deal_per', formdata?.deal_per);
            formData.append('about_me', formdata?.about_me);
            if (profile) {
                formData.append('customer_profile_image', profileImage);
            }

            const response = await axios.post(`${baseUrl}/edit_customer_profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            if (response.data.status) {
                const updatedUser = {
                    ...user,
                    customer: {
                        ...user.customer,
                        customer_profile_image: response.data.data.customer_profile_image || user.customer.customer_profile_image,
                        customer_unique_id: response.data.data.customer_unique_id,
                        email: response.data.data.email,
                        full_name: response.data.data.full_name,
                        lead_count: response.data.data.lead_count,
                        mobile: response.data.data.mobile,
                        school_university: response.data.data.school_university,
                        student_id_file: response.data.data.student_id_file,
                        student_identity: response.data.data.student_identity
                    }
                };

                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                notify('success', 'Profile updated successfully');
                setIsEditing(false);
                setRefrash(prev => prev + 1);
            }
        } catch (error) {
            notify('error', error.response?.data?.message || 'Profile update failed');
        } finally {
            setLoading(false);
        }
    };


    const transactions = [
        {
            img: Box,
            name: 'Shopping product',
            date: '05 August',
            time: '10:00AM ',
            money: '54',
            type: 'debit',
        },
        {
            img: Box,
            name: 'Shopping product',
            date: '05 August',
            time: '10:00AM ',
            money: '54',
            type: 'credit',
        },
        {
            img: Box,
            name: 'Shopping product',
            date: '05 August',
            time: '10:00AM ',
            money: '54',
            type: 'debit',
        },
        {
            img: Box,
            name: 'Shopping product',
            date: '05 August',
            time: '10:00AM ',
            money: '54',
            type: 'credit',
        },
        {
            img: Box,
            name: 'Shopping product',
            date: '05 August',
            time: '10:00AM ',
            money: '54',
            type: 'debit',
        },
    ]

    const [cardData, setCardData] = useState({

        cvc: '',
        expiry: '',
        focus: '',
        name: '',
        number: '',
    });

    const handleInputFocus = (e) => {
        setCardData({ ...cardData, focus: e.target.name });
    };

    const handletypeChange = (selectedOption) => {
        setSelectedType(selectedOption);
    };

    const addCard = async () => {

        if (!cardData.name) {
            notify('danger', 'Pleate Enter Your Name');
            return;
        }
        if (!cardData.number) {
            notify('danger', 'Pleate Enter Your Name');
            return;
        }
        if (cardData.number.length > 16) {
            notify('danger', 'Pleate Enter Valid Card Number');
            return;
        }
        if (!cardData.expiry) {
            notify('danger', 'Pleate Enter Exipry Date');
            return;
        }
        if (!cardData.cvc) {
            notify('danger', 'Pleate Enter CVC Number');
            return;
        }
        setLoading(true);

        let payload;
        if (cardEdit) {
            payload = {
                customers_card_details_unique_id: cardData.customers_card_details_unique_id,
                customer_unique_id: user?.customer?.customer_unique_id,
                card_name: selectedType.label,
                card_number: cardData.number,
                expiry_date: cardData.expiry,
                cardholder_name: cardData.name,
            }
        } else {
            payload = {
                customer_unique_id: user?.customer?.customer_unique_id,
                card_name: selectedType.label,
                card_number: cardData.number,
                expiry_date: `${cardData.expiry.substring(0, 2)}/${cardData.expiry.substring(2, 4)}`,
                cardholder_name: cardData.name,
            }
        }
        try {
            const response = await axios.post(`${baseUrl}/customer_add_card_details`, {
                ...payload
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                setRefrash(prev => prev + 1)
                setOpenModal(false)
                notify('success', `${response.data.message}`);
            }

        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }

    const close = () => {
        setOpenModal(false)
        setCardEdit(false)
        setCardData({
            cvc: '',
            expiry: '',
            focus: '',
            name: '',
            number: '',
        })
    }

    const editCard = (id) => {
        setCardEdit(true)
        const data = card.find(list => list.customers_card_details_unique_id === id);
        setCardData(prev => ({
            ...prev,
            customers_card_details_unique_id: data.customers_card_details_unique_id,
            expiry: data.expiry_date,
            name: data.cardholder_name,
            number: data.card_number
        }))
        const matchingType = card_types.find(type => type.label === data.card_name);
        if (matchingType) {
            setSelectedType(matchingType);
        }
        setOpenModal(true)
    }

    const handleVerify = async () => {

        if (user.role == 'investor') {
            setIsModalOpenInvestor(true)
            return
        }

        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/get_blue_tick_data`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            if (response.data.status) {
                setPlans(response.data.blue_tick);
                if (response.data.blue_tick.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        plan: response.data.blue_tick[0].amount
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
            notify('error', error.response?.data?.message || 'Error fetching leads');
        } finally {
            setLoading(false);
            setIsOpen(true);
        }

    };

    const validateField = (name, value) => {
        switch (name) {
            case 'idNumber':
                return !value ? 'ID Number is required' : '';
            case 'ein':
                return !value ? 'EIN is required' : '';
            case 'address':
                return !value ? 'Address is required' : '';
            case 'website':
                return user.role === 'agent' && !value ? 'Website is required' : '';
            case 'experience':
                return user.role === 'agent' && !value ? 'Experience is required' : '';
            case 'license':
                return user.role === 'agent' && !value ? 'License is required' : '';
            case 'resume':
                return user.role === 'agent' && !value ? 'Resume is required' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            if (!files[0]) return;

            if (files[0].size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'File size should be less than 5MB'
                }));
                return;
            }

            if (name === 'resume') {
                if (!files[0].type.match('application/pdf')) {
                    setErrors(prev => ({
                        ...prev,
                        [name]: 'Please select only PDF files'
                    }));
                    return;
                }
            } else {
                if (!files[0].type.match('image/(jpeg|png|jpg)')) {
                    setErrors(prev => ({
                        ...prev,
                        [name]: 'Please select only PNG, JPEG or JPG images'
                    }));
                    return;
                }
            }

            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));

            if (name !== 'resume') {
                setPreviews(prev => ({
                    ...prev,
                    [name]: URL.createObjectURL(files[0])
                }));
            }

            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));

            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const newErrors = {
                idNumber: validateField('idNumber', formData.idNumber),
                ein: validateField('ein', formData.ein),
                address: validateField('address', formData.address),
                frontImage: !formData.frontImage ? 'Front image is required' : '',
                backImage: !formData.backImage ? 'Back image is required' : '',
                plan: !formData.plan ? 'Please select a plan' : ''
            };
            if (user.role === 'agent') {
                newErrors.license = validateField('license', formData.license);
                newErrors.resume = validateField('resume', formData.resume);
                newErrors.website = validateField('website', formData.website);
                newErrors.experience = validateField('experience', formData.experience);
            }


            setErrors(newErrors);

            if (Object.values(newErrors).some(error => error)) {
                notify('error', 'Please fill all required fields correctly');
                return;
            }

            if (!formData.frontImage) {
                notify('error', 'Please Upload ID Front Side Photo');
                return;
            }

            if (!formData.frontImage) {
                notify('error', 'Please Upload ID Back Side Photo');
                return;
            }

            const selectedPlan = plans.find(plan => plan.amount === formData.plan);

            const data = new FormData();
            data.append('customer_unique_id', user?.customer?.customer_unique_id);
            data.append('id_number', formData.idNumber);
            data.append('id_front_image', formData.frontImage);
            data.append('id_back_image', formData.backImage);
            data.append('ein', formData.ein);
            data.append('address', formData.address);
            data.append('duration', selectedPlan.duration);
            data.append('payment_method', "card");
            data.append('amount', selectedPlan.amount);
            data.append('success_url', (`${window.location.href}`).trim());
            data.append('cancel_url', (`${window.location.origin}/${user.role}/verification/cancel`).trim());
            if (user.role === 'agent') {
                data.append('license', formData.license);
                data.append('resume', formData.resume);
                data.append('website', formData.website);
                data.append('experience', formData.experience);
            }

            const endpoint = user.role === 'agent'
                ? 'agent_blue_tick_checkout'
                : 'entrepreneur_blue_tick_checkout';

            const response = await axios.post(`${baseUrl}/${endpoint}`, data, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status) {
                const { error } = await stripeInstance.redirectToCheckout({
                    sessionId: response.data.id
                });

                if (error) {
                    notify('error', error.message);
                }
            }

            if (response.data.status) {


                notify('success', 'Profile verification submitted successfully');

                setIsOpen(false);
                setFormData({
                    idNumber: '',
                    frontImage: null,
                    backImage: null,
                    ein: '',
                    address: '',
                    plan: '',
                    payment_method: 'card'
                });
                setPreviews({
                    frontImage: null,
                    backImage: null
                });
            }
            else {
                notify('error', response.data.message || 'Failed to submit verification');
            }
        } catch (error) {
            console.error('Error submitting verification:', error);
            notify('error', error.response?.data?.message || 'Error submitting verification');
        } finally {
            setLoading(false);
        }
    };
    const deleteProfile = () => { setIsModalOpen(true) }
    const closeModal = () => setIsModalOpen(false);

    const sendDeleteRequest = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/delete_account `, {
                customer_unique_id: user?.customer?.customer_unique_id,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                notify('success', response.data.message)
                setIsModalOpen(false);
            } else {
                notify('error', response.data.message);
            }
        } catch (error) {
            notify('error', 'Unauthorized access please login again');
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <div className="rounded-xl container mx-auto md:p-6 p-3 bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className='text-xl font-semibold text-[#05004E]'>Settings</h1>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-all duration-300">
                                <Users className="w-5 h-5 text-blue-600 animate-pulse" />
                                <div>
                                    <p className="text-sm font-bold  text-gray-600">Leads</p>
                                    <p className="text-lg font-semibold text-blue-600 flex justify-center">
                                        <span className="inline-block animate-[bounce_1.5s_infinite]">{data.lead_count}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <span className="flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row place-items-center justify-between">
                    <div className="flex flex-row place-items-center gap-5">
                        {tabs.map((list, index) => (
                            <button onClick={() => setActive(list)} key={index} className={`font-medium transition-all duration-300 ease-out text-md px-2 py-3 ${active === list ? 'text-[#4A3AFF] border-b border-[#4A3AFF]' : 'text-[#718EBF] border-b border-transparent'}`}>{list}</button>
                        ))}
                    </div>
                    {active === tabs[0] && (
                        <>
                            {data.verify_status === 'Pending' ? (
                                <div className="flex items-center gap-2 rounded-full px-4 py-2 text-base text-yellow-600">
                                    <Clock className="font-bold w-8 h-8 animate-pulse" />
                                    <span className="font-bold text-lg">Pending</span>
                                </div>
                            ) : data.verify_status === 'Approved' ? (
                                <div className="flex items-center gap-2 rounded-full px-4 py-2 text-base text-green-600">
                                    <BadgeCheck className="font-bold w-8 h-8 animate-pulse text-green-600" />
                                    <span className="font-bold text-lg">Verified</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleVerify}
                                    className="flex items-center gap-2 rounded-full px-4 py-2 text-base border border-[#4A3AFF] text-[#4A3AFF] hover:bg-[#4A3AFF]/5 transition-all duration-300"
                                >
                                    <BadgeCheck className="font-semibold w-6 h-6 animate-bounce" />
                                    <span className="font-semibold">Verify Now</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
                {active === tabs[0] &&
                    <>
                        <div className="flex md:flex-row flex-col mt-10 gap-5">
                            <div className="md:w-1/5 w-full flex justify-center place-items-start">
                                <div className="relative w-fit">
                                    {profile ? (
                                        <img src={profile} alt="Profile" className="h-36 w-36 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-36 w-36 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User size={48} className="text-gray-500" />
                                        </div>
                                    )}
                                    {isEditing &&
                                        <label className="absolute rounded-full h-8 w-8 bg-[#4A3AFF] text-white flex justify-center place-items-center right-0 bottom-4 cursor-pointer hover:bg-[#3929ff] transition-colors">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/png, image/jpeg"
                                                onChange={handleImageChange}
                                            />
                                            <Pencil size={18} />
                                        </label>
                                    }
                                </div>
                            </div>
                            <div className="md:w-2/5 w-full">
                                <RequiredLabel text={'Your Name'} />
                                <input
                                    type="text"
                                    value={formdata.name}
                                    name='name'
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    placeholder="Type Here..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <RequiredLabel text='Email' />
                                <input
                                    type="text"
                                    value={formdata.email}
                                    name='email'
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    placeholder="Type Here..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <RequiredLabel text='Mobile' />
                                <input
                                    type="text"
                                    value={formdata.mobile}
                                    name='mobile'
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    placeholder="Type Here..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <RequiredLabel text='Address' />
                                <input
                                    type="text"
                                    value={formdata.address}
                                    name='address'
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    placeholder="Type Here..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {user.role === 'agent' &&
                                    <>
                                        <RequiredLabel text='Deal Percentage' />
                                        <input
                                            type="text"
                                            value={formdata?.deal_per}
                                            name='deal_per'
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            placeholder="Type Here..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </>
                                }
                            </div>
                            <div className="md:w-2/5 w-full">
                                <RequiredLabel text='Zip Code' />
                                <input
                                    type="text"
                                    value={formdata.zip_code}
                                    name='zip_code'
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    placeholder="Type Here..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 mb-5 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <LocationSelector
                                    data={addressDetail}
                                    selectedCountry={selectedCountry}
                                    selectedState={selectedState}
                                    selectedCity={selectedCity}
                                    onCountryChange={setSelectedCountry}
                                    onStateChange={setSelectedState}
                                    onCityChange={setSelectedCity}
                                    className="col-span-2 grid grid-cols-1"
                                    labelClass="block text-base text-black mb-2"
                                    inputClass=" border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-5"
                                />
                                {user.role === 'agent' &&
                                    <>
                                        <RequiredLabel text='About Me' />
                                        <textarea
                                            type="text"
                                            value={formdata?.about_me}
                                            name='about_me'
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            placeholder="Type Here..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </>}
                            </div>

                        </div>
                        {!isEditing ? (
                            <div className='text-end mt-5'>
                                <CustomButton
                                    label="Edit Profile"
                                    onClick={() => setIsEditing(true)}
                                />
                                <button
                                    onClick={deleteProfile}
                                    className="bg-red-700 text-white py-2 mx-3 px-4 rounded-lg text-base font-medium  hover:bg-red-800 transition-colors duration-200"
                                >
                                    Delete Account
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3 justify-end">
                                <CustomButton
                                    label="Cancel"
                                    cancel={true}
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormdata({
                                            name: data.full_name || '',
                                            email: data.email || '',
                                            mobile: data.mobile || '',
                                            address: data?.address_detail?.address || '',
                                            zip_code: data?.address_detail?.zip_code || '',
                                        });

                                    }}
                                />
                                <CustomButton
                                    label="Save"
                                    onClick={handleSaveProfile}
                                />
                            </div>
                        )}
                    </>
                }
                {active === tabs[1] &&
                    <>
                        <BillingAndInvoice />
                    </>
                }
                {active === tabs[2] &&
                    <>
                        <ProfileBoost />
                    </>
                }
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Body>
                    <div className="flex flex-row place-items-center justify-between">
                        <h1 className='text-2xl font-semibold text-center'>{cardEdit ? 'Edit Card' : 'Add More Card'}</h1>
                        <div className="text-2xl rotate-45 cursor-pointer text-[#7d7d7e]" onClick={close}>
                            <Plus />
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full mt-5">
                        <ReactCreditCards
                            cvc={cardData.cvc}
                            expiry={cardData.expiry}
                            focused={cardData.focus}
                            name={cardData.name}
                            number={cardData.number}
                        />
                        <div className="mt-4">
                            <input
                                type="text"
                                value={cardData.number}
                                name="number"
                                placeholder="Card Number"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                            <input
                                type="text"
                                value={cardData.name}
                                name="name"
                                placeholder="Cardholder Name"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                            <input
                                type="text"
                                value={cardData.expiry}
                                name="expiry"
                                placeholder="MM/YY"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                            <input
                                type="text"
                                value={cardData.cvc}
                                name="cvc"
                                placeholder="CVC"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded mb-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                            <SelectDropdown
                                value={selectedType}
                                onChange={handletypeChange}
                                options={card_types}
                                placeholder="Select Card Type"
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='flex justify-start'>
                    <CustomButton label="Save" onClick={addCard} />
                    <CustomButton label="Cancel" onClick={close} cancel={true} />
                </Modal.Footer>
            </Modal>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                    <div className="relative bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
                        <div className="bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Verify Your Profile</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4 max-h-[calc(100vh-350px)] overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Enter Your ID No <span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="idNumber"
                                        value={formData.idNumber}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${errors.idNumber ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                                    />
                                    {errors.idNumber && <p className="mt-1 text-sm text-red-500">{errors.idNumber}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Upload ID Front Side Photo<span className='text-red-500'>*</span></label>
                                    <div className="mt-1 flex flex-col w-full">
                                        <label className={`w-full flex flex-col items-center px-4 py-4 bg-white rounded-lg border ${errors.frontImage ? 'border-red-500' : 'border-gray-300'} cursor-pointer hover:bg-gray-50`}>
                                            {previews.frontImage ? (
                                                <div className="flex flex-col items-center">
                                                    <img src={previews.frontImage} alt="Front Preview" className="w-20 h-20 object-cover mb-2" />
                                                    <span className="text-sm text-gray-500">{formData.frontImage?.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Upload Here</span>
                                            )}
                                            <input
                                                type="file"
                                                name="frontImage"
                                                onChange={handleChange}
                                                accept="image/png,image/jpeg,image/jpg"
                                                className="hidden"
                                            />
                                        </label>
                                        {errors.frontImage && <p className="mt-1 text-sm text-red-500">{errors.frontImage}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Upload ID Back Side Photo <span className='text-red-500'>*</span></label>
                                    <div className="mt-1 flex flex-col items-center justify-center w-full">
                                        <label className={`w-full flex flex-col items-center px-4 py-4 bg-white rounded-lg border ${errors.backImage ? 'border-red-500' : 'border-gray-300'} cursor-pointer hover:bg-gray-50`}>
                                            {previews.backImage ? (
                                                <div className="flex flex-col items-center">
                                                    <img src={previews.backImage} alt="Back Preview" className="w-20 h-20 object-cover mb-2" />
                                                    <span className="text-sm text-gray-500">{formData.backImage?.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Upload Here</span>
                                            )}
                                            <input
                                                type="file"
                                                name="backImage"
                                                onChange={handleChange}
                                                accept="image/png,image/jpeg,image/jpg"
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {errors.backImage && <p className="mt-1 text-sm text-red-500">{errors.frontImage}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">EIN / GST Certificate
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ein"
                                        value={formData.ein}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${errors.ein ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                                    />
                                    {errors.ein && <p className="mt-1 text-sm text-red-500">{errors.ein}</p>}

                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address (Similar to Uploaded ID) <span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${errors.address ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                                </div>


                                {user.role == 'agent' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">License <span className='text-red-500'>*</span></label>
                                            <div className="mt-1 flex flex-col items-center justify-center w-full">
                                                <label className="w-full flex flex-col items-center px-4 py-4 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
                                                    <span className="text-sm text-gray-500">
                                                        {formData.license ? formData.license.name : 'Upload License'}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        name="license"
                                                        onChange={handleChange}
                                                        accept=".pdf,.jpeg,.png,.jpg,.gif"
                                                        className="hidden"
                                                    />
                                                </label>
                                                {errors.license && <p className="mt-1 text-sm text-red-500">{errors.license}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Resume <span className='text-red-500'>*</span></label>
                                            <div className="mt-1 flex flex-col items-center justify-center w-full">
                                                <label className="w-full flex flex-col items-center px-4 py-4 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
                                                    <span className="text-sm text-gray-500">
                                                        {formData.resume ? formData.resume.name : 'Upload Resume'}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        name="resume"
                                                        onChange={handleChange}
                                                        accept=".pdf"
                                                        className="hidden"
                                                    />
                                                </label>
                                                {errors.resume && <p className="mt-1 text-sm text-red-500">{errors.resume}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Website <span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-md border ${errors.website ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                                            />
                                            {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Experience (in years) <span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full rounded-md border ${errors.experience ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                                            />
                                            {errors.experience && <p className="mt-1 text-sm text-red-500">{errors.experience}</p>}
                                        </div>
                                    </>
                                )}
                                <div className="space-y-2">
                                    {plans.map((plan) => (
                                        <label key={plan.blue_tick_id} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="plan"
                                                value={plan.amount}
                                                checked={formData.plan === plan.amount}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <span>
                                                $ {plan.amount} / {plan.duration} days
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-[#4A3AFF] text-white rounded-md py-2 px-4 hover:bg-[#3929CC]"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <div className="flex flex-col items-center text-center">
                            <div className="text-red-600 mb-4">
                                <AlertTriangle size={48} />
                            </div>

                            <h2 className="text-lg font-semibold mb-2">
                                Are you sure?
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Do you want to send a request to delete your account?
                            </p>

                            {/* Buttons */}
                            <div className="flex justify-between gap-4 w-full">
                                <button
                                    onClick={sendDeleteRequest}
                                    className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors duration-200 w-full"
                                >
                                    Send Request
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200 w-full"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {loading && <Loader />}
            <VerificationModal
                isOpen={isModalOpenInvestor}
                onClose={() => setIsModalOpenInvestor(false)}
            />
        </>
    )
}

export default Settings