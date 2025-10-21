// Dashboard.tsx
import React, { useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { FaDownload, FaFileAlt, FaCog } from "react-icons/fa";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { useThemeStyles } from "@/contexts/ThemeContext";

const DashboardMain = lazy(() => import("./tabs/main_dashboard/DashboardMain"));
const Downloads = lazy(() => import("./tabs/download_tab/Downloads"));
const Settings = lazy(() => import("./tabs/settings/Settings"));
const ClientsDashboard = lazy(() => import("./tabs/clients_tab/ClientsDashboard"));
const Versioning = lazy(() => import("./tabs/versioning/Versioning"));
const RoleManagement = lazy(() => import("./tabs/role_management/RoleManagement"));

// Loading fallback component with better UX
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300 font-medium">Loading dashboard...</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAdmin } = useIsAdmin();
  const { bgClass, cardClass, sidebarClass, textClass, mutedTextClass, isDarkMode } = useThemeStyles();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "installers":
        return <FaDownload className="w-5 h-5" />;
      case "documents":
        return <FaFileAlt className="w-5 h-5" />;
      case "resources":
        return <FaCog className="w-5 h-5" />;
      default:
        return <FaFileAlt className="w-5 h-5" />;
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <div className="flex h-screen">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mutedTextClass={mutedTextClass}
          textClass={textClass}
          sidebarClass={sidebarClass}
        />
        <div className="flex-1 overflow-auto">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route index element={<Navigate to="main" replace />} />
              <Route
                path="main"
                element={
                  <DashboardMain
                    darkMode={isDarkMode}
                    cardClass={cardClass}
                    textClass={textClass}
                    mutedTextClass={mutedTextClass}
                  />
                }
              />
              <Route
                path="downloads"
                element={
                  <Downloads
                    cardClass={cardClass}
                    textClass={textClass}
                    mutedTextClass={mutedTextClass}
                    darkMode={isDarkMode}
                    getTypeIcon={getTypeIcon}
                  />
                }
              />
              <Route
                path="versioning"
                element={
                  <Versioning
                    cardClass={cardClass}
                    textClass={textClass}
                    mutedTextClass={mutedTextClass}
                    darkMode={isDarkMode}
                    isAdmin={isAdmin}
                  />
                }
              />
              <Route
                path="settings"
                element={<Settings darkMode={isDarkMode} />}
              />
              <Route
                path="clients"
                element={
                  <ClientsDashboard
                    cardClass={cardClass}
                    mutedTextClass={mutedTextClass}
                    darkMode={isDarkMode}
                  />
                }
              />
              <Route
                path="roles"
                element={
                  <RoleManagement
                    textClass={textClass}
                    mutedTextClass={mutedTextClass}
                    darkMode={isDarkMode}
                  />
                }
              />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
