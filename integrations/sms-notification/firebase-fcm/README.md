# Firebase Cloud Messaging (FCM)

Firebase FCM orqali veb-brauzerga push-bildirishnomalar yuborish.

## Qanday ishlaydi

```
1. Foydalanuvchi bildirishnomaga ruxsat beradi
2. FCM device token olinadi (har qurilma uchun noyob)
3. Bu token backend ga saqlanadi
4. Backend FCM API orqali token ga push yuboradi
5. Brauzer bildirishnomani ko'rsatadi (sahifa yopiq bo'lsa ham)
```

## Setup

1. [Firebase Console](https://console.firebase.google.com) → **Cloud Messaging** → **Web configuration**.
2. **Generate key pair** → **VAPID key** oling.
3. `.env` fayliga qo'shing:

```env
FIREBASE_CLIENT_API_KEY=your_api_key
FIREBASE_CLIENT_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_CLIENT_PROJECT_ID=your_project_id
FIREBASE_CLIENT_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_CLIENT_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_CLIENT_APP_ID=your_app_id
FIREBASE_CLIENT_VAPID_KEY=your_vapid_key

# Backend uchun (push yuborish)
PUSH_NOTIFICATION_API_URL=http://your-backend.com/api/push
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `usePush.ts` | Ruxsat so'rash va FCM token olish hook |
| `firebase-messaging-sw.ts` | Firebase init va token generatsiya |

## Frontend — ishlatish

```tsx
import { usePush } from "./usePush";

const NotificationSettings = () => {
  const { fcmToken, isLoading, error, permissionGranted, requestNotificationPermission } = usePush();

  return (
    <div>
      {!permissionGranted ? (
        <button onClick={requestNotificationPermission} disabled={isLoading}>
          Bildirishnomalarni yoqish
        </button>
      ) : (
        <p>Bildirishnomalar yoqilgan</p>
      )}
      {fcmToken && <p>Token olindi (backendga yuborilishi kerak)</p>}
      {error && <p>Xato: {error.message}</p>}
    </div>
  );
};
```

## Backend — push yuborish

Token backendda saqlanganidan keyin, bildirishnoma yuborish:

```ts
// Firebase Admin SDK bilan
import admin from "firebase-admin";

await admin.messaging().send({
  token: savedFcmToken,
  notification: {
    title: "Yangi xabar",
    body: "Sizga yangi xabar keldi!",
  },
});
```

## Service Worker sozlash (muhim qadam)

`firebase-messaging-sw.ts` faylini brauzer service worker sifatida ro'yxatdan o'tkazish kerak. Bu faylni **build qilib** ilovaning `public/` papkasiga `firebase-messaging-sw.js` nomi bilan joylang.

**Vite bilan:**
```ts
// vite.config.ts
import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        sw: "integrations/sms-notification/firebase-fcm/firebase-messaging-sw.ts",
      },
      output: { entryFileNames: (chunk) => chunk.name === "sw" ? "firebase-messaging-sw.js" : "assets/[name]-[hash].js" },
    },
  },
});
```

Yoki oddiy usul — `public/firebase-messaging-sw.js` ga Firebase SDK ni CDN orqali yuklang:
```js
// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({ apiKey: "...", projectId: "...", messagingSenderId: "...", appId: "..." });
const messaging = firebase.messaging();
```

## Muhim eslatmalar

- FCM token har safar brauzer tozalanganida yangilanadi — tokenni dinamik saqlang.
- Token olingandan so'ng uni backendga yuborib, foydalanuvchi bilan bog'lab saqlang.
- HTTPS talab qilinadi (localhost bundan mustasno).
