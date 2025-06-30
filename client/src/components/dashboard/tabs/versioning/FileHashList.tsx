import React from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import type { HashInfo } from "./types/VersioningInterfaces";

interface FileHashListProps {
  hashes: HashInfo[];
  fileIndex: number;
  copiedHash: string;
  onCopy: (hash: string, hashId: string) => void;
  darkMode: boolean;
}

const FileHashList: React.FC<FileHashListProps> = ({
  hashes,
  fileIndex,
  copiedHash,
  onCopy,
  darkMode,
}) => (
  <div className="space-y-3">
    {hashes.map((hash, hashIndex) => {
      const hashId = `${fileIndex}-${hashIndex}`;
      return (
        <div key={hashIndex} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {hash.algorithm}
            </span>
            <button
              onClick={() => onCopy(hash.hash, hashId)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                copiedHash === hashId
                  ? 'bg-green-500 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copiedHash === hashId ? (
                <>
                  <FaCheck className="w-3 h-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <FaCopy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <code className={`block text-xs break-all p-2 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-800'} font-mono`}>
            {hash.hash}
          </code>
        </div>
      );
    })}
  </div>
);

export default FileHashList;