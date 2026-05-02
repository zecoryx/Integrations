# QR Code Scanner

Kamera orqali QR kodlarni skanerlash.

## O'rnatish

```bash
npm install jsqr
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useQRScanner.ts` | Kameradan QR kod o'qish hook |

## Ishlatish

```tsx
import { useQRScanner } from "./useQRScanner";

const QRScannerPage = () => {
  const { videoRef, canvasRef, isScanning, startScanning, stopScanning, error } =
    useQRScanner({
      onScan: (result) => {
        console.log("QR natija:", result);
        stopScanning(); // Bir marta skanerlash uchun to'xtatish
      },
      onError: (err) => console.error("Xato:", err),
    });

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }} />
      {/* canvas ko'rinmaydi — faqat QR analiz uchun */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!isScanning ? (
        <button onClick={startScanning}>Skanerlashni boshlash</button>
      ) : (
        <button onClick={stopScanning}>To'xtatish</button>
      )}

      {error && <p style={{ color: "red" }}>Xato: {error}</p>}
    </div>
  );
};
```

## Hook qaytaradigan qiymatlar

| Qiymat | Turi | Tavsif |
|--------|------|--------|
| `videoRef` | `RefObject` | Video elementga ref — `<video ref={videoRef}>` |
| `canvasRef` | `RefObject` | Canvas elementga ref — `<canvas ref={canvasRef}>` |
| `isScanning` | `boolean` | Skanerlash jarayonida |
| `startScanning` | `() => Promise<void>` | Kamerani yoqib skanerlashni boshlaydi |
| `stopScanning` | `() => void` | Skanerlashni to'xtatadi |
| `error` | `string \| null` | Xato xabari |

## Muhim eslatmalar

- `<video>` va `<canvas>` elementlari komponentda bo'lishi kerak.
- `canvas` ni `display: none` qiling — foydalanuvchi ko'rmasin.
- Mobil qurilmalarda `facingMode: "environment"` orqa kamerani ishlatadi.
- Bir QR kodni bir marta skanerlash uchun `onScan` da `stopScanning()` chaqiring.
- HTTPS talab qilinadi (localhost bundan mustasno).
