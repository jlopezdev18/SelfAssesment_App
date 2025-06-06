import React, { useState } from "react";
import { FaUser, FaEdit } from "react-icons/fa";

interface SettingsProps {
  darkMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("profile");

  // Example profile data
  const [profile] = useState({
    firstName: "Michael",
    lastName: "Jasparo",
    bio: "Law Officer",
    email: "michaeljasparo@gmail.com",
    phone: "(213) 555-1234",
    address: {
      country: "United state of America",
      city: "California USA",
      postalCode: "ERT 52312",
      taxId: "555-1234",
    },
    company: "Law Office of Michael Jasasic",
    street: "4140 Parker Rd. Allentown",
  });

  const tabs = [
    { key: "profile", label: "My Profile" },
    { key: "security", label: "Security" },
    { key: "teams", label: "Teams" },
    { key: "notifications", label: "Notifications" },
    { key: "billing", label: "Billing" },
    { key: "data", label: "Data Export" },
    { key: "delete", label: "Delete Account" },
  ];

  // Color classes based on darkMode
  const sidebarBg = darkMode ? "bg-gray-900" : "bg-white";
  const sidebarBorder = darkMode ? "border-gray-700" : "border-gray-100";
  const sidebarActive = darkMode
    ? "bg-gradient-to-r from-blue-600/30 to-blue-400/30 text-white shadow"
    : "bg-gradient-to-r from-blue-600/10 to-blue-400/10 text-blue-700 shadow";
  const sidebarInactive = darkMode
    ? "text-white/80 hover:bg-white/5"
    : "text-gray-700 hover:bg-gray-100";
  const contentBg = darkMode ? "bg-gray-900" : "bg-white";
  const sectionBg = darkMode
    ? "bg-gray-800"
    : "bg-gradient-to-br from-blue-50 to-blue-100";
  const sectionBorder = darkMode ? "border-gray-700" : "border-gray-100";
  const headingColor = darkMode ? "text-white" : "text-gray-800";
  const labelColor = darkMode ? "text-gray-400" : "text-gray-500";
  const valueColor = darkMode ? "text-white" : "text-gray-800";
  const editBtn = darkMode
    ? "text-blue-400 border-blue-400 hover:bg-blue-900/20"
    : "text-blue-600 border-blue-300 hover:bg-blue-50";

  // Use the same gradient as the dashboard for the background
  const dashboardGradient = darkMode
    ? "bg-gray-900"
    : "bg-gradient-to-br from-blue-50 to-indigo-100";

  return (
    <div
      className={`flex w-full h-full min-h-screen justify-center items-stretch px-0 py-0 ${dashboardGradient}`}
      style={{ minHeight: "100vh" }}
    >
      <div
        className={`flex flex-row w-full h-full rounded-none ${contentBg} border-0`}
      >
        {/* Sidebar merged */}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-12 h-full min-h-screen overflow-y-auto">
          <h1
            className={`text-4xl font-extrabold mb-8 ${headingColor} tracking-tight`}
          >
            Settings
          </h1>
          {activeTab === "profile" && (
            <div className="flex flex-col gap-10">
              {/* Profile Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                    <FaUser />
                  </div>
                  <div>
                    <div className={`text-2xl font-semibold ${headingColor}`}>
                      {profile.firstName} {profile.lastName}
                    </div>
                    <div className={`text-base font-medium ${labelColor}`}>
                      {profile.company}
                    </div>
                    <div className={`text-sm ${labelColor}`}>
                      {profile.street}
                    </div>
                  </div>
                </div>
                <button
                  className={`flex items-center px-8 py-2 border rounded-lg text-base font-semibold ${editBtn} bg-transparent transition`}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              </div>

              {/* Personal Information */}
              <div
                className={`rounded-xl ${sectionBg} border ${sectionBorder} p-8 mb-2`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`font-semibold text-xl ${headingColor}`}>
                    Personal Information
                  </div>
                  <button
                    className={`flex items-center px-5 py-1 border rounded text-sm ${editBtn} bg-transparent transition`}
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  <div>
                    <div className={`text-xs ${labelColor}`}>First Name</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.firstName}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${labelColor}`}>Last Name</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.lastName}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${labelColor}`}>Bio</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.bio}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${labelColor}`}>Email Address</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.email}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${labelColor}`}>Phone</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div
                className={`rounded-xl ${sectionBg} border ${sectionBorder} p-8`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`font-semibold text-xl ${headingColor}`}>
                    Address
                  </div>
                  <button
                    className={`flex items-center px-5 py-1 border rounded text-sm ${editBtn} bg-transparent transition`}
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  <div>
                    <div className={`text-xs ${labelColor}`}>Country</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.address.country}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${labelColor}`}>City / State</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.address.city}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${labelColor}`}>Bio</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.bio}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${labelColor}`}>Postal Code</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.address.postalCode}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${labelColor}`}>TAX ID</div>
                    <div className={`font-semibold ${valueColor}`}>
                      {profile.address.taxId}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Add more tab content here for other tabs if needed */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
