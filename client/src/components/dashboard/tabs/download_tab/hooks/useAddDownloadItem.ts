import { useState } from "react";
import { ref, uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
import { db, storage } from "../../../../../firebase/config";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import type { DownloadItem } from "../types/DownloadInterfaces";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function useAddDownloadItem(onAddItem?: (item: DownloadItem) => void) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const addItem = async (
    newItem: DownloadItem,
    file: File | null,
    resetForm: () => void
  ) => {
    setUploadError(null);
    if (!file) {
      setUploadError("Please select a file.");
      return;
    }
    setUploading(true);
    try {
      const path = `downloads/${newItem.type}/${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      const metadata = await getMetadata(storageRef);

      // Get size from metadata and version from newItem (if exists)
      const size = formatBytes(metadata.size || file.size || 0);
      const updated = metadata.updated
        ? new Date(metadata.updated).toLocaleString()
        : new Date().toLocaleString();

      const docRef = await addDoc(collection(db, "downloads"), {
        id: "",
        name: file.name,
        path,
        type: newItem.type,
        updated,
        size,
      });
      
      await updateDoc(docRef, { id: docRef.id });

      const itemToAdd = {
        ...newItem,
        id: docRef.id,
        name: file.name,
        size,
        updated,
        downloadUrl,
      };

      if (onAddItem) onAddItem(itemToAdd);
      resetForm();
    } catch (err) {
      setUploadError("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadError, setUploadError, addItem };
}