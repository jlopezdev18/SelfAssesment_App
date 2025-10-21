/**
 * Reusable status badge component
 */
import { STATUS, type Status } from "@/constants";

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case STATUS.ACTIVE:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case STATUS.INACTIVE:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case STATUS.PENDING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses()} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
