// Dashboard.tsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { DashboardMain, Downloads, Settings, ClientsDashboard, Versioning } from "./tabs";
import { FaDownload, FaFileAlt, FaCog } from "react-icons/fa";
import { useIsAdmin } from "../../hooks/useIsAdmin";

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { isAdmin } = useIsAdmin();

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

  const bgClass = darkMode
    ? "bg-gray-900"
    : "bg-gradient-to-br from-blue-50 to-indigo-100";
  const cardClass = darkMode ? "bg-gray-800 text-white" : "bg-white";
  const sidebarClass = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const textClass = darkMode ? "text-white" : "text-gray-800";
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <div className="flex h-screen">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
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
                  darkMode={darkMode}
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
                  darkMode={darkMode}
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
                  darkMode={darkMode}
                  isAdmin={isAdmin}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={<Settings darkMode={darkMode} />} 
            />
            <Route 
              path="/clients" 
              element={
                <ClientsDashboard
                  cardClass={cardClass}
                  textClass={textClass}
                  mutedTextClass={mutedTextClass}
                  darkMode={darkMode}
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