import React from "react";
import {
  FaTimes,
  FaSpinner,
  FaFile,
  FaTimesCircle,
  FaFileUpload,
} from "react-icons/fa";
import type { DownloadItem } from "./types/DownloadInterfaces";

interface AddDownloadModalProps {
  open: boolean;
  onClose: () => void;
  newItem: DownloadItem;
  setNewItem: (item: DownloadItem) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  uploading: boolean;
  uploadError: string | null;
  onAdd: () => void;
  textClass: string;
  cardClass: string;
  darkMode: boolean;
}

const AddDownloadModal: React.FC<AddDownloadModalProps> = ({
  open,
  onClose,
  newItem,
  setNewItem,
  file,
  setFile,
  uploading,
  uploadError,
  onAdd,
  textClass,
  cardClass,
  darkMode,
}) => {
  const showHashes =
    newItem.type === "installers" || newItem.type === "updates";

  if (!open) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div
        className={`${cardClass} rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${textClass}`}>Add New File</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
              disabled={uploading}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-5">
            {/* Type */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>
                Type *
              </label>
              <select
                value={newItem.type}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    type: e.target.value as
                      | "installers"
                      | "documents"
                      | "resources"
                      | "updates",
                  })
                }
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors appearance-none cursor-pointer ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
                disabled={uploading}
              >
                <option value="installers">Installer</option>
                <option value="documents">Document</option>
                <option value="resources">Resource</option>
                <option value="updates">Update</option>
              </select>
            </div>
            {showHashes && (
              <div className="space-y-4">
                <label className={`block text-sm font-medium ${textClass}`}>
                  File Hashes
                </label>
                {["SHA512", "SHA384", "SHA256"].map((algorithm) => (
                  <div key={algorithm}>
                    <label
                      className={`block text-xs font-medium ${textClass} mb-1`}
                    >
                      {algorithm}
                    </label>
                    <input
                      type="text"
                      value={
                        newItem.hashes?.find((h) => h.algorithm === algorithm)
                          ?.hash || ""
                      }
                      onChange={(e) => {
                        const newHashes = [...(newItem.hashes || [])];
                        const index = newHashes.findIndex(
                          (h) => h.algorithm === algorithm
                        );
                        if (index >= 0) {
                          newHashes[index] = {
                            ...newHashes[index],
                            hash: e.target.value,
                          };
                        } else {
                          newHashes.push({ algorithm, hash: e.target.value });
                        }
                        setNewItem({
                          ...newItem,
                          hashes: newHashes,
                        });
                      }}
                      className={`w-full px-4 py-2.5 rounded-lg border font-mono text-sm transition-colors ${
                        darkMode
                          ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder={`Enter ${algorithm} hash`}
                      disabled={uploading}
                    />
                  </div>
                ))}
              </div>
            )}
            {/* File */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>
                Upload File *
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-4 pb-4 border-2 border-dashed rounded-lg relative transition-colors ${
                  darkMode
                    ? "border-gray-600 hover:border-gray-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {file ? (
                  <div className="relative w-full">
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-800" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FaFile
                          className={`w-8 h-8 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${textClass}`}
                          >
                            {file.name}
                          </p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className={`p-1 rounded-full transition-colors ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                          }`}
                          disabled={uploading}
                        >
                          <FaTimesCircle className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-center py-5">
                    <FaFileUpload
                      className={`mx-auto h-10 w-10 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <div className={`flex text-sm justify-center ${textClass}`}>
                      <label
                        className={`relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none`}
                      >
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="*"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          disabled={uploading}
                        />
                      </label>
                      <p className={`pl-1 ${textClass}`}>or drag and drop</p>
                    </div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      EXE, PDF, DOC, DOCX up to 100MB
                    </p>
                  </div>
                )}
              </div>
              {uploadError && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {uploadError}
                </div>
              )}
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <FaSpinner className="animate-spin" /> Uploading file...
              </div>
            )}
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className={`flex-1 py-2.5 px-4 rounded-lg border font-medium transition-colors ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={uploading || !file}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {uploading ? (
                <span className="flex items-center gap-2 justify-center">
                  <FaSpinner className="animate-spin" /> Uploading...
                </span>
              ) : (
                "Add File"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDownloadModal;
