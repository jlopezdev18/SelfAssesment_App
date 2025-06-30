import React from "react";
import {
  FaChartBar,
  FaDownload,
  FaFileAlt,
  FaDollarSign,
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaUserFriends,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import Logo from "/assets/Logo.svg";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import SidebarNavButton from "./SidebarNavButton";

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  activeTab: "dashboard" | "downloads" | "settings" | "versioning" | "clients";
  setActiveTab: (
    tab: "dashboard" | "downloads" | "settings" | "versioning" | "clients"
  ) => void;
  mutedTextClass: string;
  textClass: string;
  sidebarClass: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  mutedTextClass,
  textClass,
  sidebarClass,
}) => {
  const isAdmin = useIsAdmin();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div
      className={`${
        sidebarCollapsed ? "w-16" : "w-64"
      } ${sidebarClass} border-r transition-all duration-300 flex flex-col relative`}
    >
      {/* Arrow Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 ${sidebarClass} border rounded-full flex items-center justify-center z-10 hover:shadow-lg transition-all duration-300 ${
          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
        }`}
        style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}
      >
        {sidebarCollapsed ? (
          <FaChevronRight className={`w-3 h-3 ${textClass}`} />
        ) : (
          <FaChevronLeft className={`w-3 h-3 ${textClass}`} />
        )}
      </button>

      <div className="flex-1 p-6">
        {/* Header with logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center justify-center">
            <img
              src={Logo}
              alt="Self Assessment Logo"
              className="w-12 h-12"
              style={{ minWidth: 48, minHeight: 48, width: 48, height: 48 }}
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="mb-8">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)",
              }}
            >
              HN
            </div>
            {!sidebarCollapsed && (
              <div>
                <h3 className={`font-semibold ${textClass}`}>Harper Nelson</h3>
                <p className={`text-sm ${mutedTextClass}`}>Admin Manager</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {!sidebarCollapsed && (
            <div
              className={`text-xs font-semibold ${mutedTextClass} uppercase tracking-wider mb-3`}
            >
              INFORMATION & RESOURCES
            </div>
          )}

          <SidebarNavButton
            icon={<FaChartBar className="w-5 h-5 flex-shrink-0" />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
            mutedTextClass={mutedTextClass}
          />

          <SidebarNavButton
            icon={<FaTag className="w-5 h-5 flex-shrink-0" />}
            label="Versioning"
            active={activeTab === "versioning"}
            onClick={() => setActiveTab("versioning")}
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
            mutedTextClass={mutedTextClass}
          />

          <SidebarNavButton
            icon={<FaDownload className="w-5 h-5 flex-shrink-0" />}
            label="Downloads"
            active={activeTab === "downloads"}
            onClick={() => setActiveTab("downloads")}
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
            mutedTextClass={mutedTextClass}
          />

          {isAdmin && !sidebarCollapsed && (
            <div
              className={`text-xs font-semibold ${mutedTextClass} uppercase tracking-wider mb-3 mt-6`}
            >
              CLIENTS
            </div>
          )}
          {isAdmin && (
            <SidebarNavButton
              icon={<FaUserFriends className="w-5 h-5 flex-shrink-0" />}
              label="Clients"
              active={activeTab === "clients"}
              onClick={() => setActiveTab("clients")}
              sidebarCollapsed={sidebarCollapsed}
              darkMode={darkMode}
              mutedTextClass={mutedTextClass}
            />
          )}

          {!sidebarCollapsed && (
            <div
              className={`text-xs font-semibold ${mutedTextClass} uppercase tracking-wider mb-3 mt-6`}
            >
              PAYMENTS
            </div>
          )}

          <SidebarNavButton
            icon={<FaFileAlt className="w-5 h-5 flex-shrink-0" />}
            label="Ledger"
            active={false}
            onClick={() => {}}
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
            mutedTextClass={mutedTextClass}
          />

          <SidebarNavButton
            icon={<FaDollarSign className="w-5 h-5 flex-shrink-0" />}
            label="Taxes"
            active={false}
            onClick={() => {}}
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
            mutedTextClass={mutedTextClass}
          />

          {!sidebarCollapsed && (
            <div
              className={`text-xs font-semibold ${mutedTextClass} uppercase tracking-wider mb-3 mt-6`}
            >
              SYSTEM
            </div>
          )}

          <SidebarNavButton
            icon={<FaCog className="w-5 h-5 flex-shrink-0" />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
            mutedTextClass={mutedTextClass}
          />

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center ${
              sidebarCollapsed ? "justify-center" : "justify-between"
            } px-3 py-2 rounded-lg text-left transition-colors ${mutedTextClass} hover:bg-gray-100 ${
              darkMode ? "hover:bg-gray-700" : ""
            }`}
            title={sidebarCollapsed ? "Dark mode" : ""}
          >
            <div
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              {darkMode ? (
                <FaSun className="w-5 h-5 flex-shrink-0" />
              ) : (
                <FaMoon className="w-5 h-5 flex-shrink-0" />
              )}
              {!sidebarCollapsed && <span>Dark mode</span>}
            </div>
            {!sidebarCollapsed && (
              <div
                className={`w-10 h-6 rounded-full ${
                  darkMode ? "bg-blue-500" : "bg-gray-300"
                } relative transition-colors`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    darkMode ? "translate-x-5" : "translate-x-1"
                  }`}
                ></div>
              </div>
            )}
          </button>
        </nav>
      </div>

      {/* Bottom section - Logout */}
      <div
        className={`p-6 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            sidebarCollapsed ? "justify-center" : "space-x-3"
          } px-3 py-2 rounded-lg text-left transition-colors ${mutedTextClass} hover:bg-gray-100 ${
            darkMode ? "hover:bg-gray-700" : ""
          }`}
          title={sidebarCollapsed ? "Log out" : ""}
        >
          <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;