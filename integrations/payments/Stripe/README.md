# Stripe To'lov Tizimi

Stripe orqali karta to'lovlarini qabul qilish.

## Setup

1. [stripe.com](https://stripe.com) da hisob oching.
2. Dashboard → **Developers** → **API keys** dan kalitlar oling.
3. `.env` fayliga qo'shing:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## O'rnatish

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
# Backend
npm install stripe
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `frontend/StripeWrapper.tsx` | Stripe karta to'lov komponenti |

## Frontend — ishlatish

```tsx
import StripeWrapper from "./frontend/StripeWrapper";

const PaymentPage = () => {
  return (
    <StripeWrapper
      amount={5000} // sent (dollar emas!) — 5000 = $50.00
      currency="usd"
      onSuccess={(paymentIntentId) => {
        console.log("To'lov muvaffaqiyatli:", paymentIntentId);
      }}
      onError={(error) => {
        console.error("To'lov xatosi:", error);
      }}
    />
  );
};
```

## Backend — PaymentIntent yaratish (Node.js)

```ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post("/api/payment/stripe/create-intent", async (req, res) => {
  const { amount, currency } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,   // sent (5000 = $50.00)
    currency, // "usd", "eur" va boshqalar
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});
```

## Webhook — to'lov tasdiqlash (ixtiyoriy)

```ts
app.post("/api/payment/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"]!;
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      console.log("To'lov tasdiqlandi:", pi.id);
      // DB ni yangilang
    }

    res.json({ received: true });
  }
);
```

## Test kartalar

| Karta | Raqam |
|-------|-------|
| Muvaffaqiyatli | `4242 4242 4242 4242` |
| 3D Secure | `4000 0025 0000 3155` |
| Rad etilgan | `4000 0000 0000 9995` |

Muddati: istalgan kelajakdagi sana. CVC: istalgan 3 raqam.

## Muhim eslatmalar

- `STRIPE_PUBLISHABLE_KEY` frontend da ishlatiladi — oshkor bo'lishi xavfsiz.
- `STRIPE_SECRET_KEY` faqat backend da, hech qachon frontendda ishlatmang.
- `amount` sent da (dollar emas): $10.00 = 1000.
