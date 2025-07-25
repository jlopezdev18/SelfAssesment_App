import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  listAll,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../../../../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import type { DownloadItem } from "../types/DownloadInterfaces";
import Swal from "sweetalert2";
import type { VersionFile } from "../../versioning/types/VersioningInterfaces";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function useDownloadManager() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const folders: DownloadItem["type"][] = [
        "installers",
        "updates",
        "resources",
        "documents",
      ];
      const items: DownloadItem[] = [];

      // Get all documents from Firestore for hash data
      const downloadDocs = await getDocs(collection(db, "downloads"));
      type FirestoreDownloadData = {
        id: string;
        name: string;
        path: string;
        type: DownloadItem["type"];
        updated: string;
        size: string;
        hashes?: Array<{ algorithm: string; hash: string }>;
        [key: string]: unknown;
      };

      const firestoreData = downloadDocs.docs.reduce((acc: Record<string, FirestoreDownloadData>, doc) => {
        const data = doc.data() as FirestoreDownloadData;
        acc[data.path] = { ...data, id: doc.id };
        return acc;
      }, {} as Record<string, FirestoreDownloadData>);

      // Get all items from Storage maintaining folder structure
      for (const folder of folders) {
        const folderRef = ref(storage, `downloads/${folder}`);
        const res = await listAll(folderRef);

        for (const itemRef of res.items) {
          const path = `downloads/${folder}/${itemRef.name}`;
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);

          // Merge Storage data with Firestore data if available
          const firestoreItem = firestoreData[path];

          items.push({
            id: firestoreItem?.id || itemRef.name, // Use Firestore ID if available
            name: itemRef.name,
            path: path,
            type: folder,
            size: formatBytes(metadata.size || 0),
            downloadUrl: url,
            updated: metadata.updated || new Date().toLocaleString(),
            // Include hashes from Firestore if present and file type is installer/update
            ...(["installers", "updates"].includes(folder) &&
            firestoreItem?.hashes
              ? { hashes: firestoreItem.hashes }
              : {}),
          } as DownloadItem);
        }
      }

      setDownloads(items);
    } catch (error) {
      console.error("Error fetching files:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch files. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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

      const size = formatBytes(metadata.size || file.size || 0);
      const updated = metadata.updated
        ? new Date(metadata.updated).toLocaleString()
        : new Date().toLocaleString();

      const docData = {
        id: "",
        name: file.name,
        path,
        type: newItem.type,
        updated,
        size,
        ...(newItem.type === "installers" || newItem.type === "updates"
          ? { hashes: newItem.hashes || [] }
          : {}),
      };
      const docRef = await addDoc(collection(db, "downloads"), docData);

      await updateDoc(docRef, { id: docRef.id });

      const itemToAdd = {
        ...newItem,
        id: docRef.id,
        name: file.name,
        size,
        updated,
        downloadUrl,
        ...(newItem.type === "installers" || newItem.type === "updates"
          ? { hashes: newItem.hashes || [] }
          : {}),
      };

      setDownloads((prev) => [...prev, itemToAdd]);
      Swal.fire({
        icon: "success",
        title: "File uploaded successfully",
        text: `File ${file.name} has been uploaded successfully.`,
      });
      resetForm();
      await fetchDownloads();
    } catch (err) {
      setUploadError("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (item: DownloadItem) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      setLoading(true);

      // Delete from Storage
      const storageRef = ref(storage, item.path);
      await deleteObject(storageRef);

      // Delete from Firestore downloads collection
      if (!item.id) throw new Error("Download item id is missing.");
      await deleteDoc(doc(db, "downloads", item.id));

      // If file is an installer or update, update versions collection
      if (item.type === "installers" || item.type === "updates") {
        // Get all versions
        const versionsSnapshot = await getDocs(collection(db, "versions"));

        for (const versionDoc of versionsSnapshot.docs) {
          const versionData = versionDoc.data();
          let wasModified = false;

          // Check and remove file from version's files array
          if (versionData.files) {
            const updatedFiles: VersionFile[] = versionData.files.filter(
              (file: VersionFile) => file.filename !== item.name
            );

            if (updatedFiles.length !== versionData.files.length) {
              wasModified = true;
              // Update version document if files were modified
              await updateDoc(doc(db, "versions", versionDoc.id), {
                files: updatedFiles,
              });
            }
          }

          if (wasModified) {
            console.log(
              `Removed file reference from version: ${versionDoc.id}`
            );
          }
        }
      }

      // Update local state
      setDownloads((prev) =>
        prev.filter((download) => download.id !== item.id)
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${item.name} has been deleted.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the file. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  return {
    downloads,
    loading,
    uploading,
    uploadError,
    setUploadError,
    addItem,
    deleteItem,
    fetchDownloads,
  };
}
