import React, { useEffect, useState } from 'react';
import Heading from '../../../Utiles/Heading';
import SelectDropdown from '../../../Utiles/SelectDropdown';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import CustomButton from '../../../Utiles/CustomButton';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';
import { useNavigate } from 'react-router-dom';
import TemplateEditor from './TemplateEditor';

const Addtemplate = () => {
    const navigate = useNavigate();
    const { user } = UserState();
    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    const [loading, setLoading] = useState(false);
    const [des, setDes] = useState(false);

    const [formData, setFormData] = useState({
        document_name: '',
        description: '',
        price: ''
    });

    const [selectedType, setSelectedType] = useState(null);
    const [options, setOptions] = useState([]);
    const [Industry, setIndustry] = useState(null);
    const [Industries, setIndustries] = useState([]);
    const [sign, setSign] = useState();
    const [leagalTemplates, setLeagalTemplates] = useState()

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handletypeChange = (selectedOption) => {
        setSelectedType(selectedOption);
        if (errors.signature) {
            setErrors(prev => ({
                ...prev,
                signature: ''
            }));
        }
    };

    const handleIndustryChange = (selectedOption) => {
        setIndustry(selectedOption);
        if (errors.category_id) {
            setErrors(prev => ({
                ...prev,
                category_id: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.document_name.trim()) {
            newErrors.document_name = 'Document name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!Industry) {
            newErrors.category_id = 'Industry is required';
        }

        if (!selectedType) {
            newErrors.signature = 'Number of signatures is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            notify('error', 'Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const requestData = {
                document_name: formData.document_name,
                description: formData.description,
                signature: selectedType?.value,
                category_id: Industry?.value,
                price: formData.price
            };

            const response = await axios.post(
                `${baseUrl}/add_legal_template`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (response?.data?.status) {
                notify('success', response.data.message);
                setFormData({
                    document_name: '',
                    description: '',
                    price: ''
                });
                setSelectedType(null);
                setIndustry(null);
                setSign(response.data.sign)
                setLeagalTemplates(response.data.legal_templates)
                setDes(true);
            } else {
                notify('error', response?.data?.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            notify(
                'error',
                error.response?.data?.message || 'Unauthorized access, please login again'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSignatures = async () => {
            try {
                const response = await axios.get(`${baseUrl}/get_sign`);
                if (response.data.status) {
                    const data = response.data.data.map(list => ({
                        label: list.sign,
                        value: list.sign
                    }));
                    setOptions(data);
                }
            } catch (error) {
                console.error('Error fetching signatures:', error);
                notify('error', 'Failed to fetch signature options');
            }
        };
        fetchSignatures();
    }, [baseUrl]);

    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const response = await axios.get(`${baseUrl}/get_category`);
                if (response.data.status) {
                    const data = response.data.category.map(list => ({
                        label: list.category_name,
                        value: list.category_id
                    }));
                    setIndustries(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                notify('error', 'Failed to fetch industry options');
            }
        };
        fetchIndustries();
    }, [baseUrl]);

    return (
        <>
            {loading && <Loader />}
            <div className="relative">
                {!des && (
                    <div className="relative bg-white max-w-md rounded-2xl shadow-xl p-8 space-y-6 backdrop-blur-sm bg-opacity-90">
                        <div className="relative mb-10">
                            <h1 className="text-2xl font-bold text-gray-900">Add New Template</h1>
                        </div>
                        <div className="space-y-2 max-w-md">
                            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                                Document Name<span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="document_name"
                                    value={formData.document_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter document name"
                                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.document_name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out`}
                                />
                                {errors.document_name && (
                                    <p className="absolute -bottom-5 left-0 text-red-500 text-xs">{errors.document_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 max-w-md">
                            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                                Industry<span className="text-red-500 ml-1">*</span>
                            </label>
                            <div>
                                <SelectDropdown
                                    value={Industry}
                                    onChange={handleIndustryChange}
                                    options={Industries}
                                    placeholder="Select Industry"
                                    isSearchable={true}
                                    isClearable={true}
                                />
                                {errors.category_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 max-w-md">
                            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                                Number of Signatures<span className="text-red-500 ml-1">*</span>
                            </label>
                            <div>
                                <SelectDropdown
                                    value={selectedType}
                                    onChange={handletypeChange}
                                    options={options}
                                    placeholder="Select Number"
                                    isSearchable={true}
                                    isClearable={true}
                                />
                                {errors.signature && (
                                    <p className="text-red-500 text-xs mt-1">{errors.signature}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 max-w-md">
                            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                                Price<span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className={`w-full pl-8 pr-4 py-3 bg-gray-50 border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out`}
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 max-w-md">
                            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                                Description<span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Enter description"
                                className={`w-full px-4 py-3 bg-gray-50 border ${errors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out resize-none`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div className="flex justify-start gap-4 pt-4">
                            <CustomButton
                                onClick={() => navigate(-1)}
                                label="Cancel"
                                cancel={true}
                            />
                            <CustomButton
                                onClick={handleSubmit}
                                label="Next"
                                cancel={false}
                            />
                        </div>
                    </div>
                )}
            </div>

            {des && (
                <TemplateEditor
                    headerContent={sign.header}
                    footerContent={sign.footer}
                    templateData={leagalTemplates}
                    onSaveSuccess={() => {
                        setDes(false);
                        navigate('/legalteam/template/add-template');
                    }}
                />
            )}
        </>
    );
};

export default Addtemplate;