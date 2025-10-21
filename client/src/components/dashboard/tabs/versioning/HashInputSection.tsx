/**
 * Reusable hash input section component
 */
import { Input } from "@/components/ui/input";
import { Hash } from "lucide-react";

interface HashInputSectionProps {
  hashes: Array<{ algorithm: string; hash: string }>;
  onChange: (algorithm: string, value: string) => void;
  darkMode?: boolean;
}

export function HashInputSection({
  hashes,
  onChange,
  darkMode = false,
}: HashInputSectionProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
        <Hash className="w-4 h-4" />
        File Hashes
      </label>
      <div className="space-y-3">
        {hashes.map((hashObj) => (
          <div key={hashObj.algorithm} className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
              {hashObj.algorithm}
            </label>
            <Input
              type="text"
              value={hashObj.hash}
              onChange={(e) => onChange(hashObj.algorithm, e.target.value)}
              className={`font-mono text-sm ${
                darkMode
                  ? "bg-gray-900 border-gray-600"
                  : "bg-white border-gray-300"
              } focus:border-blue-500 focus:ring-blue-500`}
              placeholder={`Enter ${hashObj.algorithm} hash`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
