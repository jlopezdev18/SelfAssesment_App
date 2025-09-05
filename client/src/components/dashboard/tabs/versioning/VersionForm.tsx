import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Save,
  X,
  Upload,
  Package,
  RefreshCw,
  Hash,
  FileText,
} from "lucide-react";
import type { VersionFormData } from "./types/VersioningInterfaces";
import { useState } from "react";

interface VersionFormProps {
  darkMode: boolean;
  textClass: string;
  mutedTextClass: string;
  formData: VersionFormData;
  setFormData: React.Dispatch<React.SetStateAction<VersionFormData>>;
  setSelectedInstallerFile: (file: File | null) => void;
  setSelectedUpdateFile: (file: File | null) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isEdit: boolean;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const VersionForm: React.FC<VersionFormProps> = ({
  formData,
  setFormData,
  setSelectedInstallerFile,
  setSelectedUpdateFile,
  onCancel,
  onSubmit,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const isInstallerReady =
    !!formData.files.installer.filename && !!formData.files.installer.size;
  const isUpdateReady =
    !!formData.files.update.filename && !!formData.files.update.size;
  const isSaveDisabled = !isInstallerReady && !isUpdateReady;

  const handleVersionChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      await onSubmit();
    } finally {
      setIsUploading(false);
    }
  };

  const handleHashChange = (
    fileType: "installer" | "update",
    algorithm: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: {
          ...prev.files[fileType],
          hashes: prev.files[fileType].hashes.map((h) =>
            h.algorithm === algorithm ? { ...h, hash: value } : h
          ),
        },
      },
    }));
  };

  const handleFileInfo = (fileType: "installer" | "update", file: File) => {
    setFormData((prev: VersionFormData) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: {
          ...prev.files[fileType],
          filename: file.name,
          size: formatBytes(file.size),
          downloadId: prev.files[fileType].downloadId,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Version Info */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold">Version Information</h4>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Version
              </label>
              <Input
                type="text"
                value={formData.version}
                onChange={(e) => handleVersionChange("version", e.target.value)}
                placeholder="e.g., 1.5.0"
                className="bg-white/70 dark:bg-gray-800/70 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Release Type
              </label>
              <Input
                type="text"
                value={formData.releaseType}
                onChange={(e) =>
                  handleVersionChange("releaseType", e.target.value)
                }
                placeholder="e.g., Q3 2024 Release"
                className="bg-white/70 dark:bg-gray-800/70 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleVersionChange("description", e.target.value)
                }
                rows={3}
                placeholder="Enter version description"
                className="bg-white/70 dark:bg-gray-800/70 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installer File */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50/50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-lg font-semibold">Installer File</h4>
            {isInstallerReady && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Ready
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Upload Installer
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Input
                  type="file"
                  accept=".exe,.zip,.msi"
                  id="installer-upload"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white/70 dark:bg-gray-800/70"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedInstallerFile(e.target.files[0]);
                      handleFileInfo("installer", e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
            {formData.files.installer.filename && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formData.files.installer.filename}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Size: {formData.files.installer.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        files: {
                          ...prev.files,
                          installer: {
                            ...prev.files.installer,
                            filename: "",
                            size: "",
                          },
                        },
                      }))
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              <Hash className="w-4 h-4" />
              File Hashes
            </label>
            <div className="space-y-3">
              {formData.files.installer.hashes.map((hashObj) => (
                <div key={hashObj.algorithm} className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                    {hashObj.algorithm}
                  </label>
                  <Input
                    type="text"
                    value={hashObj.hash}
                    onChange={(e) =>
                      handleHashChange(
                        "installer",
                        hashObj.algorithm,
                        e.target.value
                      )
                    }
                    className="font-mono text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={`Enter ${hashObj.algorithm} hash`}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update File */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50/50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <RefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className="text-lg font-semibold">Update File</h4>
            {isUpdateReady && (
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                Ready
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Upload Update
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Input
                  type="file"
                  accept=".exe,.zip,.msi"
                  id="update-upload"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 bg-white/70 dark:bg-gray-800/70"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedUpdateFile(e.target.files[0]);
                      handleFileInfo("update", e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
            {formData.files.update.filename && (
              <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formData.files.update.filename}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Size: {formData.files.update.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        files: {
                          ...prev.files,
                          update: {
                            ...prev.files.update,
                            filename: "",
                            size: "",
                          },
                        },
                      }))
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              <Hash className="w-4 h-4" />
              File Hashes
            </label>
            <div className="space-y-3">
              {formData.files.update.hashes.map((hashObj) => (
                <div key={hashObj.algorithm} className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                    {hashObj.algorithm}
                  </label>
                  <Input
                    type="text"
                    value={hashObj.hash}
                    onChange={(e) =>
                      handleHashChange(
                        "update",
                        hashObj.algorithm,
                        e.target.value
                      )
                    }
                    className="font-mono text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={`Enter ${hashObj.algorithm} hash`}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={onCancel}
          className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSaveDisabled}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Version
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VersionForm;
