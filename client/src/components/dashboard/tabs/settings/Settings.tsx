import React, { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import ProfileHeader from "./ProfileHeader";
import ProfileSection from "./ProfileSection";
import type { SettingsProps, Profile } from "./types/SettingsInterfaces";

const Settings: React.FC<SettingsProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("profile");

  // Example profile data
  const [profile] = useState<Profile>({
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
        <SettingsSidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarBg={sidebarBg}
          sidebarBorder={sidebarBorder}
          sidebarActive={sidebarActive}
          sidebarInactive={sidebarInactive}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-12 h-full min-h-screen overflow-y-auto">
          <h1
            className={`text-4xl font-extrabold mb-8 ${headingColor} tracking-tight`}
          >
            Settings
          </h1>
          {activeTab === "profile" && (
            <div className="flex flex-col gap-10">
              <ProfileHeader
                profile={profile}
                headingColor={headingColor}
                labelColor={labelColor}
                editBtn={editBtn}
              />
              <ProfileSection
                title="Personal Information"
                fields={[
                  { label: "First Name", value: profile.firstName },
                  { label: "Last Name", value: profile.lastName },
                  { label: "Bio", value: profile.bio },
                  { label: "Email Address", value: profile.email },
                  { label: "Phone", value: profile.phone },
                ]}
                sectionBg={sectionBg}
                sectionBorder={sectionBorder}
                headingColor={headingColor}
                labelColor={labelColor}
                valueColor={valueColor}
                editBtn={editBtn}
              />
              <ProfileSection
                title="Address"
                fields={[
                  { label: "Country", value: profile.address.country },
                  { label: "City / State", value: profile.address.city },
                  { label: "Bio", value: profile.bio },
                  { label: "Postal Code", value: profile.address.postalCode },
                  { label: "TAX ID", value: profile.address.taxId },
                ]}
                sectionBg={sectionBg}
                sectionBorder={sectionBorder}
                headingColor={headingColor}
                labelColor={labelColor}
                valueColor={valueColor}
                editBtn={editBtn}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
