import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { db, storage } from "../../../../../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface VersionFile {
  id: string;
  filename: string;
  type: string;
  size: string;
  downloadUrl: string;
  hashes: { algorithm: string; hash: string }[];
  downloadId?: string;
}

export interface VersionData {
  version: string;
  releaseDate: string;
  releaseType: string;
  description: string;
  files: VersionFile[];
  id?: string;
}

async function syncFileWithDownloads(file: VersionFile) {
  try {
    const folder = file.type === "installer" ? "installers" : "updates";
    const path = `downloads/${folder}/${file.filename}`;

    const downloadsRef = collection(db, "downloads");
    const downloadData = {
      name: file.filename,
      path: path,
      type: folder,
      size: file.size,
      updated: new Date().toISOString(),
      downloadUrl: file.downloadUrl,
      hashes: file.hashes,
    };

    const docRef = await addDoc(downloadsRef, downloadData);
    await updateDoc(doc(db, "downloads", docRef.id), { downloadId: docRef.id });

    return docRef.id;
  } catch (error) {
    console.error("Error syncing file with downloads:", error);
    throw error;
  }
}

export function useAllVersions() {
  const [data, setData] = useState<VersionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllVersions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/versions`);
      setData(response.data as VersionData[]);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllVersions();
  }, [fetchAllVersions]);

  const addVersion = async (versionData: VersionData) => {
    setLoading(true);
    try {
      const updatedFiles = await Promise.all(
        versionData.files.map(async (file) => {
          const downloadId = await syncFileWithDownloads(file);
          return { ...file, downloadId };
        })
      );

      const updatedVersionData = {
        ...versionData,
        files: updatedFiles,
      };

      const response = await axios.post(
        `${API_URL}/api/versions`,
        updatedVersionData
      );

      await fetchAllVersions();
      setError(null);
      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error creating version");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVersion = async (
    id: string | undefined,
    versionData: VersionData
  ) => {
    setLoading(true);
    try {
      const updatedFiles = await Promise.all(
        versionData.files.map(async (file) => {
          if (file.downloadId) {
            await updateDoc(doc(db, "downloads", file.downloadId), {
              name: file.filename,
              size: file.size,
              downloadUrl: file.downloadUrl,
              hashes: file.hashes,
              updated: new Date().toISOString(),
            });
            return file;
          } else {
            const downloadId = await syncFileWithDownloads(file);
            return { ...file, downloadId };
          }
        })
      );

      const updatedVersionData = {
        ...versionData,
        files: updatedFiles,
      };

      await axios.put(`${API_URL}/api/versions/${id}`, updatedVersionData);

      await fetchAllVersions();
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error updating version");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVersion = async (id: string) => {
    setLoading(true);
    try {
      const versionToDelete = data.find(v => v.id === id);

      if (versionToDelete) {
        await Promise.all(
          versionToDelete.files.map(async (file) => {
            try {
              // Delete from Firestore downloads collection
              if (file.downloadId) {
                await deleteDoc(doc(db, "downloads", file.downloadId));
              }

              // Delete from Firebase Storage
              const folder = file.type === "installer" ? "installers" : "updates";
              const storagePath = `downloads/${folder}/${file.filename}`;
              const storageRef = ref(storage, storagePath);
              await deleteObject(storageRef);
            } catch (fileError) {
              console.warn(`Failed to delete file ${file.filename}:`, fileError);
              // Continue with other files even if one fails
            }
          })
        );
      }

      await axios.delete(`${API_URL}/api/versions/${id}`);
      await fetchAllVersions();
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error deleting version");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addVersion, updateVersion, deleteVersion };
}