# Email — Email Yuborish

Backend orqali foydalanuvchilarga email yuborish integratsiyasi.

## Setup

`.env` fayliga qo'shing:

```env
EMAIL_SERVICE_API_URL=http://your-backend.com/api/email
```

Backend da email xizmatini sozlash uchun (masalan, Nodemailer + Gmail/SendGrid):

```ts
// Backend misoli — Nodemailer bilan
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "your@gmail.com", pass: "app_password" },
});

app.post("/api/email/send", async (req, res) => {
  const { to, subject, html } = req.body;
  await transporter.sendMail({ from: "your@gmail.com", to, subject, html });
  res.json({ success: true });
});
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `api.ts` | Backend email endpointiga so'rov yuboradi |
| `useEmail.ts` | Email yuborish hook |

## Ishlatish

```tsx
import { useEmail } from "./useEmail";

const ContactForm = () => {
  const { isLoading, error, isSuccess, sendEmail } = useEmail();

  const handleSubmit = () => {
    sendEmail({
      to: "user@example.com",
      subject: "Xush kelibsiz!",
      html: "<h1>Salom!</h1><p>Ro'yxatdan o'tganingiz uchun rahmat.</p>",
    });
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Yuborilmoqda..." : "Email yuborish"}
      </button>
      {isSuccess && <p style={{ color: "green" }}>Email yuborildi!</p>}
      {error && <p style={{ color: "red" }}>Xato: {error.message}</p>}
    </div>
  );
};
```

## Hook qaytaradigan qiymatlar

| Qiymat | Turi | Tavsif |
|--------|------|--------|
| `isLoading` | `boolean` | Yuborish jarayonida |
| `error` | `Error \| null` | Xato |
| `isSuccess` | `boolean` | Muvaffaqiyatli yuborildi |
| `sendEmail` | `(payload) => void` | Email yuborish funksiyasi |

## `sendEmail` parametrlari

| Parametr | Tavsif |
|----------|--------|
| `to` | Qabul qiluvchi email manzili |
| `subject` | Email mavzusi |
| `html` | HTML formatidagi xabar |
