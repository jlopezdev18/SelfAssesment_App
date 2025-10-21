/**
 * File card component for displaying version files with download and hash info
 */
import { useState } from "react";
import { FaDownload } from "react-icons/fa";

interface FileCardProps {
  file: {
    id: string;
    filename: string;
    type: "installer" | "update";
    size: string;
    downloadUrl: string;
    hashes: Array<{ algorithm: string; hash: string }>;
  };
  darkMode: boolean;
  textClass: string;
  mutedTextClass: string;
  onDownload: (file: FileCardProps["file"]) => void;
}

export function FileCard({
  file,
  darkMode,
  textClass,
  mutedTextClass,
  onDownload,
}: FileCardProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState("");

  const isExpanded = expandedFile === file.id;

  const toggleExpanded = () => {
    setExpandedFile(isExpanded ? null : file.id);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(""), 2000);
  };

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
              onClick={() => onDownload(file)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              <FaDownload className="w-3 h-3 mr-1 inline" />
              Download
            </button>
            <button
              onClick={toggleExpanded}
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
}
