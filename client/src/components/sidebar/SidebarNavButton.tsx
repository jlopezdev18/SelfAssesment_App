
const SidebarNavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  mutedTextClass: string;
}> = ({
  icon,
  label,
  active,
  onClick,
  sidebarCollapsed,
  darkMode,
  mutedTextClass,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center ${
      sidebarCollapsed ? "justify-center" : "space-x-3"
    } px-3 py-2 rounded-lg text-left transition-colors ${
      active
        ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-medium"
        : `${mutedTextClass} hover:bg-gray-100 ${
            darkMode ? "hover:bg-gray-700" : ""
          }`
    }`}
    title={sidebarCollapsed ? label : ""}
  >
    {icon}
    {!sidebarCollapsed && <span>{label}</span>}
  </button>
);

export default SidebarNavButton;