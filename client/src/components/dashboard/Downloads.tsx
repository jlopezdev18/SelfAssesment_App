import React, { useState } from "react";
import { FaExternalLinkAlt, FaSearch } from "react-icons/fa";

interface DownloadItem {
  name: string;
  type: "installer" | "document" | "resource";
  size: string;
  version?: string;
  description: string;
}

interface DownloadsProps {
  downloadItems: DownloadItem[];
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
  getTypeIcon: (type: string) => React.ReactNode;
}

const Downloads: React.FC<DownloadsProps> = ({
  downloadItems,
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
  getTypeIcon,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "installer" | "document" | "resource"
  >("all");

  const filteredItems = downloadItems.filter((item) => {
    const matchesType = filter === "all" ? true : item.type === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 mb-8">
        Downloads & Resources
      </h1>
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
          onChange={(e) => setFilter(e.target.value as "all" | "installer" | "document" | "resource")}
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
                      item.type === "installer"
                        ? "bg-blue-100 text-blue-600"
                        : item.type === "document"
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
                <button
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center hover:shadow-lg transform hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)",
                  }}
                >
                  Download
                  <FaExternalLinkAlt className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Downloads;
