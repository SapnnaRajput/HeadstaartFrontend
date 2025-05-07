import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import {
  CalendarClock,
  ChartNoAxesCombined,
  ChartPie,
  CircleUserRound,
  Files,
  Flag,
  FolderKanban,
  LayoutTemplate,
  Mails,
  Receipt,
  Settings,
  ShieldHalf,
} from 'lucide-react';

import img from '../../Assets/Images/pr-1.png';
import img1 from '../../Assets/Images/agent-1.png';
import img2 from '../../Assets/Images/agent-2.png';
import img3 from '../../Assets/Images/agent-3.png';
import img4 from '../../Assets/Images/agent-4.png';
import img5 from '../../Assets/Images/agent-5.png';
import img6 from '../../Assets/Images/agent-6.png';

import Navbar from '../Entrepreneurs/Navbar';
import Sidebar from '../Entrepreneurs/Sidebar';
import Footer from '../Home/Foooter';
import Dashboard from '../Entrepreneurs/Pages/Dashboard';
import MyDocument from '../Entrepreneurs/Pages/MyDocument';
import Upcomingevent from '../Entrepreneurs/Pages/Upcomingevent';
import Subscription from '../Entrepreneurs/Pages/Subscription';
import Settingss from '../Entrepreneurs/Pages/Settings';
import Verification from '../Entrepreneurs/Pages/Verification';
import Legaltemplate from '../Entrepreneurs/Pages/Legaltemplate';
import Investor from '../Entrepreneurs/Pages/Investor';
import Flagproject from '../Entrepreneurs/Pages/Flagproject';
import Singleproject from './SingleProject';
import Featureprojects from '../Entrepreneurs/Pages/Featureprojects';
import ManageLead from '../Entrepreneurs/Pages/ManageLead';
import LeadPurchase from '../Entrepreneurs/Pages/PurchaseLead';
import Messages from '../Entrepreneurs/Pages/Messages';
import Opportunity from './Opportunity';
import HeadStartTeam from '../Entrepreneurs/Pages/HeadStartTeam';
import HeasStartServices from '../Entrepreneurs/Pages/HeasStartServices';
import AgentAssistance from './AgentAssistance';
import SingleProjectinvestor from './SingleProjectinvestor';
import AgentForProject from './AgentForProject';
import AgentWithProject from './AgentWithProject';
import Map from '../Map/Map';
import { UserState } from '../../context/UserContext';
import Singleagent from '../Entrepreneurs/Pages/Singleagent';
import ContactedEntrepreneur from './ContactEntrepreneur';
import EsignDocumetnt from '../Entrepreneurs/Pages/EsignDocumetnt';
import SharedSingleProject from './SharedSingleProject';
import axios from 'axios';
import SingleEntrepreneur from './SingleEntrepreneur';
import UpcommingEventDetails from '../Entrepreneurs/Pages/UpcommingEventDetails';
import OpportunityDetials from './OpportunityDetials';
import EntreprenurProfile from './EntreprenurProfile';
import EntreprenurDetails from './EntreprenurDetails';
import AgentDetails from './AgentDetails';
import EnterpreneurProfile from '../Agent/EnterpreneurProfile';

const Investors = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [open, setOpen] = useState(false);
  const { user } = UserState();
  const [count, setCount] = useState();
    const [hasSubscription, setHasSubscription] = useState(true);

  const location = useLocation();
  const isMapFilterAgentPage =
    location.pathname === `/${user.role}/map/filter_agent`;
  const isShareProjectPage =
    location.pathname == `/${user.role}/shared-project/:id`;

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
        setCount(response.data);
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
      });
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


  const data = [
    {
      img: img,
      title: 'Lorem ipsum dolor',
      text: 'Real Estate',
      status: 'pending',
      Ii: '10',
      views: '30',
      id: 20,
    },
    {
      img: img,
      title: 'Lorem ipsum dolor',
      text: 'Real Estate',
      status: 'pending',
      Ii: '10',
      views: '30',
      id: 20,
    },
    {
      img: img,
      title: 'Lorem ipsum dolor',
      text: 'Real Estate',
      status: 'pending',
      Ii: '10',
      views: '30',
      id: 20,
    },
    {
      img: img,
      title: 'Lorem ipsum dolor',
      text: 'Real Estate',
      status: 'pending',
      Ii: '10',
      views: '30',
      id: 20,
    },
    {
      img: img,
      title: 'Lorem ipsum dolor',
      text: 'Real Estate',
      status: 'pending',
      Ii: '10',
      views: '30',
      id: 20,
    },
    {
      img: img,
      title: 'Lorem ipsum dolor',
      text: 'Real Estate',
      status: 'pending',
      Ii: '10',
      views: '30',
      id: 20,
    },
    {
      img: img,
      title: 'Lorem ipsum dolor',
      text: 'Real Estate',
      status: 'pending',
      Ii: '10',
      views: '30',
      id: 20,
    },
    {
      img: img,
      title: 'Lorem ipsum dolor',
      text: 'Real Estate',
      status: 'pending',
      Ii: '10',
      views: '30',
      id: 20,
    },
  ];

  const investor = [
    {
      img: img1,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img2,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img3,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img4,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img5,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img6,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img1,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img2,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img3,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img4,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img5,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
    {
      img: img6,
      name: 'Jason Price',
      email: 'kuhlman.jermey@yahoo.com',
    },
  ];

  const Links = [
    {
      to: 'dashboard',
      name: 'Dashboard',
      icon: ChartPie,
      activePaths: [
        'dashboard',
        'projects',
        'manage_lead',
        'feature-projects',
        'shared-project',
      ],
    },
    // {
    //     to: 'feature-projects',
    //     name: 'Feature Projects',
    //     icon: FolderKanban,
    // },
    {
      to: 'opportunities',
      name: 'Opportunities',
      icon: ChartNoAxesCombined,
      count: [count?.investor_opportunity_count],
    },
    {
      to: 'flag-project',
      name: 'Flag Project',
      icon: Flag,
      count: [count?.investor_flag_count],
    },
    {
      to: 'contacted_entrepreneur',
      name: 'Entrepreneur ',
      icon: CircleUserRound,
    },
    {
      to: 'agent-assistance',
      name: 'Agent Assistance',
      icon: CircleUserRound,
      activePaths: ['agent-with-project', 'agent-for-project'],
    },
    {
      to: 'documents',
      name: 'Documents',
      icon: Files,
    },
    {
      to: 'legal-templates',
      name: 'Legal Templates',
      icon: LayoutTemplate,
      activePaths: ['legal-templates', 'e-sign-document'],
    },
    {
      to: 'upcoming-events',
      name: 'Upcoming Events',
      icon: CalendarClock,
      count: [count?.investor_event_count],
    },
    {
      to: 'messages',
      name: 'Messages',
      icon: Mails,
    },
    {
      to: 'subscription',
      name: 'Subscription',
      icon: Receipt,
    },
    {
      to: 'headstaart-team',
      name: 'Headstaart Team',
      icon: ShieldHalf,
      activePaths: ['headstaart-team', 'headstaart-services'],
    },
    {
      to: 'settings',
      name: 'Settings',
      icon: Settings,
    },
    // (user?.role === 'agent') && {
    //     to: 'services',
    //     name: 'Services',
    //     icon: HandPlatter,
    // },
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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div
        onClick={toggle}
        className={`fixed bg-black   h-[100vh] mt-[10vh]  z-50 transition-all duration-300 ease-out ${
          open
            ? 'translate-x-0 opacity-50 w-full'
            : '-translate-x-5 opacity-0 w-0'
        }`}
      ></div>
      <div
        className={`fixed h-[100vh] mt-[10vh]  z-50 ${
          open ? 'block' : 'hidden'
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
              <Route path="feature-projects" element={<Featureprojects />} />
              <Route path="projects/:id" element={<SingleProjectinvestor />} />
              <Route
                path="flag-project"
                element={<Flagproject data={data} />}
              />
              <Route path="flag-project/:id" element={<Singleproject />} />
              <Route
                path="shared-project/:id"
                element={<SharedSingleProject />}
              />
              <Route path="documents" element={<MyDocument />} />
              <Route path="upcoming-events" element={<Upcomingevent />} />
              <Route
                path="upcoming-events/:event_unique_id"
                element={<UpcommingEventDetails />}
              />
              <Route path="subscription" element={<Subscription />} />
              <Route path="settings" element={<Settingss />} />
              <Route path="settings/verification" element={<Verification />} />
              <Route path="legal-templates" element={<Legaltemplate />} />
              <Route path="e-sign-document" element={<EsignDocumetnt />} />
              <Route
                path="investor-approached"
                element={<Investor investor={investor} />}
              />
              <Route
                path="single-entrepreneur"
                element={<SingleEntrepreneur />}
              />
              <Route path="agent-assistance" element={<AgentAssistance />} />
              <Route path="manage_lead" element={<ManageLead />} />
              <Route path="purchase-lead" element={<LeadPurchase />} />
              <Route path="headstaart-team" element={<HeadStartTeam />} />
              <Route
                path="headstaart-services"
                element={<HeasStartServices />}
              />
              <Route path="messages" element={<Messages />} />
              <Route path="messages/:id" element={<Messages />} />
              <Route path="opportunities" element={<Opportunity />} />
              <Route
                path="opportunities/:chat_initiate_id/:project_unique_id"
                element={<OpportunityDetials />}
              />
               <Route
                path="opportunities/entrepreneur/:customer_unique_id"
                element={<EntreprenurProfile/>}
              />
              <Route path="agent-with-project" element={<AgentWithProject />} />
              <Route
                path="entrepreneur-profile/:client_unique_id"
                element={<EnterpreneurProfile />}
              />
              <Route path="agent-with-project/:customer_unique_id/:chat_initiate_id" element={<AgentDetails />} />
              <Route path="agent-for-project" element={<AgentForProject />} />
              <Route path="agent-for-project/:customer_unique_id/:chat_initiate_id" element={<AgentDetails />} />
              <Route path="map/filter_agent" element={<Map />} />
              <Route path="map/filter_agent/:id" element={<Singleagent />} />
              <Route
                path="contacted_entrepreneur"
                element={<ContactedEntrepreneur />}
              />
               <Route
                path="contacted_entrepreneur_details"
                element={<EntreprenurDetails />}
              />
            </Routes>
            
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Investors;
