# Yandex Metrika

Yandex Metrika orqali sayt trafigi va maqsadlarga erishishni kuzatish.

## Setup

1. [metrika.yandex.com](https://metrika.yandex.com) → **Yangi schyotchik qo'shish**.
2. Sayt URL ni va nomni kiriting.
3. **Schyotchik ID** ni oling (8 xonali raqam).
4. `.env` fayliga qo'shing:

```env
YANDEX_METRIKA_ID=12345678
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useMetrika.ts` | Yandex Metrika maqsadlar va sahifalar kuzatish hook |

## Ishlatish

```tsx
import { useMetrika } from "./useMetrika";

const OrderPage = () => {
  const { reachGoal, trackPageView } = useMetrika();

  useEffect(() => {
    trackPageView("/order");
  }, []);

  const handleOrder = () => {
    reachGoal("order_submitted", { amount: 99000 });
    // buyurtma yuborish...
  };

  return <button onClick={handleOrder}>Buyurtma berish</button>;
};
```

## Maqsad (Goal) nomlari

Maqsad nomlarini Metrika da avval sozlang:
- **Metrika** → **Maqsadlar** → **Yangi maqsad** → **JavaScript event**
- Maqsad identifikatorini `reachGoal` ga bering

```ts
// Ro'yxatdan o'tish
reachGoal("registration");

// Buyurtma
reachGoal("purchase", { revenue: 99000, currency: "UZS" });

// Telefon raqamni bosish
reachGoal("phone_click");

// Forma yuborish
reachGoal("form_submit");
```

## React Router bilan

```tsx
import { useLocation } from "react-router-dom";

const MetrikaTracker = () => {
  const location = useLocation();
  const { trackPageView } = useMetrika();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
};
```

## Muhim eslatmalar

- `YANDEX_METRIKA_ID` frontend da ishlatiladi — oshkor bo'lishi xavfsiz.
- Webvisor yoqilgan — foydalanuvchi harakatlarini video ko'rinishida kuzatish mumkin.
- Maqsadlar Metrika panelidagi **Maqsadlar** bo'limida sozlanadi.
