import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  sidebarCollapsed: boolean;
  darkMode: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  path,
  sidebarCollapsed,
  darkMode,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  const handleClick = () => {
    navigate(path);
  };

  const buttonContent = (
    <div className={sidebarCollapsed ? "flex justify-center" : ""}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`${
          sidebarCollapsed
            ? "w-10 h-10 p-0" // Remove justify-center from button
            : "w-full h-10 justify-start"
        } transition-colors ${
          isActive
            ? darkMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : darkMode
            ? "hover:bg-gray-700 text-gray-300"
            : "hover:bg-gray-100 text-gray-600"
        }`}
        onClick={handleClick}
      >
        {sidebarCollapsed ? (
          // When collapsed, just show the icon
          icon
        ) : (
          // When expanded, show icon + label with spacing
          <div className="flex items-center space-x-3">
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </div>
        )}
      </Button>
    </div>
  );

  if (sidebarCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
};
