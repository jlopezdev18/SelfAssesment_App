import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useIsAdmin } from "../../../../hooks/useIsAdmin";
import { useDownloadManager } from "./hooks/useDownloadManager";
import AddDownloadModal from "./AddDownloadModal";
import DownloadsList from "./DownloadsList";
import type { DownloadItem, DownloadsProps } from "./types/DownloadInterfaces";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Downloads: React.FC<DownloadsProps> = ({
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
  getTypeIcon,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "installers" | "documents" | "resources" | "updates"
  >("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: DownloadItem | null;
  }>({ open: false, item: null });
  const [newItem, setNewItem] = useState<DownloadItem>({
    id: "",
    name: "",
    type: "installers",
    size: "",
    updated: "",
    downloadUrl: "",
    hashes: [
      { algorithm: "SHA512", hash: "" },
      { algorithm: "SHA384", hash: "" },
      { algorithm: "SHA256", hash: "" },
    ],
  });

  const { isAdmin } = useIsAdmin();
  const {
    downloads,
    uploading,
    uploadError,
    setUploadError,
    addItem,
    deleteItem,
    loading,
  } = useDownloadManager();
  const filteredItems = downloads.filter((item) => {
    const matchesType = filter === "all" ? true : item.type === filter;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleModalClose = () => {
    setShowAddModal(false);
    setNewItem({
      id: "",
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
    addItem(
      newItem,
      file,
      handleModalClose,
      () => {
        toast("File uploaded successfully", {
          style: {
            background: "#059669",
            color: "white",
            border: "1px solid #059669",
          },
          duration: 4000,
        });
      },
      (error) => {
        toast("Upload failed", {
          description: error,
          style: {
            background: "#dc2626",
            color: "white",
            border: "1px solid #dc2626",
          },
          duration: 4000,
        });
      }
    );
  };

  const handleDeleteItem = (item: DownloadItem) => {
    setDeleteDialog({ open: true, item });
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog.item) return;

    deleteItem(
      deleteDialog.item,
      () => {
        toast("File deleted successfully", {
          style: {
            background: "#dc2626",
            color: "white",
            border: "1px solid #dc2626",
          },
          duration: 4000,
        });
      },
      (error) => {
        toast("Delete failed", {
          description: error,
          style: {
            background: "#dc2626",
            color: "white",
            border: "1px solid #dc2626",
          },
          duration: 4000,
        });
      }
    );
    setDeleteDialog({ open: false, item: null });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800">
            Downloads & Resources
          </h1>
          <p className={`mt-2 text-sm ${mutedTextClass}`}>
            Manage and download application files, documents, and resources
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add New File
          </button>
        )}
      </div>

      {/* Controls Section */}
      <div
        className={`${cardClass} p-4 rounded-xl border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } shadow-sm`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <span
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${mutedTextClass}`}
            >
              <FaSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search downloads or resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as
                  | "all"
                  | "installers"
                  | "documents"
                  | "resources"
                  | "updates"
              )
            }
            className={`py-2.5 px-3 rounded-lg border transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="all">All Types</option>
            <option value="installers">Installers</option>
            <option value="documents">Documents</option>
            <option value="resources">Resources</option>
            <option value="updates">Updates</option>
          </select>
        </div>
      </div>

      <DownloadsList
        items={filteredItems}
        cardClass={cardClass}
        textClass={textClass}
        mutedTextClass={mutedTextClass}
        darkMode={darkMode}
        getTypeIcon={getTypeIcon}
        isAdmin={isAdmin}
        onDelete={handleDeleteItem}
        loading={loading}
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

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, item: null })}
      >
        <AlertDialogContent
          className={
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }
        >
          <AlertDialogHeader>
            <AlertDialogTitle className={textClass}>
              Delete File
            </AlertDialogTitle>
            <AlertDialogDescription className={mutedTextClass}>
              Are you sure you want to delete "{deleteDialog.item?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Downloads;
