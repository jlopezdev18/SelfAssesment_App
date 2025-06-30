import React from "react";
import { FaUser, FaEdit } from "react-icons/fa";
import type { ProfileHeaderProps } from "./types/SettingsInterfaces";

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  headingColor,
  labelColor,
  editBtn,
}) => (
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
        <div className={`text-sm ${labelColor}`}>{profile.street}</div>
      </div>
    </div>
    <button
      className={`flex items-center px-8 py-2 border rounded-lg text-base font-semibold ${editBtn} bg-transparent transition`}
    >
      <FaEdit className="mr-2" /> Edit
    </button>
  </div>
);

export default ProfileHeader;
