import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Projects from "./Pages/Projects";
import Flagproject from "./Pages/Flagproject";
import Singleproject from "./Pages/Singleproject";
import Template from "./Pages/Template";
import NewProject from "./Pages/AddProject/NewProject";
import Uploadvideophoto from "./Pages/Uploadvideophoto";
import Pitchdeckcreation from "./Pages/Pitchdeckcreation";
import Businessdetails from "./Pages/Businessdetails";
import Fundingrequirement from "./Pages/Fundingrequirement";
import Growthplan from "./Pages/Growthplan";
import Pitchready from "./Pages/Pitchready";
import MyDocument from "./Pages/MyDocument";
import Upcomingevent from "./Pages/Upcomingevent";
import Footer from "../Home/Foooter";
import Subscription from "./Pages/Subscription";
import Settingss from "./Pages/Settings";
import Legaltemplate from "./Pages/Legaltemplate";
import Investor from "./Pages/Investor";

import img from "../../Assets/Images/pr-1.png";
import img1 from "../../Assets/Images/agent-1.png";
import img2 from "../../Assets/Images/agent-2.png";
import img3 from "../../Assets/Images/agent-3.png";
import img4 from "../../Assets/Images/agent-4.png";
import img5 from "../../Assets/Images/agent-5.png";
import img6 from "../../Assets/Images/agent-6.png";
import Agentassistance from "./Pages/Agentassistance";
import Verification from "./Pages/Verification";
import {
  BookUser,
  CalendarClock,
  ChartNoAxesCombined,
  ChartPie,
  CircleUserRound,
  Files,
  Flag,
  FolderOpenDot,
  HandPlatter,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mails,
  Receipt,
  Settings,
  ShieldHalf,
} from "lucide-react";
import Messages from "./Pages/Messages";
import Map from "../Map/Map";
import { useLocation } from "react-router-dom";
import ManageLead from "./Pages/ManageLead";
import LeadPurchase from "./Pages/PurchaseLead";
import PromoteProject from "./Pages/PromoteProject";
import Singleagent from "./Pages/Singleagent";
import Opportunities from "./Pages/Opportunities/Opportunities";
import AgentOpportunities from "./Pages/Opportunities/AgentOpportunity";
import InvestorOpportunities from "./Pages/Opportunities/InvestorOpportunity";
import HeadStartTeam from "./Pages/HeadStartTeam";
import HeasStartServices from "./Pages/HeasStartServices";
import { UserState } from "../../context/UserContext";
import EsignDocumetnt from "./Pages/EsignDocumetnt";
import SharedProject from "./Pages/SharedProject";
import axios from "axios"
import AgentDetails from "./Pages/AgentDetails";
import InvestorDetails from "./Pages/InvestorDetails";
import UpcommingEventDetails from "./Pages/UpcommingEventDetails";
import AgentProfile from "./Pages/AgentProfile";
import Loader from "../../Utiles/Loader";
import ProfileBoost from "./Pages/ProfileBoost";

const Home = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const location = useLocation();
  const [count, setCount ] = useState();
  const [open, setOpen] = useState(false);
  const isMapFilterAgentPage =
  location.pathname === `/${user.role}/map/filter_agent`;
  const [hasSubscription, setHasSubscription] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getMenuCount = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/menu_count_api`,
        {
          customer_unique_id: user?.customer?.customer_unique_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response?.data?.status) {
        setCount(response.data)
      } else {
        // notify('error', response?.data?.message);
      }
    } catch (error) {}
  };
  const subscriptions = async() => {
    setLoading(true)
    try {
      console.log("subscriptions")
      const response = await axios.post(`${baseUrl}/current_subscription`, {
        customer_unique_id: user?.customer?.customer_unique_id
      },{
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.status) {
        setHasSubscription(true); 
      } else {
        setHasSubscription(false); 
        navigate(`/${user.role}/subscription`)
       
      }
    } catch (error) {
      // notify("error", error.response?.data?.message || "Login failed");
      setHasSubscription(false); 
    } finally{
      setLoading(false)

    }
  }
  useEffect(() => {
    getMenuCount();
    subscriptions();
  }, [baseUrl]);

  const data = [
    {
      img: img,
      title: "Lorem ipsum dolor",
      text: "Real Estate",
      status: "pending",
      Ii: "10",
      views: "30",
      id: 20,
    },
    {
      img: img,
      title: "Lorem ipsum dolor",
      text: "Real Estate",
      status: "pending",
      Ii: "10",
      views: "30",
      id: 20,
    },
    {
      img: img,
      title: "Lorem ipsum dolor",
      text: "Real Estate",
      status: "pending",
      Ii: "10",
      views: "30",
      id: 20,
    },
    {
      img: img,
      title: "Lorem ipsum dolor",
      text: "Real Estate",
      status: "pending",
      Ii: "10",
      views: "30",
      id: 20,
    },
    {
      img: img,
      title: "Lorem ipsum dolor",
      text: "Real Estate",
      status: "pending",
      Ii: "10",
      views: "30",
      id: 20,
    },
    {
      img: img,
      title: "Lorem ipsum dolor",
      text: "Real Estate",
      status: "pending",
      Ii: "10",
      views: "30",
      id: 20,
    },
    {
      img: img,
      title: "Lorem ipsum dolor",
      text: "Real Estate",
      status: "pending",
      Ii: "10",
      views: "30",
      id: 20,
    },
    {
      img: img,
      title: "Lorem ipsum dolor",
      text: "Real Estate",
      status: "pending",
      Ii: "10",
      views: "30",
      id: 20,
    },
  ];

  const investor = [
    {
      img: img1,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img2,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img3,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img4,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img5,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img6,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img1,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img2,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img3,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img4,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img5,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
    {
      img: img6,
      name: "Jason Price",
      email: "kuhlman.jermey@yahoo.com",
    },
  ];

  const Links = [
    {
      to: "dashboard",
      name: "Dashboard",
      icon: ChartPie,
      activePaths: [
        "dashboard",
        "manage_lead",
        "purchase-lead",
        "map/filter_agent",
        "shared-project",
      ],
    },
    {
      to: "projects",
      name: "Projects",
      icon: FolderOpenDot,
      activePaths: [
        "promote-project",
        "projects",
        "new-project",
        "ai-assisted",
      ],
    },
    {
      to: "opportunities",
      name: "Opportunities",
      icon: ChartNoAxesCombined,
      activePaths: [
        "opportunities",
        "agent-opportunities",
        "investor-opportunities",
      ],
      count: [count?.entrepreneur_opportunity_agent_count, count?.entrepreneur_opportunity_investor_count]
    },
    {
      to: "flag-project",
      name: "Flag Project",
      icon: Flag,
      count: [count?.entrepreneur_flag_count]
    },
    {
      to: "documents",
      name: "My Documents",
      icon: Files,
    },
    {
      to: "upcoming-events",
      name: "Upcoming Events",
      icon: CalendarClock,
      count: [count?.entrepreneur_event_count]
    },
    {
      to: "messages",
      name: "Messages",
      icon: Mails,
    },
    {
      to: "legal-templates",
      name: "Legal Templates",
      icon: LayoutTemplate,
      activePaths: ["legal-templates", "e-sign-document"],
    },
    // {
    //     to: 'opportunity',
    //     name: 'Opportunity',
    //     icon: CircleUserRound,
    // },
    {
      to: "agent-assistance",
      name: "Agent Assistance",
      icon: CircleUserRound,
    },
    {
      to: "headstaart-team",
      name: "Headstaart Team",
      icon: ShieldHalf,
      activePaths: ["headstaart-team", "headstaart-services"],
    },
    {
      to: "subscription",
      name: "Subscription",
      icon: Receipt,
    },
    {
      to: "settings",
      name: "Settings",
      icon: Settings,
    },
  ];

  const subscriptionOnlyLinks = [
    {
      to: "subscription",
      name: "Subscription",
      icon: Receipt,
    }
  ];
  const visibleLinks = hasSubscription ? Links : subscriptionOnlyLinks;


  const toggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(false);
      } else {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
    {loading && <Loader/>}
      <div
        onClick={toggle}
        className={`fixed bg-black   h-[100vh] mt-[10vh]  z-50 transition-all duration-300 ease-out ${
          open
            ? "translate-x-0 opacity-50 w-full"
            : "-translate-x-5 opacity-0 w-0"
        }`}
      ></div>
      <div
        className={`fixed h-[100vh] mt-[10vh] z-50 ${
          open ? "block" : "hidden"
        }`}
      >
       <Sidebar Links={visibleLinks} toggle={toggle} />
      </div>
      <Navbar toggle={toggle} />
      <div className="flex md:ps-0">
        {!isMapFilterAgentPage && (
            <div className="w-72 transition-all duration-300 ease-in-out flex-shrink-0 sticky top-28 h-full xl:block hidden">
              <Sidebar Links={visibleLinks} />
            </div>
        )}
        <div className="w-full">
          <div className="">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route
                path="agent-opportunities"
                element={<AgentOpportunities />}
              />
               <Route
                path="agent-opportunities/:chat_initiate_id/:client_unique_id/:project_unique_id"
                element={<AgentDetails />}
              />
              <Route
                path="investor-opportunities"
                element={<InvestorOpportunities />}
              />
              <Route
                path="investor-opportunities/:chat_initiate_id/:client_unique_id/:project_unique_id"
                element={<InvestorDetails />}
              />
              <Route path="documents" element={<MyDocument />} />
              <Route path="manage_lead" element={<ManageLead />} />
              <Route path="upcoming-events" element={<Upcomingevent />} />
              <Route path="upcoming-events/:event_unique_id" element={<UpcommingEventDetails />} />
              <Route path="projects" element={<Projects data={data} />} />
              <Route
                path="flag-project"
                element={<Flagproject data={data} />}
              />
              <Route path="flag-project/:id" element={<Singleproject />} />
              <Route path="new-project" element={<NewProject />} />
              <Route path="projects/:id" element={<Singleproject />} />
              <Route path="ai-assisted" element={<Pitchdeckcreation />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="settings" element={<Settingss />} />
              <Route path="legal-templates" element={<Legaltemplate />} />
              <Route path="e-sign-document" element={<EsignDocumetnt />} />
              <Route path="shared-project/:id" element={<SharedProject />} />
              <Route
                path="opportunity"
                element={<Investor investor={investor} />}
              />
              <Route
                path="agent-assistance"
                element={<Agentassistance investor={investor} />}
              />
              <Route
                path="agent-assistance/agent-profile"
                element={<AgentProfile/>}
              />
              <Route path="messages/:id" element={<Messages />} />
              <Route path="messages" element={<Messages />} />
              <Route path="map/filter_agent" element={<Map />} />
              <Route path="purchase-lead" element={<LeadPurchase />} />
              <Route path="headstaart-team" element={<HeadStartTeam />} />
              <Route
                path="headstaart-services"
                element={<HeasStartServices />}
              />
              <Route path="promote-project" element={<PromoteProject />} />
              <Route path="map/filter_agent/:id" element={<Singleagent />} />
              <Route path="boost-profile" element={<ProfileBoost />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
