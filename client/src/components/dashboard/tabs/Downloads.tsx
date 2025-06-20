import React, { useState } from "react";
import { FaExternalLinkAlt, FaSearch, FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { useIsAdmin } from "../../../hooks/useIsAdmin";

interface DownloadItem {
  name: string;
  type: "installers" | "documents" | "resources";
  size: string;
  version?: string;
  description: string;
  downloadUrl: string;
}

interface DownloadsProps {
  downloadItems: DownloadItem[];
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
  getTypeIcon: (type: string) => React.ReactNode;
  onAddItem?: (item: DownloadItem) => void;
}

const Downloads: React.FC<DownloadsProps> = ({
  downloadItems,
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
  getTypeIcon,
  onAddItem,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "installers" | "documents" | "resources">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<DownloadItem>({
    name: "",
    type: "installers",
    size: "",
    version: "",
    description: "",
    downloadUrl: "",
  });
  const isAdmin = useIsAdmin(); 
  const filteredItems = downloadItems.filter((item) => {
    const matchesType = filter === "all" ? true : item.type === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddItem = async () => {
    setUploadError(null);
    if (!newItem.name || !newItem.description || !newItem.size || !file) {
      setUploadError("Please fill all required fields and select a file.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      // Set the storage path based on type
      const path = `downloads/${newItem.type}/${file.name}`;
      const storageRef = ref(storage, path);

      // Upload with progress
      const uploadTask = uploadBytes(storageRef, file);
      await uploadTask;

      // Get the download URL
      const downloadUrl = await getDownloadURL(storageRef);
      
       await addDoc(collection(db, "downloads"), {
      name: newItem.name,
      description: newItem.description,
      path,
      type: newItem.type,
      version: newItem.version || "",
      size: newItem.size,
    });

      const itemToAdd = {
        ...newItem,
        downloadUrl,
        version: newItem.version || undefined,
      };

      if (onAddItem) {
        onAddItem(itemToAdd);
      }

      // Reset form
      setNewItem({
        name: "",
        type: "installers",
        size: "",
        version: "",
        description: "",
        downloadUrl: "",
      });
      setFile(null);
      setShowAddModal(false);
    } catch (err) {
      setUploadError("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setNewItem({
      name: "",
      type: "installers",
      size: "",
      version: "",
      description: "",
      downloadUrl: "",
    });
    setFile(null);
    setUploadError(null);
    setUploadProgress(0);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800">
          Downloads & Resources
        </h1>
        {isAdmin && (
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center hover:shadow-lg transform hover:scale-105"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Add New
        </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-3 md:space-y-0">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search downloads or resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
        </div>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value as "all" | "installers" | "documents" | "resources"
            )
          }
          className={`py-2 px-4 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200 text-gray-800"
          } focus:outline-none`}
        >
          <option value="all">All</option>
          <option value="installer">Installers</option>
          <option value="document">Documents</option>
          <option value="resource">Resources</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className={`col-span-full text-center ${mutedTextClass}`}>
            No items found.
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={index}
              className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${
                darkMode ? "border-gray-700" : ""
              } hover:shadow-lg transition-all transform hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.type === "installers"
                        ? "bg-blue-100 text-blue-600"
                        : item.type === "documents"
                        ? "bg-green-100 text-green-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className={`font-bold ${textClass}`}>{item.name}</h3>
                    {item.version && (
                      <span
                        className={`text-xs ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        } px-2 py-1 rounded-full`}
                      >
                        {item.version}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className={`${mutedTextClass} text-sm mb-4`}>
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${textClass}`}>
                  {item.size}
                </span>
                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center hover:shadow-lg transform hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)",
                  }}
                >
                  Download
                  <FaExternalLinkAlt className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${cardClass} rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${textClass}`}>
                  Add New Item
                </h2>
                <button
                  onClick={handleModalClose}
                  className={`p-2 rounded-lg ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors`}
                  disabled={uploading}
                >
                  <FaTimes className={`w-5 h-5 ${textClass}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-2`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    placeholder="Enter item name"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-2`}>
                    Type *
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        type: e.target.value as "installers" | "documents" | "resources",
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
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-2`}>
                    Size *
                  </label>
                  <input
                    type="text"
                    value={newItem.size}
                    onChange={(e) =>
                      setNewItem({ ...newItem, size: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    placeholder="e.g., 25 MB, 1.2 GB"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-2`}>
                    Version
                  </label>
                  <input
                    type="text"
                    value={newItem.version}
                    onChange={(e) =>
                      setNewItem({ ...newItem, version: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    placeholder="e.g., v1.0.0 (optional)"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-2`}>
                    Description *
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none`}
                    placeholder="Brief description of the item"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-2`}>
                    Upload File *
                  </label>
                  <input
                    type="file"
                    accept="*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full"
                    disabled={uploading}
                  />
                  {file && (
                    <div className="mt-1 text-xs text-green-600">
                      Selected: {file.name}
                    </div>
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
                  onClick={handleModalClose}
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
                  onClick={handleAddItem}
                  disabled={
                    uploading ||
                    !newItem.name ||
                    !newItem.description ||
                    !file ||
                    !newItem.size
                  }
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
      )}
    </div>
  );
};

export default Downloads;