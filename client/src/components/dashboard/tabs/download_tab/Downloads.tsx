import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaFingerprint,
  FaTrash,
} from "react-icons/fa";
import { useIsAdmin } from "../../../../hooks/useIsAdmin";
import { useDownloadManager } from "./hooks/useDownloadManager";
import AddDownloadModal from "./AddDownloadModal";
import DownloadsList from "./DownloadsList";
import HashesModal from "./HashesModal";
import type { DownloadItem, DownloadsProps } from "./types/DownloadInterfaces";
import { toastSuccess, toastError } from "@/utils/toastNotifications";
import ScaleLoader from "react-spinners/ScaleLoader";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

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
  const [deleteVersionDialog, setDeleteVersionDialog] = useState<{
    open: boolean;
    versionId: string | null;
    versionName: string | null;
  }>({ open: false, versionId: null, versionName: null });
  const [hashesModal, setHashesModal] = useState<{
    open: boolean;
    hashes: Array<{ algorithm: string; hash: string }>;
  }>({ open: false, hashes: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [individualFilesPage, setIndividualFilesPage] = useState(1);
  const versionsPerPage = 3;
  const individualFilesPerPage = 9;
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
    groupedVersions,
    uploading,
    uploadError,
    setUploadError,
    addItem,
    deleteItem,
    deleteVersion,
    loading,
  } = useDownloadManager();

  // Separar archivos individuales (documents, resources) de versiones (installers, updates)
  const individualFiles = downloads.filter(
    (item) => item.type === "documents" || item.type === "resources"
  );

  // Filtrar versiones agrupadas
  const filteredVersions = groupedVersions.filter((version) => {
    if (filter === "all" || filter === "installers" || filter === "updates") {
      const matchesSearch =
        version.version.toLowerCase().includes(search.toLowerCase()) ||
        version.files.some((f) =>
          f.name.toLowerCase().includes(search.toLowerCase())
        );
      return matchesSearch;
    }
    return false;
  });

  // Paginación
  const totalPages = Math.ceil(filteredVersions.length / versionsPerPage);
  const startIndex = (currentPage - 1) * versionsPerPage;
  const endIndex = startIndex + versionsPerPage;
  const paginatedVersions = filteredVersions.slice(startIndex, endIndex);

  // Filtrar archivos individuales
  const filteredIndividualFiles = individualFiles.filter((item) => {
    const matchesType = filter === "all" ? true : item.type === filter;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Paginación para archivos individuales
  const totalIndividualPages = Math.ceil(filteredIndividualFiles.length / individualFilesPerPage);
  const individualStartIndex = (individualFilesPage - 1) * individualFilesPerPage;
  const individualEndIndex = individualStartIndex + individualFilesPerPage;
  const paginatedIndividualFiles = filteredIndividualFiles.slice(individualStartIndex, individualEndIndex);

  // Reset to page 1 when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
    setIndividualFilesPage(1);
  }, [search, filter]);

  const handleShowHashes = (
    hashes: Array<{ algorithm: string; hash: string }> | undefined
  ) => {
    if (hashes && hashes.length > 0) {
      setHashesModal({ open: true, hashes });
    }
  };

  const handleDeleteVersion = (versionId: string, versionName: string) => {
    setDeleteVersionDialog({ open: true, versionId, versionName });
  };

  const handleConfirmDeleteVersion = () => {
    if (!deleteVersionDialog.versionId) return;

    deleteVersion(
      deleteVersionDialog.versionId,
      () => {
        toastSuccess("Version deleted successfully");
        // Reset to first page if current page is now empty
        if (paginatedVersions.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
      (error: string) => {
        toastError("Delete failed", error);
      }
    );
    setDeleteVersionDialog({ open: false, versionId: null, versionName: null });
  };

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
        toastSuccess("File uploaded successfully");
      },
      (error) => {
        toastError("Upload failed", error);
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
        toastSuccess("File deleted successfully");
        // Reset to first page if current page is now empty
        if (paginatedIndividualFiles.length === 1 && individualFilesPage > 1) {
          setIndividualFilesPage(individualFilesPage - 1);
        }
      },
      (error) => {
        toastError("Delete failed", error);
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[60vh]">
          <ScaleLoader color={darkMode ? "#60a5fa" : "#2563eb"} />
        </div>
      )}

      {/* Content - Only show when not loading */}
      {!loading && (
        <>
          {/* Archivos Individuales */}
          {filteredIndividualFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className={`text-xl font-bold ${textClass}`}>
                  Individual Files
                </h2>
                {totalIndividualPages > 1 && (
                  <span className={`text-sm ${mutedTextClass}`}>
                    Page {individualFilesPage} of {totalIndividualPages}
                  </span>
                )}
              </div>
              <DownloadsList
                items={paginatedIndividualFiles}
                cardClass={cardClass}
                textClass={textClass}
                mutedTextClass={mutedTextClass}
                darkMode={darkMode}
                getTypeIcon={getTypeIcon}
                isAdmin={isAdmin}
                onDelete={handleDeleteItem}
                loading={loading}
              />

              {/* Paginación para archivos individuales */}
              {totalIndividualPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() =>
                      setIndividualFilesPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={individualFilesPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      individualFilesPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    } ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <FaChevronLeft className="w-3 h-3" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalIndividualPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setIndividualFilesPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            individualFilesPage === page
                              ? "bg-blue-600 text-white scale-110"
                              : darkMode
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setIndividualFilesPage((prev) => Math.min(totalIndividualPages, prev + 1))
                    }
                    disabled={individualFilesPage === totalIndividualPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      individualFilesPage === totalIndividualPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    } ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    Next
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Versiones Agrupadas */}
          {(filter === "all" ||
            filter === "installers" ||
            filter === "updates") &&
            filteredVersions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className={`text-xl font-bold ${textClass}`}>
                    Application Versions
                  </h2>
                  {totalPages > 1 && (
                    <span className={`text-sm ${mutedTextClass}`}>
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>

                {paginatedVersions.map((version) => (
                  <div
                    key={version.id}
                    className={`${cardClass} rounded-xl border ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    } p-5 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-lg font-bold ${textClass}`}>
                          Version {version.version}
                        </h3>
                        <p className={`text-sm ${mutedTextClass} mt-1`}>
                          {version.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              version.releaseType === "stable"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : version.releaseType === "beta"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {version.releaseType}
                          </span>
                          <span className={`text-xs ${mutedTextClass}`}>
                            {version.releaseDate}
                          </span>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() =>
                            handleDeleteVersion(version.id, version.version)
                          }
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                          title="Delete entire version"
                        >
                          <FaTrash className="w-3 h-3" />
                          Delete Version
                        </button>
                      )}
                    </div>

                    <div className="grid gap-2">
                      {version.files.map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            darkMode ? "bg-gray-700/30" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getTypeIcon(file.type)}
                            <div>
                              <p className={`font-medium ${textClass}`}>
                                {file.name}
                              </p>
                              <p className={`text-xs ${mutedTextClass}`}>
                                {file.size}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.hashes && file.hashes.length > 0 && (
                              <button
                                onClick={() => handleShowHashes(file.hashes)}
                                className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
                                title="View file hashes"
                              >
                                <FaFingerprint className="w-3 h-3" />
                                Hashes
                              </button>
                            )}
                            <a
                              href={file.downloadUrl}
                              download
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              Download
                            </a>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteItem(file)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      } ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <FaChevronLeft className="w-3 h-3" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                              currentPage === page
                                ? "bg-blue-600 text-white scale-110"
                                : darkMode
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      } ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Next
                      <FaChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

          {/* Mensaje cuando no hay resultados */}
          {filteredVersions.length === 0 &&
            filteredIndividualFiles.length === 0 && (
              <div className={`${cardClass} p-8 rounded-xl text-center`}>
                <p className={mutedTextClass}>
                  No files found matching your criteria
                </p>
              </div>
            )}
        </>
      )}

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

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, item: null })}
        title="Delete File"
        description={`Are you sure you want to delete "${deleteDialog.item?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        darkMode={darkMode}
      />

      <DeleteConfirmDialog
        open={deleteVersionDialog.open}
        onOpenChange={(open) =>
          setDeleteVersionDialog({ open, versionId: null, versionName: null })
        }
        title="Delete Version"
        description={`Are you sure you want to delete version "${deleteVersionDialog.versionName}" and all its files? This action cannot be undone and will permanently delete all associated installers and updates.`}
        onConfirm={handleConfirmDeleteVersion}
        confirmText="Delete Version"
        darkMode={darkMode}
      />

      <HashesModal
        isOpen={hashesModal.open}
        onClose={() => setHashesModal({ open: false, hashes: [] })}
        hashes={hashesModal.hashes}
        darkMode={darkMode}
        textClass={textClass}
        mutedTextClass={mutedTextClass}
      />
    </div>
  );
};

export default Downloads;
