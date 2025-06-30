import React from "react";
import { FaEdit } from "react-icons/fa";
import type { ProfileSectionProps } from "./types/SettingsInterfaces";

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  fields,
  sectionBg,
  sectionBorder,
  headingColor,
  labelColor,
  valueColor,
  editBtn,
}) => (
  <div className={`rounded-xl ${sectionBg} border ${sectionBorder} p-8 mb-2`}>
    <div className="flex items-center justify-between mb-6">
      <div className={`font-semibold text-xl ${headingColor}`}>{title}</div>
      <button
        className={`flex items-center px-5 py-1 border rounded text-sm ${editBtn} bg-transparent transition`}
      >
        <FaEdit className="mr-2" /> Edit
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      {fields.map((field, idx) => (
        <div key={idx}>
          <div className={`text-xs ${labelColor}`}>{field.label}</div>
          <div className={`font-semibold ${valueColor}`}>{field.value}</div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSection;
