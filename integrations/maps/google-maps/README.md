# Google Maps Integration

Google Maps JavaScript API yordamida xaritani React komponentida ko'rsatish.

## Setup

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → **Maps JavaScript API** ni yoqing.
2. **Credentials** bo'limidan API kalitini oling.
3. `.env` fayliga qo'shing:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useMap.ts` | Xarita skriptini yuklaydi va map instansiyasini yaratadi |
| `MapComponent.tsx` | Tayyor xarita komponenti |
| `types.ts` | `Coordinates` va boshqa tiplar |

## Ishlatish

### Tayyor komponent

```tsx
import { GoogleMapComponent } from "./MapComponent";

const MyPage = () => {
  return (
    <GoogleMapComponent
      center={{ lat: 41.2995, lng: 69.2401 }} // Toshkent koordinatalari
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

  useMap(mapRef, { lat: 41.2995, lng: 69.2401 }, 12);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};
```

## Koordinatalar

O'zbekistondagi asosiy shaharlar:

| Shahar | Lat | Lng |
|--------|-----|-----|
| Toshkent | 41.2995 | 69.2401 |
| Samarqand | 39.6547 | 66.9758 |
| Buxoro | 39.7747 | 64.4286 |
| Namangan | 40.9983 | 71.6726 |
