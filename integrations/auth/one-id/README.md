# OneID Integration

O'zbekiston davlat xizmatlari portali (egov.uz) orqali foydalanuvchini ID karta yoki pasport yordamida autentifikatsiya qilish.

> OneID — O'zbekiston fuqarolarining yagona raqamli identifikatsiya tizimi.

## Setup

1. [my.gov.uz](https://my.gov.uz) yoki [egov.uz](https://egov.uz) developer portalida ilovangizni ro'yxatdan o'tkazing.
2. `client_id`, `client_secret` va `redirect_uri` oling.
3. `.env` fayliga qo'shing:

```env
ONEID_CLIENT_ID=your_client_id
ONEID_CLIENT_SECRET=your_client_secret
ONEID_REDIRECT_URI=https://your-app.com/auth/oneid/callback
```

## Autentifikatsiya oqimi (OAuth2 PKCE)

```
1. Foydalanuvchi "OneID bilan kirish" tugmasini bosadi
2. egov.uz sahifasiga yo'naltiriladi
3. ID karta/pasport yordamida tasdiqlaydi
4. ?code=... parametri bilan redirect_uri ga qaytadi
5. Backend code ni access_token ga almashtiradi
6. Foydalanuvchi ma'lumotlari olinadi
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `oneid.utils.ts` | Avtorizatsiya URL yaratish |
| `one.service.ts` | Kod → token → foydalanuvchi ma'lumotlari |
| `OneIdButton.tsx` | Tayyor "Login with OneID" tugmasi |

## Frontend — tugmani ishlatish

```tsx
import OneIdButton from "./OneIdButton";

const LoginPage = () => {
  return (
    <div>
      <h1>Kirish</h1>
      <OneIdButton />
    </div>
  );
};
```

## Backend — callback'da kodni qayta ishlash

```ts
import { OneIDService } from "./one.service";

const oneIdService = new OneIDService();

// Express route misoli:
app.get("/auth/oneid/callback", async (req, res) => {
  const { code } = req.query;
  const userData = await oneIdService.getUserInfo(code as string);
  // userData ichida: first_name, last_name, pinfl, birth_date va boshqalar
  res.json(userData);
});
```

## OneID qaytaradigan ma'lumotlar

| Maydon | Tavsif |
|--------|--------|
| `first_name` | Ism |
| `last_name` | Familiya |
| `middle_name` | Otasining ismi |
| `pinfl` | Shaxsiy identifikatsiya raqami |
| `birth_date` | Tug'ilgan sana |
| `passport_data` | Pasport seriyasi |
| `inn` | INN (soliq raqami) |
