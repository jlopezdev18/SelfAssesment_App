// Sidebar.tsx
import React from "react";
import {
  FaChartBar,
  FaDownload,
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
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavItem } from "./NavItem";
import { useNavigate } from "react-router";
interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  mutedTextClass: string;
  textClass: string;
  sidebarClass: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  darkMode,
  mutedTextClass,
  textClass,
  sidebarClass,
}) => {
  const { isAdmin } = useIsAdmin();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const SectionHeader: React.FC<{ title: string }> = ({ title }) =>
    !sidebarCollapsed && (
      <div
        className={`text-xs font-semibold ${mutedTextClass} uppercase tracking-wider mb-3 mt-6 first:mt-0`}
      >
        {title}
      </div>
    );

  return (
    <div
      className={`${
        sidebarCollapsed ? "w-16" : "w-64"
      } ${sidebarClass} border-r transition-all duration-300 flex flex-col relative`}
    >
      {/* Arrow Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 z-10 ${sidebarClass} border`}
      >
        {sidebarCollapsed ? (
          <FaChevronRight className="w-3 h-3" />
        ) : (
          <FaChevronLeft className="w-3 h-3" />
        )}
      </Button>

      <div className="flex-1 p-3">
        {/* Header with logo */}
        <div
          className={`mb-8 mt-8 ${
            sidebarCollapsed ? "w-10" : "w-16"
          } justify-self-center`}
        >
          <img
            src={Logo}
            alt="Self Assessment Logo"
            className={`${sidebarCollapsed ? "w-12 h-12" : "w-16 h-16"}`}
          />
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
              {(
                user?.displayName?.[0] ||
                user?.email?.[0] ||
                "U"
              ).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div>
                <h3 className={`font-semibold ${textClass} text-sm`}>
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </h3>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <SectionHeader title="INFORMATION & RESOURCES" />

          <NavItem
            icon={<FaChartBar className="w-5 h-5 flex-shrink-0" />}
            label="Dashboard"
            path="/dashboard/main"
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
          />

          <NavItem
            icon={<FaTag className="w-5 h-5 flex-shrink-0" />}
            label="Versioning"
            path="/dashboard/versioning"
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
          />

          <NavItem
            icon={<FaDownload className="w-5 h-5 flex-shrink-0" />}
            label="Downloads"
            path="/dashboard/downloads"
            sidebarCollapsed={sidebarCollapsed}
            darkMode={darkMode}
          />

          {isAdmin && (
            <>
              <SectionHeader title="CLIENTS" />
              <NavItem
                icon={<FaUserFriends className="w-5 h-5 flex-shrink-0" />}
                label="Clients"
                path="/dashboard/clients"
                sidebarCollapsed={sidebarCollapsed}
                darkMode={darkMode}
              />
            </>
          )}
        </nav>
      </div>

      {/* Bottom section - Logout */}
      <div className="p-6">
        <Separator className="mb-4" />
        {sidebarCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="w-full h-10 cursor-pointer text-red-500 hover:text-red-500"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Log out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start h-10 text-red-500 cursor-pointer hover:text-red-500"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Log out
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
