import { useEffect, useState } from "react";
import axios from "axios";

export interface VersionFile {
  id: string;
  filename: string;
  type: string;
  size: string;
  downloadUrl: string;
  hashes: { algorithm: string; hash: string }[];
}

export interface VersionData {
  version: string;
  releaseDate: string;
  releaseType: string;
  description: string;
  files: VersionFile[];
  id?: string; 
}

export function useLatestVersion() {
  const [data, setData] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestVersion = async () => {
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
    };

    fetchLatestVersion();
  }, []);

  const addVersion = async (versionData: VersionData) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/versions", versionData);
      
      const latest = await axios.get("http://localhost:4000/api/versions/latest");
      setData(latest.data as VersionData);
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
      await axios.put(`http://localhost:4000/api/versions/${id}`, versionData);
     
      const latest = await axios.get("http://localhost:4000/api/versions/latest");
      setData(latest.data as VersionData);
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

    return { data, loading, error, addVersion, updateVersion };
  }