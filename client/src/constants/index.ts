/**
 * Application-wide constants
 */

// File types
export const FILE_TYPES = {
  INSTALLERS: "installers",
  DOCUMENTS: "documents",
  RESOURCES: "resources",
  UPDATES: "updates",
  INSTALLER: "installer",
  UPDATE: "update",
} as const;

export type FileType = typeof FILE_TYPES[keyof typeof FILE_TYPES];

// Hash algorithms
export const HASH_ALGORITHMS = {
  SHA512: "SHA512",
  SHA384: "SHA384",
  SHA256: "SHA256",
} as const;

export const DEFAULT_HASH_LIST = [
  { algorithm: HASH_ALGORITHMS.SHA512, hash: "" },
  { algorithm: HASH_ALGORITHMS.SHA384, hash: "" },
  { algorithm: HASH_ALGORITHMS.SHA256, hash: "" },
];

// Release types
export const RELEASE_TYPES = {
  STABLE: "stable",
  BETA: "beta",
  ALPHA: "alpha",
} as const;

export type ReleaseType = typeof RELEASE_TYPES[keyof typeof RELEASE_TYPES];

// Pagination
export const PAGINATION = {
  VERSIONS_PER_PAGE: 3,
  ROWS_PER_PAGE: 10,
  DEFAULT_PAGE: 0,
} as const;

// File upload
export const FILE_UPLOAD = {
  ACCEPTED_EXTENSIONS: ".exe,.zip,.msi",
  STORAGE_PATHS: {
    INSTALLERS: "downloads/installers",
    UPDATES: "downloads/updates",
    DOCUMENTS: "downloads/documents",
    RESOURCES: "downloads/resources",
  },
} as const;

// Status
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;

export type Status = typeof STATUS[keyof typeof STATUS];
