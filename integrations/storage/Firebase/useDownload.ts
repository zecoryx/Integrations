import { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, getDownloadURL, deleteObject } from "firebase/storage";
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

interface UseDownloadReturn {
  getUrl: (path: string) => Promise<string>;
  deleteFile: (path: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export const useDownload = (): UseDownloadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getUrl = async (path: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (path: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { getUrl, deleteFile, isLoading, error };
};
