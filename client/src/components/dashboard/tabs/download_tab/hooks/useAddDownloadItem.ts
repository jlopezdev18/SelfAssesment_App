import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import type { DownloadItem } from "../types/DownloadInterfaces";

export function useAddDownloadItem(onAddItem?: (item: DownloadItem) => void) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const addItem = async (
    newItem: DownloadItem,
    file: File | null,
    resetForm: () => void
  ) => {
    setUploadError(null);
    if (!newItem.name || !newItem.description || !newItem.size || !file) {
      setUploadError("Please fill all required fields and select a file.");
      return;
    }
    setUploading(true);
    try {
      const path = `downloads/${newItem.type}/${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "downloads"), {
        name: newItem.name,
        description: newItem.description,
        path,
        type: newItem.type,
        version: newItem.version || "",
        size: newItem.size,
      });

      const itemToAdd = {
        ...newItem,
        downloadUrl,
        version: newItem.version || undefined,
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