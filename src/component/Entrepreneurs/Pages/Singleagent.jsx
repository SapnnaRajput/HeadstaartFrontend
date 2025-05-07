import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../../Utiles/Loader";
import axios from "axios";
import { UserState } from "../../../context/UserContext";
import { BadgeCheck, Eye, X } from "lucide-react";
import { space } from "postcss/lib/list";
import img from "../../../Assets/Images/pr-1.png";
import flag from "../../../Assets/Images/flag.png";
import CustomButton from "../../../Utiles/CustomButton";
import { notify } from "../../../Utiles/Notification";
import { useSearchParams } from "react-router-dom";

const Singleagent = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState([]);
  const [data, setData] = useState([]);
  const [project, setProject] = useState([]);
  const [chatsOn, setChaton] = useState(null);
  const [flagProject, setFlagproject] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [hasLead, setHasLead] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const displayedServices = showAll ? service : service.slice(0, 2);
  const [investorProjectID, setInvestorProjectID] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id");
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/get_single_agent`,
          {
            customer_unique_id: id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setData(response.data.customer_data);
          setChaton(response.data);
          setService(response.data.customer_data.agentservice);
        }
      } catch (error) {
        console.log("error", "Unauthorized access please login again");
      }
      setLoading(false);
    };
    fetchProjects();
  }, [id]);

  useEffect(() => {
    const postData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/get_flag_project`,
          {
            customer_unique_id: user?.customer?.customer_unique_id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setProject(response.data.projects);
        } else {
          setProject([]);
          console.log("error", response.data.message);
        }
      } catch (error) {
        notify("error", "Unauthorized access please login again");
      }
      setLoading(false);
    };

    postData();
  }, [baseUrl, user]);

  const handleMessage = async () => {
    if (user.role == "entrepreneur") {
      if (!flagProject) {
        notify("error", "Please select Project");
        return;
      }
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/lead_detail_single_web`,
        {
          customer_unique_id: id,
          ...(user.role == "entrepreneur" && {
            project_unique_id: flagProject,
          }),
          ...(user.role == "investor" &&
            sessionStorage.getItem("investorProjectId") && {
              project_unique_id: sessionStorage.getItem("investorProjectId"),
            }),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        if (response.data.isChat) {
          navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`);
          sessionStorage.removeItem("investorProjectId");
        } else {
          setHasLead(response.data.status);
          setModalMessage(response.data.message);
          setShowModal(true);
          sessionStorage.removeItem("investorProjectId");
        }
      } else {
        setHasLead(response.data.status);
        setModalMessage(response.data.message);
        setShowModal(true);
        sessionStorage.removeItem("investorProjectId");
      }
    } catch (error) {
      notify("error", "Unauthorized access please login again");
    }
    setLoading(false);
  };

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/chat_initiate_web`,
        {
          customer_unique_id: id,
          ...(user.role == "entrepreneur" && {
            project_unique_id: flagProject,
          }),
          ...(user.role == "investor" &&
            projectId && {
              project_unique_id: projectId,
            }),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setShowModal(false);
        notify("success", response.data.message);

        setTimeout(() => {
          navigate(`/${user.role}/messages/${response.data.chat_initiate_id}`);
        }, 2000);
        sessionStorage.removeItem("investorProjectId");
      } else {
        notify("error", response.data.message);
      }
    } catch (err) {
      notify("error", err);
    }
    setLoading(false);
  };

  const handleBuyLead = () => {
    navigate(`/${user.role}/purchase-lead`);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="rounded-xl bg-white= p-6">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3">
            <img
              src={data?.customer_profile_image}
              alt=""
              className="h-24 w-24 rounded-xl aspect-square object-cover"
            />
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-semibold capitalize">
                {data?.full_name}
              </h1>
              <span className="font-semibold">
                Asking For :{" "}
                <span className="text-green-400">{data?.deal_per}%</span>
              </span>
            </div>
          </div>
          {data?.is_verified == 0 && (
            <span className="text-[#4A3AFF]">
              <BadgeCheck size={35} />
            </span>
          )}
        </div>

        <div className="mt-7">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-xl">About Me</h1>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            <div className="p-3 flex flex-col rounded-xl">
              <p className="text-sm text-[#97A2B0] capitalize">
                {data?.about_me}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-xl">Agent Service</h1>
            {service.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-500 text-sm font-medium"
              >
                {showAll ? "View Less" : "View All"}
              </button>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {displayedServices.map((list, i) => (
              <div key={i} className="p-3 border flex flex-col rounded-xl">
                <h1 className="font-semibold text-base">
                  {list.category.category_name}
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  {expanded || list.description.length <= maxLength
                    ? list.description
                    : `${list.description.substring(0, maxLength)}...`}
                  {list.description.length > maxLength && (
                    <button
                      className="text-blue-500 text-sm mt-1"
                      onClick={toggleExpand}
                    >
                      {expanded ? "See Less" : "See More"}
                    </button>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
        {user.role == "entrepreneur" && (
          <>
            <div className="mt-10">
              <h1 className="text-xl font-semibold mb-6 text-[#05004E]">
                Select Flag Project
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-7 mt-5">
                {project.map((list, index) => (
                  <label
                    className="bg-white shadow-2xl cursor-pointer rounded-xl relative flex flex-col h-[360px]"
                    name="project"
                    key={index}
                  >
                    <div className="relative h-52 w-full">
                      {list?.projectMedia?.some(
                        (media) => media.media_type === "photo"
                      ) && (
                        <img
                          src={
                            list.projectMedia.find(
                              (media) => media.media_type === "photo"
                            ).media_link
                          }
                          alt={list.title}
                          className="h-full w-full object-cover rounded-t-xl"
                        />
                      )}
                      <div className="absolute top-5 right-5 rounded-full p-2 bg-white text-red-700">
                        <img src={flag} alt="flag" className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col">
                            <h1 className="text-[#0A2533] font-semibold text-sm xl:text-base line-clamp-2">
                              {list.title}
                            </h1>
                            <span className="text-[#97A2B0] text-xs xl:text-sm font-medium">
                              {list.category.category_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[#3D3535] font-bold text-xs xl:text-sm whitespace-nowrap">
                            <Eye size={16} />
                            <span>{list.view || "0"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-auto">
                        <h1 className="text-[#0A2533] font-semibold text-sm xl:text-base">
                          Fund Amount: {list.fund_amount}
                        </h1>
                        <input
                          type="radio"
                          name="project"
                          onChange={() =>
                            setFlagproject(list.project_unique_id)
                          }
                          className="focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
        <div className="mt-10 flex flex-row justify-end gap-6">
          <CustomButton label="Send a message" onClick={handleMessage} />
          <CustomButton cancel={true} label="Back" />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Lead Information</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6">
              <p className="text-center mb-6">{modalMessage}</p>
              {hasLead ? (
                <button
                  onClick={handleStartChat}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Start Chat
                </button>
              ) : (
                <button
                  onClick={handleBuyLead}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Buy Lead
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Singleagent;
