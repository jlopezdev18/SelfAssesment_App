import React from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import type { DownloadItem } from "./types/DownloadInterfaces";

interface AddDownloadModalProps {
  open: boolean;
  onClose: () => void;
  newItem: DownloadItem;
  setNewItem: (item: DownloadItem) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  uploading: boolean;
  uploadError: string | null;
  onAdd: () => void;
  textClass: string;
  cardClass: string;
  darkMode: boolean;
}

const AddDownloadModal: React.FC<AddDownloadModalProps> = ({
  open,
  onClose,
  newItem,
  setNewItem,
  file,
  setFile,
  uploading,
  uploadError,
  onAdd,
  textClass,
  cardClass,
  darkMode,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardClass} rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${textClass}`}>Add New Item</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
              disabled={uploading}
            >
              <FaTimes className={`w-5 h-5 ${textClass}`} />
            </button>
          </div>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>Name *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="Enter item name"
                disabled={uploading}
              />
            </div>
            {/* Type */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>Type *</label>
              <select
                value={newItem.type}
                onChange={e => setNewItem({ ...newItem, type: e.target.value as "installers" | "documents" | "resources" })}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                disabled={uploading}
              >
                <option value="installers">Installer</option>
                <option value="documents">Document</option>
                <option value="resources">Resource</option>
              </select>
            </div>
            {/* Size */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>Size *</label>
              <input
                type="text"
                value={newItem.size}
                onChange={e => setNewItem({ ...newItem, size: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="e.g., 25 MB, 1.2 GB"
                disabled={uploading}
              />
            </div>
            {/* Version */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>Version</label>
              <input
                type="text"
                value={newItem.version}
                onChange={e => setNewItem({ ...newItem, version: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="e.g., v1.0.0 (optional)"
                disabled={uploading}
              />
            </div>
            {/* Description */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>Description *</label>
              <textarea
                value={newItem.description}
                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none`}
                placeholder="Brief description of the item"
                disabled={uploading}
              />
            </div>
            {/* File */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>Upload File *</label>
              <input
                type="file"
                accept="*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full"
                disabled={uploading}
              />
              {file && (
                <div className="mt-1 text-xs text-green-600">Selected: {file.name}</div>
              )}
            </div>
            {uploadError && <div className="text-red-600 text-sm">{uploadError}</div>}
            {uploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <FaSpinner className="animate-spin" /> Uploading...
              </div>
            )}
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-lg border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"} transition-colors`}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={uploading || !newItem.name || !newItem.description || !file || !newItem.size}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" /> Uploading...
                </span>
              ) : (
                "Add Item"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDownloadModal;