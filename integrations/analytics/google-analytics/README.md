# Google Analytics 4 (GA4)

Sayt trafikini va foydalanuvchi harakatlarini kuzatish.

## Setup

1. [analytics.google.com](https://analytics.google.com) → **Admin** → **Create property**.
2. **Data streams** → **Web** → saytingiz URL ni kiriting.
3. **Measurement ID** ni oling (G-XXXXXXXXXX).
4. `.env` fayliga qo'shing:

```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useAnalytics.ts` | GA4 event va pageview yuborish hook |

## Ishlatish

```tsx
import { useAnalytics } from "./useAnalytics";

const ProductPage = () => {
  const { trackEvent, trackPageView } = useAnalytics();

  useEffect(() => {
    // Sahifa ko'rilganini qayd etish
    trackPageView("/products/123", "Mahsulot sahifasi");
  }, []);

  const handleBuyClick = () => {
    // Tugma bosilganini qayd etish
    trackEvent("add_to_cart", {
      item_id: "123",
      item_name: "Mahsulot nomi",
      value: 49.99,
      currency: "USD",
    });
  };

  return <button onClick={handleBuyClick}>Sotib olish</button>;
};
```

## Standart GA4 eventlar

```ts
// Sahifa ko'rish
trackPageView("/about");

// Qidirish
trackEvent("search", { search_term: "telefon" });

// Login
trackEvent("login", { method: "email" });

// Ro'yxatdan o'tish
trackEvent("sign_up", { method: "google" });

// Xarid
trackEvent("purchase", {
  transaction_id: "order_123",
  value: 99.99,
  currency: "USD",
  items: [{ item_id: "p1", item_name: "Telefon", price: 99.99 }],
});
```

## React Router bilan

```tsx
import { useLocation } from "react-router-dom";

const AnalyticsTracker = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

// App.tsx da
const App = () => (
  <Router>
    <AnalyticsTracker />
    {/* ... */}
  </Router>
);
```

## Muhim eslatmalar

- `GOOGLE_ANALYTICS_ID` frontend da ishlatiladi — oshkor bo'lishi xavfsiz.
- Development muhitida GA4 ni o'chirish uchun `NODE_ENV === "production"` ni tekshiring.
- Real vaqtda ma'lumotlarni GA4 → **Reports** → **Realtime** da koring.
