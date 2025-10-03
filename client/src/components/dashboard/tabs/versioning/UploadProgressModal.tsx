import React, { useState } from "react";
import {
  X,
  Upload,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileUploadStatus } from "./hooks/useUploadProgress";

interface UploadProgressModalProps {
  isOpen: boolean;
  progress: number;
  currentFile: string | null;
  uploadedFiles: number;
  totalFiles: number;
  bytesTransferred: number;
  totalBytes: number;
  currentFileProgress: number;
  fileStatuses: FileUploadStatus[];
  onCancel: () => void;
  darkMode: boolean;
}

// Helper function to format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  isOpen,
  progress,
  currentFile,
  uploadedFiles,
  totalFiles,
  bytesTransferred,
  totalBytes,
  currentFileProgress,
  fileStatuses,
  onCancel,
  darkMode,
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (!isOpen) return null;

  const isComplete = progress === 100;
  const showMultipleFiles = fileStatuses.length > 1;

  const handleCancelClick = () => {
    if (isComplete) {
      onCancel();
    } else {
      setShowCancelDialog(true);
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onCancel();
  };

  return (
    <>
      {/* Backdrop - Bloquea toda la interacción */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
        {/* Modal */}
        <div
          className={`relative w-full max-w-md mx-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-2xl border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } overflow-hidden`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isComplete ? (
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                  </div>
                )}
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isComplete ? "Upload Complete!" : "Uploading Files..."}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {uploadedFiles} of {totalFiles} files uploaded
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Progress
                </span>
                <span
                  className={`text-sm font-bold ${
                    isComplete
                      ? "text-green-600 dark:text-green-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div
                className={`relative h-3 rounded-full overflow-hidden ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                {/* Progress Bar Fill */}
                <div
                  className={`h-full transition-all duration-300 ease-out ${
                    isComplete
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated Shimmer Effect */}
                  {!isComplete && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  )}
                </div>

                {/* Progress Bar Glow */}
                {!isComplete && (
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-400/50 blur-sm transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            </div>

            {/* Files List */}
            {showMultipleFiles ? (
              <div className="space-y-2">
                {fileStatuses.map((file, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {file.status === "pending" && (
                        <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      {file.status === "uploading" && (
                        <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
                      )}
                      {file.status === "completed" && (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            darkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {file.fileName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {file.status === "pending" && (
                            <p
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Waiting...
                            </p>
                          )}
                          {file.status === "uploading" && (
                            <>
                              <p
                                className={`text-xs ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {formatBytes(file.bytesTransferred)} /{" "}
                                {formatBytes(file.totalBytes)}
                              </p>
                              {file.totalBytes > 0 && (
                                <span
                                  className={`text-xs font-semibold ${
                                    darkMode ? "text-blue-400" : "text-blue-600"
                                  }`}
                                >
                                  ({Math.round(file.progress)}%)
                                </span>
                              )}
                            </>
                          )}
                          {file.status === "completed" && (
                            <p
                              className={`text-xs ${
                                darkMode ? "text-green-400" : "text-green-600"
                              }`}
                            >
                              Uploaded successfully
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Single File Display */
              currentFile && (
                <div
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700/50 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {!isComplete && (
                      <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
                    )}
                    {isComplete && (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {currentFile}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {isComplete
                            ? "Uploaded successfully"
                            : `${formatBytes(bytesTransferred)} / ${formatBytes(
                                totalBytes
                              )}`}
                        </p>
                        {!isComplete && totalBytes > 0 && (
                          <span
                            className={`text-xs font-semibold ${
                              darkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
                            ({Math.round(currentFileProgress)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Warning Message */}
            {!isComplete && (
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  darkMode
                    ? "bg-yellow-900/20 border-yellow-600 text-yellow-300"
                    : "bg-yellow-50 border-yellow-400 text-yellow-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Please wait</p>
                    <p className="text-xs mt-1">
                      Do not close this window or navigate away until the upload
                      is complete.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`px-6 py-4 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex justify-end">
              {!isComplete ? (
                <Button
                  variant="destructive"
                  onClick={handleCancelClick}
                  className="px-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Upload
                </Button>
              ) : (
                <Button
                  onClick={handleCancelClick}
                  className="px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog - Higher z-index */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCancelDialog(false)}
          />
          <div
            className={`relative w-full max-w-md mx-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-xl shadow-2xl border p-6 z-[151]`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Cancel Upload?
                </h3>
              </div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Are you sure you want to cancel the upload? All progress will be
                lost and you'll need to start over.
              </p>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  className={
                    darkMode
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600"
                      : ""
                  }
                >
                  Continue Uploading
                </Button>
                <Button
                  onClick={confirmCancel}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Cancel Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

export default UploadProgressModal;
