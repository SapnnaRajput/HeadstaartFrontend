import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
  CalendarClock,
  ChartNoAxesCombined,
  ChartPie,
  CircleUserRound,
  Files,
  Flag,
  HandPlatter,
  LayoutTemplate,
  Mails,
  Receipt,
  Settings,
  ShieldHalf,
  User,
} from "lucide-react";
import img from "../../Assets/Images/pr-1.png";
import img1 from "../../Assets/Images/agent-1.png";
import img2 from "../../Assets/Images/agent-2.png";
import img3 from "../../Assets/Images/agent-3.png";
import img4 from "../../Assets/Images/agent-4.png";
import img5 from "../../Assets/Images/agent-5.png";
import img6 from "../../Assets/Images/agent-6.png";
import Navbar from "../Entrepreneurs/Navbar";
import Sidebar from "../Entrepreneurs/Sidebar";
import Footer from "../Home/Foooter";
import Dashboard from "../Entrepreneurs/Pages/Dashboard";
import MyDocument from "../Entrepreneurs/Pages/MyDocument";
import Upcomingevent from "../Entrepreneurs/Pages/Upcomingevent";
import Subscription from "../Entrepreneurs/Pages/Subscription";
import Settingss from "../Entrepreneurs/Pages/Settings";
import Verification from "../Entrepreneurs/Pages/Verification";
import Legaltemplate from "../Entrepreneurs/Pages/Legaltemplate";
import Opportunity from "./Opportunity/Opportunity";
import Agentassistance from "../Entrepreneurs/Pages/Agentassistance";
import FlagprojectAgent from "./FlagProjectAgent";
import Singleproject from "./SingleProject";
import ServicesAgent from "./ServicesAgent";
import Messages from "../Entrepreneurs/Pages/Messages";
import Featureprojects from "../Agent/FeatureProject";
import ManageLead from "../Entrepreneurs/Pages/ManageLead";
import LeadPurchase from "../Entrepreneurs/Pages/PurchaseLead";
import InvestorOpportunity from "./Opportunity/Investor";
import EnterOpportunity from "./Opportunity/Enterpreneurs";
import SingleFeatureProject from './SingleFeatureProject';
import HeadStartTeam from "../Entrepreneurs/Pages/HeadStartTeam";
import HeasStartServices from '../Entrepreneurs/Pages/HeasStartServices'
import EsignDocumetnt from '../Entrepreneurs/Pages/EsignDocumetnt'
import ContactedInvestor from "./ContactedInvestor";
import { UserState } from "../../context/UserContext";
import SingleEntrepreneur from "../Agent/SingleEntrepreneur"
import axios from "axios";
import UpcommingEventDetails from "../Entrepreneurs/Pages/UpcommingEventDetails";
import EnterpreneurDetails from "./EnterpreneurDetails";
import InvestorDetails from "./InvestorDetails";
import SingleProjectinvestor from './../Investors/SingleProjectinvestor'
import EnterpreneurProfile from "./EnterpreneurProfile";
import SingleProjectDetails from "../Agent/SingleProjectDetails"

const Agent = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [open, setOpen] = useState(false);
  const [count, setCount ] = useState();
  const [hasSubscription, setHasSubscription] = useState(true);
  


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
    try {
      const response = await axios.post(`${baseUrl}/current_subscription`, {
        customer_unique_id: user?.customer?.customer_unique_id
      },{
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
      if (response.data.status) {
        setHasSubscription(true); 
      } else {
        setHasSubscription(false); 
       
      }
    } catch (error) {
      setHasSubscription(false); 
    }
  }

  useEffect(() => {
    getMenuCount();
    subscriptions()
  }, [baseUrl]);

  const toggle = () => {
    setOpen(!open);
  };

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
      activePaths: ['dashboard', 'projects', 'manage_lead', 'feature-projects']
    },
    {
      to: "opportunity",
      name: "Opportunity",
      icon: ChartNoAxesCombined,
      activePaths: [
        "opportunities",
        "entrepreneur-opportunities",
        "investor-opportunities",
      ],
      count: [count?.opportunity_count.entrepreneur_opportunity,count?.opportunity_count.investor_opportunity]
    },

    {
      to: "flag-project",
      name: "Flag Project",
      icon: Flag,
      count:[count?.agent_flag_count.entrepreneur_project_count,count?.agent_flag_count.investor_project_count]
    },
    {
      to: "contacted-investor",
      name: "Investor",
      icon: User,
    },
    {
      to: "services",
      name: "Services",
      icon: HandPlatter,
    },
    // {
    //     to: 'contacted-entrepreneur',
    //     name: 'Contacted Entrepreneur',
    //     icon: CircleUserRound,
    // },
    // {
    //     to: 'contacted-agent',
    //     name: 'Contacted Agent',
    //     icon: CircleUserRound,
    // },
    {
      to: "documents",
      name: "My Documents",
      icon: Files,
    },
    

    {
      to: "upcoming-events",
      name: "Upcoming Events",
      icon: CalendarClock,
      count:[count?.agent_event_count]
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
      activePaths: ['legal-templates', 'e-sign-document',]

    },
    {
      to: "subscription",
      name: "Subscription",
      icon: Receipt,
    },
    {
      to: 'headstaart-team',
      name: 'Headstaart Team',
      icon: ShieldHalf,
      activePaths: ['headstaart-team', 'headstaart-services']
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
      <div
        onClick={toggle}
        className={`fixed bg-black  h-[100vh] mt-[10vh]  z-50 transition-all duration-300 ease-out ${open
            ? "translate-x-0 opacity-50 w-full"
            : "-translate-x-5 opacity-0 w-0"
          }`}
      ></div>
      <div
        className={`fixed h-[100vh] mt-[10vh] z-50 ${open ? "block" : "hidden"
          }`}
      >
        <Sidebar Links={visibleLinks} toggle={toggle} />
      </div>
      <Navbar toggle={toggle} />
      <div className="flex md:ps-0">
        <div className="w-72 transition-all duration-300 ease-in-out flex-shrink-0 sticky top-28 h-full xl:block hidden">
          <Sidebar Links={visibleLinks} />
        </div>
        <div className="w-full">
          <div className="">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="feature-projects" element={<Featureprojects />} />
              <Route path='feature-projects/details' element={<SingleFeatureProject />} />
              <Route path="flag-project" element={<FlagprojectAgent />} />
              <Route path="flag-project/details" element={<Singleproject />} />
              <Route path= "contacted-investor" element={<ContactedInvestor />} />'
              <Route path="services" element={<ServicesAgent />} />
              <Route path="upcoming-events" element={<Upcomingevent />} />
              <Route
                path="upcoming-events/:event_unique_id"
                element={<UpcommingEventDetails/>}
              />
              <Route path="subscription" element={<Subscription />} />
              <Route path="messages" element={<Messages />} />
              <Route path='messages/:id' element={<Messages />} />
              <Route path="settings" element={<Settingss />} />
              <Route path="opportunity" element={<Opportunity />} />
              <Route path='headstaart-team' element={<HeadStartTeam />} />
              <Route path='headstaart-services' element={<HeasStartServices />} />
              <Route path="single-entrepreneur" element={<SingleEntrepreneur/>}/>
              <Route path="single-project-details" element={<SingleProjectDetails/>}/>

              <Route
                path="entrepreneur-opportunities"
                element={<EnterOpportunity />}
              />
              <Route
                path="entrepreneur-profile/:client_unique_id"
                element={<EnterpreneurProfile />}
              />
              <Route
                path="entrepreneur-opportunities/entr/:chat_initiate_id/:client_unique_id/:project_unique_id"
                element={<EnterpreneurDetails />}
              />
               <Route
                path="entrepreneur-opportunities/invest/:chat_initiate_id/:client_unique_id/:project_unique_id"
                element={<InvestorDetails />}
              />
                <Route path="projects/:id" element={<SingleProjectinvestor />} />
              <Route
                path="investor-opportunities"
                element={<InvestorOpportunity />}
              />
              <Route path="manage_lead" element={<ManageLead />} />
              <Route path="purchase-lead" element={<LeadPurchase />} />
              <Route path="legal-templates" element={<Legaltemplate />} />
              <Route path="e-sign-document" element={<EsignDocumetnt />} />
              <Route path="documents" element={<MyDocument />} />
              <Route path="projects/:id" element={<SingleProjectinvestor />} />
              {/* <Route path='documents' element={<Document />} />
                            <Route path='settings/verification' element={<Verification />} />
                            <Route path='investor-approached' element={<Investor investor={investor} />} />
                            <Route path='agent-assistance' element={<Agentassistance investor={investor} />} /> */}
            </Routes>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Agent;
