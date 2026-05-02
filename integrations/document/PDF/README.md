# PDF Generator

Brauzerda HTML dan yoki jadval ma'lumotlaridan PDF fayl yaratish.

## O'rnatish

```bash
npm install jspdf html2canvas
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `usePDFGenerator.ts` | HTML element yoki jadvaldan PDF yaratish hook |

## 1. HTML elementdan PDF

```tsx
import { useRef } from "react";
import { usePDFGenerator } from "./usePDFGenerator";

const Invoice = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { generateFromElement, isGenerating, error } = usePDFGenerator();

  const handleDownload = () => {
    if (!invoiceRef.current) return;
    generateFromElement(invoiceRef.current, {
      filename: "hisob-faktura.pdf",
    });
  };

  return (
    <div>
      {/* Bu div PDF ga aylanadi */}
      <div ref={invoiceRef} style={{ padding: 24, background: "white" }}>
        <h1>Hisob-faktura #001</h1>
        <p>Sana: 2024-01-01</p>
        <table>
          <tr><th>Mahsulot</th><th>Narx</th></tr>
          <tr><td>Telefon</td><td>500,000 UZS</td></tr>
        </table>
        <p><b>Jami: 500,000 UZS</b></p>
      </div>

      <button onClick={handleDownload} disabled={isGenerating}>
        {isGenerating ? "Yaratilmoqda..." : "PDF yuklab olish"}
      </button>
      {error && <p style={{ color: "red" }}>Xato: {error.message}</p>}
    </div>
  );
};
```

## 2. Jadval ma'lumotlaridan PDF

```tsx
import { usePDFGenerator } from "./usePDFGenerator";

const SalesReport = () => {
  const { generateFromData, isGenerating } = usePDFGenerator();

  const handleExport = () => {
    generateFromData(
      {
        title: "Sotuv hisoboti",
        subtitle: "2024-yil yanvar oyi",
        columns: ["Mahsulot", "Miqdor", "Narx", "Jami"],
        rows: [
          { Mahsulot: "Telefon", Miqdor: 5, Narx: "500,000", Jami: "2,500,000" },
          { Mahsulot: "Noutbuk", Miqdor: 2, Narx: "3,000,000", Jami: "6,000,000" },
        ],
      },
      { filename: "sotuv-hisoboti.pdf" }
    );
  };

  return (
    <button onClick={handleExport} disabled={isGenerating}>
      {isGenerating ? "Eksport qilinmoqda..." : "PDF eksport"}
    </button>
  );
};
```

## Hook qaytaradigan qiymatlar

| Qiymat | Turi | Tavsif |
|--------|------|--------|
| `generateFromElement` | `(el, opts?) => Promise<void>` | HTML elementdan PDF yaratadi |
| `generateFromData` | `(data, opts?) => Promise<void>` | Jadvaldan PDF yaratadi |
| `isGenerating` | `boolean` | PDF yaratilmoqda |
| `error` | `Error \| null` | Xato |

## PDFOptions parametrlari

| Parametr | Standart | Tavsif |
|----------|---------|--------|
| `filename` | `"document.pdf"` | Yuklab olinuvchi fayl nomi |
| `margin` | `10` | Sahifa chekkasi (mm) |
| `imageQuality` | `0.98` | Rasm sifati (0-1) |

## Muhim eslatmalar

- `generateFromElement` ekranda ko'rinadigan elementni oladi — uni `display: none` qilmang.
- Ko'p sahifali hujjatlar avtomatik bo'linadi.
- `html2canvas` chet el rasmlarini (`CORS`) yuklay olmaydi — `useCORS: true` yordamida harakat qilinadi.
