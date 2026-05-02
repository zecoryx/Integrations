# Payme To'lov Tizimi

O'zbekistondagi Payme (payme.uz) to'lov tizimi bilan backend va frontend integratsiyasi.

## Qanday ishlaydi

Payme JSON-RPC protokolidan foydalanadi. Barcha so'rovlar bitta endpointga keladi, lekin `method` maydoni orqali farqlanadi:

```
POST /api/payment/payme
{ "method": "CheckPerformTransaction", "params": {...} }
{ "method": "CreateTransaction",       "params": {...} }
{ "method": "PerformTransaction",      "params": {...} }
{ "method": "CancelTransaction",       "params": {...} }
{ "method": "CheckTransaction",        "params": {...} }
{ "method": "GetStatement",            "params": {...} }
```

## Setup

1. [Payme Merchant Cabinet](https://merchant.payme.uz) da akkаuntdan o'ting.
2. **Merchant ID** va **Secret Key** oling.
3. Callback URL: `https://your-backend.com/api/payment/payme`
4. `.env` fayliga qo'shing:

```env
# Backend uchun
PAYME_LOGIN=payme
PAYME_MERCHANT_KEY=your_payme_merchant_key

# Frontend uchun
PAYME_MERCHANT_ID=your_merchant_id
PAYME_CALLBACK_URL=https://your-app.com/payment/success
```

## Fayllar

### Backend
| Fayl | Maqsad |
|------|--------|
| `payme.service.ts` | Barcha 6 ta metodni qayta ishlaydi |
| `payme.routes.ts` | Express route: `POST /api/payment/payme` |
| `payme.middleware.ts` | Basic Auth orqali Payme imzosini tekshiradi |
| `dto/` | Har bir metod uchun alohida DTO tipi |
| `constants/` | Xato kodlari, holat kodlari va boshqalar |

### Frontend
| Fayl | Maqsad |
|------|--------|
| `frontend/PaymentButton.tsx` | "Payme orqali to'lash" tugmasi |

## Backend — Express route qo'shish

```ts
import { PaymeService } from "./payme.service";
import { paymeMiddleware } from "./payme.middleware";
import { Router } from "express";

const router = Router();
const paymeService = new PaymeService();

router.post("/api/payment/payme", paymeMiddleware, async (req, res) => {
  const result = await paymeService.handleTransactionMethods(req.body);
  res.json(result);
});
```

## Frontend — tugmani ishlatish

```tsx
import PaymentButton from "./frontend/PaymentButton";

const CheckoutPage = () => {
  return (
    <PaymentButton
      amount={50000}       // Summa (so'mda) — funksiya ichida * 100 qilinadi
      planId="plan_abc"    // Tarif/plan ID (Prisma da plans.id)
      userId="user_xyz"    // Foydalanuvchi ID (Prisma da users.id)
    >
      Payme orqali to'lash
    </PaymentButton>
  );
};
```

### Checkout URL formati

`backend/api.ts` dagi `generatePaymePaymentUrl` funksiyasi quyidagi URL yaratadi:

```
https://checkout.paycom.uz/<base64(m=MERCHANT_ID&ac.planId=plan_abc&ac.user_id=user_xyz&a=5000000&c=CALLBACK_URL)>
```

Foydalanuvchi shu URLga yo'naltiriladi va to'lovni Payme interfeysi orqali amalga oshiradi.

## Tranzaksiya holatlari

| Holat | Qiymat | Tavsif |
|-------|--------|--------|
| `PENDING` | 1 | Yaratilgan, kutilmoqda |
| `PAID` | 2 | To'lov amalga oshirildi |
| `CANCELED (pending)` | -1 | To'lovdan oldin bekor |
| `CANCELED (paid)` | -2 | To'lovdan keyin bekor |

## Muhim: Timeout

Tranzaksiya 12 soat (720 daqiqa) ichida tasdiqlanmasa, avtomatik bekor qilinadi.

## Muhim: Prisma modellari

`payme.service.ts` quyidagi Prisma modellarni talab qiladi:
- `transactions` — tranzaksiyalar jadvali (`transId`, `state`, `status`, `performTime`, `cancelTime`, `reason`)
- `users` — foydalanuvchilar jadvali
- `plans` — tariflar jadvali (`price` maydoni — so'mda)
