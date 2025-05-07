import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { notify } from '../../../Utiles/Notification';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { UserState } from '../../../context/UserContext';

const TemplateEditor = ({ headerContent, footerContent, templateData, onSaveSuccess }) => {
    const [editorContent, setEditorContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user } = UserState();
    const baseUrl = import.meta.env.VITE_APP_BASEURL;

    const handleSave = async (saveType) => {
        if (!editorContent.trim()) {
            notify('error', 'Please add some content to the template');
            return;
        }

        setLoading(true);
        try {
            const requestData = {
                ...templateData,
                content: editorContent,
                type: saveType
            };

            const response = await axios.post(
                `${baseUrl}/save_template`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (response?.data?.status) {
                notify('success', 'Template saved successfully');
                onSaveSuccess?.();
            } else {
                notify('error', response?.data?.message || 'Failed to save template');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            notify('error', 'Failed to save template');
        } finally {
            setLoading(false);
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Add New Template</h2>
                
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-[#4A3AFF] text-white rounded-md hover:bg-[#3D32CC]  disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={loading}
                    >
                        Save
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                            <button
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                onClick={() => handleSave('save')}
                            >
                                Save
                            </button>
                            <button
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                onClick={() => handleSave('download')}
                            >
                                Save & Download
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div 
                    className="p-4 bg-gray-50 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: headerContent }}
                />

                <div className="border rounded-lg">
                    <ReactQuill 
                        theme="snow"
                        value={editorContent}
                        onChange={setEditorContent}
                        className="min-h-[300px]"
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ indent: '-1' }, { indent: '+1' }],
                                ['link'],
                                ['clean']
                            ]
                        }}
                    />
                </div>

                <div 
                    className="p-4 bg-gray-50 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: footerContent }}
                />
            </div>
        </div>
    );
};

export default TemplateEditor;