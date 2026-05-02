# Telegram Login

Telegram orqali foydalanuvchini autentifikatsiya qilish.

## Setup

1. [@BotFather](https://t.me/BotFather) da bot yarating va token oling.
2. BotFather da `/setdomain` buyrug'i bilan saytingiz domenini kiriting.
3. `.env` fayliga qo'shing:

```env
TELEGRAM_BOT_NAME=your_bot_username
TELEGRAM_BOT_TOKEN=your_bot_token
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `TelegramLoginButton.tsx` | Telegram login tugmasi komponenti |
| `telegram.service.ts` | Backend: Telegram ma'lumotlarini tekshirish |

## Frontend — ishlatish

```tsx
import TelegramLoginButton from "./TelegramLoginButton";

const LoginPage = () => {
  const handleAuth = (user) => {
    console.log("Telegram user:", user);
    // user.id, user.first_name, user.username, user.hash
    // Bu ma'lumotlarni backendga yuboring
    fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  };

  return (
    <TelegramLoginButton
      botName="your_bot_username"
      onAuth={handleAuth}
      buttonSize="large"
    />
  );
};
```

## Backend — tekshirish

```ts
import { verifyTelegramAuth } from "./telegram.service";

app.post("/api/auth/telegram", (req, res) => {
  const isValid = verifyTelegramAuth(req.body, process.env.TELEGRAM_BOT_TOKEN!);
  if (!isValid) return res.status(401).json({ error: "Invalid Telegram auth" });

  // Foydalanuvchini DB ga saqlang yoki JWT token bering
  res.json({ success: true, userId: req.body.id });
});
```

## Muhim eslatmalar

- Telegram widget faqat `https://` domenda ishlaydi (localhost bundan mustasno).
- `hash` ni faqat backendda tekshiring — frontend da bot tokenni ishlatmang.
- `auth_date` 24 soatdan eski bo'lsa, autentifikatsiya yaroqsiz hisoblanadi.
