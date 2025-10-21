/**
 * Custom hook for handling version file uploads
 */
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../../firebase/config";
import { FILE_UPLOAD } from "@/constants";

interface UploadProgressCallbacks {
  onProgress: (
    fileName: string,
    transferred: number,
    total: number,
    index: number,
    totalFiles: number
  ) => void;
  onComplete: (fileName: string) => void;
}

export function useVersionFileUpload() {
  const uploadFile = async (
    file: File,
    storagePath: string,
    callbacks: UploadProgressCallbacks,
    fileIndex: number,
    totalFiles: number
  ): Promise<string> => {
    const fileRef = ref(storage, `${storagePath}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          callbacks.onProgress(
            file.name,
            snapshot.bytesTransferred,
            snapshot.totalBytes,
            fileIndex,
            totalFiles
          );
        },
        (error) => reject(error),
        () => resolve()
      );
    });

    const downloadUrl = await getDownloadURL(fileRef);
    callbacks.onComplete(file.name);
    return downloadUrl;
  };

  const uploadVersionFiles = async (
    installerFile: File | null,
    updateFile: File | null,
    callbacks: UploadProgressCallbacks
  ): Promise<{
    installerDownloadUrl: string;
    updateDownloadUrl: string;
  }> => {
    const filesToUpload = [];
    if (installerFile) filesToUpload.push(installerFile);
    if (updateFile) filesToUpload.push(updateFile);

    let installerDownloadUrl = "";
    let updateDownloadUrl = "";

    if (installerFile) {
      installerDownloadUrl = await uploadFile(
        installerFile,
        FILE_UPLOAD.STORAGE_PATHS.INSTALLERS,
        callbacks,
        0,
        filesToUpload.length
      );
    }

    if (updateFile) {
      updateDownloadUrl = await uploadFile(
        updateFile,
        FILE_UPLOAD.STORAGE_PATHS.UPDATES,
        callbacks,
        installerFile ? 1 : 0,
        filesToUpload.length
      );
    }

    return { installerDownloadUrl, updateDownloadUrl };
  };

  return { uploadVersionFiles };
}
