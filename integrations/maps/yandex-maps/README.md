# Yandex Maps Integration

Yandex Maps JavaScript API yordamida xaritani React komponentida ko'rsatish.

> O'zbekistonda Google Maps bilan bir qatorda keng qo'llaniladigan xarita xizmati.

## Setup

1. [Yandex Developer Cabinet](https://developer.tech.yandex.ru) ga kiring.
2. **APIs** → **Maps JavaScript API** ni yoqing va API kalitini oling.
3. `.env` fayliga qo'shing:

```env
YANDEX_MAPS_API_KEY=your_yandex_maps_api_key
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useMap.ts` | Yandex Maps skriptini yuklaydi va xaritani ishga tushiradi |
| `MapComponent.tsx` | Tayyor xarita komponenti |
| `types.ts` | `Coordinates` va boshqa tiplar |

## Ishlatish

### Tayyor komponent

```tsx
import { YandexMapComponent } from "./MapComponent";

const MyPage = () => {
  return (
    <YandexMapComponent
      center={[41.2995, 69.2401]} // [lat, lng] — Toshkent
      zoom={12}
    />
  );
};
```

### Hook yordamida

```tsx
import { useRef } from "react";
import { useMap } from "./useMap";

const CustomMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useMap(mapRef, [41.2995, 69.2401], 12);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};
```

## Google Maps bilan farqi

| Xususiyat | Google Maps | Yandex Maps |
|-----------|-------------|-------------|
| O'zbekiston ma'lumotlari | Cheklangan | To'liqroq |
| Koordinata formati | `{ lat, lng }` | `[lat, lng]` |
| Skript init | `onload` | `ymaps.ready()` |
