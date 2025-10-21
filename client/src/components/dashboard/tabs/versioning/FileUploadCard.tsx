/**
 * Reusable file upload card component for version files
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Package, RefreshCw } from "lucide-react";
import { HashInputSection } from "./HashInputSection";

interface FileUploadCardProps {
  fileType: "installer" | "update";
  title: string;
  filename: string;
  size: string;
  hashes: Array<{ algorithm: string; hash: string }>;
  acceptedExtensions?: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onHashChange: (algorithm: string, value: string) => void;
  darkMode?: boolean;
}

export function FileUploadCard({
  fileType,
  title,
  filename,
  size,
  hashes,
  acceptedExtensions = ".exe,.zip,.msi",
  onFileSelect,
  onFileRemove,
  onHashChange,
  darkMode = false,
}: FileUploadCardProps) {
  const isReady = !!filename && !!size;

  const colorScheme = fileType === "installer"
    ? {
        gradient: "from-green-50/50 to-white dark:from-gray-800/50 dark:to-gray-900/50",
        iconBg: "bg-green-100 dark:bg-green-900",
        iconColor: "text-green-600 dark:text-green-400",
        badgeBg: "bg-green-100 text-green-700 hover:bg-green-100",
        fileBg: "bg-blue-50 dark:bg-blue-900/20",
        fileBorder: "border-blue-200 dark:border-blue-800",
        uploadBg: "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",
        inputBorder: "border-blue-200 dark:border-blue-800",
        icon: <Package className="w-5 h-5" />,
      }
    : {
        gradient: "from-orange-50/50 to-white dark:from-gray-800/50 dark:to-gray-900/50",
        iconBg: "bg-orange-100 dark:bg-orange-900",
        iconColor: "text-orange-600 dark:text-orange-400",
        badgeBg: "bg-orange-100 text-orange-700 hover:bg-orange-100",
        fileBg: "bg-orange-50 dark:bg-orange-900/20",
        fileBorder: "border-orange-200 dark:border-orange-800",
        uploadBg: "file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100",
        inputBorder: "border-orange-200 dark:border-orange-800",
        icon: <RefreshCw className="w-5 h-5" />,
      };

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${colorScheme.gradient}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colorScheme.iconBg} rounded-lg`}>
            <div className={colorScheme.iconColor}>{colorScheme.icon}</div>
          </div>
          <h4 className="text-lg font-semibold">{title}</h4>
          {isReady && (
            <Badge className={colorScheme.badgeBg}>Ready</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Upload {title}
          </label>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="file"
                accept={acceptedExtensions}
                id={`${fileType}-upload`}
                className={`file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 ${colorScheme.uploadBg} bg-white/70 dark:bg-gray-800/70`}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFileSelect(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
          {filename && (
            <div className={`mt-3 p-3 ${colorScheme.fileBg} rounded-lg border ${colorScheme.fileBorder}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className={`w-4 h-4 ${colorScheme.iconColor}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {filename}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Size: {size}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onFileRemove}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        <HashInputSection
          hashes={hashes}
          onChange={onHashChange}
          darkMode={darkMode}
        />
      </CardContent>
    </Card>
  );
}
