import React, { useEffect, useState } from 'react'
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';
import Pagination from '../../../Utiles/Pagination';
import CustomButton from '../../../Utiles/CustomButton';

const Headstartservices = () => {
    const { user } = UserState();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const tabs = ['entrepreneur', 'agent', 'investor']
    const [active, setActive] = useState(tabs[0])
    const [openModal, setOpenModal] = useState(false)

    const getCustdata = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/get_headstart_service_admin`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                const sortedData = response.data.headstart_services
                    .sort((a, b) => {
                        if (a.type === 'about') return -1;
                        if (b.type === 'about') return 1;
                        return 0;
                    });

                setData(sortedData);
            }
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        getCustdata();
    }, [])

    const [currentPage, setCurrentPage] = useState(1);

    const filteredProducts = data.filter((product) => product.role == active)

    const indexOfLastItem = currentPage * 10;
    const indexOfFirstItem = indexOfLastItem - 10;
    const currentSeries = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredProducts.length / 10);

    const [single, setSingle] = useState(null)

    const openModalData = (list) => {
        setSingle(list)
        setOpenModal(true)
    }

    const updateData = async () => {
        if (!single?.title) {
            notify("error", 'Please Enter Title');
            return
        }
        if (!single?.sub_title) {
            notify("error", 'Please Enter Sub Title');
            return
        }
        if (!single?.status) {
            notify("error", 'Please Select Status');
            return
        }
        if (!single?.role) {
            notify("error", 'Please Select User Type');
            return
        }
        if (!single?.paragraph) {
            notify("error", 'Please Enter Paragraph');
            return
        }
        if (!single?.description) {
            notify("error", 'Please Enter Description');
            return
        }

        let url;

        if (single?.headstaart_service_id) {
            url = 'update_headstart_service'
        } else {
            url = 'add_headstart_service'
        }

        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/${url}`, {
                ...single
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                notify("success", response.data.message);
                setOpenModal(false)
                setSingle(null)
                getCustdata();
            }
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false);
    }

    const deleteData = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/delete_headstart_service`, {
                headstaart_service_id: id
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                notify("success", response.data.message);
                setOpenModal(false)
                setSingle(null)
                getCustdata();
            }
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false);
    }

    return (
        <>
            {loading && <Loader />}
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="overflow-x-auto flex py-1 w-full border-b border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActive(tab)}
                                className={`py-4 px-8 text-base whitespace-nowrap capitalize border-b-2 flex-shrink-0 transition-all duration-200 font-medium relative ${
                                    active === tab
                                        ? "text-indigo-600 border-indigo-600"
                                        : "text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-200"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Headstaart Services</h1>
                    <CustomButton 
                        onClick={() => {
                            setSingle(null); 
                            setOpenModal(true);
                        }} 
                        label='Add Service'
                    />
                </div>
                
                {currentSeries.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {currentSeries.map((list, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
                                <div className="flex justify-between items-center mb-4 border-b pb-4">
                                    <div>
                                        <h2 className='text-xl font-semibold text-gray-800'>
                                            {list.type == 'check' ? 'Headstaart Services' : 'About Headstart'}
                                        </h2>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${
                                            list.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {list.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openModalData(list)}
                                            className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                                        >
                                            Edit
                                        </button>
                                        {list.type == 'check' && (
                                            <button 
                                                onClick={() => deleteData(list.headstaart_service_id)}
                                                className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 mb-1">Title</span>
                                        <h3 className='font-medium text-gray-700'>{list.title}</h3>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 mb-1">Sub Title</span>
                                        <h3 className='font-medium text-gray-700'>{list.sub_title}</h3>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 mb-1">User Type</span>
                                        <h3 className='font-medium text-gray-700 capitalize'>{list.role}</h3>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 mb-1">Paragraph</span>
                                        <p className='text-gray-700 bg-gray-50 p-3 rounded-lg'>{list.paragraph}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 mb-1">Description</span>
                                        <p className='text-gray-700 bg-gray-50 p-3 rounded-lg'>{list.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center bg-white p-10 rounded-xl shadow-sm">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <h2 className="text-xl font-medium text-gray-700 mb-1">No Data Available</h2>
                            <p className="text-gray-500">No headstaart services found for this user type</p>
                        </div>
                    </div>
                )}
                
                {filteredProducts.length > 10 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
            {openModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">{single?.headstaart_service_id ? 'Edit Service' : 'Add New Service'}</h2>
                                <button 
                                    onClick={() => setOpenModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input 
                                            type="text" 
                                            className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                            onChange={(e) => setSingle({ ...single, title: e.target.value })} 
                                            value={single?.title || ''} 
                                            name='title' 
                                            placeholder='Enter Title' 
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">Sub Title</label>
                                        <input 
                                            type="text" 
                                            className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                            onChange={(e) => setSingle({ ...single, sub_title: e.target.value })} 
                                            value={single?.sub_title || ''} 
                                            name='sub_title' 
                                            placeholder='Enter Sub Title' 
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">User Type</label>
                                        <select
                                            value={single?.role || ''}
                                            onChange={(e) => setSingle({ ...single, role: e.target.value })}
                                            className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm capitalize"
                                        >
                                            <option className='capitalize' value="">Select user type</option>
                                            <option value="agent">Agent</option>
                                            <option value="investor">Investor</option>
                                            <option value="entrepreneur">Entrepreneur</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={single?.status || ''}
                                            onChange={(e) => setSingle({ ...single, status: e.target.value })}
                                            className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm capitalize"
                                        >
                                            <option className='capitalize' value="">Select status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Paragraph</label>
                                    <textarea 
                                        rows={4} 
                                        className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                        value={single?.paragraph || ''} 
                                        onChange={(e) => setSingle({ ...single, paragraph: e.target.value })} 
                                        name='paragraph' 
                                        placeholder='Enter Paragraph'
                                    ></textarea>
                                </div>
                                
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea 
                                        rows={4} 
                                        className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                        value={single?.description || ''} 
                                        onChange={(e) => setSingle({ ...single, description: e.target.value })} 
                                        name='description' 
                                        placeholder='Enter Description'
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="flex justify-center gap-4 mt-8">
                                <button 
                                    className='px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium'
                                    onClick={() => setOpenModal(false)}
                                >
                                    Cancel
                                </button>
                                <CustomButton  
                                    onClick={updateData} 
                                    label={single?.headstaart_service_id ? 'Update' : 'Add'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Headstartservices