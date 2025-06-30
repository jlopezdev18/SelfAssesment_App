import React from "react";
import type { SettingsSidebarProps } from "./types/SettingsInterfaces";

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  sidebarBg,
  sidebarBorder,
  sidebarActive,
  sidebarInactive,
}) => (
  <div
    className={`w-72 flex-shrink-0 flex flex-col gap-2 h-full min-h-screen p-8 ${sidebarBg} border-r ${sidebarBorder}`}
  >
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`text-left px-5 py-3 rounded-xl font-semibold text-base transition ${
          activeTab === tab.key ? sidebarActive : sidebarInactive
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default SettingsSidebar;
