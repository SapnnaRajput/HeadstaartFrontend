import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Route, Routes } from "react-router-dom";

import {
  BookUser,
  CalendarClock,
  ChartPie,
  UsersRound,
  BadgeDollarSign,
  Flag,
  FolderOpenDot,
  LayoutTemplate,
  LogOut,
  Mails,
  Receipt,
  Settings,
  ShieldHalf,
  DollarSign,
  BadgeCheck,
  HandPlatter,
  FolderGit2,
  Timer
} from "lucide-react";
import Dashboard from "../AdminComponent/AdminDashboard";
import UserManagement from "../AdminComponent/UserManagement";
import Subscription from "../AdminComponent/Subscription";
import ContentModeration from "../AdminComponent/ContentModeration";
import DocumentManagement from "../AdminComponent/DocumentManagement";
import TodoComponent from "../AdminComponent/Todo";
import EventManagement from "../AdminComponent/EventManagement";
import EmailInterface from "../AdminComponent/EmailInterface";
import Category from "../AdminComponent/Category";
import Business from "../AdminComponent/Business";
import Setting from "../AdminComponent/Setting";
import Waitlists from "../AdminComponent/Waitlists";
import ManageSubscriptions from "../AdminComponent/ManageSubscriptions";
import AddEventComponent from '../AdminComponent/AddNewEvent'
import Features from "../AdminComponent/Features";
import AddNewTemplate from "../AdminComponent/AddNewTemplate";
import CreateNewTemplate from "../AdminComponent/CreateLegalTemplate"
import UserDetail from "../AdminComponent/UserDetail";
import Bluetick from "../AdminComponent/Bluetick";
import Headstartservices from "../AdminComponent/Headstartservices";
import Singlecontent from "../AdminComponent/Singlecontent";
import Headstartteam from "../AdminComponent/Headstartteam";
import Blueticksingleuser from "../AdminComponent/Blueticksingleuser";
import Transactions from "../AdminComponent/Transactions";
import { GrTransaction } from "react-icons/gr";
import ManageLeadAdmin from "../AdminComponent/ManageLeadAdmin";
import LeadManage from "../AdminComponent/LeadManage";
import Credentials from "../AdminComponent/Credentials";

const Admin = () => {
  const Links = [
    {
      to: "dashboard",
      name: "Dashboard",
      icon: ChartPie,
    },
    {
      to: "user-manager",
      name: "User Management",
      icon: UsersRound,
    },
    {
      to: "content-moderation",
      name: "Content Moderation",
      icon: FolderGit2,
    },
    {
      to: "manage-subscriptions",
      name: "Manage Subscriptions",
      icon: DollarSign,
    },
    {
      to: "document-management",
      name: "Document",
      icon: FolderOpenDot,
    },
    // {
    //   to: "todo",
    //   name: "Todo",
    //   icon: Receipt,
    // },
    {
      to: "event-management",
      name: "Event",
      icon: LayoutTemplate,
    },
    // {
    //   to: "email-interface",
    //   name: "Email Interface",
    //   icon: Mails,
    // },
    {
      to: "category",
      name: "Category",
      icon: Flag,
    },
    {
      to: "features",
      name: "Features",
      icon: Flag,
    },
    {
      to: "business",
      name: "Business",
      icon: BookUser,
    },
    {
      to: "transactions",
      name: "Transactions",
      icon: GrTransaction,
    },
    {
      to: "blue-tick",
      name: "Bule Tick Request",
      icon: BadgeCheck,
    },
    {
      to: "headstart-service",
      name: "Headstaart Services",
      icon: HandPlatter,
    },
    {
      to: "headstart-team",
      name: "Headstaart Team",
      icon: ShieldHalf,
    },
    {
      to: "lead-manage",
      name: "Lead Manage",
      icon: BadgeDollarSign,
    },
    {
      to: "setting",
      name: "Settings",
      icon: Settings,
    },
    {
      to: "waitlists",
      name: "Waitlists",
      icon: Timer,
    }
  ];

  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      // Check for mobile/tablet sizes
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsExpanded(false);
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsMobile(false);
        setIsExpanded(false);
      } else {
        setIsMobile(false);
        setIsExpanded(true);
      }
    };

    // Initialize on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (window.innerWidth < 1024) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar isExpanded={isExpanded} toggleMenu={toggleMenu} />

      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Desktop Sidebar - Always in document flow */}
        <div
          className={`hidden md:block transition-all duration-300 ease-in-out flex-shrink-0 h-full overflow-y-auto bg-white ${isExpanded ? "w-72" : "w-20"
            }`}
        >
          <Sidebar
            isExpanded={isExpanded}
            toggleMenu={toggleMenu}
            links={Links}
          />
        </div>

        {/* Mobile Sidebar - Fixed position */}
        {isExpanded && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={handleOverlayClick}
            ></div>
            <div
              className={`fixed md:hidden left-0 top-16 bottom-0 z-30 w-64 bg-white overflow-y-auto transition-transform duration-300 ease-in-out ${isExpanded ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <Sidebar
                isExpanded={true}
                toggleMenu={toggleMenu}
                links={Links}
              />
            </div>
          </>
        )}


        <div className="flex-grow bg-gray-100 overflow-y-auto">
          <div className="container mx-auto max-w-full">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user-manager" element={<UserManagement />} />
              <Route path="/user-manager/:userID" element={<UserDetail />} />
              <Route path="/managelead/:customer_unique_id" element={<ManageLeadAdmin />} />
              <Route
                path="/content-moderation"
                element={<ContentModeration />}
              />
              <Route
                path="/content-moderation/:id"
                element={<Singlecontent />}
              />
              <Route path="/category" element={<Category />} />
              <Route
                path="/document-management"
                element={<DocumentManagement />}
              />
              <Route path="/todo" element={<TodoComponent />} />
              <Route path="/add-new-template" element={<AddNewTemplate />} />
              <Route path="/create-legal-template" element={<CreateNewTemplate />} />
              <Route path="/edit-legal-template" element={<CreateNewTemplate />} />
              <Route path='/features' element={<Features />} />
              <Route path="/manage-subscriptions" element={<ManageSubscriptions />} />
              <Route path="/event-management" element={<EventManagement />} />
              <Route path="/add-event" element={<AddEventComponent />} />
              <Route path="/email-interface" element={<EmailInterface />} />
              <Route path="/business" element={<Business />} />
              <Route path="/blue-tick" element={<Bluetick />} />
              <Route path="/blue-tick/user" element={<Blueticksingleuser />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/waitlists" element={<Waitlists />} />
              <Route path="/headstart-team" element={<Headstartteam />} />
              <Route path="/headstart-service" element={<Headstartservices />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/lead-manage" element={<LeadManage />} />
              <Route path="/credentials" element={<Credentials />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;