export interface DownloadItem {
  id: string;
  name: string;
  type: "installers" | "documents" | "resources" | "updates";
  size?: string;
  updated?: string;
  path?: string;
  downloadUrl: string;
  hashes?: Array<{ algorithm: string; hash: string }>;
}

export interface DownloadsProps {
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
