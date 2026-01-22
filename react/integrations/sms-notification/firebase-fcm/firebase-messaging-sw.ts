import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { env } from "../../../core/env/index";

// Extend Window interface for service worker
declare global {
  interface ServiceWorkerGlobalScope {
    registration: ServiceWorkerRegistration | null;
    showNotification: (title: string, options: NotificationOptions) => void;
  }
}

const _self = self as unknown as ServiceWorkerGlobalScope;

// Firebase configuration for the client-side app.
// These values are read from environment variables to keep them secure and configurable.
const firebaseConfig = {
  apiKey: env.FIREBASE_CLIENT_API_KEY,
  authDomain: env.FIREBASE_CLIENT_AUTH_DOMAIN,
  projectId: env.FIREBASE_CLIENT_PROJECT_ID,
  storageBucket: env.FIREBASE_CLIENT_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_CLIENT_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_CLIENT_APP_ID,
  measurementId: env.FIREBASE_CLIENT_MEASUREMENT_ID,
};

// Initialize Firebase app for client-side operations.
const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase Messaging service.
const messaging = getMessaging(app);

// This is the Service Worker for Firebase Cloud Messaging (FCM).
// It runs in the background and handles incoming push messages.

// Request permission for notifications and get the FCM token.
export const getFirebaseToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: env.FIREBASE_CLIENT_VAPID_KEY, // Use VAPID key from environment variables
    });

    if (currentToken) {
      console.log("FCM registration token:", currentToken);
      return currentToken;
    } else {
      console.warn(
        "No FCM registration token available. Request permission to generate one."
      );
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
    return null;
  }
};

// Handle incoming messages while the app is in the foreground.
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // Customize notification handling logic here, e.g., display a custom notification.
  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/firebase-logo.png", // Replace with your app icon
  };
  if (_self.registration && payload.notification) {
    _self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

// Other service worker logic (e.g., caching, offline support) can be added here.
// For FCM, the main logic for receiving push events is handled by the 'onBackgroundMessage'
// function which is implicitly handled by Firebase SDK when the service worker is registered.
// However, 'onMessage' is for foreground messages.