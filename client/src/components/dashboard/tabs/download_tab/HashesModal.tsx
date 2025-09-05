import React from "react";
import { FaTimes } from "react-icons/fa";

interface HashesModalProps {
  isOpen: boolean;
  onClose: () => void;
  hashes: Array<{ algorithm: string; hash: string }>;
  darkMode: boolean;
  textClass: string;
  mutedTextClass: string;
}

const HashesModal: React.FC<HashesModalProps> = ({
  isOpen,
  onClose,
  hashes,
  darkMode,
  textClass,
  mutedTextClass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
      <div
        className={`relative w-full max-w-lg p-6 rounded-xl shadow-2xl border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            darkMode
              ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <h3 className={`text-xl font-bold mb-6 ${textClass}`}>File Hashes</h3>

        <div className="space-y-4">
          {hashes.map((hash) => (
            <div key={hash.algorithm}>
              <label
                className={`block text-sm font-medium ${mutedTextClass} mb-2`}
              >
                {hash.algorithm}
              </label>
              <div
                className={`p-4 rounded-xl font-mono text-sm break-all border ${
                  darkMode
                    ? "bg-gray-900 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } ${textClass}`}
              >
                {hash.hash}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HashesModal;
