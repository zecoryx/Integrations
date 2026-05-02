# OAuth2 Integration

Google va GitHub orqali foydalanuvchilarni OAuth2 protokoli yordamida autentifikatsiya qilish.

> Bu integratsiya Firebase ishlatmaydi — to'g'ridan-to'g'ri OAuth2 redirect oqimini amalga oshiradi.

## Setup

### Google OAuth2

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**.
2. **Create Credentials** → **OAuth Client ID** → **Web application**.
3. **Authorized redirect URIs** ga `http://localhost:3000/auth/callback` qo'shing.

### GitHub OAuth2

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. **Authorization callback URL** ni kiriting.

### `.env` sozlamalari

```env
GOOGLE_CLIENT_ID=your_google_client_id
GITHUB_CLIENT_ID=your_github_client_id
REDIRECT_URI=http://localhost:3000/auth/callback
```

## Autentifikatsiya oqimi

```
1. LoginButton bosiladi → authUrl.ts URL yaratadi
2. Foydalanuvchi provider sahifasiga yo'naltiriladi
3. Ruxsat berilgandan keyin ?code=... bilan redirect_uri ga qaytadi
4. Backend bu kodni access_token ga almashtiradi
5. Foydalanuvchi profili olinadi
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `authUrl.ts` | Google/GitHub uchun avtorizatsiya URL yaratadi |
| `LoginButton.tsx` | Provider tanlash tugmasi |

## Ishlatish

```tsx
import LoginButton from "./LoginButton";

const LoginPage = () => {
  return (
    <div>
      <LoginButton provider="google" />
      <LoginButton provider="github" />
    </div>
  );
};
```

### URL ni qo'lda olish

```ts
import { getOAuth2Url } from "./authUrl";

const googleUrl = getOAuth2Url("google");
const githubUrl = getOAuth2Url("github");

window.location.href = googleUrl;
```

## Backend — callback'da kodni qayta ishlash

Callback route (`/auth/callback`) ga kelgan `code` parametrini quyidagicha almashtiring:

**Google uchun:**
```ts
POST https://oauth2.googleapis.com/token
{ code, client_id, client_secret, redirect_uri, grant_type: "authorization_code" }
// Javobda access_token keladi → foydalanuvchi profili olish uchun ishlatiladi
```

**GitHub uchun:**
```ts
POST https://github.com/login/oauth/access_token
{ code, client_id, client_secret }
// Javobda access_token keladi → GET https://api.github.com/user
```
