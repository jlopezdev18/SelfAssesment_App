import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
            <Badge variant="secondary" className="font-mono text-xs">
              {hash.algorithm}
            </Badge>
            <Button
              size="sm"
              variant={copiedHash === hashId ? "secondary" : "outline"}
              onClick={() => onCopy(hash.hash, hashId)}
              className="flex items-center space-x-2"
            >
              {copiedHash === hashId ? (
                <>
                  <span>✓</span>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <span>⧉</span>
                  <span>Copy</span>
                </>
              )}
            </Button>
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