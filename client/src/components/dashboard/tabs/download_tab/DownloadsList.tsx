import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import type { DownloadItem } from "./types/DownloadInterfaces";

interface DownloadsListProps {
  items: DownloadItem[];
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
  getTypeIcon: (type: string) => React.ReactNode;
}

const DownloadsList: React.FC<DownloadsListProps> = ({
  items,
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
  getTypeIcon,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.length === 0 ? (
      <div className={`col-span-full text-center ${mutedTextClass}`}>No items found.</div>
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
          <p className={`${mutedTextClass} text-sm mb-4`}>{item.description}</p>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${textClass}`}>{item.size}</span>
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
);

export default DownloadsList;