import React, { useState } from "react";
import {
  FaDownload,
  FaExternalLinkAlt,
  FaTrash,
  FaHashtag,
} from "react-icons/fa";
import type {
  DownloadItem,
  DownloadsListProps,
} from "./types/DownloadInterfaces";
import ScaleLoader from "react-spinners/ScaleLoader";
import HashesModal from "./HashesModal";

interface ExtendedDownloadsListProps extends DownloadsListProps {
  isAdmin: boolean;
  onDelete: (item: DownloadItem) => void;
  loading?: boolean;
}

const DownloadsList: React.FC<ExtendedDownloadsListProps> = ({
  items,
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
  getTypeIcon,
  isAdmin,
  onDelete,
  loading,
}) => {
  const [selectedHashes, setSelectedHashes] = useState<Array<{
    algorithm: string;
    hash: string;
  }> | null>(null);

  const handleDelete = (item: DownloadItem) => {
    if (!isAdmin) return;
    onDelete(item);
  };

  const formatNumber = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ScaleLoader color={darkMode ? "#fff" : "#2563eb"} />
        <p className={`mt-4 ${textClass}`}>Loading downloads...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div
              className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center ${
                darkMode
                  ? "bg-gray-800 text-gray-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <FaDownload className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>
              No downloads available
            </h3>
            <p className={`text-center max-w-md ${mutedTextClass}`}>
              {isAdmin
                ? "Start by adding some files for users to download. Click the 'Add New File' button to get started."
                : "Check back later for available downloads or contact your administrator."}
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className={`${cardClass} p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10 transform hover:scale-[1.02] ${
                darkMode
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.type === "installers"
                        ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                        : item.type === "documents"
                        ? "bg-gradient-to-br from-green-100 to-green-200 text-green-600"
                        : item.type === "updates"
                        ? "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600"
                        : "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600"
                    }`}
                  >
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold mb-1 truncate ${textClass}`}
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                    {item.updated && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full inline-block ${
                          darkMode
                            ? "bg-gray-800 text-gray-300 border border-gray-700"
                            : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {formatNumber(item.updated)}
                      </span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(item)}
                    className={`p-2 rounded-lg transition-colors hover:bg-red-50 hover:text-red-700 ${
                      darkMode
                        ? "text-gray-400 hover:bg-red-900/20 hover:text-red-400"
                        : "text-gray-400"
                    }`}
                    title="Delete item"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className={`text-sm font-medium ${mutedTextClass}`}>
                  {item.size}
                </span>
                <div className="flex items-center space-x-2">
                  {(item.type === "installers" || item.type === "updates") &&
                    item.hashes && (
                      <button
                        onClick={() => setSelectedHashes(item.hashes ?? null)}
                        className={`p-2 rounded-lg transition-all flex items-center ${
                          darkMode
                            ? "text-gray-400 hover:text-white hover:bg-gray-700"
                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                        title="View file hashes"
                      >
                        <FaHashtag className="w-4 h-4" />
                      </button>
                    )}
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Download
                    <FaExternalLinkAlt className="w-3 h-3 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <HashesModal
        isOpen={!!selectedHashes}
        onClose={() => setSelectedHashes(null)}
        hashes={selectedHashes || []}
        darkMode={darkMode}
        textClass={textClass}
        mutedTextClass={mutedTextClass}
      />
    </>
  );
};

export default DownloadsList;
