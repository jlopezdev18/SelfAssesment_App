export interface HashInfo {
  algorithm: string;
  hash: string;
}

export interface VersionFile {
  filename: string;
  hashes: HashInfo[];
  size?: string;
  type: 'installer' | 'update' | 'patch';
}

export interface VersionInfo {
  version: string;
  releaseDate: string;
  releaseType: string;
  description: string;
  files: VersionFile[];
}

export interface VersioningProps {
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
  isAdmin: boolean;
}