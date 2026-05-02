# Uzum Bank To'lov Tizimi

Uzum Bank to'lov tizimi bilan backend va frontend integratsiyasi.

## Qanday ishlaydi

```
1. Frontend → Uzum sahifasiga yo'naltiradi
2. Uzum backendga so'rovlar yuboradi:
   - CHECK (tekshirish): plan mavjudligini tekshirish
   - CREATE (yaratish): tranzaksiyani yaratish
   - CONFIRM (tasdiqlash): to'lovni tasdiqlash
3. Bekor qilish uchun REVERSE so'rovi
4. STATUS orqali holat tekshirish
```

## Setup

1. [Uzum Business](https://business.uzum.uz) da akkаuntdan o'ting.
2. `Service ID`, `Login` va `Password` oling.
3. `.env` fayliga qo'shing:

```env
# Backend uchun
UZUM_SERVICE_ID=your_service_id
UZUM_LOGIN=your_login
UZUM_PASSWORD=your_password

# Frontend uchun
UZUM_CLIENT_ID=your_client_id
UZUM_CLIENT_SECRET=your_client_secret
UZUM_RETURN_URL=https://your-app.com/payment/success
UZUM_API_URL=https://api.uzum.uz
```

## Fayllar

### Backend
| Fayl | Maqsad |
|------|--------|
| `uzum.service.ts` | CHECK, CREATE, CONFIRM, REVERSE, STATUS metodlari |
| `uzum.routes.ts` | Express routelar |
| `uzum.middleware.ts` | Uzum so'rovlarini autentifikatsiya qiladi |
| `dto/` | Har bir metod uchun DTO tiplar |
| `constants/` | Xato va holat kodlari |

### Frontend
| Fayl | Maqsad |
|------|--------|
| `frontend/PaymentButton.tsx` | "Uzum orqali to'lash" tugmasi |

## Backend — Express route qo'shish

```ts
import { UzumService } from "./uzum.service";
import { uzumMiddleware } from "./uzum.middleware";
import { Router } from "express";

const router = Router();
const uzumService = new UzumService();

router.post("/api/payment/uzum/check",   uzumMiddleware, async (req, res) => res.json(await uzumService.check(req.body)));
router.post("/api/payment/uzum/create",  uzumMiddleware, async (req, res) => res.json(await uzumService.create(req.body)));
router.post("/api/payment/uzum/confirm", uzumMiddleware, async (req, res) => res.json(await uzumService.confirm(req.body)));
router.post("/api/payment/uzum/reverse", uzumMiddleware, async (req, res) => res.json(await uzumService.reverse(req.body)));
router.post("/api/payment/uzum/status",  uzumMiddleware, async (req, res) => res.json(await uzumService.status(req.body)));
```

## Tranzaksiya holatlari

| Holat | Tavsif |
|-------|--------|
| `PENDING` | Yaratilgan, tasdiqlash kutilmoqda |
| `PAID` | Muvaffaqiyatli to'landi |
| `CANCELED` | Bekor qilindi |

## Muhim: Prisma modellari

`uzum.service.ts` quyidagi Prisma modellarni talab qiladi:
- `transactions` — tranzaksiyalar (`transId`, `amount`, `status`, `provider`, `performTime`, `cancelTime`)
- `users` — foydalanuvchilar
- `plans` — tariflar (`price` — so'mda, Uzum summani 100 ga ko'paytirib yuboradi)
