// Dashboard.tsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import {
  DashboardMain,
  Downloads,
  Settings,
  ClientsDashboard,
  Versioning,
} from "./tabs";
import { FaDownload, FaFileAlt, FaCog } from "react-icons/fa";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { useThemeStyles } from "@/contexts/ThemeContext";

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
