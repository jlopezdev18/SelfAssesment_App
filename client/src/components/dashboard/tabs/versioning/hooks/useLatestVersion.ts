import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { db } from "../../../../../firebase/config";
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

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
    // Determine the folder based on file type
    const folder = file.type === "installer" ? "installers" : "updates";
    const path = `downloads/${folder}/${file.filename}`;

    // Prepare download data
    const downloadsRef = collection(db, "downloads");
    const downloadData = {
      name: file.filename,
      path: path,
      type: folder,
      size: file.size,
      updated: new Date().toISOString(),
      downloadUrl: file.downloadUrl,
      hashes: file.hashes
    };

    // Add new document to downloads collection
    const docRef = await addDoc(downloadsRef, downloadData);
    await updateDoc(doc(db, "downloads", docRef.id), { id: docRef.id });

    return docRef.id;
  } catch (error) {
    console.error("Error syncing file with downloads:", error);
    throw error;
  }
}

export function useLatestVersion() {
  const [data, setData] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestVersion = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/versions/latest");
      setData(response.data as VersionData);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestVersion();
  }, [fetchLatestVersion]);

  const addVersion = async (versionData: VersionData) => {
    setLoading(true);
    try {
      // First sync files with downloads collection
      const updatedFiles = await Promise.all(
        versionData.files.map(async (file) => {
          const downloadId = await syncFileWithDownloads(file);
          return { ...file, downloadId };
        })
      );

      // Update version data with download references
      const updatedVersionData = {
        ...versionData,
        files: updatedFiles
      };

      const response = await axios.post(
        "http://localhost:4000/api/versions",
        updatedVersionData
      );

      await fetchLatestVersion();
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

  const updateVersion = async (id: string | undefined, versionData: VersionData) => {
    setLoading(true);
    try {
      // Sync updated files with downloads collection
      const updatedFiles = await Promise.all(
        versionData.files.map(async (file) => {
          if (file.downloadId) {
            // Update existing download document
            await updateDoc(doc(db, "downloads", file.downloadId), {
              name: file.filename,
              size: file.size,
              downloadUrl: file.downloadUrl,
              hashes: file.hashes,
              updated: new Date().toISOString()
            });
            return file;
          } else {
            // Create new download document for new files
            const downloadId = await syncFileWithDownloads(file);
            return { ...file, downloadId };
          }
        })
      );

      // Update version with the latest file information
      const updatedVersionData = {
        ...versionData,
        files: updatedFiles
      };

      await axios.put(
        `http://localhost:4000/api/versions/${id}`,
        updatedVersionData
      );

      await fetchLatestVersion();
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
      // Get version data to find associated downloads
      const versionToDelete = data?.id === id ? data : null;
      
      if (versionToDelete) {
        // Delete associated downloads
        await Promise.all(
          versionToDelete.files.map(async (file) => {
            if (file.downloadId) {
              await deleteDoc(doc(db, "downloads", file.downloadId));
            }
          })
        );
      }

      await axios.delete(`http://localhost:4000/api/versions/${id}`);
      await fetchLatestVersion();
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