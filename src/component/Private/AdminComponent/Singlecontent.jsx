import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import { BadgeCheck, ChevronDown, ChevronUp, Eye, Heart, MessageSquare, MessagesSquare, Users } from 'lucide-react';
import ChatMessages from '../../../Utiles/GetChat';
import CustomButton from '../../../Utiles/CustomButton'
import { Modal } from 'flowbite-react';
import LocationSelector from '../../../Utiles/LocationSelector';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';
import GroupChatMessages from '../../../Utiles/GetGroupChat';

const Singlecontent = () => {

    const { id } = useParams();
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [loading, setLoading] = useState(false);
    const { user } = UserState();
    const [data, setData] = useState({})
    const [chtas, setChats] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedChat, setSelectedChat] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [role, setRole] = useState(null)
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false)
    const [cId, setCid] = useState(null)
    const [msg, setMsg] = useState(null)
    const [equity, setEquity] = useState(null)
    const [funding, setFunding] = useState(null)
    const [deal, setDeal] = useState(null)
    const navigate = useNavigate()
    const [selectedGroupChat, setSelectedGroupChat] = useState(null);
    const[userID, setUserId] = useState(null);


    const fetchSingleProject = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_single_project_admin`,
                {
                    project_unique_id: id
                }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                setData(response.data.projectDetail)
                setUserId(response.data.customer_unique_id)
                setChats(response.data.projectChat)
                setGroups(response.data.projectGroupChat)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSingleProject()
    }, [])


    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    const getFileIcon = (extension) => {
        switch (extension) {
            case 'pdf':
                return (
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-red-600 text-xs font-bold">PDF</span>
                    </div>
                );
            case 'mp4':
                return (
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-500 text-xs font-bold">MP4</span>
                    </div>
                );
            case 'jpg':
                return (
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <span className="text-orange-500 text-xs font-bold">JPG</span>
                    </div>
                );
            case 'jpeg':
                return (
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <span className="text-orange-500 text-xs font-bold">JPEG</span>
                    </div>
                );
            case 'png':
                return (
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <span className="text-orange-500 text-xs font-bold">PNG</span>
                    </div>
                );
            case 'xls':
            case 'xlsx':
                return (
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">XLS</span>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                );
        }
    };

    const documentFiles = data?.projectMedia ?? [];
    const getFileName = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const [expandedSections, setExpandedSections] = useState({
        myDocuments: false,
        sharedDocuments: false,
        activeChats: false,
        groupChats: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleChatClick = (chat) => {
        setSelectedChat(chat);
    };

    const closeChatModal = () => {
        setSelectedChat(null);
    setSelectedGroupChat(null);
    };

    const handleFileOpen = (url) => {
        window.open(url, '_blank');
    };

    const handleGroupChatClick = (groupChat) => {
        setSelectedGroupChat(groupChat);
      };

      useEffect(() => {
        setUsers([])
        if (role && country && state && city) {  
            const filter = async () => {
                setLoading(true);
                try {
                    const response = await axios.post(`${baseUrl}/admin_filter_user`,
                        {
                            role: role?.value ?? null,
                            country: country?.value ?? null,
                            state: state?.value ?? null,
                            city: city?.value ?? null,
                        }, {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    });
                    if (response.data.status) {
                        setUsers(response.data.customers);
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
                setLoading(false);
            };
            filter();
        }
    }, [role, country, state, city]);


    const openReply = async (custID) => {
        setCid(custID)
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/admin_customer_detail`,
                {
                    customer_unique_id: custID,
                    project_unique_id: id,
                }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.isChat) {
                navigate(`/superadmin/headstart-team?team=${response.data.headstaart_chat_initiate_id}`)
            } else {
                setOpen(true)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
        setLoading(false);
    }

    const sendMsg = async () => {

        if (role?.value != 'entrepreneur') {
            if (!deal) {
                notify('error', 'Please Enter Deal');
                return
            }
        } else {
            if (!funding) {
                notify('error', 'Please Enter Funding Ammount');
                return
            }
            if (!equity) {
                notify('error', 'Please Enter Equity');
                return
            }
        }
        if (!msg) {
            notify('error', 'Please Enter Message');
            return
        }

        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/headstaart_chat_initiate`,
                {
                    customer_unique_id: cId,
                    project_unique_id: id,
                    message: msg,
                    fund_amount: funding,
                    equity: equity,
                    deal_per: deal
                }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                navigate(`/superadmin/headstart-team`)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
        setLoading(false);
    }

 
    


    return (
      <>
        {loading && <Loader />}
        <div className="p-5">
          <div className="bg-white rounded-xl p-5">
            <div className="flex flex-row place-items-center justify-between ">
              <h1 className="text-3xl font-semibold capitalize">
                {data?.title}
              </h1>
              <CustomButton
                label="Start Chat"
                onClick={() => setOpenModal(true)}
              />
            </div>
            <div className="flex flex-row mt-5 gap-5">
              <div className="w-3/5 relative">
                {data?.projectMedia?.find(
                  (media) => media.media_type === 'photo'
                ) && (
                  <>
                    <img
                      src={
                        data?.projectMedia.find(
                          (media) => media.media_type === 'photo'
                        ).media_link
                      }
                      alt=""
                      className="w-full h-80 object-fill rounded-xl"
                    />
                    {/* <button onClick={() => handleSaveProject(data?.project_unique_id)} className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors">
                                    <Heart
                                        className={`w-5 h-5 ${data?.isSaved ? 'fill-red-500 text-red-500' : 'text-gray-800'}`}
                                    />
                                </button> */}
                  </>
                )}
                <p className="text-base font-normal mt-4 text-gray-600">
                  {data?.description}
                </p>
              </div>
              <div className="w-2/5 ">
                {data?.pitch_deck_file && (
                  <div className="bg-white rounded-lg border w-full border-gray-100 p-4  mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-1 rounded">
                        <span className="text-xs font-medium text-red-500">
                          PDF
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pitch Deck.pdf</p>
                        <p className="text-xs text-gray-500">313 KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileOpen(data.pitch_deck_file)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      View
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-lg border border-gray-100 p-6 mb-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Innovative CleanTech Solutions
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Industry:</span>{' '}
                        {data?.category?.category_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">
                          Geographic Location:
                        </span>{' '}
                        {`${data?.city?.city_name}, ${data?.country?.country_name}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Business Stage:</span>{' '}
                        {data?.stage?.business_stage_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Funding Goal:</span> $
                        {data?.fund_amount} For {data?.equity}% equity
                      </p>
                    </div>
                    {/* <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Quick Fact:</span> Operating in North America and Europe with expansion plans in Asia</p>
                                </div> */}
                  </div>
                </div>

                {/* <div className="bg-white rounded-lg border border-gray-100 p-6 mb-4">
                            <h2 className="text-lg font-semibold mb-4">Financials & Key Milestones</h2>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Projected revenue:</span> The next year: $5M, with a 40% profit margin</p>
                                </div>
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Secured partnerships:</span> ABC Corp. Launched V2 product line, Expanded to European markets.</p>
                                </div>
                                <div>
                                    <p className="text-sm mb-1"><span className="font-medium">Upcoming Milestones:</span> Launching in Asia Q4 2024, Targeting profitability by 2025.</p>
                                </div>
                            </div>
                        </div> */}

                <div className="bg-white rounded-lg border border-gray-100 p-6 mb-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Important Documents
                  </h2>

                  <div className="space-y-3">
                    {documentFiles.map((doc, index) => {
                      const fileName = getFileName(doc.media_link);
                      const extension = getFileExtension(fileName);
                      return (
                        <div
                          key={doc.project_media_id}
                          onClick={() => window.open(doc.media_link, '_blank')}
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(extension)}
                            <div>
                              <p className="text-sm font-medium">
                                {fileName.length > 20
                                  ? `${fileName.substring(0, 20)}...`
                                  : fileName}
                              </p>
                              <p className="text-xs text-gray-500">31.3 KB</p>
                            </div>
                          </div>
                          <span>
                            <Eye className="w-4 h-4 text-gray-400" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">
                    Project Chats
                    <span className="text-gray-500 ml-2 text-lg">
                      ({chtas?.length || 0})
                    </span>
                  </h2>
                  <button
                    onClick={() => toggleSection('activeChats')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {expandedSections.activeChats ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <div
                  className={`${
                    expandedSections.activeChats ? 'max-h-96' : 'max-h-64'
                  } overflow-y-auto transition-all duration-300`}
                >
                  {chtas?.length > 0 ? (
                    chtas.map((chat) => (
                      <div
                        key={chat.chat_initiate_id}
                        onClick={() => handleChatClick(chat)}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={chat.projectImage}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                              />
                              {/* <div className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div> */}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {chat.project_title}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                Start By : {chat.chatStartByCustomer_name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No active chats
                    </div>
                  )}
                </div>
                {chtas?.length > 3 && !expandedSections.activeChats && (
                  <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={() => toggleSection('activeChats')}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">
                    Group Chats
                    <span className="text-gray-500 ml-2 text-lg">
                      ({groups?.length || 0})
                    </span>
                  </h2>
                  <button
                    onClick={() => toggleSection('groupChats')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {expandedSections.groupChats ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <div
                  className={`${
                    expandedSections.groupChats ? 'max-h-96' : 'max-h-64'
                  } overflow-y-auto transition-all duration-300`}
                >
                  {groups?.length > 0 ? (
                    groups.map((group) => (
                      <div
                        key={group.chat_group_initiates_id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex justify-between items-center p-4">
                          <div>
                            <p className="font-medium text-gray-800">
                              {group.group_name}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {group.group_people} members
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-2 overflow-hidden">
                              {group.chat_reciver?.slice(0, 3).map((user) => (
                                <img
                                  key={user.reciver_unique_id}
                                  src={user.reciver_profile_image}
                                  alt="User"
                                  className="w-8 h-8 rounded-full border-2 border-white"
                                />
                              ))}
                              {group.chat_reciver?.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                  +{group.chat_reciver.length - 3}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleGroupChatClick(group)}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition-colors duration-200"
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No group chats
                    </div>
                  )}
                </div>
                {groups?.length > 3 && !expandedSections.groupChats && (
                  <div className="text-center p-2 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={() => toggleSection('groupChats')}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {selectedChat && (
          <ChatMessages
            chatId={selectedChat.chat_initiate_id}
            userId={selectedChat.chatStartByCustomer_unique_id}
            onClose={closeChatModal}
            user={user}
          />
        )}
        {selectedGroupChat && (
          <GroupChatMessages
            onClose={closeChatModal}
            chatId={selectedGroupChat.chat_group_initiates_id}
            currentChatUser={userID}
            user={user}
            groupData={selectedGroupChat}
          />
        )}
        <Modal show={openModal} size="4xl" onClose={() => setOpenModal(false)}>
          <Modal.Header>Find User</Modal.Header>
          <Modal.Body>
            <div className="h-[40vh]">
              <LocationSelector
                role={true}
                selectedRole={role}
                onRoleChange={setRole}
                selectedCountry={country}
                selectedState={state}
                selectedCity={city}
                onCountryChange={setCountry}
                onStateChange={setState}
                onCityChange={setCity}
                className="grid xl:grid-cols-4 lg:grid-cols-4 grid-cols-4 gap-5 w-full"
                labelClass="hidden"
                inputClass="w-full"
              />
              {users.length > 0 && (
                <div className="overflow-y-auto mt-5">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-[#718096] font-normal text-base bg-[#F5F5F5]">
                      <tr className="text-nowrap">
                        <th scope="col" className="px-6 py-3 font-medium pe-60">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium pe-40">
                          Subscription
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium ">
                          Action
                        </th>
                      </tr>
                    </thead>
          <tbody>
                      {users.map((list, i) => (
                        <tr
                          key={i}
                          className="bg-white text-nowrap border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="px-6 py-3 font-semibold text-sm text-black">
                            <Link className="flex flex-row gap-3 transition-all duration-300 ease-out hover:scale-105">
                              {list.customer_profile_image ? (
                                <img
                                  src={list.customer_profile_image}
                                  alt=""
                                  className="h-12 w-12 rounded-lg aspect-square"
                                />
                              ) : (
                                <h1 className="h-12 w-12 rounded-lg aspect-square bg-gray-200 flex justify-center place-items-center font-medium text-lg">
                                  {list.full_name?.charAt()}
                                </h1>
                              )}
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-3 place-items-center">
                                  <h1 className="line-clamp-1">
                                    {list.full_name}
                                  </h1>
                                  <span>
                                    <BadgeCheck size={20} />
                                  </span>
                                </div>
                                <h1 className="text-neutral-400 font-normal">
                                  {list.email}
                                </h1>
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-3">
                            <span>{list.subscription?.subscription_name}</span>
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => openReply(list.customer_unique_id)}
                            >
                              <MessagesSquare />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={open} onClose={() => setOpen(false)}>
          <Modal.Header>Send Offer</Modal.Header>
          <Modal.Body>
            {role?.value == 'entrepreneur' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span>Funding Ammount ($.)</span>
                  <input
                    type="number"
                    onChange={(e) => setFunding(e.target.value)}
                    value={funding}
                    className="rounded-lg no-arrows"
                    placeholder="Enter Funding Ammount"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span>Equity (%.)</span>
                  <input
                    type="number"
                    onChange={(e) => setEquity(e.target.value)}
                    value={equity}
                    className="rounded-lg no-arrows"
                    placeholder="Enter Equity"
                  />
                </div>
              </div>
            )}
            {(role?.value === 'agent' || role?.value === 'investor') && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span>Deal (%.)</span>
                  <input
                    type="number"
                    onChange={(e) => setDeal(e.target.value)}
                    value={deal}
                    className="rounded-lg no-arrows"
                    placeholder="Enter Deal"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1 mt-3">
              <span>Message</span>
              <textarea
                type="text"
                className="rounded-lg"
                onChange={(e) => setMsg(e.target.value)}
                value={msg}
                placeholder="Enter Message"
                rows={5}
              ></textarea>
            </div>
            <div className="flex flex-row gap-4 mt-5 justify-center place-items-center">
              <CustomButton
                onClick={() => setOpen(false)}
                label="Cancel"
                cancel={true}
              />
              <CustomButton label="Send Offer" onClick={sendMsg} />
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
}

export default Singlecontent