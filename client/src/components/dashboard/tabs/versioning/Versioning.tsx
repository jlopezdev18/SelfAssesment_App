import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import {
  FaShieldAlt,
  FaTag,
  FaCalendarAlt,
  FaInfoCircle,
  FaPlus,
  FaDownload,
  FaEdit,
  FaFileAlt,
} from "react-icons/fa";
import VersionForm from "./VersionForm";
import type { VersioningProps } from "./types/VersioningInterfaces";
import { useLatestVersion } from "./hooks/useLatestVersion";
import Swal from "sweetalert2";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebase/config";

interface FileProps {
  id: string;
  filename: string;
  type: "installer" | "update";
  size: string;
  downloadUrl: string;
  hashes: { algorithm: string; hash: string }[];
  downloadId: string;
}

const EnhancedVersioning: React.FC<VersioningProps> = ({
  darkMode,
  cardClass,
  textClass,
  mutedTextClass,
  isAdmin,
}) => {
  const {
    data: versionData,
    loading,
    addVersion,
    updateVersion,
  } = useLatestVersion();
  const [copiedHash, setCopiedHash] = useState("");
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedInstallerFile, setSelectedInstallerFile] =
    useState<File | null>(null);
  const [selectedUpdateFile, setSelectedUpdateFile] = useState<File | null>(
    null
  );

  // Local files state to avoid losing focus on edit
  const [files, setFiles] = useState<FileProps[]>([]);
  useEffect(() => {
    if (versionData?.files) {
      setFiles(
        versionData.files.map((file) => ({
          ...file,
          type: file.type === "installer" ? "installer" : "update",
          downloadId: file.downloadId ?? "",
        }))
      );
    }
  }, [versionData]);

  // Unified form state for version and files
  const [formData, setFormData] = useState({
    version: "",
    releaseDate: "",
    releaseType: "",
    description: "",
    files: {
      installer: {
        filename: "",
        type: "installer" as const,
        size: "",
        downloadUrl: "",
        hashes: [
          { algorithm: "SHA512", hash: "" },
          { algorithm: "SHA384", hash: "" },
          { algorithm: "SHA256", hash: "" },
        ],
        downloadId: "",
      },
      update: {
        filename: "",
        type: "update" as const,
        size: "",
        downloadUrl: "",
        hashes: [
          { algorithm: "SHA512", hash: "" },
          { algorithm: "SHA384", hash: "" },
          { algorithm: "SHA256", hash: "" },
        ],
        downloadId: "",
      },
    },
  });

  // Fill formData with current version info when editing
  useEffect(() => {
    if (showEditForm && versionData) {
      setFormData({
        version: versionData.version,
        releaseDate: versionData.releaseDate,
        releaseType: versionData.releaseType,
        description: versionData.description,
        files: {
          installer: {
            filename:
              versionData.files.find((f) => f.type === "installer")?.filename ||
              "",
            type: "installer",
            size:
              versionData.files.find((f) => f.type === "installer")?.size || "",
            downloadUrl:
              versionData.files.find((f) => f.type === "installer")
                ?.downloadUrl || "",
            hashes: [
              {
                algorithm: "SHA512",
                hash:
                  versionData.files.find((f) => f.type === "installer")
                    ?.hashes[0]?.hash || "",
              },
              {
                algorithm: "SHA384",
                hash:
                  versionData.files.find((f) => f.type === "installer")
                    ?.hashes[1]?.hash || "",
              },
              {
                algorithm: "SHA256",
                hash:
                  versionData.files.find((f) => f.type === "installer")
                    ?.hashes[2]?.hash || "",
              },
            ],
            downloadId: versionData.files.find((f) => f.type === "installer")?.downloadId || "",
          },
          update: {
            filename:
              versionData.files.find((f) => f.type === "update")?.filename ||
              "",
            type: "update",
            size:
              versionData.files.find((f) => f.type === "update")?.size || "",
            downloadUrl:
              versionData.files.find((f) => f.type === "update")?.downloadUrl ||
              "",
            hashes: [
              {
                algorithm: "SHA512",
                hash:
                  versionData.files.find((f) => f.type === "update")?.hashes[0]
                    ?.hash || "",
              },
              {
                algorithm: "SHA384",
                hash:
                  versionData.files.find((f) => f.type === "update")?.hashes[1]
                    ?.hash || "",
              },
              {
                algorithm: "SHA256",
                hash:
                  versionData.files.find((f) => f.type === "update")?.hashes[2]
                    ?.hash || "",
              },
            ],
            downloadId: versionData.files.find((f) => f.type === "update")?.downloadId || "",
          },
        },
      });
    }
  }, [showEditForm, versionData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(""), 2000);
  };

  const toggleExpandedFile = (fileId: string) => {
    setExpandedFile(expandedFile === fileId ? null : fileId);
  };

  const handleDownload = (file: FileProps) => {
    if (file.downloadUrl && file.downloadUrl !== "#") {
      window.open(file.downloadUrl, "_blank");
    } else {
      Swal.fire(`Download would start for: ${file.filename}`, "", "info");
    }
  };

  // --- ADD VERSION ---
  const handleSubmit = async (): Promise<void> => {
    if (!formData.version || !formData.releaseType || !formData.description) {
      Swal.fire("Please fill in all version information fields", "", "warning");
      return;
    }

    let installerDownloadUrl = formData.files.installer.downloadUrl;
    let updateDownloadUrl = formData.files.update.downloadUrl;

    // Upload installer file if selected
    if (selectedInstallerFile) {
      const installerRef = ref(
        storage,
        `downloads/installers/${selectedInstallerFile.name}`
      );
      await uploadBytes(installerRef, selectedInstallerFile);
      installerDownloadUrl = await getDownloadURL(installerRef);
    }

    // Upload update file if selected
    if (selectedUpdateFile) {
      const updateRef = ref(
        storage,
        `downloads/updates/${selectedUpdateFile.name}`
      );
      await uploadBytes(updateRef, selectedUpdateFile);
      updateDownloadUrl = await getDownloadURL(updateRef);
    }

    const filesToAdd = [];
    if (formData.files.installer.filename && formData.files.installer.size) {
      filesToAdd.push({
        ...formData.files.installer,
        id: Date.now().toString(),
        downloadUrl: installerDownloadUrl,
      });
    }
    if (formData.files.update.filename && formData.files.update.size) {
      filesToAdd.push({
        ...formData.files.update,
        id: (Date.now() + 1).toString(),
        downloadUrl: updateDownloadUrl,
      });
    }

    if (filesToAdd.length === 0) {
      Swal.fire("Please fill in at least one file information", "", "warning");
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")} ${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

    const dataToSubmit = {
      version: formData.version,
      releaseDate: formattedDate,
      releaseType: formData.releaseType,
      description: formData.description,
      files: filesToAdd,
    };

    await addVersion(dataToSubmit);

    setShowAddForm(false);

    setFormData({
      version: "",
      releaseDate: "",
      releaseType: "",
      description: "",
      files: {
        installer: {
          filename: "",
          type: "installer",
          size: "",
          downloadUrl: "",
          hashes: [
            { algorithm: "SHA512", hash: "" },
            { algorithm: "SHA384", hash: "" },
            { algorithm: "SHA256", hash: "" },
          ],
          downloadId: "",
        },
        update: {
          filename: "",
          type: "update",
          size: "",
          downloadUrl: "",
          hashes: [
            { algorithm: "SHA512", hash: "" },
            { algorithm: "SHA384", hash: "" },
            { algorithm: "SHA256", hash: "" },
          ],
          downloadId: "",
        },
      },
    });

    setSelectedInstallerFile(null);
    setSelectedUpdateFile(null);
  };

  // --- EDIT VERSION ---
  const handleEditVersionSubmit = async (): Promise<void> => {
    const filesToUpdate = [];
    if (formData.files.installer.filename && formData.files.installer.size) {
      filesToUpdate.push({
        ...formData.files.installer,
        id:
          files.find((f) => f.type === "installer")?.id ||
          Date.now().toString(),
      });
    }
    if (formData.files.update.filename && formData.files.update.size) {
      filesToUpdate.push({
        ...formData.files.update,
        id:
          files.find((f) => f.type === "update")?.id ||
          (Date.now() + 1).toString(),
      });
    }

    const dataToSubmit = {
      version: formData.version,
      releaseDate: formData.releaseDate,
      releaseType: formData.releaseType,
      description: formData.description,
      files: filesToUpdate,
    };
    await updateVersion(versionData?.id, dataToSubmit);
    setShowEditForm(false);
    Swal.fire("Version updated!", "", "success");
  };

  // --- FILE CARD ---
  const FileCard = ({ file }: { file: FileProps }) => {
    const isExpanded = expandedFile === file.id;

    return (
      <div
        className={`border rounded-lg overflow-hidden ${
          darkMode ? "border-gray-600" : "border-gray-200"
        } mb-4`}
      >
        <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  file.type === "installer"
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-600"
                    : darkMode
                    ? "bg-green-900 text-green-300"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {file.type === "installer" ? "📦" : "🔄"}
              </div>
              <div>
                <h4 className={`font-semibold ${textClass}`}>
                  {file.filename}
                </h4>
                <p className={`text-sm ${mutedTextClass}`}>
                  {file.type.charAt(0).toUpperCase() + file.type.slice(1)} •{" "}
                  {file.size}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload(file)}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                <FaDownload className="w-3 h-3 mr-1 inline" />
                Download
              </button>
              <button
                onClick={() => toggleExpandedFile(file.id)}
                className={`px-3 py-1 rounded-md text-sm ${
                  darkMode
                    ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isExpanded ? "Hide" : "Show"} Hashes
              </button>
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className="p-4 border-t">
            <div className="space-y-3">
              {file.hashes.map(
                (
                  hashObj: { algorithm: string; hash: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm font-medium ${textClass}`}>
                          {hashObj.algorithm}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code
                          className={`flex-1 px-2 py-1 rounded text-xs font-mono ${
                            darkMode
                              ? "bg-gray-800 text-gray-300"
                              : "bg-gray-100 text-gray-800"
                          } break-all`}
                        >
                          {hashObj.hash}
                        </code>
                        <button
                          onClick={() => copyToClipboard(hashObj.hash)}
                          className={`px-2 py-1 text-xs rounded ${
                            copiedHash === hashObj.hash
                              ? "bg-green-600 text-white"
                              : darkMode
                              ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {copiedHash === hashObj.hash ? "✓" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color={darkMode ? "#fff" : "#2563eb"} size={64} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800">
          Version Information
        </h1>
        {isAdmin && (
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus className="w-4 h-4 mr-2 inline" />
              Add Version
            </button>
            <button
              onClick={() => setShowEditForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaEdit className="w-4 h-4 ml-2 inline" />
              Edit Version
            </button>
          </div>
        )}
      </div>

      {/* Version Header */}
      <div
        className={`${cardClass} p-6 rounded-xl shadow-sm border ${
          darkMode ? "border-gray-700" : "border-gray-100"
        } mb-6`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <FaTag className="w-8 h-8" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${textClass}`}>
                Version {versionData?.version}
              </h2>
              <p className={`${mutedTextClass} text-sm`}>
                {versionData?.releaseType}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                darkMode
                  ? "bg-green-900 text-green-300"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Stable
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <FaCalendarAlt className={mutedTextClass} />
              <span className={mutedTextClass}>{versionData?.releaseDate}</span>
            </div>
          </div>
        </div>
        <p className={`${mutedTextClass} text-sm`}>
          {versionData?.description}
        </p>
      </div>

      {/* Add Version Form */}
      {showAddForm && (
        <div
          className={`${cardClass} p-6 rounded-xl shadow-sm border ${
            darkMode ? "border-gray-700" : "border-gray-100"
          } mb-6`}
        >
          <h3 className={`text-xl font-bold ${textClass} mb-4`}>
            Add New Version
          </h3>
          <VersionForm
            darkMode={darkMode}
            textClass={textClass}
            mutedTextClass={mutedTextClass}
            formData={formData}
            setFormData={setFormData}
            setSelectedInstallerFile={setSelectedInstallerFile}
            setSelectedUpdateFile={setSelectedUpdateFile}
            onCancel={() => setShowAddForm(false)}
            onSubmit={handleSubmit}
            isEdit={false}
          />
        </div>
      )}

      {/* Edit Version Form */}
      {showEditForm && (
        <div
          className={`${cardClass} p-6 rounded-xl shadow-sm border ${
            darkMode ? "border-gray-700" : "border-gray-100"
          } mb-6`}
        >
          <h3 className={`text-xl font-bold ${textClass} mb-4`}>
            Edit Version
          </h3>
          <VersionForm
            darkMode={darkMode}
            textClass={textClass}
            mutedTextClass={mutedTextClass}
            formData={formData}
            setFormData={setFormData}
            setSelectedInstallerFile={setSelectedInstallerFile}
            setSelectedUpdateFile={setSelectedUpdateFile}
            onCancel={() => setShowEditForm(false)}
            onSubmit={handleEditVersionSubmit}
            isEdit={true}
          />
        </div>
      )}

      {/* Files Section */}
      <div
        className={`${cardClass} p-6 rounded-xl shadow-sm border ${
          darkMode ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <FaShieldAlt className="w-6 h-6 text-blue-500" />
          <h3 className={`text-xl font-bold ${textClass}`}>
            Downloads & Hash Verification
          </h3>
        </div>
        <div
          className={`${
            darkMode
              ? "bg-yellow-900 border-yellow-700 text-yellow-300"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          } border-l-4 p-4 mb-6`}
        >
          <div className="flex items-start space-x-2">
            <FaInfoCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Security Notice</p>
              <p className="text-sm mt-1">
                Always verify file hashes after download to ensure file
                integrity and security.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className={`w-16 h-16 mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              >
                <FaFileAlt className="w-full h-full" />
              </div>
              <p className={`text-lg font-medium ${textClass}`}>
                No Files Available
              </p>
              <p className={`mt-2 ${mutedTextClass}`}>
                {isAdmin
                  ? "Add installer or update files to make them available for download"
                  : "No files are currently available for download"}
              </p>
            </div>
          ) : (
            files.map((file) => <FileCard key={file.id} file={file} />)
          )}
        </div>
        <div
          className={`mt-6 p-4 rounded-lg ${
            darkMode
              ? "bg-red-900 border-red-700 text-red-300"
              : "bg-red-50 border-red-200 text-red-800"
          } border`}
        >
          <div className="flex items-start space-x-2">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Important Security Warning</p>
              <p className="text-sm mt-1">
                If any calculated hash doesn't match these values exactly, do
                not install the software. This could indicate file corruption or
                tampering. Contact support immediately if hashes don't match.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVersioning;
