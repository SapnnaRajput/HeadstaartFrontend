import React, { useEffect, useState } from 'react'
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';
import Pagination from '../../../Utiles/Pagination';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FiDownload } from "react-icons/fi";
import Filter from '../../../Utiles/Filter';

const Transactions = () => {

    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [loading, setLoading] = useState(false);
    const tabs = ['verification', 'subscription', 'leads', 'legal document', 'Promote projects']
    const [active, setActive] = useState(tabs[0])
    const [verify, setVerify] = useState([])
    const [subs, setSubs] = useState([])
    const [lead, setLead] = useState([])
    const [legal, setLegal] = useState([])
    const [boost, setBoost] = useState([])

    const { user } = UserState();
    const [to, setTo] = useState();
    const [from, setFrom] = useState();

    const dateFormate2 = (startDate) => {
        const start = new Date(startDate);

        const formatDate = (date) => {
            const day = date.getDate();
            const month = ("0" + (date.getMonth() + 1)).slice(-2); // Short month name
            const year = date.getFullYear();
            return `${month}-${day}`;
        };

        return `${start.getFullYear()}-${formatDate(start)}`;
    }

    const getAll = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_all_transaction`, {
                min_date: from ? dateFormate2(from) : null,
                max_date: to ? dateFormate2(to) : null,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response?.data?.status) {
                setVerify(response.data.verifyDetails);
                setSubs(response.data.subsDetails);
                setLead(response.data.leadDetails);
                setLegal(response.data.legalDetails);
                setBoost(response.data.boostDetails);
            } else {
                setVerify([]);
                setSubs([]);
                setLead([]);
                setLegal([]);
                setBoost([]);
            }
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        getAll()
    }, [from ,to])


    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-[#E7F7EF] text-[#00B627]';
            case 'decliend':
                return 'bg-[#FFF0E6] text-[#FE964A]';
            case 'pending':
                return 'bg-yellow-100 text-yellow-500';
            default:
                return 'text-gray-300';
        }
    };

    const dateFormate = (startDate) => {
        const start = new Date(startDate);

        const formatDate = (date) => {
            const day = date.getDate();
            const month = date.toLocaleString("en-US", { month: "short" }); // Short month name
            return `${month} ${day}`;
        };

        return `${formatDate(start)}, ${start.getFullYear()}`;
    }

    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * 10;
    const indexOfFirstItem = indexOfLastItem - 10;
    const data = active == 'Promote projects' ? boost : active == 'legal document' ? legal : active == 'leads' ? lead : active == 'subscription' ? subs : active == 'verification' && verify

    const currentSeries = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / 10);

    const downloadData = async (id, type) => {

        let url;
        let payload;

        if (type == 'blue') {
            url = 'genrate_invoice_blue_tick_admin'
            payload = {
                blue_tick_verification_id: id
            }
        }
        if (type == 'subs') {
            url = 'genrate_invoice_subs_admin'
            payload = {
                customer_subscription_id: id
            }
        }if (type == 'leads') {
            url = 'genrate_invoice_lead_admin'
            payload = {
                lead_payment_id: id
            }
        }if (type == 'legal') {
            url = 'genrate_invoice_legal_admin'
            payload = {
                legal_payment_id: id
            }
        }if (type == 'boost') {
            url = 'genrate_invoice_boost_admin'
            payload = {
                boosted_project_id: id
            }
        }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/${url}`, {
                ...payload
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url2 = window.URL.createObjectURL(blob);

            window.open(url2, '_blank');
            URL.revokeObjectURL(url2);
        } catch (error) {
            notify("error", error.message);
        }
        setLoading(false);
    }

    return (
        <>
            {loading && <Loader />}
            <h1 className="container mx-auto my-3 font-semibold text-2xl">
                Transactions
            </h1>
            <div className="container mx-auto py-4">
                <div className="p-5 bg-white rounded-xl">
                    <div className="overflow-x-auto flex py-2 w-full border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActive(tab)}
                                className={`pb-4 px-6 text-lg whitespace-nowrap capitalize border-b-2 flex-shrink-0 transition-all duration-200 font-medium relative ${active === tab
                                    ? "text-blue-600  border-blue-600"
                                    : "text-gray-500 hover:text-gray-800 border-transparent"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="pt-4">
                        <Filter to={to} setTo={setTo} from={from} setFrom={setFrom} date={true} />
                    </div>
                    <div className="overflow-x-auto text-nowrap mt-5">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        User
                                    </th>
                                    {active == 'verification' &&
                                        <>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Verify Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Date
                                            </th>
                                        </>
                                    }
                                    {active == 'subscription' &&
                                        <>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Previous Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Total Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Tax
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Service Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Payable Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Date
                                            </th>
                                        </>
                                    }
                                    {active == 'leads' &&
                                        <>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Payment ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Payment Method
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Leads
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Date
                                            </th>
                                        </>
                                    }
                                    {active == 'legal document' &&
                                        <>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Document Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Payment ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Payment Method
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Payable Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Service Fee
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Tax
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Date
                                            </th>
                                        </>
                                    }
                                    {active == 'Promote projects' &&
                                        <>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Project Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Payment ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Payment Method
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Date
                                            </th>
                                        </>
                                    }
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentSeries.length > 0 ?
                                    currentSeries.map((list, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-4 pe-40 font-semibold text-base text-black">
                                                <Link to={`/${user?.role}/user-manager/${list.customer_unique_id}`} className="flex flex-row gap-5 w-fit group">
                                                    {list.customer_profile_image ?
                                                        <img src={list.customer_profile_image} alt="" className='h-12 w-12 aspect-square rounded-lg' />
                                                        :
                                                        <h1 className="h-12 w-12 text-base  flex justify-center place-items-center  aspect-square rounded-lg bg-gray-300">{list.customer_name.charAt()}</h1>
                                                    }
                                                    <div className="flex flex-col">
                                                        <h1 className="text-sm group-hover:scale-105 transition-all duration-300 ease-out">{list.customer_name}</h1>
                                                        <span className="text-xs text-neutral-500">{list.customer_email}</span>
                                                    </div>
                                                </Link>
                                            </td>
                                            {active == 'verification' &&
                                                <>
                                                    <td className="px-4 py-4 font-semibold "><span className={`line-clamp-1 text-nowrap text-xs uppercase rounded-lg px-1 py-1 text-center ${getStatusClass(list.verify_status)}`}>{list.verify_status}</span></td>
                                                    <td className="p-4 text-sm">{dateFormate(list.inserted_date)}</td>
                                                    <td className="p-4 text-sm ">
                                                        <div className="flex flex-row gap-5 place-items-center">
                                                            {list.customer_role != 'investor' &&
                                                                <Link to={`/superadmin/blue-tick/user?all=${list.blue_tick_verification_id}`}><Eye /></Link>
                                                            }
                                                            {list.customer_role == 'investor' &&
                                                                <Link to={`/superadmin/blue-tick/user?investor=${list.investor_fund_verification_id}`}><Eye /></Link>
                                                            }
                                                            <button className='text-xl' onClick={() => downloadData(list.blue_tick_verification_id, 'blue')}><FiDownload /></button>
                                                        </div>
                                                    </td>
                                                </>
                                            }
                                            {active == 'subscription' &&
                                                <>
                                                    <td className="p-4 text-sm">${list.previous_amount}</td>
                                                    <td className="p-4 text-sm">${list.total_amount}</td>
                                                    <td className="p-4 text-sm">${list.government_tax}</td>
                                                    <td className="p-4 text-sm">${list.service_amount}</td>
                                                    <td className="p-4 text-sm">${list.payable_amount}</td>
                                                    <td className="p-4 text-sm">{dateFormate(list.inserted_date)}</td>
                                                    <td className="p-4 text-xl">
                                                        <button className='text-xl' onClick={() => downloadData(list.customer_subscription_id, 'subs')}><FiDownload /></button>
                                                    </td>
                                                </>
                                            }
                                            {active == 'leads' &&
                                                <>
                                                    <td className="p-4 text-sm">{list.payment_id}</td>
                                                    <td className="p-4 text-sm">{list.payment_method}</td>
                                                    <td className="p-4 text-sm">${list.price}</td>
                                                    <td className="p-4 text-sm">{list.lead}</td>
                                                    <td className="p-4 text-sm">{dateFormate(list.inserted_date)}</td>
                                                    <td className="p-4 text-xl">
                                                        <button className='text-xl' onClick={() => downloadData(list.lead_payment_id, 'leads')}><FiDownload /></button>
                                                    </td>
                                                </>
                                            }
                                            {active == 'legal document' &&
                                                <>
                                                    <td className="p-4 text-sm">{list.legal_template_details?.document_name}</td>
                                                    <td className="p-4 text-sm">{list.payment_id}</td>
                                                    <td className="p-4 text-sm">{list.payment_method}</td>
                                                    <td className="p-4 text-sm">${list.amount}</td>
                                                    <td className="p-4 text-sm">${list.payable_amount}</td>
                                                    <td className="p-4 text-sm">${list.template_service_fee}</td>
                                                    <td className="p-4 text-sm">${list.template_tax}</td>
                                                    <td className="p-4 text-sm">{dateFormate(list.inserted_date)}</td>
                                                    <td className="p-4 text-xl">
                                                        <button className='text-xl' onClick={() => downloadData(list.legal_payment_id, 'legal')}><FiDownload /></button>
                                                    </td>
                                                </>
                                            }
                                            {active == 'Promote projects' &&
                                                <>
                                                    <td className="p-4 text-sm transition-all duration-300 ease-out hover:scale-105"><Link to={`/superadmin/content-moderation/${list.projectDetail?.project_unique_id}`}>{list.projectDetail?.title.substring(0, 20)}....</Link></td>
                                                    <td className="p-4 text-sm">{list.payment_id}</td>
                                                    <td className="p-4 text-sm">{list.payment_method}</td>
                                                    <td className="p-4 text-sm">${list.price}</td>
                                                    <td className="p-4 text-sm">{dateFormate(list.inserted_date)}</td>
                                                    <td className="p-4 text-xl">
                                                        <button className='text-xl' onClick={() => downloadData(list.boosted_project_id, 'boost')}><FiDownload /></button>
                                                    </td>
                                                </>
                                            }
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            Transaction not Available
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {data?.length > 10 &&
                        <div className="mt-5 p-5">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Transactions