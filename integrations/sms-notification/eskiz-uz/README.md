# Eskiz.uz SMS Xizmati

O'zbekistonning Eskiz.uz SMS xizmati orqali foydalanuvchilarga SMS yuborish.

> **Muhim:** API kalitlari backend da saqlanishi kerak — frontenddan to'g'ridan-to'g'ri Eskiz.uz API ga murojaat qilish xavfli.

## Setup

1. [Eskiz.uz](https://eskiz.uz) da ro'yxatdan o'ting.
2. Dashboard dan `email` va `password` oling.
3. `.env` fayliga qo'shing:

```env
ESKIZ_SMS_API_URL=http://your-backend.com/api/sms
```

Backend esa Eskiz.uz API bilan muloqot qiladi:
- Eskiz.uz email: backend `.env` da
- Eskiz.uz password: backend `.env` da
- Eskiz.uz base URL: `https://notify.eskiz.uz/api`

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `api.ts` | Backend SMS endpointiga so'rov yuboradi |
| `useEskizSms.ts` | SMS yuborish hook |
| `SmsForm.tsx` | Tayyor SMS yuborish formasi |

## Ishlatish

### Hook yordamida

```tsx
import { useEskizSms } from "./useEskizSms";

const SmsPage = () => {
  const { isLoading, error, isSuccess, sendSms } = useEskizSms();

  const handleSend = () => {
    // sendSms(mobilePhone, message, from?)
    sendSms("+998901234567", "Tasdiqlash kodingiz: 1234", "4546");
  };

  return (
    <div>
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? "Yuborilmoqda..." : "SMS yuborish"}
      </button>
      {isSuccess && <p style={{ color: "green" }}>SMS yuborildi!</p>}
      {error && <p style={{ color: "red" }}>Xato: {error.message}</p>}
    </div>
  );
};
```

### Tayyor forma

```tsx
import SmsForm from "./SmsForm";

const MyPage = () => <SmsForm />;
```

## Backend da Eskiz.uz bilan ishlash (namuna)

```ts
// Birinchi token olish:
POST https://notify.eskiz.uz/api/auth/login
{ "email": "your@email.com", "password": "yourpassword" }
// Javob: { "data": { "token": "..." } }

// SMS yuborish:
POST https://notify.eskiz.uz/api/message/sms/send
Authorization: Bearer {token}
{ "mobile_phone": "998901234567", "message": "...", "from": "4546" }
```

## SMS narxi

Eskiz.uz narxlari: `eskiz.uz/tariff` sahifasida. O'zbekiston raqamlariga 1 SMS ≈ 10-20 tiyin.
