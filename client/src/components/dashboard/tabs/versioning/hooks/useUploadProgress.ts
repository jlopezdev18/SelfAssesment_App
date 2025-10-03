import { useState, useCallback } from 'react';

export interface FileUploadStatus {
  fileName: string;
  status: 'pending' | 'uploading' | 'completed';
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

interface UploadProgressState {
  isUploading: boolean;
  progress: number;
  currentFile: string | null;
  totalFiles: number;
  uploadedFiles: number;
  bytesTransferred: number;
  totalBytes: number;
  currentFileProgress: number;
  fileStatuses: FileUploadStatus[];
}

export const useUploadProgress = () => {
  const [uploadState, setUploadState] = useState<UploadProgressState>({
    isUploading: false,
    progress: 0,
    currentFile: null,
    totalFiles: 0,
    uploadedFiles: 0,
    bytesTransferred: 0,
    totalBytes: 0,
    currentFileProgress: 0,
    fileStatuses: [],
  });

  const startUpload = useCallback((totalFiles: number, fileNames?: string[]) => {
    const initialStatuses: FileUploadStatus[] = fileNames 
      ? fileNames.map(name => ({
          fileName: name,
          status: 'pending' as const,
          progress: 0,
          bytesTransferred: 0,
          totalBytes: 0,
        }))
      : [];

    setUploadState({
      isUploading: true,
      progress: 0,
      currentFile: null,
      totalFiles,
      uploadedFiles: 0,
      bytesTransferred: 0,
      totalBytes: 0,
      currentFileProgress: 0,
      fileStatuses: initialStatuses,
    });
  }, []);

  const updateProgress = useCallback((
    fileName: string,
    bytesTransferred: number,
    totalBytes: number,
    fileIndex: number,
    totalFiles: number
  ) => {
    const fileProgress = (bytesTransferred / totalBytes) * 100;
    const baseProgress = (fileIndex / totalFiles) * 100;
    const currentFileContribution = (1 / totalFiles) * 100;
    const overallProgress = baseProgress + (fileProgress / 100) * currentFileContribution;

    setUploadState((prev) => {
      const updatedStatuses = prev.fileStatuses.map((file, idx) => {
        if (idx === fileIndex) {
          return {
            ...file,
            status: 'uploading' as const,
            progress: fileProgress,
            bytesTransferred,
            totalBytes,
          };
        }
        return file;
      });

      return {
        ...prev,
        currentFile: fileName,
        progress: overallProgress,
        bytesTransferred,
        totalBytes,
        currentFileProgress: fileProgress,
        fileStatuses: updatedStatuses,
      };
    });
  }, []);

  const completeFile = useCallback((fileName: string) => {
    setUploadState((prev) => {
      const newUploadedFiles = prev.uploadedFiles + 1;
      const newProgress = (newUploadedFiles / prev.totalFiles) * 100;

      const updatedStatuses = prev.fileStatuses.map((file) => {
        if (file.fileName === fileName) {
          return {
            ...file,
            status: 'completed' as const,
            progress: 100,
          };
        }
        return file;
      });

      return {
        ...prev,
        uploadedFiles: newUploadedFiles,
        progress: newProgress,
        currentFile: fileName,
        currentFileProgress: 100,
        fileStatuses: updatedStatuses,
      };
    });
  }, []);

  const finishUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 100,
      currentFile: null,
      totalFiles: 0,
      uploadedFiles: 0,
      bytesTransferred: 0,
      totalBytes: 0,
      currentFileProgress: 100,
      fileStatuses: [],
    });
  }, []);

  const cancelUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      currentFile: null,
      totalFiles: 0,
      uploadedFiles: 0,
      bytesTransferred: 0,
      totalBytes: 0,
      currentFileProgress: 0,
      fileStatuses: [],
    });
  }, []);

  return {
    uploadState,
    startUpload,
    updateProgress,
    completeFile,
    finishUpload,
    cancelUpload,
  };
};
