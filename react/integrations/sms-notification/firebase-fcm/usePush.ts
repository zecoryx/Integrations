// @ts-nocheck
import { useState, useEffect } from 'react';
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { initializeApp } from "firebase/app";

// Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ... boshqa configlar
};

export const usePushNotification = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);

  // 1. Ruxsat so'rash va Token olish
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Firebase ishga tushirish (Mock kod)
        // const app = initializeApp(firebaseConfig);
        // const messaging = getMessaging(app);
        
        // Token olish
        // const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
        
        const mockToken = "fcm_token_sample_123456"; // Test uchun
        console.log("FCM Token:", mockToken);
        setFcmToken(mockToken);
        
        // Tokenni Backendga yuborib saqlash kerak!
        // await api.post('/users/save-token', { token: mockToken });
        
        return mockToken;
      } else {
        alert("Bildirishnomaga ruxsat berilmadi 🔕");
      }
    } catch (error) {
      console.error("Push Error:", error);
    }
  };

  // 2. Foreground (Sayt ochiq turganda) xabarni ushlash
  useEffect(() => {
    // const messaging = getMessaging();
    // onMessage(messaging, (payload) => {
    //   console.log("Xabar keldi:", payload);
    //   setNotification(payload.notification);
    //   alert(payload.notification?.title + "\n" + payload.notification?.body);
    // });
  }, []);

  return { requestPermission, fcmToken, notification };
};