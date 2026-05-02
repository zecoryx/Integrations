# Paynet Integration

Paynet to'lov tizimi bilan frontend va backend integratsiyasi.

## Arxitektura

```
Frontend (usePaynet, PaymentButton)
    ↓
Sizning backendingiz (/api/payment/paynet/*)
    ↓
Paynet API (credentials faqat backendda)
```

> **Muhim:** Paynet username va password faqat backendda saqlanadi. Frontend sizning backendingizga oddiy so'rov yuboradi.

## Setup

1. Paynet merchant kabinetidan `Merchant ID`, `Username`, `Password`, va `API URL` oling.
2. `.env` fayliga qo'shing:

```env
PAYNET_MERCHANT_ID=your_merchant_id
PAYNET_USERNAME=your_username
PAYNET_PASSWORD=your_password
PAYNET_API_URL=https://api.paynet.uz  # Paynet API URL
```

## Fayllar

### Frontend
| Fayl | Maqsad |
|------|--------|
| `frontend/api.ts` | Backendga so'rov yuboruvchi API client |
| `frontend/usePaynet.ts` | To'lov hook'i |
| `frontend/PaymentButton.tsx` | Tayyor tugma komponenti |

### Backend
| Fayl | Maqsad |
|------|--------|
| `backend/api.ts` | Paynet API bilan bevosita bog'lanish (faqat backend da ishlatiladi) |

## Frontend — ishlatish

### `usePaynet` hook

```tsx
import { usePaynet } from "./frontend/usePaynet";

const MyComponent = () => {
  const { isLoading, error, paymentStatus, initiatePayment, checkPaymentStatus } = usePaynet();

  // To'lovni boshlash:
  await initiatePayment("order-123", 50000); // amount so'mda

  // Holat tekshirish:
  await checkPaymentStatus("order-123");
};
```

### `PaymentButton` komponenti

```tsx
import PaymentButton from "./frontend/PaymentButton";

const CheckoutPage = () => {
  return (
    <PaymentButton transactionId="order-123" amount={50000}>
      Paynet orqali to'lash
    </PaymentButton>
  );
};
```

## Backend — Paynet proxy route qo'shish

Frontend `/api/payment/paynet/perform` va `/api/payment/paynet/check` endpointlarini kutadi. Backendda bu routelarni yarating:

```ts
import { paynetApi } from "./backend/api";
import { Router } from "express";

const router = Router();

router.post("/perform", async (req, res) => {
  const { transactionId, amount } = req.body;
  const result = await paynetApi.performTransaction(transactionId, amount);
  res.json(result);
});

router.post("/check", async (req, res) => {
  const { transactionId } = req.body;
  const result = await paynetApi.checkTransaction(transactionId);
  res.json(result);
});

export default router; // app.use("/api/payment/paynet", router)
```
