import React, { useState } from "react";
import {
  Search,
  Star,
  Inbox,
  Send,
  File,
  AlertTriangle,
  Bell,
  Trash2,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EmailInterface = () => {
  const [emails, setEmails] = useState([
    {
      id: 1,
      sender: "Juliu Jalal",
      subject: "Our Bachelor of Commerce program is ACBSP-accredited.",
      tag: "Entrepreneur",
      tagColor: "bg-emerald-100 text-emerald-700",
      time: "8:38 AM",
      starred: false,
      selected: false,
    },
    {
      id: 2,
      sender: "Minerva Barnett",
      subject: "Get Best Advertiser In Your Side Pocket",
      tag: "Work",
      tagColor: "bg-orange-100 text-orange-700",
      time: "8:13 AM",
      starred: false,
      selected: false,
    },
    {
      id: 3,
      sender: "Peter Lewis",
      subject: "Vacation Home Rental Success",
      tag: "Friends",
      tagColor: "bg-pink-100 text-pink-700",
      time: "7:52 PM",
      starred: false,
      selected: false,
    },
  ]);

  const [selectedFolder, setSelectedFolder] = useState("Inbox");

  const folders = [
    { name: "Inbox", icon: Inbox, count: 1253 },
    { name: "Starred", icon: Star, count: 245 },
    { name: "Sent", icon: Send, count: 24532 },
    { name: "Draft", icon: File, count: "09" },
    { name: "Spam", icon: AlertTriangle, count: 14 },
    { name: "Important", icon: Bell, count: 18 },
    { name: "Bin", icon: Trash2, count: 9 },
  ];

  const labels = [
    { name: "Primary", color: "bg-cyan-100" },
    { name: "Social", color: "bg-blue-100" },
    { name: "Work", color: "bg-orange-100" },
  ];

  const toggleStar = (emailId) => {
    setEmails(
      emails.map((email) =>
        email.id === emailId ? { ...email, starred: !email.starred } : email
      )
    );
  };

  const toggleSelect = (emailId) => {
    setEmails(
      emails.map((email) =>
        email.id === emailId ? { ...email, selected: !email.selected } : email
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Inbox</h1>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 mb-6 transition-colors">
          <Plus size={20} />
          Compose
        </button>

        <div className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => setSelectedFolder(folder.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === folder.name
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <folder.icon size={18} />
                <span>{folder.name}</span>
              </div>
              <span className="text-sm text-gray-500">{folder.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3 px-3">Label</h2>
          <div className="space-y-1">
            {labels.map((label) => (
              <div
                key={label.name}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <div className={`w-3 h-3 rounded-full ${label.color}`} />
                <span className="text-gray-700">{label.name}</span>
              </div>
            ))}
            <button className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg w-full">
              <Plus size={18} />
              Create New Label
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search mail"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2">
                All Users
                <ChevronDown size={20} />
              </div>
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-auto">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-200 cursor-pointer ${
                email.selected ? "bg-blue-50" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={email.selected}
                onChange={() => toggleSelect(email.id)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <button
                onClick={() => toggleStar(email.id)}
                className={`p-1 rounded-full hover:bg-gray-200 ${
                  email.starred ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                <Star size={20} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {email.sender}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${email.tagColor}`}
                  >
                    {email.tag}
                  </span>
                </div>
                <p className="text-gray-600 truncate">{email.subject}</p>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {email.time}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">Showing 1-12 of 1,253</span>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailInterface;
