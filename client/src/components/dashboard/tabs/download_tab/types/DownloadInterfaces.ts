export interface DownloadItem {
  name: string;
  type: "installers" | "documents" | "resources";
  size: string;
  version?: string;
  description: string;
  downloadUrl: string;
}

export interface DownloadsProps {
  downloadItems: DownloadItem[];
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
  getTypeIcon: (type: string) => React.ReactNode;
  onAddItem?: (item: DownloadItem) => void;
}