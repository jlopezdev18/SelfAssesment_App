import React from 'react';
import { FaTimes } from 'react-icons/fa';

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
  mutedTextClass
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs bg-opacity-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full hover:bg-opacity-80 ${
            darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>
          File Hashes
        </h3>

        <div className="space-y-4">
          {hashes.map((hash) => (
            <div key={hash.algorithm}>
              <label className={`block text-sm font-medium ${mutedTextClass} mb-1`}>
                {hash.algorithm}
              </label>
              <div className={`p-3 rounded-md font-mono text-sm break-all ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              } ${textClass}`}>
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