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
  onDelete: (item: DownloadItem) => Promise<void>;
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

  const handleDelete = async (item: DownloadItem) => {
    if (!isAdmin) return;
    await onDelete(item);
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
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div
              className={`w-16 h-16 mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              <FaDownload className="w-full h-full" />
            </div>
            <p className={`text-lg font-medium ${textClass}`}>
              No downloads available
            </p>
            <p className={`mt-2 ${mutedTextClass}`}>
              {isAdmin
                ? "Start by adding some files for users to download"
                : "Check back later for available downloads"}
            </p>
          </div>
        ) : (
          items.map((item, index) => (
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
                    {item.updated && (
                      <span
                        className={`text-xs ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        } px-2 py-1 rounded-full`}
                      >
                        {formatNumber(item.updated)}
                      </span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Delete item"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${textClass}`}>
                  {item.size}
                </span>
                <div className="flex items-center space-x-2">
                  {(item.type === "installers" || item.type === "updates") &&
                    item.hashes && (
                      <button
                        onClick={() => setSelectedHashes(item.hashes ?? null)}
                        className={`p-2 rounded-lg transition-all flex items-center cursor-pointer ${
                          darkMode
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-600 hover:text-gray-800"
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
