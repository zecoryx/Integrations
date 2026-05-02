# Frontend Integrations

Tayyor integratsiyalar to'plami — React + TypeScript + Node.js/Express loyihalari uchun.

Har bir integratsiya mustaqil papkada joylashgan va o'z `README.md` si bor. Faqat kerakli integratsiyani olib ishlatish mumkin.

## Tezkor boshlash

```bash
npm install
```

`.env` faylini yarating va faqat ishlatmoqchi bo'lgan integratsiyalar uchun kalitlarni to'ldiring.

```bash
npm start   # Development
npm run build  # Production build
```

## Loyiha tuzilishi

```
frontend-integrations/
├── core/                    # Umumiy yordamchi modullar
│   ├── axios/               # HTTP client (interceptorlar bilan)
│   ├── env/                 # Barcha env o'zgaruvchilar (yagona manba)
│   └── errors/              # Global xato boshqarish
│
├── data/                    # Statik ma'lumotlar (API kerak emas)
│   ├── global/              # Mamlakatlar, valyutalar, tillar, vaqt zonalari
│   ├── mock/                # Foydalanuvchilar, mahsulotlar, va boshqalar (test uchun)
│   └── uzbekistan/          # Viloyatlar, tumanlar, banklar, universitetlar
│
├── integrations/            # Barcha integratsiyalar
│   ├── ai/                  # Sun'iy intellekt
│   ├── analytics/           # Sayt analitikasi
│   ├── auth/                # Autentifikatsiya
│   ├── document/            # PDF va hujjatlar
│   ├── i18n/                # Ko'p tillik qo'llab-quvvatlash
│   ├── maps/                # Xaritalar
│   ├── payments/            # To'lov tizimlari
│   ├── realtime/            # Real-vaqt aloqa
│   ├── scanner/             # QR va barkod skanerlash
│   ├── security/            # Xavfsizlik
│   ├── sms-notification/    # Bildirishnomalar
│   └── storage/             # Fayl saqlash
│
└── utils/                   # Yordamchi funksiyalar (hashing, Excel, va h.k.)
```

---

## Integratsiyalar

### AI (Sun'iy intellekt)

| Integratsiya | Tavsif | README |
|---|---|---|
| **ChatGPT** | OpenAI GPT modellari bilan chat | [→](integrations/ai/Chatgpt/README.md) |
| **Claude** | Anthropic Claude bilan chat | [→](integrations/ai/Claude/README.md) |
| **Gemini** | Google Gemini bilan chat | [→](integrations/ai/Gemini/README.md) |
| **STT** | Ovozni matnga aylantirish (Web Speech API) | [→](integrations/ai/stt/README.md) |
| **TTS** | Matnni ovozga aylantirish (Web Speech API) | [→](integrations/ai/tts/README.md) |

### Auth (Autentifikatsiya)

| Integratsiya | Tavsif | README |
|---|---|---|
| **Firebase Auth** | Google akkaunt orqali kirish | [→](integrations/auth/Firebase/README.md) |
| **OneID** | O'zbekiston egov.uz orqali ID karta bilan kirish | [→](integrations/auth/OneID/README.md) |
| **OAuth2** | Google va GitHub orqali kirish (Firebase'siz) | [→](integrations/auth/oauth2/README.md) |
| **SMS Auth** | Telefon raqami + OTP orqali kirish | [→](integrations/auth/sms-auth/README.md) |
| **Telegram Login** | Telegram akkaunt orqali kirish | [→](integrations/auth/Telegram/README.md) |
| **E-IMZO** | O'zbekiston elektron imzo bilan kirish | [→](integrations/auth/E-IMZO/README.md) |

### Maps (Xaritalar)

| Integratsiya | Tavsif | README |
|---|---|---|
| **Google Maps** | Google Maps JavaScript API | [→](integrations/maps/googleMaps/README.md) |
| **Yandex Maps** | Yandex Maps API | [→](integrations/maps/yandexMaps/README.md) |

### Payments (To'lov tizimlari)

| Integratsiya | Tavsif | README |
|---|---|---|
| **Click** | O'zbekiston Click to'lov tizimi | [→](integrations/payments/Click/README.md) |
| **Payme** | O'zbekiston Payme to'lov tizimi | [→](integrations/payments/Payme/README.md) |
| **Uzum Bank** | O'zbekiston Uzum Bank to'lovi | [→](integrations/payments/Uzum/README.md) |
| **Paynet** | O'zbekiston Paynet to'lov tizimi | [→](integrations/payments/Paynet/README.md) |
| **PayPal** | Xalqaro PayPal to'lovi | [→](integrations/payments/Paypal/README.md) |
| **Stripe** | Xalqaro Stripe karta to'lovi | [→](integrations/payments/Stripe/README.md) |
| **Crypto** | WalletConnect orqali kripto hamyon | [→](integrations/payments/Crypto/README.md) |

### Analytics (Analitika)

| Integratsiya | Tavsif | README |
|---|---|---|
| **Google Analytics 4** | Sayt trafigi va eventlarni kuzatish | [→](integrations/analytics/GoogleAnalytics/README.md) |
| **Yandex Metrika** | Sayt trafigi va maqsadlarni kuzatish | [→](integrations/analytics/YandexMetrika/README.md) |

### Realtime (Real-vaqt)

| Integratsiya | Tavsif | README |
|---|---|---|
| **Socket.IO** | Real-vaqt chat va xonalar | [→](integrations/realtime/SocketIO/README.md) |

### Scanner (Skanerlash)

| Integratsiya | Tavsif | README |
|---|---|---|
| **QR Scanner** | Kamera orqali QR kod o'qish | [→](integrations/scanner/QRScanner/README.md) |

### Storage (Fayl saqlash)

| Integratsiya | Tavsif | README |
|---|---|---|
| **Firebase Storage** | Fayl yuklash va boshqarish | [→](integrations/storage/Firebase/README.md) |

### Document (Hujjatlar)

| Integratsiya | Tavsif | README |
|---|---|---|
| **PDF Generator** | HTML yoki jadvaldan PDF yaratish | [→](integrations/document/PDF/README.md) |

### i18n (Ko'p tillik)

| Integratsiya | Tavsif | README |
|---|---|---|
| **i18n** | O'zbek, Rus, Ingliz tillarini qo'llab-quvvatlash | [→](integrations/i18n/README.md) |

### Security (Xavfsizlik)

| Integratsiya | Tavsif | README |
|---|---|---|
| **reCAPTCHA v3** | Google bot himoyasi | [→](integrations/security/recaptcha-v3/README.md) |

### SMS & Notifications (Bildirishnomalar)

| Integratsiya | Tavsif | README |
|---|---|---|
| **Eskiz.uz** | O'zbekiston SMS xizmati | [→](integrations/sms-notification/eskiz-uz/README.md) |
| **Email** | Backend orqali email yuborish | [→](integrations/sms-notification/email-js/README.md) |
| **Firebase FCM** | Veb push-bildirishnomalar | [→](integrations/sms-notification/firebase-fcm/README.md) |

---

## Core modullar

### `core/env/index.ts`

Barcha environment o'zgaruvchilarning yagona manbasi. Yangi o'zgaruvchi qo'shish uchun:
1. `Env` interfeysi ga tip qo'shing
2. `env` ob'ektiga qiymat qo'shing
3. `.env` fayliga key qo'shing

### `core/axios/`

Barcha HTTP so'rovlar uchun sozlangan Axios instance. Interceptorlar avtomatik xatolarni qayta ishlaydi.

```ts
import api from "../../../core/axios";

const data = await api.get("/users");
const result = await api.post("/orders", { amount: 50000 });
```

### `core/errors/`

`AppError` sinfi va global xato boshqaruvchi.

---

## Statik ma'lumotlar (`data/`)

API murojaat qilmasdan ishlatish mumkin bo'lgan JSON ma'lumotlar:

| Fayl | Tarkib |
|------|--------|
| `data/global/countries.json` | 250 ta mamlakat |
| `data/global/currencies.json` | Valyutalar ro'yxati |
| `data/global/languages.json` | Tillar ro'yxati |
| `data/global/timezones.json` | Vaqt zonalari |
| `data/uzbekistan/regions.json` | O'zbekiston viloyatlari |
| `data/uzbekistan/districts.json` | Tumanlar |
| `data/uzbekistan/banks.json` | Banklar |
| `data/uzbekistan/universities.json` | Universitetlar |
| `data/uzbekistan/mobile-operators.json` | Mobil operatorlar |
| `data/mock/fake-users.json` | Test foydalanuvchilari |
| `data/mock/fake-products.json` | Test mahsulotlari |

---

## Texnologiyalar

- **Runtime:** Node.js
- **Framework:** Express.js
- **Til:** TypeScript
- **Database ORM:** Prisma + MongoDB
- **Asosiy kutubxonalar:** Axios, Firebase, class-validator, Luxon, Socket.IO, jsPDF, html2canvas, jsQR, Stripe

## Litsenziya

ISC
