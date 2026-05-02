# Click To'lov Tizimi

O'zbekistondagi Click to'lov tizimi bilan backend va frontend integratsiyasi.

## Qanday ishlaydi

```
1. Foydalanuvchi "Click orqali to'lash" tugmasini bosadi
2. Frontend Click sahifasiga yo'naltiradi (merchant_id va amount bilan)
3. Click to'lovni qayta ishlaydi
4. Click sizning backendingizga 2 ta so'rov yuboradi:
   - PREPARE (tayyorlik): tranzaksiyani yaratish
   - COMPLETE (tugatish): muvaffaqiyatli to'lovni tasdiqlash
5. Backend har ikkisiga javob beradi
```

## Setup

1. [Click Merchant Cabinet](https://merchant.click.uz) da akkаuntdan o'ting.
2. **Service ID** va **Secret Key** oling.
3. Callback URL sifatida: `https://your-backend.com/api/payment/click` ni ko'rsating.
4. `.env` fayliga qo'shing:

```env
# Backend uchun
CLICK_SECRET=your_click_secret_key

# Frontend uchun
CLICK_MERCHANT_ID=your_merchant_id
CLICK_API_URL=https://my.click.uz/services/pay
```

## Fayllar

### Backend
| Fayl | Maqsad |
|------|--------|
| `click.service.ts` | PREPARE va COMPLETE so'rovlarini qayta ishlaydi |
| `click.routes.ts` | Express route: `POST /api/payment/click` |
| `api.ts` | Click API bilan to'g'ridan-to'g'ri so'rovlar |
| `dto/click-request.dto.ts` | Kelgan so'rov ma'lumotlari tipi |
| `constants/status-codes.ts` | Click xato kodlari |
| `constants/transaction-actions.ts` | action: 0 (prepare), 1 (complete) |
| `interfaces/generate-prepare-hash.interface.ts` | MD5 imzo parametrlari tipi |

### Frontend
| Fayl | Maqsad |
|------|--------|
| `frontend/PaymentButton.tsx` | "Click orqali to'lash" tugmasi |

## Backend — Express route qo'shish

```ts
import { ClickService } from "./click.service";
import { Router } from "express";

const router = Router();
const clickService = new ClickService();

router.post("/api/payment/click", async (req, res) => {
  const result = await clickService.handleMerchantTransactions(req.body);
  res.json(result);
});
```

## Frontend — tugmani ishlatish

```tsx
import PaymentButton from "./frontend/PaymentButton";

const CheckoutPage = () => {
  return (
    <PaymentButton
      amount={50000}          // Summa (so'm)
      orderId="plan_abc"      // merchant_trans_id — plans.id
      returnUrl="https://your-app.com/payment/success"
    >
      Click orqali to'lash
    </PaymentButton>
  );
};
```

> **Eslatma:** `CLICK_MERCHANT_ID` merchant kabinetidagi **Merchant ID** ga mos keladi. Click sahifasida `service_id` ham talab qilinadi — agar ular farqli bo'lsa, `.env` ga `CLICK_SERVICE_ID` qo'shing va `PaymentButton.tsx` da `service_id: env.CLICK_SERVICE_ID` ga o'zgartiring.

## Imzo tekshiruvi (MD5)

Click xavfsizlik uchun har bir so'rovda MD5 imzo yuboradi. `click.service.ts` buni avtomatik tekshiradi:

```
sign_string = MD5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + amount + action + sign_time)
```

## Muhim: Prisma modellari

`click.service.ts` quyidagi Prisma modellarni talab qiladi:
- `transactions` — tranzaksiyalar jadvali
- `users` — foydalanuvchilar jadvali
- `plans` — tariflar/rejalar jadvali
