import React, { act, useEffect, useRef, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../routes/firebaseConfig";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import { UserState } from "../../../context/UserContext";
import {
  ArrowLeftIcon,
  Eye,
  FileText,
  FileTextIcon,
  Image,
  Phone,
  Plus,
  Send,
  User,
  Video,
  X,
} from "lucide-react";
import CustomButton from "../../../Utiles/CustomButton";
import flag from "../../../Assets/Images/flag.png";
import MessageContent from "./MessageContent";

const Messages = () => {
  const { user } = UserState();
  const { id } = useParams();
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [msges, setMsges] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const [oneChat, setOneChat] = useState(false);
  const messagesEndRef = useRef(null);
  const [group, setGroup] = useState(false);
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [projects, setProjects] = useState([]);
  const [flagProject, setFlagproject] = useState(0);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("chats");
  const [groups, setGroups] = useState([]);
  const [backMembers, setBackmembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const location = useLocation();
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const searchParams = new URLSearchParams(location.search);
  const groupShareId = searchParams.get("groupshare");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [gropmembers, setGropuMembers] = useState([]);
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const paddingTop = parseInt(getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom);
    const maxHeight = lineHeight * 3 + paddingTop + paddingBottom;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chats);
      setFilteredGroups(groups);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    // Filter chats
    const matchedChats = chats.filter((chat) =>
      chat.receiver_full_name.toLowerCase().includes(query)
    );
    setFilteredChats(matchedChats);

    // Filter groups
    const matchedGroups = groups.filter((group) =>
      group.group_name.toLowerCase().includes(query)
    );
    setFilteredGroups(matchedGroups);
  }, [searchQuery, chats, groups]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  const openChat = async (chatInitiateId, color) => {
    setChatId(chatInitiateId);
    setOneChat(true);
    if (!color) {
      if (activeTab == "chats") {
        const selectedChat = chats.find(
          (chat) => chat.chat_initiate_id == chatInitiateId
        );

        if (!selectedChat) {
          console.log("Waiting for chats to load...");
          return;
        }

        setChat(selectedChat);

        const stringChatId = String(chatInitiateId);
        const messagesRef = collection(
          db,
          "headstaart",
          stringChatId,
          "messages"
        );
        const q = query(messagesRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const filterData = fetchedMessages.map((list) => ({
            message: list.text,
            ...list,
          }));
          setMsges(filterData);
          try {
            const updatePromises = fetchedMessages
              .filter(
                (message) =>
                  message.reciver_unique_id ==
                    user?.customer?.customer_unique_id &&
                  message.status !== "read"
              )
              .map((message) =>
                updateDoc(
                  doc(db, "headstaart", stringChatId, "messages", message.id),
                  {
                    status: "read",
                  }
                )
              );
            await Promise.all(updatePromises);
          } catch (error) {
            console.error("Error updating message status:", error);
          }
        });
        // try {
        //   const response = await axios.post(
        //     `${baseUrl}/check_chat_initiate`,
        //     {
        //       chat_initiate_id: chatInitiateId,
        //       customer_unique_id: selectedChat.receiver_unique_id,
        //     },
        //     {
        //       headers: { Authorization: `Bearer ${user?.token}` },
        //     }
        //   );

        //   if (response.data.status) {
        //     setMsges(response.data.chatDetails);
        //   }
        // } catch (error) {
        //   console.error("Error fetching chat details:", error);
        // }
        return () => unsubscribe();
      }
    } else {
      const selectedChat = groups.find(
        (chat) => chat.chat_group_initiates_id == chatInitiateId
      );

      if (!selectedChat) {
        console.log("Selected chat not found");
        return;
      }
      setChat({
        receiver_full_name: selectedChat.group_name,
        chat_initiate_id: selectedChat.chat_group_initiates_id,
        bg: color,
      });

      const ids = selectedChat.chat_reciver.map(
        (item) => item.reciver_unique_id
      );
      setBackmembers(ids);
      const stringChatId = String(chatInitiateId);

      const messagesRef = collection(db, "groups", stringChatId, "messages");
      const q = query(messagesRef, orderBy("timestamp"));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filterData = fetchedMessages.map((list) => ({
          message: list.text,
          ...list,
        }));
        setMsges(filterData);
        try {
          const updatePromises = fetchedMessages
            .filter(
              (message) =>
                message.reciver_unique_id ==
                  user?.customer?.customer_unique_id &&
                message.status !== "read"
            )
            .map((message) =>
              updateDoc(
                doc(db, "groups", stringChatId, "messages", message.id),
                {
                  status: "read",
                }
              )
            );
          await Promise.all(updatePromises);
        } catch (error) {
          console.error("Error updating message status:", error);
        }
      });

      // try {
      //   const response = await axios.post(
      //     `${baseUrl}/chat_group_initiate`,
      //     {
      //       chat_group_initiate_unique_id: chatInitiateId,
      //       group_name: selectedChat.group_name,
      //       group_people_unique_id: ids,
      //       project_unique_id: selectedChat.project_id,
      //     },
      //     {
      //       headers: { Authorization: `Bearer ${user?.token}` },
      //     }
      //   );

      //   if (response.data.status) {
      //     setMsges(response.data.chatDetails);
      //   }
      // } catch (error) {
      //   console.error("Error fetching chat details:", error);
      // }
      return () => unsubscribe();
    }
  };
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chats);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const matchedChats = chats.filter((chat) =>
      chat.receiver_full_name.toLowerCase().includes(query)
    );
    setFilteredChats(matchedChats);
  }, [searchQuery, chats]);

  useEffect(() => {
    if (groupShareId && groups.length > 0) {
      setActiveTab("groups");

      // Using the correct property name from your data structure
      const groupIndex = groups.findIndex(
        (group) => group.chat_group_initiates_id === Number(groupShareId)
      );

      console.log("GroupShareId:", groupShareId, "GroupIndex:", groupIndex);
      console.log("Matching group:", groups[groupIndex]);

      if (groupIndex !== -1) {
        const ctgIndex = groupIndex % ctg.length;
        const color = ctg[ctgIndex].category_color_code;
        console.log(color);
        openChat(groupShareId, color);
        setOneChat(true);
      }
    }
  }, [groupShareId, groups]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/get_chat_user_list`,
          { customer_unique_id: user?.customer?.customer_unique_id },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        if (response.data.status) {
          setChats(response.data.chat_user_data);
          setFilteredChats(response.data.chat_user_data);
        } else {
          notify("error", response.data.message);
        }
      } catch (error) {
        notify("error", "Unauthorized access. Please log in again.");
      }
      setLoading(false);
    };
    fetchChatUsers();
    console.log(filteredChats);
    const allGroups = async () => {
      let url;
      if (user?.role == "agent") {
        url = "get_chat_group_list_web";
      } else {
        url = "get_chat_group_invest_enter_list";
      }
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/${url}`,
          { customer_unique_id: user?.customer?.customer_unique_id },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        if (response.data.status) {
          setGroups(response.data.chat_group_data);
        }
      } catch (error) {
        // notify('error', 'Unauthorized access. Please log in again.');
      }
      setLoading(false);
    };
    allGroups();
  }, [baseUrl, user]);

  useEffect(() => {
    if (id && chats.length > 0) {
      // Only proceed if we have chats loaded
      openChat(id);
    }
  }, [id, chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msges]);

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    setTimeout(adjustTextareaHeight, 0);
  };

  const uploadImage = async (file, baseUrl, token) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${baseUrl}/get_image_url`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        return response.data.image;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!selectedFile && !newMessage.trim()) {
      notify("error", "Please enter a message or select a file.");
      return;
    }

    const stringChatId = String(chatId);
    setIsSending(true);

    try {
      let messageText = newMessage.trim();

      if (selectedFile) {
        try {
          messageText = await uploadImage(
            selectedFile.file,
            baseUrl,
            user?.token
          );
        } catch (error) {
          notify("error", "Failed to upload image");
          setIsSending(false);
          return;
        }
      }

      if (activeTab === "chats") {
        await addDoc(collection(db, "headstaart", stringChatId, "messages"), {
          text: messageText,
          status: "sent",
          reciver_unique_id: chat?.receiver_unique_id,
          sender_unique_id: user?.customer?.customer_unique_id,
          timestamp: new Date(),
        });
      } else if (activeTab === "groups") {
        await addDoc(collection(db, "groups", stringChatId, "messages"), {
          message: messageText,
          status: "sent",
          sender_unique_id: user?.customer?.customer_unique_id,
          timestamp: serverTimestamp(),
        });
      }

      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
      notify("error", "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const toggleMember = (id) => {
    setMembers((prevMembers) =>
      prevMembers.includes(id)
        ? prevMembers.filter((memberId) => memberId !== id)
        : [...prevMembers, id]
    );
  };

  const calculateAgoTime = (insertedTime) => {
    const [hours, minutes, seconds] = insertedTime.split(":").map(Number);
    const insertedDate = new Date();
    insertedDate.setHours(hours, minutes, seconds, 0);

    const now = new Date();
    if (insertedDate > now) {
      insertedDate.setDate(insertedDate.getDate() - 1);
    }
    const diffMs = now - insertedDate;

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds}s`;
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const createGroup = async () => {
    if (!name) {
      notify("error", "Please Enter the Group Name");
      return;
    }
    if (flagProject == 0) {
      notify("error", "Please select Project");
      return;
    }
    if (members.length < 3) {
      notify("error", "Please at Least add 3 Members");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/chat_group_initiate`,
        {
          chat_group_initiate_unique_id: user?.customer?.customer_unique_id,
          group_name: name,
          group_people_unique_id: members,
          project_unique_id: flagProject,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      const stringChatId = String(response.data.chat_group_initiates_id);

      if (response.data.status) {
        const groupRef = doc(db, "groups", stringChatId);
        await setDoc(groupRef, {
          group_name: response.data.group_name,
          chat_group_initiate_unique_id: stringChatId,
          members: [...members, user?.customer?.customer_unique_id],
          createdAt: serverTimestamp(),
        });
        notify("success", "Group Created Successfully");
        setName(null);
        setGroup(false);
        setMembers([]);
      } else {
        notify("error", `${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (group) {
      const data = async () => {
        try {
          const response = await axios.get(`${baseUrl}/group_project_agent`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          });
          if (response.data.status) {
            setProjects(response.data.projects);
          }
        } catch {}
      };
      data();
    }
    setLoading(false);
  }, [group]);

  const ctg = [
    { category_color_code: "bg-cyan-300" },
    { category_color_code: "bg-purple-300" },
    { category_color_code: "bg-yellow-100" },
    { category_color_code: "bg-red-300" },
    { category_color_code: "bg-green-200" },
    { category_color_code: "bg-amber-100" },
    { category_color_code: "bg-blue-200" },
  ];

  // const firstchat = (text) => {
  //   const first = text.charAt();
  //   return first;
  // }

  const firstchat = (text) => {
    if (!text || typeof text !== "string") return "";
    return text.charAt();
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "image" && !file.type.startsWith("image/")) {
        notify("error", "Please select a valid image file");
        return;
      }

      if (type === "document") {
        const validDocTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        if (!validDocTypes.includes(file.type)) {
          notify(
            "error",
            "Please select a valid document (PDF, PPTX, or XLSX)"
          );
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          notify("error", "Document size should be less than 5MB");
          return;
        }
      }

      setSelectedFile({
        file,
        name: file.name,
        type: type,
      });
      setNewMessage("");
      setShowUploadOptions(!showUploadOptions);
    }
  };
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleShowMember = async (chat) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_gorup_member`,
        {
          chat_group_initiates_id: chat.chat_initiate_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        setGropuMembers(response.data.group_creator.members || []);
        setShowModal(true);
      } 
    } catch (error) {
      // notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBgColor = (receiverRole, currentUserRole) => {
    if (receiverRole !== currentUserRole) {
      const roleColors = {
        investor: "bg-[#fff0d3]",       // light yellow
        entrepreneur: "bg-[#e2f5e6]",   // light green
        agent: "bg-[#d7e6fa]",          // light blue
      };
      return roleColors[receiverRole] || "bg-white";
    }
    return "bg-[#F3F3F3]"; 
  };

  return (
    <>
      {loading && <Loader />}
      <div className="rounded-xl container mx-auto bg-white overflow-hidden">
        <div className="w-full pt-1 ps-2 block md:hidden">
          {oneChat && (
            <div
              className="gap-3 w-fit text-black flex flex-row place-items-center"
              onClick={() => setOneChat(false)}
            >
              <ArrowLeftIcon size={20} />
              Back
            </div>
          )}
        </div>
        {!group && (
          <div className="flex">
            <div
              className={`${
                oneChat ? "md:w-1/3 w-full hidden md:block" : "lg:w-2/5 w-full"
              } pb-4 border-r border-[#e6e4e4] text-center transition-all duration-300 ease-out`}
            >
              <div className="flex flex-row justify-between place-items-center px-4 py-3 border-b border-[#e6e4e4] h-20">
                <h1 className="font-semibold text-xl">Messages</h1>
                {user?.role == "agent" && (
                  <button
                    className="font-medium text-gray-500"
                    onClick={() => setGroup(true)}
                  >
                    Create Group
                  </button>
                )}
              </div>
              <div className="p-4">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="focus:ring-0 w-full border-0 rounded-lg bg-[#F3F3F3] py-4"
                  placeholder="Search here..."
                />
              </div>
              <div className="flex flex-row gap-3 px-4 py-2">
                <button
                  onClick={() => {
                    setActiveTab("chats");
                    setOneChat(false);
                  }}
                  className={`font-medium ${
                    activeTab === "chats" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Chats
                </button>
                <button
                  onClick={() => {
                    setActiveTab("groups");
                    setOneChat(false);
                  }}
                  className={`font-medium ${
                    activeTab === "groups" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Groups
                </button>
              </div>
              <div className="flex flex-col px-4 h-[60vh] overflow-y-auto">
                {activeTab == "chats" &&
                  filteredChats.map((list, i) => (
                    <div
  onClick={() => openChat(list.chat_initiate_id)}
  className={`flex flex-row place-items-start gap-3 mb-2
    hover:bg-[#F3F3F3] rounded-lg transition-all duration-300 ease-out px-2 py-2.5 cursor-pointer 
    ${getBgColor(list.receiver_role, user.role)}
    ${chat?.chat_initiate_id === list.chat_initiate_id ? "ring-2 ring-[#ccc]" : ""}
  `}
  key={i}
>
                      {list.receiver_role === "agent" &&
                      user.role == "entrepreneur" ? (
                        <Link
                          to={`/entrepreneur/agent-opportunities/${list.chat_initiate_id}/${list.receiver_unique_id}/${list.project.project_unique_id}`}
                          target="_blank"
                        >
                          {list.reciver_profile_image ? (
                            <img
                              src={list.reciver_profile_image}
                              alt={list.receiver_full_name}
                              className="lg:h-14 object-cover lg:w-14 w-12 h-12 aspect-square rounded-lg"
                            />
                          ) : (
                            <div className="lg:h-14 lg:w-14 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </Link>
                      ) : list.reciver_profile_image ? (
                        <img
                          src={list.reciver_profile_image}
                          alt={list.receiver_full_name}
                          className="lg:h-14 object-cover lg:w-14 w-12 h-12 aspect-square rounded-lg"
                        />
                      ) : (
                        <div className="lg:h-14 lg:w-14 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="w-full flex flex-col place-items-start">
                        <div className="place-items-start w-full">
                          <h1 className="font-medium lg:text-lg text-sm capitalize">
                            {list.receiver_full_name}
                          </h1>
                          <p className="font-medium lg:text-sm text-xs">
                            {list.project?.title || "Chat Without Project"}
                          </p>
                          {list.last_message != null && (
                            <span className="lg:text-sm text-xs font-semibold text-[#00000066]">
                              {calculateAgoTime(
                                list.last_message.inserted_time
                              )}
                            </span>
                          )}
                        </div>
                        {list.last_message != null &&
                        list.last_message.read_by === "pending" ? (
                          <div className="flex flex-row justify-between place-items-center w-full">
                            <span className="lg:text-sm text-xs  text-start font-semibold text-[#4A3AFF]">
                              {list.last_message.message}
                            </span>
                            <span className="aspect-square h-6 w-6 rounded-full bg-[#4A3AFF] text-white text-xs flex justify-center place-items-center p-1">
                              {list.pending_message}
                            </span>
                          </div>
                        ) : (
                          <span className="lg:text-sm text-xs  text-start font-semibold text-[#00000066]">
                            {list.last_message?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                {searchQuery &&
                  activeTab === "chats" &&
                  filteredChats.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No chats found matching "{searchQuery}"
                    </div>
                  )}
                {activeTab === "groups" &&
                  filteredGroups.map((list, i) => (
                    <div
                      onClick={() =>
                        openChat(
                          list.chat_group_initiates_id,
                          ctg[i % ctg.length].category_color_code
                        )
                      }
                      className={`${
                        chat?.chat_initiate_id ==
                          list.chat_group_initiates_id && "bg-[#F3F3F3]"
                      } flex flex-row place-items-start gap-3 hover:bg-[#F3F3F3] transition-all duration-300 ease-out px-2 py-2.5 cursor-pointer`}
                      key={i}
                    >
                      <div className="flex flex-row place-items-start gap-6">
                        <span
                          className={`${
                            ctg[i % ctg.length].category_color_code
                          } lg:h-14 w-12 h-12 lg:w-14 aspect-square rounded-md flex justify-center place-items-center font-medium text-xl`}
                          onClick={() => {
                            handleShowMember(chat);
                          }}
                        >
                          {firstchat(list.group_name)}
                        </span>
                        <div className="flex flex-col">
                          <h1 className="lg:text-xl text-lg font-medium">
                            {list.group_name}
                          </h1>
                          {list.last_message != null && (
                            <span className="lg:text-base text-start font-semibold text-[#00000066]">
                              {list.last_message?.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {searchQuery &&
                  activeTab === "groups" &&
                  filteredGroups.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No groups found matching "{searchQuery}"
                    </div>
                  )}
              </div>
            </div>
            {oneChat && (
              <div
                className={`${
                  oneChat ? "md:w-2/3 w-full" : "w-0"
                } md:h-[60vh] h-[65vh] transition-all duration-300 ease-out pb-4`}
              >
                <div className="h-20 flex justify-between place-items-center px-5 border-b border-[#e6e4e4]">
                  <div className="flex flex-row place-items-center gap-3">
                    {chat?.reciver_profile_image && (
                      <img
                        src={chat?.reciver_profile_image}
                        alt=""
                        className="md:h-14 h-10 object-cover md:w-14 w-10 rounded-lg"
                   
                      />
                    )}
                    {!chat?.reciver_profile_image && (
                      <span
                        className={`${chat?.bg} cursor-pointer lg:h-14 w-12 h-12 lg:w-14 aspect-square rounded-md flex justify-center place-items-center font-medium text-xl`}
                        onClick={() => {
                          handleShowMember(chat);
                        }}
                      >
                        {firstchat(chat?.receiver_full_name)}
                      </span>
                    )}
                    <div className="">
                      <h1 className={`font-semibold text-xl capitalize`}>
                        {chat?.receiver_full_name}
                      </h1>
                      <div className="flex flex-row place-items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        <span className="text-sm">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row place-items-center gap-5">
                    <div className="md:p-4 p-2 bg-[#615EF01A] text-[#4A3AFF] rounded-lg hidden">
                      <Video />
                    </div>
                    <div className="md:p-4 p-2 bg-[#615EF01A] text-[#4A3AFF] rounded-lg hidden">
                      <Phone />
                    </div>
                    <div
                      className="rotate-45 ms-10 md:block hidden cursor-pointer"
                      onClick={() => setOneChat(false)}
                    >
                      <Plus />
                    </div>
                  </div>
                </div>
                <div className="md:h-[60vh] h-[50vh] overflow-y-auto p-5 flex flex-col gap-3">
                  {msges.map((list, i) => (
                    <MessageContent
                      key={i}
                      message={list.message}
                      list={list}
                      isCurrentUser={
                        list.sender_unique_id ===
                        user?.customer?.customer_unique_id
                      }
                      chatID={chat.chat_initiate_id}
                      activeTab={activeTab}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="md:px-20">
                  <div className="relative px-4 py-3">
                    {selectedFile && (
                      <div className="mb-2 px-4 py-2 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {selectedFile.type === "document" ? (
                            <FileTextIcon className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Image className="w-4 h-4 text-green-500" />
                          )}
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {selectedFile.name}
                          </span>
                        </div>
                        <button
                          onClick={removeFile}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowUploadOptions(!showUploadOptions)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>

                        {showUploadOptions && (
                          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg py-2 min-w-[160px] z-10">
                            <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                              <Image className="w-5 h-5 text-green-500" />
                              <span className="text-sm text-gray-700">
                                Image
                              </span>
                              <input
                                type="file"
                                ref={imageInputRef}
                                onChange={(e) => handleFileChange(e, "image")}
                                className="hidden"
                                accept="image/*"
                              />
                            </label>
                            {/* <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                <FileText className="w-5 h-5 text-gray-600" />
                              
                              <span className="text-sm text-gray-700">
                                Document
                              </span>
                              <input
                                id="document-upload"
                                type="file"
                                accept=".pdf,.pptx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "document")}
                              />
                            </label> */}
                          </div>
                        )}
                      </div>

                      <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={handleMessageChange}
                        placeholder="Type your message here..."
                        className="flex-1 resize-none outline-none border-none focus:ring-0 max-h-32 py-2 overflow-y-auto"
                        style={{ minHeight: "1rem" }}
                      />

                      <button
                        onClick={sendMessage}
                        disabled={isSending}
                        className={`p-2 ${
                          isSending
                            ? "bg-blue-400"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white rounded-full transition-colors`}
                      >
                        {isSending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {group && (
          <div className="flex">
            <div
              className={`w-full hidden md:block md:w-1/3 pb-4 border-r border-[#e6e4e4] text-center transition-all duration-300 ease-out`}
            >
              <div className="flex flex-row justify-between place-items-center px-4 py-3 border-b border-[#e6e4e4] h-20">
                <h1 className="font-semibold text-xl">Add Members</h1>
              </div>
              <div className="p-4">
                <input
                  type="search"
                  name=""
                  id=""
                  className="focus:ring-0 w-full border-0 rounded-lg bg-[#F3F3F3] py-4"
                  placeholder="Search here..."
                />
              </div>
              <div className="flex flex-col px-4 h-[60vh] overflow-y-auto">
                {chats.map((list, i) => (
                  <label
                    name="id"
                    className={`flex flex-row place-items-start gap-3 hover:bg-[#F3F3F3] transition-all duration-300 ease-out px-2 py-2.5 cursor-pointer`}
                    key={i}
                  >
                    <img
                      src={list.reciver_profile_image}
                      alt=""
                      className="lg:h-14 object-cover lg:w-14 w-12 h-12 aspect-square rounded-lg"
                    />
                    <div className="w-full flex flex-col place-items-start">
                      <div className="flex flex-row justify-between place-items-start w-full">
                        <h1 className="font-medium lg:text-lg text-sm capitalize">
                          {list.receiver_full_name}
                        </h1>
                      </div>
                      <span className="lg:text-sm text-xs  text-start font-semibold text-[#00000066]">
                        {list.last_message?.message}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      name="id"
                      id=""
                      onChange={() => toggleMember(list.receiver_unique_id)}
                      className="rounded-sm focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            </div>
            <div
              className={`md:w-2/3 w-full  md:h-[80vh] h-[65vh] overflow-y-auto transition-all duration-300 ease-out pb-4`}
            >
              <div className="flex flex-col gap-4 p-4">
                <span className="font-medium text-base">
                  Group Name<small className="text-red-500">*</small>
                </span>
                <input
                  type="text"
                  name=""
                  id=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md border-gray-400 focus:border-black focus:ring-0"
                  placeholder="Group Name"
                />
              </div>
              <div className="mt-4 xs:mt-5 px-2 md:px-4">
                <div className=" flex justify-between">
                <h1 className="font-semibold text-sm xs:text-base md:text-lg">
                  Select Flag Project
                </h1>

                  <CustomButton
                    label="Create Group"
                    onClick={createGroup}
                    className="w-full xs:w-auto"
                  />
                </div>
                <div className="mt-4 xs:mt-6 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 xs:gap-6 md:gap-7 xl:gap-8">
      {projects.map((list, index) => (
        <div
          className="bg-white shadow-lg md:shadow-xl hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden h-full flex flex-col"
          key={index}
        >
          {/* Image container with improved styling */}
          <div className="relative w-full aspect-video overflow-hidden">
            <Link to={`/agent/entrepreneur-profile/${list.customer_unique_id}`} target="_blank">
            <img
              src={list.medias.length > 0 ? list.medias[0].media_link : '/placeholder-image.jpg'}
              alt={list.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            </Link>
            <div className="absolute top-3 right-3 rounded-full p-2 bg-white text-red-700 shadow-md">
              <img
                src={flag}
                alt="Flag"
                className="h-5 w-5"
              />
            </div>
          </div>
          
          {/* Content area with better spacing */}
          <div className="flex flex-col flex-grow p-4">
            {/* Title and category section */}
            <div className="flex justify-between items-start gap-3 mb-3">
              <div className="flex-grow">
                <h3 className="text-[#0A2533] font-semibold text-base line-clamp-2 capitalize">
                  {list.title}
                </h3>
                <span className="text-[#97A2B0] text-sm font-medium mt-1 block">
                  {list.category.category_name}
                </span>
              </div>
            
            </div>
            <div className="flex items-center gap-1.5 text-[#3D3535] font-bold text-sm bg-gray-50 px-2 py-1 rounded-lg">
                <Eye className="h-4 w-4" />
                <span>{list.views ? list.views : "20"}k</span>
              </div>
            
            {/* Divider */}
            <div className="border-t border-gray-100 my-2"></div>
            
            {/* Bottom section with radio button */}
            <div className="flex items-center justify-between mt-auto pt-2">
              <label className="inline-flex items-center cursor-pointer">
                <span className="mr-2 text-sm font-medium text-[#0A2533]">Select</span>
                <input
                  type="radio"
                  name="project"
                  onClick={() => setFlagproject(list.project_unique_id)}
                  className="w-4 h-4 focus:ring-2 ring-offset-2 ring-indigo-500 text-indigo-600 cursor-pointer"
                />
              </label>
              
              {/* You can uncomment this if you want to show investor interest */}
              {/*
              <div className="text-[#0A2533] font-semibold text-sm">
                Investor interest: {list.Ii ? list.Ii : "20"}%
              </div>
              */}
            </div>
          </div>
        </div>
      ))}
    </div>

                
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full bg-gray-900 bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Group Members
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                  onClick={() => setShowModal(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <ul className="divide-y divide-gray-200">
                  {gropmembers.length > 0 ? (
                    gropmembers.map((member, index) => (
                      <li key={index} className="py-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {member.customer_name
                                  ?.charAt(0)
                                  .toUpperCase() || "?"}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {member.customer_name || "Unknown Name"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {member.role
                                ? `Role: ${member.role}`
                                : "No role assigned"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-center text-gray-500">
                      No members found
                    </li>
                  )}
                </ul>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button
                  type="button"
                  className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;
