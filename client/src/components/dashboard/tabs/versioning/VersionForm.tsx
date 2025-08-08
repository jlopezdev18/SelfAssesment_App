import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, X } from "lucide-react";
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
      <Card>
        <CardContent className="space-y-4 p-6">
          <h4 className="text-lg font-semibold mb-4">Version Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Version</label>
              <Input
                type="text"
                value={formData.version}
                onChange={(e) => handleVersionChange("version", e.target.value)}
                placeholder="e.g., 1.5.0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Release Type</label>
              <Input
                type="text"
                value={formData.releaseType}
                onChange={(e) => handleVersionChange("releaseType", e.target.value)}
                placeholder="e.g., Q3 2024 Release"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleVersionChange("description", e.target.value)}
                rows={3}
                placeholder="Enter version description"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installer File */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h4 className="text-lg font-semibold mb-4">Installer File</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Upload Installer</label>
              <div className="flex items-center space-x-3">
                <Input
                  type="file"
                  accept=".exe,.zip,.msi"
                  id="installer-upload"
                  className="w-auto"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedInstallerFile(e.target.files[0]);
                      handleFileInfo("installer", e.target.files[0]);
                    }
                  }}
                />
                {formData.files.installer.filename && (
                  <div className="text-xs">
                    <span className="font-semibold">Filename:</span> {formData.files.installer.filename}
                    {" | "}
                    <span className="font-semibold">Size:</span> {formData.files.installer.size}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="ml-2"
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
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">File Hashes</label>
            {formData.files.installer.hashes.map((hashObj) => (
              <div key={hashObj.algorithm} className="mb-2">
                <label className="block text-xs font-medium mb-1">{hashObj.algorithm}</label>
                <Input
                  type="text"
                  value={hashObj.hash}
                  onChange={(e) =>
                    handleHashChange("installer", hashObj.algorithm, e.target.value)
                  }
                  className="font-mono text-sm"
                  placeholder={`Enter ${hashObj.algorithm} hash`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update File */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h4 className="text-lg font-semibold mb-4">Update File</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Upload Update</label>
              <div className="flex items-center space-x-3">
                <Input
                  type="file"
                  accept=".exe,.zip,.msi"
                  id="update-upload"
                  className="w-auto"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedUpdateFile(e.target.files[0]);
                      handleFileInfo("update", e.target.files[0]);
                    }
                  }}
                />
                {formData.files.update.filename && (
                  <div className="text-xs">
                    <span className="font-semibold">Filename:</span> {formData.files.update.filename}
                    {" | "}
                    <span className="font-semibold">Size:</span> {formData.files.update.size}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="ml-2"
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
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">File Hashes</label>
            {formData.files.update.hashes.map((hashObj) => (
              <div key={hashObj.algorithm} className="mb-2">
                <label className="block text-xs font-medium mb-1">{hashObj.algorithm}</label>
                <Input
                  type="text"
                  value={hashObj.hash}
                  onChange={(e) =>
                    handleHashChange("update", hashObj.algorithm, e.target.value)
                  }
                  className="font-mono text-sm"
                  placeholder={`Enter ${hashObj.algorithm} hash`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaveDisabled}>
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