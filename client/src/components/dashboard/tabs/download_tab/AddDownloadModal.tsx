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
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${cardClass} rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${textClass}`}>Add New Item</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } transition-colors`}
              disabled={uploading}
            >
              <FaTimes className={`w-5 h-5 ${textClass}`} />
            </button>
          </div>
          <div className="space-y-4">
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
                      | "resources",
                  })
                }
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
                      className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-200 text-gray-800"
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      placeholder={`Enter ${algorithm} hash`}
                      disabled={uploading}
                    />
                  </div>
                ))}
              </div>
            )}
            {/* File */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>
                Upload File *
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-3 pb-3 border-2 border-dashed rounded-lg relative ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                }`}
              >
                {file ? (
                  <div className="relative w-full">
                    <div
                      className={`p-4 rounded ${
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
                          className={`p-1 rounded-full hover:bg-gray-200 ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                          }`}
                        >
                          <FaTimesCircle className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-center py-3">
                    <FaFileUpload
                      className={`mx-auto h-8 w-8 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <div className={`flex text-sm ${textClass}`}>
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
                <div className="mt-2 text-sm text-red-600">{uploadError}</div>
              )}
            </div>
            {uploadError && (
              <div className="text-red-600 text-sm">{uploadError}</div>
            )}
            {uploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <FaSpinner className="animate-spin" /> Uploading...
              </div>
            )}
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } transition-colors`}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={uploading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" /> Uploading...
                </span>
              ) : (
                "Add Item"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDownloadModal;
