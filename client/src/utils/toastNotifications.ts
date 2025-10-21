/**
 * Centralized toast notification utilities
 */
import { toast } from "sonner";

const TOAST_DURATION = 4000;

export const toastSuccess = (message: string, description?: string) => {
  toast(message, {
    description,
    style: {
      background: "#10b981",
      color: "white",
      border: "1px solid #059669",
    },
    duration: TOAST_DURATION,
  });
};

export const toastError = (message: string, description?: string) => {
  toast(message, {
    description,
    style: {
      background: "#dc2626",
      color: "white",
      border: "1px solid #dc2626",
    },
    duration: TOAST_DURATION,
  });
};

export const toastWarning = (message: string, description?: string) => {
  toast(message, {
    description,
    style: {
      background: "#f59e0b",
      color: "white",
      border: "1px solid #d97706",
    },
    duration: TOAST_DURATION,
  });
};

export const toastInfo = (message: string, description?: string) => {
  toast(message, {
    description,
    style: {
      background: "#3b82f6",
      color: "white",
      border: "1px solid #2563eb",
    },
    duration: TOAST_DURATION,
  });
};
