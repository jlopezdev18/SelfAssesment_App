export interface SettingsProps {
  darkMode: boolean;
}

export interface Profile {
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
  phone: string;
  address: {
    country: string;
    city: string;
    postalCode: string;
    taxId: string;
  };
  company: string;
  street: string;
}

export interface ProfileHeaderProps {
  profile: Profile;
  headingColor: string;
  labelColor: string;
  editBtn: string;
}

export interface ProfileSectionProps {
  title: string;
  fields: { label: string; value: string }[];
  sectionBg: string;
  sectionBorder: string;
  headingColor: string;
  labelColor: string;
  valueColor: string;
  editBtn: string;
}

export interface SettingsSidebarProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  setActiveTab: (key: string) => void;
  sidebarBg: string;
  sidebarBorder: string;
  sidebarActive: string;
  sidebarInactive: string;
}