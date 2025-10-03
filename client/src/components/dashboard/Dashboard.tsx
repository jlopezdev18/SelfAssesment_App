// Dashboard.tsx
import React, { useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { FaDownload, FaFileAlt, FaCog } from "react-icons/fa";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { useThemeStyles } from "@/contexts/ThemeContext";

// Code splitting with React.lazy()
const DashboardMain = lazy(() => import("./tabs/main_dashboard/DashboardMain"));
const Downloads = lazy(() => import("./tabs/download_tab/Downloads"));
const Settings = lazy(() => import("./tabs/settings/Settings"));
const ClientsDashboard = lazy(() => import("./tabs/clients_tab/ClientsDashboard"));
const Versioning = lazy(() => import("./tabs/versioning/Versioning"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
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
              <Route index element={<Navigate to="dashboard/main" replace />} />
              <Route
                path="/main"
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
                path="/downloads"
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
                path="/versioning"
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
                path="/settings"
                element={<Settings darkMode={isDarkMode} />}
              />
              <Route
                path="/clients"
                element={
                  <ClientsDashboard
                    cardClass={cardClass}
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
