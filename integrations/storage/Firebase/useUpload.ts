import { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { env } from "../../../core/env";

const firebaseConfig = {
  apiKey: env.FIREBASE_CLIENT_API_KEY,
  authDomain: env.FIREBASE_CLIENT_AUTH_DOMAIN,
  projectId: env.FIREBASE_CLIENT_PROJECT_ID,
  storageBucket: env.FIREBASE_CLIENT_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_CLIENT_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_CLIENT_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

interface UseUploadReturn {
  uploadFile: (file: File, path: string) => Promise<string>;
  progress: number;
  isUploading: boolean;
  error: Error | null;
  downloadUrl: string | null;
}

export const useUpload = (): UseUploadReturn => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const uploadFile = (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          setError(err);
          setIsUploading(false);
          reject(err);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setDownloadUrl(url);
          setIsUploading(false);
          setProgress(100);
          resolve(url);
        }
      );
    });
  };

  return { uploadFile, progress, isUploading, error, downloadUrl };
};
