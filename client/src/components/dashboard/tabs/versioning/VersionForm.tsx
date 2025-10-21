import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Save, X, FileText } from "lucide-react";
import type { VersionFormData } from "./types/VersioningInterfaces";
import { FileUploadCard } from "./FileUploadCard";
import { formatBytes } from "@/utils/formatters";
import { FILE_UPLOAD } from "@/constants";

interface VersionFormProps {
  formData: VersionFormData;
  setFormData: React.Dispatch<React.SetStateAction<VersionFormData>>;
  setSelectedInstallerFile: (file: File | null) => void;
  setSelectedUpdateFile: (file: File | null) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const VersionForm: React.FC<VersionFormProps> = ({
  formData,
  setFormData,
  setSelectedInstallerFile,
  setSelectedUpdateFile,
  onCancel,
  onSubmit,
}) => {
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
    await onSubmit();
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

  const handleFileSelect = (fileType: "installer" | "update", file: File) => {
    if (fileType === "installer") {
      setSelectedInstallerFile(file);
    } else {
      setSelectedUpdateFile(file);
    }

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

  const handleFileRemove = (fileType: "installer" | "update") => {
    if (fileType === "installer") {
      setSelectedInstallerFile(null);
    } else {
      setSelectedUpdateFile(null);
    }

    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: {
          ...prev.files[fileType],
          filename: "",
          size: "",
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
                placeholder="e.g., stable"
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
      <FileUploadCard
        fileType="installer"
        title="Installer File"
        filename={formData.files.installer.filename}
        size={formData.files.installer.size}
        hashes={formData.files.installer.hashes}
        acceptedExtensions={FILE_UPLOAD.ACCEPTED_EXTENSIONS}
        onFileSelect={(file) => handleFileSelect("installer", file)}
        onFileRemove={() => handleFileRemove("installer")}
        onHashChange={(algorithm, value) =>
          handleHashChange("installer", algorithm, value)
        }
      />

      {/* Update File */}
      <FileUploadCard
        fileType="update"
        title="Update File"
        filename={formData.files.update.filename}
        size={formData.files.update.size}
        hashes={formData.files.update.hashes}
        acceptedExtensions={FILE_UPLOAD.ACCEPTED_EXTENSIONS}
        onFileSelect={(file) => handleFileSelect("update", file)}
        onFileRemove={() => handleFileRemove("update")}
        onHashChange={(algorithm, value) =>
          handleHashChange("update", algorithm, value)
        }
      />

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={onCancel}
          className="px-6 py-2 border-gray-300 text-gray-200  "
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSaveDisabled}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Version
        </Button>
      </div>
    </div>
  );
};

export default VersionForm;
