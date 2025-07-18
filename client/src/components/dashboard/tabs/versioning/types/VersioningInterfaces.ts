export interface HashInfo {
  algorithm: string;
  hash: string;
}

export interface VersionFile {
  filename: string;
  hashes: HashInfo[];
  size?: string;
  type: 'installer' | 'update';
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

export type FileType = 'installer' | 'update';
interface FileData {
  filename: string;
  type: FileType;
  size: string;
  downloadUrl: string;
  hashes: HashInfo[];
}

interface FilesData {
  installer: FileData & { type: 'installer' };
  update: FileData & { type: 'update' };
}

export interface VersionFormData {
  version: string;
  releaseDate: string;
  releaseType: string;
  description: string;
  files: FilesData;
}