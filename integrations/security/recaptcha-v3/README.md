# Google reCAPTCHA v3

Bot va avtomatlashtirilgan so'rovlardan himoya qilish uchun Google reCAPTCHA v3 integratsiyasi.

> reCAPTCHA v3 foydalanuvchiga hech qanday savol bermaydi — faqat fon tarzida harakat skorini tekshiradi.

## Setup

1. [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin) sahifasiga kiring.
2. **+ (Create)** → **reCAPTCHA v3** tanlang → domenni qo'shing.
3. **Site Key** (frontend) va **Secret Key** (backend) oling.
4. `.env` fayliga qo'shing:

```env
RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `RecaptchaProvider.tsx` | Context provider — app tashqarisida o'rab olish uchun |
| `recaptcha.service.ts` | Backend validatsiya xizmati |

## Frontend — ishlatish

### 1. App.tsx da Provider qo'shing

```tsx
import { RecaptchaProvider } from "./RecaptchaProvider";

const App = () => {
  return (
    <RecaptchaProvider>
      {/* Barcha komponentlar shu yerda */}
    </RecaptchaProvider>
  );
};
```

### 2. Forma komponentida token oling

```tsx
import { useRecaptcha } from "./RecaptchaProvider";

const LoginForm = () => {
  const { executeRecaptcha } = useRecaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      console.error("reCAPTCHA tayyor emas");
      return;
    }

    // "login" — action nomi (Google panelida ko'rinadi)
    const token = await executeRecaptcha("login");

    // Bu tokenni backend ga yuboring
    await api.post("/auth/login", { ...formData, recaptchaToken: token });
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

## Backend — token tekshirish

```ts
import { RecaptchaService } from "./recaptcha.service";

const recaptchaService = new RecaptchaService();

app.post("/auth/login", async (req, res) => {
  const { recaptchaToken, ...loginData } = req.body;

  const isValid = await recaptchaService.validate(recaptchaToken);
  if (!isValid) {
    return res.status(400).json({ message: "reCAPTCHA tekshiruvi muvaffaqiyatsiz" });
  }

  // Oddiy login logikasi...
});
```

## Skor tushuntirishi

| Skor | Tavsif |
|------|--------|
| `1.0` | Aniq inson |
| `0.5` | Oddiy holat |
| `0.0` | Bot ehtimoli yuqori |

Odatda `>= 0.5` sifatida tekshiriladi.
