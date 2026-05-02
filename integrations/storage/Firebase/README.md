# Firebase Storage

Firebase Storage orqali fayllarni yuklash, yuklab olish va o'chirish.

## Setup

1. [Firebase Console](https://console.firebase.google.com) → **Storage** → **Get started**.
2. Storage Rules ni sozlang (masalan, autentifikatsiya talab qiling).
3. `.env` fayliga Firebase config qo'shing (Firebase Auth bilan bir xil kalitlar):

```env
FIREBASE_CLIENT_API_KEY=your_api_key
FIREBASE_CLIENT_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_CLIENT_PROJECT_ID=your_project_id
FIREBASE_CLIENT_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_CLIENT_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_CLIENT_APP_ID=your_app_id
```

## O'rnatish

```bash
npm install firebase
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useUpload.ts` | Fayl yuklash va progress kuzatish hook |
| `useDownload.ts` | URL olish va fayl o'chirish hook |

## Fayl yuklash

```tsx
import { useUpload } from "./useUpload";

const FileUploader = () => {
  const { uploadFile, progress, isUploading, error, downloadUrl } = useUpload();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // path — Storage dagi joylashuv
    const url = await uploadFile(file, `uploads/${Date.now()}_${file.name}`);
    console.log("Fayl URL:", url);
  };

  return (
    <div>
      <input type="file" onChange={handleChange} disabled={isUploading} />
      {isUploading && <p>Yuklanmoqda: {progress}%</p>}
      {downloadUrl && <a href={downloadUrl}>Faylni ko'rish</a>}
      {error && <p>Xato: {error.message}</p>}
    </div>
  );
};
```

## URL olish va o'chirish

```tsx
import { useDownload } from "./useDownload";

const FileManager = () => {
  const { getUrl, deleteFile, isLoading, error } = useDownload();

  const handleGetUrl = async () => {
    const url = await getUrl("uploads/my-file.png");
    window.open(url);
  };

  const handleDelete = async () => {
    await deleteFile("uploads/my-file.png");
    console.log("Fayl o'chirildi");
  };

  return (
    <div>
      <button onClick={handleGetUrl} disabled={isLoading}>URL olish</button>
      <button onClick={handleDelete} disabled={isLoading}>O'chirish</button>
      {error && <p>Xato: {error.message}</p>}
    </div>
  );
};
```

## Storage Rules (Firebase Console)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Faqat autentifikatsiya qilingan foydalanuvchilar yuklashi mumkin
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Fayl yo'li namunalari

```ts
// Foydalanuvchiga tegishli papka
`users/${userId}/avatar.png`

// Umumiy uploads
`uploads/${Date.now()}_${file.name}`

// Mahsulot rasmlari
`products/${productId}/images/${imageName}`
```
