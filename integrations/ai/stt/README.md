# Speech-to-Text (STT)

Brauzerning Web Speech API yordamida ovozni matnga aylantirish.

> Tashqi API kerak emas — brauzerning o'zi ovozni taniydi. Chrome va Edge da ishlaydi, Firefox da cheklangan qo'llab-quvvatlash.

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useSpeechRecognition.ts` | Ovozni tinglash va matn qaytarish hook |

## Ishlatish

```tsx
import { useSpeechRecognition } from "./useSpeechRecognition";

const VoiceInput = () => {
  // lang parametri ixtiyoriy — standart "en-US"
  const { isListening, transcript, error, startListening, stopListening } = useSpeechRecognition({ lang: "uz-UZ" });

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? "To'xtatish" : "Gapirishni boshlash"}
      </button>

      {isListening && <p>Tinglanyapti...</p>}
      {transcript && <p>Matn: {transcript}</p>}
      {error && <p>Xato: {error}</p>}
    </div>
  );
};
```

## Hook qaytaradigan qiymatlar

| Qiymat | Turi | Tavsif |
|--------|------|--------|
| `isListening` | `boolean` | Mikrofondan yozib olinayapti |
| `transcript` | `string` | Tanilgan matn |
| `error` | `string \| null` | Xato (masalan, ruxsat berilmagan) |
| `startListening` | `() => void` | Tinglashni boshlaydi |
| `stopListening` | `() => void` | Tinglashni to'xtatadi |

## Tilni o'zgartirish

```tsx
// O'zbek tili
const stt = useSpeechRecognition({ lang: "uz-UZ" });

// Rus tili
const stt = useSpeechRecognition({ lang: "ru-RU" });

// Ingliz tili (standart — parametrsiz ham ishlaydi)
const stt = useSpeechRecognition();
```

## Brauzer qo'llab-quvvatlashi

| Brauzer | Holat |
|---------|-------|
| Chrome | To'liq |
| Edge | To'liq |
| Safari | Qisman |
| Firefox | Yo'q |
