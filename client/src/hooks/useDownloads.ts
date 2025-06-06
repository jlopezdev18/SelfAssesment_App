// hooks/useDownload.ts
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config"; // Asegúrate de que estén correctamente configurados

interface DownloadItem {
  name: string;
  type: "installer" | "document" | "resource";
  size: string;
  version?: string;
  description: string;
  path: string;
  downloadUrl: string;
}

export const useDownload = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "downloads"));
        const items: DownloadItem[] = [];
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
        console.log(data);
          if (!data.path) {
            console.warn(
              `Documento ${doc.id} tiene un 'path' inválido:`,
              data.path
            );
            continue; // saltar ese documento
          }
          try {
            const fileRef = ref(storage, data.path);
            const url = await getDownloadURL(fileRef);
            items.push({
              name: data.name,
              type: data.type,
              size: data.size,
              version: data.version,
              description: data.description,
              path: data.path,
              downloadUrl: url,
            });
          } catch (err) {
            console.error(`Error obteniendo URL de ${data.path}:`, err);
          }
        }

        setDownloads(items);
      } catch (error) {
        console.error("Error fetching downloads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  return { downloads, loading };
};
