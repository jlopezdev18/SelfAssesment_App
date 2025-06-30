import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { DashboardMain, Downloads, Settings, ClientsDashboard, Versioning } from "./tabs";
import { FaDownload, FaFileAlt, FaCog } from "react-icons/fa";
import { useDownload } from "../../hooks/useDownloads";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "downloads" | "settings" | "versioning" | "clients">("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { downloads: downloadItems, loading } = useDownload();


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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mutedTextClass={mutedTextClass}
          textClass={textClass}
          sidebarClass={sidebarClass}
        />
        <div className="flex-1 overflow-auto">
          {activeTab === "dashboard" && (
            <DashboardMain
              darkMode={darkMode}
              cardClass={cardClass}
              textClass={textClass}
              mutedTextClass={mutedTextClass}
            />
          )}
          {activeTab === "downloads" && (
            loading ? (
              <div className="p-6 text-center text-gray-500">Loading resources...</div>
            ) : (
              <Downloads
                downloadItems={downloadItems}
                cardClass={cardClass}
                textClass={textClass}
                mutedTextClass={mutedTextClass}
                darkMode={darkMode}
                getTypeIcon={getTypeIcon}
              />
            )
          )}
          {activeTab === "versioning" && (
            <Versioning
              cardClass={cardClass}
              textClass={textClass}
              mutedTextClass={mutedTextClass}
              darkMode={darkMode}
            />
          )}
          {activeTab === "settings" && <Settings darkMode={darkMode} />}
          {activeTab === "clients" && (
            <ClientsDashboard
              cardClass={cardClass}
              textClass={textClass}
              mutedTextClass={mutedTextClass}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
