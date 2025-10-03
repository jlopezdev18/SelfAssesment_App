import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  listAll,
  deleteObject,
} from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db, storage } from "../../../../../firebase/config";
import type { DownloadItem } from "../types/DownloadInterfaces";
import type { VersionFile } from "../../versioning/types/VersioningInterfaces";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export interface GroupedVersion {
  id: string;
  version: string;
  releaseDate: string;
  releaseType: string;
  description: string;
  files: DownloadItem[];
}

export function useDownloadManager() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [groupedVersions, setGroupedVersions] = useState<GroupedVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Real-time Firestore listener for downloads
  useEffect(() => {
    const q = query(collection(db, "downloads"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        // Set loading true before async fetch
        setLoading(true);
        (async () => {
          const folders: DownloadItem["type"][] = [
            "installers",
            "updates",
            "resources",
            "documents",
          ];
          // Map Firestore docs by path for quick lookup
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
          const firestoreData: Record<string, FirestoreDownloadData> = {};
          snapshot.docs.forEach((doc) => {
            const data = doc.data() as FirestoreDownloadData;
            firestoreData[data.path] = { ...data, id: doc.id };
          });

          // Fetch all storage items in parallel
          const allItems = await Promise.all(
            folders.map(async (folder) => {
              const folderRef = ref(storage, `downloads/${folder}`);
              const res = await listAll(folderRef);
              // Fetch metadata and URLs in parallel for each file
              const fileItems = await Promise.all(
                res.items.map(async (itemRef) => {
                  const path = `downloads/${folder}/${itemRef.name}`;
                  const [url, metadata] = await Promise.all([
                    getDownloadURL(itemRef),
                    getMetadata(itemRef),
                  ]);
                  const firestoreItem = firestoreData[path];
                  return {
                    id: firestoreItem?.id || itemRef.name,
                    name: itemRef.name,
                    path,
                    type: folder,
                    size: formatBytes(metadata.size || 0),
                    downloadUrl: url,
                    updated: metadata.updated || new Date().toLocaleString(),
                    ...(["installers", "updates"].includes(folder) &&
                    firestoreItem?.hashes
                      ? { hashes: firestoreItem.hashes }
                      : {}),
                  } as DownloadItem;
                })
              );
              return fileItems;
            })
          );
          // Flatten and sort by updated date desc
          const flat = allItems.flat().sort((a, b) => {
            const dateA = a.updated ? new Date(a.updated).getTime() : 0;
            const dateB = b.updated ? new Date(b.updated).getTime() : 0;
            return dateB - dateA;
          });
          setDownloads(flat);
          setLoading(false);
        })();
      },
      (error) => {
        setLoading(false);
        console.error("Error fetching files:", error);
      }
    );
    return () => unsub();
  }, []);

  // For manual refresh (rarely needed now)
  const fetchDownloads = async () => {
    setLoading(true);
    // Just trigger the effect by toggling state
    setLoading(false);
  };

  const addItem = async (
    newItem: DownloadItem,
    file: File | null,
    resetForm: () => void,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    setUploadError(null);
    if (!file) {
      const error = "Please select a file.";
      setUploadError(error);
      onError?.(error);
      return;
    }
    setUploading(true);
    try {
      const path = `downloads/${newItem.type}/${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      await getDownloadURL(storageRef); // value not used
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

      // Optimistic UI: don't wait for refetch, just call onSuccess/resetForm
      onSuccess?.();
      resetForm();
      // No need to call fetchDownloads, real-time listener will update
    } catch (err) {
      const errorMessage = "Upload failed: " + (err as Error).message;
      setUploadError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (
    item: DownloadItem,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      // NO setLoading aquí - el listener maneja la actualización

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

          // Check and remove file from version's files array
          if (versionData.files) {
            const updatedFiles: VersionFile[] = versionData.files.filter(
              (file: VersionFile) => file.filename !== item.name
            );

            if (updatedFiles.length !== versionData.files.length) {
              // Update version document if files were modified
              await updateDoc(doc(db, "versions", versionDoc.id), {
                files: updatedFiles,
              });
            }
          }
        }
      }

      // Optimistic UI: onSuccess immediately, real-time listener will update
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting file:", error);
      onError?.("Failed to delete the file. Please try again.");
    }
    // NO finally con setLoading - el listener lo maneja
  };

  const deleteVersion = async (
    versionId: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      // Get version data
      const versionDoc = await getDocs(
        query(collection(db, "versions"))
      );
      const version = versionDoc.docs.find((doc) => doc.id === versionId);
      
      if (!version) {
        throw new Error("Version not found");
      }

      const versionData = version.data();
      const files: VersionFile[] = versionData.files || [];

      // Delete all files from storage and downloads collection
      for (const file of files) {
        const path = `downloads/${file.type === 'installer' ? 'installers' : 'updates'}/${file.filename}`;
        
        // Delete from Storage
        try {
          const storageRef = ref(storage, path);
          await deleteObject(storageRef);
        } catch (err) {
          console.warn(`Failed to delete storage file: ${path}`, err);
        }

        // Delete from Firestore downloads collection
        if (file.downloadId) {
          try {
            await deleteDoc(doc(db, "downloads", file.downloadId));
          } catch (err) {
            console.warn(`Failed to delete download doc: ${file.downloadId}`, err);
          }
        }
      }

      // Delete version document
      await deleteDoc(doc(db, "versions", versionId));

      onSuccess?.();
    } catch (error) {
      console.error("Error deleting version:", error);
      onError?.("Failed to delete the version. Please try again.");
    }
  };

  // Real-time listener for versions to create grouped view
  useEffect(() => {
    const q = query(collection(db, "versions"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const versions: GroupedVersion[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Convert version files to DownloadItems
          const versionFiles: DownloadItem[] = (data.files || []).map((file: VersionFile) => ({
            id: file.downloadId || '',
            name: file.filename,
            path: `downloads/${file.type === 'installer' ? 'installers' : 'updates'}/${file.filename}`,
            type: file.type === 'installer' ? 'installers' as const : 'updates' as const,
            size: file.size,
            downloadUrl: '', // Will be fetched from storage if needed
            updated: data.releaseDate || new Date().toISOString(),
            hashes: file.hashes,
          }));

          return {
            id: doc.id,
            version: data.version,
            releaseDate: data.releaseDate,
            releaseType: data.releaseType,
            description: data.description,
            files: versionFiles,
          };
        });

        setGroupedVersions(versions.sort((a, b) => {
          const dateA = new Date(a.releaseDate).getTime();
          const dateB = new Date(b.releaseDate).getTime();
          return dateB - dateA;
        }));
      },
      (error) => {
        console.error("Error fetching versions:", error);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    fetchDownloads();
  }, []);

  return {
    downloads,
    groupedVersions,
    loading,
    uploading,
    uploadError,
    setUploadError,
    addItem,
    deleteItem,
    deleteVersion,
    fetchDownloads,
  };
}
