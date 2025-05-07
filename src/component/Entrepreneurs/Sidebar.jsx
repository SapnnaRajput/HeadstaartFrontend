import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserState } from "../../context/UserContext";
import { LogOut } from "lucide-react";

const Sidebar = ({ Links, toggle }) => {
  const { user, logout } = UserState();

  const isRouteActive = (link, isActive) => {
    const currentPath = window.location.pathname;

    if (link.activePaths) {
      return (
        isActive ||
        currentPath === `/${user.role}` ||
        link.activePaths.some((path) =>
          currentPath.includes(`/${user.role}/${path}`)
        )
      );
    }

    return isActive || currentPath.includes(`/${user.role}/${link.to}`);
  };

  return (
    <div className="bg-white p-2 pb-32 md:pb-16 h-screen fixed shadow-xl border border-gray-100">
      <nav
        className={`h-full flex flex-col ${
          user.role === "entrepreneur" ? "px-3" : "px-2"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-3 space-y-1">
          {Links.map((link, index) => (
            <NavLink
              to={link.to}
              onClick={toggle}
              key={index}
              className={({ isActive }) => `
              ${
                isRouteActive(link, isActive)
                  ? "bg-[#4A3AFF] text-white "
                  : "text-gray-600 hover:bg-gray-300"
              } 
              group flex items-center gap-4 px-4 py-3 rounded-md font-medium 
            `}
            >
              <div>
                <link.icon className="w-6 h-6" />
              </div>
              <span className="transition-colors duration-200 text-base">
                {link.name}
              </span>

            

              {Array.isArray(link.count) && link.count.length > 0 && (
                <div className="ml-auto flex gap-1">
                  {link.count.map(
                    (countItem, i) =>
                      countItem > 0 && (
                        <span
                          key={i}
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            i === 0
                              ? `${user.role === 'agent' ? 'bg-green-100' : 'bg-blue-100'} text-purple-600`
                              : "bg-[#f8d8a4] text-yellow-600" 
                          }`}
                        >
                          {countItem}
                        </span>
                      )
                  )}
                </div>
              )}
            </NavLink>
          ))}
          <NavLink
            onClick={logout}
            className="group mb-2 flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out text-gray-600 hover:bg-red-50 hover:text-red-600 mt-4"
          >
            <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
            <span className="transition-colors duration-200 text-base">
              Logout
            </span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
