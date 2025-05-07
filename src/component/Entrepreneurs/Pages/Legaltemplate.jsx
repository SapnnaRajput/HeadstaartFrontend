import React, { useState, useEffect } from 'react';
import { notify } from '../../../Utiles/Notification';
import { UserState } from '../../../context/UserContext';
import SelectDropdown from '../../../Utiles/SelectDropdown';
import Loader from '../../../Utiles/Loader';
import axios from 'axios';
import CustomButton from '../../../Utiles/CustomButton';
import DocumentCreator from './DocumentCreator';
import { useNavigate } from 'react-router-dom';

const Legaltemplate = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [signatures, setSignatures] = useState([]);
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const { user } = UserState();
    const [documentCreating, setDocumentCreating] = useState(false)
    const [questions, setQuestions] = useState([])
    const [content, setContent] = useState([]);


    const defaultOption = { value: "", label: "Select an option", isDisabled: true };
    useEffect(() => {
        getFilterCountries();
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            getSignatures(selectedCountry.country_id);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedCountry && selectedSignature) {
            getLegalDocumentTypes(selectedCountry.country_id, selectedSignature.value);
        }
    }, [selectedCountry, selectedSignature]);

    const getFilterCountries = async () => {
        try {
            const response = await axios.get(`${baseUrl}/getAllCountries`);
            if (response.data.status) {
                const formattedCountries = response.data.allCountries.map(country => ({
                    value: country.country_id,
                    label: country.country_name,
                    ...country,
                }));
                setCountries([defaultOption, ...formattedCountries]);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
            notify('error', 'Failed to fetch countries');
        } finally {
            setLoading(false);
        }
    };

    const getSignatures = async (countryId) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_signature`, {
                country_id: countryId
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.data.data) {
                const formattedSignatures = response.data.data.map(item => ({
                    value: item.signature,
                    label: `Signature ${item.signature}`
                }));
                setSignatures([defaultOption, ...formattedSignatures]);
                setSelectedSignature(null);
                setSelectedDocumentType(null);
                setTemplates([]);
            }
        } catch (error) {
            console.error('Error fetching signatures:', error);
            notify('error', 'Failed to fetch signatures');
        } finally {
            setLoading(false);
        }
    };

    const getLegalDocumentTypes = async (countryId, signature) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}/get_legal_document_type`,
                {
                    country_id: countryId,
                    signature: signature
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                }
            );

            if (response.data.status) {
                const formattedDocTypes = response.data.data.map(doc => ({
                    value: doc.category_id,
                    label: doc.category_name,
                    ...doc
                }));
                setDocumentTypes([defaultOption, ...formattedDocTypes]);
                setSelectedDocumentType(null);
                setTemplates([]); 
            }
        } catch (error) {
            console.error('Error fetching document types:', error);
            notify('error', 'Failed to fetch document types');
        } finally {
            setLoading(false);
        }
    };

    const getLegalTemplates = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}/get_legal_temp`,
                {
                    signature: selectedSignature.value,
                    country_id: selectedCountry.country_id,
                    category_id: selectedDocumentType.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                }
            );

            if (response.data.status) { 
                setTemplates(response.data.data);
                setSelectedTemplate(null)
            }
            if(response.data?.message=== "No Data Found"){
                notify('error', 'There Is No Template Found');
            }
        } catch (error) {
            console.error('Error fetching legal templates:', error);
            notify('error', 'Failed to fetch legal templates');
        } finally {
            setLoading(false);
        }
    };

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setTemplates([]);
    };

    const handleSignatureChange = (selectedOption) => {
        setSelectedSignature(selectedOption);
        setTemplates([]);
    };

    const handleDocumentTypeChange = (selectedOption) => {
        setSelectedDocumentType(selectedOption);
        setTemplates([]);
    };

    const isNextButtonDisabled = !selectedCountry || !selectedSignature || !selectedDocumentType || loading;

    const handleViewDetails = async (templateId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}/get_legal_temp_ques`,
                { legal_templates_id: templateId },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer',
                }
            );

            console.log('PDF Response:', response.data);

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            window.open(fileURL, '_blank');

        } catch (error) {
            console.error('Error fetching legal template details:', error);
            notify('error', 'Failed to fetch template details');
        } finally {
            setLoading(false);
        }
    };

    const createDocument = async (templateId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}/get_legal_data`,
                { legal_templates_id: templateId },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,

                    },
                }
            );
            if (response.data.status) {
                setQuestions(response.data.questions);
                setContent(response.data.content);
                if(response.data.questions.length > 0){
                  setDocumentCreating(true)
                }else{
                    notify('error','Failed to Create Documentation')
                }
            } else {

            }
        } catch (error) {
            console.error('Error Create Documentation', error);
            notify('error', 'Failed to Create Documentation');
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {loading && <Loader />}

            {!documentCreating && (<div className="container space-y-6 mx-auto">
                <div className="rounded-xl p-6 bg-white">
                    <h1 className="text-xl font-semibold mb-6 text-[#05004E]">Legal Template</h1>

                    <div className="mb-4 max-w-7xl items-center">
                        <label className="block text-base font-medium text-gray-700 mb-2">
                            Select Country
                        </label>
                        <SelectDropdown
                            value={selectedCountry}
                            onChange={handleCountryChange}
                            options={countries}
                            placeholder="Select a country"
                            isSearchable={true}
                            isClearable={true}
                            isDisabled={loading}
                            isLoading={loading}
                        />
                    </div>

                    <div className="mb-4 max-w-7xl">
                        <label className="block text-base font-medium text-gray-700 mb-2">
                            Select Signature
                        </label>
                        <SelectDropdown
                            value={selectedSignature}
                            onChange={handleSignatureChange}
                            options={signatures}
                            placeholder="Select a signature"
                            isSearchable={true}
                            isClearable={true}
                            isDisabled={loading || !selectedCountry}
                            isLoading={loading}
                        />
                    </div>

                    <div className="mb-4 max-w-7xl">
                        <label className="block text-base font-medium text-gray-700 mb-2">
                            Select Document Type
                        </label>
                        <SelectDropdown
                            value={selectedDocumentType}
                            onChange={handleDocumentTypeChange}
                            options={documentTypes}
                            placeholder="Select document type"
                            isSearchable={true}
                            isClearable={true}
                            isDisabled={loading || !selectedSignature}
                            isLoading={loading}
                        />
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={getLegalTemplates}
                            disabled={isNextButtonDisabled}
                            className="px-5 py-2.5 text-base font-medium text-white bg-[#4A3AFF] rounded-lg hover:bg-[#3D32CC] shadow-sm transition-all duration-200 disabled:bg-gray-400"
                        >
                            Search Template
                        </button>
                    </div>
                </div>

                {templates.length > 0 && (
                    <div className="rounded-xl p-6 bg-white">
                        <h2 className="text-lg font-semibold mb-4 text-[#05004E]">Available Templates</h2>
                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                            {templates.map((template, index) => (
                                <div
                                    key={template.legal_templates_id}
                                    className="group relative p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 ease-in-out bg-white hover:border-[#4A3AFF]/20 flex flex-col justify-between h-full hover:-translate-y-1"
                                >
                                    <div className="absolute top-4 right-4">
                                        <div className="relative">
                                            <input
                                                type="radio"
                                                id={`template-${index}`}
                                                name="selectedTemplate"
                                                value={template.legal_templates_id}
                                                onChange={() => setSelectedTemplate(template)}
                                                className="h-6 w-6 rounded-full border-2 border-gray-300 checked:border-[#4A3AFF] checked:border-6 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-[#4A3AFF]/30"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-gray-900 capitalize pr-8 group-hover:text-[#4A3AFF] transition-colors duration-200">
                                            {template.document_name}
                                        </h3>
                                        <p className="text-gray-600 capitalize flex-1 overflow-y-auto max-h-32 leading-relaxed">
                                            {template.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6">
                                        <div className="flex items-center space-x-1">
                                            <span className="text-[#4A3AFF] font-bold text-xl">$</span>
                                            <span className="text-[#4A3AFF] font-bold text-2xl">{template.price}</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewDetails(template.legal_templates_id)}
                                            className="relative px-4 py-2 text-sm font-medium rounded-lg overflow-hidden group/btn"
                                        >
                                            <span className="relative z-10 flex items-center gap-2 text-[#4A3AFF] group-hover/btn:text-white transition-colors duration-200">
                                                View Details
                                                <svg
                                                    className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </span>
                                            <div className="absolute inset-0 bg-[#4A3AFF] scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-200 origin-left rounded-lg" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedTemplate && (
                            <div className="mt-6">
                                <CustomButton
                                    label={"Create Document"}
                                    onClick={() => createDocument(selectedTemplate.legal_templates_id)}
                                />
                            </div>
                        )}
                    </div>
                )}

            </div>)}

            {documentCreating && (
                <>
                    {documentCreating && (
                        <DocumentCreator
                            questions={questions}
                            content={content}
                            onBack={() => setDocumentCreating(false)}
                            selectedTemplate={selectedTemplate}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default Legaltemplate;