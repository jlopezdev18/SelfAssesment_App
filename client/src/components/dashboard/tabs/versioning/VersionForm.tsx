import { FaTimes, FaSave } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/config"; // Ajusta la ruta según tu estructura

interface VersionFormProps {
  darkMode: boolean;
  textClass: string;
  mutedTextClass: string;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onCancel: () => void;
  onSubmit: () => void;
  handleFileUpload: (
    fileType: "installer" | "update",
    file: File
  ) => Promise<void>;
  handleHashChange: (
    fileType: "installer" | "update",
    algorithm: string,
    value: string
  ) => void;
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
  onCancel,
  onSubmit,
}) => {
  const handleVersionChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleFileUpload = async (
    fileType: "installer" | "update",
    file: File
  ) => {
    const folder = fileType === "installer" ? "installers" : "updates";
    const storageRef = ref(storage, `downloads/${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    setFormData((prev: any) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: {
          ...prev.files[fileType],
          filename: file.name,
          size: formatBytes(file.size),
          downloadUrl: url,
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
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Upload Installer
            </label>
            <input
              type="file"
              accept=".exe,.zip,.msi"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  await handleFileUpload("installer", e.target.files[0]);
                }
              }}
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
            {/* Mostrar info solo si existe */}
            {formData.files.installer.filename && (
              <div className="mt-2 text-xs">
                <div>
                  <span className="font-semibold">Filename:</span>{" "}
                  {formData.files.installer.filename}
                </div>
                <div>
                  <span className="font-semibold">Size:</span>{" "}
                  {formData.files.installer.size}
                </div>
                <div>
                  <span className="font-semibold">Download URL:</span>{" "}
                  <a
                    href={formData.files.installer.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {formData.files.installer.downloadUrl}
                  </a>
                </div>
              </div>
            )}
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
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Upload Update
            </label>
            <input
              type="file"
              accept=".exe,.zip,.msi"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  await handleFileUpload("update", e.target.files[0]);
                }
              }}
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
            {/* Mostrar info solo si existe */}
            {formData.files.update.filename && (
              <div className="mt-2 text-xs">
                <div>
                  <span className="font-semibold">Filename:</span>{" "}
                  {formData.files.update.filename}
                </div>
                <div>
                  <span className="font-semibold">Size:</span>{" "}
                  {formData.files.update.size}
                </div>
                <div>
                  <span className="font-semibold">Download URL:</span>{" "}
                  <a
                    href={formData.files.update.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {formData.files.update.downloadUrl}
                  </a>
                </div>
              </div>
            )}
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
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaSave className="w-4 h-4 mr-2 inline" />
          Save Version
        </button>
      </div>
    </div>
  );
};

export default VersionForm;