import { useEffect, useState } from "react";
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { storage } from "../firebase/config";
import type { DownloadItem } from "../components/dashboard/tabs/download_tab/types/DownloadInterfaces";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const useDownload = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStorageFiles = async () => {
      try {
        const folders: DownloadItem["type"][] = [
          "installers",
          "updates",
          "resources",
          "documents",
        ];
        const items: DownloadItem[] = [];

        for (const folder of folders) {
          const folderRef = ref(storage, `downloads/${folder}`);
          const res = await listAll(folderRef);

          for (const itemRef of res.items) {
            const url = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);
            items.push({
              name: itemRef.name,
              type: folder,
              size: formatBytes(metadata.size || 0),
              path: `downloads/${folder}/${itemRef.name}`,
              downloadUrl: url,
              id: ""
            });
          }
        }

        setDownloads(items);
      } catch (error) {
        console.error("Error fetching files from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStorageFiles();
  }, []);

  return { downloads, loading };
};