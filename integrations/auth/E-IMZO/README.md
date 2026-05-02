# E-IMZO — Elektron Imzo

O'zbekiston Respublikasining elektron imzo tizimi yordamida autentifikatsiya.

> E-IMZO foydalanuvchi kompyuteriga plaginni o'rnatishni talab qiladi.

## Setup

1. [e-imzo.uz](https://e-imzo.uz/main/downloads/) dan brauzer plaginini yuklab o'rnating.
2. Elektron kalitingizni (USB token yoki fayl) kompyuterga ulang.

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `EImzoButton.tsx` | E-IMZO imzolash tugmasi komponenti |
| `eimzo.service.ts` | E-IMZO plagin bilan ishlash funksiyalari |

## Ishlatish

```tsx
import EImzoButton from "./EImzoButton";

const LoginPage = () => {
  // challenge — serverdan olingan tasodifiy matn
  const challenge = "random-server-challenge-12345";

  const handleSuccess = async (result) => {
    console.log("PKCS#7:", result.pkcs7);
    console.log("Sertifikat egasi:", result.subjectName);

    // pkcs7 ni backendga yuboring
    const res = await fetch("/api/auth/eimzo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pkcs7: result.pkcs7, challenge }),
    });
    const data = await res.json();
    console.log("Login muvaffaqiyatli:", data);
  };

  const handleError = (error) => {
    console.error("E-IMZO xato:", error);
  };

  return (
    <EImzoButton
      challengeText={challenge}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};
```

## Backend — imzoni tekshirish

```ts
import forge from "node-forge";

app.post("/api/auth/eimzo", (req, res) => {
  const { pkcs7, challenge } = req.body;

  // PKCS#7 ni decode qilish va imzoni tekshirish
  const p7 = forge.pkcs7.messageFromPem(
    "-----BEGIN PKCS7-----\n" + pkcs7 + "\n-----END PKCS7-----"
  );

  // Sertifikat va imzoni tekshirish
  // node-forge yoki openssl bilan amalga oshiriladi

  res.json({ success: true });
});
```

## Muhim eslatmalar

- E-IMZO plagin `https://127.0.0.1:64646` portida ishlaydi — bu lokal plagin.
- Brauzer `https://127.0.0.1` ga ishlashiga ruxsat berishi kerak (SSL ogohlantirishi).
- Haqiqiy loyihada `node-forge` yoki `openssl` bilan PKCS#7 imzoni tekshiring.
- Kalitlar ro'yxatida bir nechta kalit bo'lsa, foydalanuvchiga tanlash imkonini bering.
