import React from "react";
import FileHashList from "./FileHashList";
import type { VersionFile } from "./types/VersioningInterfaces";

interface VersionFileAccordionProps {
  files: VersionFile[];
  expandedFile: string;
  onToggle: (filename: string) => void;
  copiedHash: string;
  onCopy: (hash: string, hashId: string) => void;
  darkMode: boolean;
  textClass: string;
  mutedTextClass: string;
}

const getTypeColor = (type: string, darkMode: boolean) => {
  switch (type) {
    case 'installer':
      return darkMode 
        ? 'bg-blue-900 text-blue-300 border-blue-700' 
        : 'bg-blue-100 text-blue-700 border-blue-200';
    case 'update':
      return darkMode 
        ? 'bg-green-900 text-green-300 border-green-700' 
        : 'bg-green-100 text-green-700 border-green-200';
    default:
      return darkMode 
        ? 'bg-purple-900 text-purple-300 border-purple-700' 
        : 'bg-purple-100 text-purple-700 border-purple-200';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'installer':
      return '📦';
    case 'update':
      return '🔄';
    default:
      return '🔧';
  }
};

const VersionFileAccordion: React.FC<VersionFileAccordionProps> = ({
  files,
  expandedFile,
  onToggle,
  copiedHash,
  onCopy,
  darkMode,
  textClass,
  mutedTextClass,
}) => (
  <div className="space-y-6">
    {files.map((file, fileIndex) => (
      <div key={fileIndex} className={`border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div 
          className={`p-4 cursor-pointer hover:${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}
          onClick={() => onToggle(file.filename)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getTypeIcon(file.type)}</span>
              <div>
                <h4 className={`font-semibold ${textClass}`}>{file.filename}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(file.type, darkMode)}`}>
                    {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                  </span>
                  {file.size && (
                    <span className={`text-sm ${mutedTextClass}`}>{file.size}</span>
                  )}
                </div>
              </div>
            </div>
            <div className={`transform transition-transform ${expandedFile === file.filename ? 'rotate-180' : ''}`}>
              ⌄
            </div>
          </div>
        </div>
        {expandedFile === file.filename && (
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <FileHashList
              hashes={file.hashes}
              fileIndex={fileIndex}
              copiedHash={copiedHash}
              onCopy={onCopy}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
    ))}
  </div>
);

export default VersionFileAccordion;