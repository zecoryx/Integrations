# Firebase Authentication

Google Firebase orqali foydalanuvchilarni Google akkaunt bilan autentifikatsiya qilish.

## Setup

1. [Firebase Console](https://console.firebase.google.com)da loyiha yarating.
2. **Authentication** → **Sign-in method** → **Google** ni yoqing.
3. `.env` fayliga quyidagi o'zgaruvchilarni qo'shing:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

> Firebase Console → Project Settings → Your apps → SDK setup and configuration dan topasiz.

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `firebase.service.ts` | Firebase init va auth metodlari |
| `useAuth.ts` | React hook — komponentlarda foydalanish uchun |

## Ishlatish

```tsx
import { useAuth } from "./useAuth";

const LoginPage = () => {
  const { user, isLoading, error, loginWithGoogle, logout } = useAuth();

  if (isLoading) return <p>Yuklanmoqda...</p>;

  if (user) {
    return (
      <div>
        <p>Xush kelibsiz, {user.email}</p>
        <button onClick={logout}>Chiqish</button>
      </div>
    );
  }

  return <button onClick={loginWithGoogle}>Google bilan kirish</button>;
};
```

### Hook qaytaradigan qiymatlar

| Qiymat | Turi | Tavsif |
|--------|------|--------|
| `user` | `User \| null` | Kirgan foydalanuvchi yoki null |
| `isLoading` | `boolean` | So'rov bajarilayotganda true |
| `error` | `Error \| null` | Xato yuz berganda |
| `loginWithGoogle` | `() => void` | Google popup ochadi |
| `logout` | `() => void` | Foydalanuvchini chiqaradi |
