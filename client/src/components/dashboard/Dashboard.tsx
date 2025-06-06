import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { DashboardMain, Downloads, Settings } from "./tabs";
import { FaDownload, FaFileAlt, FaCog } from "react-icons/fa";
import { useDownload } from "../../hooks/useDownloads";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "downloads" | "settings">("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { downloads: downloadItems, loading } = useDownload();

  const categoryData = [
    { name: "Living room", value: 25, color: "#8B5CF6" },
    { name: "Kids", value: 17, color: "#3B82F6" },
    { name: "Office", value: 13, color: "#EF4444" },
    { name: "Bedroom", value: 12, color: "#06B6D4" },
    { name: "Kitchen", value: 9, color: "#8B5CF6" },
    { name: "Bathroom", value: 8, color: "#EC4899" },
    { name: "Dining room", value: 6, color: "#10B981" },
    { name: "Decor", value: 5, color: "#F59E0B" },
    { name: "Lighting", value: 3, color: "#10B981" },
    { name: "Outdoor", value: 2, color: "#84CC16" },
  ];

  const countryData = [
    { country: "Poland", percentage: 19 },
    { country: "Austria", percentage: 15 },
    { country: "Spain", percentage: 13 },
    { country: "Romania", percentage: 12 },
    { country: "France", percentage: 11 },
    { country: "Italy", percentage: 11 },
    { country: "Germany", percentage: 10 },
    { country: "Ukraine", percentage: 9 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "installer":
        return <FaDownload className="w-5 h-5" />;
      case "document":
        return <FaFileAlt className="w-5 h-5" />;
      case "resource":
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
              categoryData={categoryData}
              countryData={countryData}
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
          {activeTab === "settings" && <Settings darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
