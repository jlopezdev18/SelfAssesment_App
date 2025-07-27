import { FaTimes, FaSave } from "react-icons/fa";
import type { VersionFormData } from "./types/VersioningInterfaces";
import { useState } from "react";

interface VersionFormProps {
  darkMode: boolean;
  textClass: string;
  mutedTextClass: string;
  formData: VersionFormData;
  setFormData: React.Dispatch<React.SetStateAction<VersionFormData>>;
  setSelectedInstallerFile: (file: File | null) => void;
  setSelectedUpdateFile: (file: File | null) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isEdit: boolean;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const VersionForm: React.FC<VersionFormProps> = ({
  darkMode,
  textClass,
  mutedTextClass,
  formData,
  setFormData,
  setSelectedInstallerFile,
  setSelectedUpdateFile,
  onCancel,
  onSubmit,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const isInstallerReady =
    !!formData.files.installer.filename && !!formData.files.installer.size;
  const isUpdateReady =
    !!formData.files.update.filename && !!formData.files.update.size;
  const isSaveDisabled = !isInstallerReady && !isUpdateReady;

  const handleVersionChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      await onSubmit();
    } finally {
      setIsUploading(false);
    }
  };

  const handleHashChange = (
    fileType: "installer" | "update",
    algorithm: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: {
          ...prev.files[fileType],
          hashes: prev.files[fileType].hashes.map((h) =>
            h.algorithm === algorithm ? { ...h, hash: value } : h
          ),
        },
      },
    }));
  };

  const handleFileInfo = (fileType: "installer" | "update", file: File) => {
    setFormData((prev: VersionFormData) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: {
          ...prev.files[fileType],
          filename: file.name,
          size: formatBytes(file.size),
          downloadId: prev.files[fileType].downloadId,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Version Info */}
      <div
        className={`p-6 rounded-lg border ${
          darkMode
            ? "border-gray-600 bg-gray-700"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <h4 className={`text-lg font-semibold ${textClass} mb-4`}>
          Version Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Version
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => handleVersionChange("version", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300"
              }`}
              placeholder="e.g., 1.5.0"
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Release Type
            </label>
            <input
              type="text"
              value={formData.releaseType}
              onChange={(e) =>
                handleVersionChange("releaseType", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300"
              }`}
              placeholder="e.g., Q3 2024 Release"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                handleVersionChange("description", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300"
              }`}
              rows={3}
              placeholder="Enter version description"
              required
            />
          </div>
        </div>
      </div>

      {/* Installer File */}
      <div
        className={`p-6 rounded-lg border ${
          darkMode
            ? "border-gray-600 bg-gray-700"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <h4 className={`text-lg font-semibold ${textClass} mb-4`}>
          Installer File
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Upload Installer
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".exe,.zip,.msi"
                id="installer-upload"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedInstallerFile(e.target.files[0]);
                    handleFileInfo("installer", e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="installer-upload"
                className={`px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600`}
              >
                Choose File
              </label>
              {formData.files.installer.filename && (
                <div className="text-xs">
                  <span className="font-semibold">Filename:</span>{" "}
                  {formData.files.installer.filename}
                  {" | "}
                  <span className="font-semibold">Size:</span>{" "}
                  {formData.files.installer.size}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        files: {
                          ...prev.files,
                          installer: {
                            ...prev.files.installer,
                            filename: "",
                            size: "",
                          },
                        },
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className={`block text-sm font-medium ${textClass} mb-2`}>
            File Hashes
          </label>
          {formData.files.installer.hashes.map((hashObj) => (
            <div key={hashObj.algorithm} className="mb-2">
              <label
                className={`block text-xs font-medium ${mutedTextClass} mb-1`}
              >
                {hashObj.algorithm}
              </label>
              <input
                type="text"
                value={hashObj.hash}
                onChange={(e) =>
                  handleHashChange(
                    "installer",
                    hashObj.algorithm,
                    e.target.value
                  )
                }
                className={`w-full px-3 py-2 border rounded-md font-mono text-sm ${
                  darkMode
                    ? "bg-gray-600 border-gray-500 text-white"
                    : "bg-white border-gray-300"
                }`}
                placeholder={`Enter ${hashObj.algorithm} hash`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Update File */}
      <div
        className={`p-6 rounded-lg border ${
          darkMode
            ? "border-gray-600 bg-gray-700"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <h4 className={`text-lg font-semibold ${textClass} mb-4`}>
          Update File
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Upload Update
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".exe,.zip,.msi"
                id="update-upload"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedUpdateFile(e.target.files[0]);
                    handleFileInfo("update", e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="update-upload"
                className={`px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600`}
              >
                Choose File
              </label>
              {formData.files.update.filename && (
                <div className="text-xs">
                  <span className="font-semibold">Filename:</span>{" "}
                  {formData.files.update.filename}
                  {" | "}
                  <span className="font-semibold">Size:</span>{" "}
                  {formData.files.update.size}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        files: {
                          ...prev.files,
                          update: {
                            ...prev.files.update,
                            filename: "",
                            size: "",
                          },
                        },
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className={`block text-sm font-medium ${textClass} mb-2`}>
            File Hashes
          </label>
          {formData.files.update.hashes.map((hashObj) => (
            <div key={hashObj.algorithm} className="mb-2">
              <label
                className={`block text-xs font-medium ${mutedTextClass} mb-1`}
              >
                {hashObj.algorithm}
              </label>
              <input
                type="text"
                value={hashObj.hash}
                onChange={(e) =>
                  handleHashChange("update", hashObj.algorithm, e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md font-mono text-sm ${
                  darkMode
                    ? "bg-gray-600 border-gray-500 text-white"
                    : "bg-white border-gray-300"
                }`}
                placeholder={`Enter ${hashObj.algorithm} hash`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className={`px-4 py-2 rounded-md border ${
            darkMode
              ? "border-gray-500 text-gray-300 hover:bg-gray-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FaTimes className="w-4 h-4 mr-2 inline" />
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isSaveDisabled}
        >
          {isUploading ? (
            <span>
              <svg
                className="animate-spin h-4 w-4 mr-2 inline"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Uploading...
            </span>
          ) : (
            <>
              <FaSave className="w-4 h-4 mr-2 inline" />
              Save Version
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VersionForm;
