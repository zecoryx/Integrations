import { useState, useEffect } from "react";
import { getFirebaseToken } from "./firebase-messaging-sw"; // Import the token retrieval function

// A custom hook for managing client-side Firebase Cloud Messaging (FCM) push notifications.
// It handles requesting notification permissions and retrieving the FCM device token.

// @returns An object containing the FCM token, loading state, error, and a function to request notification permission.
export const usePush = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Function to request notification permission and get the FCM token
  const requestNotificationPermission = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Request permission from the user
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPermissionGranted(true);
        const token = await getFirebaseToken();
        setFcmToken(token);
      } else {
        setError(new Error("Notification permission denied."));
        setPermissionGranted(false);
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If permission was already granted before (e.g. returning user), get the token directly
    // without calling requestNotificationPermission() to avoid triggering a re-request dialog.
    if ("Notification" in window && Notification.permission === "granted") {
      setPermissionGranted(true);
      setIsLoading(true);
      getFirebaseToken()
        .then((token) => setFcmToken(token))
        .catch((err) => setError(err as Error))
        .finally(() => setIsLoading(false));
    }
  }, []);

  return { fcmToken, isLoading, error, permissionGranted, requestNotificationPermission };
};