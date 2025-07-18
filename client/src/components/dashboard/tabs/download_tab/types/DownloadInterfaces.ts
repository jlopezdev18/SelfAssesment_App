export interface DownloadItem {
  id?: string; 
  name: string;
  type: "installers" | "documents" | "resources" | "updates";
  size?: string;
  updated?: string;
  path?: string;
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

export interface DownloadsListProps {
  items: DownloadItem[];
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
  getTypeIcon: (type: string) => React.ReactNode;
}