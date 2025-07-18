import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useIsAdmin } from "../../../../hooks/useIsAdmin";
import { useAddDownloadItem } from "./hooks/useAddDownloadItem";
import AddDownloadModal from "./AddDownloadModal";
import DownloadsList from "./DownloadsList";
import type { DownloadItem, DownloadsProps } from "./types/DownloadInterfaces";

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
  const [filter, setFilter] = useState<"all" | "installers" | "documents" | "resources" | "updates">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [newItem, setNewItem] = useState<DownloadItem>({
    name: "",
    type: "installers",
    size: "",
    updated: "",
    downloadUrl: "",
  });

  const isAdmin = useIsAdmin();
  const { uploading, uploadError, setUploadError, addItem } = useAddDownloadItem(onAddItem);
  const filteredItems = downloadItems.filter((item) => {
    const matchesType = filter === "all" ? true : item.type === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleModalClose = () => {
    setShowAddModal(false);
    setNewItem({
      name: "",
      type: "installers",
      size: "",
      updated: "",
      downloadUrl: "",
    });
    setFile(null);
    setUploadError(null);
  };

  const handleAddItem = () => {
    addItem(newItem, file, handleModalClose);
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
              e.target.value as "all" | "installers" | "documents" | "resources" | "updates"
            )
          }
          className={`py-2 px-4 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200 text-gray-800"
          } focus:outline-none`}
        >
          <option value="all">All</option>
          <option value="installers">Installers</option>
          <option value="documents">Documents</option>
          <option value="resources">Resources</option>
          <option value="updates">Updates</option>
        </select>
      </div>

      <DownloadsList
        items={filteredItems}
        cardClass={cardClass}
        textClass={textClass}
        mutedTextClass={mutedTextClass}
        darkMode={darkMode}
        getTypeIcon={getTypeIcon}
        isAdmin={isAdmin}
      />

      <AddDownloadModal
        open={showAddModal}
        onClose={handleModalClose}
        newItem={newItem}
        setNewItem={setNewItem}
        file={file}
        setFile={setFile}
        uploading={uploading}
        uploadError={uploadError}
        onAdd={handleAddItem}
        textClass={textClass}
        cardClass={cardClass}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Downloads;